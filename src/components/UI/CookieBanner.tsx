'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CookieBanner.module.css';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on the client
    const consent = localStorage.getItem('protex_cookie_consent');
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('protex_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('protex_cookie_consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.banner} role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-desc">
        <div className={styles.content}>
          <h3 id="cookie-title" className={styles.title}>
            🍪 Uso de Cookies
          </h3>
          <p id="cookie-desc" className={styles.text}>
            Utilizamos cookies propias y de terceros, así como almacenamiento local, para garantizar el correcto funcionamiento de la pasarela de pago y recordar tu carrito de la compra. Puedes consultar nuestra{' '}
            <Link href="/politica-de-privacidad" className={styles.link}>
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
        <div className={styles.actions}>
          <button onClick={handleReject} className={`${styles.button} ${styles.rejectButton}`}>
            Rechazar opcionales
          </button>
          <button onClick={handleAccept} className={`${styles.button} ${styles.acceptButton}`}>
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  );
}
