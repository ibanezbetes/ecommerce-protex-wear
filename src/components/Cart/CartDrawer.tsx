import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const { isCartOpen, closeCart, items, subtotal, removeItem, updateQuantity, itemCount } = useCart();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.21;
  const total = subtotal + tax + shipping;
  const freeShippingProgress = Math.min((subtotal / 100) * 100, 100);
  const remaining = Math.max(100 - subtotal, 0);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer" onClick={closeCart} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-xl flex flex-col pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-color to-primary-dark shadow-md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36, height: 36,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem',
            }}>
              🛒
            </div>
            <div>
              <h2 style={{ margin: 0, color: 'white', fontSize: '1rem', fontWeight: 700 }}>
                Mi Carrito
              </h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem' }}>
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <button className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors border-0 cursor-pointer" onClick={closeCart} aria-label="Cerrar carrito">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
              <div className="animate-bounce mb-4">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 01-8 0"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Explora nuestro catálogo y encuentra <br />la protección perfecta
              </p>
              <button
                onClick={() => { closeCart(); navigate('/productos'); }}
                className="px-6 py-3 bg-gradient-to-r from-primary-color to-primary-dark text-white font-bold rounded-xl shadow-md hover:-translate-y-0.5 transition-transform border-0 cursor-pointer"
              >
                Ver Productos →
              </button>
            </div>
          ) : (
            <div className="py-2">
              <AnimatePresence initial={false}>
                {items.map((item, index) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex gap-4 p-4 mb-3 bg-white rounded-xl shadow-sm border border-gray-100"
                  >
                  {/* Image */}
                  <div className="relative">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg bg-gray-50 border border-gray-100"
                      />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 text-3xl rounded-lg border border-gray-100">
                        🛡️
                      </div>
                    )}
                    {/* Quantity badge */}
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-primary-color to-primary-dark rounded-full flex items-center justify-center text-[11px] font-bold text-white border-2 border-white">
                      {item.quantity}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="m-0 mb-1 text-sm font-bold text-gray-900 leading-tight truncate">
                        {item.product.name}
                      </h4>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-transparent border-0 cursor-pointer flex-shrink-0"
                        onClick={() => removeItem(item.productId)}
                        title="Eliminar"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2"></path>
                        </svg>
                      </button>
                    </div>

                    <p className="m-0 mb-2 text-xs text-gray-400">
                      {item.product.sku}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1 border border-gray-100">
                        <button
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-primary-color hover:bg-gray-200 rounded-md transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-50"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="w-7 text-center font-bold text-sm text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-primary-color hover:bg-gray-200 rounded-md transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-50"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="m-0 text-[15px] font-bold text-primary-color">
                          €{item.totalPrice.toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="m-0 text-xs text-gray-400">
                            €{item.unitPrice.toFixed(2)} c/u
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
            {/* Free shipping progress */}
            {subtotal < 100 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[13px] font-semibold text-emerald-700">
                    🚚 Añade €{remaining.toFixed(2)} más para envío gratis
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${freeShippingProgress}%` }} />
                </div>
              </div>
            )}
            {subtotal >= 100 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 text-center text-[13px] font-semibold text-emerald-800">
                🎉 ¡Tienes envío gratis!
              </div>
            )}

            {/* Subtotal */}
            <div className="mb-3">
              <div className="flex justify-between mb-1.5">
                <span className="text-[13px] text-gray-500">Subtotal</span>
                <span className="text-[13px] text-gray-700">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[13px] text-gray-500">IVA (21%)</span>
                <span className="text-[13px] text-gray-700">€{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[13px] text-gray-500">Envío</span>
                <span className={`text-[13px] ${shipping === 0 ? 'text-emerald-500 font-semibold' : 'text-gray-700'}`}>
                  {shipping === 0 ? 'Gratis 🎉' : `€${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t-2 border-gray-100">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-[17px] font-bold text-primary-color">€{total.toFixed(2)}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              className="w-full py-3 px-4 bg-primary-color hover:bg-primary-dark text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-3 border-0 cursor-pointer"
              onClick={() => { closeCart(); navigate('/checkout'); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
              </svg>
              Tramitar Pedido · €{total.toFixed(2)}
            </button>

            <button
              onClick={() => { closeCart(); navigate('/carrito'); }}
              className="w-full p-2.5 bg-transparent border-0 text-gray-500 hover:text-primary-color text-[13px] font-semibold cursor-pointer transition-colors"
            >
              Ver carrito completo →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
