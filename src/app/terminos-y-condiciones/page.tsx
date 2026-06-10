'use client';

import React, { useState } from 'react';
import { FileText, Shield, CreditCard, Truck, RefreshCw, AlertCircle } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/config';

export default function TerminosCondicionesPage() {
  const [activeSection, setActiveSection] = useState('1-introduccion');

  const sections = [
    { id: '1-introduccion', title: '1. Introducción y Aceptación', icon: FileText },
    { id: '2-propiedad', title: '2. Propiedad Intelectual', icon: Shield },
    { id: '3-compra', title: '3. Condiciones de Compra', icon: CreditCard },
    { id: '4-envios', title: '4. Envíos y Plazos', icon: Truck },
    { id: '5-garantia', title: '5. Garantía y Límites', icon: AlertCircle },
    { id: '6-jurisdiccion', title: '6. Jurisdicción Aplicable', icon: RefreshCw },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="legal-wrapper min-h-screen flex flex-col">
      {/* Ambient glass glows */}
      <div className="legal-glow-1" />
      <div className="legal-glow-2" />

      {/* Hero Banner */}
      <div className="legal-hero">
        <div className="relative max-w-4xl mx-auto px-4">
          <span className="legal-hero-badge">
            Legalidad & Transparencia
          </span>
          <h1 className="legal-hero-title">
            TÉRMINOS Y CONDICIONES
          </h1>
          <p className="legal-hero-subtitle">
            Última actualización: 28 de mayo de 2026. Por favor, lea detenidamente estas condiciones antes de utilizar nuestros servicios y pasarela de compra.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 md:py-16 relative z-10">
        <div className="legal-grid">
          {/* Sidebar Index (Desktop only) */}
          <div className="hidden lg:block">
            <div className="legal-sidebar legal-sidebar-sticky">
              <h3 className="legal-nav-title">
                Índice de contenido
              </h3>
              <nav className="space-y-1">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`legal-nav-btn ${isActive ? 'legal-nav-btn-active' : ''}`}
                    >
                      <Icon className="h-4 w-4" style={{ color: isActive ? '#2e559e' : '#9ca3af' }} />
                      <span>{sec.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Legal Text (3/4 width on desktop) */}
          <div className="legal-card legal-text">
            
            <section id="1-introduccion" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  1. Introducción y Aceptación de los Términos
                </h2>
              </div>
              <p>
                Las presentes Condiciones Generales de Venta (en adelante, &quot;Términos y Condiciones&quot;) regulan de manera exclusiva las relaciones comerciales entre <strong>{BUSINESS_CONFIG.name}</strong> (con CIF {BUSINESS_CONFIG.cif} y domicilio social en {BUSINESS_CONFIG.address}) y cualquier persona física o jurídica (en adelante, &quot;el Cliente&quot;) que realice la adquisición de equipos de protección individual (EPIs), vestuario laboral y accesorios a través del portal de comercio electrónico <a href="/" className="text-[#2e559e] font-semibold underline">protexwear.es</a>.
              </p>
              <p>
                El uso del sitio web, el registro en el portal B2B/B2C, así como la confirmación de cualquier pedido mediante la pasarela de compra implica la aceptación <strong>plena, explícita y sin reservas</strong> por parte del Cliente de todos y cada uno de los términos detallados en este documento.
              </p>

            </section>

            <section id="2-propiedad" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  2. Propiedad Intelectual e Industrial
                </h2>
              </div>
              <p>
                Todos los contenidos mostrados en este sitio web —incluyendo, a título enunciativo pero no limitativo: designs, códigos de programación, logotipos, imagotipos, nombres comerciales, fichas técnicas de seguridad, imágenes de catálogo y descripciones de producto— están sujetos a derechos de propiedad intelectual e industrial titularidad de <strong>{BUSINESS_CONFIG.name}</strong> o de terceras marcas de las cuales disponemos de licencia y autorización de comercialización (como 3M, Ansell, Fal Seguridad, y Portwest).
              </p>
              <p>
                Queda expresamente prohibida la reproducción, distribución, comunicación pública, extracción total o parcial o modificación de cualquier elemento del portal sin el consentimiento formal y por escrito de la dirección de Protex Wear.
              </p>
            </section>

            <section id="3-compra" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  3. Condiciones de Compra, Impuestos y Precios
                </h2>
              </div>
              <p>
                Los precios de los productos ofertados en Protex Wear se indican en euros (€). Dependiendo del perfil del cliente (B2B Corporativo registrado o B2C Cliente Final), las tarifas podrán mostrarse con o sin el Impuesto sobre el Valor Añadido (IVA) vigente en España, lo cual se desglosará de manera transparente en la cesta y checkout antes de la confirmación final.
              </p>
              <p>
                <strong>Medios de Pago Soportados en Pasarela:</strong>
              </p>
              <ul className="legal-badge-list">
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Tarjetas de Crédito y Débito:</strong> Procesadas de forma segura bajo cifrado SSL a través de la infraestructura integrada de Stripe.</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Bizum Comercial y Transferencia Bancaria Directa:</strong> Para clientes que requieran flujos corporativos con emisión previa de factura proforma o albarán de entrega.</span>
                </li>
              </ul>
              <p>
                El Cliente garantiza que posee la autorización necesaria para utilizar el método de pago elegido y asume la responsabilidad del abono correspondiente.
              </p>
            </section>

            <section id="4-envios" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <Truck className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  4. Envíos, Plazos y Cobertura de Entrega
                </h2>
              </div>
              <p>
                Protex Wear realiza entregas en todo el territorio español y determinados destinos internacionales seleccionados en la pasarela. Los costes de envío se calculan dinámicamente según la dirección detectada o autocompletada por nuestro buscador inteligente de direcciones:
              </p>
              
              <div className="legal-table-container">
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th>Zona geográfica</th>
                      <th>Tarifa estándar</th>
                      <th>Umbral Gratuito</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Tarifa Única (Nacional e Internacional)</td>
                      <td>9,00 €</td>
                      <td style={{ color: '#10b981', fontWeight: 700 }}>Gratis &gt; 100 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p>
                Los plazos de entrega estándar son de <strong>24 a 72 horas laborables</strong> desde la salida de nuestro centro logístico central para envíos peninsulares. En caso de rotura de stock o incidencias con la agencia de transportes, se notificará de inmediato al cliente facilitándole la posibilidad de abono del importe o sustitución equivalente de calzado o ropa laboral.
              </p>
            </section>

            <section id="5-garantia" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  5. Garantía y Responsabilidad Limitada
                </h2>
              </div>
              <p>
                Todos nuestros artículos gozan del plazo de garantía legal establecido por la legislación de consumo vigente (3 años para productos nuevos). La garantía cubre cualquier defecto de fabricación en las costuras, materiales de protección, punteras de acero o calzado de seguridad.
              </p>
              <p>
                Protex Wear no responderá de los daños causados por un mal uso, desgaste natural o la falta de mantenimiento requerido por el fabricante. Asimismo, el uso de Equipos de Protección Individual (EPIs) debe ser supervisado por el responsable de prevención de riesgos laborales de cada empresa contratante para asegurar su adecuación al puesto de trabajo específico.
              </p>
            </section>

            <section id="6-jurisdiccion" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  6. Modificaciones de Condiciones y Jurisdicción
                </h2>
              </div>
              <p>
                Nos reservamos el derecho a modificar las presentes condiciones generales en cualquier momento. El Cliente estará sujeto a los términos vigentes en la fecha de realización de su pedido.
              </p>
              <p>
                Para cualquier controversia, litigio o interpretación contractual derivada de la adquisición de productos en este portal, ambas partes renuncian expresamente a cualquier otro fuero que pudiera corresponderles y se someten voluntariamente a la jurisdicción exclusiva de los <strong>Juzgados y Tribunales de la ciudad de Madrid, España</strong>.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
