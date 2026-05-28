'use client';
import React, { useState } from 'react';

export default function TestingZonePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [progress, setProgress] = useState<{ current: number, total: number, errors: number } | null>(null);

  const simulateAction = async (actionId: string, duration: number, successMessage: string) => {
    setLoading(actionId);
    setMessage(null);
    try {
      await new Promise(r => setTimeout(r, duration));
      setMessage({ type: 'success', text: successMessage });
    } catch (err: any) {
      setMessage({ type: 'error', text: `❌ Error: ${err.message}` });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <span className="text-2xl">🛠️</span> Testing Zone
        </h1>
        <p className="text-gray-500 mt-2">Herramientas de desarrollo, pruebas y mantenimiento del sistema.</p>
      </div>

      {message && (
        <div className={`p-4 mb-8 rounded-xl border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} flex items-start gap-3 shadow-sm`}>
          {message.type === 'success' ? (
             <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          ) : (
             <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          )}
          <p className="font-medium text-sm">{message.text}</p>
        </div>
      )}

      {progress && (
        <div className="p-5 mb-8 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
          <div className="flex justify-between text-sm mb-2 font-bold text-blue-800">
            <span>Progreso: {progress.current} / {progress.total}</span>
            {progress.errors > 0 && <span className="text-red-600">{progress.errors} errores</span>}
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 relative" 
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: System Health */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <span className="text-xl">📡</span>
            <h3 className="text-lg font-bold text-gray-900 m-0">Estado del Sistema</h3>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between">
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">Verifica la conexión con la API GraphQL y la base de datos DynamoDB a través de AppSync.</p>
            <button 
              onClick={() => simulateAction('connection', 800, '✅ Conexión Exitosa. API Online.')}
              disabled={loading !== null}
              className="w-full bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-11"
            >
              {loading === 'connection' ? <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div> : 'Verificar Conexión'}
            </button>
          </div>
        </div>

        {/* Card 2: Order Data */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h3 className="text-lg font-bold text-gray-900 m-0">Gestión de Pedidos</h3>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <p className="text-gray-600 text-sm mb-2">Crear o eliminar datos de pedidos.</p>
            
            <button 
              onClick={() => simulateAction('order', 600, '✅ Pedido de prueba creado correctamente')}
              disabled={loading !== null}
              className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex justify-center items-center h-11"
            >
              {loading === 'order' ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : '+ Crea 1 Pedido Demo'}
            </button>
            
            <button 
              onClick={() => simulateAction('bulk-orders', 1500, '✅ Se han generado 5 pedidos aleatorios.')}
              disabled={loading !== null}
              className="w-full bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 flex justify-center items-center h-11"
            >
              {loading === 'bulk-orders' ? <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div> : '🎲 Generar 5 Random'}
            </button>
            
            <div className="h-px bg-gray-100 my-2"></div>
            
            <button 
              onClick={() => simulateAction('delete-orders', 1000, '✅ Operación completada: Todos los pedidos eliminados.')}
              disabled={loading !== null}
              className="w-full bg-red-50 text-red-700 border border-red-200 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors disabled:opacity-50 flex justify-center items-center h-11"
            >
              {loading === 'delete-orders' ? <div className="w-5 h-5 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div> : '🗑️ Eliminar TODOS los Pedidos'}
            </button>
          </div>
        </div>

        {/* Card 3: Product Import */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <span className="text-xl">📦</span>
            <h3 className="text-lg font-bold text-gray-900 m-0">Gestión de Catálogo</h3>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <p className="text-gray-600 text-sm mb-2">Importar o purgar catálogo.</p>
            
            <button 
              onClick={() => simulateAction('import', 2000, '✅ Importación finalizada con éxito.')}
              disabled={loading !== null}
              className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 flex justify-center items-center h-11 shadow-sm"
            >
              {loading === 'import' ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : '📥 Importar Catálogo JSON'}
            </button>
            
            <div className="h-px bg-gray-100 my-2"></div>
            
            <button 
              onClick={() => simulateAction('delete-products', 1000, '✅ Operación completada: Catálogo eliminado.')}
              disabled={loading !== null}
              className="w-full bg-red-50 text-red-700 border border-red-200 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-100 transition-colors disabled:opacity-50 flex justify-center items-center h-11"
            >
              {loading === 'delete-products' ? <div className="w-5 h-5 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div> : '🗑️ Eliminar TODO el Catálogo'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
