import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServicePage.css';
import merchandisingHeroImg from '../../assets/merchandising_corporate_professional.png';

const MerchandisingPage = () => {
    return (
        <div className="service-page">
            {/* Hero Banner */}
            <div className="service-hero" style={{ backgroundImage: `url(${merchandisingHeroImg})` }}>
                <div className="hero-overlay">
                    <h1>MERCHANDISING CORPORATIVO</h1>
                </div>
            </div>

            <div className="page-content">

                {/* Intro Section */}
                <section className="service-intro-section">
                    <div className="service-intro-text">
                        <h2>REGALOS QUE MARCAN LA DIFERENCIA</h2>
                        <p>
                            Más allá del vestuario laboral, ofrecemos una amplia gama de artículos publicitarios y
                            regalos de empresa para potenciar su marca. Desde bolígrafos y libretas hasta tecnología
                            y accesorios de viaje.
                        </p>
                        <p>
                            Gestionamos todo el proceso, desde la selección del producto ideal hasta su personalización
                            y entrega, asegurando que su merchandising transmita los valores de su empresa con la
                            misma calidad que sus uniformes.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={merchandisingHeroImg}
                            alt="Merchandising corporativo y regalos de empresa"
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <h2>CATÁLOGO DE OPORTUNIDADES</h2>

                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <h3>Variedad de Productos</h3>
                            <p>Miles de referencias para todas las necesidades.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                            </div>
                            <h3>Branding Efectivo</h3>
                            <p>Artículos que refuerzan su identidad de marca.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3>Eventos y Ferias</h3>
                            <p>Material promocional para destacar en eventos.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Calidad Garantizada</h3>
                            <p>Productos duraderos que representan bien a su empresa.</p>
                        </div>
                    </div>
                </section>

            </div>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>PROMOCIONE SU NEGOCIO</h2>
                    <p>
                        Desde bolígrafos económicos hasta regalos VIP. Encuentre el artículo perfecto para sus clientes.
                    </p>
                    <Link to="/contacto" className="cta-button">VER CATÁLOGO</Link>
                </div>
            </section>

        </div>
    );
};

export default MerchandisingPage;
