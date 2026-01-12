"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "../../../../../amplify_outputs.json";
import { Order } from "@/types";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Calendar,
    User,
    Mail,
    Hash,
    DollarSign,
    Clock,
    CheckCircle,
    ChevronRight,
    Package,
    ShoppingCart
} from "lucide-react";

export default function OrderDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [order, setOrder] = useState<Order | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) {
            fetchOrder(id);
        }
    }, [id]);

    async function fetchOrder(id: string) {
        try {
            Amplify.configure(outputs);
            const client = generateClient({ authMode: 'userPool' });
            // @ts-ignore
            const { data: item, errors } = await client.models.Order.get({ id });
            if (item) {
                setOrder(item as Order);
            }
        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(newStatus: string) {
        if (!order) return;
        setUpdating(true);
        try {
            Amplify.configure(outputs);
            const client = generateClient({ authMode: 'userPool' });
            // @ts-ignore
            await client.models.Order.update({
                id: order.id,
                status: newStatus
            });
            setOrder({ ...order, status: newStatus as any });
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error updating status");
        } finally {
            setUpdating(false);
        }
    }

    const getStatusTheme = (status: string) => {
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
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-bold mb-4">Pedido no encontrado</p>
                <button onClick={() => router.back()} className="text-blue-600 font-black">Regresar</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="space-y-1">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1.5 text-gray-500 font-bold text-xs hover:text-blue-600 mb-2 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        VOLVER A PEDIDOS
                    </button>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Pedido #{order.id.substring(0, 12)}...</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <Calendar size={14} />
                        Realizado el {new Date(order.orderDate).toLocaleString()}
                    </div>
                </div>

                <div className="w-full sm:w-auto p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">Estado del Pedido</label>
                    <select
                        value={order.status || "PENDING"}
                        onChange={(e) => updateStatus(e.target.value)}
                        disabled={updating}
                        className={`
                            block w-full sm:w-48 rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm font-bold p-2.5 border transition-all
                            ${getStatusTheme(order.status || 'PENDING')}
                        `}
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
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                        <User size={20} className="text-blue-600" />
                        Detalles del Cliente
                    </h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 shrink-0">
                                <User size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase mb-0.5">Nombre</p>
                                <p className="text-gray-900 font-bold truncate">{order.customerName}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 shrink-0">
                                <Mail size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase mb-0.5">Email</p>
                                <p className="text-gray-900 font-bold truncate">{order.customerEmail}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 shrink-0">
                                <Hash size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase mb-0.5">User ID</p>
                                <p className="text-gray-900 text-xs font-mono break-all leading-tight">{order.userId}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                            <ShoppingCart size={20} className="text-indigo-600" />
                            Resumen de Pago
                        </h3>
                        <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-4">
                            <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl">
                                <span className="text-sm font-bold text-gray-600 uppercase tracking-tight">Total del Pedido</span>
                                <span className="text-2xl font-black text-indigo-700">${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest justify-center">
                                <CheckCircle size={14} />
                                Transacción Segura
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between p-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                            <Clock size={16} />
                            Estado Actual
                        </div>
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border ${getStatusTheme(order.status || 'PENDING')}`}>
                            {order.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
