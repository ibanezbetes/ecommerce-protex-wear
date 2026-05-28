'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import Link from 'next/link';
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
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Crea tu cuenta</h2>
          <p className={styles.subtitle}>
            Reg&iacute;strate para realizar pedidos m&aacute;s r&aacute;pido.
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
    </div>
  );
}
