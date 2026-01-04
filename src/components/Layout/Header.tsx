import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCartItemCount } from '../../contexts/CartContext';

/**
 * Header Component
 * Navigation, user menu, and cart indicator
 */
function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const cartItemCount = useCartItemCount();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-color rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PW</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Protex Wear</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/productos" 
              className="text-gray-700 hover:text-primary-color transition-colors"
            >
              Productos
            </Link>
            <Link 
              to="/categorias" 
              className="text-gray-700 hover:text-primary-color transition-colors"
            >
              Categorías
            </Link>
            <Link 
              to="/sobre-nosotros" 
              className="text-gray-700 hover:text-primary-color transition-colors"
            >
              Sobre Nosotros
            </Link>
            <Link 
              to="/contacto" 
              className="text-gray-700 hover:text-primary-color transition-colors"
            >
              Contacto
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden lg:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Cart */}
            <Link 
              to="/carrito" 
              className="relative p-2 text-gray-700 hover:text-primary-color transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-color text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-color transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block">
                    {user?.firstName || 'Usuario'}
                  </span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      to="/pedidos"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mis Pedidos
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Panel Admin
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-color transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="btn-primary"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-color"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/productos" 
                className="text-gray-700 hover:text-primary-color py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link 
                to="/categorias" 
                className="text-gray-700 hover:text-primary-color py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorías
              </Link>
              <Link 
                to="/sobre-nosotros" 
                className="text-gray-700 hover:text-primary-color py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nosotros
              </Link>
              <Link 
                to="/contacto" 
                className="text-gray-700 hover:text-primary-color py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              
              {/* Mobile Search */}
              <div className="pt-4">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;