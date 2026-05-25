import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Home Page Component (Next.js)
 * Landing page with hero section, featured products, and company info
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 60, 115, 0.39), rgba(30, 60, 115, 0.5)), url(/images/carrusel.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <div className="hero-content text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Protección Profesional
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto px-4">
            Equipos de protección individual de la más alta calidad para profesionales que no comprometen su seguridad
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/productos"
              className="bg-primary-color hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-md transition-colors"
            >
              Ver Productos
            </Link>
            <Link
              href="/sobre-nosotros"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-color text-white font-semibold py-3 px-6 rounded-md transition-colors"
            >
              Conoce Más
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Protex Wear?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Más de 20 años de experiencia en equipos de protección individual, 
              ofreciendo productos certificados y servicio especializado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-color rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad Certificada</h3>
              <p className="text-gray-600">
                Todos nuestros productos cumplen con las normativas europeas CE y están certificados por organismos oficiales
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-color rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Envío Rápido</h3>
              <p className="text-gray-600">
                Entrega en 24-48h en península. Envío gratuito en pedidos superiores a 100€
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-color rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Soporte Técnico</h3>
              <p className="text-gray-600">
                Asesoramiento especializado para ayudarte a elegir el equipo de protección más adecuado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestras Categorías
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Amplio catálogo de equipos de protección individual para todos los sectores profesionales
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Cascos de Seguridad',
                link: '/productos?categoria=cascos',
                description: 'Protección craneal certificada'
              },
              {
                name: 'Calzado de Seguridad',
                link: '/productos?categoria=calzado',
                description: 'Botas y zapatos de trabajo'
              },
              {
                name: 'Guantes de Protección',
                link: '/productos?categoria=guantes',
                description: 'Protección para las manos'
              },
              {
                name: 'Ropa de Trabajo',
                link: '/productos?categoria=ropa',
                description: 'Vestuario profesional'
              },
            ].map((category, index) => (
              <Link
                key={index}
                href={category.link}
                className="card group cursor-pointer"
              >
                <div className="aspect-[4/3] bg-gray-200 rounded-t-lg overflow-hidden relative">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                    <span className="text-gray-500 text-sm">Imagen de {category.name}</span>
                  </div>
                </div>
                <div className="card-body p-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-color transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-color text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesitas asesoramiento personalizado?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nuestro equipo de expertos está aquí para ayudarte a encontrar 
            el equipo de protección perfecto para tu empresa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto" className="bg-white text-primary-color hover:bg-gray-100 font-semibold py-3 px-6 rounded-md transition-colors text-lg">
              Contactar Ahora
            </Link>
            <a href="tel:+34900123456" className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-color text-white font-semibold py-3 px-6 rounded-md transition-colors text-lg">
              Llamar: +34 900 123 456
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
