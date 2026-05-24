'use client';
import { useState } from 'react';

export default function PricingPage() {
  const [userId, setUserId] = useState('');
  const [productId, setProductId] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !productId || !customPrice) return;
    
    setLoading(true);
    try {
      console.log(`Guardando precio de ${customPrice}€ para el usuario ${userId} en producto ${productId}`);
      await new Promise(r => setTimeout(r, 800));
      alert(`✅ Precio especial asignado correctamente.`);
      
      setUserId('');
      setProductId('');
      setCustomPrice('');
    } catch (error) {
      console.error(error);
      alert('Error al asignar el precio especial.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h1 className="text-xl font-bold text-gray-800">Asignar Precios Especiales</h1>
        <p className="text-sm text-gray-500 mt-1">Crea reglas de precios personalizados (B2B) para clientes específicos.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID del Cliente (Email o ID)</label>
          <input 
            type="text" 
            placeholder="ej: dani-test"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Referencia del Producto (Padre)</label>
          <input 
            type="text" 
            placeholder="ej: 01001"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Precio Base (€)</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">€</span>
            </div>
            <input 
              type="number" 
              step="0.01"
              min="0"
              placeholder="9.99"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">Este precio sobrescribirá el precio de TODAS las variantes de este producto solo para este usuario.</p>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-md shadow-sm disabled:opacity-50 transition-colors"
          >
            {loading ? 'Guardando...' : 'Guardar Precio Especial'}
          </button>
        </div>
      </form>
    </div>
  );
}
