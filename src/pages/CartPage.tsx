import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { CheckoutButton } from '../components/CheckoutButton';

/**
 * Cart Page - Shopping cart with items management
 * TODO: Integrate with CartContext when implemented
 */
function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { items, subtotal, removeItem, updateQuantity } = useCart(); // Use real cart context
  const [guestEmail, setGuestEmail] = useState('');

  // No mockCartItems anymore

  const tax = subtotal * 0.21; // 21% IVA
  const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over €100
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">
            Explora nuestro catálogo y añade productos a tu carrito
          </p>
          <button
            onClick={() => navigate('/productos')}
            className="btn btn-primary"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Productos ({items.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.productId} className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">SKU: {item.product.sku}</p>
                          <p className="text-lg font-semibold text-primary-600">
                            €{item.unitPrice.toFixed(2)} c/u
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Eliminar producto"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                              min="1"
                              max={item.product.stock}
                              className="w-16 px-2 py-1 text-center border-0 focus:ring-0"
                            />
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            €{item.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <button
              onClick={() => navigate('/productos')}
              className="btn btn-outline"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Continuar Comprando
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>IVA (21%):</span>
                <span>€{tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Envío:</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Gratis</span>
                  ) : (
                    `€${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              {subtotal < 100 && (
                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium">¡Envío gratis desde €100!</p>
                  <p>Añade €{(100 - subtotal).toFixed(2)} más para obtener envío gratuito</p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total:</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Guest Email Input */}
            {!isAuthenticated && (
              <div className="mb-4">
                <label htmlFor="guest-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico (para recibir confirmación):
                </label>
                <input
                  type="email"
                  id="guest-email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="ejemplo@correo.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>
            )}

            {/* Checkout Button with mapped items */}
            {(() => {
              // Map real CartContext items to format expected by CheckoutButton/Backend
              // Note: Backend expects CartItem interface, let's align it
              const billingItems = items.map(item => ({
                id: item.productId, // Use productId as the ID
                productId: item.productId,
                name: item.product.name,
                price: item.unitPrice,
                quantity: item.quantity,
                image: item.product.imageUrl
              }));
              return <CheckoutButton items={billingItems} customerEmail={isAuthenticated ? user?.email : guestEmail} />;
            })()}

            {/* Security Info */}
            <div className="text-center text-sm text-gray-500">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Compra segura</span>
              </div>
              <p>Tus datos están protegidos con encriptación SSL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;