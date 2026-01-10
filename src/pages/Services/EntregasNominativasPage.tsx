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
                        <h2>DISTRIBUCIÓN PERSONALIZADA POR EMPLEADO</h2>
                        <p>
                            Nuestro servicio de entregas nominativas simplifica la gestión de vestuario laboral,
                            preparando kits individuales para cada uno de sus empleados. Cada paquete se entrega
                            etiquetado con el nombre, talla y departamento del trabajador.
                        </p>
                        <p>
                            Este sistema elimina los errores en el reparto, reduce la carga administrativa de su
                            departamento de recursos humanos y asegura que cada empleado reciba exactamente lo que necesita.
                        </p>
                    </div>
                    <div className="service-intro-image">
                        <img
                            src={entregasHeroImg}
                            alt="Servicio de entregas nominativas de vestuario"
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <h2>VENTAJAS DEL SERVICIO</h2>

                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3>Personalización Total</h3>
                            <p>Kits individuales etiquetados por empleado.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h3>Organización Eficiente</h3>
                            <p>Facilita el reparto interno en su empresa.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Ahorro de Tiempo</h3>
                            <p>Elimina horas dedicadas a clasificar ropa.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-item">
                            <div className="feature-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Control de Tallas</h3>
                            <p>Evita incidencias por tallas incorrectas.</p>
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
