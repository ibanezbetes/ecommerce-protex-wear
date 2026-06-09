'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import { useToast } from '@/components/Feedback/ToastProvider';
import { PaymentMethodSelector, PaymentMethod } from '@/components/Checkout/PaymentMethodSelector';
import { BankTransferDetails } from '@/components/Checkout/BankTransferDetails';

import { MapPin, Truck, CreditCard, CheckCircle, ShieldCheck, ShoppingCart, ArrowLeft, Lock, Package } from 'lucide-react';
import styles from './page.module.css';

export interface Address {
  id?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
}

export interface ShippingOption {
  method: string;
  carrier: string;
  cost: number;
  estimatedDays: number;
  description: string;
}

/** Umbral (€ sin IVA y sin descuento) a partir del cual el envío es gratuito */
export const SHIPPING_THRESHOLD = 100;
/** Coste de envío fijo cuando no se alcanza el umbral */
export const SHIPPING_COST_FIXED = 9;

const generateOrderNumber = () => 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

const STEPS = [
  { number: 1, title: 'Dirección', icon: MapPin },
  { number: 2, title: 'Pago', icon: CreditCard },
  { number: 3, title: 'Confirmar', icon: CheckCircle },
];

const CREATE_ORDER_MUTATION = `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      orderId
      status
      checkoutUrl
    }
  }
`;


