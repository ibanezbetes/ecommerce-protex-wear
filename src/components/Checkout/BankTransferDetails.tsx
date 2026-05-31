import React, { useState } from 'react';
import { BUSINESS_CONFIG } from '@/lib/config';

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
    <div className="mt-5 animate-fade-in-up bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🏦</span>
        <div>
          <h4 className="m-0 text-base font-bold text-emerald-800">
            Instrucciones de Transferencia
          </h4>
          <p className="m-0 text-sm text-emerald-700 opacity-80">
            Realiza la transferencia con estos datos
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{field.label}</span>
            <div className="flex items-center gap-3">
              <span
                className={`font-mono text-sm font-bold text-gray-900 ${
                  field.highlight ? 'bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md border border-emerald-200' : ''
                }`}
              >
                {field.value}
              </span>
              <button
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  copied === field.id 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => copyToClipboard(field.value, field.id)}
              >
                {copied === field.id ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
        <p className="m-0 text-sm text-emerald-800 leading-relaxed">
          <strong>⚠️ Importante:</strong> Incluye el número de pedido{' '}
          <strong className="font-mono bg-emerald-200 px-2 py-0.5 rounded text-emerald-900">
            {orderNumber}
          </strong>{' '}
          como concepto de la transferencia para que podamos identificar tu pago.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-emerald-700">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Recibirás confirmación de envío cuando verifiquemos el pago
        </div>
        <div className="flex items-center gap-2 text-sm text-emerald-700">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          El proceso puede tardar 1-2 días hábiles
        </div>
      </div>
    </div>
  );
}
