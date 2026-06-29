'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Feedback/ToastProvider';
import { ChevronLeft, ChevronRight, X, Trash2, ShoppingBag } from 'lucide-react';

export function CartDrawer() {
  const { 
    isCartOpen, 
    closeCart, 
    items, 
    subtotal, 
    cartTotal,
    discount,
    discountAmount,
    applyDiscount,
    removeDiscount,
    removeItem, 
    updateQuantity, 
    itemCount,
    addItem
  } = useCart();
  const router = useRouter();
  const toast = useToast();

  const [mockProducts, setMockProducts] = useState<any[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  useEffect(() => {
    if (items.length > 0 && mockProducts.length === 0) {
      import('@/utils/mockCatalog').then(({ MOCK_PRODUCTS }) => {
        setMockProducts(MOCK_PRODUCTS);
      });
    }
  }, [items.length, mockProducts.length]);

  const recommendations = useMemo(() => {
    if (items.length === 0 || mockProducts.length === 0) return [];
    
    const cartItemIds = new Set(items.map(i => i.productId));
    const availableProducts = mockProducts.filter(p => !cartItemIds.has(p.id) && p.variants && p.variants.length > 0);
    
    const firstCartItem = items[0];
    const firstWord = firstCartItem.name.split(' ')[0].toLowerCase();
    
    let related = availableProducts.filter(p => p.name.toLowerCase().includes(firstWord));
    
    if (related.length < 4) {
       const others = availableProducts.filter(p => !related.some(r => r.id === p.id));
       related = [...related, ...others].slice(0, 4);
    } else {
       related = related.slice(0, 4);
    }
    
    return related.map(p => ({
      id: `rec-${p.id}`,
      productId: p.id,
      variantId: p.variants[0].id,
      name: p.name,
      price: p.variants[0].basePrice || 0,
      image: p.variants[0].images?.[0] || 'https://via.placeholder.com/150?text=Protex',
    }));
  }, [items, mockProducts]);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -180, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 180, behavior: 'smooth' });
    }
  };

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

  const SHIPPING_THRESHOLD = 100;
  const SHIPPING_COST = 9;
  const tax = cartTotal * 0.21;
  const cartTotalWithTax = cartTotal + tax;
  const shipping = cartTotalWithTax >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = cartTotalWithTax + shipping;
  const freeShippingProgress = Math.min((cartTotalWithTax / SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(SHIPPING_THRESHOLD - cartTotalWithTax, 0);

  const goToProducts = () => {
    closeCart();
    router.push('/productos');
  };

  const goToCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleRemoveItem = (variantId: string) => {
    removeItem(variantId);
    toast.info({
      title: 'Producto eliminado',
      message: 'El producto se ha eliminado del carrito.',
    });
  };

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountCode.trim()) return;

    setIsApplyingDiscount(true);
    try {
      const res = await fetch('/api/validate-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode, subtotal })
      });
      const data = await res.json();
      
      if (data.valid) {
        applyDiscount({
          code: data.discountType === 'percentage' ? `${data.discount.code} (-${data.discount.value}%)` : `${data.discount.code} (-${data.discount.value}€)`,
          type: data.discountType,
          value: data.discountValue
        });
        setDiscountCode('');
        toast.success({
          title: 'Descuento Aplicado',
          message: 'Se ha aplicado el descuento a tu carrito.',
        });
      } else {
        toast.error({
          title: 'Código Inválido',
          message: data.error || 'El código no es válido.',
        });
      }
    } catch (err) {
      toast.error({
        title: 'Error',
        message: 'No se pudo validar el código.',
      });
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 210 }}
        className="relative w-full max-w-md h-full bg-white flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <ShoppingBag size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Mi carrito</h2>
              <p className="text-xs text-gray-500 font-medium">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors" 
            onClick={closeCart} 
            aria-label="Cerrar carrito"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50/30 p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
                <ShoppingBag size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Tu carrito está vacío</h3>
              <p className="text-sm text-gray-500 max-w-[250px]">
                Explora el catálogo y encuentra el equipo de protección que necesitas.
              </p>
              <button 
                onClick={goToProducts} 
                className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-transform active:scale-95"
              >
                Ver productos
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Items List */}
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                      transition={{ duration: 0.24, delay: index * 0.03 }}
                      className="bg-white border border-gray-100 p-3 rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-24 h-24 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                            <ShoppingBag size={24} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col py-1">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{item.name}</h4>
                            <p className="text-[11px] text-gray-500 font-mono mt-1">Ref: {item.variantId.substring(0, 8)}</p>
                          </div>
                          <button
                            className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            onClick={() => handleRemoveItem(item.variantId)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                            <button
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-l-lg transition-colors disabled:opacity-50"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                            <button
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-r-lg transition-colors"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)}&euro;</p>
                            {item.quantity > 1 && (
                              <p className="text-[11px] text-gray-500">{item.price.toFixed(2)}&euro; / ud.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Cross-selling */}
              {recommendations.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-gray-900">Recomendaciones para ti</h4>
                    <div className="flex gap-1">
                      <button onClick={scrollLeft} className="p-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        <ChevronLeft size={16} />
                      </button>
                      <button onClick={scrollRight} className="p-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div ref={carouselRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="min-w-[140px] w-[140px] snap-start bg-white border border-gray-100 rounded-xl p-2.5 shadow-sm flex flex-col">
                        <div className="w-full h-[110px] bg-gray-50 rounded-lg overflow-hidden mb-2">
                          <img src={rec.image} alt={rec.name} className="w-full h-full object-cover" />
                        </div>
                        <h5 className="text-[11px] font-bold text-gray-800 leading-tight line-clamp-2 mb-1 h-[28px]">{rec.name}</h5>
                        <p className="text-sm font-bold text-indigo-600 mb-2">{rec.price.toFixed(2)}€</p>
                        <button
                          className="mt-auto w-full py-1.5 bg-gray-900 hover:bg-indigo-600 text-white text-[11px] font-bold rounded-lg transition-colors"
                          onClick={() => {
                            addItem({
                              productId: rec.productId,
                              variantId: rec.variantId,
                              name: rec.name,
                              price: rec.price,
                              quantity: 1,
                              image: rec.image
                            });
                            toast.success({
                              title: 'Añadido',
                              message: `${rec.name} agregado al carrito.`,
                            });
                          }}
                        >
                          + Añadir
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-white p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            
            {/* Shipping Progress */}
            {cartTotalWithTax < SHIPPING_THRESHOLD ? (
              <div className="mb-5 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-gray-700">Envío gratis desde {SHIPPING_THRESHOLD}&euro;</span>
                  <span className="text-indigo-600">Faltan {remaining.toFixed(2)}&euro;</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${freeShippingProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="mb-5 bg-green-50 text-green-700 border border-green-200 p-3 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2">
                🎉 ¡Tienes envío gratis!
              </div>
            )}

            {/* Discount Code */}
            <div className="mb-5">
              {!discount ? (
                <form onSubmit={handleApplyDiscount} className="flex gap-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                  </div>
                  <input 
                    type="text" 
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="Código de descuento" 
                    className="flex-1 pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono transition-shadow"
                  />
                  <button 
                    type="submit" 
                    disabled={isApplyingDiscount || !discountCode.trim()}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
                  >
                    {isApplyingDiscount ? '...' : 'Aplicar'}
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <svg className="text-green-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                    <span className="text-sm font-bold text-green-800">{discount.code}</span>
                  </div>
                  <button onClick={removeDiscount} className="text-xs text-green-700 hover:text-green-900 font-bold underline decoration-2 underline-offset-2">
                    Quitar
                  </button>
                </div>
              )}
            </div>

            {/* Totals Summary */}
            <div className="space-y-2.5 mb-6 text-sm">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal (sin IVA)</span>
                <span className="text-gray-900">{subtotal.toFixed(2)}&euro;</span>
              </div>
              {discount && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Descuento</span>
                  <span>-{(discountAmount).toFixed(2)}&euro;</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500 font-medium">
                <span>IVA (21%)</span>
                <span className="text-gray-900">{tax.toFixed(2)}&euro;</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Env&iacute;o</span>
                {shipping === 0 ? (
                  <span className="text-green-600 font-bold uppercase tracking-wider text-[11px] bg-green-100 px-2 py-0.5 rounded-md">Gratis</span>
                ) : (
                  <span className="text-gray-900">{shipping.toFixed(2)}&euro;</span>
                )}
              </div>
              
              <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-indigo-600">{total.toFixed(2)}&euro;</span>
              </div>
            </div>

            <button 
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 font-bold flex justify-center items-center gap-2 transition-all active:scale-[0.98]" 
              onClick={goToCheckout}
            >
              <span>Tramitar pedido</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
