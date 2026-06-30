'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { adminOperations, productOperations } from '@/services/graphqlClient';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    recentOrders: [],
    topProducts: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch orders
        const ordersData = await adminOperations.listAllOrders();
        const orders = ordersData?.items || [];
        
        // Fetch all products with pagination
        let allProducts: any[] = [];
        let nextToken: string | undefined = undefined;
        let hasMore = true;
        while (hasMore) {
          const pData = await productOperations.listProducts(undefined, undefined, 100, nextToken);
          if (pData?.items) {
            allProducts = [...allProducts, ...pData.items];
          }
          if (pData?.nextToken) {
            nextToken = pData.nextToken;
          } else {
            hasMore = false;
          }
        }
        
        const products = allProducts;
        
        // Calculate total revenue from non-cancelled orders
        const validOrders = orders.filter((o: any) => o.status !== 'CANCELLED' && o.status !== 'CANCELADO');
        const totalRevenue = validOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
        const pendingOrders = orders.filter((o: any) => o.status === 'PENDING' || o.status === 'PENDIENTE').length;
        
        // Sort orders by date descending for recent orders
        const sortedOrders = [...orders].sort((a: any, b: any) => {
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        });
        
        setStats({
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
          totalProducts: products.length,
          pendingOrders: pendingOrders,
          recentOrders: sortedOrders.slice(0, 5).map((o: any) => ({
            id: o.id,
            customerName: o.customerName || o.customerEmail || 'Sin nombre',
            totalAmount: o.totalAmount || 0,
            status: o.status
          })),
          topProducts: products.slice(0, 5).map((p: any) => ({
            id: p.id,
            name: p.name,
            sku: p.variants?.[0]?.sku || '-',
            price: p.variants?.[0]?.basePrice || 0,
            stock: 0 // Stock tracking not yet implemented in variants fully
          }))
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-600 font-medium">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard General</h1>
        <p className="text-gray-500 mt-1">Actividad y estadísticas en tiempo real</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-700 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Ingresos Totales</p>
            <p className="text-2xl font-bold text-gray-900">€{stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-700 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pedidos Totales</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 text-purple-700 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.78 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path><polyline points="2.32 6.16 12 11 21.68 6.16"></polyline><line x1="12" y1="22.76" x2="12" y2="11"></line><line x1="7" y1="3.5" x2="17" y2="8.5"></line></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Productos</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 text-orange-700 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pendientes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 m-0">Pedidos Recientes</h3>
          </div>
          <div className="flex-1 overflow-auto">
            {stats.recentOrders.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {stats.recentOrders.map((order: any) => (
                  <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900 m-0 text-sm">Pedido #{order.id.substring(0, 8)}</p>
                      <p className="text-sm text-gray-500 m-0 mt-0.5">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 m-0 text-sm">€{order.totalAmount?.toFixed(2)}</p>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide rounded-full ${
                        order.status === 'PENDING' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-8 text-gray-500 text-center m-0">No hay pedidos registrados</p>
            )}
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <Link href="/admin/pedidos" className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 flex items-center justify-center gap-1 transition-colors">
              Ver todos los pedidos →
            </Link>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900 m-0">Productos en Catálogo</h3>
          </div>
          <div className="flex-1 overflow-auto">
            {stats.topProducts.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {stats.topProducts.map((product: any, i: number) => (
                  <div key={product.id || i} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                    <div className="flex-1 pr-4 min-w-0">
                      <p className="font-semibold text-gray-900 m-0 text-sm truncate">{product.name}</p>
                      <p className="text-sm text-gray-500 m-0 mt-0.5 font-mono">{product.sku}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 m-0 text-sm">€{product.price?.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 m-0 mt-1">Stock: <span className="font-medium text-gray-700">{product.stock}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-8 text-gray-500 text-center m-0">No hay productos en el catálogo</p>
            )}
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <Link href="/admin/productos" className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 flex items-center justify-center gap-1 transition-colors">
              Gestionar productos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
