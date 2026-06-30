import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS_CONFIG } from '@/lib/config';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-indigo-950 text-indigo-100 font-sans relative overflow-hidden mt-auto">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & About */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/logo.png" 
                alt="Protex Wear" 
                width={160} 
                height={45} 
                className="brightness-0 invert hover:opacity-80 transition-opacity object-contain w-auto h-auto" 
              />
            </Link>
            <p className="text-indigo-200/80 leading-relaxed mb-8 max-w-sm">
              Tu tienda B2B de confianza para equipamiento de protección laboral. Seguridad, innovación y calidad para profesionales exigentes.
            </p>
          </div>

          {/* Products */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6">
              Productos
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/productos?categoria=cascos" className="text-indigo-200 hover:text-white transition-colors font-medium text-sm">
                  Cascos de Seguridad
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=guantes" className="text-indigo-200 hover:text-white transition-colors font-medium text-sm">
                  Guantes de Protección
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=calzado" className="text-indigo-200 hover:text-white transition-colors font-medium text-sm">
                  Calzado de Seguridad
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=ropa" className="text-indigo-200 hover:text-white transition-colors font-medium text-sm">
                  Ropa de Trabajo
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6">
              Atención al Cliente
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/contacto" className="text-indigo-200 hover:text-white transition-colors font-medium text-sm">
                  Atención Telefónica y Contacto
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-indigo-200 hover:text-white transition-colors font-medium text-sm">
                  Política de Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-indigo-200 hover:text-white transition-colors font-medium text-sm">
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6">
              Contacto
            </h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center border border-indigo-800 text-indigo-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-sm text-indigo-200/90 leading-relaxed pt-0.5">
                  {BUSINESS_CONFIG.address}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center border border-indigo-800 text-indigo-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-white tracking-wide">
                  {BUSINESS_CONFIG.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-indigo-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-indigo-300/60 text-sm font-medium">
             © {currentYear} {BUSINESS_CONFIG.name}. Todos los derechos reservados.
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/politica-de-privacidad" className="text-indigo-300/80 hover:text-white transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terminos-y-condiciones" className="text-indigo-300/80 hover:text-white transition-colors">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
