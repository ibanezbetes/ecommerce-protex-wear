'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import Image from 'next/image';
import { Search } from 'lucide-react';

function ProfileMenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" fillRule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z" clipRule="evenodd" />
    </svg>
  );
}

function AdminPanelIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M17 22q-2.075 0-3.537-1.463T12 17t1.463-3.537T17 12t3.538 1.463T22 17t-1.463 3.538T17 22m-5 0q-3.475-.875-5.738-3.988T4 11.1V5l8-3l8 3v5.675q-.65-.325-1.463-.5T17 10q-2.9 0-4.95 2.05T10 17q0 1.55.588 2.8t1.487 2.175q-.025 0-.037.013T12 22m6.063-5.437q.437-.438.437-1.063t-.437-1.062T17 14t-1.062.438T15.5 15.5t.438 1.063T17 17t1.063-.437M17 20q.775 0 1.425-.363t1.05-.962q-.55-.325-1.175-.5T17 18t-1.3.175t-1.175.5q.4.6 1.05.963T17 20" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <path d="M0 0h14v14H0z" fill="none" />
      <path fill="currentColor" fillRule="evenodd" d="M0 1.5A1.5 1.5 0 0 1 1.5 0h7A1.5 1.5 0 0 1 10 1.5v1.939a2 2 0 0 0-.734 1.311H5.75a2.25 2.25 0 1 0 0 4.5h3.516A2 2 0 0 0 10 10.561V12.5A1.5 1.5 0 0 1 8.5 14h-7A1.5 1.5 0 0 1 0 12.5zm10.963 2.807A.75.75 0 0 0 10.5 5v1H5.75a1 1 0 0 0 0 2h4.75v1a.75.75 0 0 0 1.28.53l2-2a.75.75 0 0 0 0-1.06l-2-2a.75.75 0 0 0-.817-.163" clipRule="evenodd" />
    </svg>
  );
}

interface MegaMenuItem {
  name: string;
  href: string;
}

interface MegaMenuGroup {
  groupTitle: string;
  items: MegaMenuItem[];
  extraSection?: {
    title: string;
    items: MegaMenuItem[];
  };
}

const megaMenuCategories: MegaMenuGroup[] = [
  {
    groupTitle: 'Ropa de Trabajo',
    items: [
      { name: 'Pantalones de trabajo', href: '/productos?categoria=pantalones' },
      { name: 'Ropa de alta visibilidad', href: '/productos?categoria=ropa' },
      { name: 'Polos de trabajo', href: '/productos?categoria=camisetas' },
      { name: 'Camisetas de trabajo', href: '/productos?categoria=camisetas' },
      { name: 'Chalecos de trabajo', href: '/productos?categoria=chalecos' },
      { name: 'Monos de trabajo', href: '/productos?categoria=ropa+de+trabajo' },
      { name: 'Sudaderas y polares', href: '/productos?categoria=ropa' },
      { name: 'Ropa térmica y frío', href: '/productos?categoria=ropa' },
      { name: 'Ropa impermeable y lluvia', href: '/productos?categoria=ropa' },
    ],
  },
  {
    groupTitle: 'Calzado de Seguridad',
    items: [
      { name: 'Zapatos de seguridad S1P / S3', href: '/productos?categoria=calzado' },
      { name: 'Botas de seguridad', href: '/productos?categoria=calzado' },
      { name: 'Zapatillas de trabajo ligeras', href: '/productos?categoria=calzado' },
      { name: 'Botas de agua y PVC', href: '/productos?categoria=calzado' },
      { name: 'Calzado para hostelería y sanidad', href: '/productos?categoria=calzado' },
      { name: 'Plantillas y calcetines técnicos', href: '/productos?categoria=calzado' },
    ],
  },
  {
    groupTitle: 'Protección de Manos',
    items: [
      { name: 'Guantes anticorte', href: '/productos?categoria=guantes' },
      { name: 'Guantes de nitrilo y látex', href: '/productos?categoria=guantes' },
      { name: 'Guantes térmicos para frío', href: '/productos?categoria=guantes' },
      { name: 'Guantes de cuero y soldador', href: '/productos?categoria=guantes' },
      { name: 'Guantes para riesgo químico', href: '/productos?categoria=guantes' },
      { name: 'Guantes dieléctricos', href: '/productos?categoria=guantes' },
      { name: 'Guantes desechables', href: '/productos?categoria=guantes' },
    ],
  },
  {
    groupTitle: 'Protección de Cabeza y Facial',
    items: [
      { name: 'Cascos de seguridad para obra', href: '/productos?categoria=cascos' },
      { name: 'Gorras antigolpes', href: '/productos?categoria=cascos' },
      { name: 'Gafas de seguridad panorámicas', href: '/productos?categoria=gafas' },
      { name: 'Pantallas faciales y soldadura', href: '/productos?categoria=pantallas' },
      { name: 'Mascarillas autofiltrantes FFP2 / FFP3', href: '/productos?categoria=mascarillas' },
      { name: 'Semimáscaras con filtros de gas', href: '/productos?categoria=mascarillas' },
      { name: 'Protectores auditivos y orejeras', href: '/productos?categoria=auditiva' },
    ],
  },
  {
    groupTitle: 'Sectores Especializados',
    items: [
      { name: 'Industria e Instaladores', href: '/productos?categoria=industria' },
      { name: 'Construcción y Obra Pública', href: '/productos?categoria=construccion' },
      { name: 'Hostelería, Cocina y Alimentación', href: '/productos?categoria=hosteleria' },
      { name: 'Sanidad, Laboratorio y Estética', href: '/productos?categoria=sanidad' },
      { name: 'Limpieza y Servicios', href: '/productos?categoria=limpieza' },
    ],
    extraSection: {
      title: 'Protección en Alturas',
      items: [
        { name: 'Arneses de seguridad', href: '/productos?categoria=arneses' },
        { name: 'Líneas de vida y cuerdas', href: '/productos?categoria=arneses' },
        { name: 'Mosquetones y anticaídas', href: '/productos?categoria=arneses' },
      ],
    },
  },
];

