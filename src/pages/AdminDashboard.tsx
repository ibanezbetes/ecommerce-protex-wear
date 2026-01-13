import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminStats, Order, Product } from '../types';
import ProductManagement from '../components/Admin/ProductManagement';
import OrdersManagement from '../components/Admin/OrdersManagement';
import OrderDetail from '../components/Admin/OrderDetail';
import { orderOperations, productOperations, userOperations } from '../services/graphql';
import LoadingSpinner from '../components/UI/LoadingSpinner';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    topProducts: [],
    salesByMonth: [],
  });

  // Fetch real data on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products, orders, and users counts
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          productOperations.listProducts(undefined, 1000),
          orderOperations.listAllOrders(undefined, 1000),
          userOperations.listUsers(undefined, 1000)
        ]);

        const products = productsRes.data as Product[];
        const orders = ordersRes.data as Order[];
        // Users list might need adjustment based on schema/auth
        const users = usersRes?.data || [];

        // Calculate total revenue from all orders
        const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Get 5 most recent orders
        const recentOrders = [...orders]
          .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
          .slice(0, 5);

        // Get 5 products as "top" products (for now, eventually use real sales data)
        const topProducts = products.slice(0, 5);

        setStats({
          totalOrders: orders.length,
          totalRevenue: revenue,
          totalProducts: products.length,
          totalUsers: users.length,
          recentOrders: recentOrders as any[], // Casting to match types if needed
          topProducts: topProducts as any[],
          salesByMonth: [], // Future: group orders by month
        });
      } catch (err: any) {
        console.error('Error fetching admin stats:', err);
        setError('No se pudieron cargar las estadísticas reales. Asegúrate de tener permisos de ADMIN.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
          <button className="admin-sidebar-toggle-btn" onClick={toggleCollapse}>
            {isCollapsed ? (
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
            onClick={() => { navigate('/login'); }}
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
          <Route path="/" element={<DashboardOverview stats={stats} loading={loading} error={error} />} />
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
function DashboardOverview({ stats, loading, error }: { stats: AdminStats, loading: boolean, error: string | null }) {
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [importingProducts, setImportingProducts] = useState(false);
  const [importProgress, setImportProgress] = useState<{ current: number, total: number, errors: number } | null>(null);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const importProducts = async () => {
    try {
      setImportingProducts(true);
      setImportMessage(null);
      setImportProgress(null);

      // Fetch the products JSON file
      const response = await fetch('/migration/products_source.json');
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo de productos');
      }

      const products = await response.json();
      const total = products.length;
      let imported = 0;
      let errors = 0;

      console.log(`📦 Iniciando importación de ${total} productos...`);

      // Import products in batches of 5 to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);

        await Promise.all(
          batch.map(async (product: any) => {
            try {
              // Convert specifications to JSON string if it's an object
              const productData: any = {
                sku: product.sku,
                name: product.name,
                description: product.description || '',
                price: product.price || 0,
                stock: product.stock || 0,
                category: product.category || '',
                subcategory: product.subcategory || '',
                brand: product.brand || '',
                imageUrl: product.imageUrl || '',
                imageUrls: product.imageUrls || [],
                specifications: typeof product.specifications === 'object'
                  ? JSON.stringify(product.specifications)
                  : product.specifications,
                isActive: product.isActive !== false,
                tags: product.tags || []
              };

              const result = await productOperations.createProduct(productData);

              if (result.errors) {
                console.error(`❌ Error importing ${product.sku}:`, result.errors);
                errors++;
              } else {
                imported++;
                console.log(`✅ Imported: ${product.sku} - ${product.name}`);
              }
            } catch (err) {
              console.error(`❌ Error importing ${product.sku}:`, err);
              errors++;
            }
          })
        );

        // Update progress
        setImportProgress({
          current: Math.min(i + batchSize, total),
          total,
          errors
        });

        // Small delay between batches to avoid rate limiting
        if (i + batchSize < products.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      console.log(`\n✅ Importación completada: ${imported} productos importados, ${errors} errores`);

      setImportMessage({
        type: errors === 0 ? 'success' : 'error',
        text: `Importación completada: ${imported} productos importados${errors > 0 ? `, ${errors} errores` : ''}`
      });

      // Reload page after 3 seconds to show the new products
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (err: any) {
      console.error('❌ Error during import:', err);
      setImportMessage({ type: 'error', text: err.message || 'Error desconocido durante la importación' });
    } finally {
      setImportingProducts(false);
      setImportProgress(null);
    }
  };

  const createDemoOrder = async () => {
    try {
      setCreatingOrder(true);
      setOrderMessage(null);

      const testOrder: any = {
        userId: 'test-user-' + Date.now(),
        customerEmail: 'daniel.lalanza01@gmail.com',
        customerName: 'Daniel Lalanza',
        customerCompany: 'Protex Wear Test',

        items: JSON.stringify([
          {
            productId: 'demo-product-1',
            sku: 'DEMO-001',
            name: 'Casco de Seguridad Profesional',
            quantity: 2,
            price: 45.99
          },
          {
            productId: 'demo-product-2',
            sku: 'DEMO-002',
            name: 'Guantes de Protección',
            quantity: 5,
            price: 12.50
          }
        ]),

        subtotal: 154.48,
        taxAmount: 32.44,
        shippingAmount: 8.00,
        discountAmount: 0,
        totalAmount: 194.92,

        status: 'PENDING',

        shippingAddress: JSON.stringify({
          street: 'Calle Mayor 123',
          city: 'Madrid',
          state: 'Madrid',
          postalCode: '28001',
          country: 'España'
        }),

        billingAddress: JSON.stringify({
          street: 'Calle Mayor 123',
          city: 'Madrid',
          state: 'Madrid',
          postalCode: '28001',
          country: 'España'
        }),

        shippingMethod: 'Standard',
        paymentMethod: 'credit_card',
        paymentStatus: 'PENDING',

        customerNotes: 'Pedido de prueba - Por favor entregar en horario de oficina',
        adminNotes: 'Pedido de prueba creado automáticamente desde el Admin Panel',

        orderDate: new Date().toISOString()
      };

      const result = await orderOperations.createOrder(testOrder);

      if (result.errors) {
        console.error('❌ GraphQL Errors:', result.errors);
        setOrderMessage({ type: 'error', text: 'Error al crear el pedido: ' + JSON.stringify(result.errors) });
        return;
      }

      if (!result.data) {
        console.error('❌ No data returned');
        setOrderMessage({ type: 'error', text: 'No se recibieron datos del servidor' });
        return;
      }

      console.log('✅ Demo order created:', result.data);
      setOrderMessage({
        type: 'success',
        text: `¡Pedido demo creado exitosamente! ID: ${result.data.id?.substring(0, 8)}... Total: €${result.data.totalAmount}`
      });

      // Reload page after 2 seconds to show the new order
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err: any) {
      console.error('❌ Error creating demo order:', err);
      setOrderMessage({ type: 'error', text: err.message || 'Error desconocido al crear el pedido' });
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Cargando estadísticas reales..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <h3 className="text-lg font-semibold mb-2">Error de Carga</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard General</h1>
          <p className="admin-page-subtitle">Actividad y estadísticas en tiempo real</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
          <button
            onClick={importProducts}
            disabled={importingProducts}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {importingProducts ? (
              importProgress ? `📦 ${importProgress.current}/${importProgress.total}` : 'Importando...'
            ) : '📦 Importar Productos'}
          </button>
          <button
            onClick={createDemoOrder}
            disabled={creatingOrder}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {creatingOrder ? 'Creando...' : '🎯 Crear Pedido Demo'}
          </button>
        </div>
      </div>

      {importMessage && (
        <div className={`p-4 mb-4 rounded-lg ${importMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          <p>{importMessage.text}</p>
          {importProgress && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                />
              </div>
              <p className="text-sm mt-1">
                {importProgress.current} de {importProgress.total} productos
                {importProgress.errors > 0 && ` (${importProgress.errors} errores)`}
              </p>
            </div>
          )}
        </div>
      )}

      {orderMessage && (
        <div className={`p-4 mb-4 rounded-lg ${orderMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          <p>{orderMessage.text}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div>
            <p className="admin-stat-label">Ingresos Totales</p>
            <p className="admin-stat-value">€{stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
          <div>
            <p className="admin-stat-label">Pedidos Totales</p>
            <p className="admin-stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#f3e8ff', color: '#6b21a8' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.78 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path><polyline points="2.32 6.16 12 11 21.68 6.16"></polyline><line x1="12" y1="22.76" x2="12" y2="11"></line><line x1="7" y1="3.5" x2="17" y2="8.5"></line></svg>
          </div>
          <div>
            <p className="admin-stat-label">Productos</p>
            <p className="admin-stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
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
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order: any) => (
                <div key={order.id} className="admin-list-item">
                  <div>
                    <p className="admin-list-text">Pedido #{order.id.substring(0, 8)}</p>
                    <p className="admin-list-subtext">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="admin-list-text">€{order.totalAmount?.toFixed(2)}</p>
                    <span className={`admin-status-badge status-${order.status?.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500 text-center">No hay pedidos registrados</p>
            )}
          </div>
          <Link to="/admin/pedidos" className="admin-link-btn">
            Ver todos los pedidos →
          </Link>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Productos en Catálogo</h3>
          </div>
          <div className="space-y-0">
            {stats.topProducts.length > 0 ? (
              stats.topProducts.map((product: any, i) => (
                <div key={product.id || i} className="admin-list-item">
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <p className="admin-list-text">{product.name}</p>
                    <p className="admin-list-subtext">{product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="admin-list-text">€{product.price?.toFixed(2)}</p>
                    <p className="admin-list-subtext">Stock: {product.stock}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500 text-center">No hay productos en el catálogo</p>
            )}
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
        <p className="admin-list-subtext">Gestión de usuarios - Funcionalidad del sistema en desarrollo</p>
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
        <p className="admin-list-subtext">Reportes y analytics - Módulo premium en desarrollo</p>
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
        <p className="admin-list-subtext">Configuración del sistema - Opciones de administración global</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
