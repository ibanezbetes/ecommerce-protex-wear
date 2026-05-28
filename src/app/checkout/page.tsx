'use client';
﻿import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import { useToast } from '@/components/Feedback/ToastProvider';
import { PaymentMethodSelector } from '@/components/Checkout/PaymentMethodSelector';
import { BankTransferDetails } from '@/components/Checkout/BankTransferDetails';
import { BizumDetails } from '@/components/Checkout/BizumDetails';
export interface Address {
  id?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
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
    description: 'Env├¡o Est├índar',
    trackingIncluded: true,
    insuranceIncluded: false,
  },
  {
    method: 'express',
    carrier: 'SEUR',
    cost: 12.99,
    currency: 'EUR',
    estimatedDays: 1,
    description: 'Env├¡o Express 24h',
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

const STEPS = [
  { number: 1, title: 'Direcci├│n', icon: '­ƒôì' },
  { number: 2, title: 'Env├¡o', icon: '­ƒÜÜ' },
  { number: 3, title: 'Pago', icon: '­ƒÆ│' },
  { number: 4, title: 'Confirmar', icon: 'Ô£à' },
];

function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart, discountCode, discountAmount, applyDiscountCode, removeDiscountCode } = useCart();
  const toast = useToast();
  const showToast = (msg, type) => type === 'error' ? toast.error({title:'Error', message:msg}) : toast.success({title:'Éxito', message:msg});

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
  const total = discountedSubtotal + shippingCost + tax;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    
    setIsApplyingPromo(true);
    const success = await applyDiscountCode(promoInput.trim());
    setIsApplyingPromo(false);
    
    if (success) {
      showToast('┬íC├│digo aplicado!', 'success');
      setPromoInput('');
    } else {
      showToast('C├│digo no v├ílido', 'error');
    }
  };

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) router.push('/carrito');
  }, [items, navigate, orderPlaced]);

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const isAddressValid = () =>
    shippingAddress.firstName &&
    shippingAddress.lastName &&
    shippingAddress.addressLine1 &&
    shippingAddress.city &&
    shippingAddress.postalCode &&
    shippingAddress.country;

  const handleNextStep = () => {
    if (currentStep === 1 && !isAddressValid()) {
      setError('Por favor, rellena todos los campos obligatorios.');
      return;
    }
    setError(null);
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleConfirmOrder = async () => {
    if (!acceptedTerms) return;
    setIsProcessing(true);
    setError(null);

    try {
      const emailData: any = OrderEmailData = {
        orderNumber,
        customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        customerEmail: user?.email || '',
        items: items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        subtotal,
        tax,
        shippingCost,
        total,
        paymentMethod,
        shippingAddress: {
          firstName: shippingAddress.firstName || '',
          lastName: shippingAddress.lastName || '',
          addressLine1: shippingAddress.addressLine1 || '',
          postalCode: shippingAddress.postalCode || '',
          city: shippingAddress.city || '',
          country: shippingAddress.country || 'ES',
        },
        shippingMethod: selectedShipping,
      };

      await 

      // For all simulated methods, mark as placed
      setOrderPlaced(true);
      clearCart();
      router.push('/success', {
        state: {
          orderNumber,
          paymentMethod,
          total,
          customerEmail: user?.email,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pedido. Int├®ntalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Billing items for Stripe
  const billingItems = items.map(item => ({
    id: item.productId,
    productId: item.productId,
    name: item.product.name,
    price: item.unitPrice,
    quantity: item.quantity,
    image: item.product.imageUrl,
  }));

  return (
    <div className="checkout-page-bg">
      {/* Top bar */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a6e, #2e559e)',
        padding: '1.25rem 0',
        marginBottom: '2rem',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>­ƒøí´©Å</span>
            <div>
              <h1 style={{ margin: 0, color: 'white', fontSize: '1.25rem', fontWeight: 700 }}>
                Finalizar Compra
              </h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem' }}>
                Proceso seguro con encriptaci├│n SSL
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/carrito')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.8)',
              padding: '0.5rem 1rem',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Volver al carrito
          </button>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '72rem', paddingBottom: '4rem' }}>
        {/* Progress steps */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: '2.5rem', padding: '0 1rem', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
          {STEPS.map((step, index) => {
            const status = currentStep > step.number ? 'completed' : currentStep === step.number ? 'active' : 'pending';
            return (
              <React.Fragment key={step.number}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <div
                    className={`checkout-step-circle ${status}`}
                    style={{ cursor: status === 'completed' ? 'pointer' : 'default' }}
                    onClick={() => status === 'completed' && setCurrentStep(step.number)}
                  >
                    {status === 'completed' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <span style={{ fontSize: '0.9375rem' }}>{step.icon}</span>
                    )}
                  </div>
                  <span className={`checkout-step-label ${status}`} style={{ marginTop: '0.375rem', fontSize: '0.75rem', textAlign: 'center' }}>
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`checkout-step-connector ${currentStep > step.number ? 'completed' : 'pending'}`}
                    style={{ marginTop: '1.375rem' }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <div className="alert alert-error animate-fade-in-up" style={{ maxWidth: '640px', margin: '0 auto 1.5rem', borderRadius: '12px' }}>
            ÔÜá´©Å {error}
          </div>
        )}

        <div className="checkout-layout">
          {/* =============== MAIN FORM =============== */}
          <div>

            {/* STEP 1: Address */}
            {currentStep === 1 && (
              <div className="checkout-card animate-fade-in-up">
                <div className="checkout-card-title">
                  <div className="checkout-card-title-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  Direcci├│n de Env├¡o
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { field: 'firstName' as keyof Address, label: 'Nombre *', placeholder: 'Mar├¡a', cols: 1 },
                    { field: 'lastName' as keyof Address, label: 'Apellidos *', placeholder: 'Garc├¡a L├│pez', cols: 1 },
                    { field: 'company' as keyof Address, label: 'Empresa (opcional)', placeholder: 'Empresa S.L.', cols: 2 },
                    { field: 'addressLine1' as keyof Address, label: 'Direcci├│n *', placeholder: 'Calle Mayor, 15, 2┬║B', cols: 2 },
                    { field: 'addressLine2' as keyof Address, label: 'Piso, puerta... (opcional)', placeholder: '', cols: 2 },
                    { field: 'city' as keyof Address, label: 'Ciudad *', placeholder: 'Madrid', cols: 1 },
                    { field: 'postalCode' as keyof Address, label: 'C├│digo Postal *', placeholder: '28001', cols: 1 },
                    { field: 'phone' as keyof Address, label: 'Tel├®fono', placeholder: '+34 600 000 000', cols: 2 },
                  ].map(({ field, label, placeholder, cols }) => (
                    <div key={field} style={{ gridColumn: `span ${cols}` }}>
                      <label className="checkout-label">{label}</label>
                      {field === 'country' ? null : (
                        <input
                          type={field === 'phone' ? 'tel' : 'text'}
                          className="checkout-input"
                          placeholder={placeholder}
                          value={(shippingAddress[field] as string) || ''}
                          onChange={e => handleAddressChange(field, e.target.value)}
                        />
                      )}
                    </div>
                  ))}

                  {/* Country select */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="checkout-label">Pa├¡s *</label>
                    <select
                      className="checkout-input"
                      value={shippingAddress.country || 'ES'}
                      onChange={e => handleAddressChange('country', e.target.value)}
                    >
                      <option value="ES">­ƒç¬­ƒç© Espa├▒a</option>
                      <option value="PT">­ƒçÁ­ƒç╣ Portugal</option>
                      <option value="FR">­ƒç½­ƒçÀ Francia</option>
                      <option value="DE">­ƒç®­ƒç¬ Alemania</option>
                      <option value="IT">­ƒç«­ƒç╣ Italia</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button className="checkout-next-btn" onClick={handleNextStep}>
                    Continuar
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Shipping method */}
            {currentStep === 2 && (
              <div className="checkout-card animate-fade-in-up">
                <div className="checkout-card-title">
                  <div className="checkout-card-title-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                  </div>
                  M├®todo de Env├¡o
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {SHIPPING_OPTIONS.map((option, i) => (
                    <div
                      key={option.method}
                      className={`shipping-option-card ${selectedShipping === option.method ? 'selected' : ''} animate-fade-in-up delay-${(i + 1) * 100}`}
                      onClick={() => setSelectedShipping(option.method)}
                    >
                      {/* Radio */}
                      <div style={{
                        width: 20, height: 20,
                        borderRadius: '50%',
                        border: `2px solid ${selectedShipping === option.method ? '#2e559e' : '#d1d5db'}`,
                        background: selectedShipping === option.method ? '#2e559e' : 'white',
                        flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: selectedShipping === option.method ? '0 0 0 4px rgba(46,85,158,0.15)' : 'none',
                      }}>
                        {selectedShipping === option.method && (
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                        <span style={{ fontSize: '1.5rem' }}>
                          {option.method === 'express' ? 'ÔÜí' : '­ƒôª'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#1a2a4a' }}>
                              {option.description}
                            </h4>
                            <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: selectedShipping === option.method ? '#2e559e' : '#374151' }}>
                              {option.cost === 0 ? 'GRATIS' : `Ôé¼${option.cost.toFixed(2)}`}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#10b981', fontWeight: 500 }}>
                              Llega el {getDeliveryDate(option.estimatedDays)}
                            </p>
                            <span style={{
                              fontSize: '0.75rem',
                              background: '#f3f4f6',
                              color: '#6b7280',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '999px',
                              fontWeight: 500,
                            }}>
                              {option.carrier}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <button className="checkout-back-btn" onClick={() => setCurrentStep(1)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Atr├ís
                  </button>
                  <button className="checkout-next-btn" onClick={handleNextStep}>
                    Continuar
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment method */}
            {currentStep === 3 && (
              <div className="checkout-card animate-fade-in-up">
                <div className="checkout-card-title">
                  <div className="checkout-card-title-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                  </div>
                  M├®todo de Pago
                </div>

                <PaymentMethodSelector
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                />

                {/* Show payment details depending on method */}
                {paymentMethod === 'bank_transfer' && (
                  <BankTransferDetails orderNumber={orderNumber} total={total} />
                )}
                {paymentMethod === 'bizum' && (
                  <BizumDetails orderNumber={orderNumber} total={total} />
                )}
                {paymentMethod === 'card' && (
                  <div style={{
                    marginTop: '1.25rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #f0f4ff, #eef2ff)',
                    borderRadius: '12px',
                    border: '1px solid rgba(46,85,158,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#2e559e',
                  }}>
                    <div style={{
                      width: 36, height: 36,
                      background: 'rgba(46,85,158,0.12)',
                      borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      ­ƒöÆ
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>Pago seguro con Stripe</p>
                      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280' }}>
                        Procesar├ís el pago en el siguiente paso. Aceptamos Visa, Mastercard y Amex.
                      </p>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <button className="checkout-back-btn" onClick={() => setCurrentStep(2)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Atr├ís
                  </button>
                  <button className="checkout-next-btn" onClick={handleNextStep}>
                    Revisar pedido
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Confirm */}
            {currentStep === 4 && (
              <div className="checkout-card animate-fade-in-up">
                <div className="checkout-card-title">
                  <div className="checkout-card-title-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4"></path>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                    </svg>
                  </div>
                  Revisi├│n y Confirmaci├│n
                </div>

                {/* Address review */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>­ƒôì Direcci├│n de env├¡o</h4>
                    <button onClick={() => setCurrentStep(1)} style={{ background: 'none', border: 'none', color: '#2e559e', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 600 }}>Editar</button>
                  </div>
                  <div className="review-address-card">
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>
                      <strong>{shippingAddress.firstName} {shippingAddress.lastName}</strong><br />
                      {shippingAddress.addressLine1}<br />
                      {shippingAddress.postalCode} {shippingAddress.city}, {shippingAddress.country}
                      {shippingAddress.phone && <><br />{shippingAddress.phone}</>}
                    </p>
                  </div>
                </div>

                {/* Shipping review */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>­ƒÜÜ M├®todo de env├¡o</h4>
                    <button onClick={() => setCurrentStep(2)} style={{ background: 'none', border: 'none', color: '#2e559e', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 600 }}>Editar</button>
                  </div>
                  <div className="review-address-card">
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
                      {shippingOption?.description} ÔÇö <span style={{ color: '#10b981', fontWeight: 600 }}>Llega el {getDeliveryDate(shippingOption?.estimatedDays || 4)}</span>
                    </p>
                  </div>
                </div>

                {/* Payment review */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#374151' }}>­ƒÆ│ M├®todo de pago</h4>
                    <button onClick={() => setCurrentStep(3)} style={{ background: 'none', border: 'none', color: '#2e559e', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 600 }}>Editar</button>
                  </div>
                  <div className="review-address-card">
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
                      {paymentMethod === 'card' && '­ƒÆ│ Tarjeta de Cr├®dito/D├®bito (Stripe)'}
                      {paymentMethod === 'bank_transfer' && '­ƒÅª Transferencia Bancaria'}
                      {paymentMethod === 'bizum' && '­ƒô▒ Bizum'}
                    </p>
                  </div>
                </div>

                {/* T&C */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: 20, height: 20,
                      border: `2px solid ${acceptedTerms ? '#2e559e' : '#d1d5db'}`,
                      borderRadius: 5,
                      background: acceptedTerms ? '#2e559e' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      marginTop: '2px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setAcceptedTerms(!acceptedTerms)}
                  >
                    {acceptedTerms && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} style={{ display: 'none' }} />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                    He le├¡do y acepto los{' '}
                    <a href="#" style={{ color: '#2e559e', fontWeight: 600 }}>T├®rminos y Condiciones</a>{' '}
                    y la{' '}
                    <a href="#" style={{ color: '#2e559e', fontWeight: 600 }}>Pol├¡tica de Privacidad</a>.
                  </span>
                </label>

                {/* CTA buttons */}
                <button
                  className="checkout-confirm-btn"
                  onClick={handleConfirmOrder}
                  disabled={!acceptedTerms || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="loading" style={{ width: 20, height: 20, borderWidth: 2 }} />
                      Procesando pedido...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Confirmar Pedido ┬À Ôé¼{total.toFixed(2)}
                    </>
                  )}
                </button>

                {/* Order number display */}
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>
                    N┬║ de pedido:{' '}
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#374151' }}>
                      {orderNumber}
                    </span>
                  </p>
                </div>

                {/* Trust badges */}
                <div className="trust-badges" style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #f3f4f6' }}>
                  {[
                    { icon: '­ƒöÆ', text: 'SSL 256-bit' },
                    { icon: '­ƒøí´©Å', text: 'Datos protegidos' },
                    { icon: 'Ô£à', text: 'Compra garantizada' },
                    { icon: '­ƒôº', text: 'Confirmaci├│n por email' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="trust-badge">
                      <span>{icon}</span>
                      {text}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <button className="checkout-back-btn" onClick={() => setCurrentStep(3)} style={{ width: '100%', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Volver al m├®todo de pago
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =============== SIDEBAR SUMMARY =============== */}
          <div style={{ alignSelf: 'flex-start', position: 'sticky', top: '1.5rem' }}>
            <div className="checkout-sidebar animate-slide-in-right">
              <div className="checkout-sidebar-header">
                <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: 'white' }}>
                  Resumen del Pedido
                </h3>
              </div>

              <div style={{ padding: '1.25rem 1.5rem' }}>
                {/* Item list */}
                <div style={{ marginBottom: '1.25rem' }}>
                  {items.map(item => (
                    <div key={item.productId} className="checkout-sidebar-item">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="checkout-sidebar-img" />
                      ) : (
                        <div className="checkout-sidebar-img" style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                          fontSize: '1.5rem',
                        }}>
                          ­ƒøí´©Å
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', fontWeight: 600, color: '#1a2a4a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.product.name}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280' }}>
                          {item.quantity} ├ù Ôé¼{item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#2e559e', flexShrink: 0 }}>
                        Ôé¼{item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1.5px solid #f3f4f6' }}>
                  {[
                    { label: 'Subtotal', value: `Ôé¼${subtotal.toFixed(2)}` },
                    ...(discountCode ? [{ label: `Descuento (${discountCode})`, value: `-Ôé¼${(discountAmount || 0).toFixed(2)}`, green: true }] : []),
                    { label: 'IVA (21%)', value: `Ôé¼${tax.toFixed(2)}` },
                    { label: 'Env├¡o', value: shippingCost === 0 ? '┬íGratis!' : `Ôé¼${shippingCost.toFixed(2)}`, green: shippingCost === 0 },
                  ].map(({ label, value, green }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        {label}
                        {label.startsWith('Descuento') && (
                          <button type="button" onClick={() => { removeDiscountCode(); showToast('Descuento eliminado', 'info'); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, fontSize: '0.75rem' }}>Ô£ò</button>
                        )}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: green ? '#10b981' : '#374151', fontWeight: green ? 600 : 400 }}>
                        {value}
                      </span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.875rem', borderTop: '2px solid #f3f4f6', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1a2a4a' }}>Total</span>
                    <span style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#2e559e' }}>Ôé¼{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code Input in Checkout */}
                {!discountCode && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                    <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="C├│digo descuento"
                        disabled={isApplyingPromo}
                        style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.8125rem', textTransform: 'uppercase' }}
                      />
                      <button
                        type="submit"
                        disabled={isApplyingPromo || !promoInput.trim()}
                        style={{ padding: '0.5rem 0.75rem', background: '#1a2a4a', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, cursor: isApplyingPromo || !promoInput.trim() ? 'not-allowed' : 'pointer' }}
                      >
                        Aplicar
                      </button>
                    </form>
                  </div>
                )}

                {/* Security note */}
                <div style={{
                  marginTop: '1.25rem',
                  padding: '0.875rem',
                  background: '#f8faff',
                  borderRadius: '10px',
                  border: '1px solid rgba(46,85,158,0.08)',
                  textAlign: 'center',
                }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                    ­ƒöÆ Transacci├│n segura ┬À Datos cifrados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


