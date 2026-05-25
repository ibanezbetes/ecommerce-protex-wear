import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import logo from '../../assets/logo.png';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount: cartItemCount, openCart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const servicesMenuRef = React.useRef<HTMLDivElement>(null);

  // Animation state for cart badge
  const [isCartBumping, setIsCartBumping] = useState(false);

  React.useEffect(() => {
    if (cartItemCount === 0) return;
    setIsCartBumping(true);
    const timer = setTimeout(() => setIsCartBumping(false), 300);
    return () => clearTimeout(timer);
  }, [cartItemCount]);

  const menuRef = React.useRef<HTMLDivElement>(null);
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
  }, [menuRef, servicesMenuRef]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Protex Wear" className="h-12 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/productos" className="text-black hover:text-primary-color transition-colors font-normal" style={{ textDecoration: 'none' }}>Productos</Link>
            <Link to="/categorias" className="text-black hover:text-primary-color transition-colors font-normal" style={{ textDecoration: 'none' }}>Categorías</Link>
            <Link to="/sobre-nosotros" className="text-black hover:text-primary-color transition-colors font-normal" style={{ textDecoration: 'none' }}>Sobre Nosotros</Link>

            {/* Servicios Dropdown */}
            <div className="relative" ref={servicesMenuRef}>
              <button
                className="text-black hover:text-primary-color transition-colors font-normal flex items-center space-x-1"
                onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
                onMouseEnter={() => setIsServicesMenuOpen(true)}
              >
                <span>Servicios</span>
                <svg className={`h-4 w-4 transition-transform ${isServicesMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isServicesMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                  onMouseLeave={() => setIsServicesMenuOpen(false)}
                >
                  <Link to="/servicios/renting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsServicesMenuOpen(false)}><span>🔄</span> <span className="ml-2">Servicios de renting</span></Link>
                  <Link to="/servicios/lavanderia" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsServicesMenuOpen(false)}><span>🧺</span> <span className="ml-2">Servicios de lavandería</span></Link>
                  <Link to="/servicios/maquinas-expendedoras" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsServicesMenuOpen(false)}><span>🤖</span> <span className="ml-2">Máquinas expendedoras de epis</span></Link>
                  <Link to="/servicios/stock-seguridad" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsServicesMenuOpen(false)}><span>🔒</span> <span className="ml-2">Stock de seguridad</span></Link>
                  <Link to="/servicios/entregas-nominativas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsServicesMenuOpen(false)}><span>📦</span> <span className="ml-2">Entregas nominativas</span></Link>
                  <Link to="/servicios/personalizacion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsServicesMenuOpen(false)}><span>👕</span> <span className="ml-2">Personalización ropa trabajo</span></Link>
                  <Link to="/servicios/merchandising" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsServicesMenuOpen(false)}><span>🎁</span> <span className="ml-2">Merchandising</span></Link>
                  <Link to="/servicios/cee" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsServicesMenuOpen(false)}><span>🏢</span> <span className="ml-2">CEE</span></Link>
                </div>
              )}
            </div>

            <Link to="/contacto" className="text-black hover:text-primary-color transition-colors font-normal" style={{ textDecoration: 'none' }}>Contacto</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="relative">
                <input type="text" placeholder="Buscar productos..." className="w-48 lg:w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent text-sm" />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
            </div>

            <button onClick={openCart} className="relative p-2 text-gray-700 hover:text-primary-color transition-colors cursor-pointer bg-transparent border-0">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 21a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m-8 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3M3.71 5.4h15.214c1.378 0 2.373 1.27 1.995 2.548l-1.654 5.6C19.01 14.408 18.196 15 17.27 15H8.112c-.927 0-1.742-.593-1.996-1.452zm0 0L3 3" />
              </svg>
              {cartItemCount > 0 && (
                <span className={`absolute -top-1 -right-1 bg-primary-color text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-transform duration-300 ${isCartBumping ? 'scale-125 bg-red-500' : 'scale-100'}`}>
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 text-gray-700 hover:text-primary-color transition-colors bg-transparent border-0 cursor-pointer">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
                  </div>
                  <span className="hidden md:block">{user?.firstName || 'Usuario'}</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link to="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Mi Perfil</Link>
                    <Link to="/pedidos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Mis Pedidos</Link>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Panel Admin</Link>
                    )}
                    <hr className="my-1" />
                    <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 bg-transparent border-0 cursor-pointer">Cerrar Sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-gray-900 font-medium border border-gray-300 rounded-lg hover:border-primary-color hover:bg-gray-50 transition-colors text-center no-underline" style={{ textDecoration: 'none' }}>Iniciar Sesión</Link>
                <Link to="/registro" className="btn-primary px-6 py-2 rounded-md font-medium" style={{ textDecoration: 'none' }}>Registrarse</Link>
              </div>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden icon-btn">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <Link to="/productos" className="text-gray-700 hover:text-primary-color py-2" onClick={() => setIsMenuOpen(false)}>Productos</Link>
              <Link to="/categorias" className="text-gray-700 hover:text-primary-color py-2" onClick={() => setIsMenuOpen(false)}>Categorías</Link>
              <Link to="/sobre-nosotros" className="text-gray-700 hover:text-primary-color py-2" onClick={() => setIsMenuOpen(false)}>Sobre Nosotros</Link>
              <Link to="/servicios" className="text-gray-700 hover:text-primary-color py-2" onClick={() => setIsMenuOpen(false)}>Servicios</Link>
              <Link to="/contacto" className="text-gray-700 hover:text-primary-color py-2" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
              <div className="pt-4">
                <input type="text" placeholder="Buscar productos..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent" />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
