import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCartItemCount } from '../../contexts/CartContext';
import { useProducts } from '../../hooks/useProducts';
import logo from '../../assets/logo.png';
import S3Image from '../UI/S3Image';
import './styles/Header.css';

/**
 * Static Pages Configuration for Search
 */
const STATIC_PAGES = [
  { name: 'Inicio', path: '/', keywords: ['inicio', 'home', 'principal', 'index'] },
  { name: 'Contacto', path: '/contacto', keywords: ['contacto', 'email', 'telefono', 'direccion', 'soporte', 'ayuda'] },
  { name: 'Sobre Nosotros', path: '/sobre-nosotros', keywords: ['empresa', 'quienes', 'somos', 'mision', 'vision', 'historia'] },
  { name: 'Garantía', path: '/contacto', keywords: ['garantia', 'garantía', 'reparacion', 'devolucion', 'soporte tecnico', 'condiciones'], description: 'Consulta nuestras condiciones de garantía.' },
  { name: 'Servicios de Renting', path: '/servicios/renting', keywords: ['renting', 'alquiler', 'servicio', 'textil'] },
  { name: 'Lavandería', path: '/servicios/lavanderia', keywords: ['lavanderia', 'limpieza', 'ropa', 'higiene'] },
  { name: 'Máquinas Expendedoras', path: '/servicios/maquinas-expendedoras', keywords: ['maquinas', 'vending', 'expendedoras', 'epis'] },
  { name: 'Stock de Seguridad', path: '/servicios/stock-seguridad', keywords: ['stock', 'seguridad', 'almacen', 'inventario'] },
  { name: 'Entregas Nominativas', path: '/servicios/entregas-nominativas', keywords: ['entregas', 'reparto', 'personal', 'distribucion'] },
  { name: 'Personalización', path: '/servicios/personalizacion', keywords: ['personalizacion', 'bordado', 'logo', 'marca', 'serigrafia'] },
  { name: 'Merchandising', path: '/servicios/merchandising', keywords: ['merchandising', 'regalos', 'promocion', 'marketing'] },
  { name: 'CEE', path: '/servicios/cee', keywords: ['cee', 'centro', 'especial', 'empleo', 'discapacidad'] },
  { name: 'Carrito', path: '/carrito', keywords: ['carrito', 'cesta', 'compra', 'finalizar'] },
  { name: 'Mi Perfil', path: '/perfil', keywords: ['perfil', 'usuario', 'cuenta', 'pedidos'] },
];

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
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileUserOpen, setIsMobileUserOpen] = useState(false);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);
  const mobileMenuBtnRef = React.useRef<HTMLButtonElement>(null);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [staticResults, setStaticResults] = useState<typeof STATIC_PAGES>([]);
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
      setStaticResults([]);
      return;
    }

    // Filter static pages immediately
    const lowerQuery = searchQuery.toLowerCase();
    const staticMatches = STATIC_PAGES.filter(page =>
      page.name.toLowerCase().includes(lowerQuery) ||
      page.keywords.some(k => k.toLowerCase().includes(lowerQuery))
    );
    setStaticResults(staticMatches);

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
      const target = event.target as Node;
      if (
        isMenuOpen &&
        menuRef.current && !menuRef.current.contains(target) &&
        mobileMenuRef.current && !mobileMenuRef.current.contains(target) &&
        mobileMenuBtnRef.current && !mobileMenuBtnRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(target)) {
        setIsServicesMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

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
            <img src={logo} alt="Protex Wear" className="header-logo" />
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
              className="header-icon-btn"
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
              <div className="user-menu-container responsive-hide-tiny" ref={menuRef}>
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
                      <User className="w-4 h-4 mr-2" /> Mi Perfil
                    </Link>
                    <Link
                      to="/pedidos"
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Package className="w-4 h-4 mr-2" /> Mis Pedidos
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" /> Panel Admin
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
                      <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons-container responsive-hide-tiny">
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
              ref={mobileMenuBtnRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden header-icon-btn"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden header-mobile-menu border-t border-gray-200"
          >
            <nav className="flex flex-col space-y-2">
              {/* Mobile User Actions - Visible only on small screens where header user menu is hidden */}
              <div className="responsive-show-tiny header-mobile-user-section">
                {isAuthenticated ? (
                  <>
                    <button
                      className="header-mobile-profile-button"
                      onClick={() => setIsMobileUserOpen(!isMobileUserOpen)}
                    >
                      <div className="header-mobile-profile-info">
                        <div className="header-mobile-user-avatar">
                          {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                          <span className="header-mobile-user-name">
                            {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Usuario'}
                          </span>
                          <span className="header-mobile-user-email">{user?.email}</span>
                        </div>
                      </div>
                      <svg
                        className={`header-mobile-chevron h-4 w-4 transform ${isMobileUserOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isMobileUserOpen && (
                      <div className="header-mobile-submenu">
                        <Link to="/perfil" className="header-mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                          <User className="w-4 h-4 mr-3" /> Mi Perfil
                        </Link>
                        <Link to="/pedidos" className="header-mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                          <Package className="w-4 h-4 mr-3" /> Mis Pedidos
                        </Link>
                        {user?.role === 'ADMIN' && (
                          <Link to="/admin" className="header-mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                            <Settings className="w-4 h-4 mr-3" /> Panel Admin
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleLogout();
                          }}
                          className="header-mobile-nav-link text-red-600 hover:bg-red-50 hover:text-red-700 w-full"
                        >
                          <LogOut className="w-4 h-4 mr-3" /> Cerrar Sesión
                        </button>
                      </div>
                    )}
                    <hr className="my-2 border-gray-100" />
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <Link
                      to="/login"
                      className="header-mobile-btn-login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/registro"
                      className="header-mobile-btn-register"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
              <Link
                to="/productos"
                className="header-mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                to="/categorias"
                className="header-mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorías
              </Link>
              <Link
                to="/sobre-nosotros"
                className="header-mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nosotros
              </Link>
              <div>
                <button
                  className="header-mobile-nav-link justify-between"
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                >
                  <span>Servicios</span>
                  <svg
                    className={`h-4 w-4 transform transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isMobileServicesOpen && (
                  <div className="header-mobile-submenu">
                    <Link to="/servicios/renting" className="header-mobile-submenu-item" onClick={() => setIsMenuOpen(false)}>
                      Servicios de renting
                    </Link>
                    <Link to="/servicios/lavanderia" className="header-mobile-submenu-item" onClick={() => setIsMenuOpen(false)}>
                      Servicios de lavandería
                    </Link>
                    <Link to="/servicios/maquinas-expendedoras" className="header-mobile-submenu-item" onClick={() => setIsMenuOpen(false)}>
                      Máquinas expendedoras de epis
                    </Link>
                    <Link to="/servicios/stock-seguridad" className="header-mobile-submenu-item" onClick={() => setIsMenuOpen(false)}>
                      Stock de seguridad
                    </Link>
                    <Link to="/servicios/entregas-nominativas" className="header-mobile-submenu-item" onClick={() => setIsMenuOpen(false)}>
                      Entregas nominativas
                    </Link>
                    <Link to="/servicios/personalizacion" className="header-mobile-submenu-item" onClick={() => setIsMenuOpen(false)}>
                      Personalización ropa trabajo
                    </Link>
                    <Link to="/servicios/merchandising" className="header-mobile-submenu-item" onClick={() => setIsMenuOpen(false)}>
                      Merchandising
                    </Link>
                    <Link to="/servicios/cee" className="header-mobile-submenu-item" onClick={() => setIsMenuOpen(false)}>
                      CEE
                    </Link>
                  </div>
                )}
              </div>
              <Link
                to="/contacto"
                className="header-mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
            </nav>
          </div>
        )
        }
      </div >

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
              // Calculate total matches
              <span>
                {isSearching ? 'Buscando...' : `${searchResults.length + staticResults.length} resultados encontrados`}
              </span>
            )}
          </div>

          {/* Search Results List */}
          {searchQuery !== '' && (
            <div className="max-w-[900px] mx-auto mt-4 max-h-[60vh] overflow-y-auto custom-scrollbar pb-4 space-y-6">

              {/* Static Pages Results */}
              {staticResults.length > 0 && (
                <div className="mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Páginas y Servicios
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {staticResults.map((page) => (
                      <Link
                        key={page.name}
                        to={page.path}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center p-2.5 bg-white border border-blue-100 hover:border-blue-400 hover:shadow-md rounded-lg transition-all duration-200 group"
                      >
                        <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-sm text-gray-900 group-hover:text-blue-700">{page.name}</p>
                          {page.description && <p className="text-xs text-gray-500">{page.description}</p>}
                        </div>
                        <svg className="ml-auto w-4 h-4 text-gray-300 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Results */}
              {!isSearching && searchResults.length > 0 ? (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Productos
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {searchResults.slice(0, 4).map((product) => {
                      const displayImageKey = product.imageUrl || (product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : null);

                      return (
                        <Link
                          key={product.id}
                          to={`/productos/${product.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-start p-3 bg-white border border-gray-200 hover:border-primary-color hover:shadow-lg rounded-xl transition-all duration-200 group relative overflow-hidden"
                        >
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary-color to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="h-16 w-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                            <S3Image
                              s3Key={displayImageKey}
                              alt={product.name}
                              className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="ml-4 flex-grow min-w-0">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0 mr-4">
                                <p className="font-bold text-gray-900 text-base leading-tight mb-1 group-hover:text-primary-color transition-colors truncate">
                                  {product.name}
                                </p>
                                {product.category && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-primary-color mb-1">
                                    {product.category}
                                  </span>
                                )}
                              </div>
                              <span className="font-bold text-gray-900 text-base whitespace-nowrap bg-gray-50 px-2 py-0.5 rounded-md group-hover:bg-primary-color group-hover:text-white transition-colors duration-200">
                                €{product.price.toFixed(2)}
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-0.5">
                              {product.description || 'Sin descripción disponible.'}
                            </p>
                          </div>
                          <div className="flex flex-col justify-center h-full ml-2 self-center">
                            <div className="p-1.5 rounded-full text-gray-400 group-hover:text-primary-color group-hover:bg-blue-50 transition-colors">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {searchResults.length > 4 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color w-full justify-center transition-colors"
                      >
                        Ver los {searchResults.length} resultados
                        <svg className="ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                !isSearching && staticResults.length === 0 && (
                  <div className="search-no-results">
                    <p>No se encontraron productos ni páginas para "{searchQuery}"</p>
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
    </header >
  );
}

export default Header;
