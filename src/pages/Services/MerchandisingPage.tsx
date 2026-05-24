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
                    <h1>MERCHANDISING ROPA DE TRABAJO</h1>
                </div>
            </div>

            <div className="page-content">

                {/* Intro Section */}
                <section className="service-intro-section">
                    <div className="service-intro-text">
                        <h2>PUBLICIDAD Y MERCHANDISING PARA EMPRESAS O GRUPOS</h2>
                        <p>
                            Debido a nuestra experiencia y nuestro taller propio de personalización textil, hemos ampliado nuestra producción de artículos publicitarios y Merchandising para Empresas y grupos.
                        </p>
                        <p>
                            Tenemos un amplio catálogo de artículos promocionales, que te ayudarán a afianzar la presencia de tu marca en cualquier evento o campaña.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={merchandisingHeroImg}
                            alt="Merchandising y regalos corporativos"
                        />
                    </div>
                </section>

                <div className="section-divider">
                    <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="wavy-line">
                        <path
                            d="M0,150 C150,230 350,70 600,150 C850,230 1050,70 1200,150"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="120"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                {/* Features Section */}
                <section className="features-section">
                    <h2>¿CÓMO TRABAJAMOS?</h2>

                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h3>1. Selección y Asesoramiento</h3>
                            <p>Elige tus productos y recibe asesoramiento personalizado.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3>2. Propuestas</h3>
                            <p>Te presentamos propuestas gráficas y de producto.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3>3. Producción</h3>
                            <p>Producción y personalización en nuestro taller.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <h3>4. Envío</h3>
                            <p>Te enviamos el pedido finalizado a tus instalaciones.</p>
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
