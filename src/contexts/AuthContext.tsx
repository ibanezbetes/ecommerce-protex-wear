import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser, 
  confirmSignUp,
  confirmSignIn,
  fetchUserAttributes,
  type SignInInput,
  type SignUpInput,
} from 'aws-amplify/auth';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';
import '../amplify-setup'; // Initialize Amplify configuration

/**
 * Authentication Context for managing user state and authentication
 * Integrates with AWS Amplify Cognito for authentication
 */

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<{ needsConfirmation: boolean; email: string }>;
  confirmRegistration: (email: string, code: string) => Promise<void>;
  confirmNewPassword: (newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearPasswordChallenge: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'PASSWORD_CHALLENGE_REQUIRED'; payload: { challengeType: 'NEW_PASSWORD_REQUIRED' | 'FORCE_CHANGE_PASSWORD'; email: string } }
  | { type: 'PASSWORD_CHALLENGE_CLEARED' }
  | { type: 'CLEAR_ERROR' };

// Auth Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        passwordChallenge: undefined,
      };
    
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        passwordChallenge: undefined,
      };
    
    case 'AUTH_LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        passwordChallenge: undefined,
      };
    
    case 'PASSWORD_CHALLENGE_REQUIRED':
      return {
        ...state,
        isLoading: false,
        error: null,
        passwordChallenge: {
          isRequired: true,
          challengeType: action.payload.challengeType,
          email: action.payload.email,
        },
      };
    
    case 'PASSWORD_CHALLENGE_CLEARED':
      return {
        ...state,
        passwordChallenge: undefined,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
}

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading to check existing session
  error: null,
};

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    // Set a timeout to prevent hanging indefinitely
    const timeoutId = setTimeout(() => {
      console.log('🔄 Auth session check timeout, proceeding without authentication...');
      dispatch({ type: 'AUTH_LOGOUT' });
    }, 5000); // 5 second timeout

    checkExistingSession().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => clearTimeout(timeoutId);
  }, []);

  const checkExistingSession = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Check if Amplify Auth is properly configured
      const config = Amplify.getConfig();
      if (!config.Auth) {
        console.log('🔄 Amplify Auth not configured, skipping session check...');
        dispatch({ type: 'AUTH_LOGOUT' });
        return;
      }
      
      // Check if user is authenticated with Amplify
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        // Fetch user attributes to get profile information
        const attributes = await fetchUserAttributes();
        
        const user: User = {
          id: currentUser.userId,
          email: attributes.email || '',
          role: (attributes['custom:role'] as 'ADMIN' | 'CUSTOMER') || 'CUSTOMER',
          firstName: attributes.given_name || '',
          lastName: attributes.family_name || '',
          company: attributes['custom:company'] || undefined,
          phone: attributes.phone_number || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    } catch (error: any) {
      console.error('Session check failed:', error);
      
      // If Auth is not configured, force logout and clear any stored session
      if (error.name === 'AuthUserPoolException' || error.message?.includes('Auth UserPool not configured')) {
        console.log('🔄 Auth not configured, clearing stored session...');
        try {
          // Force clear any stored auth data
          await signOut({ global: true });
        } catch (signOutError) {
          console.log('SignOut failed, continuing with logout...');
        }
      }
      
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Sign in with Amplify
      const signInInput: SignInInput = {
        username: credentials.email,
        password: credentials.password,
      };
      
      const signInResult = await signIn(signInInput);
      
      // Check if sign in is complete or if there's a challenge
      if (signInResult.isSignedIn) {
        // User is fully signed in
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        
        const user: User = {
          id: currentUser.userId,
          email: attributes.email || credentials.email,
          role: (attributes['custom:role'] as 'ADMIN' | 'CUSTOMER') || 'CUSTOMER',
          firstName: attributes.given_name || '',
          lastName: attributes.family_name || '',
          company: attributes['custom:company'] || undefined,
          phone: attributes.phone_number || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else if (signInResult.nextStep) {
        // Handle sign-in challenges
        const { signInStep } = signInResult.nextStep;
        
        if (signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          // User needs to set a new password
          dispatch({ 
            type: 'PASSWORD_CHALLENGE_REQUIRED', 
            payload: { 
              challengeType: 'NEW_PASSWORD_REQUIRED',
              email: credentials.email 
            }
          });
        } else if (signInStep === 'FORCE_CHANGE_PASSWORD') {
          // User is forced to change password
          dispatch({ 
            type: 'PASSWORD_CHALLENGE_REQUIRED', 
            payload: { 
              challengeType: 'FORCE_CHANGE_PASSWORD',
              email: credentials.email 
            }
          });
        } else {
          throw new Error(`Challenge no soportado: ${signInStep}`);
        }
      } else {
        throw new Error('Error en el inicio de sesión');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Error de autenticación';
      
      // Handle specific Amplify Auth errors
      if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Credenciales incorrectas';
      } else if (error.name === 'UserNotConfirmedException') {
        errorMessage = 'Por favor, confirma tu cuenta antes de iniciar sesión';
      } else if (error.name === 'UserNotFoundException') {
        errorMessage = 'Usuario no encontrado';
      } else if (error.name === 'TooManyRequestsException') {
        errorMessage = 'Demasiados intentos. Inténtalo más tarde';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const register = async (data: RegisterData): Promise<{ needsConfirmation: boolean; email: string }> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Sign up with Amplify
      const signUpInput: SignUpInput = {
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            given_name: data.firstName,
            family_name: data.lastName,
            'custom:company': data.company || '',
            phone_number: data.phone || '',
          },
        },
      };
      
      const { isSignUpComplete, userId, nextStep } = await signUp(signUpInput);
      
      if (isSignUpComplete) {
        // User is automatically confirmed (via pre-signup trigger)
        // Get user information
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        
        const user: User = {
          id: userId || currentUser.userId,
          email: data.email,
          role: 'CUSTOMER', // Default role, will be set by post-confirmation trigger
          firstName: data.firstName,
          lastName: data.lastName,
          company: data.company,
          phone: data.phone,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
        return { needsConfirmation: false, email: data.email };
      } else {
        // User needs to confirm their account
        dispatch({ type: 'AUTH_LOGOUT' });
        return { needsConfirmation: true, email: data.email };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Error en el registro';
      
      // Handle specific Amplify Auth errors
      if (error.name === 'UsernameExistsException') {
        errorMessage = 'Ya existe una cuenta con este correo electrónico';
      } else if (error.name === 'InvalidPasswordException') {
        errorMessage = 'La contraseña no cumple con los requisitos de seguridad';
      } else if (error.name === 'InvalidParameterException') {
        errorMessage = 'Datos de registro inválidos';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const confirmRegistration = async (email: string, code: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Confirm sign up with verification code
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      
      // After confirmation, the user should sign in
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error: any) {
      console.error('Confirmation error:', error);
      let errorMessage = 'Error al confirmar la cuenta';
      
      if (error.name === 'CodeMismatchException') {
        errorMessage = 'Código de verificación incorrecto';
      } else if (error.name === 'ExpiredCodeException') {
        errorMessage = 'El código de verificación ha expirado';
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Usuario ya confirmado';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const confirmNewPassword = async (newPassword: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Confirm the new password with Amplify
      const confirmResult = await confirmSignIn({
        challengeResponse: newPassword,
      });
      
      if (confirmResult.isSignedIn) {
        // Password change successful, get user information
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        
        const user: User = {
          id: currentUser.userId,
          email: attributes.email || state.passwordChallenge?.email || '',
          role: (attributes['custom:role'] as 'ADMIN' | 'CUSTOMER') || 'CUSTOMER',
          firstName: attributes.given_name || '',
          lastName: attributes.family_name || '',
          company: attributes['custom:company'] || undefined,
          phone: attributes.phone_number || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        throw new Error('Error al confirmar la nueva contraseña');
      }
    } catch (error: any) {
      console.error('Confirm new password error:', error);
      let errorMessage = 'Error al cambiar la contraseña';
      
      if (error.name === 'InvalidPasswordException') {
        errorMessage = 'La contraseña no cumple con los requisitos de seguridad';
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage = 'No autorizado para cambiar la contraseña';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const clearPasswordChallenge = () => {
    dispatch({ type: 'PASSWORD_CHALLENGE_CLEARED' });
  };

  const logout = async () => {
    try {
      // Sign out with Amplify
      await signOut();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const refreshUser = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Get current user from Amplify
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      const user: User = {
        id: currentUser.userId,
        email: attributes.email || '',
        role: (attributes['custom:role'] as 'ADMIN' | 'CUSTOMER') || 'CUSTOMER',
        firstName: attributes.given_name || '',
        lastName: attributes.family_name || '',
        company: attributes['custom:company'] || undefined,
        phone: attributes.phone_number || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      console.error('User refresh error:', error);
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    confirmRegistration,
    confirmNewPassword,
    logout,
    refreshUser,
    clearPasswordChallenge,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hooks
export function useUser() {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function useIsAdmin() {
  const { user } = useAuth();
  return user?.role === 'ADMIN';
}