"use client";

import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "../../../../amplify_outputs.json";
import { useEffect, useState, useMemo } from "react";
import { Order } from "@/types";
import Link from "next/link";
import { Eye, Search, Calendar, User, DollarSign, ChevronRight } from "lucide-react";
import { orderOperations } from "../../../services/graphql";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            // Service usage
            const { data: items, errors } = await orderOperations.listAllOrders();

            if (errors) {
                const isUnauthorized = errors.some(e => e.message.includes('Unauthorized'));
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
            console.error("Error fetching orders:", error);
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
        return orders.filter(o =>
            o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Pedidos</h2>
                    <p className="text-sm text-gray-600 font-medium">{filteredOrders.length} pedidos encontrados</p>
                </div>
            </div>

            {/* Access Denied State */}
            {accessDenied && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <div className="flex justify-center mb-3">
                        <div className="p-3 bg-red-100 rounded-full text-red-600">
                            <User size={24} />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-red-800 mb-2">Acceso Denegado</h3>
                    <p className="text-sm text-red-600 mb-4 max-w-md mx-auto">
                        Tu usuario no tiene los permisos necesarios (Grupo ADMIN o CUSTOMER) para ver los pedidos.
                        Por favor, contacta con el administrador del sistema para revisar tus permisos en Cognito.
                    </p>
                </div>
            )}

            {!accessDenied && (
                <>
                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="text-gray-400" size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por cliente o ID de pedido..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm text-gray-900"
                            />
                        </div>
                    </div>

                    {isMobile ? (
                        /* Mobile Card View */
                        <div className="space-y-4">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl h-32 animate-pulse border border-gray-100"></div>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <div className="bg-white p-8 text-center text-gray-500 rounded-2xl border border-gray-200 font-medium">
                                    No se encontraron pedidos.
                                </div>
                            ) : (
                                filteredOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/dashboard/orders/${order.id}`}
                                        className="block bg-white p-4 rounded-2xl shadow-sm border border-gray-200 space-y-4 active:scale-[0.98] transition-transform"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">#{order.id.substring(0, 8)}</p>
                                                <h3 className="font-bold text-gray-900 text-base">{order.customerName}</h3>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.status || 'PENDING')}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-gray-50 rounded-lg text-gray-400">
                                                    <Calendar size={14} />
                                                </div>
                                                <p className="text-xs font-bold text-gray-700">{new Date(order.orderDate).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-green-50 rounded-lg text-green-600">
                                                    <DollarSign size={14} />
                                                </div>
                                                <p className="text-sm font-black text-gray-900">${order.totalAmount.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-blue-600 text-xs font-bold pt-2">
                                            <span>Ver detalles</span>
                                            <ChevronRight size={14} />
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    ) : (
                        /* Desktop Table View */
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Pedido</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cliente</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <tr key={i} className="animate-pulse h-20">
                                                <td colSpan={6} className="bg-gray-50/50"></td>
                                            </tr>
                                        ))
                                    ) : filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-bold">No se encontraron pedidos.</td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-blue-600 uppercase tracking-tighter">#{order.id.substring(0, 8)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 font-black">{order.customerName}</div>
                                                    <div className="text-xs text-gray-600 font-medium">{order.customerEmail}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">
                                                    {new Date(order.orderDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-black tracking-tight">${order.totalAmount.toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusColor(order.status || 'PENDING')}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link href={`/dashboard/orders/${order.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl inline-flex items-center gap-1 transition-colors">
                                                        <Eye size={18} />
                                                        <span className="font-bold">Ver</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
