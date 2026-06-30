import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ============================================================================
 * useAuth — Store Global de Autenticación (Zustand)
 * ============================================================================
 *
 * Gestiona el estado de sesión del usuario en toda la aplicación.
 * Se integra con AWS Cognito a través de las páginas de Login/Register.
 *
 * Estados posibles:
 *   - Invitado:      user=null, isGuest=true  (acceso público con API Key)
 *   - Autenticado:   user={...}, isGuest=false (acceso con JWT de Cognito)
 *
 * El token JWT se almacena en `user.token` y es leído automáticamente
 * por `graphqlClient.ts` para autorizar las peticiones a AppSync.
 * ========================================================================= */

/** Datos del usuario autenticado */
interface User {
  /** Identificador único del usuario (Cognito sub) */
  id: string;
  /** Email del usuario */
  email: string;
  /** Nombre para mostrar */
  name: string;
  /** Si el usuario tiene permiso para pagar con factura (B2B) */
  can_pay_later: boolean;
  /** Rol del usuario (USER o ADMIN) */
  role?: string;
  /** JWT de Cognito (IdToken) para autorizar peticiones */
  token?: string;
  /** Precios especiales asignados por el admin */
  specialPrices?: Array<{ productId: string; specialPrice: number }>;
}

/** Estado y acciones del store de autenticación */
interface AuthState {
  /** Datos del usuario actual, null si es invitado */
  user: User | null;
  /** Indica si el usuario actual es un invitado (no autenticado) */
  isGuest: boolean;
  /** Establece la sesión de un usuario autenticado */
  setSession: (user: User) => void;
  /** Cierra la sesión del usuario y vuelve al estado de invitado */
  logout: () => void;
}

/**
 * Hook de Zustand para acceder al estado de autenticación.
 *
 * @example
 * ```tsx
 * const { user, isGuest, logout } = useAuth();
 *
 * // Acceder al estado fuera de un componente React:
 * const token = useAuth.getState().user?.token;
 * ```
 */
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isGuest: true,

      setSession: (userData: User) => set({ user: userData, isGuest: false }),

      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'protex_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        set({ user: null, isGuest: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
