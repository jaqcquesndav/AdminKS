import { create } from 'zustand';
import { authService } from '../services/authService';
import type { AuthUser } from '../types/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
  getUserInfo: () => {
    id: string;
    email: string;
    name: string;
    picture?: string;
    role: string;
  } | null;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    authService.logout();
  },
  updateUser: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null
  })),
  getUserInfo: () => {
    const state = get();
    return state.user ? {
      id: state.user.id,
      email: state.user.email,
      name: state.user.name,
      picture: state.user.picture,
      role: state.user.role
    } : null;
  }
}));

// Hook utilitaire pour accéder rapidement aux informations de l'utilisateur
export function useUserInfo() {
  const { user } = useAuth();
  
  // Fonction pour mapper le rôle d'authentification au rôle de navigation
  const mapAuthRoleToUserRole = (authRole?: string) => {
    switch(authRole) {
      case 'admin':
      case 'superadmin':
        return 'super_admin';
      case 'cto':
        return 'cto';
      case 'growth_finance':
        return 'growth_finance';
      case 'customer_support':
        return 'customer_support';
      case 'content_manager':
        return 'content_manager';
      default:
        // Si le rôle est déjà un UserRole connu, le retourner tel quel
        if(['super_admin', 'cto', 'growth_finance', 'customer_support', 'content_manager'].includes(authRole || '')) {
          return authRole;
        }
        // Valeur par défaut pour éviter les erreurs
        return 'customer_support';
    }
  };

  const mappedRole = mapAuthRoleToUserRole(user?.role);
  
  return {
    id: user?.id,
    email: user?.email,
    name: user?.name,
    picture: user?.picture,
    role: mappedRole,
    // Fonctions utilitaires pour vérifier les rôles
    isSuperAdmin: mappedRole === 'super_admin',
    hasRole: (requiredRole: string) => {
      return mappedRole === requiredRole || mappedRole === 'super_admin';
    }
  };
}