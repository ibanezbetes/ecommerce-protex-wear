import React, { useState } from 'react';
import '../styles/ContactPage.css';
import contactSquare from '../assets/Contactos-cuadrado.jpg';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    consulta: '',
    privacidad: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission logic
    console.log('Form data submitted:', formData);
    alert('Gracias por contactarnos. Nos pondremos en contacto contigo pronto.');
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="hero-overlay">
          <h1>Contacto</h1>
        </div>
      </div>

      <div className="page-content">
        {/* Intro Section: Text Box (Left) + Image (Right) */}
        <section className="intro-section">
          <div className="intro-box">
            <p className="intro-text">
              Si tienes alguna pregunta sobre nuestros productos y servicios, o si deseas obtener más información sobre cómo podemos colaborar, no dudes en ponerte en contacto con nosotros rellenando el siguiente formulario o mediante nuestros datos de contacto habituales.
              <br /><br />
              Nuestro equipo se pondrá en contacto contigo para resolver tu consulta con la mayor celeridad posible.
            </p>
          </div>
          <div className="intro-image-container">
            <img 
              src={contactSquare} 
              alt="Uniforme de constructor sobre fondo de madera - Ropa Laboral" 
            />
          </div>
        </section>

        <div className="contact-grid">
          {/* Left Side: Contact Form */}
          <div className="contact-box contact-form-section">
            <h2 className="contact-form-title">¿Cómo podemos ayudarte?</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">Nombre (*)</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono" className="form-label">Teléfono (*)</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="+34 000 000 000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="consulta" className="form-label">Consulta (*)</label>
                <textarea
                  id="consulta"
                  name="consulta"
                  value={formData.consulta}
                  onChange={handleChange}
                  required
                  className="form-textarea"
                  placeholder="Escribe tu consulta aquí..."
                ></textarea>
              </div>

              <div className="form-checkbox-group">
                <input
                  type="checkbox"
                  id="privacidad"
                  name="privacidad"
                  checked={formData.privacidad}
                  onChange={handleCheckboxChange}
                  required
                  className="form-checkbox"
                />
                <label htmlFor="privacidad" className="form-label" style={{ marginBottom: 0, fontWeight: 'normal' }}>
                  He leído y acepto la <a href="/politica-privacidad/" target="_blank" className="form-link">Política de Privacidad</a>
                </label>
              </div>

              <button type="submit" className="submit-button">Enviar</button>
            </form>

            <p className="privacy-notice">
              Le informamos que los datos personales obtenidos mediante este formulario, así como su dirección de correo electrónico, serán incorporados en un fichero del cual es responsable PROTEX WEAR, S.A. con la finalidad de atender sus consultas y enviarle el presupuesto solicitado. Nos comprometemos a usar dichos datos únicamente para la finalidad anteriormente mencionada. Los datos proporcionados se conservarán mientras no solicite el cese de la actividad. Los datos no se cederán a terceros salvo en los casos en que exista una obligación legal. El envío de este formulario implica la aceptación de las cláusulas expuestas. Tiene derecho a acceder a sus datos personales, rectificar los datos inexactos o solicitar su supresión cuando los datos ya no sean necesarios para los fines que fueron recogidos. Podrá ejercer sus derechos, acompañando fotocopia del DNI, a la dirección Pol. Malpica, C/F Oeste, COMPLEJO GREGORIO QUEJIDO, Nave 24, 50016 (ZARAGOZA).
            </p>
          </div>

          {/* Right Side: Contact Info */}
          <div className="contact-box contact-info-section">
            <h2 className="contact-form-title" style={{ width: '100%', marginBottom: '1.5rem' }}>Datos de Contacto</h2>
            
            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="24" height="24" fill="currentColor"><path d="M320 144C320 223.5 255.5 288 176 288C96.47 288 32 223.5 32 144C32 64.47 96.47 0 176 0C255.5 0 320 64.47 320 144zM192 64C192 55.16 184.8 48 176 48C122.1 48 80 90.98 80 144C80 152.8 87.16 160 96 160C104.8 160 112 152.8 112 144C112 108.7 140.7 80 176 80C184.8 80 192 72.84 192 64zM144 480V317.1C154.4 319 165.1 319.1 176 319.1C186.9 319.1 197.6 319 208 317.1V480C208 497.7 193.7 512 176 512C158.3 512 144 497.7 144 480z"></path></svg>
                </div>
                <div className="info-content">
                  <h3>¿Dónde estamos?</h3>
                  <p>Polígono Industrial Malpica, Calle de la letra L, Nº6, Nave 1, 50016, Zaragoza.</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="currentColor"><path d="M18.92 351.2l108.5-46.52c12.78-5.531 27.77-1.801 36.45 8.98l44.09 53.82c69.25-34 125.5-90.31 159.5-159.5l-53.81-44.04c-10.75-8.781-14.41-23.69-8.974-36.47l46.51-108.5c6.094-13.91 21.1-21.52 35.79-18.11l100.8 23.25c14.25 3.25 24.22 15.8 24.22 30.46c0 252.3-205.2 457.5-457.5 457.5c-14.67 0-27.18-9.968-30.45-24.22l-23.25-100.8C-2.571 372.4 5.018 357.2 18.92 351.2z"></path></svg>
                </div>
                <div className="info-content">
                  <h3>Teléfono</h3>
                  <p><a href="tel:+34876441275" style={{ color: 'inherit', textDecoration: 'none' }}>(+34) 876 44 12 75</a></p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="currentColor"><path d="M464 64C490.5 64 512 85.49 512 112C512 127.1 504.9 141.3 492.8 150.4L275.2 313.6C263.8 322.1 248.2 322.1 236.8 313.6L19.2 150.4C7.113 141.3 0 127.1 0 112C0 85.49 21.49 64 48 64H464zM217.6 339.2C240.4 356.3 271.6 356.3 294.4 339.2L512 176V384C512 419.3 483.3 448 448 448H64C28.65 448 0 419.3 0 384V176L217.6 339.2z"></path></svg>
                </div>
                <div className="info-content">
                  <h3>E-mail</h3>
                  <p><a href="mailto:info@protexwear.es" style={{ color: 'inherit', textDecoration: 'none' }}>info@protexwear.es</a></p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="currentColor"><path d="M256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512zM232 256C232 264 236 271.5 242.7 275.1L338.7 339.1C349.7 347.3 364.6 344.3 371.1 333.3C379.3 322.3 376.3 307.4 365.3 300L280 243.2V120C280 106.7 269.3 96 255.1 96C242.7 96 231.1 106.7 231.1 120L232 256z"></path></svg>
                </div>
                <div className="info-content">
                  <h3>Horario</h3>
                  <p>L-V : 7:00h - 15:00h</p>
                </div>
              </div>
            </div>

            <div className="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2980.96198887354!2d-0.794688223926731!3d41.656563271266975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDM5JzIzLjYiTiAwwrA0NyczMS42Ilc!5e0!3m2!1ses!2ses!4v1764322231677!5m2!1ses!2ses" 
                width="600" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="map-iframe"
                title="Ubicación Protexwear"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
