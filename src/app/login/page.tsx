'use client';

import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { CognitoIdentityProviderClient, InitiateAuthCommand, RespondToAuthChallengeCommand } from '@aws-sdk/client-cognito-identity-provider';
import Link from 'next/link';
import Image from 'next/image';

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

        // Obtener el rol del usuario desde DynamoDB
        try {
          const { userOperations } = await import('@/services/graphqlClient');
          const profile = await userOperations.getUserProfile();
          if (profile?.role) {
            useAuth.setState((state) => ({
              ...state,
              user: state.user ? { ...state.user, role: profile.role as string } : null
            }));
            document.cookie = `protex_role=${profile.role}; path=/; max-age=86400`;
          }
        } catch (e) {
          console.error("No se pudo obtener el rol del usuario", e);
        }

        router.push('/checkout');
      } else {
        throw new Error('No se recibi\u00f3 token de autenticaci\u00f3n');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);

      // MOCK FALLBACK SI AWS FALLA (DESARROLLO LOCAL)
      if (email === 'admin@protexwear.com' && password === 'Protex001') {
        console.warn('AWS Cognito falló. Usando sesión de Administrador simulada...');
        document.cookie = 'protex_role=ADMIN; path=/; max-age=86400';
        setSession({
          id: 'admin-mock-id',
          email: 'admin@protexwear.com',
          name: 'Admin',
          can_pay_later: true,
          token: 'mocked-jwt-token-para-desarrollo',
        });
        useAuth.setState((state) => ({
          ...state,
          user: { id: 'admin-mock-id', email: 'admin@protexwear.com', name: 'Admin', can_pay_later: true, token: 'mocked-jwt-token-para-desarrollo', role: 'ADMIN' }
        }));
        router.push('/admin');
        setLoading(false);
        return;
      }

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

        // Obtener el rol del usuario desde DynamoDB
        try {
          const { userOperations } = await import('@/services/graphqlClient');
          const profile = await userOperations.getUserProfile();
          if (profile?.role) {
            useAuth.setState((state) => ({
              ...state,
              user: state.user ? { ...state.user, role: profile.role as string } : null
            }));
            document.cookie = `protex_role=${profile.role}; path=/; max-age=86400`;
          }
        } catch (e) {
          console.error("No se pudo obtener el rol del usuario", e);
        }

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
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Visual */}
      <section 
        className="hidden md:flex w-1/2 bg-gray-900 relative p-12 flex-col justify-between overflow-hidden" 
        aria-label="Protex Wear profesional"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/90 z-10" />
          <div 
            className="w-full h-full bg-cover bg-center opacity-40 transform scale-105 hover:scale-100 transition-transform duration-10000"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop')" }}
          />
        </div>

        <div className="relative z-20">
          <Link href="/">
            <Image src="/logo.png" alt="Protex Wear" width={150} height={40} className="brightness-0 invert hover:opacity-80 transition-opacity" priority />
          </Link>
        </div>

        <div className="relative z-20 max-w-lg mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-wider mb-6">
            Acceso profesional
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            Protección para equipos que no paran.
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed font-medium">
            Accede a tus condiciones B2B, recupera pedidos y gestiona compras de equipamiento laboral con la misma seguridad que exiges en obra.
          </p>
        </div>
      </section>

      {/* Right Side - Form */}
      <section className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 relative">
        <div className="absolute top-8 right-8 hidden sm:block">
          <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            Volver a inicio
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="md:hidden mb-10 flex justify-center">
            <Link href="/">
              <Image src="/logo.png" alt="Protex Wear" width={140} height={40} priority />
            </Link>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              {requireNewPassword ? 'Actualizar Contraseña' : 'Acceso Clientes B2B'}
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              {requireNewPassword 
                ? 'Por seguridad, debes establecer una contraseña definitiva antes de continuar.'
                : 'Inicia sesión con las credenciales que te proporcionó el administrador.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {!requireNewPassword ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:bg-white transition-all outline-none"
                  placeholder="ejemplo@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-bold text-gray-700" htmlFor="password">Contraseña</label>
                  <Link href="/forgot-password" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-3.5 px-4 bg-gray-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-md transition-colors active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Verificando...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleNewPasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="newPassword">Nueva Contraseña</label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:bg-white transition-all outline-none"
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                />
                <p className="mt-2 text-xs text-gray-500 font-medium">
                  Debe contener al menos una mayúscula, un número y un símbolo.
                </p>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Actualizando...' : 'Guardar y Entrar'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-10 text-center text-sm font-medium text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-indigo-600 font-bold hover:underline underline-offset-4 decoration-2">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
