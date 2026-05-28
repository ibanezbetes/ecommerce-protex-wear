'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Feedback/ToastProvider';
import { Fingerprint, Check } from 'lucide-react';
import styles from './CartDrawer.module.css';

const RECOMMENDATIONS = [
  {
    id: 'rec-1',
    productId: 'prod-nitrile-gloves',
    variantId: 'var-nitrile-gloves-l',
    name: 'Guantes Nitrilo Ultra-Resistentes (L)',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 'rec-2',
    productId: 'prod-safety-glasses',
    variantId: 'var-safety-glasses-clear',
    name: 'Gafas de Seguridad Anti-empañamiento',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 'rec-3',
    productId: 'prod-thermal-socks',
    variantId: 'var-thermal-socks-one',
    name: 'Calcetines Térmicos de Trabajo (Pack 3)',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?w=150&auto=format&fit=crop&q=60',
  },
  {
    id: 'rec-4',
    productId: 'prod-ear-defenders',
    variantId: 'var-ear-defenders-high',
    name: 'Orejeras de Protección Acústica Pro',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&auto=format&fit=crop&q=60',
  }
];

export function CartDrawer() {
  const { 
    isCartOpen, 
    closeCart, 
    items, 
    subtotal, 
    removeItem, 
    updateQuantity, 
    itemCount,
    addItem,
    clearCart
  } = useCart();
  const router = useRouter();
  const toast = useToast();

  const [showBiometric, setShowBiometric] = useState(false);
  const [biometricMethod, setBiometricMethod] = useState('');
  const [biometricStatus, setBiometricStatus] = useState<'scanning' | 'success'>('scanning');

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

  const shipping = subtotal > 50 ? 0 : 5.99; // Updated dynamic shipping rate: Free > 50€
  const tax = subtotal * 0.21;
  const total = subtotal + tax + shipping;
  const freeShippingProgress = Math.min((subtotal / 50) * 100, 100);
  const remaining = Math.max(50 - subtotal, 0);

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

  const handleExpressCheckout = (method: string) => {
    setBiometricMethod(method);
    setBiometricStatus('scanning');
    setShowBiometric(true);

    setTimeout(() => {
      setBiometricStatus('success');
      setTimeout(async () => {
        setShowBiometric(false);
        const orderNum = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        try {
          await fetch('/api/send-order-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderNumber: orderNum,
              customerName: 'Comprador Express',
              customerEmail: 'compras@protexwear.com',
              items: items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
              subtotal,
              tax,
              shippingCost: shipping,
              total,
              paymentMethod: method === 'Apple Pay' ? 'apple_pay' : 'google_pay',
              shippingAddress: {
                firstName: 'Comprador',
                lastName: 'Express',
                street: 'Calle de la Gran Vía, 28',
                city: 'Madrid',
                postalCode: '28013',
                country: 'ES',
              },
              shippingMethod: 'standard',
            }),
          });
        } catch (e) {
          console.warn('Fallo al mandar email express:', e);
        }

        clearCart();
        closeCart();
        router.push(`/checkout/success?order=${orderNum}`);
      }, 1500);
    }, 2000);
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
            <>
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

              {/* Cross-selling Carousel Section */}
              <div className={styles.crossSellSection}>
                <h4 className={styles.crossSellTitle}>Completa tu look con estos accesorios</h4>
                <div className={styles.crossSellCarousel}>
                  {RECOMMENDATIONS.map((rec) => (
                    <div key={rec.id} className={styles.crossSellCard}>
                      <img src={rec.image} alt={rec.name} className={styles.crossSellImage} />
                      <div className={styles.crossSellInfo}>
                        <h5 className={styles.crossSellName}>{rec.name}</h5>
                        <p className={styles.crossSellPrice}>{rec.price.toFixed(2)}€</p>
                      </div>
                      <button
                        className={styles.crossSellAddBtn}
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
                            title: 'Accesorio Añadido',
                            message: `${rec.name} se ha agregado a tu carrito.`,
                          });
                        }}
                      >
                        + Añadir
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            {/* Express Checkout buttons */}
            <div className={styles.expressPayBlock}>
              <div className={styles.expressPayTitle}>
                <span className={styles.expressPayLine} />
                <span className={styles.expressPayText}>Pago Rápido Express</span>
                <span className={styles.expressPayLine} />
              </div>
              <div className={styles.expressPayButtons}>
                <button className={styles.applePayBtn} onClick={() => handleExpressCheckout('Apple Pay')}>
                  <svg width="16" height="16" viewBox="0 0 170 170" fill="currentColor" style={{ marginRight: '4px', position: 'relative', top: '-1px' }}>
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.9-14.35-6.08-3.57-2.92-7.54-7.61-11.91-14.07-8.72-13.06-15.02-28.71-18.91-46.96-2.52-11.75-3.79-22.56-3.79-32.41 0-14.82 3.65-27.13 10.96-36.93 7.3-9.8 16.53-14.84 27.68-15.12 6.09 0 12.67 2.12 19.74 6.36 7.08 4.24 10.87 6.36 11.37 6.36.5 0 4.63-2.3 12.4-6.9 7.77-4.6 14.1-6.73 19.01-6.4 16.64.67 29.41 7.21 38.31 19.64-14.88 9.07-22.18 21.32-21.9 36.75.28 12.27 4.96 22.54 14.06 30.8 9.09 8.27 19.98 12.77 32.66 13.51-2.6 7.4-5.83 14.73-9.7 21.98zm-27.42-102.7c0-8.31 3-15.7 8.98-22.17 6-6.48 13.2-10.13 21.61-10.94.13 1.07.2 2.01.2 2.84 0 8.03-3.1 15.42-9.31 22.17-6.2 6.75-13.62 10.6-22.28 11.55-.4-2.15-.6-4.05-.6-6.45z"/>
                  </svg>
                  <span>Pay</span>
                </button>
                <button className={styles.googlePayBtn} onClick={() => handleExpressCheckout('Google Pay')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.googleIcon}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.6-4.53-4.16-4.53z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Pay</span>
                </button>
              </div>
            </div>

            {subtotal < 50 ? (
              <div className={styles.shippingBox}>
                <div className={styles.shippingLabel}>
                  <span>Env&iacute;o gratis desde 50&euro;</span>
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

      {/* FaceID / TouchID Biometric Simulator Modal */}
      <AnimatePresence>
        {showBiometric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.biometricOverlay}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={styles.biometricCard}
            >
              <h3 className={styles.biometricTitle}>Pago Rápido con {biometricMethod}</h3>
              <p className={styles.biometricSubtitle}>
                {biometricStatus === 'scanning' ? 'Verificando datos biométricos...' : 'Identidad Confirmada'}
              </p>

              <div className={`${styles.biometricIconWrapper} ${biometricStatus === 'success' ? styles.biometricIconWrapperSuccess : ''}`}>
                {biometricStatus === 'scanning' && <div className={styles.scanningRing} />}
                {biometricStatus === 'scanning' ? (
                  <Fingerprint size={42} />
                ) : (
                  <Check size={42} />
                )}
              </div>

              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: biometricStatus === 'success' ? '#10b981' : '#3b82f6' }}>
                {biometricStatus === 'scanning' ? 'Escaneando rostro/huella en sandbox...' : '✅ Autorizando cobro de Stripe...'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

