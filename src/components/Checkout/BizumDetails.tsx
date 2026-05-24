import React, { useState } from 'react';
import { BUSINESS_CONFIG } from '../../services/emailService';

interface BizumDetailsProps {
  orderNumber: string;
  total: number;
}

export function BizumDetails({ orderNumber, total }: BizumDetailsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="bizum-panel animate-fade-in-up" style={{ marginTop: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.375rem' }}>📱</span>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#1e40af' }}>
            Instrucciones de Bizum
          </h4>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#1d4ed8', opacity: 0.8 }}>
            Envía el pago desde tu app bancaria
          </p>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: '0 0 0.5rem 0', fontWeight: 500 }}>
        Número de teléfono al que enviar:
      </p>

      {/* Phone number display */}
      <div style={{ position: 'relative' }}>
        <div className="bizum-phone-display">
          {BUSINESS_CONFIG.bizumPhone}
        </div>
        <button
          onClick={() => copyToClipboard(BUSINESS_CONFIG.bizumPhone, 'phone')}
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            padding: '0.375rem 0.875rem',
            background: copied === 'phone' ? '#3b82f6' : 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            color: copied === 'phone' ? 'white' : '#1e40af',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {copied === 'phone' ? '✓ Copiado' : 'Copiar número'}
        </button>
      </div>

      {/* Amount and concept */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '10px',
          padding: '0.875rem',
          border: '1.5px solid rgba(59, 130, 246, 0.2)',
        }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Importe
          </p>
          <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#1e40af', fontFamily: 'monospace' }}>
            €{total.toFixed(2)}
          </p>
        </div>
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '10px',
          padding: '0.875rem',
          border: '1.5px solid rgba(59, 130, 246, 0.2)',
          position: 'relative',
        }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Concepto
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#1e40af', fontFamily: 'monospace' }}>
              {orderNumber}
            </p>
            <button
              onClick={() => copyToClipboard(orderNumber, 'concept')}
              style={{
                padding: '0.2rem 0.5rem',
                background: copied === 'concept' ? '#3b82f6' : 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '5px',
                color: copied === 'concept' ? 'white' : '#1e40af',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginLeft: '0.25rem',
                flexShrink: 0,
              }}
            >
              {copied === 'concept' ? '✓' : 'Copiar'}
            </button>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div style={{
        background: 'rgba(255,255,255,0.6)',
        borderRadius: '10px',
        padding: '0.875rem 1rem',
        marginBottom: '0.75rem',
      }}>
        <p style={{ margin: '0 0 0.625rem 0', fontSize: '0.8125rem', fontWeight: 700, color: '#1e40af' }}>
          Pasos para pagar con Bizum:
        </p>
        {[
          'Abre la app de tu banco y accede a Bizum',
          `Envía ${total.toFixed(2)}€ al número ${BUSINESS_CONFIG.bizumPhone}`,
          `Escribe "${orderNumber}" como concepto`,
          'Confirma el pago y listo',
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: i < 3 ? '0.5rem' : 0 }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: 'white',
            }}>
              {i + 1}
            </div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#1e40af', lineHeight: 1.5 }}>{step}</p>
          </div>
        ))}
      </div>

      <div style={{
        padding: '0.75rem 1rem',
        background: 'rgba(255,255,255,0.5)',
        borderRadius: '8px',
        border: '1px solid rgba(59, 130, 246, 0.15)',
      }}>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#1e40af', lineHeight: 1.6 }}>
          <strong>⚠️ Importante:</strong> Incluye el número de pedido{' '}
          <strong style={{ fontFamily: 'monospace', background: '#dbeafe', padding: '1px 6px', borderRadius: '4px' }}>
            {orderNumber}
          </strong>{' '}
          como concepto. Recibirás confirmación cuando verifiquemos el pago.
        </p>
      </div>
    </div>
  );
}
