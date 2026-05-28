'use client';

import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Acceso Clientes B2B</h2>
          <p className={styles.subtitle}>
            Inicia sesi&oacute;n con las credenciales que te proporcion&oacute; el administrador.
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleLogin}>
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
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Verificando...' : 'Iniciar Sesi\u00f3n'}
          </button>
        </form>

        <p className={styles.footerText}>
          &iquest;No tienes cuenta?{' '}
          <Link href="/register" className={styles.link}>
            Reg&iacute;strate aqu&iacute;
          </Link>
        </p>
      </div>
    </div>
  );
}
