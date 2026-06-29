'use client';

import React, { useState } from 'react';
import { UserCheck, Eye, Database, Share2, Award, Mail } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/config';

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
    <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Banner */}
      <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 to-indigo-900/100" />
        
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-500/20 text-indigo-200 text-sm font-bold tracking-widest uppercase mb-6 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            RGPD & Privacidad de Datos
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white drop-shadow-md">
            POLÍTICA DE PRIVACIDAD
          </h1>
          <p className="text-lg md:text-xl text-indigo-100/90 leading-relaxed max-w-3xl mx-auto font-medium">
            Tu privacidad y seguridad son fundamentales para nosotros. Descubre cómo protegemos tus datos de acuerdo al Reglamento General de Protección de Datos.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 md:py-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Index (Desktop only) */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/40 border border-gray-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 px-4">
                Secciones del documento
              </h3>
              <nav className="space-y-2">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold transition-all duration-300 \${
                        isActive 
                          ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 transition-colors \${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <span className="leading-snug">{sec.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Legal Text */}
          <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8 md:p-12 text-gray-600 space-y-16 leading-relaxed">
            
            <section id="1-responsable" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  1. Responsable del Tratamiento de sus Datos
                </h2>
              </div>
              <p className="mb-6">
                De conformidad con lo dispuesto en el <strong className="text-gray-900">Reglamento General de Protección de Datos (RGPD)</strong> de la UE 2016/679 y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), le informamos que el responsable legal del tratamiento de sus datos de carácter personal es:
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Razón Social</span>
                  <span className="font-bold text-gray-900">{BUSINESS_CONFIG.name}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">NIF</span>
                  <span className="font-bold text-gray-900">{BUSINESS_CONFIG.cif}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Domicilio Social</span>
                  <span className="font-bold text-gray-900">{BUSINESS_CONFIG.address}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Correo electrónico LOPD</span>
                  <a href={`mailto:\${BUSINESS_CONFIG.email}`} className="font-bold text-indigo-600 hover:underline">{BUSINESS_CONFIG.email}</a>
                </div>
              </div>
            </section>

            <section id="2-datos" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <Database className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  2. Datos Personales que Recopilamos
                </h2>
              </div>
              <p className="mb-6">
                Durante su navegación, registro de cuenta corporativa o proceso de checkout en nuestra pasarela de compra, recopilamos los siguientes tipos de información:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Datos identificativos:</strong> Nombre, apellidos, razón social de la empresa, NIF/CIF (esencial para la facturación B2B en España).</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Datos de contacto:</strong> Dirección de envío (autocompletada o sugerida de forma inteligente), dirección de facturación, correo electrónico personal o corporativo, número de teléfono.</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Información de transacciones:</strong> Detalles de los productos adquiridos, cantidades, cupones promocionales aplicados, y método de pago elegido.</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Datos de pago:</strong> Los datos de tarjeta de crédito/débito no se almacenan nunca en nuestros servidores; viajan encriptados de forma segura a través de los componentes de Stripe.</span>
                </li>
              </ul>
            </section>

            <section id="3-finalidad" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <Eye className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  3. Finalidad del Tratamiento de los Datos
                </h2>
              </div>
              <p className="mb-6">
                PROTEX WEAR trata la información facilitada por las personas interesadas con las siguientes finalidades:
              </p>
              <ol className="space-y-4 list-decimal pl-6 marker:text-indigo-600 marker:font-bold">
                <li className="pl-2">
                  <span className="text-sm"><strong className="text-gray-900">Gestión y ejecución del contrato de compra:</strong> Procesamiento de pedidos, envío a través de agencias de transportes, facturación legal e inventario.</span>
                </li>
                <li className="pl-2">
                  <span className="text-sm"><strong className="text-gray-900">Comunicaciones transaccionales:</strong> Envío de confirmaciones automáticas de pedidos y avisos de entrega utilizando la pasarela API de <strong className="text-gray-900">Resend</strong>.</span>
                </li>
                <li className="pl-2">
                  <span className="text-sm"><strong className="text-gray-900">Soporte y atención al cliente:</strong> Responder a solicitudes de presupuesto corporativo o asesoramiento técnico en EPIs formuladas a través de nuestro formulario de contacto.</span>
                </li>
                <li className="pl-2">
                  <span className="text-sm"><strong className="text-gray-900">Cumplimiento de obligaciones legales:</strong> Conservación de facturas y registros contables requeridos por la Agencia Tributaria Española.</span>
                </li>
              </ol>
            </section>

            <section id="4-destinatarios" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <Share2 className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  4. Destinatarios y Transferencia de Datos
                </h2>
              </div>
              <p className="mb-6">
                Tus datos no serán cedidos ni vendidos a terceros con fines publicitarios. Para poder prestar nuestros servicios comerciales, es estrictamente necesario comunicar ciertos datos de carácter personal a encargados de tratamiento homologados en condiciones de seguridad extrema:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Entidades de pago:</strong> <em>Stripe Inc.</em> procesa la información financiera bajo los estándares PCI-DSS.</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Plataformas de correo transaccional:</strong> <em>Resend Inc.</em> gestiona la entrega de notificaciones en tiempo real.</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Empresas de logística:</strong> Correos Express, SEUR, o DHL para hacer efectiva la entrega de los pedidos en su dirección.</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Servicios en la nube:</strong> <em>Amazon Web Services (AWS)</em> provee la infraestructura DynamoDB y AppSync donde se guardan de forma cifrada los registros de compras e histórico de pedidos.</span>
                </li>
              </ul>
            </section>

            <section id="5-derechos" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <Award className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  5. Sus Derechos Legales (ARCO-POL)
                </h2>
              </div>
              <p className="mb-6">
                Los usuarios e interesados tienen reconocidos por ley amplios derechos sobre el tratamiento de sus datos personales. Puede ejercerlos de forma gratuita y en cualquier momento:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Acceso:</strong> Saber qué datos tenemos guardados sobre usted.</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Rectificación:</strong> Corregir cualquier error en su nombre, dirección o NIF.</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Supresión (Derecho al olvido):</strong> Solicitar que eliminemos sus datos de nuestros servidores (siempre que no haya obligaciones legales pendientes de conservación).</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Portabilidad:</strong> Solicitar la entrega de sus datos en formato estructurado e interoperable para otra plataforma.</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Limitación del tratamiento:</strong> Solicitar la suspensión temporal del tratamiento de sus datos.</span>
                </li>
              </ul>
            </section>

            <section id="6-contacto" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <Mail className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  6. Contacto y Reclamaciones
                </h2>
              </div>
              <p className="mb-4">
                Para ejercer cualquiera de los derechos descritos o realizar una consulta sobre el tratamiento de su información de carácter personal, puede dirigir un escrito firmado acompañado de copia de documento oficial de identidad (DNI o NIE) a la dirección de correo electrónico <a href={`mailto:\${BUSINESS_CONFIG.email}`} className="font-bold text-indigo-600 hover:underline">{BUSINESS_CONFIG.email}</a>.
              </p>
              <p>
                Asimismo, le informamos que si considera vulnerados sus derechos, tiene derecho a presentar una reclamación formal ante la <strong className="text-gray-900">Agencia Española de Protección de Datos (AEPD)</strong> a través de su sede electrónica oficial (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-600 hover:underline">www.aepd.es</a>).
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
