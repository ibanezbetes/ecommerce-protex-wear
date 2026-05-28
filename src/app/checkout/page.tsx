'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import { useToast } from '@/components/Feedback/ToastProvider';
import { PaymentMethodSelector } from '@/components/Checkout/PaymentMethodSelector';
import { BankTransferDetails } from '@/components/Checkout/BankTransferDetails';
import { BizumDetails } from '@/components/Checkout/BizumDetails';
import { MapPin, Truck, CreditCard, CheckCircle, ShieldCheck, ShoppingCart, ArrowLeft, X, Lock } from 'lucide-react';
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
}

export interface ShippingOption {
  method: string;
  carrier: string;
  cost: number;
  currency: string;
  estimatedDays: number;
  description: string;
  trackingIncluded: boolean;
  insuranceIncluded: boolean;
}

type PaymentMethod = 'card' | 'bank_transfer' | 'bizum';

const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    method: 'standard',
    carrier: 'Correos',
    cost: 5.99,
    currency: 'EUR',
    estimatedDays: 4,
    description: 'Envío Estándar',
    trackingIncluded: true,
    insuranceIncluded: false,
  },
  {
    method: 'express',
    carrier: 'SEUR',
    cost: 12.99,
    currency: 'EUR',
    estimatedDays: 1,
    description: 'Envío Express 24h',
    trackingIncluded: true,
    insuranceIncluded: true,
  },
];

const getDeliveryDate = (daysToAdd: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  if (date.getDay() === 0) date.setDate(date.getDate() + 1);
  return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
};

const generateOrderNumber = () => 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

