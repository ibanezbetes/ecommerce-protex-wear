import React, { useState } from 'react';
import { BUSINESS_CONFIG } from '../../services/emailService';

interface BankTransferDetailsProps {
  orderNumber: string;
  total: number;
}

export function BankTransferDetails({ orderNumber, total }: BankTransferDetailsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // fallback
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

  const fields = [
    { label: 'Banco', value: BUSINESS_CONFIG.bankName, id: 'bank' },
    { label: 'Titular', value: BUSINESS_CONFIG.bankAccountHolder, id: 'holder' },
    { label: 'IBAN', value: BUSINESS_CONFIG.bankIBAN, id: 'iban' },
    { label: 'BIC / SWIFT', value: BUSINESS_CONFIG.bankBIC, id: 'bic' },
    { label: 'Importe', value: `€${total.toFixed(2)}`, id: 'amount' },
    { label: 'Concepto', value: orderNumber, id: 'concept', highlight: true },
  ];

  return (
    <div className="bank-info-panel animate-fade-in-up" style={{ marginTop: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.375rem' }}>🏦</span>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#065f46' }}>
            Instrucciones de Transferencia
          </h4>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#047857', opacity: 0.8 }}>
            Realiza la transferencia con estos datos
          </p>
        </div>
      </div>

      {fields.map((field) => (
        <div key={field.id} className="bank-info-field">
          <span className="bank-info-label">{field.label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              className="bank-info-value"
              style={field.highlight ? {
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '0.25rem 0.625rem',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              } : undefined}
            >
              {field.value}
            </span>
            <button
              className={`copy-btn ${copied === field.id ? 'copied' : ''}`}
              onClick={() => copyToClipboard(field.value, field.id)}
            >
              {copied === field.id ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
        </div>
      ))}

      <div style={{
        marginTop: '1rem',
        padding: '0.875rem',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: '10px',
        border: '1px solid rgba(16, 185, 129, 0.2)',
      }}>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#065f46', lineHeight: 1.6 }}>
          <strong>⚠️ Importante:</strong> Incluye el número de pedido{' '}
          <strong style={{ fontFamily: 'monospace', background: '#d1fae5', padding: '1px 6px', borderRadius: '4px' }}>
            {orderNumber}
          </strong>{' '}
          como concepto de la transferencia para que podamos identificar tu pago.
        </p>
      </div>

      <div style={{
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#047857' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Recibirás confirmación de envío cuando verifiquemos el pago
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#047857' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          El proceso puede tardar 1-2 días hábiles
        </div>
      </div>
    </div>
  );
}
