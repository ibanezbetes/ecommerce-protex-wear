'use client';
import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';

export default function CheckoutPage() {
  const { user, isGuest, logout } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const isVip = !isGuest && user?.can_pay_later === true;

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const dummyOrderId = "ORDER-" + Date.now(); 

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
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm mb-4">
                  Serás redirigido a Stripe para completar el pago de forma segura mediante Tarjeta, Bizum o Transferencia.
                </p>
                <button
                  onClick={handleStripePayment}
                  disabled={loading || items.length === 0}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50"
                >
                  {loading ? 'Procesando...' : 'Pagar de forma segura'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
