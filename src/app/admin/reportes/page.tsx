'use client';
import React from 'react';

export default function ReportsViewPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <span className="text-2xl">📊</span> Reportes y Analíticas
        </h1>
        <p className="text-gray-500 mt-2">Visualiza métricas avanzadas y descarga reportes de ventas.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Módulo en Construcción</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
          Estamos migrando el sistema de reportes avanzados a la nueva plataforma. Pronto podrás exportar datos a Excel, PDF y ver gráficos interactivos de rendimiento.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          Próximamente disponible
        </div>
      </div>
    </div>
  );
}
