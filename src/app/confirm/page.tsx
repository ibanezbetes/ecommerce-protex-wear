'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import styles from '../auth.module.css';

function ConfirmForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(() => searchParams.get('email') || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const clientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID;
      if (!clientId) throw new Error('Falta configurar NEXT_PUBLIC_USER_POOL_CLIENT_ID');

      const client = new CognitoIdentityProviderClient({ region: 'eu-west-1' });

      const command = new ConfirmSignUpCommand({
        ClientId: clientId,
        Username: email,
        ConfirmationCode: code,
      });

      await client.send(command);
      setSuccess(true);

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      console.error('Confirm error:', err);
      setError(err instanceof Error ? err.message : 'C\u00f3digo inv\u00e1lido o expirado');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.panel}>
          <svg className={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <div className={styles.header}>
            <h2 className={styles.title}>&iexcl;Cuenta verificada!</h2>
            <p className={styles.subtitle}>Redirigiendo al inicio de sesi&oacute;n...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Verifica tu correo</h2>
          <p className={styles.subtitle}>
            Introduce el c&oacute;digo de 6 d&iacute;gitos que te hemos enviado.
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleConfirm}>
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
              <label className="sr-only" htmlFor="code">C&oacute;digo de verificaci&oacute;n</label>
              <input
                id="code"
                type="text"
                required
                className={`${styles.input} ${styles.codeInput}`}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Verificando...' : 'Confirmar Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className={styles.page}><span className={styles.loading}>Cargando...</span></div>}>
      <ConfirmForm />
    </Suspense>
  );
}
