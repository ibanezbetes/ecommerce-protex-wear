import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order } from '../../services/graphql';
import { orderOperations } from '../../services/graphql';
import LoadingSpinner from '../UI/LoadingSpinner';

/**
 * Order Detail Component for Admin Dashboard
 * Displays full order information and allows status updates
 */
function OrderDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) {
            fetchOrder(id);
        }
    }, [id]);

    async function fetchOrder(orderId: string) {
        try {
            const { data: item, errors } = await orderOperations.getOrder(orderId);
            if (item) {
                setOrder(item as Order);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(newStatus: string) {
        if (!order) return;
        setUpdating(true);
        try {
            await orderOperations.updateOrder({
                id: order.id,
                status: newStatus
            } as any); // Type assertion to bypass complex type checking
            setOrder({ ...order, status: newStatus } as Order);
            alert('Estado actualizado exitosamente');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar el estado');
        } finally {
            setUpdating(false);
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'PROCESSING': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            case 'REFUNDED': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <LoadingSpinner size="lg" text="Cargando pedido..." />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 font-bold mb-4">Pedido no encontrado</p>
                <button onClick={() => navigate('/admin/pedidos')} className="text-primary-600 font-semibold hover:text-primary-700">
                    Regresar a Pedidos
                </button>
            </div>
        );
    }

    // Parse JSON fields
    const items = order.items ? JSON.parse(order.items as string) : [];
    const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress as string) : {};

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border">
                <div className="space-y-1">
                    <button
                        onClick={() => navigate('/admin/pedidos')}
                        className="flex items-center gap-1.5 text-gray-500 font-semibold text-sm hover:text-primary-600 mb-2 transition-colors"
                    >
                        ← Volver a Pedidos
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">Pedido #{order.id.substring(0, 12)}...</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        Realizado el {new Date(order.orderDate).toLocaleString('es-ES')}
                    </div>
                </div>

                <div className="w-full sm:w-auto">
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Estado del Pedido</label>
                    <select
                        value={order.status || 'PENDING'}
                        onChange={(e) => updateStatus(e.target.value)}
                        disabled={updating}
                        className={`block w-full sm:w-48 rounded-lg border shadow-sm focus:ring-2 focus:ring-primary-500 text-sm font-semibold p-2.5 ${getStatusColor(order.status || 'PENDING')}`}
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="REFUNDED">REFUNDED</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Detalles del Cliente</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Nombre</p>
                            <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                            <p className="text-sm font-medium text-gray-900">{order.customerEmail}</p>
                        </div>
                        {order.customerCompany && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase">Empresa</p>
                                <p className="text-sm font-medium text-gray-900">{order.customerCompany}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Dirección de Envío</h3>
                    <div className="space-y-1 text-sm text-gray-700">
                        <p>{shippingAddress.street}</p>
                        <p>{shippingAddress.city}, {shippingAddress.state}</p>
                        <p>{shippingAddress.postalCode}</p>
                        <p>{shippingAddress.country}</p>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Productos</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Producto</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>
                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Precio</th>
                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {items.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{item.sku || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 text-right">€{item.price.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                                        €{(item.quantity * item.price).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen del Pedido</h3>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">€{order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.taxAmount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">IVA</span>
                            <span className="font-medium text-gray-900">€{order.taxAmount.toFixed(2)}</span>
                        </div>
                    )}
                    {order.shippingAmount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Envío</span>
                            <span className="font-medium text-gray-900">€{order.shippingAmount.toFixed(2)}</span>
                        </div>
                    )}
                    {order.discountAmount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Descuento</span>
                            <span className="font-medium text-green-600">-€{order.discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                        <span className="text-base font-bold text-gray-900">Total</span>
                        <span className="text-base font-bold text-gray-900">€{order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Información de Pago</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Método de Pago</p>
                        <p className="text-sm font-medium text-gray-900">{order.paymentMethod || 'No especificado'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Estado de Pago</p>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {order.paymentStatus || 'PENDING'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
