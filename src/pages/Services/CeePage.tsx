import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServicePage.css';
import ceeHeroImg from '../../assets/cee_inclusive_team_professional.png';

const CeePage = () => {
    return (
        <div className="service-page">
            {/* Hero Banner */}
            <div className="service-hero" style={{ backgroundImage: `url(${ceeHeroImg})` }}>
                <div className="hero-overlay">
                    <h1>CENTRO ESPECIAL DE EMPLEO</h1>
                </div>
            </div>

            <div className="page-content">

                {/* Intro Section */}
                <section className="service-intro-section">
                    <div className="service-intro-text">
                        <h2>COMPROMISO E INTEGRACIÓN SOCIAL</h2>
                        <p>
                            Colaboramos activamente con Centros Especiales de Empleo (CEE) para fomentar la integración
                            laboral de personas con discapacidad. Al contratar nuestros servicios, su empresa contribuye
                            directamente a crear oportunidades laborales inclusivas.
                        </p>
                        <p>
                            No solo cumplimos con la Ley General de Discapacidad, sino que creemos firmemente que la
                            diversidad enriquece el entorno laboral y aporta un valor añadido incalculable a nuestra sociedad.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={ceeHeroImg}
                            alt="Integración laboral y responsabilidad social"
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <h2>RESPONSABILIDAD SOCIAL CORPORATIVA</h2>

                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Inclusión Real</h3>
                            <p>Fomento del empleo para personas con discapacidad.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Cumplimiento Legal</h3>
                            <p>Apoyo en el cumplimiento de la LGD.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3>Valor Social</h3>
                            <p>Refuerce su estrategia de RSC.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3>Compromiso Ético</h3>
                            <p>Calidad humana y profesional en cada servicio.</p>
                        </div>
                    </div>
                </section>

            </div>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>COLABORE CON NOSOTROS</h2>
                    <p>
                        Juntos podemos construir una sociedad más justa y oportunidades para todos.
                        Contacte para saber más sobre nuestros convenios.
                    </p>
                    <Link to="/contacto" className="cta-button">MÁS INFORMACIÓN</Link>
                </div>
            </section>

        </div>
    );
};

export default CeePage;
