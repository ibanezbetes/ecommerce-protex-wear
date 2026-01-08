import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

interface ConfirmRegistrationProps {
  email: string;
  onConfirmed: () => void;
  onBack: () => void;
}

/**
 * Confirmation component for user registration
 * Handles email verification code input
 */
function ConfirmRegistration({ email, onConfirmed, onBack }: ConfirmRegistrationProps) {
  const { confirmRegistration, error } = useAuth();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      setLocalError('Por favor, introduce un código de 6 dígitos');
      return;
    }

    try {
      setIsSubmitting(true);
      setLocalError(null);
      
      await confirmRegistration(email, code);
      onConfirmed();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al confirmar la cuenta';
      setLocalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    if (localError) setLocalError(null);
  };

  const displayError = localError || error;

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Confirma tu Cuenta
        </h2>
        <p className="text-gray-600">
          Hemos enviado un código de verificación a
        </p>
        <p className="font-medium text-gray-900">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600">{displayError}</p>
            </div>
          </div>
        )}

        {/* Verification Code Input */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
            Código de Verificación
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder="123456"
            maxLength={6}
            className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent tracking-widest"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Introduce el código de 6 dígitos que recibiste por email
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || code.length !== 6}
          className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Confirmando...</span>
            </div>
          ) : (
            'Confirmar Cuenta'
          )}
        </button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            ¿No recibiste el código?
          </p>
          <button
            type="button"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            onClick={() => {
              // TODO: Implement resend confirmation code
              console.log('Resend code for:', email);
            }}
          >
            Reenviar Código
          </button>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center mx-auto"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al registro
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConfirmRegistration;