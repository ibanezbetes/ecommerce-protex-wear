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
                    <h1>CENTRO ESPECIAL DE EMPLEO / LGD</h1>
                </div>
            </div>

            <div className="page-content">

                {/* Intro Section */}
                <section className="service-intro-section">
                    <div className="service-intro-text">
                        <h2>UNA OBLIGACIÓN QUE AYUDA A CUMPLIR MUCHOS SUEÑOS</h2>
                        <p>
                            En Protex Wear ayudamos a las empresas a cumplir con la LGD. La Ley LISMI (ahora LGD) establece que las empresas con más de 50 trabajadores deben reservar un porcentaje de puestos para personas con una discapacidad igual o superior al 33%.
                        </p>
                        <p>
                            <strong>¿Qué pasa si la contratación no es viable?</strong><br />
                            Cuando la contratación directa no es posible, existen medidas alternativas como contratar bienes o servicios a un Centro Especial de Empleo, donaciones a organizaciones, o establecer enclaves laborales.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={ceeHeroImg}
                            alt="Inclusión laboral y Centro Especial de Empleo"
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <h2>VENTAJAS DE CONTRATAR UN C.E.E.</h2>

                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3>Inclusión social</h3>
                            <p>Enriquece el ambiente laboral y aporta diferentes perspectivas, impactando positivamente en la innovación.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Cumplimiento legal</h3>
                            <p>Reduce el riesgo de recibir sanciones por incumplimiento de la Ley General de Discapacidad.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3>Impacto social positivo</h3>
                            <p>Mejora la calidad de vida de las personas con discapacidad promoviendo su inclusión laboral.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Beneficios Fiscales</h3>
                            <p>Incentivos fiscales y reducciones en las cotizaciones a la Seguridad Social.</p>
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
