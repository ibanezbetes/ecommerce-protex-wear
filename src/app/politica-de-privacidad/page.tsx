'use client';

import React, { useState } from 'react';
import { UserCheck, Eye, Database, Share2, Award, Mail } from 'lucide-react';

export default function PoliticaPrivacidadPage() {
  const [activeSection, setActiveSection] = useState('1-responsable');

  const sections = [
    { id: '1-responsable', title: '1. Responsable del Tratamiento', icon: UserCheck },
    { id: '2-datos', title: '2. Datos que Recopilamos', icon: Database },
    { id: '3-finalidad', title: '3. Finalidad del Tratamiento', icon: Eye },
    { id: '4-destinatarios', title: '4. Destinatarios y Cesiones', icon: Share2 },
    { id: '5-derechos', title: '5. Sus Derechos (ARCO-POL)', icon: Award },
    { id: '6-contacto', title: '6. Contacto y DPD', icon: Mail },
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
            RGPD & Privacidad de Datos
          </span>
          <h1 className="legal-hero-title">
            POLÍTICA DE PRIVACIDAD
          </h1>
          <p className="legal-hero-subtitle">
            Tu privacidad y seguridad son fundamentales para nosotros. Descubre cómo protegemos tus datos de acuerdo al Reglamento General de Protección de Datos.
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
                Secciones del documento
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
            
            <section id="1-responsable" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  1. Responsable del Tratamiento de sus Datos
                </h2>
              </div>
              <p>
                De conformidad con lo dispuesto en el <strong>Reglamento General de Protección de Datos (RGPD)</strong> de la UE 2016/679 y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), le informamos que el responsable legal del tratamiento de sus datos de carácter personal es:
              </p>
              
              <div className="legal-info-card">
                <div className="legal-info-item">
                  <span className="legal-info-label">Razón Social</span>
                  <span className="legal-info-val">PROTEX WEAR S.L.</span>
                </div>
                <div className="legal-info-item">
                  <span className="legal-info-label">NIF</span>
                  <span className="legal-info-val">B-99999999</span>
                </div>
                <div className="legal-info-item" style={{ gridColumn: 'span 2' }}>
                  <span className="legal-info-label">Domicilio Social</span>
                  <span className="legal-info-val">Calle de la Seguridad e Higiene Laboral, 12, 28001 Madrid, España</span>
                </div>
                <div className="legal-info-item" style={{ gridColumn: 'span 2' }}>
                  <span className="legal-info-label">Correo electrónico LOPD</span>
                  <span className="legal-info-val" style={{ color: '#2e559e', textDecoration: 'underline' }}>lopd@protexwear.es</span>
                </div>
              </div>
            </section>

            <section id="2-datos" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <Database className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  2. Datos Personales que Recopilamos
                </h2>
              </div>
              <p>
                Durante su navegación, registro de cuenta corporativa o proceso de checkout en nuestra pasarela de compra, recopilamos los siguientes tipos de información:
              </p>
              <ul className="legal-badge-list">
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Datos identificativos:</strong> Nombre, apellidos, razón social de la empresa, NIF/CIF (esencial para la facturación B2B en España).</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Datos de contacto:</strong> Dirección de envío (autocompletada o sugerida de forma inteligente), dirección de facturación, correo electrónico personal o corporativo, número de teléfono.</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Información de transacciones:</strong> Detalles de los productos adquiridos, cantidades, cupones promocionales aplicados, y método de pago elegido.</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Datos de pago:</strong> Los datos de tarjeta de crédito/débito no se almacenan nunca en nuestros servidores; viajan encriptados de forma segura a través de los componentes de Stripe.</span>
                </li>
              </ul>
            </section>

            <section id="3-finalidad" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <Eye className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  3. Finalidad del Tratamiento de los Datos
                </h2>
              </div>
              <p>
                PROTEX WEAR trata la información facilitada por las personas interesadas con las siguientes finalidades:
              </p>
              <ol className="legal-badge-list" style={{ listStyleType: 'decimal', paddingLeft: '1.5rem' }}>
                <li className="legal-badge-item" style={{ display: 'list-item' }}>
                  <span><strong>Gestión y ejecución del contrato de compra:</strong> Procesamiento de pedidos, envío a través de agencias de transportes, facturación legal e inventario.</span>
                </li>
                <li className="legal-badge-item" style={{ display: 'list-item' }}>
                  <span><strong>Comunicaciones transaccionales:</strong> Envío de confirmaciones automáticas de pedidos y avisos de entrega utilizando la pasarela API de <strong>Resend</strong>.</span>
                </li>
                <li className="legal-badge-item" style={{ display: 'list-item' }}>
                  <span><strong>Soporte y atención al cliente:</strong> Responder a solicitudes de presupuesto corporativo o asesoramiento técnico en EPIs formuladas a través de nuestro formulario de contacto.</span>
                </li>
                <li className="legal-badge-item" style={{ display: 'list-item' }}>
                  <span><strong>Cumplimiento de obligaciones legales:</strong> Conservación de facturas y registros contables requeridos por la Agencia Tributaria Española.</span>
                </li>
              </ol>
            </section>

            <section id="4-destinatarios" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <Share2 className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  4. Destinatarios y Transferencia de Datos
                </h2>
              </div>
              <p>
                Tus datos no serán cedidos ni vendidos a terceros con fines publicitarios. Para poder prestar nuestros servicios comerciales, es estrictamente necesario comunicar ciertos datos de carácter personal a encargados de tratamiento homologados en condiciones de seguridad extrema:
              </p>
              <ul className="legal-badge-list">
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Entidades de pago:</strong> <em>Stripe Inc.</em> procesa la información financiera bajo los estándares PCI-DSS.</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Plataformas de correo transaccional:</strong> <em>Resend Inc.</em> gestiona la entrega de notificaciones en tiempo real.</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Empresas de logística:</strong> Correos Express, SEUR, o DHL para hacer efectiva la entrega de los pedidos en su dirección.</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Servicios en la nube:</strong> <em>Amazon Web Services (AWS)</em> provee la infraestructura DynamoDB y AppSync donde se guardan de forma cifrada los registros de compras e histórico de pedidos.</span>
                </li>
              </ul>
            </section>

            <section id="5-derechos" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <Award className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  5. Sus Derechos Legales (ARCO-POL)
                </h2>
              </div>
              <p>
                Los usuarios e interesados tienen reconocidos por ley amplios derechos sobre el tratamiento de sus datos personales. Puede ejercerlos de forma gratuita y en cualquier momento:
              </p>
              <ul className="legal-badge-list">
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Acceso:</strong> Saber qué datos tenemos guardados sobre usted.</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Rectificación:</strong> Corregir cualquier error en su nombre, dirección o NIF.</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Supresión (Derecho al olvido):</strong> Solicitar que eliminemos sus datos de nuestros servidores (siempre que no haya obligaciones legales pendientes de conservación).</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Portabilidad:</strong> Solicitar la entrega de sus datos en formato estructurado e interoperable para otra plataforma.</span>
                </li>
                <li className="legal-badge-item">
                  <span className="legal-badge-dot" />
                  <span><strong>Limitación del tratamiento:</strong> Solicitar la suspensión temporal del tratamiento de sus datos.</span>
                </li>
              </ul>
            </section>

            <section id="6-contacto" className="legal-section">
              <div className="legal-section-header">
                <div className="legal-section-icon">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="legal-section-title">
                  6. Contacto y Reclamaciones
                </h2>
              </div>
              <p>
                Para ejercer cualquiera de los derechos descritos o realizar una consulta sobre el tratamiento de su información de carácter personal, puede dirigir un escrito firmado acompañado de copia de documento oficial de identidad (DNI o NIE) a la dirección de correo electrónico <a href="mailto:lopd@protexwear.es" className="text-[#2e559e] font-semibold underline">lopd@protexwear.es</a>.
              </p>
              <p>
                Asimismo, le informamos que si considera vulnerados sus derechos, tiene derecho a presentar una reclamación formal ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong> a través de su sede electrónica oficial (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#2e559e] underline">www.aepd.es</a>).
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
