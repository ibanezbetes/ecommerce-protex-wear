'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, AlertTriangle, Truck, ShieldAlert, Sparkles } from 'lucide-react';

export default function DevolucionesPage() {
  const [activeSection, setActiveSection] = useState('1-desistimiento');

  const sections = [
    { id: '1-desistimiento', title: '1. Desistimiento Comercial', icon: ShieldAlert },
    { id: '2-condiciones', title: '2. Condiciones del Producto', icon: CheckCircle2 },
    { id: '3-excepciones', title: '3. Ropa Personalizada y Excepciones', icon: AlertTriangle },
    { id: '4-proceso', title: '4. Proceso Paso a Paso', icon: Truck },
    { id: '5-reembolso', title: '5. Reembolsos e Importes', icon: ArrowLeftRight },
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
      {/* Ambient background glows */}
      <div className="legal-glow-1" />
      <div className="legal-glow-2" />

      {/* Hero Banner */}
      <div className="legal-hero">
        <div className="relative max-w-4xl mx-auto px-4">
          <span className="legal-hero-badge">
            Compromiso de Satisfacción
          </span>
          <h1 className="legal-hero-title">
            POLÍTICA DE DEVOLUCIONES
          </h1>
          <p className="legal-hero-subtitle">
            Garantizamos un proceso ágil y transparente. Dispone de 30 días de garantía ampliada para devoluciones o cambios de talla en vestuario laboral.
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
                Apartados
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
            
            <section id="1-desistimiento" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  1. Derecho de Desistimiento Legal y Comercial
                </h2>
              </div>
              <p>
                De acuerdo con el Real Decreto Legislativo 1/2007 de Defensa de los Consumidores y Usuarios, el Cliente tiene derecho a desistir de la compra en un plazo de 14 días naturales sin necesidad de justificación.
              </p>
              <p>
                En <strong>PROTEX WEAR</strong>, con el fin de aportar la máxima seguridad y confianza a nuestros profesionales y autónomos, <strong>ampliamos de forma voluntaria dicho plazo hasta los 30 días naturales</strong> a contar desde la recepción física del pedido.
              </p>
            </section>

            <section id="2-condiciones" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  2. Condiciones Físicas del Producto
                </h2>
              </div>
              <p>
                Dado que comercializamos equipos de protección individual (EPIs), cascos, gafas y calzado técnico de seguridad que inciden de forma crítica en la salud y protección de los trabajadores, las devoluciones están sujetas a estrictas comprobaciones higiénicas y funcionales:
              </p>
              <ul className="legal-badge-list">
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span>El producto debe encontrarse <strong>completamente nuevo, sin signos de uso</strong>, y en perfectas condiciones comerciales. No se admitirán devoluciones de calzado laboral usado en entornos de obra, taller o fábrica.</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span>Debe conservar el <strong>etiquetado original intacto</strong>, así como los manuales de certificación técnica de homologación CE.</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span>Debe devolverse con su <strong>embalaje o caja de origen</strong>. Por favor, no pegue etiquetas de transporte o precintos directamente sobre la caja del calzado de seguridad; introduzca el artículo en una caja exterior protectora o sobre de envío.</span>
                </li>
              </ul>
            </section>

            <section id="3-excepciones" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  3. Uniformes Personalizados y Excepciones
                </h2>
              </div>
              <div className="legal-alert-box legal-alert-box-warning">
                <strong>ATENCIÓN AL CLIENTE B2B / CORPORATIVO:</strong> Conforme al artículo 103 de la Ley de Consumidores y Usuarios, el derecho de desistimiento <strong>no se aplicará</strong> a bienes confeccionados conforme a las especificaciones del cliente o claramente personalizados.
              </div>
              <p>
                Por lo tanto, <strong>no se admitirán cambios ni devoluciones de prendas que hayan sido serigrafiadas, bordadas, sublimadas o grabadas</strong> con logotipos de empresas, nombres de empleados o distintivos de marca específicos solicitados en el pedido. Les recomendamos solicitar previamente una muestra de tallaje físico antes de ordenar tiradas masivas de personalización.
              </p>
            </section>

            <section id="4-proceso" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <Truck className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  4. Proceso de Devolución Paso a Paso
                </h2>
              </div>
              <p>
                Para iniciar un proceso de cambio de talla o devolución, siga estas sencillas instrucciones:
              </p>
              
              <div className="legal-timeline">
                <div className="legal-timeline-item">
                  <div className="legal-timeline-badge" />
                  <h4 className="legal-timeline-title">Paso 1: Solicitud de Devolución</h4>
                  <p className="legal-timeline-desc">
                    Envíe un correo electrónico a <a href="mailto:soporte@protexwear.es" style={{ color: '#2e559e', textDecoration: 'underline' }}>soporte@protexwear.es</a> indicando su número de pedido y los artículos específicos a devolver.
                  </p>
                </div>
                <div className="legal-timeline-item">
                  <div className="legal-timeline-badge" />
                  <h4 className="legal-timeline-title">Paso 2: Preparación del Paquete</h4>
                  <p className="legal-timeline-desc">
                    Embale el calzado o la ropa laboral en su embalaje protector original, conserve las etiquetas CE y colóquelo dentro de una bolsa o caja protectora de transporte externa.
                  </p>
                </div>
                <div className="legal-timeline-item">
                  <div className="legal-timeline-badge" />
                  <h4 className="legal-timeline-title">Paso 3: Envío o Recogida a Domicilio</h4>
                  <p className="legal-timeline-desc">
                    Le facilitaremos una etiqueta prepagada de Correos para entregar en oficina, o bien coordinaremos una recogida a domicilio mediante nuestra agencia si contrató la garantía ampliada.
                  </p>
                </div>
              </div>
            </section>

            <section id="5-reembolso" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <ArrowLeftRight className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  5. Reembolsos e Importes
                </h2>
              </div>
              <p>
                Una vez recibidos los productos en nuestros almacenes centrales de logística y superado el pertinente control de calidad técnico, procederemos al reembolso del importe abonado por los artículos.
              </p>
              <ul className="legal-badge-list">
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Plazo:</strong> El reembolso se gestionará en un periodo máximo de <strong>10 días laborables</strong> a partir de la confirmación de la recepción.</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Método:</strong> Se abonará automáticamente en el mismo medio de pago con el que realizó la compra original (Stripe, Bizum o Transferencia).</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Gastos de Envío de Devolución:</strong> Si el cambio es por un error de Protex Wear o defecto de fabricación, el coste es 100% gratuito. En el caso de desistimiento comercial ordinario, el coste del envío de retorno (5,99 €) se deducirá de la cantidad final a reembolsar.</span>
                </li>
              </ul>
              
              <div className="legal-alert-box" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                <Sparkles className="h-6 w-6" style={{ color: '#2e559e', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  ¿Tiene alguna duda o desea tramitar un cambio urgente? Póngase en contacto inmediato con nuestro equipo de atención telefónica al cliente en el teléfono gratuito <strong>900 123 456</strong>.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
