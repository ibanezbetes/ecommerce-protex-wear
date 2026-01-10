import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServicePage.css';
import entregasHeroImg from '../../assets/entregas_clean.png';

const EntregasNominativasPage = () => {
    return (
        <div className="service-page">
            {/* Hero Banner */}
            <div className="service-hero" style={{ backgroundImage: `url(${entregasHeroImg})` }}>
                <div className="hero-overlay">
                    <h1>ENTREGAS NOMINATIVAS</h1>
                </div>
            </div>

            <div className="page-content">

                {/* Intro Section */}
                <section className="service-intro-section">
                    <div className="service-intro-text">
                        <h2>DOTACIÓN PERSONALIZADA DE VESTUARIO</h2>
                        <p>
                            Servicio en el que se provee la dotación de vestuario estimada a través de un sistema de entrega personalizada. En este sistema, cada empleado recibe su propia ropa de trabajo, que se ajusta a sus medidas y necesidades personales.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={entregasHeroImg}
                            alt="Servicio de entregas nominativas"
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
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3>Mayor comodidad</h3>
                            <p>Garantiza que cada empleado tenga la ropa de trabajo que se ajuste a sus medidas y preferencias personales.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Mayor satisfacción</h3>
                            <p>Los empleados sienten que la empresa se preocupa por su comodidad, mejorando la satisfacción laboral.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Reducción de costes</h3>
                            <p>Reduce costes al evitar la compra de ropa en exceso, entregando la cantidad adecuada necesaria.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3>Mayor eficiencia</h3>
                            <p>Mejora la eficiencia al garantizar que cada empleado tenga lo necesario sin usar recursos internos extra.</p>
                        </div>
                    </div>
                </section>

            </div>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>SIMPLIFIQUE SU LOGÍSTICA INTERNA</h2>
                    <p>
                        Contacte con nosotros para implementar el sistema de entregas nominativas en su próxima reposición.
                    </p>
                    <Link to="/contacto" className="cta-button">SOLICITAR INFORMACIÓN</Link>
                </div>
            </section>

        </div>
    );
};

export default EntregasNominativasPage;
