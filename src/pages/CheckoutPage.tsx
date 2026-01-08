import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Address, ShippingOption } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';

/**
 * Checkout Page - Order completion process
 */
function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form data
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: user?.company || '',
  });
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>({});
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  // Mock data
  const mockCartItems = [
    {
      id: '1',
      name: 'Casco de Seguridad Industrial',
      quantity: 2,
      price: 45.99,
      total: 91.98,
    },
    {
      id: '2',
      name: 'Guantes de Trabajo Anticorte',
      quantity: 5,
      price: 12.50,
      total: 62.50,
    },
  ];

  const mockShippingOptions: ShippingOption[] = [
    {
      method: 'standard',
      carrier: 'Correos',
      cost: 9.99,
      currency: 'EUR',
      estimatedDays: 5,
      description: 'Envío estándar (5-7 días laborables)',
      trackingIncluded: true,
      insuranceIncluded: false,
    },
    {
      method: 'express',
      carrier: 'SEUR',
      cost: 19.99,
      currency: 'EUR',
      estimatedDays: 2,
      description: 'Envío express (2-3 días laborables)',
      trackingIncluded: true,
      insuranceIncluded: true,
    },
  ];

  const subtotal = mockCartItems.reduce((sum, item) => sum + item.total, 0);
  const shippingCost = selectedShipping ? mockShippingOptions.find(opt => opt.method === selectedShipping)?.cost || 0 : 0;
  const tax = subtotal * 0.21;
  const total = subtotal + shippingCost + tax;

  const handleAddressChange = (
    type: 'shipping' | 'billing',
    field: keyof Address,
    value: string
  ) => {
    if (type === 'shipping') {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // TODO: Implement actual order creation
      console.log('Order placed:', {
        items: mockCartItems,
        shippingAddress,
        billingAddress: useSameAddress ? shippingAddress : billingAddress,
        shipping: selectedShipping,
        payment: paymentMethod,
        total,
      });
      
      // Redirect to success page
      navigate('/pedido-confirmado');
    } catch (error) {
      console.error('Order processing error:', error);
      alert('Error al procesar el pedido. Por favor, inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: 'Dirección de Envío', completed: currentStep > 1 },
    { number: 2, title: 'Método de Envío', completed: currentStep > 2 },
    { number: 3, title: 'Pago', completed: currentStep > 3 },
    { number: 4, title: 'Confirmación', completed: false },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Pedido</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step.completed || currentStep === step.number
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}>
                {step.completed ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step.completed || currentStep === step.number ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  step.completed ? 'bg-primary-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Address */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Dirección de Envío</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.firstName || ''}
                    onChange={(e) => handleAddressChange('shipping', 'firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.lastName || ''}
                    onChange={(e) => handleAddressChange('shipping', 'lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.company || ''}
                    onChange={(e) => handleAddressChange('shipping', 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.addressLine1 || ''}
                    onChange={(e) => handleAddressChange('shipping', 'addressLine1', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Calle, número, piso, puerta"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city || ''}
                    onChange={(e) => handleAddressChange('shipping', 'city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode || ''}
                    onChange={(e) => handleAddressChange('shipping', 'postalCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País *
                  </label>
                  <select
                    required
                    value={shippingAddress.country || 'ES'}
                    onChange={(e) => handleAddressChange('shipping', 'country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="ES">España</option>
                    <option value="PT">Portugal</option>
                    <option value="FR">Francia</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone || ''}
                    onChange={(e) => handleAddressChange('shipping', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button onClick={handleNextStep} className="btn btn-primary">
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Shipping Method */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Método de Envío</h2>
              
              <div className="space-y-4">
                {mockShippingOptions.map((option) => (
                  <label key={option.method} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="shipping"
                      value={option.method}
                      checked={selectedShipping === option.method}
                      onChange={(e) => setSelectedShipping(e.target.value)}
                      className="mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{option.description}</h3>
                          <p className="text-sm text-gray-600">Transportista: {option.carrier}</p>
                          <p className="text-sm text-gray-600">
                            {option.trackingIncluded && '✓ Seguimiento incluido'} 
                            {option.insuranceIncluded && ' • ✓ Seguro incluido'}
                          </p>
                        </div>
                        <span className="font-semibold text-gray-900">€{option.cost.toFixed(2)}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <button onClick={handlePreviousStep} className="btn btn-outline">
                  Anterior
                </button>
                <button 
                  onClick={handleNextStep} 
                  disabled={!selectedShipping}
                  className="btn btn-primary disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Método de Pago</h2>
              
              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">Tarjeta de Crédito/Débito</h3>
                    <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">Transferencia Bancaria</h3>
                    <p className="text-sm text-gray-600">Pago a 30 días (solo empresas)</p>
                  </div>
                </label>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button onClick={handlePreviousStep} className="btn btn-outline">
                  Anterior
                </button>
                <button 
                  onClick={handleNextStep} 
                  disabled={!paymentMethod}
                  className="btn btn-primary disabled:opacity-50"
                >
                  Revisar Pedido
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Confirmar Pedido</h2>
              
              {/* Order Summary */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Productos</h3>
                  {mockCartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <span>{item.name} × {item.quantity}</span>
                      <span>€{item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Dirección de Envío</h3>
                  <p className="text-gray-600">
                    {shippingAddress.firstName} {shippingAddress.lastName}<br />
                    {shippingAddress.company && `${shippingAddress.company}\n`}
                    {shippingAddress.addressLine1}<br />
                    {shippingAddress.city}, {shippingAddress.postalCode}<br />
                    {shippingAddress.country}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Método de Envío</h3>
                  <p className="text-gray-600">
                    {mockShippingOptions.find(opt => opt.method === selectedShipping)?.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Método de Pago</h3>
                  <p className="text-gray-600">
                    {paymentMethod === 'card' ? 'Tarjeta de Crédito/Débito' : 'Transferencia Bancaria'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button onClick={handlePreviousStep} className="btn btn-outline">
                  Anterior
                </button>
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Procesando...</span>
                    </div>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h3>
            
            <div className="space-y-3 mb-4">
              {mockCartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>€{item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Envío:</span>
                <span>€{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (21%):</span>
                <span>€{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                <span>Total:</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;