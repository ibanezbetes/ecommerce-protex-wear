'use client';
import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import { PaymentMethodSelector, PaymentMethod } from '@/components/checkout/PaymentMethodSelector';
import { BankTransferDetails } from '@/components/checkout/BankTransferDetails';
import { BizumDetails } from '@/components/checkout/BizumDetails';
import { useToast } from '@/components/Feedback/ToastProvider';
import styles from './page.module.css';

export default function CheckoutPage() {
  const { user, isGuest } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber] = useState(() => 'PW-' + Date.now().toString(36).toUpperCase());

  const isVip = !isGuest && user?.can_pay_later === true;

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          orderId: orderNumber,
          userEmail: user?.email,
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
      toast.error({
        title: 'No se pudo iniciar el pago',
        message: 'Revisa tu conexion o intenta de nuevo en unos segundos.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualPayment = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrderPlaced(true);
      clearCart();
      toast.success({
        title: 'Pedido registrado',
        message: 'Hemos guardado tu pedido correctamente.',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeferredPayment = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearCart();
      toast.success({
        title: 'Pedido confirmado',
        message: 'El pedido con pago diferido se ha confirmado correctamente.',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successPanel}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>Pedido registrado</h2>
          <p className={styles.successText}>
            Tu n&uacute;mero de pedido es: <strong>{orderNumber}</strong>
          </p>
          <div className={styles.note}>
            Hemos guardado tu pedido. Por favor, realiza el pago seg&uacute;n las instrucciones proporcionadas para que podamos procesarlo.
          </div>
          <button onClick={() => window.location.href = '/'} className={styles.button}>
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Resumen del Pedido</h3>
          </div>

          <ul className={styles.items}>
            {items.map((item) => (
              <li key={item.variantId} className={styles.item}>
                <div>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemMeta}>Cantidad: {item.quantity}</p>
                </div>
                <div className={styles.itemPrice}>
                  {(item.price * item.quantity).toFixed(2)}&euro;
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.total}>
            <span>Total a pagar</span>
            <span className={styles.totalPrice}>{cartTotal.toFixed(2)}&euro;</span>
          </div>

          <div className={styles.payment}>
            {isVip ? (
              <div className={styles.vipBox}>
                <h4 className={styles.vipTitle}>Facturaci&oacute;n diferida activada</h4>
                <p className={styles.vipText}>
                  Como cliente B2B autorizado, puedes confirmar el pedido ahora sin realizar el pago inmediato.
                </p>
                <button
                  onClick={handleDeferredPayment}
                  disabled={loading || items.length === 0}
                  className={styles.button}
                >
                  {loading ? 'Procesando...' : 'Confirmar Pedido (Pago Diferido)'}
                </button>
              </div>
            ) : (
              <div className={styles.paymentStack}>
                <div>
                  <h4 className={styles.sectionTitle}>M&eacute;todo de Pago</h4>
                  <PaymentMethodSelector selected={paymentMethod} onChange={setPaymentMethod} />
                </div>

                {paymentMethod === 'bank_transfer' && (
                  <BankTransferDetails orderNumber={orderNumber} total={cartTotal} />
                )}
                {paymentMethod === 'bizum' && (
                  <BizumDetails orderNumber={orderNumber} total={cartTotal} />
                )}

                <div className={styles.divider}>
                  {paymentMethod === 'card' ? (
                    <button
                      onClick={handleStripePayment}
                      disabled={loading || items.length === 0}
                      className={`${styles.button} ${styles.buttonDark}`}
                    >
                      {loading ? 'Procesando...' : 'Pagar de forma segura (Stripe)'}
                    </button>
                  ) : (
                    <button
                      onClick={handleManualPayment}
                      disabled={loading || items.length === 0}
                      className={styles.button}
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
