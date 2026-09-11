'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { adminOperations, productOperations } from '@/services/graphqlClient';
import { 
  exportOrdersToExcel, 
  exportProductSalesToExcel, 
  exportCustomerAnalyticsToExcel 
} from '@/utils/exportHelpers';

export default function ReportsViewPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'customers' | 'orders'>('products');

  // Filters
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('ALL');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Orders
        const ordersData = await adminOperations.listAllOrders();
        const rawOrders = ordersData?.items || [];
        setOrders(rawOrders);

        // 2. Fetch Products
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
        setProducts(allProducts);
      } catch (err) {
        console.error('Error loading report data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Available Years from Orders
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    orders.forEach((o) => {
      if (o.orderDate) {
        const y = new Date(o.orderDate).getFullYear().toString();
        years.add(y);
      }
    });
    // Add current year if not present
    years.add(new Date().getFullYear().toString());
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [orders]);

  // Categories Map
  // Categories Map
  const productCategoryMap = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      if (p.id) {
        map.set(p.id, p.category || p.categories?.[0] || 'General');
      }
    });
    return map;
  }, [products]);

  // SKU / Reference Map
  const productSkuMap = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      if (p.id) {
        const sku = p.variants?.[0]?.sku || p.sku || '';
        if (sku) map.set(p.id, sku);
      }
    });
    return map;
  }, [products]);

  // Available Categories
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      const cat = p.category || p.categories?.[0];
      if (cat) cats.add(cat);
    });
    return Array.from(cats).sort();
  }, [products]);

  // Filtered Orders based on Year and Status
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Year filter
      if (selectedYear !== 'ALL') {
        if (!order.orderDate) return false;
        const y = new Date(order.orderDate).getFullYear().toString();
        if (y !== selectedYear) return false;
      }
      // Status filter
      if (selectedStatus !== 'ALL') {
        if (order.status !== selectedStatus) return false;
      }
      // Search query (order id, customer, email, sku, item name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = order.id?.toLowerCase().includes(query);
        const matchesName = order.customerName?.toLowerCase().includes(query);
        const matchesEmail = order.customerEmail?.toLowerCase().includes(query);
        const matchesItem = (order.items || []).some((it: any) => {
          const pid = it.productId || '';
          const sku = productSkuMap.get(pid) || it.sku || '';
          return (
            it.name?.toLowerCase().includes(query) ||
            pid.toLowerCase().includes(query) ||
            sku.toLowerCase().includes(query)
          );
        });
        if (!matchesId && !matchesName && !matchesEmail && !matchesItem) return false;
      }
      return true;
    });
  }, [orders, selectedYear, selectedStatus, searchQuery, productSkuMap]);

  // -------------------------------------------------------------
  // Product & Category Sales Metrics
  // -------------------------------------------------------------
  const productSalesAnalytics = useMemo(() => {
    const productMap = new Map<string, {
      productId: string;
      productName: string;
      sku: string;
      category: string;
      unitsSold: number;
      revenue: number;
      ordersCount: number;
    }>();

    filteredOrders.forEach((order) => {
      // Avoid cancelled orders in sales stats if preferred
      if (order.status === 'CANCELLED' || order.status === 'CANCELADO') return;

      const orderItemIdsSeen = new Set<string>();

      (order.items || []).forEach((item: any) => {
        const pid = item.productId || 'desconocido';
        const name = item.name || item.productId || 'Artículo sin nombre';
        const qty = Number(item.quantity) || 1;
        const price = Number(item.priceAtPurchase) || 0;
        const lineRevenue = qty * price;
        const category = productCategoryMap.get(pid) || 'General';
        const sku = productSkuMap.get(pid) || item.sku || '-';

        if (!productMap.has(pid)) {
          productMap.set(pid, {
            productId: pid,
            productName: name,
            sku,
            category,
            unitsSold: 0,
            revenue: 0,
            ordersCount: 0,
          });
        }

        const entry = productMap.get(pid)!;
        entry.unitsSold += qty;
        entry.revenue += lineRevenue;
        if (entry.sku === '-' && sku !== '-') entry.sku = sku;
        if (!orderItemIdsSeen.has(pid)) {
          entry.ordersCount += 1;
          orderItemIdsSeen.add(pid);
        }
      });
    });

    let results = Array.from(productMap.values()).map((item) => ({
      ...item,
      averagePrice: item.unitsSold > 0 ? item.revenue / item.unitsSold : 0,
    }));

    // Filter by category if selected
    if (selectedCategory !== 'ALL') {
      results = results.filter((item) => item.category === selectedCategory);
    }

    // Filter by search query (name, reference/SKU, ID, category)
    if (searchQuery.trim() && activeTab === 'products') {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (it) =>
          it.productName.toLowerCase().includes(q) ||
          (it.sku && it.sku.toLowerCase().includes(q)) ||
          it.productId.toLowerCase().includes(q) ||
          it.category.toLowerCase().includes(q)
      );
    }

    // Sort by units sold descending
    return results.sort((a, b) => b.unitsSold - a.unitsSold);
  }, [filteredOrders, productCategoryMap, productSkuMap, selectedCategory, searchQuery, activeTab]);

  // Overall Product totals
  const totalUnitsSold = useMemo(() => {
    return productSalesAnalytics.reduce((acc, p) => acc + p.unitsSold, 0);
  }, [productSalesAnalytics]);

  const totalProductRevenue = useMemo(() => {
    return productSalesAnalytics.reduce((acc, p) => acc + p.revenue, 0);
  }, [productSalesAnalytics]);

  // -------------------------------------------------------------
  // Customer Analytics
  // -------------------------------------------------------------
  const customerAnalytics = useMemo(() => {
    const map = new Map<string, {
      customerKey: string;
      customerName: string;
      customerEmail: string;
      cif?: string;
      totalOrders: number;
      totalSpent: number;
      lastOrderDate: string;
      orderList: any[];
    }>();

    filteredOrders.forEach((order) => {
      const email = (order.customerEmail || order.userId || 'anonimo@protexwear.com').toLowerCase();
      const name = order.customerName || order.shippingAddress?.name || order.customerEmail || 'Cliente';
      const cif = order.shippingAddress?.cif || order.billingAddress?.cif || '';
      const amount = order.totalAmount || 0;
      const orderDate = order.orderDate || '';

      if (!map.has(email)) {
        map.set(email, {
          customerKey: email,
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
      client.orderList.push(order);

      if (orderDate && (!client.lastOrderDate || new Date(orderDate) > new Date(client.lastOrderDate))) {
        client.lastOrderDate = orderDate;
      }
    });

    let list = Array.from(map.values());

    if (searchQuery.trim() && activeTab === 'customers') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.customerName.toLowerCase().includes(q) ||
          c.customerEmail.toLowerCase().includes(q) ||
          (c.cif && c.cif.toLowerCase().includes(q))
      );
    }

    if (selectedCustomer !== 'ALL') {
      list = list.filter((c) => c.customerKey === selectedCustomer);
    }

    return list.sort((a, b) => b.totalSpent - a.totalSpent);
  }, [filteredOrders, searchQuery, activeTab, selectedCustomer]);

  // Top Customer calculation
  const totalCustomersCount = customerAnalytics.length;
  const totalOrdersCount = filteredOrders.length;
  const totalRevenueAll = useMemo(() => {
    return filteredOrders
      .filter((o) => o.status !== 'CANCELLED' && o.status !== 'CANCELADO')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }, [filteredOrders]);

  // Handlers for 1-Click Excel Exports
  const handleExportProductSales = () => {
    exportProductSalesToExcel(productSalesAnalytics, selectedYear);
  };

  const handleExportCustomers = () => {
    const formatted = customerAnalytics.map((c) => ({
      customerName: c.customerName,
      customerEmail: c.customerEmail,
      cif: c.cif,
      totalOrders: c.totalOrders,
      totalSpent: c.totalSpent,
      lastOrderDate: c.lastOrderDate,
      recentOrderIds: c.orderList.map((o) => `#${o.id.substring(0, 8)} (€${o.totalAmount?.toFixed(2)})`).join(', '),
    }));
    exportCustomerAnalyticsToExcel(formatted);
  };

  const handleExportOrders = () => {
    exportOrdersToExcel(filteredOrders, `reporte_pedidos_${selectedYear}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-600 font-semibold">Generando reportes y analíticas...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full font-sans space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
              Herramientas de Análisis
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <span>📊</span> Reportes, Ventas y Exportación
          </h1>
          <p className="text-gray-500 mt-1">
            Consulta unidades vendidas por artículo o categoría en un año, analiza los pedidos de cada cliente y descarga informes en Excel con un solo clic.
          </p>
        </div>

        {/* Global 1-Click Export Actions */}
        <div className="flex flex-wrap gap-2">
          {activeTab === 'products' && (
            <button
              onClick={handleExportProductSales}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Descargar Excel con el desglose de ventas por artículo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>Exportar Artículos a Excel (.csv)</span>
            </button>
          )}

          {activeTab === 'customers' && (
            <button
              onClick={handleExportCustomers}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Descargar Excel con el resumen y pedidos por cliente"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>Exportar Clientes a Excel (.csv)</span>
            </button>
          )}

          {activeTab === 'orders' && (
            <button
              onClick={handleExportOrders}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Descargar Excel completo con todos los pedidos"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>Exportar Pedidos a Excel (.csv)</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unidades Vendidas</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{totalUnitsSold.toLocaleString()} uds.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Facturación ({selectedYear === 'ALL' ? 'Total' : selectedYear})</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">€{totalRevenueAll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Clientes Compradores</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{totalCustomersCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pedidos Registrados</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{totalOrdersCount}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>📦</span> Ventas por Artículo & Categoría
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'customers'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>👥</span> Análisis por Cliente (Pedidos & Gasto)
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>📋</span> Historial Global de Pedidos
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Year Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              📅 Filtrar por Año
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todo el Historial</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>Año {yr}</option>
              ))}
            </select>
          </div>

          {/* Category Filter (Active on Products tab) */}
          {activeTab === 'products' && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                🏷️ Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Todas las Categorías</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          {/* Order Status Filter */}
          {(activeTab === 'orders' || activeTab === 'customers') && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                ⚡ Estado del Pedido
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="PENDING">PENDING (Pendiente)</option>
                <option value="CONFIRMED">CONFIRMED (Confirmado)</option>
                <option value="PROCESSING">PROCESSING (En Proceso)</option>
                <option value="SHIPPED">SHIPPED (Enviado)</option>
                <option value="DELIVERED">DELIVERED (Entregado)</option>
                <option value="CANCELLED">CANCELLED (Cancelado)</option>
              </select>
            </div>
          )}

          {/* Search Bar */}
          <div className={activeTab === 'products' ? 'md:col-span-2' : 'md:col-span-2'}>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              🔍 Búsqueda rápida
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={
                  activeTab === 'products'
                    ? 'Buscar por nombre, referencia (SKU), ID o categoría...'
                    : activeTab === 'customers'
                    ? 'Buscar por cliente, email, CIF...'
                    : 'Buscar por ID pedido, cliente o producto...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <span className="font-semibold">Filtros activos:</span>
          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-medium">
            Año: {selectedYear === 'ALL' ? 'Todo' : selectedYear}
          </span>
          {selectedCategory !== 'ALL' && (
            <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-medium">
              Categoría: {selectedCategory}
            </span>
          )}
          {selectedStatus !== 'ALL' && (
            <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-medium">
              Estado: {selectedStatus}
            </span>
          )}
          {searchQuery && (
            <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-medium">
              Texto: &ldquo;{searchQuery}&rdquo;
            </span>
          )}
          {(selectedYear !== 'ALL' || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedYear('ALL');
                setSelectedCategory('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="text-red-500 hover:text-red-700 font-bold ml-2 underline cursor-pointer"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PRODUCT & CATEGORY SALES */}
      {/* ========================================================= */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-6 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                Desglose de Unidades Vendidas por Artículo
              </h2>
              <p className="text-sm text-gray-500">
                {productSalesAnalytics.length} artículos con ventas registradas en el periodo seleccionado ({selectedYear === 'ALL' ? 'Histórico completo' : `Año ${selectedYear}`})
              </p>
            </div>
            <button
              onClick={handleExportProductSales}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-sm font-bold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Descargar Excel (.csv)
            </button>
          </div>

          {productSalesAnalytics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-600 font-bold text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Artículo / Referencia</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4 text-center">Unidades Vendidas</th>
                    <th className="py-3 px-4 text-center">Nº Pedidos</th>
                    <th className="py-3 px-4 text-right">Precio Medio</th>
                    <th className="py-3 px-4 text-right">Facturación (€)</th>
                    <th className="py-3 px-4 text-center">Volumen de Ventas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productSalesAnalytics.map((item, idx) => {
                    const percentage = totalUnitsSold > 0 ? (item.unitsSold / totalUnitsSold) * 100 : 0;
                    return (
                      <tr key={item.productId || idx} className="hover:bg-gray-50/75 transition-colors">
                        <td className="py-4 px-4 font-semibold text-gray-900">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="font-bold text-gray-900 leading-snug">{item.productName}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                {item.sku && item.sku !== '-' && (
                                  <span className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono">
                                    Ref: {item.sku}
                                  </span>
                                )}
                                <span className="text-[11px] text-gray-400 font-mono">ID: {item.productId.substring(0, 10)}...</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">
                            {item.unitsSold} uds.
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center font-medium text-gray-600">
                          {item.ordersCount}
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-gray-700">
                          €{item.averagePrice.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-right font-extrabold text-emerald-700">
                          €{item.revenue.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="w-full max-w-[120px] mx-auto">
                            <div className="flex justify-between text-[11px] text-gray-400 mb-1 font-mono">
                              <span>{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${Math.min(100, percentage * 2)}%` }}
                              ></div>
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
            <div className="text-center py-12 text-gray-500">
              <p className="text-base font-semibold">No se encontraron artículos con ventas para estos filtros.</p>
              <p className="text-xs text-gray-400 mt-1">Prueba a seleccionar otro año o eliminar los filtros de búsqueda.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CUSTOMER ANALYTICS & ORDER HISTORY */}
      {/* ========================================================= */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                Historial y Comportamiento de Clientes
              </h2>
              <p className="text-sm text-gray-500">
                Consulta cuántos pedidos ha realizado cada cliente, su gasto total acumulado y el detalle de cada compra.
              </p>
            </div>
            <button
              onClick={handleExportCustomers}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-sm font-bold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Descargar Excel (.csv)
            </button>
          </div>

          {customerAnalytics.length > 0 ? (
            <div className="space-y-4">
              {customerAnalytics.map((client) => {
                const avgTicket = client.totalOrders > 0 ? client.totalSpent / client.totalOrders : 0;
                return (
                  <details
                    key={client.customerKey}
                    className="group border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-200 open:shadow-md"
                  >
                    <summary className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/75 select-none">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                          {client.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
                            {client.customerName}
                          </h3>
                          <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">{client.customerEmail}</p>
                          {client.cif && (
                            <span className="inline-block mt-1 text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              CIF: {client.cif}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Client Quick Stats */}
                      <div className="flex flex-wrap items-center gap-6 justify-between md:justify-end">
                        <div className="text-left md:text-right">
                          <span className="block text-xs font-bold text-gray-400 uppercase">Pedidos</span>
                          <span className="inline-block font-extrabold text-gray-900 text-base">
                            {client.totalOrders} {client.totalOrders === 1 ? 'pedido' : 'pedidos'}
                          </span>
                        </div>

                        <div className="text-left md:text-right">
                          <span className="block text-xs font-bold text-gray-400 uppercase">Gasto Total</span>
                          <span className="font-extrabold text-emerald-700 text-base">
                            €{client.totalSpent.toFixed(2)}
                          </span>
                        </div>

                        <div className="text-left md:text-right">
                          <span className="block text-xs font-bold text-gray-400 uppercase">Ticket Medio</span>
                          <span className="font-semibold text-gray-700 text-sm">
                            €{avgTicket.toFixed(2)}
                          </span>
                        </div>

                        <div className="text-gray-400 group-open:rotate-180 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </div>
                    </summary>

                    {/* Collapsible Order Breakdown */}
                    <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-3">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Historial de Pedidos Realizados por {client.customerName}
                      </h4>

                      <div className="divide-y divide-gray-200 bg-white rounded-xl border border-gray-200 overflow-hidden">
                        {client.orderList.map((order) => (
                          <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/admin/pedidos/${order.id}`}
                                  className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline text-sm font-mono"
                                >
                                  Pedido #{order.id.substring(0, 8)}
                                </Link>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                  order.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                Fecha: {order.orderDate ? new Date(order.orderDate).toLocaleString('es-ES') : '-'}
                              </p>
                              {/* Items summary in order */}
                              <p className="text-xs text-gray-600">
                                <strong>Artículos ({order.items?.length || 0}):</strong>{' '}
                                {(order.items || [])
                                  .map((it: any) => `${it.name || it.productId} (x${it.quantity})`)
                                  .join(', ')}
                              </p>
                            </div>

                            <div className="text-right flex items-center justify-between sm:justify-end gap-4">
                              <div>
                                <span className="block text-xs font-bold text-gray-400">Total</span>
                                <span className="font-extrabold text-gray-900 text-base">
                                  €{order.totalAmount?.toFixed(2)}
                                </span>
                              </div>
                              <Link
                                href={`/admin/pedidos/${order.id}`}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 rounded-lg text-xs font-bold transition-colors"
                              >
                                Ver Detalle →
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-base font-semibold">No se encontraron clientes para los filtros aplicados.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: GLOBAL ORDER HISTORY */}
      {/* ========================================================= */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                Historial General de Pedidos ({filteredOrders.length})
              </h2>
              <p className="text-sm text-gray-500">
                Listado detallado de todas las transacciones filtradas por periodo y estado.
              </p>
            </div>
            <button
              onClick={handleExportOrders}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-sm font-bold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Descargar Todos los Pedidos (.csv)
            </button>
          </div>

          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-600 font-bold text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">ID Pedido</th>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-center">Nº Artículos</th>
                    <th className="py-3 px-4 text-right">Importe Total</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/75 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                        #{order.id.substring(0, 8)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 text-xs">
                        {order.orderDate ? new Date(order.orderDate).toLocaleString('es-ES') : '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-gray-900">{order.customerName || 'Cliente'}</p>
                        <p className="text-xs text-gray-400">{order.customerEmail}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-gray-700">
                        {(order.items || []).reduce((acc: number, it: any) => acc + (it.quantity || 1), 0)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-gray-900">
                        €{order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href={`/admin/pedidos/${order.id}`}
                          className="inline-block px-3 py-1 bg-gray-100 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-base font-semibold">No se encontraron pedidos con los filtros actuales.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
