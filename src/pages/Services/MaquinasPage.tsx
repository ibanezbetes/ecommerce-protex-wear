import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServicePage.css';
import vendingHeroImg from '../../assets/vending_service_clean_ppe.png';

const MaquinasPage = () => {
    return (
        <div className="service-page">
            {/* Hero Banner */}
            <div className="service-hero" style={{ backgroundImage: `url(${vendingHeroImg})` }}>
                <div className="hero-overlay">
                    <h1>MÁQUINAS EXPENDEDORAS (VENDING)</h1>
                </div>
            </div>

            <div className="page-content">

                {/* Intro Section */}
                <section className="service-intro-section">
                    <div className="service-intro-text">
                        <h2>CONTROL Y ACCESIBILIDAD 24/7</h2>
                        <p>
                            Nuestras soluciones de Vending Industrial permiten a su empresa automatizar la entrega de
                            Equipos de Protección Individual (EPIs) y consumibles industriales, garantizando el acceso a los
                            materiales necesarios las 24 horas del día.
                        </p>
                        <p>
                            Mejore el control de consumo, reduzca costes operativos y asegure que sus trabajadores siempre
                            tengan acceso al equipo de seguridad necesario, con un sistema de identificación de usuarios
                            totalmente personalizable.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={vendingHeroImg}
                            alt="Máquinas expendedoras industriales"
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <h2>VENTAJAS DEL SISTEMA</h2>

                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Disponibilidad 24/7</h3>
                            <p>Acceso ininterrumpido a equipos de seguridad.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3>Reducción de Consumo</h3>
                            <p>Control exacto del uso de material por empleado.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </div>
                            <h3>Software de Gestión</h3>
                            <p>Informes detallados y alertas de stock en tiempo real.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3>Reposición Automática</h3>
                            <p>Gestión eficiente del inventario sin roturas de stock.</p>
                        </div>
                    </div>
                </section>

            </div>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>AUTOMATICE SU ALMACÉN</h2>
                    <p>
                        Descubra cómo nuestras máquinas expendedoras pueden ahorrar tiempo y dinero a su empresa.
                        Solicite una demostración personalizada.
                    </p>
                    <Link to="/contacto" className="cta-button">SOLICITAR DEMOSTRACIÓN</Link>
                </div>
            </section>

        </div>
    );
};

export default MaquinasPage;
