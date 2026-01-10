import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCartItemCount } from '../../contexts/CartContext';
import { useProducts } from '../../hooks/useProducts';
import logo from '../../assets/logo.png';
import './styles/Header.css';

/**
 * Header Component
 * Navigation, user menu, and cart indicator
 */
function Header() {

  const { user, isAuthenticated, logout } = useAuth();
  const cartItemCount = useCartItemCount();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const servicesMenuRef = React.useRef<HTMLDivElement>(null);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = React.useRef<HTMLDivElement>(null);

  // Real Product Filtering Hook
  const {
    products: searchResults,
    searchProducts,
    loading: isSearching
  } = useProducts({
    autoFetch: false,
    limit: 5 // Limit suggestions for the dropdown
  });

  // Debounced Search Effect
  React.useEffect(() => {
    // If empty, clear results (locally managed by hook state essentially, but we can verify)
    if (searchQuery.trim() === '') {
      // Maybe we can clear results or just do nothing.
      // useProducts doesn't have clearProducts, but we can search for empty to maybe reset?
      // Actually, let's just not search if empty.
      return;
    }

    const timeoutId = setTimeout(() => {
      searchProducts(searchQuery);
    }, 400); // 400ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchProducts]);

  // Navigate to full search on Enter
  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
        setIsServicesMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header-main">
      <div className="header-wide-container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Protex Wear" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="header-nav">
            <Link to="/productos" className="header-nav-link">
              Productos
            </Link>
            <Link to="/categorias" className="header-nav-link">
              Categorías
            </Link>
            <Link to="/sobre-nosotros" className="header-nav-link">
              Sobre Nosotros
            </Link>
            {/* Servicios Dropdown */}
            <div className="services-menu-container" ref={servicesMenuRef}>
              <button
                className="header-nav-link services-menu-btn"
                onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
                onMouseEnter={() => setIsServicesMenuOpen(true)}
              >
                Servicios
                <svg className={`dropdown-icon ${isServicesMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isServicesMenuOpen && (
                <div
                  className="dropdown-menu dropdown-left w-64"
                  onMouseLeave={() => setIsServicesMenuOpen(false)}
                >
                  <Link to="/servicios/renting" className="dropdown-item" onClick={() => setIsServicesMenuOpen(false)}>
                    <span className="ml-2">Servicios de renting</span>
                  </Link>
                  <Link to="/servicios/lavanderia" className="dropdown-item" onClick={() => setIsServicesMenuOpen(false)}>
                    <span className="ml-2">Servicios de lavandería</span>
                  </Link>
                  <Link to="/servicios/maquinas-expendedoras" className="dropdown-item" onClick={() => setIsServicesMenuOpen(false)}>
                    <span className="ml-2">Máquinas expendedoras de epis</span>
                  </Link>
                  <Link to="/servicios/stock-seguridad" className="dropdown-item" onClick={() => setIsServicesMenuOpen(false)}>
                    <span className="ml-2">Stock de seguridad</span>
                  </Link>
                  <Link to="/servicios/entregas-nominativas" className="dropdown-item" onClick={() => setIsServicesMenuOpen(false)}>
                    <span className="ml-2">Entregas nominativas</span>
                  </Link>
                  <Link to="/servicios/personalizacion" className="dropdown-item" onClick={() => setIsServicesMenuOpen(false)}>
                    <span className="ml-2">Personalización ropa trabajo</span>
                  </Link>
                  <Link to="/servicios/merchandising" className="dropdown-item" onClick={() => setIsServicesMenuOpen(false)}>
                    <span className="ml-2">Merchandising</span>
                  </Link>
                  <Link to="/servicios/cee" className="dropdown-item" onClick={() => setIsServicesMenuOpen(false)}>
                    <span className="ml-2">CEE</span>
                  </Link>
                </div>
              )}
            </div>
            <Link to="/contacto" className="header-nav-link">
              Contacto
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Toggle Button */}
            <button
              onClick={() => setIsSearchOpen(prev => !prev)}
              className="icon-btn"
              aria-label="Buscar"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Cart */}
            <Link
              to="/carrito"
              className="cart-icon-btn"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 21a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m-8 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3M3.71 5.4h15.214c1.378 0 2.373 1.27 1.995 2.548l-1.654 5.6C19.01 14.408 18.196 15 17.27 15H8.112c-.927 0-1.742-.593-1.996-1.452zm0 0L3 3" />
              </svg>
              {cartItemCount > 0 && (
                <span className="cart-badge">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="user-menu-container" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="user-menu-btn"
                >
                  <div className="user-avatar">
                    <span>
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
                  <div className="dropdown-menu dropdown-right">
                    <div className="dropdown-user-info">
                      <p className="font-semibold text-gray-900 truncate">
                        {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Usuario'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <hr className="dropdown-divider-light" />

                    <Link
                      to="/perfil"
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-2">👤</span> Mi Perfil
                    </Link>
                    <Link
                      to="/pedidos"
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-2">📦</span> Mis Pedidos
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="mr-2">⚙️</span> Panel Admin
                      </Link>
                    )}
                    <hr className="dropdown-divider" />
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="dropdown-item dropdown-item-logout w-full text-left"
                    >
                      <span className="mr-2">🚪</span> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons-container">
                <Link
                  to="/login"
                  className="btn-login"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="btn-register"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden icon-btn"
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
                className="block px-4 py-2 text-gray-700 hover:text-primary-color hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                to="/categorias"
                className="block px-4 py-2 text-gray-700 hover:text-primary-color hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorías
              </Link>
              <Link
                to="/sobre-nosotros"
                className="block px-4 py-2 text-gray-700 hover:text-primary-color hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nosotros
              </Link>
              <Link
                to="/servicios"
                className="block px-4 py-2 text-gray-700 hover:text-primary-color hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link
                to="/contacto"
                className="block px-4 py-2 text-gray-700 hover:text-primary-color hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>

              {/* Mobile Search */}
              <div className="px-4 pt-2">
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

      {isSearchOpen && (
        <div className="search-overlay" ref={searchRef}>
          <div className="search-box">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Buscar productos..."
              className="search-overlay-input"
            />
          </div>

          <div className="search-recent">
            {searchQuery === '' ? (
              <>
                <span>Resultados de búsquedas recientes</span>
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  Limpiar
                </button>
              </>
            ) : (
              <span>
                {isSearching ? 'Buscando...' : `${searchResults.length} resultados encontrados`}
              </span>
            )}
          </div>

          {/* Search Results List */}
          {searchQuery !== '' && (
            <div className="max-w-[900px] mx-auto mt-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {!isSearching && searchResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/productos/${product.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4 flex-grow">
                        <p className="font-medium text-gray-900 group-hover:text-primary-color">{product.name}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-0.5">
                          <span>{product.category}</span>
                          <span className="mx-2">•</span>
                          <span className="font-medium text-gray-700">€{product.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <svg className="ml-auto h-5 w-5 text-gray-300 group-hover:text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              ) : (
                !isSearching && (
                  <div className="search-no-results">
                    <p>No se encontraron productos para "{searchQuery}"</p>
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
                      }}
                      className="search-no-results-btn"
                    >
                      Ver todos los filtros en el catálogo
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
