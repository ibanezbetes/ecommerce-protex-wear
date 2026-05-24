import React from 'react';
import { Link } from 'react-router-dom';
import logoWhite from '../../assets/logo-w.png';
import './styles/Footer.css';

/**
 * Footer Component
 * Company information, links, and contact details
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-main">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-company-info">
            <div className="footer-logo-wrapper">
              <img
                src={logoWhite}
                alt="Protex Wear"
                className="footer-logo"
              />
            </div>
            <p className="footer-description">
              Tu tienda especializada en equipos de protección individual y ropa de trabajo profesional para todos los sectores.
            </p>
            <div className="footer-social-wrapper">
              <a href="#" className="footer-social-link">
                <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="footer-social-link">
                <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a href="#" className="footer-social-link">
                <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="footer-heading">Productos</h3>
            <ul className="footer-list">
              <li>
                <Link to="/productos?categoria=cascos" className="footer-link">
                  Cascos de Seguridad
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=guantes" className="footer-link">
                  Guantes de Protección
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=calzado" className="footer-link">
                  Calzado de Seguridad
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=ropa" className="footer-link">
                  Ropa de Trabajo
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=respiratoria" className="footer-link">
                  Protección Respiratoria
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="footer-heading">Atención al Cliente</h3>
            <ul className="footer-list">
              <li>
                <Link to="/contacto" className="footer-link">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/ayuda" className="footer-link">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link to="/envios" className="footer-link">
                  Información de Envíos
                </Link>
              </li>
              <li>
                <Link to="/devoluciones" className="footer-link">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link to="/garantia" className="footer-link">
                  Garantía
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="footer-heading">Contacto</h3>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <svg className="footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="footer-contact-text">
                    Calle Ejemplo 123<br />
                    28001 Madrid, España
                  </p>
                </div>
              </div>

              <div className="footer-contact-item-center">
                <svg className="footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="footer-contact-text">+34 900 123 456</p>
              </div>

              <div className="footer-contact-item-center">
                <svg className="footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="footer-contact-text">info@protexwear.es</p>
              </div>

              <div className="footer-contact-item">
                <svg className="footer-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="footer-contact-text">
                    Lun - Vie: 9:00 - 18:00<br />
                    Sáb: 9:00 - 14:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              © {currentYear} Protex Wear. Todos los derechos reservados.
            </div>
            <div className="footer-bottom-links">
              <Link to="/privacidad" className="footer-bottom-link">
                Política de Privacidad
              </Link>
              <Link to="/terminos" className="footer-bottom-link">
                Términos de Uso
              </Link>
              <Link to="/cookies" className="footer-bottom-link">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;