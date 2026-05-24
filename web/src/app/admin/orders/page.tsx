'use client';
import { useState } from 'react';

const MOCK_ORDERS = [
  { id: 'ORD-5432', customer: 'empresa1@vip.com', total: 450.50, method: 'Pago Diferido', status: 'PENDIENTE_PAGO' },
  { id: 'ORD-9876', customer: 'user2@gmail.com', total: 85.00, method: 'Stripe (Bizum)', status: 'EN_PREPARACION' },
  { id: 'ORD-1122', customer: 'tienda@b2b.com', total: 1200.00, method: 'Transferencia', status: 'ENVIADO' },
];

const STATUS_OPTIONS = ['PENDIENTE_PAGO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

export default function OrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      console.log(`Ejecutando mutación para el pedido ${orderId} -> ${newStatus}`);
      alert(`Estado de ${orderId} actualizado a ${newStatus}`);
    } catch (error) {
      console.error(error);
      alert('Error actualizando el estado del pedido');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Gestión de Pedidos</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-semibold">ID Pedido</th>
              <th className="px-6 py-4 font-semibold">Cliente</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Método Pago</th>
              <th className="px-6 py-4 font-semibold">Estado Actual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-indigo-600 font-medium">{order.id}</td>
                <td className="px-6 py-4 text-gray-700">{order.customer}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{order.total.toFixed(2)}€</td>
                <td className="px-6 py-4 text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">{order.method}</span>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-sm rounded border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 font-semibold
                      ${order.status === 'EN_PREPARACION' ? 'text-blue-700 bg-blue-50' : ''}
                      ${order.status === 'ENVIADO' ? 'text-orange-700 bg-orange-50' : ''}
                      ${order.status === 'ENTREGADO' ? 'text-green-700 bg-green-50' : ''}
                      ${order.status === 'PENDIENTE_PAGO' ? 'text-gray-700 bg-gray-50' : ''}
                    `}
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status.replace('_', ' ')}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
