import React from 'react';
import styles from './PaymentMethodSelector.module.css';

export type PaymentMethod = 'card' | 'bank_transfer' | 'bizum';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

interface MethodOption {
  id: PaymentMethod;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badges?: string[];
}

const PAYMENT_METHODS: MethodOption[] = [
  {
    id: 'card',
    icon: (
      <div className={styles.cardLogos}>
        <svg viewBox="0 0 24 24" className={styles.visaIcon} xmlns="http://www.w3.org/2000/svg">
          <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" fill="#1A1F71"/>
        </svg>
        <svg viewBox="0 0 24 16" className={styles.mastercardIcon} xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="8" fill="#EB001B" />
          <circle cx="16" cy="8" r="8" fill="#F79E1B" opacity="0.9" />
          <path d="M 12 1.07 A 8 8 0 0 0 12 14.93 A 8 8 0 0 0 12 1.07" fill="#FF5F00" />
        </svg>
      </div>
    ),
    title: 'Tarjeta de Crédito / Débito',
    subtitle: 'Visa, Mastercard, Amex. Pago inmediato y seguro',
    badges: ['Pago instantáneo', 'SSL cifrado'],
  },
  {
    id: 'bank_transfer',
    icon: (
      <svg viewBox="0 0 24 24" className={styles.bankIcon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
      </svg>
    ),
    title: 'Transferencia Bancaria',
    subtitle: 'Pago por transferencia con IBAN. 1-2 días hábiles',
    badges: ['Sin comisiones'],
  },
  {
    id: 'bizum',
    icon: (
      <svg viewBox="0 0 122 36" className={styles.bizumIcon} xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M59.8625 12.8257c-1.0347 0-1.8704.8358-1.8704 1.8308v13.8113c0 1.0348.8357 1.8707 1.8704 1.8707s1.8704-.8359 1.8704-1.8707V14.6565c0-.995-.8357-1.8308-1.8704-1.8308Zm-.0001-6.88561c-1.154 0-2.1091.95524-2.1091 2.1095 0 1.15425.9551 2.14931 2.1091 2.14931 1.1541 0 2.1092-.95526 2.1092-2.14931 0-1.15426-.9551-2.1095-2.1092-2.1095ZM78.089 14.6566c0-1.1543-.9153-1.5921-1.751-1.5921h-9.2725c-.9153 0-1.6316.7164-1.6316 1.5921 0 .9154.7163 1.6319 1.6316 1.6319h6.0888l-7.8796 10.9853c-.2388.3184-.3581.7562-.3581 1.1144 0 1.1543.9153 1.7911 1.7112 1.7911h9.8296c.9153 0 1.6316-.7164 1.6316-1.6319 0-.9154-.7163-1.6318-1.6316-1.6318h-6.6062l7.7204-10.7466c.398-.5572.5174-1.0348.5174-1.5124Zm-27.3 8.6769c0 2.2687-.9949 3.6618-3.2633 3.6618-2.2683 0-3.2234-1.3931-3.2234-3.6618v-7.045h3.3826c2.7459 0 3.1041 1.5125 3.1041 3.1842v3.8608Zm3.7408-3.9404c0-3.8608-2.0296-6.3683-6.7653-6.3683h-3.4224V7.81078c0-1.03485-.8357-1.87069-1.8306-1.87069-1.0347 0-1.8704.83584-1.8704 1.87069V23.3335c0 3.8608 2.0693 7.0051 6.9642 7.0051 4.8551 0 6.9643-3.1841 6.9643-7.0051v-3.9404h-.0398Zm38.1642-6.5674c-1.0346 0-1.8704.8358-1.8704 1.8706v8.6371c0 2.2687-.9949 3.6617-3.2632 3.6617-2.2684 0-3.2235-1.393-3.2235-3.6617v-8.6371c0-1.0348-.8357-1.8706-1.8306-1.8706-1.0347 0-1.8704.8358-1.8704 1.8706v8.6371c0 3.8607 2.0694 7.0051 6.9643 7.0051 4.8551 0 6.9642-3.1842 6.9642-7.0051v-8.6371c-.0397-1.0348-.8755-1.8706-1.8704-1.8706Zm28.374 7.0451c0-3.8608-1.79-7.0052-6.645-7.0052-2.189 0-3.741.6369-4.816 1.7115-1.074-1.0348-2.626-1.7115-4.815-1.7115-4.8552 0-6.646 3.1842-6.646 7.0052v8.637c0 1.0348.8357 1.8707 1.8306 1.8707 1.0344 0 1.8704-.8359 1.8704-1.8707v-8.637c0-2.2687.716-3.6618 2.945-3.6618 2.268 0 2.945 1.3931 2.945 3.6618v8.637c0 1.0348.836 1.8707 1.83 1.8707 1.035 0 1.871-.8359 1.871-1.8707v-8.637c0-2.2687.716-3.6618 2.945-3.6618 2.268 0 2.945 1.3931 2.945 3.6618v8.637c0 1.0348.835 1.8707 1.83 1.8707 1.035 0 1.871-.8359 1.871-1.8707l.039-8.637ZM6.61567 12.8655c1.31327.9553 3.14387.6767 4.09893-.6368l3.4225-4.73643c.9551-1.31346.6765-3.14434-.6367-4.09959-1.3133-.95524-3.1439-.67663-4.09902.63683L5.93914 8.76593c-.9153 1.31347-.63673 3.14437.67653 4.09957ZM22.2952 6.17881c-1.3133-.95524-3.1439-.67663-4.099.63683L4.42685 25.7613c-.9551 1.3135-.67653 3.1444.63673 4.0996 1.31326.9553 3.14387.6767 4.09897-.6368L22.9319 10.2784c.9949-1.31345.6765-3.14434-.6367-4.09959ZM5.3024 4.66637c.9551-1.31346.67652-3.14435-.63674-4.099591C3.3524-.388466 1.52179-.109853.566693 1.20361c-.9551 1.31346-.676529 3.14435.636737 4.09959 1.31326.95525 3.14387.67663 4.09897-.63683ZM26.1952 30.6968c-1.3132-.9553-3.1438-.6766-4.0989.6368-.9551 1.3135-.6766 3.1444.6367 4.0996 1.3133.9553 3.1439.6766 4.099-.6368.9551-1.3135.6765-3.1444-.6368-4.0996Zm-5.3724-7.5226c-1.3132-.9552-3.1438-.6766-4.0989.6369l-3.4623 4.7364c-.9551 1.3134-.6765 3.1443.6367 4.0996 1.3133.9552 3.1439.6766 4.099-.6369l3.4623-4.7364c.9551-1.3134.6765-3.1443-.6368-4.0996Z" fill="#00C4B4"/>
      </svg>
    ),
    title: 'Bizum',
    subtitle: 'Pago móvil instantáneo desde tu app bancaria',
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
