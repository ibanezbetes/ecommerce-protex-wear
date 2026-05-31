'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Feedback/ToastProvider';
import styles from './CartDrawer.module.css';

export function CartDrawer() {
  const { isCartOpen, closeCart, items, subtotal, removeItem, updateQuantity, itemCount } = useCart();
  const router = useRouter();
  const toast = useToast();

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

  return (
    <div className={styles.shell}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.backdrop}
        onClick={closeCart}
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 210 }}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
      >
        <div className={styles.header}>
          <div className={styles.headerIntro}>
            <div className={styles.headerIcon} aria-hidden="true">
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div>
              <h2 className={styles.title}>Mi carrito</h2>
              <p className={styles.subtitle}>
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={closeCart} aria-label="Cerrar carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon} aria-hidden="true">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <h3 className={styles.emptyTitle}>Tu carrito est&aacute; vac&iacute;o</h3>
              <p className={styles.emptyText}>
                Explora el cat&aacute;logo y encuentra el equipo de protecci&oacute;n que necesitas.
              </p>
              <button onClick={goToProducts} className={styles.primaryButton}>
                Ver productos
              </button>
            </div>
          ) : (
            <div className={styles.items}>
              <AnimatePresence initial={false}>
                {items.map((item, index) => (
                  <motion.div
                    key={item.variantId}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.24, delay: index * 0.03 }}
                    className={styles.item}
                  >
                    <div className={styles.imageWrap}>
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className={styles.imageFallback}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 7h-4V5a4 4 0 0 0-8 0v2H4l1 14h14l1-14Z" />
                            <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                          </svg>
                        </div>
                      )}
                      <div className={styles.quantityBadge}>{item.quantity}</div>
                    </div>

                    <div className={styles.itemBody}>
                      <div className={styles.itemTop}>
                        <div>
                          <h4 className={styles.itemName}>{item.name}</h4>
                          <p className={styles.itemRef}>Ref: {item.variantId}</p>
                        </div>
                        <button
                          className={styles.removeButton}
                          onClick={() => handleRemoveItem(item.variantId)}
                          title="Eliminar"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18" />
                            <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                            <path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          </svg>
                        </button>
                      </div>

                      <div className={styles.itemBottom}>
                        <div className={styles.stepper} aria-label={`Cantidad de ${item.name}`}>
                          <button
                            className={styles.stepButton}
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Reducir cantidad"
                          >
                            -
                          </button>
                          <span className={styles.stepValue}>{item.quantity}</span>
                          <button
                            className={styles.stepButton}
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        <div className={styles.priceBlock}>
                          <p className={styles.linePrice}>{(item.price * item.quantity).toFixed(2)}&euro;</p>
                          {item.quantity > 1 && (
                            <p className={styles.unitPrice}>{item.price.toFixed(2)}&euro; / ud.</p>
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

        {items.length > 0 && (
          <div className={styles.footer}>
            {subtotal < 100 ? (
              <div className={styles.shippingBox}>
                <div className={styles.shippingLabel}>
                  <span>Env&iacute;o gratis desde 100&euro;</span>
                  <span>Faltan {remaining.toFixed(2)}&euro;</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressBar} style={{ width: `${freeShippingProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className={styles.freeShippingBox}>Tienes env&iacute;o gratis</div>
            )}

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span className={styles.summaryValue}>{subtotal.toFixed(2)}&euro;</span>
              </div>
              <div className={styles.summaryRow}>
                <span>IVA (21%)</span>
                <span className={styles.summaryValue}>{tax.toFixed(2)}&euro;</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Env&iacute;o</span>
                <span className={shipping === 0 ? styles.freeValue : styles.summaryValue}>
                  {shipping === 0 ? 'Gratis' : `${shipping.toFixed(2)}\u20ac`}
                </span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>{total.toFixed(2)}&euro;</span>
              </div>
            </div>

            <button className={styles.checkoutButton} onClick={goToCheckout}>
              <span>Tramitar pedido</span>
              <span>{total.toFixed(2)}&euro;</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
