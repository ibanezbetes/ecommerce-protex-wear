import React from 'react';
import '../../styles/ServicePage.css';
import { Link } from 'react-router-dom';

const LavanderiaContent = () => {
    return (
        <div className="service-page">
            <div className="service-hero">
                <h1>Servicios de Lavandería</h1>
            </div>

            <div className="service-content">
                <div className="service-section">
                    <div className="service-text">
                        <h2>Higiene y Desinfección Certificada</h2>
                        <p>
                            Nuestro servicio de lavandería industrial está especializado en ropa de trabajo y EPIs.
                            Garantizamos no solo la limpieza, sino el mantenimiento de las propiedades técnicas 
                            de cada prenda (ignífugas, alta visibilidad, antiestáticas, etc.).
                        </p>
                        <p>
                            Utilizamos procesos validados que eliminan contaminantes y patógenos, asegurando 
                            que el vestuario vuelva a sus empleados en condiciones óptimas de seguridad e higiene.
                        </p>
                    </div>
                </div>

                <div className="service-features-grid">
                    <div className="feature-card">
                        <h3>🧼 Procesos Específicos</h3>
                        <p>
                            Cada tipo de tejido y normativa requiere un tratamiento diferente. Ajustamos temperatura,
                            detergentes y ciclos de lavado para proteger la certificación de la prenda.
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3>🚚 Recogida y Entrega</h3>
                        <p>
                            Servicio logístico integral con frecuencias adaptadas a sus turnos de trabajo. 
                            Recogemos la ropa sucia y entregamos la limpia, clasificada por empleado o departamento.
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3>🧵 Reparación y Mantenimiento</h3>
                        <p>
                            Incluimos pequeñas reparaciones (botones, cremalleras, costuras) para alargar la 
                            vida útil de las prendas y mantener la imagen corporativa impecable.
                        </p>
                    </div>
                </div>

                <div className="cta-section">
                    <h2>Soluciones de Lavandería Profesional</h2>
                    <p>Asegure la higiene y protección en su empresa.</p>
                    <Link to="/contacto" className="cta-button">
                        Más Información
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LavanderiaContent;
