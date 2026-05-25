import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CartPage — Premium shopping cart with full product management
 */
function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, subtotal, removeItem, updateQuantity, clearCart, discountCode, discountAmount, applyDiscountCode, removeDiscountCode } = useCart();
  const { showToast } = useToast();
  
  const [promoInput, setPromoInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const discountedSubtotal = Math.max(0, subtotal - (discountAmount || 0));
  const tax = discountedSubtotal * 0.21;
  const shipping = discountedSubtotal > 100 ? 0 : 9.99;
  const total = discountedSubtotal + tax + shipping;
  const freeShippingProgress = Math.min((discountedSubtotal / 100) * 100, 100);
  const remaining = Math.max(100 - discountedSubtotal, 0);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    
    setIsApplyingPromo(true);
    const success = await applyDiscountCode(promoInput.trim());
    setIsApplyingPromo(false);
    
    if (success) {
      showToast('¡Código promocional aplicado con éxito!', 'success');
      setPromoInput('');
    } else {
      showToast('El código introducido no es válido o ha caducado', 'error');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  // --- Empty cart state ---
  if (items.length === 0) {
    return (
      <div className="cart-page-bg" style={{ padding: '4rem 1rem' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <div className="cart-empty-icon animate-bounce-gentle">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 01-8 0"></path>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a2a4a', marginBottom: '0.75rem' }}>
            Tu carrito está vacío
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Aún no has añadido ningún producto. Explora nuestro catálogo y encuentra la protección perfecta.
          </p>
          <button
            onClick={() => navigate('/productos')}
            style={{
              padding: '0.875rem 2rem',
              background: 'linear-gradient(135deg, #2e559e, #1e3a6e)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(46,85,158,0.4)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 001.94 1.61h9.72a2 2 0 001.95-1.61L23 6H6"></path>
            </svg>
            Explorar Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-bg">
      {/* Hero header */}
      <div className="cart-header">
        <div className="container">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ color: 'white', fontSize: '1.875rem', fontWeight: 700, margin: '0 0 0.375rem' }}>
              Carrito de Compras
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '0.9375rem' }}>
              {items.length} {items.length === 1 ? 'producto' : 'productos'} · €{subtotal.toFixed(2)} de subtotal
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4" style={{ paddingBottom: '4rem' }}>
        <div className="checkout-layout pt-8">

            {/* ---- Items column ---- */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1a2a4a' }}>
                  Productos ({items.length})
                </h2>
                <button
                  onClick={clearCart}
                  style={{
                    padding: '0.375rem 0.75rem',
                    background: 'transparent',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#fef2f2'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2"></path>
                  </svg>
                  Vaciar carrito
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AnimatePresence initial={false}>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="cart-item-card"
                    >
                      <div style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem' }}>
                      {/* Image */}
                      <div style={{
                        width: 100,
                        height: 100,
                        borderRadius: 12,
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                        border: '1px solid rgba(46,85,158,0.08)',
                        position: 'relative',
                      }}>
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.5rem',
                          }}>
                            🛡️
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.375rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1a2a4a', lineHeight: 1.3 }}>
                            {item.product.name}
                          </h3>
                          <button
                            className="cart-remove-btn"
                            onClick={() => removeItem(item.productId)}
                            title="Eliminar producto"
                            style={{ flexShrink: 0 }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2"></path>
                            </svg>
                          </button>
                        </div>

                        <p style={{ margin: '0 0 0.25rem', fontSize: '0.8125rem', color: '#9ca3af' }}>
                          Ref: {item.product.sku}
                        </p>

                        {item.product.stock <= 10 && (
                          <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
                            ⚡ Solo quedan {item.product.stock} unidades
                          </p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
                          {/* Quantity */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: '#f9fafb',
                            borderRadius: '12px',
                            padding: '0.375rem',
                            border: '1px solid #f3f4f6',
                          }}>
                            <button
                              className="cart-qty-btn"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              className="cart-qty-display"
                              value={item.quantity}
                              min={1}
                              max={item.product.stock}
                              onChange={e => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val > 0) updateQuantity(item.productId, val);
                              }}
                            />
                            <button
                              className="cart-qty-btn"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              +
                            </button>
                          </div>

                          {/* Prices */}
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#2e559e' }}>
                              €{item.totalPrice.toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#9ca3af' }}>
                                {item.quantity} × €{item.unitPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

              {/* Continue shopping */}
              <button
                onClick={() => navigate('/productos')}
                style={{
                  marginTop: '1.25rem',
                  padding: '0.75rem 1.25rem',
                  background: 'transparent',
                  border: '1.5px solid rgba(46,85,158,0.2)',
                  borderRadius: '10px',
                  color: '#2e559e',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(46,85,158,0.04)'; e.currentTarget.style.borderColor = '#2e559e'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(46,85,158,0.2)'; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Continuar comprando
              </button>
            </div>

            {/* ---- Summary column ---- */}
            <div style={{ alignSelf: 'flex-start', position: 'sticky', top: '1.5rem' }}>
              <div className="cart-summary-panel animate-slide-in-right">
                {/* Header */}
                <div className="cart-summary-header">
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'white' }}>
                    Resumen del Pedido
                  </h2>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  {/* Item list */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    {items.map(item => (
                      <div key={item.productId} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid #f9fafb',
                        gap: '1rem',
                      }}>
                        <span style={{ fontSize: '0.875rem', color: '#374151', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.quantity}× {item.product.name}
                        </span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a2a4a', flexShrink: 0 }}>
                          €{item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Subtotal</span>
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>€{subtotal.toFixed(2)}</span>
                    </div>
                    {discountCode && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          Descuento ({discountCode})
                          <button onClick={() => { removeDiscountCode(); showToast('Descuento eliminado', 'info'); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, fontSize: '0.75rem' }}>✕</button>
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>-€{(discountAmount || 0).toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>IVA (21%)</span>
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>€{tax.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Envío estimado</span>
                      <span style={{ fontSize: '0.875rem', color: shipping === 0 ? '#10b981' : '#374151', fontWeight: shipping === 0 ? 600 : 400 }}>
                        {shipping === 0 ? '¡Gratis! 🎉' : `€${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingTop: '0.875rem',
                      borderTop: '2px solid #f3f4f6',
                    }}>
                      <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1a2a4a' }}>Total</span>
                      <span style={{ fontSize: '1.1875rem', fontWeight: 700, color: '#2e559e' }}>€{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  {!discountCode && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Código de descuento"
                          disabled={isApplyingPromo}
                          style={{
                            flex: 1,
                            padding: '0.625rem 0.875rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            outline: 'none',
                            textTransform: 'uppercase'
                          }}
                        />
                        <button
                          type="submit"
                          disabled={isApplyingPromo || !promoInput.trim()}
                          style={{
                            padding: '0.625rem 1rem',
                            background: '#1a2a4a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: isApplyingPromo || !promoInput.trim() ? 'not-allowed' : 'pointer',
                            opacity: isApplyingPromo || !promoInput.trim() ? 0.7 : 1,
                            transition: 'background 0.2s'
                          }}
                        >
                          {isApplyingPromo ? '...' : 'Aplicar'}
                        </button>
                      </form>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.375rem' }}>Pista: prueba PROTEX10 o MINUS5</p>
                    </div>
                  )}

                  {/* Free shipping progress */}
                  {subtotal < 100 && (
                    <div className="free-shipping-progress" style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#065f46' }}>
                          🚚 Envío gratis desde €100
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#047857' }}>
                          {freeShippingProgress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="free-shipping-bar-track">
                        <div className="free-shipping-bar-fill" style={{ width: `${freeShippingProgress}%` }} />
                      </div>
                      <p style={{ margin: '0.375rem 0 0', fontSize: '0.75rem', color: '#047857' }}>
                        Añade €{remaining.toFixed(2)} más para envío gratis
                      </p>
                    </div>
                  )}

                  {/* Checkout CTA */}
                  <button
                    className="cart-checkout-btn"
                    onClick={handleCheckout}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                        <line x1="2" y1="10" x2="22" y2="10"></line>
                      </svg>
                      Tramitar Pedido
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </span>
                  </button>

                  {/* Trust badges */}
                  <div className="trust-badges" style={{ marginTop: '1rem' }}>
                    <div className="trust-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      Pago seguro SSL
                    </div>
                    <div className="trust-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Devolución garantizada
                    </div>
                    <div className="trust-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Envío 24-48h
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
