'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Usamos el "any" aquí para que funcione sin problemas de tipos (ya que Next.js page props types cambian un poco con App Router)
export default function OrderDetailPage({ params }: { params: any }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Desempaquetamos `id` asincrónicamente o sincrónicamente según cómo Next.js maneje params
  // En Next.js 14+ `params` puede ser una promesa, pero React puede usar `use` o simplemente un `useEffect`.
  // Asumimos que podemos obtener id sincrónicamente por ahora para la demostración
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Para asegurar compatibilidad con App Router asíncrono
    Promise.resolve(params).then(p => {
      setOrderId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (!orderId) return;

    // Simulate fetch
    const fetchOrder = async () => {
      try {
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        setOrder({
          id: orderId,
          orderDate: '2023-10-25T14:30:00Z',
          status: 'PENDING',
          customerName: 'María García',
          customerEmail: 'maria.g@example.com',
          customerCompany: 'Tech Solutions LLC',
          shippingAddress: JSON.stringify({
            street: 'Av. de la Innovación 45, Planta 2',
            city: 'Madrid',
            state: 'Madrid',
            postalCode: '28020',
            country: 'España'
          }),
          items: JSON.stringify([
            { name: 'Casco de Seguridad', sku: 'CAS-001', quantity: 2, price: 45.00 },
            { name: 'Guantes de Protección', sku: 'GUA-002', quantity: 5, price: 12.50 }
          ]),
          subtotal: 152.50,
          taxAmount: 32.02,
          shippingAmount: 5.00,
          discountAmount: 0,
          totalAmount: 189.52,
          paymentMethod: 'TARJETA',
          paymentStatus: 'PAID'
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    // Simulate update
    await new Promise(r => setTimeout(r, 500));
    setOrder((prev: any) => ({ ...prev, status: newStatus }));
    setUpdating(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROCESSING': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED':
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'REFUNDED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading || !orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-600 font-medium">Cargando detalles del pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 max-w-3xl mx-auto w-full text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido no encontrado</h2>
        <p className="text-gray-500 mb-6">El pedido que estás buscando no existe o ha sido eliminado.</p>
        <Link href="/admin/pedidos" className="text-indigo-600 font-semibold hover:text-indigo-800">
          ← Regresar a Pedidos
        </Link>
      </div>
    );
  }

  const items = order.items ? JSON.parse(order.items) : [];
  const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : {};

  return (
    <div className="p-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <Link href="/admin/pedidos" className="text-sm font-semibold text-gray-500 hover:text-indigo-600 flex items-center gap-1 mb-3 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Volver a Pedidos
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-mono tracking-tight mb-1">
            Pedido #{order.id.substring(0, 8)}...
          </h1>
          <p className="text-gray-500 text-sm">Realizado el {new Date(order.orderDate).toLocaleString('es-ES')}</p>
        </div>
        
        <div className="w-full md:w-auto">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Estado del Pedido</label>
          <select
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={updating}
            className={`w-full md:w-48 px-4 py-2.5 rounded-xl border-2 font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${getStatusStyle(order.status)}`}
          >
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Customer Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Detalles del Cliente</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-0.5">Nombre</p>
                  <p className="font-semibold text-gray-900">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-0.5">Email</p>
                  <p className="font-semibold text-gray-900">{order.customerEmail}</p>
                </div>
                {order.customerCompany && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-0.5">Empresa</p>
                    <p className="font-semibold text-gray-900">{order.customerCompany}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Dirección de Envío</h3>
              <div className="text-gray-700 leading-relaxed space-y-1">
                <p className="font-medium text-gray-900">{shippingAddress.street}</p>
                <p>{shippingAddress.city}, {shippingAddress.state}</p>
                <p>{shippingAddress.postalCode}</p>
                <p className="font-medium text-gray-900">{shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 m-0">Productos del Pedido</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Producto</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4 text-right">Cantidad</th>
                    <th className="px-6 py-4 text-right">Precio</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.sku || '-'}</td>
                      <td className="px-6 py-4 text-right font-medium">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-gray-600">€{item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">€{(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-8">
          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Resumen</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">€{order.subtotal.toFixed(2)}</span>
              </div>
              {order.taxAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>IVA</span>
                  <span className="font-medium text-gray-900">€{order.taxAmount.toFixed(2)}</span>
                </div>
              )}
              {order.shippingAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="font-medium text-gray-900">€{order.shippingAmount.toFixed(2)}</span>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span className="font-medium">-€{order.discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="font-bold text-gray-900 text-lg">Total</span>
              <span className="font-black text-2xl text-indigo-600">€{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Información de Pago</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Método de Pago</p>
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                  {order.paymentMethod === 'TARJETA' ? (
                    <svg className="text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                  ) : (
                    <svg className="text-indigo-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
                  )}
                  {order.paymentMethod || 'No especificado'}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Estado del Pago</p>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                  {order.paymentStatus || 'PENDING'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
