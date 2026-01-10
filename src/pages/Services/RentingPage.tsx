import React from 'react';
import '../../styles/ServicePage.css';
import { Link } from 'react-router-dom';

const RentingContent = () => {
    return (
        <div className="service-page">
            <div className="service-hero">
                <h1>Servicios de Renting</h1>
            </div>

            <div className="service-content">
                <div className="service-section">
                    <div className="service-text">
                        <h2>Gestión Integral de Vestuario Laboral</h2>
                        <p>
                            En Protex Wear ofrecemos un servicio completo de renting que le permite externalizar 
                            la gestión del vestuario laboral de su empresa. Nosotros nos encargamos de todo: 
                            desde la adquisición y financiación hasta el mantenimiento y renovación.
                        </p>
                        <p>
                            Olvídese de inversiones iniciales costosas y disfrute de una cuota mensual fija 
                            que incluye todos los servicios necesarios para mantener a su equipo equipado y protegido.
                        </p>
                    </div>
                </div>

                <div className="service-features-grid">
                    <div className="feature-card">
                        <h3>💰 Sin Inversión Inicial</h3>
                        <p>
                            Evite grandes desembolsos de capital. Convierta un coste fijo en una cuota mensual 
                            deducible fiscalmente. Equipe a su personal sin afectar su flujo de caja.
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3>🔄 Renovación Automática</h3>
                        <p>
                            Garantizamos que sus empleados siempre dispongan de equipos en perfecto estado. 
                            Programamos renovaciones periódicas y sustituciones por desgaste.
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3>📏 Adaptación Total</h3>
                        <p>
                            Analizamos sus necesidades específicas para ofrecer el vestuario más adecuado 
                            a su sector y normativa de seguridad vigente.
                        </p>
                    </div>
                </div>

                <div className="cta-section">
                    <h2>¿Interesado en nuestro servicio de Renting?</h2>
                    <p>Contacte con nuestro equipo comercial para un estudio personalizado.</p>
                    <Link to="/contacto" className="cta-button">
                        Solicitar Presupuesto
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RentingContent;
