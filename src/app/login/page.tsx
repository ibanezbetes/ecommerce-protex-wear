'use client';

import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { CognitoIdentityProviderClient, InitiateAuthCommand, RespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../auth.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para el flujo de reset de contraseña por admin
  const [requireNewPassword, setRequireNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [authSession, setAuthSession] = useState<string | undefined>(undefined);

  const { setSession } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const clientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID;
      if (!clientId) throw new Error('Falta configurar NEXT_PUBLIC_USER_POOL_CLIENT_ID en el .env.local');

      const client = new CognitoIdentityProviderClient({ region: 'eu-west-1' });

      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });

      const response = await client.send(command);

      if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        // AWS requiere que el usuario cambie su contraseña (ej. forzada por admin)
        setRequireNewPassword(true);
        setAuthSession(response.Session);
        return;
      }

      if (response.AuthenticationResult?.IdToken) {
        const base64Url = response.AuthenticationResult.IdToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const claims = JSON.parse(jsonPayload);

        setSession({
          id: claims.sub,
          email: claims.email,
          name: claims.email.split('@')[0],
          can_pay_later: false,
          token: response.AuthenticationResult.IdToken,
        });

        router.push('/checkout');
      } else {
        throw new Error('No se recibi\u00f3 token de autenticaci\u00f3n');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Usuario o contrase\u00f1a incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const clientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID;
      if (!clientId) throw new Error('Falta configurar NEXT_PUBLIC_USER_POOL_CLIENT_ID en el .env.local');

      const client = new CognitoIdentityProviderClient({ region: 'eu-west-1' });

      const command = new RespondToAuthChallengeCommand({
        ClientId: clientId,
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ChallengeResponses: {
          USERNAME: email,
          NEW_PASSWORD: newPassword,
        },
        Session: authSession,
      });

      const response = await client.send(command);

      if (response.AuthenticationResult?.IdToken) {
        const base64Url = response.AuthenticationResult.IdToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const claims = JSON.parse(jsonPayload);

        setSession({
          id: claims.sub,
          email: claims.email,
          name: claims.email.split('@')[0],
          can_pay_later: false,
          token: response.AuthenticationResult.IdToken,
        });

        router.push('/checkout');
      } else {
        throw new Error('No se recibió token tras actualizar la contraseña');
      }
    } catch (err: unknown) {
      console.error('New password error:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar la contraseña. Revisa que cumple los requisitos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.visualSide} aria-label="Protex Wear profesional">
        <div className={styles.visualContent}>
          <span className={styles.eyebrow}>Acceso profesional</span>
          <h1 className={styles.visualTitle}>Protecci&oacute;n para equipos que no paran.</h1>
          <p className={styles.visualText}>
            Accede a tus condiciones B2B, recupera pedidos y gestiona compras de equipamiento laboral con la misma seguridad que exiges en obra.
          </p>
        </div>
      </section>

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
            <h2 className={styles.title}>
              {requireNewPassword ? 'Actualizar Contraseña' : 'Acceso Clientes B2B'}
            </h2>
            <p className={styles.subtitle}>
              {requireNewPassword 
                ? 'Por seguridad, debes establecer una contraseña definitiva antes de continuar.'
                : 'Inicia sesión con las credenciales que te proporcionó el administrador.'}
            </p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {!requireNewPassword ? (
            <form className={styles.form} onSubmit={handleLogin}>
              <div className={styles.fieldStack}>
                <div>
                  <label className="sr-only" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    className={styles.input}
                    placeholder="Dirección de email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="sr-only" htmlFor="password">Contraseña</label>
                  <input
                    id="password"
                    type="password"
                    required
                    className={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className={styles.button}>
                {loading ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleNewPasswordSubmit}>
              <div className={styles.fieldStack}>
                <div>
                  <label className="sr-only" htmlFor="newPassword">Nueva Contraseña</label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    className={styles.input}
                    placeholder="Nueva Contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                  />
                  <p style={{ fontSize: '0.8rem', color: 'var(--secondary-color)', marginTop: '0.5rem' }}>
                    Mínimo 8 caracteres, al menos una mayúscula, un número y un símbolo.
                  </p>
                </div>
              </div>

              <button type="submit" disabled={loading} className={styles.button}>
                {loading ? 'Actualizando...' : 'Guardar y Entrar'}
              </button>
            </form>
          )}

          <p className={styles.footerText}>
            &iquest;No tienes cuenta?{' '}
            <Link href="/register" className={styles.link}>
              Reg&iacute;strate aqu&iacute;
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
