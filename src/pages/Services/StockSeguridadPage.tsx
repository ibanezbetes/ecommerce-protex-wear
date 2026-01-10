import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServicePage.css';
import stockHeroImg from '../../assets/safety_stock_professional.png';

const StockSeguridadPage = () => {
    return (
        <div className="service-page">
            {/* Hero Banner */}
            <div className="service-hero" style={{ backgroundImage: `url(${stockHeroImg})` }}>
                <div className="hero-overlay">
                    <h1>STOCK DE SEGURIDAD</h1>
                </div>
            </div>

            <div className="page-content">

                {/* Intro Section */}
                <section className="service-intro-section">
                    <div className="service-intro-text">
                        <h2>¿EN QUÉ CONSISTE EL SERVICIO?</h2>
                        <p>
                            A través del servicio de stock de seguridad para empresas se mantiene un inventario adicional de productos o artículos que un cliente utiliza regularmente, para asegurarse de que siempre tengan suficiente cantidad de estos artículos en caso de que suceda un imprevisto o una emergencia.
                        </p>
                        <p>
                            Este servicio puede ser útil para empresas que dependen de ciertos productos o materiales para su operación diaria y no pueden permitirse quedarse sin ellos.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={stockHeroImg}
                            alt="Stock de seguridad en almacén"
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <h2>BENEFICIOS DEL SERVICIO</h2>

                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3>Reducción de riesgos</h3>
                            <p>Evita interrupciones en la producción y minimiza riesgos de pérdida de ingresos por falta de material.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Ahorro de tiempo y esfuerzo</h3>
                            <p>Elimina la preocupación y urgencia de pedidos de emergencia al tener stock disponible.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3>Mayor eficiencia</h3>
                            <p>Mejora la eficiencia operativa al tener siempre los artículos necesarios disponibles para su uso.</p>
                        </div>
                    </div>
                </section>

            </div>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>ASEGURE SU CADENA DE SUMINISTRO</h2>
                    <p>
                        No permita que la falta de equipamiento detenga su producción.
                        Confíe en nuestro servicio de stock de seguridad y auditoría.
                    </p>
                    <Link to="/contacto" className="cta-button">CONTACTAR AHORA</Link>
                </div>
            </section>

        </div>
    );
};

export default StockSeguridadPage;
