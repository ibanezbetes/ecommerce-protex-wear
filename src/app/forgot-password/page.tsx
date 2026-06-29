'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CognitoIdentityProviderClient, ForgotPasswordCommand, ConfirmForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const clientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID;
      if (!clientId) throw new Error('Configuración de Cognito incompleta');

      const client = new CognitoIdentityProviderClient({ region: 'eu-west-1' });
      const command = new ForgotPasswordCommand({
        ClientId: clientId,
        Username: email,
      });

      await client.send(command);
      setStep('confirm');
      setSuccess('Te hemos enviado un código al correo electrónico.');
    } catch (err: any) {
      setError(err.message || 'Error al solicitar el cambio de contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const clientId = process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID;
      if (!clientId) throw new Error('Configuración de Cognito incompleta');

      const client = new CognitoIdentityProviderClient({ region: 'eu-west-1' });
      const command = new ConfirmForgotPasswordCommand({
        ClientId: clientId,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
      });

      await client.send(command);
      setSuccess('Contraseña actualizada con éxito. Redirigiendo al login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Form */}
      <section className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 relative">
        <div className="absolute top-8 left-8 hidden sm:block">
          <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="md:hidden mb-10 flex justify-center">
            <Link href="/">
              <Image src="/logo.png" alt="Protex Wear" width={140} height={40} className="w-auto h-auto" priority />
            </Link>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Recuperar Contraseña</h2>
            <p className="text-gray-500 text-sm font-medium">
              {step === 'request' 
                ? 'Introduce tu correo para recibir un código de recuperación.'
                : 'Introduce el código enviado a tu correo y tu nueva contraseña.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
              {success}
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequestCode} className="space-y-5">
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

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {loading ? 'Enviando...' : 'Enviar Código'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleConfirmPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="code">Código de Verificación</label>
                <input
                  id="code"
                  type="text"
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:bg-white transition-all outline-none tracking-widest text-center"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="newPassword">Nueva Contraseña</label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Right Side - Visual */}
      <section className="hidden md:flex w-1/2 bg-gray-900 relative p-12 flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-indigo-900/80 mix-blend-multiply z-10" />
          <div 
            className="w-full h-full bg-cover bg-center opacity-50"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop')" }}
          />
        </div>

        <div className="relative z-20 max-w-lg mx-auto text-center">
          <Image src="/logo.png" alt="Protex Wear" width={200} height={60} className="brightness-0 invert mx-auto mb-8 w-auto h-auto" priority />
          <h2 className="text-3xl font-extrabold text-white mb-4">Seguridad B2B</h2>
          <p className="text-indigo-100 text-lg">
            Mantén el acceso a tus pedidos y facturación protegido en todo momento.
          </p>
        </div>
      </section>
    </div>
  );
}
