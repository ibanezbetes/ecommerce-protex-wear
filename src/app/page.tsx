import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const categories = [
  {
    name: 'Cascos de Seguridad',
    link: '/productos?categoria=cascos',
    description: 'Protecci\u00f3n craneal certificada',
  },
  {
    name: 'Calzado de Seguridad',
    link: '/productos?categoria=calzado',
    description: 'Botas y zapatos de trabajo',
  },
  {
    name: 'Guantes de Protecci\u00f3n',
    link: '/productos?categoria=guantes',
    description: 'Protecci\u00f3n para las manos',
  },
  {
    name: 'Ropa de Trabajo',
    link: '/productos?categoria=ropa',
    description: 'Vestuario profesional',
  },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      <section
        className={styles.heroSection}
        style={{
          backgroundImage: `linear-gradient(rgba(16, 31, 57, 0.55), rgba(16, 31, 57, 0.68)), url(/images/carrusel.jpg)`,
        }}
      >
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Protecci&oacute;n Profesional</h1>
          <p className={styles.heroText}>
            Equipos de protecci&oacute;n individual de la m&aacute;s alta calidad para profesionales que no comprometen su seguridad
          </p>
          <div className={styles.heroActions}>
            <Link href="/productos" className={`${styles.button} ${styles.buttonPrimary}`}>
              Ver Productos
            </Link>
            <Link href="/sobre-nosotros" className={`${styles.button} ${styles.buttonGhost}`}>
              Conoce M&aacute;s
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>&iquest;Por qu&eacute; elegir Protex Wear?</h2>
            <p>
              M&aacute;s de 20 a&ntilde;os de experiencia en equipos de protecci&oacute;n individual,
              ofreciendo productos certificados y servicio especializado.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Calidad Certificada</h3>
              <p>
                Todos nuestros productos cumplen con las normativas europeas CE y est&aacute;n certificados por organismos oficiales.
              </p>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3>Env&iacute;o R&aacute;pido</h3>
              <p>
                Entrega en 24-48h en pen&iacute;nsula. Env&iacute;o gratuito en pedidos superiores a 100 euros.
              </p>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Soporte T&eacute;cnico</h3>
              <p>
                Asesoramiento especializado para ayudarte a elegir el equipo de protecci&oacute;n m&aacute;s adecuado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Nuestras Categor&iacute;as</h2>
            <p>
              Amplio cat&aacute;logo de equipos de protecci&oacute;n individual para todos los sectores profesionales.
            </p>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <Link key={category.name} href={category.link} className={styles.card}>
                <div className={styles.cardMedia}>
                  <div className={styles.cardPlaceholder}>
                    <span>Imagen de {category.name}</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>&iquest;Necesitas asesoramiento personalizado?</h2>
          <p>
            Nuestro equipo de expertos est&aacute; aqu&iacute; para ayudarte a encontrar el equipo de protecci&oacute;n perfecto para tu empresa.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/contacto" className={`${styles.button} ${styles.buttonLight}`}>
              Contactar Ahora
            </Link>
            <a href="tel:+34900123456" className={`${styles.button} ${styles.buttonOutline}`}>
              Llamar: +34 900 123 456
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