const STEPS = [
  { number: 1, title: 'Dirección', icon: MapPin },
  { number: 2, title: 'Envío', icon: Truck },
  { number: 3, title: 'Pago', icon: CreditCard },
  { number: 4, title: 'Confirmar', icon: CheckCircle },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart, discountCode, discountAmount, applyDiscountCode, removeDiscountCode } = useCart();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber] = useState(() => generateOrderNumber());
  const [error, setError] = useState<string | null>(null);
  
  const [promoInput, setPromoInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: user?.company || '',
    country: 'ES',
  });
  
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const shippingOption = SHIPPING_OPTIONS.find(o => o.method === selectedShipping)!;
  const shippingCost = shippingOption?.cost || 0;
  const discountedSubtotal = Math.max(0, subtotal - (discountAmount || 0));
  const tax = discountedSubtotal * 0.21;
  const total = discountedSubtotal + tax + shippingCost;

  // Protect route
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push('/');
    }
  }, [items, router, orderPlaced]);

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const required = ['firstName', 'lastName', 'street', 'city', 'postalCode'];
    for (const field of required) {
      if (!shippingAddress[field as keyof Address]) {
        toast.error({ title: 'Error', message: 'Por favor completa todos los campos obligatorios de la dirección.' });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateAddress()) return;
    setCurrentStep(prev => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    
    setIsApplyingPromo(true);
    try {
      await applyDiscountCode(promoInput.toUpperCase());
      toast.success({ title: 'Éxito', message: 'Código aplicado correctamente' });
      setPromoInput('');
    } catch (err: any) {
      toast.error({ title: 'Error', message: err.message || 'Código inválido' });
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleSimulatedPayment = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      // Simulamos latencia de red
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOrderPlaced(true);
      clearCart();
      router.push(`/success?order=${orderNumber}`);
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pedido.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    setIsProcessing(true);
    setError(null);
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
          customerEmail: user?.email,
          orderNumber,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Error al iniciar el pago');
      }
    } catch (err: any) {
      console.error('Error de pago:', err);
      // Fallback a pago simulado en modo desarrollo si falla Stripe (por falta de keys)
      if (process.env.NODE_ENV === 'development') {
        toast.info({ title: 'Modo dev', message: 'Stripe no configurado. Simulando pago...' });
        await handleSimulatedPayment();
      } else {
        setError(err.message || 'Error de conexión con la pasarela.');
        setIsProcessing(false);
      }
    }
  };

  const handleSubmitOrder = () => {
    if (!acceptedTerms) {
      toast.error({ title: 'Error', message: 'Debes aceptar los términos y condiciones.' });
      return;
    }
    if (paymentMethod === 'card') {
      handleStripePayment();
    } else {
      handleSimulatedPayment();
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
            <button className={styles.btnBack} onClick={() => router.push('/carrito')} style={{ padding: '0.5rem 1rem' }}>
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
                      <label className={styles.label}>Empresa (opcional)</label>
                      <input className={styles.input} type="text" value={shippingAddress.company || ''} onChange={e => handleAddressChange('company', e.target.value)} placeholder="Protex S.L." />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Dirección *</label>
                      <input className={styles.input} type="text" value={shippingAddress.street || ''} onChange={e => handleAddressChange('street', e.target.value)} placeholder="Calle Principal, 123" required />
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
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>País *</label>
                      <select className={styles.input} value={shippingAddress.country || 'ES'} onChange={e => handleAddressChange('country', e.target.value)}>
                        <option value="ES">España</option>
                        <option value="PT">Portugal</option>
                        <option value="FR">Francia</option>
                        <option value="AD">Andorra</option>
                      </select>
                    </div>
                  </form>
                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className={styles.btnNext} onClick={nextStep}>Continuar <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} /></button>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}><Truck size={22} color="#2e559e" /> Método de Envío</h2>
                </div>
                <div className={styles.cardBody}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {SHIPPING_OPTIONS.map(option => (
                      <div 
                        key={option.method} 
                        className={`${styles.shippingOption} ${selectedShipping === option.method ? styles.shippingOptionActive : ''}`}
                        onClick={() => setSelectedShipping(option.method)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', border: '2px solid', borderColor: selectedShipping === option.method ? '#2e559e' : '#d1d5db', background: selectedShipping === option.method ? '#2e559e' : 'transparent' }}>
                          {selectedShipping === option.method && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'white' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.25rem', fontWeight: 600, color: '#111827' }}>{option.description}</h4>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                            Recíbelo el {getDeliveryDate(option.estimatedDays)}
                          </p>
                        </div>
                        <div style={{ fontWeight: 700, color: '#111827', fontSize: '1.125rem' }}>
                          {option.cost === 0 ? 'Gratis' : `${option.cost.toFixed(2)}€`}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                    <button className={styles.btnBack} onClick={prevStep}>Atrás</button>
                    <button className={styles.btnNext} onClick={nextStep}>Continuar a Pago <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} /></button>
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}><CreditCard size={22} color="#2e559e" /> Método de Pago</h2>
                </div>
                <div className={styles.cardBody}>
                  <PaymentMethodSelector 
                    selectedMethod={paymentMethod} 
                    onMethodSelect={(m) => setPaymentMethod(m as PaymentMethod)} 
                  />
                  
                  {paymentMethod === 'bank_transfer' && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <BankTransferDetails />
                    </div>
                  )}
                  {paymentMethod === 'bizum' && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <BizumDetails />
                    </div>
                  )}

                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                    <button className={styles.btnBack} onClick={prevStep}>Atrás</button>
                    <button className={styles.btnNext} onClick={nextStep}>Revisar Pedido <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} /></button>
                  </div>
                </div>
              </>
            )}

            {currentStep === 4 && (
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
                      <p style={{ margin: 0, fontWeight: 500, color: '#111827' }}>{shippingOption.description}</p>
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
                      He leído y acepto los <a href="#" style={{ color: '#2e559e', textDecoration: 'underline' }}>términos y condiciones</a> y la <a href="#" style={{ color: '#2e559e', textDecoration: 'underline' }}>política de privacidad</a>. Entiendo que esta compra implica una obligación de pago.
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

        {/* Right Column - Order Summary Sidebar */}
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

            <div className={styles.sidebarTotals}>
              {!discountCode && (
                <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    className={styles.input}
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Código descuento"
                    disabled={isApplyingPromo}
                    style={{ textTransform: 'uppercase', padding: '0.625rem 1rem' }}
                  />
                  <button type="submit" disabled={isApplyingPromo || !promoInput.trim()} style={{ background: '#4b5563', color: 'white', border: 'none', borderRadius: '8px', padding: '0 1rem', fontWeight: 600, cursor: 'pointer' }}>
                    Aplicar
                  </button>
                </form>
              )}

              <div className={styles.sidebarTotalRow}>
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              
              {discountCode && (
                <div className={styles.sidebarTotalRow} style={{ color: '#10b981', fontWeight: 500 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Descuento ({discountCode})
                    <button onClick={removeDiscountCode} style={{ background: 'none', border: 'none', color: '#ef4444', padding: 0, cursor: 'pointer' }}><X size={14} /></button>
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
              <div className={styles.trustBadgeText}><ShieldCheck size={16} color="#10b981" /> Garantía de Devolución de 30 Días</div>
              <div className={styles.trustBadgeText}><Lock size={16} color="#10b981" /> Pago Seguro con Encriptación SSL</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
