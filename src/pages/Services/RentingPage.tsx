import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServicePage.css';
import rentingHeroImg from '../../assets/renting_handshake.jpg';

const RentingPage = () => {
    return (
        <div className="service-page">
            {/* Hero Banner */}
            <div className="service-hero" style={{ backgroundImage: `url(${rentingHeroImg})` }}>
                <div className="hero-overlay">
                    <h1>RENTING DE VESTUARIO LABORAL</h1>
                </div>
            </div>

            <div className="page-content">

                {/* Intro Section */}
                <section className="service-intro-section">
                    <div className="service-intro-text">
                        <h2>SERVICIO INTEGRAL PARA EMPRESAS</h2>
                        <p>
                            Mediante el servicio de renting de ropa de trabajo proporcionamos a nuestros clientes
                            prendas de vestuario laboral bajo un contrato de alquiler con posibilidad de corto,
                            medio o largo plazo.
                        </p>
                        <p>
                            Este servicio no solo abarca el suministro de las prendas necesarias para el desempeño
                            de las labores de sus empleados, sino que también incluye un mantenimiento integral de las mismas,
                            asegurando que su imagen corporativa esté siempre impecable.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={rentingHeroImg}
                            alt="Renting de ropa laboral"
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
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Ahorro de Costes</h3>
                            <p>Evite grandes inversiones iniciales en stock.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Higiene Garantizada</h3>
                            <p>Procesos de lavado industrial seguros.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3>Imagen Corporativa</h3>
                            <p>Personalización completa de prendas.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h3>Renovación Automática</h3>
                            <p>Sustitución de prendas por desgaste.</p>
                        </div>
                    </div>
                </section>

            </div>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>OPTIMICE LA GESTIÓN DE SU VESTUARIO</h2>
                    <p>
                        Déjenos cuidar de su ropa laboral mientras usted se ocupa de lo más importante: su negocio.
                        Contacte con nuestro equipo para un estudio personalizado.
                    </p>
                    <Link to="/contacto" className="cta-button">SOLICITAR PRESUPUESTO</Link>
                </div>
            </section>

        </div>
    );
};

export default RentingPage;
