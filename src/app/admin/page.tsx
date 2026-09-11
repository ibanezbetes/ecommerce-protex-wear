'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

import { adminOperations, productOperations } from '@/services/graphqlClient';
import { 
  exportOrdersToExcel, 
  exportProductSalesToExcel, 
  exportCustomerAnalyticsToExcel 
} from '@/utils/exportHelpers';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [rawOrders, setRawOrders] = useState<any[]>([]);
  const [rawProducts, setRawProducts] = useState<any[]>([]);
  
  // Quick filters for the dashboard analytics section
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [activeWidgetTab, setActiveWidgetTab] = useState<'salesByProduct' | 'customers' | 'recentOrders'>('salesByProduct');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('ALL');
  const [productSearch, setProductSearch] = useState<string>('');
  const [customerSearch, setCustomerSearch] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch all orders
        const ordersData = await adminOperations.listAllOrders();
        const orders = ordersData?.items || [];
        setRawOrders(orders);
        
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
        setRawProducts(allProducts);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Available Years
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    rawOrders.forEach((o) => {
      if (o.orderDate) {
        years.add(new Date(o.orderDate).getFullYear().toString());
      }
    });
    years.add(new Date().getFullYear().toString());
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [rawOrders]);

  // Categories list
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    rawProducts.forEach((p) => {
      const cat = p.category || p.categories?.[0];
      if (cat) cats.add(cat);
    });
    return Array.from(cats).sort();
  }, [rawProducts]);

  const productCategoryMap = useMemo(() => {
    const map = new Map<string, string>();
    rawProducts.forEach((p) => {
      if (p.id) map.set(p.id, p.category || p.categories?.[0] || 'General');
    });
    return map;
  }, [rawProducts]);

  const productSkuMap = useMemo(() => {
    const map = new Map<string, string>();
    rawProducts.forEach((p) => {
      if (p.id) {
        const sku = p.variants?.[0]?.sku || p.sku || '';
        if (sku) map.set(p.id, sku);
      }
    });
    return map;
  }, [rawProducts]);

  // Filtered Orders for the selected year
  const filteredOrders = useMemo(() => {
    if (selectedYear === 'ALL') return rawOrders;
    return rawOrders.filter((o) => {
      if (!o.orderDate) return false;
      return new Date(o.orderDate).getFullYear().toString() === selectedYear;
    });
  }, [rawOrders, selectedYear]);

  // General KPIs
  const validOrders = useMemo(() => {
    return filteredOrders.filter((o: any) => o.status !== 'CANCELLED' && o.status !== 'CANCELADO');
  }, [filteredOrders]);

  const totalRevenue = useMemo(() => {
    return validOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
  }, [validOrders]);

  const pendingOrders = useMemo(() => {
    return filteredOrders.filter((o: any) => o.status === 'PENDING' || o.status === 'PENDIENTE').length;
  }, [filteredOrders]);

  // Sorted recent orders
  const recentOrders = useMemo(() => {
    return [...rawOrders].sort((a: any, b: any) => {
      return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
    }).slice(0, 6);
  }, [rawOrders]);

  // -------------------------------------------------------------
  // Product & Category Sales breakdown
  // -------------------------------------------------------------
  const productSales = useMemo(() => {
    const map = new Map<string, {
      productId: string;
      productName: string;
      sku: string;
      category: string;
      unitsSold: number;
      revenue: number;
      ordersCount: number;
    }>();

    filteredOrders.forEach((order) => {
      if (order.status === 'CANCELLED' || order.status === 'CANCELADO') return;
      const seenPids = new Set<string>();

      (order.items || []).forEach((item: any) => {
        const pid = item.productId || 'desconocido';
        const name = item.name || item.productId || 'Artículo sin nombre';
        const qty = Number(item.quantity) || 1;
        const price = Number(item.priceAtPurchase) || 0;
        const lineRev = qty * price;
        const cat = productCategoryMap.get(pid) || 'General';
        const sku = productSkuMap.get(pid) || item.sku || '-';

        if (!map.has(pid)) {
          map.set(pid, {
            productId: pid,
            productName: name,
            sku,
            category: cat,
            unitsSold: 0,
            revenue: 0,
            ordersCount: 0,
          });
        }
        const p = map.get(pid)!;
        p.unitsSold += qty;
        p.revenue += lineRev;
        if (p.sku === '-' && sku !== '-') p.sku = sku;
        if (!seenPids.has(pid)) {
          p.ordersCount += 1;
          seenPids.add(pid);
        }
      });
    });

    let list = Array.from(map.values()).map((p) => ({
      ...p,
      averagePrice: p.unitsSold > 0 ? p.revenue / p.unitsSold : 0,
    }));

    if (productCategoryFilter !== 'ALL') {
      list = list.filter((p) => p.category === productCategoryFilter);
    }

    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          p.productId.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => b.unitsSold - a.unitsSold);
  }, [filteredOrders, productCategoryMap, productSkuMap, productCategoryFilter, productSearch]);

  // Total units sold in selected year
  const totalUnitsYear = useMemo(() => {
    return productSales.reduce((acc, p) => acc + p.unitsSold, 0);
  }, [productSales]);

  // -------------------------------------------------------------
  // Customer Analytics breakdown
  // -------------------------------------------------------------
  const customerStats = useMemo(() => {
    const map = new Map<string, {
      customerName: string;
      customerEmail: string;
      cif?: string;
      totalOrders: number;
      totalSpent: number;
      lastOrderDate: string;
      orderList: any[];
    }>();

    filteredOrders.forEach((o) => {
      const email = (o.customerEmail || o.userId || 'anonimo@protexwear.com').toLowerCase();
      const name = o.customerName || o.shippingAddress?.name || o.customerEmail || 'Cliente';
      const cif = o.shippingAddress?.cif || o.billingAddress?.cif || '';
      const amount = o.totalAmount || 0;
      const orderDate = o.orderDate || '';

      if (!map.has(email)) {
        map.set(email, {
          customerName: name,
          customerEmail: email,
          cif,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: orderDate,
          orderList: [],
        });
      }

      const client = map.get(email)!;
      client.totalOrders += 1;
      client.totalSpent += amount;
      client.orderList.push(o);

      if (orderDate && (!client.lastOrderDate || new Date(orderDate) > new Date(client.lastOrderDate))) {
        client.lastOrderDate = orderDate;
      }
    });

    let list = Array.from(map.values());

    if (customerSearch.trim()) {
      const q = customerSearch.toLowerCase();
      list = list.filter((c) =>
        c.customerName.toLowerCase().includes(q) ||
        c.customerEmail.toLowerCase().includes(q) ||
        (c.cif && c.cif.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => b.totalSpent - a.totalSpent);
  }, [filteredOrders, customerSearch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-600 font-medium">Cargando estadísticas del panel de control...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full font-sans space-y-8">
      {/* Header & Direct Excel Export bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
              Panel Administrativo
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard de Gestión</h1>
          <p className="text-gray-500 mt-1">
            Resumen de actividad comercial, ventas por artículo, comportamiento de clientes y exportación a Excel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/reportes"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-bold rounded-xl border border-indigo-200 transition-colors"
          >
            <span>📊</span> Ver Reportes Avanzados
          </Link>
          <button
            onClick={() => exportOrdersToExcel(filteredOrders, `pedidos_protex_${selectedYear}`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Exportar pedidos filtrados a Excel con 1 clic"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Descargar Pedidos (.csv Excel)</span>
          </button>
        </div>
      </div>

      {/* Global KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-700 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Ingresos ({selectedYear === 'ALL' ? 'Total' : selectedYear})</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">€{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-700 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Unidades Vendidas</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{totalUnitsYear.toLocaleString()} uds.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 text-purple-700 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.78 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path><polyline points="2.32 6.16 12 11 21.68 6.16"></polyline><line x1="12" y1="22.76" x2="12" y2="11"></line><line x1="7" y1="3.5" x2="17" y2="8.5"></line></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Catálogo de Productos</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{rawProducts.length}</p>
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Pedidos Pendientes</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{pendingOrders}</p>
          </div>
        </div>
      </div>

      {/* Analytics & Tools Interactive Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Widget Top Bar with Tabs and Filters */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveWidgetTab('salesByProduct')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeWidgetTab === 'salesByProduct'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              📦 Ventas por Artículo y Categoría
            </button>
            <button
              onClick={() => setActiveWidgetTab('customers')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeWidgetTab === 'customers'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              👥 Pedidos por Cliente
            </button>
            <button
              onClick={() => setActiveWidgetTab('recentOrders')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeWidgetTab === 'recentOrders'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              🕒 Pedidos Recientes
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Año:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Todo el Historial</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>Año {yr}</option>
                ))}
              </select>
            </div>

            {activeWidgetTab === 'salesByProduct' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Categoría:</span>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ALL">Todas</option>
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Quick Export Button according to tab */}
            {activeWidgetTab === 'salesByProduct' && (
              <button
                onClick={() => exportProductSalesToExcel(productSales, selectedYear)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
                title="Descargar este reporte en Excel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Exportar a Excel
              </button>
            )}

            {activeWidgetTab === 'customers' && (
              <button
                onClick={() => {
                  const formatted = customerStats.map((c) => ({
                    customerName: c.customerName,
                    customerEmail: c.customerEmail,
                    cif: c.cif,
                    totalOrders: c.totalOrders,
                    totalSpent: c.totalSpent,
                    lastOrderDate: c.lastOrderDate,
                    recentOrderIds: c.orderList.map((o) => `#${o.id.substring(0, 8)}`).join(', '),
                  }));
                  exportCustomerAnalyticsToExcel(formatted);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
                title="Descargar clientes y pedidos en Excel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Exportar a Excel
              </button>
            )}
          </div>
        </div>

        {/* Tab 1 Content: Sales By Product & Category */}
        {activeWidgetTab === 'salesByProduct' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Buscar por nombre o referencia (SKU)..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <svg className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  Mostrando <strong className="text-gray-900">{productSales.length}</strong> artículos
                </span>
                <Link href="/admin/reportes" className="text-indigo-600 hover:underline font-bold">
                  Ver reporte avanzado →
                </Link>
              </div>
            </div>

            {productSales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-bold text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">Artículo / Referencia</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4 text-center">Uds. Vendidas</th>
                      <th className="py-3 px-4 text-center">Nº Pedidos</th>
                      <th className="py-3 px-4 text-right">Facturación</th>
                      <th className="py-3 px-4 text-center">Participación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {productSales.slice(0, 10).map((p, idx) => {
                      const share = totalUnitsYear > 0 ? (p.unitsSold / totalUnitsYear) * 100 : 0;
                      return (
                        <tr key={p.productId || idx} className="hover:bg-gray-50/75 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-gray-900">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-md bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs">
                                {idx + 1}
                              </span>
                              <div>
                                <p className="font-bold text-gray-900 text-sm leading-tight">{p.productName}</p>
                                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                  {p.sku && p.sku !== '-' && (
                                    <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono">
                                      Ref: {p.sku}
                                    </span>
                                  )}
                                  <span className="text-[10px] text-gray-400 font-mono">ID: {p.productId.substring(0, 8)}...</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-extrabold text-xs">
                              {p.unitsSold} uds.
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-medium text-gray-600">
                            {p.ordersCount}
                          </td>
                          <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">
                            €{p.revenue.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="w-24 mx-auto">
                              <div className="flex justify-between text-[10px] text-gray-400 mb-0.5 font-mono">
                                <span>{share.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${Math.min(100, share * 2.5)}%` }}></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-8 text-gray-400">No hay ventas registradas para los filtros seleccionados.</p>
            )}
          </div>
        )}

        {/* Tab 2 Content: Customer Orders & History */}
        {activeWidgetTab === 'customers' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Buscar cliente, email o CIF..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <svg className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <span className="text-xs text-gray-500">
                Total clientes compradores: <strong className="text-gray-900">{customerStats.length}</strong>
              </span>
            </div>

            {customerStats.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {customerStats.slice(0, 8).map((client, idx) => (
                  <div key={client.customerEmail || idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 p-3 rounded-xl transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {client.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm leading-tight truncate">{client.customerName}</p>
                        <p className="text-xs text-gray-500 font-mono truncate">{client.customerEmail}</p>
                        {client.cif && <span className="text-[10px] text-gray-400">CIF: {client.cif}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <span className="block text-[11px] font-bold text-gray-400 uppercase">Pedidos</span>
                        <span className="font-extrabold text-gray-900 text-sm">{client.totalOrders}</span>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="block text-[11px] font-bold text-gray-400 uppercase">Total Gastado</span>
                        <span className="font-extrabold text-emerald-700 text-sm">€{client.totalSpent.toFixed(2)}</span>
                      </div>
                      <Link
                        href={`/admin/reportes`}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 rounded-lg text-xs font-bold transition-colors"
                      >
                        Ver Pedidos →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-400">No se encontraron clientes para la búsqueda.</p>
            )}
          </div>
        )}

        {/* Tab 3 Content: Recent Orders */}
        {activeWidgetTab === 'recentOrders' && (
          <div className="p-6 space-y-4">
            {recentOrders.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order: any) => (
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    key={order.id}
                    className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center block cursor-pointer rounded-xl"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 text-sm font-mono">Pedido #{order.id.substring(0, 8)}</p>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ${
                          order.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{order.customerName || order.customerEmail || 'Sin nombre'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-gray-900 text-sm">€{order.totalAmount?.toFixed(2)}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString('es-ES') : ''}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-400">No hay pedidos registrados.</p>
            )}
            <div className="pt-2 text-center">
              <Link href="/admin/pedidos" className="text-indigo-600 font-bold text-xs hover:underline">
                Ver todos los pedidos en el gestor →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/admin/reportes"
          className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-sm hover:shadow-md transition-all group"
        >
          <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">📊</span>
          <h3 className="font-extrabold text-lg text-white">Centro de Reportes y Analíticas</h3>
          <p className="text-indigo-100 text-xs mt-1">
            Filtra ventas por año, categoría, analiza clientes y descarga hojas de cálculo en Excel.
          </p>
        </Link>

        <Link
          href="/admin/pedidos"
          className="p-6 bg-white border border-gray-200 text-gray-900 rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">📋</span>
          <h3 className="font-extrabold text-lg text-gray-900">Gestor de Pedidos</h3>
          <p className="text-gray-500 text-xs mt-1">
            Revisa estados, actualiza tracking y consulta la dirección de entrega de cada pedido.
          </p>
        </Link>

        <Link
          href="/admin/importar"
          className="p-6 bg-white border border-gray-200 text-gray-900 rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">📥</span>
          <h3 className="font-extrabold text-lg text-gray-900">Importación Masiva</h3>
          <p className="text-gray-500 text-xs mt-1">
            Carga y sincroniza catálogos completos de artículos desde archivos Excel.
          </p>
        </Link>
      </div>
    </div>
  );
}
