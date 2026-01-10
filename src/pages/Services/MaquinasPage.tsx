import React from 'react';
import '../../styles/ServicePage.css';
import { Link } from 'react-router-dom';

const MaquinasContent = () => {
    return (
        <div className="service-page">
            <div className="service-hero">
                <h1>Máquinas Expendedoras de EPIs</h1>
            </div>

            <div className="service-content">
                <div className="service-section">
                    <div className="service-text">
                        <h2>Control y Disponibilidad 24/7</h2>
                        <p>
                            Optimice el consumo de Equipos de Protección Individual con nuestras máquinas expendedoras 
                            (Vending Industrial). Garantice que sus trabajadores tengan acceso a los EPIs necesarios 
                            en cualquier momento, reduciendo el consumo injustificado y mejorando la trazabilidad.
                        </p>
                        <p>
                            Ideales para guantes, gafas, mascarillas, tapones auditivos y otros consumibles de alta rotación.
                        </p>
                    </div>
                </div>

                <div className="service-features-grid">
                    <div className="feature-card">
                        <h3>🕒 Acceso 24/7</h3>
                        <p>
                            Elimine la dependencia del horario de almacén. Sus empleados pueden retirar el material 
                            exactamente cuando lo necesitan, ideal para turnos de noche o fin de semana.
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3>📉 Reducción de Consumo</h3>
                        <p>
                            Estudios demuestran un ahorro de hasta el 30% en el consumo de EPIs gracias al control 
                            individualizado y la concienciación del usuario.
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3>📊 Software de Gestión</h3>
                        <p>
                            Controle quién retira qué y cuándo. Obtenga informes detallados por departamento 
                            o empleado y automatice la reposición de stock.
                        </p>
                    </div>
                </div>

                <div className="cta-section">
                    <h2>Automatice su Gestión de EPIs</h2>
                    <p>Descubra cómo nuestras máquinas pueden ahorrar costes y mejorar la seguridad.</p>
                    <Link to="/contacto" className="cta-button">
                        Solicitar Demo
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MaquinasContent;
