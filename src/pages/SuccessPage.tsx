import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type PaymentMethod = 'card' | 'bank_transfer' | 'bizum';

interface SuccessState {
  orderNumber?: string;
  paymentMethod?: PaymentMethod;
  total?: number;
  customerEmail?: string;
}

function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as SuccessState) || {};

  const {
    orderNumber = 'PW-XXXXXXXX',
    paymentMethod = 'card',
    total = 0,
    customerEmail = '',
  } = state;

  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const getPaymentMethodInfo = () => {
    switch (paymentMethod) {
      case 'bank_transfer':
        return {
          icon: '🏦',
          title: 'Transferencia Bancaria',
          desc: 'Realiza la transferencia con el número de pedido como concepto. Tu pedido se procesará al verificar el pago.',
          color: '#059669',
          bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          border: '#bbf7d0',
        };
      case 'bizum':
        return {
          icon: '📱',
          title: 'Bizum',
          desc: 'Envía el Bizum con el número de pedido como concepto. Recibirás confirmación en cuanto verifiquemos el pago.',
          color: '#2563eb',
          bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
          border: '#bfdbfe',
        };
      default:
        return {
          icon: '💳',
          title: 'Tarjeta',
          desc: 'Tu pago ha sido procesado correctamente.',
          color: '#2e559e',
          bg: 'linear-gradient(135deg, #f0f4ff, #eef2ff)',
          border: 'rgba(46,85,158,0.2)',
        };
    }
  };

  const pmInfo = getPaymentMethodInfo();

  // Confetti particles
  const confettiColors = ['#2e559e', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 50%, #f0f9ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(46,85,158,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Confetti */}
      {confettiColors.map((color, i) => (
        Array.from({ length: 3 }).map((_, j) => (
          <div
            key={`${i}-${j}`}
            style={{
              position: 'absolute',
              top: '-20px',
              left: `${(i * 18 + j * 6)}%`,
              width: 8 + (j * 3),
              height: 8 + (j * 3),
              background: color,
              borderRadius: j % 2 === 0 ? '50%' : '2px',
              animation: `confetti-fall ${2.5 + i * 0.4 + j * 0.2}s linear ${i * 0.3 + j * 0.1}s forwards`,
              opacity: 0.8,
            }}
          />
        ))
      ))}

      <div style={{ maxWidth: 580, width: '100%', position: 'relative' }}>
        {/* Main card */}
        <div style={{
          background: 'white',
          borderRadius: 24,
          boxShadow: '0 24px 80px rgba(46,85,158,0.12)',
          overflow: 'hidden',
          animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Header gradient */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a6e, #2e559e)',
            padding: '2rem',
            textAlign: 'center',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 300, height: 300,
              background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
              borderRadius: '50%',
            }} />

            {/* Checkmark */}
            <div className="success-checkmark-circle" style={{ position: 'relative', zIndex: 1 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                style={{ strokeDasharray: 100, strokeDashoffset: 0, animation: 'checkmark 0.6s ease 0.3s both' }}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1 style={{ color: 'white', fontSize: '1.625rem', fontWeight: 700, margin: '0 0 0.5rem', position: 'relative', zIndex: 1 }}>
              ¡Pedido realizado!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.9375rem', position: 'relative', zIndex: 1 }}>
              Gracias por comprar en Protex Wear
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '2rem' }}>

            {/* Order number */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f4ff, #eef2ff)',
              border: '1.5px solid rgba(46,85,158,0.12)',
              borderRadius: 14,
              padding: '1.25rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Número de Pedido
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#2e559e', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  {orderNumber}
                </span>
                <button
                  onClick={copyOrderNumber}
                  style={{
                    padding: '0.375rem 0.75rem',
                    background: copied ? '#10b981' : 'rgba(46,85,158,0.12)',
                    border: 'none',
                    borderRadius: 8,
                    color: copied ? 'white' : '#2e559e',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {copied ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '0.8125rem', color: '#6b7280' }}>
                Guarda este número para hacer seguimiento de tu pedido
              </p>
            </div>

            {/* Payment method info */}
            <div style={{
              background: pmInfo.bg,
              border: `1.5px solid ${pmInfo.border}`,
              borderRadius: 14,
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}>
              <span style={{ fontSize: '2rem', flexShrink: 0 }}>{pmInfo.icon}</span>
              <div>
                <h4 style={{ margin: '0 0 0.375rem', fontSize: '0.9375rem', fontWeight: 700, color: '#1a2a4a' }}>
                  {pmInfo.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.5 }}>
                  {pmInfo.desc}
                </p>
              </div>
            </div>

            {/* Email confirmation */}
            {customerEmail && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: 12,
                marginBottom: '1.5rem',
                border: '1px solid #f3f4f6',
              }}>
                <div style={{
                  width: 36, height: 36,
                  background: 'linear-gradient(135deg, #eef2ff, #dbeafe)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  📧
                </div>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '0.875rem', fontWeight: 600, color: '#1a2a4a' }}>
                    Confirmación enviada
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280' }}>
                    Hemos enviado los detalles del pedido a{' '}
                    <strong style={{ color: '#2e559e' }}>{customerEmail}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Total */}
            {total > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.25rem',
                background: 'linear-gradient(135deg, #1a2a4a, #2e559e)',
                borderRadius: 14,
                marginBottom: '1.5rem',
              }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 500 }}>Total del pedido</span>
                <span style={{ color: 'white', fontSize: '1.375rem', fontWeight: 700 }}>€{total.toFixed(2)}</span>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.875rem' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: 'linear-gradient(135deg, #2e559e, #1e3a6e)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(46,85,158,0.4)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Inicio
              </button>
              <button
                onClick={() => navigate('/productos')}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: 'transparent',
                  color: '#2e559e',
                  border: '2px solid rgba(46,85,158,0.2)',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(46,85,158,0.04)'; e.currentTarget.style.borderColor = '#2e559e'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(46,85,158,0.2)'; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 001.94 1.61h9.72a2 2 0 001.95-1.61L23 6H6"></path>
                </svg>
                Seguir comprando
              </button>
            </div>

            {/* Auto-redirect */}
            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8125rem', color: '#9ca3af' }}>
              Redirigiendo al inicio en{' '}
              <span style={{ fontWeight: 700, color: '#2e559e' }}>{countdown}s</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
