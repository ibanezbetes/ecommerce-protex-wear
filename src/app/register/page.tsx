'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Las contrase\u00f1as no coinciden');
      setLoading(false);
      return;
    }

    try {
      const clientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID;
      if (!clientId) throw new Error('Falta configurar NEXT_PUBLIC_USER_POOL_CLIENT_ID');

      const client = new CognitoIdentityProviderClient({ region: 'eu-west-1' });

      const command = new SignUpCommand({
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
        ],
      });

      await client.send(command);
      router.push(`/confirm?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      console.error('Register error:', err);
      setError(err instanceof Error ? err.message : 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.page} ${styles.registerPage}`}>
      <section className={styles.formSide}>
        <div className={styles.panel}>
          <div className={styles.topBar}>
            <Link href="/" className={styles.logoLink} aria-label="Protex Wear">
              <Image src="/logo.png" alt="Protex Wear" width={132} height={38} className={styles.logo} priority />
            </Link>
            <Link href="/" className={styles.backLink}>
              Volver a Protex Wear
            </Link>
          </div>

          <div className={styles.header}>
            <h2 className={styles.title}>Crea tu cuenta</h2>
            <p className={styles.subtitle}>
              Reg&iacute;strate para comprar m&aacute;s r&aacute;pido y preparar tus pedidos profesionales.
            </p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.fieldStack}>
              <div>
                <label className="sr-only" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  className={styles.input}
                  placeholder="Direcci\u00f3n de email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="password">Contrase&ntilde;a</label>
                <input
                  id="password"
                  type="password"
                  required
                  className={styles.input}
                  placeholder="Contrase\u00f1a"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="confirmPassword">Confirmar Contrase&ntilde;a</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  className={styles.input}
                  placeholder="Confirmar contrase\u00f1a"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? 'Procesando...' : 'Registrarse'}
            </button>
          </form>

          <p className={styles.footerText}>
            &iquest;Ya tienes cuenta?{' '}
            <Link href="/login" className={styles.link}>
              Inicia sesi&oacute;n aqu&iacute;
            </Link>
          </p>
        </div>
      </section>

      <section className={styles.visualSide} aria-label="Registro Protex Wear">
        <div className={styles.visualContent}>
          <span className={styles.eyebrow}>Cuenta Protex Wear</span>
          <h1 className={styles.visualTitle}>Todo tu equipamiento laboral, listo para pedir.</h1>
          <p className={styles.visualText}>
            Crea tu acceso y empieza a preparar compras de protecci&oacute;n, vestuario y calzado profesional con una experiencia pensada para empresas.
          </p>
        </div>
      </section>
    </div>
  );
}
