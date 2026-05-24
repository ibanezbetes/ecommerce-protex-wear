import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  can_pay_later: boolean;
  token?: string;
}

interface AuthState {
  user: User | null;
  isGuest: boolean;
  setSession: (user: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null, // Por defecto no hay usuario
  isGuest: true,

  // Función para establecer la sesión real de Cognito
  setSession: (userData: User) => set({ user: userData, isGuest: false }),

  // Logout limpia la sesión local (no invalida el token remoto por simplicidad, aunque se podría)
  logout: () => set({ user: null, isGuest: true }),
}));
