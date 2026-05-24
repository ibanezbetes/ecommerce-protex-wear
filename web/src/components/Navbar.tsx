'use client';
import Link from 'next/link';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';

export default function Navbar() {
  const { user, isGuest, logout } = useAuth();
  
  const totalItems = useCart(state => state.items.reduce((acc, item) => acc + item.quantity, 0));

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-slate-900 text-xs py-1 px-4 flex justify-between items-center text-slate-300">
        <span className="hidden sm:inline">Portal B2B/B2C</span>
        <div className="flex space-x-2">
          {isGuest ? (
            <Link href="/login" className="hover:text-white px-2 py-1 rounded bg-slate-800">Acceso VIP (B2B)</Link>
          ) : (
            <button onClick={logout} className="hover:text-white px-2 py-1 rounded bg-slate-800">Cerrar Sesión</button>
          )}
        </div>
        <span className="font-mono font-bold text-indigo-400">
          Hola, {isGuest ? 'Invitado' : user?.name}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-black text-gray-900 tracking-tighter">
              PROTEX<span className="text-indigo-600">WEAR</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
              Catálogo
            </Link>
            
            <Link href="/checkout" className="relative group flex items-center p-2">
              <svg className="w-6 h-6 text-gray-700 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
