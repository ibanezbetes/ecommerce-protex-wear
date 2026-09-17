'use client';

import React, { useState } from 'react';

/**
 * Botón Flotante de WhatsApp para Contacto Directo
 * Número de atención: +34 628 85 45 00
 */
export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = '34628854500';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip flotante al pasar el cursor */}
      <div
        className={`hidden sm:flex items-center gap-2 bg-white text-slate-800 text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200/80 transition-all duration-300 pointer-events-none ${
          isHovered
            ? 'opacity-100 translate-x-0 scale-100'
            : 'opacity-0 translate-x-3 scale-95'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span>¿Dudas o pedidos? ¡Escríbenos por WhatsApp!</span>
      </div>

      {/* Botón Principal (estático, sin parpadeos) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95 group"
        aria-label="Abrir conversación en WhatsApp con Protex Wear (+34 628 85 45 00)"
        title="Contactar por WhatsApp (+34 628 85 45 00)"
      >
        {/* Icono oficial SVG de WhatsApp */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-7 h-7 fill-current drop-shadow-sm"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
      </a>
    </div>
  );
}
