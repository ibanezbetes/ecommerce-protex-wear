import React, { useEffect, useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { RefreshCw, Euro, ShoppingBag, Tag, Package } from 'lucide-react';
import { orderOperations } from '../../services/graphql';
import LoadingSpinner from '../UI/LoadingSpinner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function ReportsView() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<{
        kpis: { revenue: number; orders: number; aov: number; itemsSold: number };
        salesTrend: any[];
        statusDist: any[];
        topProducts: any[];
    } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch all orders - limit 2000 for reasonable client-side processing
            const response = await orderOperations.listAllOrders(undefined, 2000);
            const orders = response.data;

            processData(orders);
        } catch (err: any) {
            console.error('Error fetching report data:', err);
            setError('No se pudieron cargar los datos del reporte.');
        } finally {
            setLoading(false);
        }
    };

    const processData = (orders: any[]) => {
        let totalRevenue = 0;
        let totalItems = 0;

        // Maps for aggregation
        const salesByDate: Record<string, number> = {};
        const statusCount: Record<string, number> = {};
        const productCount: Record<string, number> = {};

        orders.forEach(order => {
            // 1. KPIs
            const amount = order.totalAmount || 0;
            totalRevenue += amount;

            // 2. Sales Trend (Group by ISO Date YYYY-MM-DD for sorting)
            const dateObj = new Date(order.createdAt);
            const isoDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
            salesByDate[isoDate] = (salesByDate[isoDate] || 0) + amount;

            // 3. Status Distribution
            const status = order.status || 'UNKNOWN';
            statusCount[status] = (statusCount[status] || 0) + 1;

            // 4. Top Products
            try {
                if (order.items) {
                    const items = JSON.parse(order.items);
                    items.forEach((item: any) => {
                        const name = item.name || 'Producto Desconocido';
                        productCount[name] = (productCount[name] || 0) + (item.quantity || 1);
                        totalItems += (item.quantity || 1);
                    });
                }
            } catch (e) {
                console.warn('Error parsing items for order:', order.id);
            }
        });

        // Format Data for Charts (Sorted Chronologically)
        const salesTrend = Object.keys(salesByDate)
            .sort() // Sorts YYYY-MM-DD correctly
            .map(isoDate => {
                // Format for display: "15 Ene"
                const dateObj = new Date(isoDate);
                const displayDate = dateObj.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });

                return {
                    name: displayDate, // Display value
                    fullDate: isoDate, // Tooltip or debug value
                    ventas: parseFloat(salesByDate[isoDate].toFixed(2))
                };
            });

        const statusDist = Object.keys(statusCount).map(key => ({
            name: key,
            value: statusCount[key]
        }));

        const topProducts = Object.keys(productCount)
            .map(key => ({
                name: key.length > 20 ? key.substring(0, 20) + '...' : key, // Truncate long names
                cantidad: productCount[key]
            }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5); // Top 5

        setData({
            kpis: {
                revenue: totalRevenue,
                orders: orders.length,
                aov: orders.length > 0 ? totalRevenue / orders.length : 0,
                itemsSold: totalItems
            },
            salesTrend,
            statusDist,
            topProducts
        });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" text="Simulando análisis complejo..." />
        </div>
    );

    if (error) return <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-lg">{error}</div>;
    if (!data) return null;

    return (
        <div>
            {/* Header */}
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Reportes y Analítica</h1>
                    <p className="admin-page-subtitle">Visión detallada del rendimiento con métricas clave</p>
                </div>
                <button
                    onClick={fetchData}
                    className="admin-action-btn secondary"
                    style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <RefreshCw size={16} /> Actualizar Datos
                </button>
            </div>

            {/* KPIs Grid */}
            <div className="admin-stats-grid mb-8">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                        <Euro size={24} />
                    </div>
                    <div>
                        <p className="admin-stat-label">Ingresos Totales</p>
                        <p className="admin-stat-value">€{data.kpis.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="admin-stat-label">Pedidos Totales</p>
                        <p className="admin-stat-value">{data.kpis.orders}</p>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#faf5ff', color: '#9333ea' }}>
                        <Tag size={24} />
                    </div>
                    <div>
                        <p className="admin-stat-label">Ticket Medio</p>
                        <p className="admin-stat-value">€{data.kpis.aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="admin-stat-label">Productos Vendidos</p>
                        <p className="admin-stat-value">{data.kpis.itemsSold}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

                {/* Sales Trend (Big Chart) */}
                <div className="admin-card" style={{ gridColumn: 'span 2' }}>
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Evolución de Ventas</h3>
                    </div>
                    {/* Explicit Height for Recharts */}
                    <div style={{ width: '100%', height: '350px', padding: '10px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.salesTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} unit="€" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value: number) => [`€${value.toFixed(2)}`, 'Ventas']}
                                />
                                <Area type="monotone" dataKey="ventas" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorVentas)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution (Pie Chart) */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">Estado de Pedidos</h3>
                    </div>
                    <div style={{ width: '100%', height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.statusDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.statusDist.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Row 2: Top Products */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <h3 className="admin-card-title">Top 5 Productos Más Vendidos</h3>
                </div>
                <div style={{ width: '100%', height: '300px', padding: '10px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data.topProducts}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 12, fill: '#4b5563' }} />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="cantidad" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={30}>
                                {data.topProducts.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}

export default ReportsView;
