import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import SobreNosotrosPage from './pages/SobreNosotrosPage';
import RentingPage from './pages/Services/RentingPage';
import LavanderiaPage from './pages/Services/LavanderiaPage';
import MaquinasPage from './pages/Services/MaquinasPage';
import StockSeguridadPage from './pages/Services/StockSeguridadPage';
import EntregasNominativasPage from './pages/Services/EntregasNominativasPage';
import PersonalizacionPage from './pages/Services/PersonalizacionPage';
import MerchandisingPage from './pages/Services/MerchandisingPage';
import CeePage from './pages/Services/CeePage';

import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import DevAuthConfig from './components/Auth/DevAuthConfig';

/**
 * Main App Component
 * Sets up routing, context providers, and global layout
 */
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

/**
 * App Content Component
 * Handles routing and layout after auth is initialized
 */
function AppContent() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const location = useLocation(); // Move this BEFORE any conditional returns

  // Debug logging
  console.log('🔍 AppContent Debug:', { isLoading, isAuthenticated, user });

  // Show loading spinner while auth is initializing
  if (isLoading) {
    console.log('📱 Mostrando pantalla de carga...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading mb-4"></div>
          <p className="text-gray-600">Cargando Protex Wear...</p>
        </div>
      </div>
    );
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/registro';

  console.log('🏠 Mostrando contenido principal...');


  return (
    <Layout showHeader={!isAuthPage} showFooter={!isAuthPage}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/sobre-nosotros" element={<SobreNosotrosPage />} />

        {/* Service Routes */}
        <Route path="/servicios/renting" element={<RentingPage />} />
        <Route path="/servicios/lavanderia" element={<LavanderiaPage />} />
        <Route path="/servicios/maquinas-expendedoras" element={<MaquinasPage />} />
        <Route path="/servicios/stock-seguridad" element={<StockSeguridadPage />} />
        <Route path="/servicios/entregas-nominativas" element={<EntregasNominativasPage />} />
        <Route path="/servicios/personalizacion" element={<PersonalizacionPage />} />
        <Route path="/servicios/merchandising" element={<MerchandisingPage />} />
        <Route path="/servicios/cee" element={<CeePage />} />

        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/productos/:id" element={<ProductDetailPage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        {/* Protected Routes - Require Authentication */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* Admin Routes - Require Admin Role */}
        <Route path="/admin/*" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Development Auth Configuration Panel */}
      <DevAuthConfig />
    </Layout>
  );
}

export default App;