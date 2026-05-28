'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const { isCartOpen, closeCart, items, subtotal, removeItem, updateQuantity, itemCount } = useCart();
  const router = useRouter();

  useEffect(() => {
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
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" 
        onClick={closeCart} 
      />

      {/* Drawer Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col z-10"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">
              🛒
            </div>
            <div>
              <h2 className="text-lg font-bold">Mi Carrito</h2>
              <p className="text-white/70 text-sm">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <button 
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors" 
            onClick={closeCart} 
            aria-label="Cerrar carrito"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 01-8 0"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                Explora nuestro catálogo y encuentra la protección perfecta
              </p>
              <button
                onClick={() => { closeCart(); router.push('/productos'); }}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
              >
                Ver Productos →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item, index) => (
                  <motion.div
                    key={item.variantId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 group"
                  >
                    {/* Image */}
                    <div className="relative">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl border border-gray-100"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-gray-100 flex items-center justify-center text-3xl">
                          🛡️
                        </div>
                      )}
                      {/* Quantity badge */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white shadow-sm">
                        {item.quantity}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-gray-900 text-sm truncate">
                            {item.name}
                          </h4>
                          <button
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex-shrink-0"
                            onClick={() => removeItem(item.variantId)}
                            title="Eliminar"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2"></path>
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Ref: {item.variantId}</p>
                      </div>

                      <div className="flex items-end justify-between mt-3">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
                          <button
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all disabled:opacity-50"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-bold text-indigo-700 text-sm">
                            €{(item.price * item.quantity).toFixed(2)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">
                              €{item.price.toFixed(2)} c/u
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
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {/* Free shipping progress */}
            {subtotal < 100 && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-emerald-700">
                    🚚 Añade €{remaining.toFixed(2)} más para envío gratis
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${freeShippingProgress}%` }} 
                  />
                </div>
              </div>
            )}
            {subtotal >= 100 && (
              <div className="mb-5 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center text-sm font-bold text-emerald-700">
                🎉 ¡Tienes envío gratis!
              </div>
            )}

            {/* Subtotal */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900 font-medium">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">IVA (21%)</span>
                <span className="text-gray-900 font-medium">€{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Envío</span>
                <span className={`font-medium ${shipping === 0 ? 'text-emerald-600 font-bold' : 'text-gray-900'}`}>
                  {shipping === 0 ? 'Gratis 🎉' : `€${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed border-gray-200">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-indigo-700">€{total.toFixed(2)}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
              onClick={() => { closeCart(); router.push('/checkout'); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
              </svg>
              Tramitar Pedido · €{total.toFixed(2)}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
