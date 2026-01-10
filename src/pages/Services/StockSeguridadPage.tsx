import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServicePage.css';
import safetyStockImg from '../../assets/safety_stock_professional.png';

const StockSeguridadPage = () => {
    return (
        <div className="service-page">
            {/* Hero Banner */}
            <div className="service-hero" style={{ backgroundImage: `url(${safetyStockImg})` }}>
                <div className="hero-overlay">
                    <h1>STOCK DE SEGURIDAD / AUDITORÍA</h1>
                </div>
            </div>

            <div className="page-content">

                {/* Intro Section */}
                <section className="service-intro-section">
                    <div className="service-intro-text">
                        <h2>GESTIÓN DE INVENTARIO Y ALMACENAJE</h2>
                        <p>
                            Ofrecemos un servicio de stock de seguridad para garantizar que su empresa nunca sufra paradas
                            por falta de material. Nos encargamos de gestionar su inventario de EPIs y vestuario laboral
                            en nuestras propias instalaciones.
                        </p>
                        <p>
                            Además, realizamos auditorías de vestuario para analizar el estado de las prendas,
                            detectar necesidades de renovación y optimizar sus costes operativos.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={safetyStockImg}
                            alt="Gestión de stock de seguridad y auditoría"
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
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3>Stock Siempre Disponible</h3>
                            <p>Eliminación de riesgos por rotura de stock.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h3>Auditoría de Prendas</h3>
                            <p>Análisis y control de calidad periódico.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3>Optimización de Costes</h3>
                            <p>Reduzca gastos de almacenamiento propio.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Respuesta Inmediata</h3>
                            <p>Envíos rápidos desde nuestro almacén de seguridad.</p>
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
