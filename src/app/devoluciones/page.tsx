'use client';

import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, AlertTriangle, Truck, ShieldAlert, Sparkles } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/lib/config';

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
    <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Banner */}
      <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 to-indigo-900/100" />
        
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-500/20 text-indigo-200 text-sm font-bold tracking-widest uppercase mb-6 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            Compromiso de Satisfacción
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white drop-shadow-md">
            POLÍTICA DE DEVOLUCIONES
          </h1>
          <p className="text-lg md:text-xl text-indigo-100/90 leading-relaxed max-w-3xl mx-auto font-medium">
            Garantizamos un proceso ágil y transparente. Dispone de 30 días de garantía ampliada para devoluciones o cambios de talla en vestuario laboral.
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
                Apartados
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
            
            <section id="1-desistimiento" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  1. Derecho de Desistimiento Legal y Comercial
                </h2>
              </div>
              <p className="mb-4">
                De acuerdo con el Real Decreto Legislativo 1/2007 de Defensa de los Consumidores y Usuarios, el Cliente tiene derecho a desistir de la compra en un plazo de 14 días naturales sin necesidad de justificación.
              </p>
              <p>
                En <strong className="text-gray-900">PROTEX WEAR</strong>, con el fin de aportar la máxima seguridad y confianza a nuestros profesionales y autónomos, <strong className="text-indigo-700">ampliamos de forma voluntaria dicho plazo hasta los 30 días naturales</strong> a contar desde la recepción física del pedido.
              </p>
            </section>

            <section id="2-condiciones" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  2. Condiciones Físicas del Producto
                </h2>
              </div>
              <p className="mb-6">
                Dado que comercializamos equipos de protección individual (EPIs), cascos, gafas y calzado técnico de seguridad que inciden de forma crítica en la salud y protección de los trabajadores, las devoluciones están sujetas a estrictas comprobaciones higiénicas y funcionales:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm">El producto debe encontrarse <strong className="text-gray-900">completamente nuevo, sin signos de uso</strong>, y en perfectas condiciones comerciales. No se admitirán devoluciones de calzado laboral usado en entornos de obra, taller o fábrica.</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm">Debe conservar el <strong className="text-gray-900">etiquetado original intacto</strong>, así como los manuales de certificación técnica de homologación CE.</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm">Debe devolverse con su <strong className="text-gray-900">embalaje o caja de origen</strong>. Por favor, no pegue etiquetas de transporte o precintos directamente sobre la caja del calzado de seguridad; introduzca el artículo en una caja exterior protectora o sobre de envío.</span>
                </li>
              </ul>
            </section>

            <section id="3-excepciones" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  3. Uniformes Personalizados y Excepciones
                </h2>
              </div>
              <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-6 rounded-r-2xl font-medium text-sm leading-relaxed">
                <strong className="block text-amber-900 text-base mb-1">ATENCIÓN AL CLIENTE B2B / CORPORATIVO:</strong> 
                Conforme al artículo 103 de la Ley de Consumidores y Usuarios, el derecho de desistimiento <strong className="text-amber-900">no se aplicará</strong> a bienes confeccionados conforme a las especificaciones del cliente o claramente personalizados.
              </div>
              <p>
                Por lo tanto, <strong className="text-gray-900">no se admitirán cambios ni devoluciones de prendas que hayan sido serigrafiadas, bordadas, sublimadas o grabadas</strong> con logotipos de empresas, nombres de empleados o distintivos de marca específicos solicitados en el pedido. Les recomendamos solicitar previamente una muestra de tallaje físico antes de ordenar tiradas masivas de personalización.
              </p>
            </section>

            <section id="4-proceso" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <Truck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  4. Proceso de Devolución Paso a Paso
                </h2>
              </div>
              <p className="mb-8">
                Para iniciar un proceso de cambio de talla o devolución, siga estas sencillas instrucciones:
              </p>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-100 before:via-indigo-200 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-600 text-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold text-sm z-10">
                    1
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/20">
                    <h4 className="font-bold text-gray-900 mb-2">Solicitud de Devolución</h4>
                    <p className="text-sm text-gray-600">
                      Envíe un correo a <a href={`mailto:\${BUSINESS_CONFIG.email}`} className="text-indigo-600 font-bold hover:underline">{BUSINESS_CONFIG.email}</a> indicando su número de pedido y los artículos específicos a devolver.
                    </p>
                  </div>
                </div>
                
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-600 text-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold text-sm z-10">
                    2
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/20">
                    <h4 className="font-bold text-gray-900 mb-2">Preparación del Paquete</h4>
                    <p className="text-sm text-gray-600">
                      Embale el calzado o la ropa laboral en su embalaje protector original, conserve las etiquetas CE y colóquelo dentro de una bolsa o caja protectora de transporte externa.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-600 text-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold text-sm z-10">
                    3
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-200/20">
                    <h4 className="font-bold text-gray-900 mb-2">Envío o Recogida a Domicilio</h4>
                    <p className="text-sm text-gray-600">
                      Le facilitaremos una etiqueta prepagada de Correos para entregar en oficina, o bien coordinaremos una recogida a domicilio mediante nuestra agencia si contrató la garantía ampliada.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="5-reembolso" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                  <ArrowLeftRight className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  5. Reembolsos e Importes
                </h2>
              </div>
              <p className="mb-6">
                Una vez recibidos los productos en nuestros almacenes centrales de logística y superado el pertinente control de calidad técnico, procederemos al reembolso del importe abonado por los artículos.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Plazo:</strong> El reembolso se gestionará en un periodo máximo de <strong className="text-gray-900">10 días laborables</strong> a partir de la confirmación de la recepción.</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Método:</strong> Se abonará automáticamente en el mismo medio de pago con el que realizó la compra original (Stripe, Bizum o Transferencia).</span>
                </li>
                <li className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all">
                  <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-indigo-600" />
                  <span className="text-sm"><strong className="text-gray-900">Gastos de Envío de Devolución:</strong> Si el cambio es por un error de Protex Wear o defecto de fabricación, el coste es 100% gratuito. En el caso de desistimiento comercial ordinario, el coste del envío de retorno (9,00 €) se deducirá de la cantidad final a reembolsar.</span>
                </li>
              </ul>
              
              <div className="mt-10 bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-center gap-4 text-indigo-900">
                <Sparkles className="h-8 w-8 text-indigo-600 shrink-0" />
                <p className="text-sm font-medium">
                  ¿Tiene alguna duda o desea tramitar un cambio urgente? Póngase en contacto inmediato con nuestro equipo de atención telefónica al cliente en el teléfono <strong className="text-indigo-700">{BUSINESS_CONFIG.phone}</strong>.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
