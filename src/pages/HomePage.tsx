import React from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/img-home/carrusel.jpg';
import featureBg from '../assets/img-home/home.jpg';
import cascoImg from '../assets/casco.jpg';
import '../styles/HomePage.css';

/**
 * Home Page Component
 * Landing page with hero section, featured products, and company info
 */
import PageTransition from '../components/UI/PageTransition';
import ScrollReveal from '../components/UI/ScrollReveal';

// ...

function HomePage() {
  console.log('🏠 HomePage se está renderizando...');

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section
          className="hero-section"
          style={{
            backgroundImage: `linear-gradient(rgba(30, 60, 115, 0.39), rgba(30, 60, 115, 0.5)), url(${heroBg})`
          }}
        >
          <div className="hero-content">
            <h1 className="hero-title animate-fade-in-up">
              Protección Profesional
            </h1>
            <p className="hero-description animate-fade-in-up delay-100">
              Equipos de protección individual de la más alta calidad para profesionales que no comprometen su seguridad
            </p>
            <div className="hero-buttons animate-fade-in-up delay-200">
              <Link
                to="/productos"
                className="btn-hero-primary"
              >
                Ver Productos
              </Link>
              <Link
                to="/sobre-nosotros"
                className="btn-hero-outline"
              >
                Conoce Más
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <ScrollReveal>
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="features-intro">
                <div className="features-intro-text">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    ¿Por qué elegir Protex Wear?
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Más de 20 años de experiencia en equipos de protección individual,
                    ofreciendo productos certificados y servicio especializado
                  </p>
                </div>
                <div className="features-intro-image-container">
                  <img
                    src={featureBg}
                    alt="Profesional con equipo de protección"
                    className="features-intro-image"
                  />
                </div>
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
        </ScrollReveal>

        {/* Categories Section */}
        <ScrollReveal delay={0.2}>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  {
                    name: 'ROPA DE TRABAJO',
                    image: cascoImg,
                    link: '/productos?categoria=ropa',
                    description: 'Vestuario profesional'
                  },
                  {
                    name: 'CALZADO DE SEGURIDAD',
                    image: cascoImg,
                    link: '/productos?categoria=calzado',
                    description: 'Botas y zapatos de seguridad'
                  },
                  {
                    name: 'GUANTES DE SEGURIDAD',
                    image: cascoImg,
                    link: '/productos?categoria=guantes',
                    description: 'Guantes de seguridad'
                  },
                  {
                    name: 'EPIS',
                    image: cascoImg,
                    link: '/productos?categoria=epis',
                    description: 'EPIS'
                  },
                ].map((category, index) => (
                  <Link
                    key={index}
                    to={category.link}
                    className="category-item group"
                  >
                    {/* Background Image */}
                    <div className="category-bg-container">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="category-bg-img"
                      />
                      <div className="category-gradient" />
                    </div>

                    {/* Content Overlay */}
                    <div className="category-content-overlay">
                      <h3 className="category-overlay-title">
                        {category.name}
                      </h3>
                      <p className="category-overlay-desc">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* CTA Section */}
        <ScrollReveal>
          <section className="home-cta-section">
            <div className="home-cta-container">
              <h2 className="home-cta-title">
                ¿Necesitas asesoramiento personalizado?
              </h2>
              <p className="home-cta-description">
                Nuestro equipo de expertos está aquí para ayudarte a encontrar
                el equipo de protección perfecto para tu empresa
              </p>
              <div className="home-cta-buttons">
                <Link to="/contacto" className="btn-secondary btn-lg home-cta-btn-contact">
                  Contactar Ahora
                </Link>
                <a href="tel:+34900123456" className="btn-outline btn-lg home-cta-btn-call">
                  Llamar: +34 900 123 456
                </a>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}

export default HomePage;