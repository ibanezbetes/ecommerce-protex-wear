import React from 'react';
import Link from 'next/link';

const featuredCategories = [
  { name: 'Cascos de Seguridad', image: '/images/category_helmet.png', href: '/productos?categoria=cascos' },
  { name: 'Calzado de Seguridad', image: '/images/category_boots.png', href: '/productos?categoria=calzado' },
  { name: 'Guantes de Protección', image: '/images/category_gloves.png', href: '/productos?categoria=guantes' },
  { name: 'Ropa de Alta Visibilidad', image: '/images/category_hivis.png', href: '/productos?categoria=ropa' },
];

const features = [
  {
    title: 'Calidad Certificada',
    desc: 'Todos nuestros productos cumplen con las estrictas normativas europeas CE.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Envío Rápido B2B',
    desc: 'Entregas garantizadas en 24-48h. Envío gratuito en pedidos superiores a 100€.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Soporte Especializado',
    desc: 'Asesoramiento técnico de expertos para equipar a toda tu plantilla.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax effect */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transform scale-105"
          style={{ backgroundImage: `url('/images/home.jpg')` }}
        />
        {/* Dark overlay with modern gradient */}
        <div className="absolute inset-0 z-0 bg-black/60" />
        
        <div className="text-center z-10 max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
            <span className="text-xs font-bold tracking-widest text-indigo-200 uppercase">Distribuidores Oficiales</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-8">
            Protección <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Profesional</span> para tu Equipo
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Equipos de Protección Individual (EPI) de la más alta calidad. Porque en el trabajo pesado, no hay margen para comprometer la seguridad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/productos" 
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all transform hover:-translate-y-1 text-center"
            >
              Explorar Catálogo
            </Link>
            <Link 
              href="/sobre-nosotros" 
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold rounded-full transition-all text-center"
            >
              Conoce Más
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              ¿Por qué elegir Protex Wear?
            </h2>
            <p className="text-lg text-gray-600">
              Más de 20 años de experiencia equipando a los sectores más exigentes de la industria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gray-50 rounded-full blur-[100px] opacity-60 -z-10 translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                Categorías Destacadas
              </h2>
              <p className="text-lg text-gray-600">
                Todo lo que necesitas para que tu equipo trabaje de forma segura y cómoda.
              </p>
            </div>
            <Link 
              href="/categorias" 
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors group"
            >
              Ver todas 
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <Link 
                key={category.name} 
                href={category.href} 
                className="group relative h-[400px] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-12 md:p-20 rounded-[3rem] text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              ¿Necesitas equipar a toda tu empresa?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium">
              Abre tu cuenta B2B hoy mismo y obtén tarifas exclusivas, gestión multi-usuario y soporte prioritario.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto">
                Crear Cuenta B2B
              </Link>
              <a href="tel:+34876441275" className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                +34 876 44 12 75
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
