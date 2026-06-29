import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SobreNosotrosPage() {
  return (
    <main className="min-h-screen bg-white pb-20 font-sans">
      {/* 1. Hero Section Premium */}
      <section className="relative bg-indigo-950 pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-950/90 to-transparent z-10" />
          <Image 
            src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=2000" 
            alt="Almacén Protex Wear" 
            fill
            className="object-cover opacity-30 mix-blend-overlay"
            priority
          />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
              Quiénes Somos
            </span>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-tight mb-8">
              Expertos en <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Protección Laboral</span> y Vestuario
            </h1>
            <p className="text-xl text-indigo-100/80 leading-relaxed max-w-2xl font-medium">
              Desde Zaragoza para toda España. Más de 30 años equipando a la industria, construcción y servicios con las mejores marcas de EPIs y ropa de trabajo.
            </p>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
          <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 120L0 120 0 0 1200 120z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* 2. Nuestra Historia & Misión */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 flex flex-col">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
              Una trayectoria basada en la <span className="text-indigo-600">Confianza</span> y la <span className="text-indigo-600">Seguridad</span>
            </h2>
            <div className="prose prose-lg text-gray-600">
              <p className="leading-relaxed mb-6">
                En <strong>Protex Wear</strong> somos especialistas en la distribución de <strong>Equipos de Protección Individual (EPIs)</strong>, vestuario laboral, calzado de seguridad y uniformidad corporativa.
              </p>
              <p className="leading-relaxed mb-6">
                Nuestra sede logística se encuentra estratégicamente ubicada en el <strong>Polígono Industrial Malpica II de Zaragoza</strong>. Desde allí, gestionamos un amplio stock permanente que nos permite ofrecer una respuesta rápida y eficaz a empresas de todo el territorio nacional.
              </p>
              <p className="leading-relaxed font-medium text-gray-900">
                Entendemos que cada sector tiene riesgos específicos. Por eso, nuestro valor principal no es solo vender productos, sino ofrecer un <strong>asesoramiento técnico personalizado</strong> para garantizar que tus trabajadores cumplan con las normativas europeas vigentes en la máxima comodidad.
              </p>
            </div>

            {/* Quick Stats Line */}
            <div className="mt-10 flex flex-wrap gap-8 items-center pt-8 border-t border-gray-100">
              <div>
                <p className="text-4xl font-black text-indigo-950 mb-1">+30</p>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Años de Exp.</p>
              </div>
              <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>
              <div>
                <p className="text-4xl font-black text-indigo-950 mb-1">+5.000</p>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Ref. en Stock</p>
              </div>
              <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>
              <div>
                <p className="text-4xl font-black text-indigo-950 mb-1">24/48h</p>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Entregas</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-indigo-600 rounded-[2rem] transform translate-x-4 translate-y-4 opacity-5" />
            <div className="relative rounded-[2rem] overflow-hidden border border-gray-100 shadow-2xl h-[600px]">
              <Image 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200" 
                alt="Operario con EPI" 
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            
            {/* Floating Quality Badge */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 hidden sm:flex">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="font-black text-gray-900 leading-tight">Certificación ISO</p>
                <p className="text-sm text-gray-500 font-medium">Calidad garantizada</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Sectores / B2B Focus */}
      <section className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Soluciones integrales por sectores
            </h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Trabajamos con todo tipo de empresas: desde grandes constructoras e industrias pesadas hasta el sector sanitario, hostelería y servicios generales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sector 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Industria y Construcción</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Alta visibilidad, protección anticaídas, cascos, calzado de seguridad S3 y ropa técnica resistente al fuego o químicos.</p>
            </div>

            {/* Sector 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Sanidad y Limpieza</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Pijamas sanitarios, calzado antideslizante, guantes de nitrilo, mascarillas FFP2/FFP3 y vestuario desechable.</p>
            </div>

            {/* Sector 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Hostelería</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Uniformes de cocina, delantales, calzado ergonómico y ropa de sala con acabados elegantes y antimanchas.</p>
            </div>

            {/* Sector 4 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Personalización B2B</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Servicio de serigrafía, vinilo y bordado propio. Integramos tu logotipo y colores corporativos en toda la uniformidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Marcas Partner */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-10">
            Distribuidores Oficiales de las Mejores Marcas
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            <Image src="/images/brands/3m.jpg" alt="3M" width={100} height={50} className="object-contain w-auto h-auto" />
            <Image src="/images/brands/Ansell.jpg" alt="Ansell" width={120} height={60} className="object-contain w-auto h-auto" />
            <Image src="/images/brands/fal.jpg" alt="Fal Seguridad" width={110} height={55} className="object-contain w-auto h-auto" />
            <Image src="/images/brands/Portwest.jpg" alt="Portwest" width={130} height={65} className="object-contain w-auto h-auto" />
            <Image src="/images/brands/deltaplus.webp" alt="Delta Plus" width={120} height={60} className="object-contain w-auto h-auto" />
          </div>
        </div>
      </section>

      {/* 5. CTA Final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-indigo-950 rounded-3xl p-10 sm:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000')] opacity-10 mix-blend-overlay bg-cover bg-center" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              ¿Hablamos sobre la seguridad de tu empresa?
            </h2>
            <p className="text-indigo-200 text-lg">
              Nuestro equipo técnico está listo para asesorarte sin compromiso. Garantiza la seguridad de tus operarios con Protex Wear.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link 
              href="/contacto" 
              className="inline-flex px-8 py-4 bg-white text-indigo-950 font-extrabold rounded-full hover:scale-105 hover:bg-gray-100 transition-all shadow-lg"
            >
              Contactar Asesor
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
