import React, { useState } from 'react';
import { BUSINESS_CONFIG } from '@/lib/config';

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
    <div className="mt-5 animate-fade-in-up bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">📱</span>
        <div>
          <h4 className="m-0 text-base font-bold text-blue-900">
            Instrucciones de Bizum
          </h4>
          <p className="m-0 text-sm text-blue-800 opacity-80">
            Envía el pago desde tu app bancaria
          </p>
        </div>
      </div>

      <p className="text-sm text-blue-900 font-semibold mb-2">
        Número de teléfono al que enviar:
      </p>

      {/* Phone number display */}
      <div className="relative mb-6">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center text-3xl font-mono font-bold tracking-widest text-blue-900">
          {BUSINESS_CONFIG.bizumPhone}
        </div>
        <button
          onClick={() => copyToClipboard(BUSINESS_CONFIG.bizumPhone, 'phone')}
          className={`absolute bottom-3 right-3 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
            copied === 'phone' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-blue-700 border border-blue-200 shadow-sm hover:bg-blue-50'
          }`}
        >
          {copied === 'phone' ? '✓ Copiado' : 'Copiar número'}
        </button>
      </div>

      {/* Amount and concept */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border-2 border-blue-100">
          <p className="m-0 mb-1 text-xs text-gray-500 font-bold uppercase tracking-wider">
            Importe
          </p>
          <p className="m-0 text-xl font-bold text-blue-900 font-mono">
            €{total.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border-2 border-blue-100 relative">
          <p className="m-0 mb-1 text-xs text-gray-500 font-bold uppercase tracking-wider">
            Concepto
          </p>
          <div className="flex items-center justify-between">
            <p className="m-0 text-lg font-bold text-blue-900 font-mono truncate mr-2">
              {orderNumber}
            </p>
            <button
              onClick={() => copyToClipboard(orderNumber, 'concept')}
              className={`px-2 py-1 rounded text-xs font-bold transition-all flex-shrink-0 ${
                copied === 'concept' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              {copied === 'concept' ? '✓' : 'Copiar'}
            </button>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-blue-50 rounded-xl p-5 mb-4">
        <p className="m-0 mb-3 text-sm font-bold text-blue-900">
          Pasos para pagar con Bizum:
        </p>
        {[
          'Abre la app de tu banco y accede a Bizum',
          `Envía ${total.toFixed(2)}€ al número ${BUSINESS_CONFIG.bizumPhone}`,
          `Escribe "${orderNumber}" como concepto`,
          'Confirma el pago y listo',
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3 mb-2 last:mb-0">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white mt-0.5">
              {i + 1}
            </div>
            <p className="m-0 text-sm text-blue-900 leading-relaxed">{step}</p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
        <p className="m-0 text-sm text-blue-900 leading-relaxed">
          <strong>⚠️ Importante:</strong> Incluye el número de pedido{' '}
          <strong className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-800">
            {orderNumber}
          </strong>{' '}
          como concepto. Recibirás confirmación cuando verifiquemos el pago.
        </p>
      </div>
    </div>
  );
}
