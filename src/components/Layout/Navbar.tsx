'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import Image from 'next/image';
import styles from './Navbar.module.css';

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

/**
 * Navbar Component (Next.js)
 * Reemplaza el antiguo Header de React conservando 100% su estética
 */
export default function Navbar() {
  const { user, isGuest, logout } = useAuth();
  const { openCart, itemCount: cartItemCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = !isGuest;
  const isProfileRoute = pathname?.startsWith('/perfil');
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <header className={`${styles.header} bg-white shadow-md sticky top-0 z-50`}>
      <div className={`${styles.inner} px-4`}>
        <div className={`${styles.row} py-4`}>
          {/* Logo */}
          <Link href="/" className={styles.brand}>
            <Image src="/logo.png" alt="Protex Wear" width={120} height={34} className={styles.logo} priority />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className={`${styles.nav} hidden lg:flex items-center`}
          >
            <Link
              href="/productos"
              className={`${styles.link} text-black hover:text-primary-color transition-colors font-normal`}
              style={{ textDecoration: 'none' }}
            >
              Productos
            </Link>
            <Link
              href="/categorias"
              className={`${styles.link} text-black hover:text-primary-color transition-colors font-normal`}
              style={{ textDecoration: 'none' }}
            >
              Categorías
            </Link>
            <Link
              href="/sobre-nosotros"
              className={`${styles.link} text-black hover:text-primary-color transition-colors font-normal`}
              style={{ textDecoration: 'none' }}
            >
              Sobre Nosotros
            </Link>
            <Link
              href="/contacto"
              className={`${styles.link} text-black hover:text-primary-color transition-colors font-normal`}
              style={{ textDecoration: 'none' }}
            >
              Contacto
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className={`${styles.actions} flex items-center space-x-4`}>
            {/* Cart */}
            <button
              onClick={openCart}
              className={`${styles.iconButton} relative p-2 text-gray-700 hover:text-primary-color transition-colors`}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 21a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m-8 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3M3.71 5.4h15.214c1.378 0 2.373 1.27 1.995 2.548l-1.654 5.6C19.01 14.408 18.196 15 17.27 15H8.112c-.927 0-1.742-.593-1.996-1.452zm0 0L3 3" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-color text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`${styles.userButton} flex items-center space-x-2 text-gray-700 hover:text-primary-color transition-colors`}
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block">
                    {user?.name || 'Usuario'}
                  </span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link
                      href="/perfil"
                      className={`${styles.dropdownItem} ${isProfileRoute ? styles.dropdownItemActive : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className={styles.dropdownIcon}><ProfileMenuIcon /></span>
                      <span className={styles.dropdownText}>Mi Perfil</span>
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className={`${styles.dropdownItemAdmin} ${isAdminRoute ? styles.dropdownItemActive : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className={styles.dropdownIcon}><AdminPanelIcon /></span>
                        <span className={styles.dropdownText}>Panel Admin</span>
                      </Link>
                    )}
                    <hr className={styles.dropdownDivider} />
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className={styles.dropdownItem}
                    >
                      <span className={styles.dropdownIcon}><LogoutIcon /></span>
                      <span className={styles.dropdownText}>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authActions}>
                <Link
                  href="/login"
                  className={styles.loginButton}
                  style={{ textDecoration: 'none' }}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className={styles.registerButton}
                  style={{ textDecoration: 'none' }}
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${styles.iconButton} ${styles.mobileToggle} lg:hidden`}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`${styles.mobilePanel} lg:hidden py-4 border-t border-gray-200`}>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/productos"
                className={`${styles.mobileLink} text-gray-700 hover:text-primary-color py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link
                href="/categorias"
                className={`${styles.mobileLink} text-gray-700 hover:text-primary-color py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                Categorías
              </Link>
              <Link
                href="/sobre-nosotros"
                className={`${styles.mobileLink} text-gray-700 hover:text-primary-color py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nosotros
              </Link>
              <Link
                href="/contacto"
                className={`${styles.mobileLink} text-gray-700 hover:text-primary-color py-2`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>

              {/* Mobile Search */}
              <div className="pt-4">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className={`${styles.mobileSearch} w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent`}
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