export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart, discountCode, discountAmount } = useCart();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber] = useState(() => generateOrderNumber());
  const [error, setError] = useState<string | null>(null);

  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>({
    firstName: (user as any)?.firstName || user?.name?.split(' ')[0] || '',
    lastName: (user as any)?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
    company: (user as any)?.company || '',
    email: user?.email || '',
    country: 'ES',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Autocomplete manual (fallback cuando Google Places no está activo)
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  // Ref para saber si Google Places ya está activo (evita conflicto con búsqueda manual)
  const googlePlacesActiveRef = React.useRef<boolean>(false);

  const handleSelectSuggestion = (suggestion: string) => {
    const parts = suggestion.split(',').map(p => p.trim());
    if (parts.length >= 4) {
      const streetPart = parts[0] + (parts[1] ? `, ${parts[1]}` : '');
      const cityPart = parts[2];
      const postalCodePart = parts[3];

      setShippingAddress(prev => ({
        ...prev,
        street: streetPart,
        city: cityPart,
        postalCode: postalCodePart,
        country: 'ES',
      }));

      toast.success({
        title: 'Dirección Completada',
        message: 'Los datos se rellenaron automáticamente desde las sugerencias.',
      });
    }
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  // ── Cálculo de envío: tarifa plana ──────────────────────────────────────────
  // 9 € si el subtotal (sin IVA, tras descuento) es < 100 €; gratis si ≥ 100 €
  const discountedSubtotal = Math.max(0, subtotal - (discountAmount || 0));
  const shippingCost = discountedSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST_FIXED;
  const tax = discountedSubtotal * 0.21;
  const total = discountedSubtotal + tax + shippingCost;

  // Protect route
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push('/');
    }
  }, [items, router, orderPlaced]);

  // Google Places Autocomplete Integration with Try-Catch and Graceful Fallback
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn('Google Places API Key no configurada. Degradación elegante activa.');
      return;
    }

    const inputElement = document.getElementById('street-input') as HTMLInputElement;
    if (!inputElement) return;

    let autocomplete: any = null;

    const initAutocomplete = () => {
      try {
        const googleObj = (window as any).google;
        if (!googleObj || !googleObj.maps || !googleObj.maps.places) {
          console.warn('Google Maps API no está disponible en window.');
          return;
        }

        autocomplete = new googleObj.maps.places.Autocomplete(inputElement, {
          types: ['address'],
          componentRestrictions: { country: ['es'] }, // Solo España
        });

        // Marcar Google Places como activo → el fallback manual queda desactivado
        googlePlacesActiveRef.current = true;
        setShowSuggestions(false);
        setAddressSuggestions([]);

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place || !place.address_components) return;

          let streetName = '';
          let streetNumber = '';
          let city = '';
          let postalCode = '';
          let country = 'ES';

          for (const component of place.address_components) {
            const types = component.types;
            if (types.includes('route')) {
              streetName = component.long_name;
            } else if (types.includes('street_number')) {
              streetNumber = component.long_name;
            } else if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('postal_code')) {
              postalCode = component.long_name;
            } else if (types.includes('country')) {
              country = component.short_name;
            }
          }

          const fullStreet = streetNumber ? `${streetName}, ${streetNumber}` : streetName;

          setShippingAddress(prev => ({
            ...prev,
            street: fullStreet || place.formatted_address || '',
            city: city || prev.city || '',
            postalCode: postalCode || prev.postalCode || '',
            country: country || prev.country || 'ES',
          }));

          toast.success({ title: 'Dirección Completada', message: 'Los datos se rellenaron automáticamente desde Google Maps.' });
        });
      } catch (err) {
        console.error('Error inicializando Google Places Autocomplete:', err);
      }
    };

    // Inyectar script solo si no existe ya en el DOM
    const alreadyLoaded = !!(window as any).google;
    const alreadyInjected = !!document.querySelector('script[src*="maps.googleapis.com"]');
    if (!alreadyLoaded && !alreadyInjected) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      script.onerror = () => console.warn('Fallo al cargar script de Google Maps Places.');
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }

    return () => {
      if (autocomplete && (window as any).google) {
        (window as any).google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [currentStep]);

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const required = ['firstName', 'lastName', 'email', 'street', 'city', 'postalCode'];
    for (const field of required) {
      if (!shippingAddress[field as keyof Address]) {
        toast.error({ title: 'Error', message: 'Por favor completa todos los campos obligatorios de la dirección y contacto.' });
        return false;
      }
    }
    // Validar formato de email básico
    if (shippingAddress.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      toast.error({ title: 'Error', message: 'El correo electrónico no es válido.' });
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateAddress()) return;
    setCurrentStep(prev => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendOrderEmail = async (actualOrderId: string) => {
    try {
      await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: actualOrderId,
          customerName: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || 'Cliente',
          customerEmail: shippingAddress.email || user?.email || '',
          items: items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price, image: item.image })),
          subtotal,
          tax,
          shippingCost,
          total,
          paymentMethod,
          shippingAddress: {
            firstName: shippingAddress.firstName || '',
            lastName: shippingAddress.lastName || '',
            street: shippingAddress.street || '',
            city: shippingAddress.city || '',
            postalCode: shippingAddress.postalCode || '',
            country: shippingAddress.country || 'ES',
          },
          shippingMethod: 'agencia_externa',
          discountCode: discountCode || undefined,
          discountAmount: discountAmount || 0,
        }),
      });
    } catch (e) {
      console.warn('No se pudo enviar el email de confirmación:', e);
    }
  };

  const handleSubmitOrder = async () => {
    if (!acceptedTerms) {
      toast.error({ title: 'Error', message: 'Debes aceptar los términos y condiciones.' });
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Prepare AppSync Input format
    const orderItems = items.map(item => ({
      productId: item.productId,
      variantId: item.variantId || item.productId,
      quantity: item.quantity,
    }));

    const orderInput = {
      type: paymentMethod === 'card' ? 'STANDARD' : 'DEFERRED',
      items: orderItems,
    };

    let actualOrderId = orderNumber;

    // A. Mutate Order inside AppSync GraphQL endpoint (PENDIENTE_DE_PAGO state)
    try {
      const graphqlClient = await import('@/services/graphqlClient');
      const result = await graphqlClient.graphqlFetch<{ createOrder: { orderId: string; status: string } }>(
        CREATE_ORDER_MUTATION,
        { input: orderInput }
      );
      if (result?.createOrder?.orderId) {
        actualOrderId = result.createOrder.orderId;
        console.log('Pedido registrado en AppSync con ID:', actualOrderId);
      }
    } catch (err: any) {
      console.warn('Fallo en mutación createOrder de AppSync, procediendo con registro local resiliente:', err);
      // Fallback local robusto para no interrumpir el flujo de ventas
      const fallbackOrders = JSON.parse(sessionStorage.getItem('protex_orders') || '[]');
      fallbackOrders.push({
        orderId: orderNumber,
        status: 'PENDIENTE_DE_PAGO',
        items,
        total,
        paymentMethod,
        shippingAddress,
        createdAt: new Date().toISOString(),
      });
      sessionStorage.setItem('protex_orders', JSON.stringify(fallbackOrders));
    }

    // B. Payment execution
    if (paymentMethod === 'card' || paymentMethod === 'bizum' || paymentMethod === 'bank_transfer') {
      // ── Pago con Stripe Checkout Session ─────────────────────
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map(item => ({
              id: item.variantId || item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
            shippingCost,
            customerEmail: shippingAddress.email || user?.email,
            orderNumber: actualOrderId,
            discountCode: discountCode || undefined,
            paymentMethod: paymentMethod, // Pasar el método de pago a la API
          }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          // Stripe session creada → redirigir a la pasarela de pago
          window.location.href = data.url;
          return; // No resetear isProcessing — la página se descargará
        } else {
          throw new Error(data.error || 'Error al iniciar el pago.');
        }
      } catch (err: any) {
        // ⚠️ ERROR REAL — NO simular confirmación de pago
        console.error('[Checkout] Error al crear sesión de Stripe:', err);
        const errorMessage = err.message || 'No se pudo conectar con la pasarela de pago.';
        setError(errorMessage);
        toast.error({
          title: 'Error en el pago',
          message: `${errorMessage} Por favor, inténtalo de nuevo o prueba con otro método de pago.`,
        });
        setIsProcessing(false);
      }
    } else {
      // ── Pagos Offline (Transferencia Bancaria) ─────────────────
      try {
        await sendOrderEmail(actualOrderId);

        const fallbackOrders = JSON.parse(sessionStorage.getItem('protex_orders') || '[]');
        const updatedOrders = fallbackOrders.map((o: any) =>
          o.orderId === actualOrderId ? { ...o, status: 'CONFIRMADO_PENDIENTE_TRANSFERENCIA' } : o
        );
        sessionStorage.setItem('protex_orders', JSON.stringify(updatedOrders));

        setOrderPlaced(true);
        clearCart();
        router.push(`/checkout/success?order=${actualOrderId}`);
      } catch (err: any) {
        console.error('[Checkout] Error en pago offline:', err);
        setError(err.message || 'Error al procesar el pedido.');
        toast.error({
          title: 'Error',
          message: 'No se pudo procesar el pedido. Por favor, inténtalo de nuevo.',
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (items.length === 0 && !orderPlaced) return null;

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutLayout}>

        {/* Left Column - Forms */}
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#2e559e', padding: '0.5rem', borderRadius: '8px', color: 'white' }}>
                <ShoppingCart size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Finalizar Compra</h1>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Lock size={14} /> Pago 100% Seguro
                </p>
              </div>
            </div>
            <button
              className={styles.btnBack}
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  router.back();
                } else {
                  router.push('/productos');
                }
              }}
              style={{ padding: '0.5rem 1rem' }}
            >
              <ArrowLeft size={16} /> Volver
            </button>
          </div>

          {/* Stepper */}
          <div className={styles.stepsContainer}>
            <div className={styles.stepLine} />
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isActive = currentStep === step.number;

              let circleClass = styles.stepCircle;
              if (isActive) circleClass = `${styles.stepCircle} ${styles.stepCircleActive}`;
              if (isCompleted) circleClass = `${styles.stepCircle} ${styles.stepCircleCompleted}`;

              return (
                <div key={step.number} className={styles.stepItem}>
                  <div className={circleClass}>
                    {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                  </div>
                  <span className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Content Area */}
          <div className={styles.card}>
            {error && (
              <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '1rem', margin: '1.5rem 1.5rem 0', borderRadius: '4px', color: '#991b1b' }}>
                {error}
              </div>
            )}

            {/* ── STEP 1: Dirección ────────────────────────────────────────────── */}
            {currentStep === 1 && (
              <>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}><MapPin size={22} color="#2e559e" /> Dirección de Envío</h2>
                </div>
                <div className={styles.cardBody}>
                  <form className={styles.formGrid}>
                    <div className={styles.formGrid2Cols}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Nombre *</label>
                        <input className={styles.input} type="text" value={shippingAddress.firstName || ''} onChange={e => handleAddressChange('firstName', e.target.value)} required />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Apellidos *</label>
                        <input className={styles.input} type="text" value={shippingAddress.lastName || ''} onChange={e => handleAddressChange('lastName', e.target.value)} required />
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Correo electrónico *</label>
                      <input className={styles.input} type="email" value={shippingAddress.email || ''} onChange={e => handleAddressChange('email', e.target.value)} placeholder="tu@email.com" required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Empresa (opcional)</label>
                      <input className={styles.input} type="text" value={shippingAddress.company || ''} onChange={e => handleAddressChange('company', e.target.value)} placeholder="Protex S.L." />
                    </div>
                    <div className={`${styles.inputGroup} ${styles.inputGroupRelative}`}>
                      <label className={styles.label}>Dirección *</label>
                      <input
                        className={styles.input}
                        type="text"
                        id="street-input"
                        value={shippingAddress.street || ''}
                        onChange={e => {
                          const val = e.target.value;
                          handleAddressChange('street', val);

                          if (searchTimeoutRef.current) {
                            clearTimeout(searchTimeoutRef.current);
                          }

                          // Solo ejecutar búsqueda manual si Google Places NO está activo
                          if (!googlePlacesActiveRef.current && val.trim().length >= 2) {
                            searchTimeoutRef.current = setTimeout(async () => {
                              const controller = new AbortController();
                              const timeoutId = setTimeout(() => controller.abort(), 6000);

                              try {
                                // 1️⃣ CartoCiudad (IGN) — base de datos oficial, todas las calles de España
                                const res = await fetch(
                                  `/api/geocode?q=${encodeURIComponent(val)}`,
                                  { signal: controller.signal }
                                );
                                clearTimeout(timeoutId);

                                if (res.ok) {
                                  const suggestions: string[] = await res.json();
                                  if (suggestions.length > 0) {
                                    setAddressSuggestions(suggestions);
                                    setShowSuggestions(true);
                                    return;
                                  }
                                }

                                // 2️⃣ Fallback: Photon si CartoCiudad no devuelve nada
                                const resPhoton = await fetch(
                                  `https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&lang=es&limit=8`
                                );
                                if (resPhoton.ok) {
                                  const data = await resPhoton.json();
                                  const fallback: string[] = (data?.features || [])
                                    .filter((f: any) => {
                                      const p = f.properties || {};
                                      // Solo calles y portales, excluir negocios/POIs
                                      const key = p.osm_key || '';
                                      const type = p.type || '';
                                      const validKeys = ['highway', 'place', 'addr'];
                                      const validTypes = ['street', 'house', 'locality', 'district'];
                                      return validKeys.includes(key) || validTypes.includes(type);
                                    })
                                    .map((f: any) => {
                                      const p = f.properties || {};
                                      if (p.countrycode && p.countrycode !== 'ES') return null;
                                      const street = p.street || p.name || '';
                                      const city   = p.city || p.town || p.village || p.county || '';
                                      const cp     = p.postcode || '';
                                      if (!street && !city) return null;
                                      let s = street;
                                      if (city) s += `, ${city}`;
                                      if (cp)   s += `, ${cp}`;
                                      return s + ', España';
                                    })
                                    .filter(Boolean) as string[];

                                  const unique = [...new Set(fallback)];
                                  if (unique.length > 0) {
                                    setAddressSuggestions(unique);
                                    setShowSuggestions(true);
                                    return;
                                  }
                                }

                                setAddressSuggestions([]);
                                setShowSuggestions(false);
                              } catch (err: any) {
                                clearTimeout(timeoutId);
                                if (err?.name !== 'AbortError') console.warn('Geocode error:', err);
                                setAddressSuggestions([]);
                                setShowSuggestions(false);
                              }
                            }, 350);
                          } else {
                            setAddressSuggestions([]);
                            setShowSuggestions(false);
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowSuggestions(false), 200);
                        }}
                        onFocus={() => {
                          if (shippingAddress.street && shippingAddress.street.length >= 1) {
                            setShowSuggestions(addressSuggestions.length > 0);
                          }
                        }}
                        placeholder="Calle, número, piso..."
                        required
                      />

                      {showSuggestions && (
                        <ul className={styles.suggestionsDropdown}>
                          {addressSuggestions.map((suggestion, index) => (
                            <li
                              key={index}
                              className={styles.suggestionItem}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion(suggestion);
                              }}
                            >
                              <MapPin className={`h-4 w-4 ${styles.suggestionIcon}`} />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className={styles.formGrid2Cols}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Ciudad *</label>
                        <input className={styles.input} type="text" value={shippingAddress.city || ''} onChange={e => handleAddressChange('city', e.target.value)} required />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Código Postal *</label>
                        <input className={styles.input} type="text" value={shippingAddress.postalCode || ''} onChange={e => handleAddressChange('postalCode', e.target.value)} required />
                      </div>
                    </div>
                    <div className={styles.formGrid2Cols}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>País *</label>
                        <select
                          className={styles.input}
                          value={shippingAddress.country || 'ES'}
                          onChange={e => handleAddressChange('country', e.target.value)}
                        >
                          <option value="ES">España</option>
                          <option value="PT">Portugal</option>
                          <option value="FR">Francia</option>
                          <option value="AD">Andorra</option>
                        </select>
                      </div>
                    </div>
                  </form>
                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className={styles.btnNext} onClick={nextStep}>Continuar a Pago <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} /></button>
                  </div>
                </div>
              </>
            )}


            {/* ── STEP 2: Pago ─────────────────────────────────────────────────── */}
            {currentStep === 2 && (
              <>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}><CreditCard size={22} color="#2e559e" /> Método de Pago</h2>
                </div>
                <div className={styles.cardBody}>
                  <PaymentMethodSelector
                    selected={paymentMethod}
                    onChange={(m) => setPaymentMethod(m as PaymentMethod)}
                  />

                  {paymentMethod === 'bank_transfer' && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <p style={{ margin: 0, color: '#475569', fontSize: '0.9375rem', lineHeight: '1.5' }}>
                        Al confirmar, serás redirigido a nuestra pasarela segura de Stripe donde se te proporcionarán las instrucciones (IBAN, concepto) para realizar la transferencia bancaria. Tu pedido se procesará automáticamente en cuanto recibamos el pago.
                      </p>
                    </div>
                  )}

                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                    <button className={styles.btnBack} onClick={prevStep}>Atrás</button>
                    <button className={styles.btnNext} onClick={nextStep}>Revisar Pedido <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} /></button>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 3: Confirmar ────────────────────────────────────────────── */}
            {currentStep === 3 && (
              <>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}><CheckCircle size={22} color="#2e559e" /> Confirmar Pedido</h2>
                </div>
                <div className={styles.cardBody}>

                  <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 700, marginBottom: '0.5rem' }}>Enviar a</h4>
                      <p style={{ margin: 0, fontWeight: 500, color: '#111827' }}>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                      <p style={{ margin: '0.25rem 0', color: '#4b5563', fontSize: '0.9375rem' }}>{shippingAddress.street}</p>
                      <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9375rem' }}>{shippingAddress.postalCode} {shippingAddress.city}, {shippingAddress.country}</p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 700, marginBottom: '0.5rem' }}>Método de Pago</h4>
                      <p style={{ margin: 0, fontWeight: 500, color: '#111827' }}>
                        {paymentMethod === 'card' && 'Tarjeta de Crédito / Débito'}
                        {paymentMethod === 'bizum' && 'Pago por Bizum'}
                        {paymentMethod === 'bank_transfer' && 'Transferencia Bancaria'}
                      </p>
                      <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 700, marginTop: '1rem', marginBottom: '0.5rem' }}>Envío</h4>
                      <p style={{ margin: 0, fontWeight: 500, color: '#111827' }}>Agencia externa</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '2rem' }}>
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={e => setAcceptedTerms(e.target.checked)}
                      style={{ marginTop: '0.25rem', width: '1.125rem', height: '1.125rem', cursor: 'pointer' }}
                    />
                    <label htmlFor="terms" style={{ fontSize: '0.9375rem', color: '#4b5563', cursor: 'pointer', lineHeight: 1.5 }}>
                      He leído y acepto los <a href="/terminos-y-condiciones" target="_blank" style={{ color: '#2e559e', textDecoration: 'underline' }}>términos y condiciones</a> y la <a href="/politica-de-privacidad" target="_blank" style={{ color: '#2e559e', textDecoration: 'underline' }}>política de privacidad</a>. Entiendo que esta compra implica una obligación de pago.
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className={styles.btnBack} onClick={prevStep} disabled={isProcessing}>Atrás</button>
                    <button
                      className={styles.btnNext}
                      onClick={handleSubmitOrder}
                      disabled={isProcessing || !acceptedTerms}
                      style={{ background: '#10b981', padding: '1rem 2.5rem' }}
                    >
                      {isProcessing ? 'Procesando...' : `Pagar ${total.toFixed(2)}€`}
                      {!isProcessing && <CheckCircle size={18} />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column — Order Summary Sidebar */}
        <div>
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>Resumen del Pedido</div>

            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {items.map(item => (
                <div key={item.variantId || item.productId} className={styles.sidebarItem}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className={styles.sidebarItemImg} />
                  ) : (
                    <div className={styles.sidebarItemImg} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShoppingCart color="#9ca3af" />
                    </div>
                  )}
                  <div className={styles.sidebarItemInfo}>
                    <p className={styles.sidebarItemName}>{item.name}</p>
                    <p className={styles.sidebarItemPrice}>{item.quantity} × {item.price.toFixed(2)}€</p>
                  </div>
                  <div style={{ fontWeight: 600, color: '#111827' }}>
                    {(item.price * item.quantity).toFixed(2)}€
                  </div>
                </div>
              ))}
            </div>

            {/* Free shipping progress banner */}
            <div style={{
              padding: '0.875rem 1.5rem',
              background: shippingCost === 0 ? '#ecfdf5' : '#fffbeb',
              borderBottom: `1px solid ${shippingCost === 0 ? '#d1fae5' : '#fef3c7'}`,
            }}>
              {shippingCost === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#065f46', fontWeight: 600 }}>
                  <Truck size={15} />
                  ¡Envío gratuito aplicado!
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Truck size={13} /> Envío gratis desde {SHIPPING_THRESHOLD}€
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 500 }}>
                      Faltan {Math.max(SHIPPING_THRESHOLD - discountedSubtotal, 0).toFixed(2)}€
                    </span>
                  </div>
                  <div style={{ height: '4px', background: '#fde68a', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min((discountedSubtotal / SHIPPING_THRESHOLD) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                      borderRadius: '2px',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </>
              )}
            </div>

            {/* Shipping method indicator */}
            <div style={{
              padding: '0.75rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              borderBottom: '1px solid #f3f4f6',
              background: '#fafbfc',
            }}>
              <Package size={15} color="#6b7280" />
              <span style={{ fontSize: '0.8125rem', color: '#4b5563', fontWeight: 500 }}>Envío por agencia externa</span>
            </div>

            <div className={styles.sidebarTotals}>
              <div className={styles.sidebarTotalRow}>
                <span>Subtotal (sin IVA)</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>

              {discountCode && (
                <div className={styles.sidebarTotalRow} style={{ color: '#10b981', fontWeight: 500 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Descuento ({discountCode})
                  </span>
                  <span>-{discountAmount?.toFixed(2)}€</span>
                </div>
              )}

              <div className={styles.sidebarTotalRow}>
                <span>IVA (21%)</span>
                <span>{tax.toFixed(2)}€</span>
              </div>

              <div className={styles.sidebarTotalRow}>
                <span>Envío</span>
                <span style={{ color: shippingCost === 0 ? '#10b981' : 'inherit', fontWeight: shippingCost === 0 ? 600 : 400 }}>
                  {shippingCost === 0 ? 'Gratis' : `${shippingCost.toFixed(2)}€`}
                </span>
              </div>

              <div className={styles.sidebarTotalFinal}>
                <span>Total</span>
                <span style={{ color: '#2e559e', fontSize: '1.5rem' }}>{total.toFixed(2)}€</span>
              </div>
            </div>

            <div className={styles.trustBadges}>
              <div className={styles.trustBadgeText}><ShieldCheck size={16} color="#10b981" /> Pago 100% Seguro con SSL</div>
              <div className={styles.trustBadgeText}><Lock size={16} color="#10b981" /> Tus datos están protegidos</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
