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
    <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Banner */}
      <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 to-indigo-900/100" />
        
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-500/20 text-indigo-200 text-sm font-bold tracking-widest uppercase mb-6 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            Legalidad & Transparencia
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white drop-shadow-md">
            TÉRMINOS Y CONDICIONES
          </h1>
          <p className="text-lg md:text-xl text-indigo-100/90 leading-relaxed max-w-3xl mx-auto font-medium">
            Última actualización: 28 de mayo de 2026. Por favor, lea detenidamente estas condiciones antes de utilizar nuestros servicios y pasarela de compra.
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
                Índice de contenido
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
            
            <section id="1-introduccion" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <FileText className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  1. Introducción y Aceptación de los Términos
                </h2>
              </div>
              <p className="mb-4">
                Las presentes Condiciones Generales de Venta (en adelante, "Términos y Condiciones") regulan de manera exclusiva las relaciones comerciales entre <strong className="text-gray-900">{BUSINESS_CONFIG.name}</strong> (con CIF {BUSINESS_CONFIG.cif} y domicilio social en {BUSINESS_CONFIG.address}) y cualquier persona física o jurídica (en adelante, "el Cliente") que realice la adquisición de equipos de protección individual (EPIs), vestuario laboral y accesorios a través del portal de comercio electrónico <a href="/" className="text-indigo-600 font-bold hover:underline">protexwear.es</a>.
              </p>
              <p>
                El uso del sitio web, el registro en el portal B2B/B2C, así como la confirmación de cualquier pedido mediante la pasarela de compra implica la aceptación <strong className="text-gray-900">plena, explícita y sin reservas</strong> por parte del Cliente de todos y cada uno de los términos detallados en este documento.
              </p>
            </section>

            <section id="2-propiedad" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <Shield className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  2. Propiedad Intelectual e Industrial
                </h2>
              </div>
              <p className="mb-4">
                Todos los contenidos mostrados en este sitio web —incluyendo, a título enunciativo pero no limitativo: designs, códigos de programación, logotipos, imagotipos, nombres comerciales, fichas técnicas de seguridad, imágenes de catálogo y descripciones de producto— están sujetos a derechos de propiedad intelectual e industrial titularidad de <strong className="text-gray-900">{BUSINESS_CONFIG.name}</strong> o de terceras marcas de las cuales disponemos de licencia y autorización de comercialización (como 3M, Ansell, Fal Seguridad, y Portwest).
              </p>
              <p>
                Queda expresamente prohibida la reproducción, distribución, comunicación pública, extracción total o parcial o modificación de cualquier elemento del portal sin el consentimiento formal y por escrito de la dirección de Protex Wear.
              </p>
            </section>

            <section id="3-compra" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  3. Condiciones de Compra, Impuestos y Precios
                </h2>
              </div>
              <p className="mb-4">
                Los precios de los productos ofertados en Protex Wear se indican en euros (€). Dependiendo del perfil del cliente (B2B Corporativo registrado o B2C Cliente Final), las tarifas podrán mostrarse con o sin el Impuesto sobre el Valor Añadido (IVA) vigente en España, lo cual se desglosará de manera transparente en la cesta y checkout antes de la confirmación final.
              </p>
              <p className="font-bold text-gray-900 mb-4">
                Medios de Pago Soportados en Pasarela:
              </p>
              <ul className="space-y-4 mb-6">
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Tarjetas de Crédito y Débito:</strong> Procesadas de forma segura bajo cifrado SSL a través de la infraestructura integrada de Stripe.</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Bizum Comercial y Transferencia Bancaria Directa:</strong> Para clientes que requieran flujos corporativos con emisión previa de factura proforma o albarán de entrega.</span>
                </li>
              </ul>
              <p>
                El Cliente garantiza que posee la autorización necesaria para utilizar el método de pago elegido y asume la responsabilidad del abono correspondiente.
              </p>
            </section>

            <section id="4-envios" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <Truck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  4. Envíos, Plazos y Cobertura de Entrega
                </h2>
              </div>
              <p className="mb-6">
                Protex Wear realiza entregas en todo el territorio español y determinados destinos internacionales seleccionados en la pasarela. Los costes de envío se calculan dinámicamente según la dirección detectada o autocompletada por nuestro buscador inteligente de direcciones:
              </p>
              
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-900">
                      <th className="p-4 font-bold border-b border-gray-200">Zona geográfica</th>
                      <th className="p-4 font-bold border-b border-gray-200">Tarifa estándar</th>
                      <th className="p-4 font-bold border-b border-gray-200">Umbral Gratuito</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 border-b border-gray-100 font-bold text-gray-900">Tarifa Única (Nacional e Internacional)</td>
                      <td className="p-4 border-b border-gray-100">9,00 €</td>
                      <td className="p-4 border-b border-gray-100 text-emerald-600 font-bold">Gratis &gt; 100 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p>
                Los plazos de entrega estándar son de <strong className="text-gray-900">24 a 72 horas laborables</strong> desde la salida de nuestro centro logístico central para envíos peninsulares. En caso de rotura de stock o incidencias con la agencia de transportes, se notificará de inmediato al cliente facilitándole la posibilidad de abono del importe o sustitución equivalente de calzado o ropa laboral.
              </p>
            </section>

            <section id="5-garantia" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  5. Garantía y Responsabilidad Limitada
                </h2>
              </div>
              <p className="mb-4">
                Todos nuestros artículos gozan del plazo de garantía legal establecido por la legislación de consumo vigente (3 años para productos nuevos). La garantía cubre cualquier defecto de fabricación en las costuras, materiales de protección, punteras de acero o calzado de seguridad.
              </p>
              <p>
                Protex Wear no responderá de los daños causados por un mal uso, desgaste natural o la falta de mantenimiento requerido por el fabricante. Asimismo, el uso de Equipos de Protección Individual (EPIs) debe ser supervisado por el responsable de prevención de riesgos laborales de cada empresa contratante para asegurar su adecuación al puesto de trabajo específico.
              </p>
            </section>

            <section id="6-jurisdiccion" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  6. Modificaciones de Condiciones y Jurisdicción
                </h2>
              </div>
              <p className="mb-4">
                Nos reservamos el derecho a modificar las presentes condiciones generales en cualquier momento. El Cliente estará sujeto a los términos vigentes en la fecha de realización de su pedido.
              </p>
              <p>
                Para cualquier controversia, litigio o interpretación contractual derivada de la adquisición de productos en este portal, ambas partes renuncian expresamente a cualquier otro fuero que pudiera corresponderles y se someten voluntariamente a la jurisdicción exclusiva de los <strong className="text-gray-900">Juzgados y Tribunales de la ciudad de Madrid, España</strong>.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
