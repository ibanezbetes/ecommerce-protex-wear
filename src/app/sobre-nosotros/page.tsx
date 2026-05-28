'use client';
import React from 'react';
import Image from 'next/image';
import styles from './page.module.css';

const SobreNosotrosPage = () => {
    return (
        <div className={styles.page}>
            {/* Hero Banner */}
            <div className={styles.hero}>
                <div className={styles.heroOverlay}>
                    <h1>SOBRE NOSOTROS</h1>
                </div>
            </div>

            <div className={styles.content}>

                {/* Intro Section */}
                <section className={styles.aboutSection}>
                    <div className={styles.aboutText}>
                        <h2>DISTRIBUCIÓN DE ROPA Y PROTECCIÓN LABORAL</h2>
                        <p>
                            Ofrecemos una amplia gama de productos para trabajadores de diferentes sectores y especialidades.
                            Contamos con más de 30 años de experiencia en ofrecer un asesoramiento integral y personalizado
                            a nuestros clientes para proporcionarles soluciones a medida, ajustadas a las necesidades de cada
                            empresa y con el objetivo de prevenir riesgos en el entorno laboral, aplicando las mejores medidas
                            de seguridad con nuestros suministros.
                        </p>
                    </div>
                    <div className={styles.aboutImage}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://protexwear.es/wp-content/uploads/2025/02/room-business-meeting-1024x683.jpg"
                            alt="Sala de reuniones Protex Wear"
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Protex+Wear+Meeting+Room';
                            }}
                        />
                    </div>
                </section>

                {/* Brands Section */}
                <section className={styles.brandsSection}>
                    <h2>TRABAJAMOS CON MÁS DE 60 MARCAS RECONOCIDAS</h2>
                    <div className={styles.brandsGrid}>
                        <Image src="/images/brands/3m.jpg" alt="Logo 3M" width={120} height={60} className={styles.brandLogo} />
                        <Image src="/images/brands/Ansell.jpg" alt="Logo Ansell" width={120} height={60} className={styles.brandLogo} />
                        <Image src="/images/brands/fal.jpg" alt="Logo Fal Seguridad" width={120} height={60} className={styles.brandLogo} />
                        <Image src="/images/brands/Portwest.jpg" alt="Logo Portwest" width={120} height={60} className={styles.brandLogo} />
                        <Image src="/images/brands/deltaplus.webp" alt="Logo Delta Plus" width={120} height={60} className={`${styles.brandLogo} ${styles.brandLogoLarge}`} />
                        <div className={styles.brandLogoMore}>...y muchas más</div>
                    </div>
                </section>

                {/* Features / Why Choose Us Section */}
                <section className={styles.featuresSection}>
                    <h2>¿POR QUÉ ELEGIRNOS COMO TU DISTRIBUIDOR DE ROPA DE TRABAJO Y PROTECCIÓN LABORAL?</h2>

                    <div className={styles.featuresGrid}>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>
                                {/* Icon Placeholder - Using simple SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Asesoramiento personalizado</h3>
                        </div>

                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3>Rapidez</h3>
                        </div>

                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3>Excelencia y especialización</h3>
                        </div>

                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </div>
                            <h3>Personalización (imagen corporativa)</h3>
                        </div>
                    </div>
                </section>

            </div>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2>PROTEGE A TU EQUIPO CON LA MEJOR ROPA LABORAL</h2>
                    <p>
                        No dejes la seguridad al azar. Encuentra los mejores uniformes y equipos de protección adaptados a tu sector.
                        Ponte en contacto con nosotros y equipa a tus trabajadores con la mejor calidad.
                    </p>
                    <a href="/contacto" className={styles.ctaButton}>CONTACTAR</a>
                </div>
            </section>

        </div>
    );
};

export default SobreNosotrosPage;
