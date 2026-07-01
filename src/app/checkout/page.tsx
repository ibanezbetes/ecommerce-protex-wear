'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import { useToast } from '@/components/Feedback/ToastProvider';
import { PaymentMethodSelector, PaymentMethod } from '@/components/checkout/PaymentMethodSelector';
import { MapPin, Truck, CreditCard, CheckCircle, ShieldCheck, ShoppingCart, ArrowLeft, Lock, Package } from 'lucide-react';
import { userOperations } from '@/services/graphqlClient';

export interface Address {
  id?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  cif?: string;
  email?: string;
}

export const SHIPPING_THRESHOLD = 100;
export const SHIPPING_COST_FIXED = 9;

const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ms = date.getMilliseconds().toString().padStart(3, '0').slice(0, 2);
  return `F-${year}${month}${day}-${hours}${minutes}${seconds}${ms}`;
};

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
  const { items, subtotal, clearCart } = useCart();
  const toast = useToast();
  
  const [canPayLater, setCanPayLater] = useState<boolean>((user as any)?.can_pay_later || false);

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber] = useState(() => generateOrderNumber());
  const [error, setError] = useState<string | null>(null);

  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>({
    firstName: (user as any)?.firstName || user?.name?.split(' ')[0] || '',
    lastName: (user as any)?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
    company: (user as any)?.company || '',
    cif: (user as any)?.cif || '',
    email: user?.email || '',
    country: 'ES',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
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
        message: 'Los datos se rellenaron automáticamente.',
      });
    }
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  const discountedSubtotal = Math.max(0, subtotal);
  const tax = discountedSubtotal * 0.21;
  const subtotalWithTax = discountedSubtotal + tax;
  const shippingCost = subtotalWithTax >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST_FIXED;
  const total = subtotalWithTax + shippingCost;

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push('/');
    }
  }, [items, router, orderPlaced]);

  useEffect(() => {
    if (user) {
      userOperations.getUserProfile().then(profile => {
        if (profile) {
          if (profile.can_pay_later !== undefined) {
            setCanPayLater(Boolean(profile.can_pay_later));
          }
          
          setShippingAddress(prev => {
            const hasExistingData = prev.street || prev.city || prev.postalCode;
            if (hasExistingData) return prev; // No sobreescribir si ya escribió algo
            
            const pAddr = profile.shippingAddress || {};
            let fName = prev.firstName;
            let lName = prev.lastName;
            
            if (profile.name) {
              const parts = profile.name.split(' ');
              fName = parts[0] || '';
              lName = parts.slice(1).join(' ') || '';
            }

            return {
              ...prev,
              firstName: fName,
              lastName: lName,
              street: pAddr.street || prev.street || '',
              city: pAddr.city || prev.city || '',
              postalCode: pAddr.postalCode || prev.postalCode || '',
              country: pAddr.country || prev.country || 'ES',
              cif: profile.cif || prev.cif || '',
            };
          });
        }
      }).catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey) return;

    const inputElement = document.getElementById('street-input') as HTMLInputElement;
    if (!inputElement) return;

    let autocomplete: any = null;

    const initAutocomplete = () => {
      try {
        const googleObj = (window as any).google;
        if (!googleObj || !googleObj.maps || !googleObj.maps.places) return;

        autocomplete = new googleObj.maps.places.Autocomplete(inputElement, {
          types: ['address'],
          componentRestrictions: { country: ['es'] },
        });

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
            if (types.includes('route')) streetName = component.long_name;
            else if (types.includes('street_number')) streetNumber = component.long_name;
            else if (types.includes('locality')) city = component.long_name;
            else if (types.includes('postal_code')) postalCode = component.long_name;
            else if (types.includes('country')) country = component.short_name;
          }

          const fullStreet = streetNumber ? `${streetName}, ${streetNumber}` : streetName;

          setShippingAddress(prev => ({
            ...prev,
            street: fullStreet || place.formatted_address || '',
            city: city || prev.city || '',
            postalCode: postalCode || prev.postalCode || '',
            country: country || prev.country || 'ES',
          }));

          toast.success({ title: 'Dirección Completada', message: 'Los datos se rellenaron desde Google Maps.' });
        });
      } catch (err) {}
    };

    const alreadyLoaded = !!(window as any).google;
    const alreadyInjected = !!document.querySelector('script[src*="maps.googleapis.com"]');
    if (!alreadyLoaded && !alreadyInjected) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
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
        toast.error({ title: 'Error', message: 'Por favor completa todos los campos obligatorios.' });
        return false;
      }
    }
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
      const res = await fetch('/api/send-order-email', {
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
            cif: shippingAddress.cif || '',
          },
          shippingMethod: 'agencia_externa',
        }),
      });
      const data = await res.json();
      if (!res.ok || (data && !data.sent && !data.skipped)) {
        console.error('Error enviando email:', data.error);
        toast.error({ title: 'Error de email', message: 'El pedido se ha completado, pero no pudimos enviar el email de confirmación. (SES Sandbox o email no válido)' });
      }
    } catch (e) {
      console.error('Network error enviando email:', e);
    }
  };

  const handleSubmitOrder = async () => {
    if (!acceptedTerms) {
      toast.error({ title: 'Error', message: 'Debes aceptar los términos y condiciones.' });
      return;
    }

    setIsProcessing(true);
    setError(null);

    const orderItems = items.map(item => ({
      productId: item.productId,
      variantId: item.variantId || item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.price,
      name: item.name,
      image: item.image,
    }));

    const orderInput = {
      type: paymentMethod === 'card' ? 'STANDARD' : 'DEFERRED',
      items: orderItems,
      totalAmount: total,
      customerEmail: shippingAddress.email || user?.email || '',
      customerName: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
      paymentMethod: paymentMethod === 'card' ? 'STRIPE' : paymentMethod === 'bizum' ? 'BIZUM' : paymentMethod === 'bank_transfer' ? 'TRANSFER' : 'INVOICE',
      shippingAddress: {
        name: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
        street: shippingAddress.street,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        cif: shippingAddress.cif || ''
      },
      billingAddress: {
        name: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
        street: shippingAddress.street,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        cif: shippingAddress.cif || ''
      }
    };

    // Auto-guardar los datos en el perfil si el usuario está logueado
    if (user) {
      try {
        userOperations.updateUserProfile({
          name: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
          shippingAddress: orderInput.shippingAddress,
          billingAddress: orderInput.billingAddress
        }).catch(err => console.error('Error auto-guardando perfil:', err));
      } catch (e) {
        console.error('Error auto-guardando perfil:', e);
      }
    }

    let actualOrderId = orderNumber;

    try {
      const graphqlClient = await import('@/services/graphqlClient');
      const result = await graphqlClient.graphqlFetch<{ createOrder: { orderId: string; status: string } }>(
        CREATE_ORDER_MUTATION,
        { input: orderInput }
      );
      if (result?.createOrder?.orderId) {
        actualOrderId = result.createOrder.orderId;
      }
    } catch (err: any) {
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

    if (paymentMethod === 'card' || paymentMethod === 'bizum') {
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
            tax,
            total,
            customerEmail: shippingAddress.email || user?.email,
            customerCif: shippingAddress.cif,
            orderNumber: actualOrderId,
            paymentMethod: paymentMethod,
            shippingAddress: {
              firstName: shippingAddress.firstName || '',
              lastName: shippingAddress.lastName || '',
              street: shippingAddress.street || '',
              city: shippingAddress.city || '',
              postalCode: shippingAddress.postalCode || '',
              country: shippingAddress.country || 'ES',
            },
          }),
        });
        const data = await res.json();
        if (res.ok && data.url) {
          window.location.href = data.url;
          return; 
        } else {
          throw new Error(data.error || 'Error al iniciar el pago.');
        }
      } catch (err: any) {
        const errorMessage = err.message || 'No se pudo conectar con la pasarela de pago.';
        setError(errorMessage);
        toast.error({
          title: 'Error en el pago',
          message: `${errorMessage} Por favor, inténtalo de nuevo o prueba con otro método de pago.`,
        });
        setIsProcessing(false);
      }
    } else {
      try {
        await sendOrderEmail(actualOrderId);
        const fallbackOrders = JSON.parse(sessionStorage.getItem('protex_orders') || '[]');
        const updatedOrders = fallbackOrders.map((o: any) =>
          o.orderId === actualOrderId ? { ...o, status: 'CONFIRMADO_PENDIENTE_TRANSFERENCIA' } : o
        );
        sessionStorage.setItem('protex_orders', JSON.stringify(updatedOrders));

        setOrderPlaced(true);
        clearCart();
        router.push(`/checkout/success?order=${actualOrderId}&method=${paymentMethod}`);
      } catch (err: any) {
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
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left Column - Forms */}
        <div className="flex-1 w-full lg:w-2/3">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Finalizar Compra</h1>
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mt-1">
                  <Lock className="w-4 h-4 text-emerald-500" /> Pago 100% Seguro Encriptado
                </p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-100 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
          </div>

          {/* Stepper */}
          <div className="relative mb-12">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0" />
            <div className="relative z-10 flex justify-between">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isActive = currentStep === step.number;
                return (
                  <div key={step.number} className="flex flex-col items-center gap-3 bg-gray-50/50 px-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-4 ring-indigo-100 scale-110' : 
                      isCompleted ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-400 border-2 border-gray-200'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-sm font-bold tracking-wide ${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
            {error && (
              <div className="m-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-800 font-medium flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-red-500" />
                {error}
              </div>
            )}

            {/* ── STEP 1: Dirección */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Dirección de Envío</h2>
                </div>
                <div className="p-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Nombre *</label>
                        <input type="text" autoComplete="given-name" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all" value={shippingAddress.firstName || ''} onChange={e => handleAddressChange('firstName', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Apellidos *</label>
                        <input type="text" autoComplete="family-name" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all" value={shippingAddress.lastName || ''} onChange={e => handleAddressChange('lastName', e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Correo electrónico *</label>
                      <input type="email" autoComplete="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all" value={shippingAddress.email || ''} onChange={e => handleAddressChange('email', e.target.value)} placeholder="tu@email.com" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Empresa (opcional)</label>
                        <input type="text" autoComplete="organization" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all" value={shippingAddress.company || ''} onChange={e => handleAddressChange('company', e.target.value)} placeholder="Protex S.L." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">NIF/CIF/DNI (Factura B2B)</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all" value={shippingAddress.cif || ''} onChange={e => handleAddressChange('cif', e.target.value)} placeholder="B12345678" />
                      </div>
                    </div>
                    <div className="space-y-2 relative">
                      <label className="text-sm font-bold text-gray-700">Dirección *</label>
                      <input
                        type="text"
                        id="street-input"
                        autoComplete="street-address"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                        value={shippingAddress.street || ''}
                        onChange={e => {
                          const val = e.target.value;
                          handleAddressChange('street', val);
                          if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                          if (!googlePlacesActiveRef.current && val.trim().length >= 2) {
                            searchTimeoutRef.current = setTimeout(async () => {
                              try {
                                const resPhoton = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&lang=es&limit=8`);
                                if (resPhoton.ok) {
                                  const data = await resPhoton.json();
                                  const fallback: string[] = (data?.features || []).map((f: any) => {
                                    const p = f.properties || {};
                                    if (p.countrycode && p.countrycode !== 'ES') return null;
                                    const street = p.street || p.name || '';
                                    const city   = p.city || p.town || '';
                                    if (!street && !city) return null;
                                    return `${street}${city ? `, ${city}` : ''}, España`;
                                  }).filter(Boolean) as string[];
                                  const unique = [...new Set(fallback)];
                                  if (unique.length > 0) {
                                    setAddressSuggestions(unique);
                                    setShowSuggestions(true);
                                    return;
                                  }
                                }
                              } catch (err) {}
                              setShowSuggestions(false);
                            }, 400);
                          }
                        }}
                        placeholder="Calle, número, piso..."
                        required
                      />
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                          {addressSuggestions.map((suggestion, index) => (
                            <li
                              key={index}
                              className="px-4 py-3 hover:bg-indigo-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0 text-sm text-gray-700 font-medium"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion(suggestion);
                              }}
                            >
                              <MapPin className="w-4 h-4 text-indigo-400" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Ciudad *</label>
                        <input type="text" autoComplete="address-level2" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all" value={shippingAddress.city || ''} onChange={e => handleAddressChange('city', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Código Postal *</label>
                        <input type="text" autoComplete="postal-code" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all" value={shippingAddress.postalCode || ''} onChange={e => handleAddressChange('postalCode', e.target.value)} required />
                      </div>
                    </div>
                  </form>
                  <div className="mt-10 flex justify-end">
                    <button onClick={nextStep} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30 group">
                      Continuar a Pago <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Pago */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Método de Pago</h2>
                </div>
                <div className="p-8">
                  <PaymentMethodSelector
                    selected={paymentMethod}
                    onChange={(m) => setPaymentMethod(m as PaymentMethod)}
                    canPayLater={canPayLater}
                  />

                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-sm text-amber-800 font-medium leading-relaxed">
                        Al confirmar, serás redirigido a nuestra pasarela segura de Stripe donde se te proporcionarán las instrucciones (IBAN, concepto) para realizar la transferencia bancaria. Tu pedido se procesará automáticamente en cuanto recibamos el pago.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'invoice' && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="text-sm text-blue-800 font-medium leading-relaxed">
                        Se procesará tu pedido de forma inmediata y recibirás la factura en tu correo electrónico con las instrucciones para su abono a 30 días.
                      </p>
                    </div>
                  )}

                  <div className="mt-10 flex items-center justify-between">
                    <button onClick={prevStep} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
                      Atrás
                    </button>
                    <button onClick={nextStep} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30 group">
                      Revisar Pedido <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Confirmar */}
            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Confirmar Pedido</h2>
                </div>
                <div className="p-8">
                  <div className="bg-gray-50 p-6 rounded-2xl mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border border-gray-100">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Enviar a</h4>
                      <p className="font-bold text-gray-900">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                      <p className="text-sm text-gray-600 mt-1">{shippingAddress.street}</p>
                      <p className="text-sm text-gray-600">{shippingAddress.postalCode} {shippingAddress.city}, {shippingAddress.country}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Método de Pago</h4>
                      <p className="font-bold text-gray-900">
                        {paymentMethod === 'card' && 'Tarjeta de Crédito / Débito'}
                        {paymentMethod === 'bizum' && 'Pago por Bizum'}
                        {paymentMethod === 'bank_transfer' && 'Transferencia Bancaria'}
                        {paymentMethod === 'invoice' && 'Pago a 30 días (Factura)'}
                      </p>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-4 mb-2">Envío</h4>
                      <p className="font-bold text-gray-900">Agencia externa</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-10 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={e => setAcceptedTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-600 cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer leading-relaxed font-medium">
                      He leído y acepto los <a href="/terminos-y-condiciones" target="_blank" className="text-indigo-600 font-bold hover:underline">términos y condiciones</a> y la <a href="/politica-de-privacidad" target="_blank" className="text-indigo-600 font-bold hover:underline">política de privacidad</a>. Entiendo que esta compra implica una obligación de pago.
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <button onClick={prevStep} disabled={isProcessing} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50">
                      Atrás
                    </button>
                    <button
                      onClick={handleSubmitOrder}
                      disabled={isProcessing || !acceptedTerms}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {isProcessing ? 'Procesando segura...' : `Pagar ${total.toFixed(2)}€`}
                      {!isProcessing && <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Order Summary Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 sticky top-24 overflow-hidden">
            <div className="bg-gray-900 text-white px-6 py-4 font-bold text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-400" /> Resumen del Pedido
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {items.map(item => (
                <div key={item.variantId || item.productId} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                      <ShoppingCart className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</p>
                    <p className="text-xs font-semibold text-gray-500 mt-1">Cant: {item.quantity} × {item.price.toFixed(2)}€</p>
                  </div>
                  <div className="font-extrabold text-indigo-600">
                    {(item.price * item.quantity).toFixed(2)}€
                  </div>
                </div>
              ))}
            </div>

            {/* Free shipping progress banner */}
            <div className={`px-6 py-4 border-y ${shippingCost === 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
              {shippingCost === 0 ? (
                <div className="flex items-center gap-2 text-sm text-emerald-700 font-bold">
                  <Truck className="w-5 h-5" /> ¡Envío gratuito aplicado!
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-amber-800 font-bold flex items-center gap-1">
                      <Truck className="w-4 h-4" /> Envío gratis desde {SHIPPING_THRESHOLD}€
                    </span>
                    <span className="text-xs text-amber-600 font-bold">
                      Faltan {Math.max(SHIPPING_THRESHOLD - subtotalWithTax, 0).toFixed(2)}€
                    </span>
                  </div>
                  <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full transition-all duration-500" 
                      style={{ width: `${Math.min((subtotalWithTax / SHIPPING_THRESHOLD) * 100, 100)}%` }} 
                    />
                  </div>
                </>
              )}
            </div>

            <div className="p-6 bg-gray-50/50 space-y-3">
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>Subtotal (sin IVA)</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>IVA (21%)</span>
                <span>{tax.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-600">
                <span>Envío (Agencia)</span>
                <span className={shippingCost === 0 ? 'text-emerald-600' : 'text-gray-900'}>
                  {shippingCost === 0 ? 'Gratis' : `${shippingCost.toFixed(2)}€`}
                </span>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-black text-indigo-600">{total.toFixed(2)}€</span>
              </div>
            </div>

            <div className="bg-gray-900 px-6 py-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Pago 100% Seguro Encriptado SSL
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Garantía de devolución 30 días
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
