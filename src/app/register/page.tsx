'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<'B2B' | 'B2C'>('B2B');
  const [name, setName] = useState('');
  const [cif, setCif] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const validateDocument = (doc: string) => {
    const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    const nieRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    const cifRegex = /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/i;
    
    return nifRegex.test(doc) || nieRegex.test(doc) || cifRegex.test(doc);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!validateDocument(cif)) {
      setError('El CIF/NIF introducido no tiene un formato válido en España');
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
          { Name: 'name', Value: accountType === 'B2B' ? `${name} (B2B)` : name },
          // Store CIF in nickname or another standard attribute temporarily for MVP
          { Name: 'nickname', Value: cif },
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
    <div className="min-h-screen flex flex-col md:flex-row-reverse bg-white">
      {/* Right Side - Visual */}
      <section 
        className="hidden md:flex w-1/2 bg-gray-900 relative p-12 flex-col justify-between overflow-hidden" 
        aria-label="Registro Protex Wear"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/40 z-10" />
          <div 
            className="w-full h-full bg-cover bg-center opacity-40 transform scale-105 hover:scale-100 transition-transform duration-10000"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop')" }}
          />
        </div>

        <div className="relative z-20 flex justify-end">
          <Link href="/">
            <Image src="/logo.png" alt="Protex Wear" width={150} height={40} className="brightness-0 invert hover:opacity-80 transition-opacity w-auto h-auto" priority />
          </Link>
        </div>

        <div className="relative z-20 max-w-lg mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-wider mb-6">
            Cuenta Protex Wear
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            Todo tu equipamiento laboral, listo para pedir.
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed font-medium">
            Crea tu acceso y empieza a preparar compras de protección, vestuario y calzado profesional con una experiencia pensada para empresas.
          </p>
        </div>
      </section>

      {/* Left Side - Form */}
      <section className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 relative">
        <div className="absolute top-8 left-8 hidden sm:block">
          <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            Volver a inicio
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="md:hidden mb-10 flex justify-center">
            <Link href="/">
              <Image src="/logo.png" alt="Protex Wear" width={140} height={40} className="w-auto h-auto" priority />
            </Link>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Crea tu cuenta</h2>
            <p className="text-gray-500 text-sm font-medium">
              Regístrate para comprar más rápido y preparar tus pedidos profesionales.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* Account Type Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setAccountType('B2B')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                accountType === 'B2B' ? 'bg-white text-indigo-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Empresa / Autónomo
            </button>
            <button
              type="button"
              onClick={() => setAccountType('B2C')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                accountType === 'B2C' ? 'bg-white text-indigo-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Particular
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="name">
                {accountType === 'B2B' ? 'Razón Social' : 'Nombre Completo'}
              </label>
              <input
                id="name"
                type="text"
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:bg-white transition-all outline-none"
                placeholder={accountType === 'B2B' ? 'Ej. Construcciones Paco S.L.' : 'Ej. Juan Pérez'}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="cif">
                {accountType === 'B2B' ? 'CIF / NIF' : 'DNI / NIE'}
              </label>
              <input
                id="cif"
                type="text"
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:bg-white transition-all outline-none uppercase"
                placeholder={accountType === 'B2B' ? 'B12345678' : '12345678Z'}
                value={cif}
                onChange={(e) => setCif(e.target.value.toUpperCase())}
              />
            </div>
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
              <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="password">Contraseña</label>
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
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5" htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 focus:bg-white transition-all outline-none"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Procesando...
                  </>
                ) : (
                  'Registrarse'
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center text-sm font-medium text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4 decoration-2">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
