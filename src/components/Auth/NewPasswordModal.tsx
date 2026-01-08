import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface NewPasswordModalProps {
  isOpen: boolean;
  email: string;
  challengeType: 'NEW_PASSWORD_REQUIRED' | 'FORCE_CHANGE_PASSWORD';
  onClose: () => void;
}

export default function NewPasswordModal({ isOpen, email, challengeType, onClose }: NewPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { confirmNewPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!newPassword) {
      setError('La nueva contraseña es obligatoria');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar requisitos de contraseña
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setError('La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial');
      return;
    }

    try {
      setIsLoading(true);
      await confirmNewPassword(newPassword);
      // El AuthContext manejará la redirección automáticamente
    } catch (error: any) {
      setError(error.message || 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const title = challengeType === 'NEW_PASSWORD_REQUIRED' 
    ? 'Establecer Nueva Contraseña' 
    : 'Cambiar Contraseña Obligatorio';

  const description = challengeType === 'NEW_PASSWORD_REQUIRED'
    ? 'Tu cuenta requiere que establezcas una nueva contraseña antes de continuar.'
    : 'Por motivos de seguridad, debes cambiar tu contraseña antes de acceder a tu cuenta.';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-sm text-gray-600">
              {description}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Usuario: <span className="font-medium">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nueva Contraseña */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa tu nueva contraseña"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirma tu nueva contraseña"
                disabled={isLoading}
              />
            </div>

            {/* Requisitos de Contraseña */}
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-xs font-medium text-gray-700 mb-2">Requisitos de contraseña:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center">
                  <span className={`mr-2 ${newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>
                    {newPassword.length >= 8 ? '✓' : '○'}
                  </span>
                  Mínimo 8 caracteres
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                    {/[A-Z]/.test(newPassword) ? '✓' : '○'}
                  </span>
                  Al menos 1 letra mayúscula
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${/[a-z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                    {/[a-z]/.test(newPassword) ? '✓' : '○'}
                  </span>
                  Al menos 1 letra minúscula
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${/\d/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                    {/\d/.test(newPassword) ? '✓' : '○'}
                  </span>
                  Al menos 1 número
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                    {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? '✓' : '○'}
                  </span>
                  Al menos 1 carácter especial
                </li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cambiando...
                  </span>
                ) : (
                  'Cambiar Contraseña'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}