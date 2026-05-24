"use client";

import { useEffect, useState } from "react";
import outputs from "../../../amplify_outputs.json";
import { Package, ShoppingCart, DollarSign } from "lucide-react";
import { orderOperations, productOperations } from "../../services/graphql";
import { fetchAuthSession } from "aws-amplify/auth";

export default function DashboardPage() {
    const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            // Fetch Products (Public Read)
            try {
                const { data: prodItems, errors: prodErrors } = await productOperations.listProducts();
                if (prodErrors) console.error("Product stats error:", prodErrors);
                if (prodItems) {
                    // Deduplicate for consistency with products page
                    const uniqueMap = new Map();
                    prodItems.forEach((item: any) => {
                        const key = item.sku || item.id;
                        if (!uniqueMap.has(key)) {
                            uniqueMap.set(key, item);
                        }
                    });
                    setStats(prev => ({ ...prev, products: uniqueMap.size }));
                }
            } catch (pErr) {
                console.error("Failed to fetch product stats:", pErr);
            }

            // Fetch Orders (Admin Read - Authenticated)
            try {
                // Force session check to ensure we have credentials before request
                const session = await fetchAuthSession();
                if (!session.tokens?.accessToken) {
                    console.warn("No access token available for order fetch");
                } else {
                    console.log("Verified active session for orders.");
                }

                // DIAGNOSTIC CHECK
                await productOperations.debugTestUserPoolAuth();

                const { data: orderItems, errors: orderErrors } = await orderOperations.listAllOrders();
                if (orderErrors) console.error("Order stats error:", orderErrors);
                if (orderItems) {
                    const pendingOrders = orderItems.filter((o: any) => o.status === 'PENDING').length || 0;
                    const totalRevenue = orderItems.reduce((acc: number, curr: any) => acc + (curr.totalAmount || 0), 0);
                    setStats(prev => ({
                        ...prev,
                        orders: pendingOrders,
                        revenue: totalRevenue
                    }));
                }
            } catch (oErr) {
                console.error("Failed to fetch order stats:", oErr);
            }

        } catch (error) {
            console.error("General error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Package size={24} />
                        </div>
                        <div>
                            <h3 className="text-gray-700 text-sm font-bold uppercase tracking-wider">Productos Totales</h3>
                            <p className="text-3xl font-black text-gray-900 mt-1">{loading ? "..." : stats.products}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                            <ShoppingCart size={24} />
                        </div>
                        <div>
                            <h3 className="text-gray-700 text-sm font-bold uppercase tracking-wider">Pedidos Pendientes</h3>
                            <p className="text-3xl font-black text-gray-900 mt-1">{loading ? "..." : stats.orders}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <h3 className="text-gray-700 text-sm font-bold uppercase tracking-wider">Ventas Totales</h3>
                            <p className="text-3xl font-black text-gray-900 mt-1">
                                {loading ? "..." : `$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
