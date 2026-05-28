'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import Image from 'next/image';
import styles from './Navbar.module.css';

/**
 * Navbar Component (Next.js)
 * Reemplaza el antiguo Header de React conservando 100% su estética
 */
export default function Navbar() {
  const { user, isGuest, logout } = useAuth();
  const { openCart, itemCount: cartItemCount } = useCart();
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

  return (
    <header className={`${styles.header} bg-white shadow-md sticky top-0 z-50`}>
      <div className={`${styles.inner} px-4`}>
        <div className={`${styles.row} py-4`}>
          {/* Logo */}
          <Link href="/" className={styles.brand}>
            <Image src="/logo.png" alt="Protex Wear" width={120} height={34} className={styles.logo} />
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/perfil"
                      className={`${styles.dropdownLink} block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      href="/pedidos"
                      className={`${styles.dropdownLink} block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mis Pedidos
                    </Link>
                    {/* Role check can be added here if Next.js user object supports it */}
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className={`${styles.dropdownLink} block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className={`${styles.loginButton} px-4 py-2 text-gray-900 font-medium border border-gray-300 rounded-lg hover:border-primary-color hover:bg-gray-50 transition-colors text-center no-underline`}
                  style={{ textDecoration: 'none' }}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className={`${styles.registerButton} px-6 py-2`}
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
