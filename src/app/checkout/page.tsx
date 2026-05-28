'use client';
import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import { PaymentMethodSelector, PaymentMethod } from '@/components/checkout/PaymentMethodSelector';
import { BankTransferDetails } from '@/components/checkout/BankTransferDetails';
import { BizumDetails } from '@/components/checkout/BizumDetails';

export default function CheckoutPage() {
  const { user, isGuest, logout } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber] = useState(() => 'PW-' + Date.now().toString(36).toUpperCase());

  const isVip = !isGuest && user?.can_pay_later === true;

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const dummyOrderId = orderNumber; 

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          orderId: dummyOrderId,
          userEmail: user?.email
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Error al iniciar el pago');
      }
    } catch (error) {
      console.error('Error de pago:', error);
      alert('No se pudo iniciar el proceso de pago con Stripe.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualPayment = async () => {
    setLoading(true);
    try {
      // Here you would typically save the order to your database as "pending"
      await new Promise(r => setTimeout(r, 1000));
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeferredPayment = async () => {
    setLoading(true);
    try {
      console.log('Confirmando pedido con Pago Diferido (VIP)...');
      await new Promise(r => setTimeout(r, 1000));
      alert('¡Pedido confirmado exitosamente (Pago Diferido)!');
      clearCart();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-8 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Registrado!</h2>
          <p className="text-gray-600 mb-6">Tu número de pedido es: <strong className="font-mono text-gray-900">{orderNumber}</strong></p>
          <div className="text-left bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700 mb-6">
            <p>Hemos guardado tu pedido. Por favor, realiza el pago según las instrucciones proporcionadas para que podamos procesarlo.</p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Resumen del Pedido</h3>
          </div>
          <ul className="divide-y divide-gray-200 px-4 py-3">
            {items.map((item) => (
              <li key={item.variantId} className="py-4 flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {(item.price * item.quantity).toFixed(2)}€
                </div>
              </li>
            ))}
          </ul>
          
          <div className="px-4 py-5 bg-gray-50 flex justify-between border-t border-gray-200">
            <span className="text-base font-bold text-gray-900">Total a pagar</span>
            <span className="text-xl font-bold text-gray-900">{cartTotal.toFixed(2)}€</span>
          </div>

          <div className="px-4 py-6">
            {isVip ? (
              <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                <h4 className="text-indigo-800 font-semibold mb-2">✨ Facturación Diferida Activada</h4>
                <p className="text-indigo-600 text-sm mb-4">
                  Como cliente B2B autorizado, puedes confirmar el pedido ahora sin realizar el pago inmediato.
                </p>
                <button
                  onClick={handleDeferredPayment}
                  disabled={loading || items.length === 0}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : 'Confirmar Pedido (Pago Diferido)'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Método de Pago</h4>
                  <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <BankTransferDetails orderNumber={orderNumber} total={cartTotal} />
                )}
                {paymentMethod === 'bizum' && (
                  <BizumDetails orderNumber={orderNumber} total={cartTotal} />
                )}

                <div className="pt-4 border-t border-gray-200">
                  {paymentMethod === 'card' ? (
                    <button
                      onClick={handleStripePayment}
                      disabled={loading || items.length === 0}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-colors"
                    >
                      {loading ? 'Procesando...' : 'Pagar de forma segura (Stripe)'}
                    </button>
                  ) : (
                    <button
                      onClick={handleManualPayment}
                      disabled={loading || items.length === 0}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                    >
                      {loading ? 'Procesando...' : 'Confirmar Pedido'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
