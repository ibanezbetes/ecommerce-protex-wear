'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on the client
    const consent = localStorage.getItem('protex_cookie_consent');
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('protex_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('protex_cookie_consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] pointer-events-none p-4 md:p-6 flex justify-center">
      <div 
        className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-2xl shadow-indigo-900/10 rounded-3xl p-6 md:p-8 max-w-4xl w-full flex flex-col md:flex-row items-center gap-6 md:gap-8 transform transition-all translate-y-0"
        role="dialog" 
        aria-labelledby="cookie-title" 
        aria-describedby="cookie-desc"
      >
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl" aria-hidden="true">🍪</span>
            <h3 id="cookie-title" className="text-xl font-black text-gray-900 tracking-tight">
              Uso de Cookies
            </h3>
          </div>
          <p id="cookie-desc" className="text-sm text-gray-600 leading-relaxed font-medium">
            Utilizamos cookies propias y de terceros, así como almacenamiento local, para garantizar el correcto funcionamiento de la pasarela de pago y recordar tu carrito de la compra. Puedes consultar nuestra{' '}
            <Link href="/politica-de-privacidad" className="text-indigo-600 hover:text-indigo-800 font-bold underline underline-offset-2 transition-colors">
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <button 
            onClick={handleReject} 
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors border border-transparent"
          >
            Rechazar opcionales
          </button>
          <button 
            onClick={handleAccept} 
            className="px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all border border-transparent"
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  );
}
