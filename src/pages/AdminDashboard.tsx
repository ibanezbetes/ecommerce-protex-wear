import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminStats } from '../types';
import ProductManagement from '../components/Admin/ProductManagement';
import logoWhite from '../assets/logo-w.png';
import '../styles/AdminDashboard.css';

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
    <path fill="#ffffffff" d="M14.5 3A2.5 2.5 0 0 1 17 5.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 14.5v-9A2.5 2.5 0 0 1 5.5 3zm-8 3a.5.5 0 0 0-.492.41L6 6.5v7l.008.09a.5.5 0 0 0 .984 0L7 13.5v-7l-.008-.09A.5.5 0 0 0 6.5 6" />
  </svg>
);

const ProductsIcon = () => (
  // Mapped from user 'pedidos' SVG (Box shape)
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 28 28">
    <path fill="#ffffffff" d="M15.395 2.5a3.75 3.75 0 0 0-2.786 0L9.69 3.668l11.25 4.499l4.108-1.644a2.8 2.8 0 0 0-.776-.472zm3.525 6.475l-11.25-4.5l-3.938 1.576a2.7 2.7 0 0 0-.776.472l11.046 4.42zm-16.916-.37q.001-.416.118-.8l11.13 4.453v13.435a4 4 0 0 1-.643-.192L3.732 21.95a2.75 2.75 0 0 1-1.728-2.554zM15.395 25.5q-.316.126-.643.192V12.258l11.13-4.453q.117.384.118.8v10.791a2.75 2.75 0 0 1-1.728 2.554z" />
  </svg>
);

const OrdersIcon = () => (
  // Mapped from user 'pedido' SVG (Cart shape)
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="#ffffffff" d="M2.787 2.28a.75.75 0 0 1 .932.507l.55 1.863h14.655c1.84 0 3.245 1.717 2.715 3.51l-1.655 5.6c-.352 1.193-1.471 1.99-2.715 1.99H8.113c-1.244 0-2.362-.797-2.715-1.99L2.281 3.212a.75.75 0 0 1 .506-.931M6.25 19.5a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0m8 0a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 448 512">
    <path fill="#ffffffff" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128m89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4" />
  </svg>
);

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g fill="#ffffffff">
      <rect width="5" height="18" x="16" y="3" rx="2" />
      <rect width="5" height="12" x="9.5" y="9" rx="2" />
      <rect width="5" height="5" x="3" y="16" rx="2" />
    </g>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="#ffffffff" stroke="#ffffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 5h-3m-4.25-2v4M13 5H3m4 7H3m7.75-2v4M21 12H11m10 7h-3m-4.25-2v4M13 19H3" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="#ffffffff" d="M4 19v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-3q-.425 0-.712-.288T14 20v-5q0-.425-.288-.712T13 14h-2q-.425 0-.712.288T10 15v5q0 .425-.288.713T9 21H6q-.825 0-1.412-.587T4 19" />
  </svg>
);

const ShopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="#ffffffff" d="M3.778 3.655c-.181.36-.27.806-.448 1.696l-.598 2.99a3.06 3.06 0 1 0 6.043.904l.07-.69a3.167 3.167 0 1 0 6.307-.038l.073.728a3.06 3.06 0 1 0 6.043-.904l-.598-2.99c-.178-.89-.267-1.335-.448-1.696a3 3 0 0 0-1.888-1.548C17.944 2 17.49 2 16.582 2H7.418c-.908 0-1.362 0-1.752.107a3 3 0 0 0-1.888 1.548M18.269 13.5a4.53 4.53 0 0 0 2.231-.581V14c0 3.771 0 5.657-1.172 6.828c-.943.944-2.348 1.127-4.828 1.163V18.5c0-.935 0-1.402-.201-1.75a1.5 1.5 0 0 0-.549-.549C13.402 16 12.935 16 12 16s-1.402 0-1.75.201a1.5 1.5 0 0 0-.549.549c-.201.348-.201.815-.201 1.75v3.491c-2.48-.036-3.885-.22-4.828-1.163C3.5 19.657 3.5 17.771 3.5 14v-1.081a4.53 4.53 0 0 0 2.232.581a4.55 4.55 0 0 0 3.112-1.228A4.64 4.64 0 0 0 12 13.5a4.64 4.64 0 0 0 3.156-1.228a4.55 4.55 0 0 0 3.112 1.228" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="#ffffffff" d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z" />
  </svg>
);

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
    { path: '/admin', label: 'Dashboard', icon: <DashboardIcon />, exact: true },
    { path: '/admin/productos', label: 'Productos', icon: <ProductsIcon /> },
    { path: '/admin/pedidos', label: 'Pedidos', icon: <OrdersIcon /> },
    { path: '/admin/usuarios', label: 'Usuarios', icon: <UsersIcon /> },
    { path: '/admin/reportes', label: 'Reportes', icon: <ReportsIcon /> },
    { path: '/admin/configuracion', label: 'Configuración', icon: <SettingsIcon /> },
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                <path fill="#ffffffff" d="M6.293 7.5H4.502a.5.5 0 0 0 0 1h1.79l-.646.647a.5.5 0 1 0 .708.707l1.5-1.5a.5.5 0 0 0 0-.707l-1.5-1.5a.5.5 0 1 0-.708.707zM12 13.001a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6.002a2 2 0 0 0 2 2zm-3-1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5z" />
              </svg>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                  <path fill="#ffffffff" d="m9.707 8.5l.647.647a.5.5 0 0 1-.708.707l-1.5-1.5a.5.5 0 0 1 0-.707l1.5-1.5a.5.5 0 0 1 .708.707l-.647.646h1.791a.5.5 0 0 1 0 1zM4 3a2 2 0 0 0-2 2v6.002a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm3 9.002V4h5a1 1 0 0 1 1 1v6.002a1 1 0 0 1-1 1z" />
                </svg>
                <span className="admin-sidebar-label" style={{ marginLeft: '0.5rem' }}>Contraer menú</span>
              </div>
            )}
          </button>

          <Link to="/" className="admin-exit-btn">
            <span className="admin-btn-icon"><HomeIcon /></span>
            <span className="admin-sidebar-label">Volver al Inicio</span>
          </Link>
          <Link to="/productos" className="admin-exit-btn">
            <span className="admin-btn-icon"><ShopIcon /></span>
            <span className="admin-sidebar-label">Ir a la Tienda</span>
          </Link>
          <button
            onClick={() => { /* Logout logic here if needed */ navigate('/login'); }}
            className="admin-exit-btn primary"
          >
            <span className="admin-btn-icon"><LogoutIcon /></span>
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