export default function Navbar() {
  const { user, isGuest, logout } = useAuth();
  const { openCart, itemCount: cartItemCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const isAuthenticated = !isGuest;
  const isProfileRoute = pathname?.startsWith('/perfil');
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity ml-4 md:ml-10">
            <Image src="/logo.png" alt="Protex Wear" width={110} height={32} className="w-auto h-auto object-contain" priority />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {/* Mega Menú de Productos al hacer hover */}
            <div
              className="relative flex items-center h-full"
              onMouseEnter={() => setIsProductsHovered(true)}
              onMouseLeave={() => setIsProductsHovered(false)}
            >
              <Link
                href="/productos"
                className={`text-[15px] font-medium py-7 inline-flex items-center gap-1 transition-colors ${
                  pathname?.startsWith('/productos') || isProductsHovered ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                <span>Productos</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isProductsHovered ? 'rotate-180 text-indigo-600' : 'text-gray-400'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {/* Mega Menú Desplegable */}
              {isProductsHovered && (
                <div 
                  className="fixed left-0 right-0 top-[80px] bg-white border-b border-gray-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200"
                  onMouseEnter={() => setIsProductsHovered(true)}
                  onMouseLeave={() => setIsProductsHovered(false)}
                >
                  <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
                    <div className="grid grid-cols-5 gap-8">
                      {megaMenuCategories.map((group) => (
                        <div key={group.groupTitle} className="space-y-6">
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 mb-3">
                              {group.groupTitle}
                            </h3>
                            <ul className="space-y-2.5">
                              {group.items.map((item) => (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    className="text-[13.5px] text-gray-600 hover:text-indigo-600 hover:translate-x-1 inline-block transition-all font-normal"
                                    onClick={() => setIsProductsHovered(false)}
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {group.extraSection && (
                            <div className="pt-2">
                              <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 mb-3">
                                {group.extraSection.title}
                              </h3>
                              <ul className="space-y-2.5">
                                {group.extraSection.items.map((item) => (
                                  <li key={item.name}>
                                    <Link
                                      href={item.href}
                                      className="text-[13.5px] text-gray-600 hover:text-indigo-600 hover:translate-x-1 inline-block transition-all font-normal"
                                      onClick={() => setIsProductsHovered(false)}
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Bottom Promo / Link Bar */}
                    <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/70 -mx-6 sm:-mx-8 -mb-8 px-6 sm:px-8 py-3.5 rounded-b-lg">
                      <p className="text-xs text-gray-500 font-medium">
                        Protección laboral integral y EPIs certificados para cualquier sector industrial
                      </p>
                      <Link
                        href="/productos"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5"
                        onClick={() => setIsProductsHovered(false)}
                      >
                        Ver todo el catálogo
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {['Categorías', 'Sobre Nosotros', 'Contacto'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(' ', '-')}`}
                className="text-[15px] font-medium text-gray-700 hover:text-indigo-600 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all hover:after:w-full"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex relative group">
              <input
                type="text"
                placeholder="Buscar EPIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-48 lg:w-64 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            </form>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all group"
            >
              <svg className="h-6 w-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16.5 21a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m-8 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3M3.71 5.4h15.214c1.378 0 2.373 1.27 1.995 2.548l-1.654 5.6C19.01 14.408 18.196 15 17.27 15H8.112c-.927 0-1.742-.593-1.996-1.452zm0 0L3 3" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-semibold text-gray-700">
                    {user?.name || 'Usuario'}
                  </span>
                  <svg className={`h-4 w-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="/perfil"
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${isProfileRoute ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ProfileMenuIcon />
                      <span>Mi Perfil</span>
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${isAdminRoute ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <AdminPanelIcon />
                        <span>Panel Admin</span>
                      </Link>
                    )}
                    <div className="h-px bg-gray-100 my-2"></div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogoutIcon />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-4 fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-4 pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </form>

            <nav className="flex flex-col space-y-1">
              {['Productos', 'Categorías', 'Sobre Nosotros', 'Contacto'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(' ', '-')}`}
                  className="px-4 py-3 text-base font-medium text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 flex flex-col gap-2 px-4">
                  <Link href="/login" className="w-full py-3 text-center text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Iniciar Sesión
                  </Link>
                  <Link href="/register" className="w-full py-3 text-center text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Registrarse
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
