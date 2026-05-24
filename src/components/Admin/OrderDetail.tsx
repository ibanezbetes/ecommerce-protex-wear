import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order } from '../../services/graphql';
import { orderOperations } from '../../services/graphql';
import LoadingSpinner from '../UI/LoadingSpinner';
import '../../styles/AdminOrders.css';

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

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'PENDING': return 'status-pending';
            case 'CONFIRMED': return 'status-confirmed';
            case 'PROCESSING': return 'status-processing';
            case 'SHIPPED': return 'status-shipped';
            case 'DELIVERED': return 'status-delivered';
            case 'CANCELLED': return 'status-cancelled';
            case 'REFUNDED': return 'status-refunded';
            default: return 'status-pending';
        }
    };

    return (
        <div className="orders-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <div className="order-detail-header-card">
                <div style={{ flex: 1 }}>
                    <button
                        onClick={() => navigate('/admin/pedidos')}
                        className="back-link"
                    >
                        ← Volver a Pedidos
                    </button>
                    <h2 className="orders-title">Pedido #{order.id.substring(0, 8)}...</h2>
                    <div className="orders-subtitle">
                        Realizado el {new Date(order.orderDate).toLocaleString('es-ES')}
                    </div>
                </div>

                <div style={{ width: '100%', maxWidth: '200px' }}>
                    <label className="info-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Estado del Pedido</label>
                    <select
                        value={order.status || 'PENDING'}
                        onChange={(e) => updateStatus(e.target.value)}
                        disabled={updating}
                        className={`orders-select ${getStatusClass(order.status || 'PENDING')}`}
                        style={{ fontWeight: 600, padding: '0.5rem' }}
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

            <div className="order-detail-grid">
                {/* Customer Details */}
                <div className="detail-card">
                    <h3 className="detail-card-title">Detalles del Cliente</h3>
                    <div className="info-group">
                        <p className="info-label">Nombre</p>
                        <p className="info-value">{order.customerName}</p>
                    </div>
                    <div className="info-group">
                        <p className="info-label">Email</p>
                        <p className="info-value">{order.customerEmail}</p>
                    </div>
                    {order.customerCompany && (
                        <div className="info-group">
                            <p className="info-label">Empresa</p>
                            <p className="info-value">{order.customerCompany}</p>
                        </div>
                    )}
                </div>

                {/* Shipping Address */}
                <div className="detail-card">
                    <h3 className="detail-card-title">Dirección de Envío</h3>
                    <div className="info-value" style={{ lineHeight: '1.6' }}>
                        <p>{shippingAddress.street}</p>
                        <p>{shippingAddress.city}, {shippingAddress.state}</p>
                        <p>{shippingAddress.postalCode}</p>
                        <p>{shippingAddress.country}</p>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="detail-card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="detail-card-title">Productos</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>SKU</th>
                                <th style={{ textAlign: 'right' }}>Cantidad</th>
                                <th style={{ textAlign: 'right' }}>Precio</th>
                                <th style={{ textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                                    <td style={{ color: '#6B7280' }}>{item.sku || '-'}</td>
                                    <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                                    <td style={{ textAlign: 'right' }}>€{item.price.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                        €{(item.quantity * item.price).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Summary & Payment */}
            <div className="order-detail-grid">
                {/* Order Summary */}
                <div className="detail-card">
                    <h3 className="detail-card-title">Resumen del Pedido</h3>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span className="summary-value">€{order.subtotal.toFixed(2)}</span>
                    </div>

                    {order.taxAmount > 0 && (
                        <div className="summary-row">
                            <span>IVA</span>
                            <span className="summary-value">€{order.taxAmount.toFixed(2)}</span>
                        </div>
                    )}

                    {order.shippingAmount > 0 && (
                        <div className="summary-row">
                            <span>Envío</span>
                            <span className="summary-value">€{order.shippingAmount.toFixed(2)}</span>
                        </div>
                    )}

                    {order.discountAmount > 0 && (
                        <div className="summary-row">
                            <span>Descuento</span>
                            <span className="summary-value" style={{ color: '#059669' }}>-€{order.discountAmount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="summary-row total">
                        <span>Total</span>
                        <span>€{order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="detail-card">
                    <h3 className="detail-card-title">Información de Pago</h3>
                    <div className="info-group">
                        <p className="info-label">Método de Pago</p>
                        <p className="info-value">{order.paymentMethod || 'No especificado'}</p>
                    </div>
                    <div className="info-group">
                        <p className="info-label">Estado de Pago</p>
                        <span className={`status-badge ${order.paymentStatus === 'PAID' ? 'status-delivered' : 'status-pending'}`}>
                            {order.paymentStatus || 'PENDING'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
