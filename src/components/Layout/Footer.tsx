import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} bg-gray-900 text-white`}>
      <div className={`${styles.inner} px-4`}>
        <div className={`${styles.grid} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8`}>
          {/* About */}
          <div className={styles.brandBlock}>
            <h3 className={`${styles.brand} text-xl font-bold mb-4 flex items-center space-x-2`}>
              <span className="text-white">PROTEX</span>
              <span className="text-primary-color">WEAR</span>
            </h3>
            <p className={`${styles.text} text-gray-400 mb-4`}>
              Tu tienda de confianza para equipamiento de proteccin laboral.
              Seguridad y calidad para profesionales exigentes.
            </p>
            {/* Social Links */}
            <div className={`${styles.social} flex space-x-4 mt-6`}>
              <a href="#" className={styles.socialLink}>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className={styles.socialLink}>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Productos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/productos?categoria=cascos" className={styles.link}>
                  Cascos de Seguridad
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=guantes" className={styles.link}>
                  Guantes de Proteccin
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=calzado" className={styles.link}>
                  Calzado de Seguridad
                </Link>
              </li>
              <li>
                <Link href="/productos?categoria=ropa" className={styles.link}>
                  Ropa de Trabajo
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Atención al Cliente</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contacto" className={styles.link}>
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className={styles.link}>
                  Política de Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/envios" className={styles.link}>
                  Información de Envíos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg className={`${styles.link} h-5 w-5 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className={styles.text}>
                    Calle Ejemplo 123<br />
                    28001 Madrid, Espaa
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className={`${styles.link} h-5 w-5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className={styles.text}>+34 900 123 456</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`${styles.bottom} border-t border-gray-800 mt-8 pt-8`}>
          <div className={`${styles.bottomRow} flex flex-col md:flex-row justify-between items-center`}>
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
               {currentYear} Protex Wear. Todos los derechos reservados.
            </div>
            <div className={`${styles.legal} flex space-x-6 text-sm`}>
              <Link href="/politica-de-privacidad" className={styles.legalLink}>
                Política de Privacidad
              </Link>
              <Link href="/terminos-y-condiciones" className={styles.legalLink}>
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
