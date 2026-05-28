import React from 'react';
import styles from './PaymentMethodSelector.module.css';

export type PaymentMethod = 'card' | 'bank_transfer' | 'bizum';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

interface MethodOption {
  id: PaymentMethod;
  icon: string;
  title: string;
  subtitle: string;
  badges?: string[];
}

const PAYMENT_METHODS: MethodOption[] = [
  {
    id: 'card',
    icon: 'CARD',
    title: 'Tarjeta de Cr\u00e9dito / D\u00e9bito',
    subtitle: 'Visa, Mastercard, Amex. Pago inmediato y seguro',
    badges: ['Pago instant\u00e1neo', 'SSL cifrado'],
  },
  {
    id: 'bank_transfer',
    icon: 'IBAN',
    title: 'Transferencia Bancaria',
    subtitle: 'Pago por transferencia con IBAN. 1-2 d\u00edas h\u00e1biles',
    badges: ['Sin comisiones'],
  },
  {
    id: 'bizum',
    icon: 'BZ',
    title: 'Bizum',
    subtitle: 'Pago m\u00f3vil instant\u00e1neo desde tu app bancaria',
    badges: ['Pago inmediato', 'Gratis'],
  },
];

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className={styles.methods} role="radiogroup" aria-label="Metodo de pago">
      {PAYMENT_METHODS.map((method) => {
        const isSelected = selected === method.id;
        return (
          <div
            key={method.id}
            className={`${styles.option} ${isSelected ? styles.selected : ''}`}
            onClick={() => onChange(method.id)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onChange(method.id);
            }}
          >
            {isSelected && (
              <div className={styles.checkCorner}>
                <svg className={styles.check} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}

            <div className={styles.row}>
              <div className={styles.icon}>{method.icon}</div>

              <div className={styles.content}>
                <h4 className={styles.title}>{method.title}</h4>
                <p className={styles.subtitle}>{method.subtitle}</p>
                {method.badges && (
                  <div className={styles.badges}>
                    {method.badges.map((badge) => (
                      <span key={badge} className={styles.badge}>
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.radio}>
                {isSelected && <div className={styles.dot} />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
