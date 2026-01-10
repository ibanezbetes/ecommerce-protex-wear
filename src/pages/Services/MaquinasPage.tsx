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
                    <h1>MÁQUINAS EXPENDEDORAS DE EPIS</h1>
                </div>
            </div>

            <div className="page-content">

                {/* Intro Section */}
                <section className="service-intro-section">
                    <div className="service-intro-text">
                        <h2>¿EN QUÉ CONSISTE EL SERVICIO?</h2>
                        <p>
                            El servicio de máquinas expendedoras de EPIS (Equipos de Protección Individual) es un servicio en el que se provee a los clientes de equipos de protección individual, como guantes, mascarillas, gafas de seguridad, cascos, etc., a través de máquinas expendedoras instaladas en lugares estratégicos.
                        </p>
                        <p>
                            Este servicio puede ser útil para empresas que necesitan proveer a sus empleados de EPIS para realizar sus tareas diarias, pero que no tienen un sistema eficiente para distribuirlos, o que desean ofrecer a sus empleados la posibilidad de obtener los EPIS de manera rápida y sencilla.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={vendingHeroImg}
                            alt="Máquinas expendedoras de EPIS"
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
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Mayor disponibilidad</h3>
                            <p>Las máquinas pueden estar disponibles las 24 horas del día, permitiendo obtener equipos en cualquier momento.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3>Mayor eficiencia</h3>
                            <p>Reduce el tiempo y esfuerzo necesarios para distribuir los EPIS, mejorando la productividad de la empresa.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3>Mayor seguridad</h3>
                            <p>Asegura que los empleados tengan acceso a los equipos de protección necesarios para trabajar de manera segura.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Reducción de costes</h3>
                            <p>Reduce costes de distribución y permite un mayor control de los equipos suministrados.</p>
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
