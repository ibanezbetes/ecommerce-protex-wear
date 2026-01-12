import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../../services/graphql';
import { orderOperations } from '../../services/graphql';
import LoadingSpinner from '../UI/LoadingSpinner';
import '../../styles/AdminOrders.css';

/**
 * Orders Management Component for Admin Dashboard
 * Provides listing and filtering of all orders
 */
function OrdersManagement() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            setLoading(true);
            let allOrders: any[] = [];
            let nextToken: string | undefined = undefined;

            // Loop to fetch all pages
            do {
                const { data: items, errors, nextToken: newNextToken } = await orderOperations.listAllOrders(undefined, 100, nextToken);

                if (errors) {
                    const isUnauthorized = errors.some((e: any) => e.message.includes('Unauthorized'));
                    if (isUnauthorized) {
                        setAccessDenied(true);
                        return; // Stop if unauthorized
                    }
                    console.error('GraphQL errors:', JSON.stringify(errors, null, 2));
                    // Continue fetching if partial data? usually better to break or just log
                }

                if (items) {
                    allOrders = [...allOrders, ...items];
                }

                nextToken = newNextToken;
            } while (nextToken);

            // Deduplicate by ID
            const uniqueMap = new Map();
            allOrders.forEach((item: any) => {
                if (!uniqueMap.has(item.id)) {
                    uniqueMap.set(item.id, item);
                }
            });
            const uniqueItems = Array.from(uniqueMap.values()) as Order[];

            // Sort by date desc
            const sorted = uniqueItems.sort((a, b) =>
                new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
            );
            setOrders(sorted);

        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }

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

    const filteredOrders = useMemo(() => {
        let filtered = orders;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(o =>
                o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(o => o.status === statusFilter);
        }

        return filtered;
    }, [orders, searchTerm, statusFilter]);

    if (accessDenied) {
        return (
            <div style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#991B1B', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Acceso Denegado</h3>
                <p>Solo los administradores pueden ver los pedidos.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    Por favor, cierra sesión y vuelve a iniciar sesión para actualizar tus permisos.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <LoadingSpinner size="lg" text="Cargando pedidos..." />
            </div>
        );
    }

    return (
        <div className="orders-container">
            {/* Header */}
            <div className="orders-header">
                <div>
                    <h2 className="orders-title">Gestión de Pedidos</h2>
                    <p className="orders-subtitle">{filteredOrders.length} pedidos encontrados</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="product-form-btn product-form-btn--secondary"
                    style={{ gap: '0.5rem', display: 'flex', alignItems: 'center' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 5.5A10 10 0 1 1 11.26 2.8" /></svg>
                    Actualizar
                </button>
            </div>

            {/* Search and Filters */}
            <div className="orders-filter-card">
                <div className="orders-filter-grid">
                    {/* Search */}
                    <div className="orders-form-group">
                        <label>Buscar</label>
                        <input
                            type="text"
                            placeholder="Buscar por cliente, email o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="orders-input"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="orders-form-group">
                        <label>Estado</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="orders-select"
                        >
                            <option value="ALL">Todos</option>
                            <option value="PENDING">Pendiente</option>
                            <option value="CONFIRMED">Confirmado</option>
                            <option value="PROCESSING">Procesando</option>
                            <option value="SHIPPED">Enviado</option>
                            <option value="DELIVERED">Entregado</option>
                            <option value="CANCELLED">Cancelado</option>
                            <option value="REFUNDED">Reembolsado</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="orders-table-container">
                {filteredOrders.length === 0 ? (
                    <div className="orders-empty-state">
                        <div className="orders-empty-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 onClick={() => { }} style={{ fontSize: '1.125rem', fontWeight: 500, color: '#111827', marginBottom: '0.5rem' }}>No hay pedidos</h3>
                        <p style={{ color: '#4B5563' }}>
                            {searchTerm || statusFilter !== 'ALL'
                                ? 'No se encontraron pedidos con los filtros aplicados'
                                : 'Aún no hay pedidos en el sistema'}
                        </p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>ID Pedido</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td style={{ fontWeight: 500 }}>
                                            #{order.id.substring(0, 8)}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 500, color: '#111827' }}>{order.customerName}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{order.customerEmail}</div>
                                        </td>
                                        <td>
                                            {new Date(order.orderDate).toLocaleDateString('es-ES')}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>
                                            €{order.totalAmount.toFixed(2)}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Link
                                                to={`/admin/pedidos/${order.id}`}
                                                className="orders-action-link"
                                            >
                                                Ver Detalle
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrdersManagement;
