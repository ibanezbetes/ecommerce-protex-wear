import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AdminStats, Product, Order, User } from '../types';
import ProductManagement from '../components/Admin/ProductManagement';
import OrdersManagement from '../components/Admin/OrdersManagement';
import OrderDetail from '../components/Admin/OrderDetail';

/**
 * Admin Dashboard - Administrative interface
 * Now includes real product management with GraphQL
 */
function AdminDashboard() {
  const location = useLocation();
  const [stats] = useState<AdminStats>({
    totalOrders: 156,
    totalRevenue: 12450.75,
    totalProducts: 89,
    totalUsers: 234,
    recentOrders: [],
    topProducts: [],
    salesByMonth: [],
  });

  const sidebarItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊', exact: true },
    { path: '/admin/productos', label: 'Productos', icon: '📦' },
    { path: '/admin/pedidos', label: 'Pedidos', icon: '🛒' },
    { path: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
    { path: '/admin/reportes', label: 'Reportes', icon: '📈' },
    { path: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Panel Admin</h2>
            <p className="text-sm text-gray-600">Protex Wear</p>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${isActive(item.path, item.exact)
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DashboardOverview stats={stats} />} />
            <Route path="/productos" element={<ProductManagement />} />
            <Route path="/pedidos" element={<OrdersManagement />} />
            <Route path="/pedidos/:id" element={<OrderDetail />} />
            <Route path="/usuarios" element={<UsersManagement />} />
            <Route path="/reportes" element={<ReportsView />} />
            <Route path="/configuracion" element={<SettingsView />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview({ stats }: { stats: AdminStats }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">€{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🛒</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pedidos Totales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Productos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pedidos Recientes</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">Pedido #ORD-00{i}</p>
                  <p className="text-sm text-gray-600">Cliente Demo {i}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">€{(Math.random() * 200 + 50).toFixed(2)}</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Completado
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/admin/pedidos" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Ver todos los pedidos →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos Populares</h3>
          <div className="space-y-4">
            {[
              { name: 'Casco de Seguridad Industrial', sales: 45 },
              { name: 'Guantes Anticorte', sales: 38 },
              { name: 'Chaleco Reflectante', sales: 32 },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} ventas</p>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(product.sales / 50) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/admin/productos" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Gestionar productos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Products Management Component (now using real GraphQL)
// This component is now imported from ../components/Admin/ProductManagement

// Users Management Component
function UsersManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Usuarios</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p className="text-gray-600">Gestión de usuarios - En desarrollo</p>
      </div>
    </div>
  );
}

// Reports View Component
function ReportsView() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reportes</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p className="text-gray-600">Reportes y analytics - En desarrollo</p>
      </div>
    </div>
  );
}

// Settings View Component
function SettingsView() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Configuración</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p className="text-gray-600">Configuración del sistema - En desarrollo</p>
      </div>
    </div>
  );
}

export default AdminDashboard;