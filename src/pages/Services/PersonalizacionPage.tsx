import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServicePage.css';
import personalizacionHeroImg from '../../assets/personalizacion_embroidery_professional.png';

const PersonalizacionPage = () => {
    return (
        <div className="service-page">
            {/* Hero Banner */}
            <div className="service-hero" style={{ backgroundImage: `url(${personalizacionHeroImg})` }}>
                <div className="hero-overlay">
                    <h1>PERSONALIZACIÓN Y BORDADO</h1>
                </div>
            </div>

            <div className="page-content">

                {/* Intro Section */}
                <section className="service-intro-section">
                    <div className="service-intro-text">
                        <h2>IMAGEN CORPORATIVA DE ALTA CALIDAD</h2>
                        <p>
                            La imagen de su equipo es la imagen de su empresa. Ofrecemos servicios integrales de
                            personalización textil mediante bordado, serigrafía, vinilo textil y transfer digital
                            de última generación.
                        </p>
                        <p>
                            Asesoramos sobre la mejor técnica para cada tipo de prenda y tejido, garantizando
                            durabilidad y un acabado profesional que refuerce su identidad de marca en cada uniforme.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={personalizacionHeroImg}
                            alt="Servicio de bordado y personalización textil"
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <h2>TÉCNICAS DISPONIBLES</h2>

                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </div>
                            <h3>Bordado Industrial</h3>
                            <p>Elegancia y máxima durabilidad para sus prendas.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <h3>Serigrafía</h3>
                            <p>Ideal para grandes tiradas y colores planos.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3>Transfer Digital</h3>
                            <p>Alta definición para logotipos complejos.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Vinilo Textil</h3>
                            <p>Versatilidad para numeración y nombres.</p>
                        </div>
                    </div>
                </section>

            </div>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>DESTAQUE SU MARCA</h2>
                    <p>
                        Envíenos su logotipo y le asesoraremos sin compromiso sobre la mejor técnica de personalización.
                    </p>
                    <Link to="/contacto" className="cta-button">SOLICITAR PRESUPUESTO</Link>
                </div>
            </section>

        </div>
    );
};

export default PersonalizacionPage;
