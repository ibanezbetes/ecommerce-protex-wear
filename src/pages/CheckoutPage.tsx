import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CheckoutButton } from '../components/CheckoutButton';
import { Address, ShippingOption, CartItem } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';

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
    description: 'Envío Urgente 24h',
    trackingIncluded: true,
    insuranceIncluded: true,
  },
];

const getDeliveryDate = (daysToAdd: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  // Skip Sundays
  if (date.getDay() === 0) date.setDate(date.getDate() + 1);

  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date);
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form data
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: user?.company || '',
    country: 'ES'
  });
  const [selectedShipping, setSelectedShipping] = useState<string>('standard');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Redirect if empty
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/carrito');
    }
  }, [items, navigate]);

  const shippingCost = SHIPPING_OPTIONS.find(opt => opt.method === selectedShipping)?.cost || 0;
  const tax = subtotal * 0.21;
  const total = subtotal + shippingCost + tax;

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const isAddressValid = () => {
    return shippingAddress.firstName &&
      shippingAddress.lastName &&
      shippingAddress.addressLine1 &&
      shippingAddress.city &&
      shippingAddress.postalCode &&
      shippingAddress.country;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !isAddressValid()) {
      alert("Por favor, rellena todos los campos obligatorios.");
      return;
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: 'Dirección', completed: currentStep > 1 },
    { number: 2, title: 'Envío', completed: currentStep > 2 },
    { number: 3, title: 'Confirmación', completed: false },
  ];

  // Prepare items for CheckoutButton
  const billingItems = items.map(item => ({
    id: item.productId,
    productId: item.productId,
    name: item.product.name,
    price: item.unitPrice,
    quantity: item.quantity,
    image: item.product.imageUrl
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center w-full">
              <div className={`flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 flex-shrink-0 ${step.completed || currentStep === step.number
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 text-gray-500'
                }`}>
                {step.completed ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:block ${step.completed || currentStep === step.number ? 'text-gray-900' : 'text-gray-500'
                }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${step.completed ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">

          {/* Step 1: Address */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border p-6 animate-fade-in-up">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Dirección de Envío</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input type="text" required value={shippingAddress.firstName || ''} onChange={(e) => handleAddressChange('firstName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                  <input type="text" required value={shippingAddress.lastName || ''} onChange={(e) => handleAddressChange('lastName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <input type="text" required value={shippingAddress.addressLine1 || ''} onChange={(e) => handleAddressChange('addressLine1', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Calle, número..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <input type="text" required value={shippingAddress.city || ''} onChange={(e) => handleAddressChange('city', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
                  <input type="text" required value={shippingAddress.postalCode || ''} onChange={(e) => handleAddressChange('postalCode', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">País *</label>
                  <select required value={shippingAddress.country || 'ES'} onChange={(e) => handleAddressChange('country', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="ES">España</option>
                    <option value="PT">Portugal</option>
                    <option value="FR">Francia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" value={shippingAddress.phone || ''} onChange={(e) => handleAddressChange('phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={handleNextStep} className="btn btn-primary px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">Continuar</button>
              </div>
            </div>
          )}

          {/* Step 2: Shipping */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border p-6 animate-fade-in-up">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Método de Envío</h2>
              <div className="space-y-3">
                {SHIPPING_OPTIONS.map((option) => (
                  <label key={option.method} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedShipping === option.method ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="shipping" value={option.method} checked={selectedShipping === option.method} onChange={(e) => setSelectedShipping(e.target.value)} className="mr-4 h-5 w-5 text-blue-600 focus:ring-blue-500" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="font-bold text-gray-900">{option.method === 'express' ? '⚡ ' : '📦 '}{option.description}</p>
                          <p className="text-sm text-green-700 font-medium mt-1">
                            Llega el {getDeliveryDate(option.estimatedDays)}
                          </p>
                        </div>
                        <span className="font-bold text-lg">
                          {option.cost === 0 ? 'GRATIS' : `€${option.cost.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 gap-3 mt-2">
                        <span className="flex items-center bg-gray-100 px-2 py-1 rounded">
                          {option.carrier}
                        </span>
                        {option.trackingIncluded && <span className="flex items-center">✓ Seguimiento incluido</span>}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={handlePreviousStep} className="text-gray-600 hover:text-gray-900 font-medium">Atrás</button>
                <button onClick={handleNextStep} className="btn btn-primary px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">Continuar</button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Pay */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm border p-6 animate-fade-in-up">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Revisión y Pago</h2>

              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Envío a:</h3>
                <p className="text-sm text-gray-600">
                  {shippingAddress.firstName} {shippingAddress.lastName}<br />
                  {shippingAddress.addressLine1}<br />
                  {shippingAddress.postalCode} {shippingAddress.city}, {shippingAddress.country}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3">Productos</h3>
                <div className="space-y-2 border-t pt-2">
                  {items.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span>€{item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="flex items-start cursor-pointer">
                  <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 h-4 w-4 text-blue-600 rounded" />
                  <span className="ml-2 text-sm text-gray-600">
                    He leído y acepto los <a href="#" className="text-blue-600 hover:underline">Términos y Condiciones</a> y la <a href="#" className="text-blue-600 hover:underline">Política de Privacidad</a>.
                  </span>
                </label>
              </div>

              <div className="flex flex-col gap-4">
                {!acceptedTerms ? (
                  <button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-6 rounded-lg cursor-not-allowed">
                    Debes aceptar los términos
                  </button>
                ) : (
                  <CheckoutButton
                    items={billingItems}
                    customerEmail={user?.email || 'guest@example.com'}
                    shippingAddress={shippingAddress}
                    userId={user?.id}
                    shippingMethod={selectedShipping}
                  />
                )}
              </div>

              {/* Trust Seals */}
              <div className="mt-8 flex flex-col items-center justify-center space-y-2 text-gray-400">
                <div className="flex space-x-4 items-center">
                  {/* Simulating Icons with SVGs */}
                  <span className="flex items-center text-xs"><svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>Pago Seguro SSL</span>
                  <span className="flex items-center text-xs">VISA / Mastercard</span>
                  <span className="flex items-center text-xs">Procesado por Stripe</span>
                </div>
              </div>

              <div className="mt-4 flex justify-start">
                <button onClick={handlePreviousStep} className="text-gray-600 hover:text-gray-900 font-medium text-sm">Atrás</button>
              </div>

            </div>
          )}

        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
            <div className="space-y-2 text-sm text-gray-600 pb-4 border-b">
              <div className="flex justify-between"><span>Subtotal</span><span>€{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Envío</span><span>€{shippingCost.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>IVA (21%)</span><span>€{tax.toFixed(2)}</span></div>
            </div>
            <div className="pt-4 flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;