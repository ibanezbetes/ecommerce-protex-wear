import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServicePage.css';
import laundryHeroImg from '../../assets/laundry_service_modern.png';

const LavanderiaPage = () => {
    return (
        <div className="service-page">
            {/* Hero Banner */}
            <div className="service-hero" style={{ backgroundImage: `url(${laundryHeroImg})` }}>
                <div className="hero-overlay">
                    <h1>LAVANDERÍA INDUSTRIAL</h1>
                </div>
            </div>

            <div className="page-content">

                {/* Intro Section */}
                <section className="service-intro-section">
                    <div className="service-intro-text">
                        <h2>HIGIENE CERTIFICADA Y CONTROLADA</h2>
                        <p>
                            Nuestro proceso de lavandería industrial va más allá de la limpieza convencional.
                            Utilizamos protocolos estrictos para eliminar patógenos y contaminantes sin dañar los
                            tejidos técnicos de sus Equipos de Protección Individual (EPIs).
                        </p>
                        <p>
                            Garantizamos la desinfección y el mantenimiento de las propiedades técnicas de cada prenda,
                            cumpliendo con la normativa <strong>EN-14065 RABC</strong> de control de biocontaminación.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={laundryHeroImg}
                            alt="Lavandería industrial y procesos de higiene"
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
                    <h2>ESTÁNDARES DE CALIDAD</h2>

                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Certificación RABC</h3>
                            <p>Cumplimiento de normativa EN-14065.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3>Procesos Validados</h3>
                            <p>Dosificación y temperatura controlada.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                </svg>
                            </div>
                            <h3>Protección EPI</h3>
                            <p>Cuidado de tejidos técnicos e ignífugos.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Puntualidad</h3>
                            <p>Logística adaptada a sus turnos de trabajo.</p>
                        </div>
                    </div>
                </section>

            </div>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>¿NECESITA LIMPIEZA INDUSTRIAL?</h2>
                    <p>
                        Hablemos. Diseñaremos un plan de recogida y entrega a la medida de sus necesidades productivas.
                        Contacte con nosotros hoy mismo.
                    </p>
                    <Link to="/contacto" className="cta-button">CONTACTAR AHORA</Link>
                </div>
            </section>

        </div>
    );
};

export default LavanderiaPage;
