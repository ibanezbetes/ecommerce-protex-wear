import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../../services/graphql';
import { orderOperations } from '../../services/graphql';
import LoadingSpinner from '../UI/LoadingSpinner';

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
            const { data: items, errors } = await orderOperations.listAllOrders();

            if (errors) {
                const isUnauthorized = errors.some((e: any) => e.message.includes('Unauthorized'));
                if (isUnauthorized) {
                    setAccessDenied(true);
                }
                console.error('GraphQL errors:', JSON.stringify(errors, null, 2));
            } else if (items) {
                // Deduplicate by ID
                const uniqueMap = new Map();
                items.forEach((item: any) => {
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
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Acceso Denegado</h3>
                <p className="text-red-600">Solo los administradores pueden ver los pedidos.</p>
                <p className="text-sm text-red-500 mt-2">
                    Por favor, cierra sesión y vuelve a iniciar sesión para actualizar tus permisos.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <LoadingSpinner size="lg" text="Cargando pedidos..." />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h2>
                    <p className="text-sm text-gray-600 font-medium">{filteredOrders.length} pedidos encontrados</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Buscar
                        </label>
                        <input
                            type="text"
                            placeholder="Buscar por cliente, email o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {filteredOrders.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos</h3>
                        <p className="text-gray-600">
                            {searchTerm || statusFilter !== 'ALL'
                                ? 'No se encontraron pedidos con los filtros aplicados'
                                : 'Aún no hay pedidos en el sistema'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID Pedido
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order.id.substring(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                                            <div className="text-sm text-gray-500">{order.customerEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(order.orderDate).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            €{order.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                to={`/admin/pedidos/${order.id}`}
                                                className="text-primary-600 hover:text-primary-900"
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
