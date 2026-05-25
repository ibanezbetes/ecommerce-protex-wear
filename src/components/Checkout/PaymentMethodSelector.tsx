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
  iconBg: string;
  badges?: string[];
}

const PAYMENT_METHODS: MethodOption[] = [
  {
    id: 'card',
    icon: '💳',
    title: 'Tarjeta de Crédito / Débito',
    subtitle: 'Visa, Mastercard, Amex — Pago inmediato y seguro',
    iconBg: 'bg-blue-100 text-blue-600',
    badges: ['Pago instantáneo', 'SSL cifrado'],
  },
  {
    id: 'bank_transfer',
    icon: '🏦',
    title: 'Transferencia Bancaria',
    subtitle: 'Pago por transferencia con IBAN — 1-2 días hábiles',
    iconBg: 'bg-indigo-100 text-indigo-600',
    badges: ['Sin comisiones'],
  },
  {
    id: 'bizum',
    icon: '📱',
    title: 'Bizum',
    subtitle: 'Pago móvil instantáneo desde tu app bancaria',
    iconBg: 'bg-cyan-100 text-cyan-600',
    badges: ['Pago inmediato', 'Gratis'],
  },
];

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="flex flex-col gap-3.5">
      {PAYMENT_METHODS.map((method, index) => {
        const isSelected = selected === method.id;
        return (
          <div
            key={method.id}
            className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
              isSelected 
                ? 'border-primary-color bg-blue-50/50 shadow-md transform -translate-y-0.5' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onChange(method.id)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? onChange(method.id) : undefined}
          >
            {isSelected && (
              <div className="absolute top-0 right-0 w-10 h-10 overflow-hidden">
                <div className="absolute top-[-20px] right-[-20px] w-10 h-10 bg-primary-color rotate-45 transform origin-center"></div>
                <svg className="absolute top-1 right-1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}

            <div className="flex items-center gap-4 relative">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 ${method.iconBg}`}>
                {method.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h4 className={`m-0 text-[15px] font-bold transition-colors duration-200 ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {method.title}
                  </h4>
                </div>
                <p className="m-0 text-[13px] text-gray-500 leading-snug">
                  {method.subtitle}
                </p>
                {method.badges && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {method.badges.map(badge => (
                      <span key={badge} className={`text-[11px] font-semibold px-2 py-0.5 rounded-full transition-all duration-200 tracking-wide ${
                        isSelected 
                          ? 'text-primary-color bg-primary-color/10' 
                          : 'text-gray-500 bg-gray-100'
                      }`}>
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom radio */}
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                isSelected 
                  ? 'border-primary-color bg-primary-color shadow-[0_0_0_4px_rgba(46,85,158,0.15)]' 
                  : 'border-gray-300 bg-white'
              }`}>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white animate-scale-in" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
