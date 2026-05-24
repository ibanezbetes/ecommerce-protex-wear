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
    <div className="cart-drawer-overlay">
      {/* Backdrop */}
      <div className="cart-drawer-backdrop" onClick={closeCart} />

      {/* Drawer Panel */}
      <div className="cart-drawer-panel">
        {/* Header */}
        <div className="cart-drawer-header">
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
          <button className="cart-drawer-close-btn" onClick={closeCart} aria-label="Cerrar carrito">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '3rem 1rem',
            }}>
              <div className="cart-empty-icon animate-bounce-gentle">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 01-8 0"></path>
                </svg>
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.0625rem', fontWeight: 700, color: '#1a2a4a' }}>
                Tu carrito está vacío
              </h3>
              <p style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.5 }}>
                Explora nuestro catálogo y encuentra <br />la protección perfecta
              </p>
              <button
                onClick={() => { closeCart(); navigate('/productos'); }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #2e559e, #1e3a6e)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseOut={e => (e.currentTarget.style.transform = '')}
              >
                Ver Productos →
              </button>
            </div>
          ) : (
            <div style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
              <AnimatePresence initial={false}>
                {items.map((item, index) => (
                  <motion.div
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="cart-drawer-item"
                  >
                  {/* Image */}
                  <div style={{ position: 'relative' }}>
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="cart-drawer-item-img"
                      />
                    ) : (
                      <div className="cart-drawer-item-img" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                        fontSize: '1.75rem',
                      }}>
                        🛡️
                      </div>
                    )}
                    {/* Quantity badge */}
                    <div style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '22px',
                      height: '22px',
                      background: 'linear-gradient(135deg, #2e559e, #1e3a6e)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: 'white',
                      border: '2px solid white',
                    }}>
                      {item.quantity}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <h4 style={{
                        margin: '0 0 0.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#1a2a4a',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.product.name}
                      </h4>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeItem(item.productId)}
                        title="Eliminar"
                        style={{ flexShrink: 0 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 0V4a1 1 0 011-1h2a1 1 0 011 1v2"></path>
                        </svg>
                      </button>
                    </div>

                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                      {item.product.sku}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Quantity controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        padding: '0.25rem',
                        border: '1px solid #f3f4f6',
                      }}>
                        <button
                          className="cart-qty-btn"
                          style={{ width: 28, height: 28, fontSize: '0.875rem' }}
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span style={{ width: 28, textAlign: 'center', fontWeight: 700, fontSize: '0.875rem', color: '#1a2a4a' }}>
                          {item.quantity}
                        </span>
                        <button
                          className="cart-qty-btn"
                          style={{ width: 28, height: 28, fontSize: '0.875rem' }}
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#2e559e' }}>
                          €{item.totalPrice.toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>
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
          <div className="cart-drawer-footer">
            {/* Free shipping progress */}
            {subtotal < 100 && (
              <div className="free-shipping-progress" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#065f46' }}>
                    🚚 Añade €{remaining.toFixed(2)} más para envío gratis
                  </span>
                </div>
                <div className="free-shipping-bar-track">
                  <div className="free-shipping-bar-fill" style={{ width: `${freeShippingProgress}%` }} />
                </div>
              </div>
            )}
            {subtotal >= 100 && (
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                textAlign: 'center',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#065f46',
              }}>
                🎉 ¡Tienes envío gratis!
              </div>
            )}

            {/* Subtotal */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Subtotal</span>
                <span style={{ fontSize: '0.8125rem', color: '#374151' }}>€{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>IVA (21%)</span>
                <span style={{ fontSize: '0.8125rem', color: '#374151' }}>€{tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Envío</span>
                <span style={{ fontSize: '0.8125rem', color: shipping === 0 ? '#10b981' : '#374151', fontWeight: shipping === 0 ? 600 : 400 }}>
                  {shipping === 0 ? 'Gratis 🎉' : `€${shipping.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1.5px solid #f3f4f6' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2a4a' }}>Total</span>
                <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#2e559e' }}>€{total.toFixed(2)}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              className="cart-drawer-checkout-btn"
              onClick={() => { closeCart(); navigate('/checkout'); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
              </svg>
              Tramitar Pedido · €{total.toFixed(2)}
            </button>

            <button
              onClick={() => { closeCart(); navigate('/carrito'); }}
              style={{
                width: '100%',
                padding: '0.625rem',
                background: 'transparent',
                border: 'none',
                color: '#6b7280',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '0.5rem',
                transition: 'color 0.2s ease',
              }}
              onMouseOver={e => (e.currentTarget.style.color = '#2e559e')}
              onMouseOut={e => (e.currentTarget.style.color = '#6b7280')}
            >
              Ver carrito completo →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
