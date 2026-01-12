import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminStats } from '../types';
import ProductManagement from '../components/Admin/ProductManagement';
import OrdersManagement from '../components/Admin/OrdersManagement';
import OrderDetail from '../components/Admin/OrderDetail';
import logoWhite from '../assets/logo-w.png';
import faviconWhite from '../assets/favicon-w.png';
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

  // Icons defined as clean SVG components for consistency
  const Icons = {
    Dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Products: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
    Orders: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>,
    Users: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Reports: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    Settings: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    BackHome: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Shop: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>,
    Logout: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
  };

  const sidebarItems = [
    { path: '/admin', label: 'Dashboard', icon: Icons.Dashboard, exact: true },
    { path: '/admin/productos', label: 'Productos', icon: Icons.Products },
    { path: '/admin/pedidos', label: 'Pedidos', icon: Icons.Orders },
    { path: '/admin/usuarios', label: 'Usuarios', icon: Icons.Users },
    { path: '/admin/reportes', label: 'Reportes', icon: Icons.Reports },
    { path: '/admin/configuracion', label: 'Configuración', icon: Icons.Settings },
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
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="admin-sidebar-overlay visible"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Mobile Toggle */}
      {/* Mobile Toggle - always visible on mobile */}
      <button
        className="admin-mobile-toggle"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isSidebarOpen ?
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> :
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        }
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>

        <div className="admin-sidebar-header">
          <img
            src={isCollapsed ? faviconWhite : logoWhite}
            alt="Protex Wear"
            className="admin-sidebar-logo"
          />
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            ) : (
              <div className="admin-toggle-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="11 17 6 12 11 7"></polyline>
                  <polyline points="18 17 13 12 18 7"></polyline>
                </svg>
                <span className="admin-sidebar-label">Contraer menú</span>
              </div>
            )}
          </button>

          <Link to="/" className="admin-exit-btn">
            <span className="admin-btn-icon">{Icons.BackHome}</span>
            <span className="admin-sidebar-label">Volver al Inicio</span>
          </Link>
          <Link to="/productos" className="admin-exit-btn">
            <span className="admin-btn-icon">{Icons.Shop}</span>
            <span className="admin-sidebar-label">Ir a la Tienda</span>
          </Link>
          <button
            onClick={() => { /* Logout logic here if needed */ navigate('/login'); }}
            className="admin-exit-btn primary"
          >
            <span className="admin-btn-icon">{Icons.Logout}</span>
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
          <Route path="/pedidos/:id" element={<OrderDetail />} />
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