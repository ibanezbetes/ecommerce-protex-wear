import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ConfirmRegistration from '../components/Auth/ConfirmRegistration';
import logo from '../assets/logo.png';
import loginImage from '../assets/hero_corporate_building_blue.png';
import '../styles/LoginPage.css'; // Reusing the same styles

/**
 * Register Page - User registration with email confirmation
 */
function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading, error } = useAuth();

  const [currentStep, setCurrentStep] = useState<'register' | 'confirm'>('register');
  const [pendingEmail, setPendingEmail] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Formato de correo electrónico inválido';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      errors.password = 'La contraseña debe contener mayúsculas, minúsculas, números y símbolos';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Name validation
    if (!formData.firstName) {
      errors.firstName = 'El nombre es obligatorio';
    }
    if (!formData.lastName) {
      errors.lastName = 'Los apellidos son obligatorios';
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone && !/^[+]?[\d\s\-\(\)]{9,}$/.test(formData.phone)) {
      errors.phone = 'Formato de teléfono inválido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company || undefined,
        phone: formData.phone || undefined,
      });

      if (result.needsConfirmation) {
        // User needs to confirm their email
        setPendingEmail(result.email);
        setCurrentStep('confirm');
      } else {
        // User is automatically signed in (auto-confirmation enabled)
        // Navigation will be handled by useEffect when isAuthenticated changes
      }
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationComplete = () => {
    // After successful confirmation, redirect to login
    navigate('/login', {
      state: {
        message: 'Cuenta confirmada exitosamente. Por favor, inicia sesión.',
        email: pendingEmail
      }
    });
  };

  const handleBackToRegister = () => {
    setCurrentStep('register');
    setPendingEmail('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verificando sesión..." />
      </div>
    );
  }

  // Show confirmation step if needed
  if (currentStep === 'confirm') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <ConfirmRegistration
          email={pendingEmail}
          onConfirmed={handleConfirmationComplete}
          onBack={handleBackToRegister}
        />
      </div>
    );
  }

  return (
    <div className="login-page">
      {/* Left Side - Image */}
      <div className="login-image-section">
        <img src={loginImage} alt="Protex Wear Office" />
        <div className="login-image-overlay"></div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="login-form-section">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <Link to="/">
              <img src={logo} alt="Protex Wear" className="login-logo" />
            </Link>
            <h2 className="login-title">
              Crear Cuenta
            </h2>
            <p className="login-subtitle">
              Únete a Protex Wear y accede a nuestro catálogo B2B
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="alert alert-error mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label htmlFor="firstName" className="form-label">
                    Nombre *
                  </label>
                  <div className="form-input-container">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.firstName ? 'has-error' : ''
                        }`}
                      placeholder="Juan"
                    />
                  </div>
                  {formErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>
                  )}
                </div>

                <div className="form-group mb-0">
                  <label htmlFor="lastName" className="form-label">
                    Apellidos *
                  </label>
                  <div className="form-input-container">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.lastName ? 'has-error' : ''
                        }`}
                      placeholder="Pérez"
                    />
                  </div>
                  {formErrors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Correo Electrónico *
                </label>
                <div className="form-input-container">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.email ? 'has-error' : ''
                      }`}
                    placeholder="juan@empresa.com"
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
                )}
              </div>

              {/* Company Field */}
              <div className="form-group">
                <label htmlFor="company" className="form-label">
                  Empresa
                </label>
                <div className="form-input-container">
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Teléfono
                </label>
                <div className="form-input-container">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.phone ? 'has-error' : ''
                      }`}
                    placeholder="+34 600 123 456"
                  />
                </div>
                {formErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.phone}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Contraseña *
                </label>
                <div className="form-input-container">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.password ? 'has-error' : ''
                      }`}
                    placeholder="Mínimo 8 caracteres"
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Debe contener mayúsculas, minúsculas, números y símbolos
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmar Contraseña *
                </label>
                <div className="form-input-container">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors.confirmPassword ? 'has-error' : ''
                      }`}
                    placeholder="Repite tu contraseña"
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="login-options flex-start">
              <div className="remember-me">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                />
                <label htmlFor="terms" style={{ cursor: 'pointer', fontSize: '0.875rem' }}>
                  Acepto los{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">
                    términos y condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">
                    política de privacidad
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-login-submit"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Creando cuenta...</span>
                </>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="register-link-container">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="register-link-text"
            >
              Inicia sesión aquí
            </Link>
          </div>

          {/* Back to Home */}
          <div className="back-home-container">
            <Link
              to="/"
              className="back-home-link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;