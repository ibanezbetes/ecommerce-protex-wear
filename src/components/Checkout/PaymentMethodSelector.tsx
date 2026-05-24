import React from 'react';

type PaymentMethod = 'card' | 'bank_transfer' | 'bizum';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

interface MethodOption {
  id: PaymentMethod;
  icon: string;
  title: string;
  subtitle: string;
  iconClass: string;
  cardClass: string;
  badges?: string[];
}

const PAYMENT_METHODS: MethodOption[] = [
  {
    id: 'card',
    icon: '💳',
    title: 'Tarjeta de Crédito / Débito',
    subtitle: 'Visa, Mastercard, Amex — Pago inmediato y seguro',
    iconClass: 'card-icon',
    cardClass: 'card-method',
    badges: ['Pago instantáneo', 'SSL cifrado'],
  },
  {
    id: 'bank_transfer',
    icon: '🏦',
    title: 'Transferencia Bancaria',
    subtitle: 'Pago por transferencia con IBAN — 1-2 días hábiles',
    iconClass: 'bank-icon',
    cardClass: 'bank-method',
    badges: ['Sin comisiones'],
  },
  {
    id: 'bizum',
    icon: '📱',
    title: 'Bizum',
    subtitle: 'Pago móvil instantáneo desde tu app bancaria',
    iconClass: 'bizum-icon',
    cardClass: 'bizum-method',
    badges: ['Pago inmediato', 'Gratis'],
  },
];

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {PAYMENT_METHODS.map((method, index) => {
        const isSelected = selected === method.id;
        return (
          <div
            key={method.id}
            className={`payment-method-card ${method.cardClass} ${isSelected ? 'selected' : ''} animate-fade-in-up delay-${(index + 1) * 100}`}
            onClick={() => onChange(method.id)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? onChange(method.id) : undefined}
          >
            {isSelected && (
              <div className="payment-selected-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
              <div className={`payment-method-icon ${method.iconClass}`}>
                {method.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: isSelected ? '#1a2a4a' : '#374151',
                    transition: 'color 0.2s ease',
                  }}>
                    {method.title}
                  </h4>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '0.8125rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}>
                  {method.subtitle}
                </p>
                {method.badges && (
                  <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {method.badges.map(badge => (
                      <span key={badge} style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: isSelected ? '#2e559e' : '#6b7280',
                        background: isSelected ? 'rgba(46, 85, 158, 0.08)' : '#f3f4f6',
                        padding: '0.1875rem 0.5rem',
                        borderRadius: '999px',
                        transition: 'all 0.2s ease',
                        letterSpacing: '0.02em',
                      }}>
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom radio */}
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: `2px solid ${isSelected ? '#2e559e' : '#d1d5db'}`,
                background: isSelected ? '#2e559e' : 'white',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isSelected ? '0 0 0 4px rgba(46, 85, 158, 0.15)' : 'none',
              }}>
                {isSelected && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'white',
                    animation: 'scaleIn 0.15s ease',
                  }} />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
