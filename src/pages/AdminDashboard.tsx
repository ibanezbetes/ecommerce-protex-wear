import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminStats } from '../types';
import ProductManagement from '../components/Admin/ProductManagement';
import logoWhite from '../assets/logo-w.png';
import '../styles/AdminDashboard.css';

/**
 * Admin Dashboard - Administrative interface
 * Scoped layout with bespoke sidebar and premium styling
 */
function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="admin-dashboard-container">
      {/* Mobile Toggle */}
      <button className="admin-mobile-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? '✖' : '☰'}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>

        <div className="admin-sidebar-header">
          <img src={logoWhite} alt="Protex Wear" className="admin-sidebar-logo" />
          <span className="admin-sidebar-brand">Admin Panel</span>
        </div>

        <nav className="admin-sidebar-nav">
          <ul className="admin-sidebar-list">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`admin-nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span className="admin-sidebar-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          {/* Desktop Collapse Toggle */}
          <button className="admin-sidebar-toggle-btn" onClick={toggleCollapse}>
            {isCollapsed ? (
              // Icon for "Expand" (Sidebar is collapsed)
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="currentColor" d="M6.293 7.5H4.502a.5.5 0 0 0 0 1h1.79l-.646.647a.5.5 0 1 0 .708.707l1.5-1.5a.5.5 0 0 0 0-.707l-1.5-1.5a.5.5 0 1 0-.708.707zM12 13.001a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6.002a2 2 0 0 0 2 2zm-3-1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5z" />
              </svg>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <path fill="currentColor" d="m9.707 8.5l.647.647a.5.5 0 0 1-.708.707l-1.5-1.5a.5.5 0 0 1 0-.707l1.5-1.5a.5.5 0 0 1 .708.707l-.647.646h1.791a.5.5 0 0 1 0 1zM4 3a2 2 0 0 0-2 2v6.002a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm3 9.002V4h5a1 1 0 0 1 1 1v6.002a1 1 0 0 1-1 1z" />
                </svg>
                <span className="admin-sidebar-label" style={{ marginLeft: '0.5rem' }}>Contraer menú</span>
              </div>
            )}
          </button>

          <Link to="/" className="admin-exit-btn">
            <span className="admin-btn-icon" style={{ marginRight: '0.5rem', fontSize: '1.2em' }}>🏠</span>
            <span className="admin-sidebar-label">Volver al Inicio</span>
          </Link>
          <Link to="/productos" className="admin-exit-btn">
            <span className="admin-btn-icon" style={{ marginRight: '0.5rem', fontSize: '1.2em' }}>🛍️</span>
            <span className="admin-sidebar-label">Ir a la Tienda</span>
          </Link>
          <button
            onClick={() => { /* Logout logic here if needed */ navigate('/login'); }}
            className="admin-exit-btn primary"
          >
            <span className="admin-btn-icon" style={{ marginRight: '0.5rem', fontSize: '1.2em' }}>🚪</span>
            <span className="admin-sidebar-label">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main-content ${isCollapsed ? 'collapsed' : ''}`}>
        <Routes>
          <Route path="/" element={<DashboardOverview stats={stats} />} />
          <Route path="/productos" element={<ProductManagement />} />
          <Route path="/pedidos" element={<OrdersManagement />} />
          <Route path="/usuarios" element={<UsersManagement />} />
          <Route path="/reportes" element={<ReportsView />} />
          <Route path="/configuracion" element={<SettingsView />} />
        </Routes>
      </main>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview({ stats }: { stats: AdminStats }) {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard General</h1>
        <p className="admin-page-subtitle">Resumen de actividad y estadísticas clave</p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
            <span>💰</span>
          </div>
          <div>
            <p className="admin-stat-label">Ingresos Totales</p>
            <p className="admin-stat-value">€{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
            <span>🛒</span>
          </div>
          <div>
            <p className="admin-stat-label">Pedidos Totales</p>
            <p className="admin-stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#f3e8ff', color: '#6b21a8' }}>
            <span>📦</span>
          </div>
          <div>
            <p className="admin-stat-label">Productos</p>
            <p className="admin-stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
            <span>👥</span>
          </div>
          <div>
            <p className="admin-stat-label">Usuarios</p>
            <p className="admin-stat-value">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-activity-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Pedidos Recientes</h3>
          </div>
          <div className="space-y-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="admin-list-item">
                <div>
                  <p className="admin-list-text">Pedido #ORD-00{i}</p>
                  <p className="admin-list-subtext">Cliente Demo {i}</p>
                </div>
                <div className="text-right">
                  <p className="admin-list-text">€{(Math.random() * 200 + 50).toFixed(2)}</p>
                  <span className="admin-status-badge status-success">
                    Completado
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/pedidos" className="admin-link-btn">
            Ver todos los pedidos →
          </Link>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Productos Populares</h3>
          </div>
          <div className="space-y-0">
            {[
              { name: 'Casco de Seguridad Industrial', sales: 45 },
              { name: 'Guantes Anticorte', sales: 38 },
              { name: 'Chaleco Reflectante', sales: 32 },
            ].map((product, i) => (
              <div key={i} className="admin-list-item">
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <p className="admin-list-text">{product.name}</p>
                  <p className="admin-list-subtext">{product.sales} ventas</p>
                </div>
                <div style={{ width: '30%' }}>
                  <div className="admin-progress-bar-bg">
                    <div
                      className="admin-progress-bar-fill"
                      style={{ width: `${(product.sales / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/productos" className="admin-link-btn">
            Gestionar productos →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Orders Management Component
function OrdersManagement() {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestión de Pedidos</h1>
        <p className="admin-page-subtitle">Administra y procesa los pedidos de la tienda</p>
      </div>
      <div className="admin-card">
        <p className="admin-list-subtext">Gestión de pedidos - En desarrollo</p>
      </div>
    </div>
  );
}

// Users Management Component
function UsersManagement() {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestión de Usuarios</h1>
        <p className="admin-page-subtitle">Administra clientes y roles de usuario</p>
      </div>
      <div className="admin-card">
        <p className="admin-list-subtext">Gestión de usuarios - En desarrollo</p>
      </div>
    </div>
  );
}

// Reports View Component
function ReportsView() {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reportes</h1>
        <p className="admin-page-subtitle">Análisis detallado del rendimiento de la tienda</p>
      </div>
      <div className="admin-card">
        <p className="admin-list-subtext">Reportes y analytics - En desarrollo</p>
      </div>
    </div>
  );
}

// Settings View Component
function SettingsView() {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Configuración</h1>
        <p className="admin-page-subtitle">Ajustes generales del sistema</p>
      </div>
      <div className="admin-card">
        <p className="admin-list-subtext">Configuración del sistema - En desarrollo</p>
      </div>
    </div>
  );
}

export default AdminDashboard;