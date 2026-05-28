'use client';

import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import Link from 'next/link';

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
      if (!clientId) throw new Error("Falta configurar NEXT_PUBLIC_USER_POOL_CLIENT_ID en el .env.local");

      // Usar región eu-west-1 por defecto
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
        // Obtenemos los claims decodificando la segunda parte del JWT (solo lectura superficial)
        const base64Url = response.AuthenticationResult.IdToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const claims = JSON.parse(jsonPayload);

        // Actualizamos el estado global
        setSession({
          id: claims.sub,
          email: claims.email,
          name: claims.email.split('@')[0], // Fallback simple para el nombre
          can_pay_later: false, // Por defecto falso para B2C. El admin lo cambiará en la BBDD en el futuro.
          token: response.AuthenticationResult.IdToken, // Usaremos el IdToken para autorizar peticiones
        });

        router.push('/checkout');
      } else {
        throw new Error("No se recibió token de autenticación");
      }

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acceso Clientes B2B
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicia sesión con las credenciales que te proporcionó el administrador.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label className="sr-only">Email</label>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Dirección de email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="sr-only">Contraseña</label>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
