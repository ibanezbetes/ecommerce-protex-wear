import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser, 
  confirmSignUp,
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
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
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
      };
    
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'AUTH_LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
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
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      
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
    } catch (error) {
      console.error('Session check failed:', error);
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
      
      const { isSignedIn } = await signIn(signInInput);
      
      if (isSignedIn) {
        // Get user information after successful sign in
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
    logout,
    refreshUser,
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