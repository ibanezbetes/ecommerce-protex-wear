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
                    <h1>PERSONALIZACIÓN ROPA DE TRABAJO</h1>
                </div>
            </div>

            <div className="page-content">

                {/* Intro Section */}
                <section className="service-intro-section">
                    <div className="service-intro-text">
                        <h2>VISTE TU MARCA CON ESTILO</h2>
                        <p>
                            Personalizamos todo tipo de ropa de trabajo con las mejores tecnologías de marcaje.
                        </p>
                        <p>
                            Te ayudamos a reforzar tu imagen de marca con nuestra selección de ropa y complementos.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={personalizacionHeroImg}
                            alt="Personalización de ropa laboral"
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
                    <h2>TÉCNICAS DE IMPRESIÓN Y PERSONALIZACIÓN</h2>

                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3>Bordado de Alta Calidad</h3>
                            <p>Acabados premium duraderos y elegantes.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <h3>Serigrafía Textil</h3>
                            <p>Ideal para grandes tiradas y colores vivos.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </div>
                            <h3>Vinilo Textil</h3>
                            <p>Versatilidad para personalizaciones unitarias.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3>Sublimación</h3>
                            <p>Impresión digital sin tacto sobre poliéster.</p>
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
