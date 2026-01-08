import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * 404 Not Found Page
 */
function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
          <div className="text-gray-400 mb-6">
            <svg className="w-32 h-32 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Página No Encontrada
          </h1>
          <p className="text-gray-600 mb-2">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <p className="text-sm text-gray-500">
            Verifica la URL o utiliza los enlaces de navegación para encontrar lo que necesitas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn btn-primary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ir al Inicio
            </Link>
            
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver Atrás
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/productos"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Explorar Productos
            </Link>
          </div>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">¿Necesitas ayuda?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <Link
              to="/contacto"
              className="text-gray-600 hover:text-gray-900 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar Soporte
            </Link>
            
            <Link
              to="/ayuda"
              className="text-gray-600 hover:text-gray-900 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Centro de Ayuda
            </Link>
            
            <a
              href="tel:+34900123456"
              className="text-gray-600 hover:text-gray-900 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              900 123 456
            </a>
          </div>
        </div>

        {/* Popular Pages */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Páginas Populares</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link to="/productos" className="text-gray-600 hover:text-gray-900 py-1">
              Catálogo de Productos
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 py-1">
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="text-gray-600 hover:text-gray-900 py-1">
              Crear Cuenta
            </Link>
            <Link to="/carrito" className="text-gray-600 hover:text-gray-900 py-1">
              Mi Carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;