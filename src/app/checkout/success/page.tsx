'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ShoppingBag, Mail, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/store/useCart';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'ORD-DEMO';
  const method = searchParams.get('method') || 'card';
  const [mounted, setMounted] = useState(false);
  const { clearCart } = useCart();

  useEffect(() => {
    setMounted(true);
    // Vaciar el carrito porque el pedido ya se ha completado
    clearCart();
  }, [clearCart]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Animated check icon */}
        <div style={{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
          animation: mounted ? 'successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
        }}>
          <CheckCircle size={52} color="white" />
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#111827',
          margin: '0 0 0.75rem',
          lineHeight: 1.2,
        }}>
          ¡Pedido Confirmado!
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: '#4b5563',
          margin: '0 0 2rem',
          lineHeight: 1.6,
        }}>
          Gracias por tu compra. Hemos recibido tu pedido y lo estamos preparando con mucho cariño.
        </p>

        {/* Order Number Box */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem' }}>
            Número de pedido
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2e559e', margin: '0 0 2rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            {orderNumber}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            {[
              { icon: <Mail size={28} />, title: 'Confirmación', desc: 'Te enviaremos un email de confirmación' },
              { icon: <Package size={28} />, title: 'Preparación', desc: 'Tu pedido está siendo preparado' },
              { icon: <ShoppingBag size={28} />, title: 'Envío', desc: 'Lo recibirás en los próximos días' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ color: '#2e559e' }}>{step.icon}</div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', margin: 0 }}>{step.title}</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {method === 'bank_transfer' && (
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left',
            color: '#92400e',
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} /> Instrucciones de Transferencia
            </h3>
            <p style={{ margin: '0 0 0.5rem' }}>Por favor, realiza la transferencia a la siguiente cuenta:</p>
            <ul style={{ margin: '0 0 1rem', paddingLeft: '1.5rem', fontWeight: 600 }}>
              <li><strong>Banco:</strong> Banco Santander</li>
              <li><strong>IBAN:</strong> ES12 3456 7890 1234 5678 9012</li>
              <li><strong>Titular:</strong> Protex Wear S.L.</li>
              <li><strong>Concepto:</strong> Pedido {orderNumber}</li>
            </ul>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Tu pedido se procesará tan pronto como recibamos el pago en nuestra cuenta bancaria.</p>
          </div>
        )}

        {method === 'invoice' && (
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left',
            color: '#1e40af',
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} /> Pago a 30 Días
            </h3>
            <p style={{ margin: 0, fontSize: '0.9375rem' }}>
              Procesaremos tu pedido de inmediato. Recibirás la factura por correo electrónico con las instrucciones para abonarla en un plazo de 30 días.
            </p>
          </div>
        )}

        {/* Trust message */}
        {(method === 'card' || method === 'bizum') && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            fontSize: '0.9375rem',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <CheckCircle size={20} color="#16a34a" />
            <span>Pago procesado de forma <strong>segura</strong> con encriptación SSL de Stripe.</span>
          </div>
        )}

        <Link
          href="/productos"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#2e559e',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
        >
          Seguir comprando <ArrowRight size={18} />
        </Link>

        <style>{`
          @keyframes successPop {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ color: '#2e559e', fontWeight: 'bold' }}>Cargando confirmación...</div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
