import { create } from 'zustand';
import { useAuth0 } from '@auth0/auth0-react';
import { authService } from '../services/auth/authService'; // Corrected path
import type { AuthUser } from '../types/auth'; // Corrected path
import { USE_MOCK_AUTH } from '../utils/mockAuth';

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
  const { user: auth0User, isAuthenticated: isAuth0Authenticated } = useAuth0();
  
  // Fonction pour mapper le rôle d'authentification au rôle de navigation
  const mapAuthRoleToUserRole = (authRole?: string) => {
    switch(authRole) {
      case 'admin':
        return 'customer_support';
      case 'user':
        return 'content_manager';
      case 'super_admin':
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
        // Valeur par défaut pour éviter les erreurs
        return 'customer_support';
    }
  };
  
  // Vérifier si un utilisateur Auth0 est présent et utilisable
  const auth0UserActive = isAuth0Authenticated && auth0User && !USE_MOCK_AUTH;
  
  // Obtenir le rôle à partir de Auth0 ou de notre système local
  const role = auth0UserActive 
    ? mapAuthRoleToUserRole(auth0User['https://api.wanzo.com/role'])
    : user?.role;
    
  // Déterminer si c'est un super admin
  const isSuperAdmin = role === 'super_admin';
  
  // Fonction pour vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (checkRole: string) => {
    if (isSuperAdmin) return true;
    return role === checkRole;
  };
  
  return {
    id: auth0UserActive ? auth0User?.sub : user?.id,
    email: auth0UserActive ? auth0User?.email : user?.email,
    name: auth0UserActive ? auth0User?.name : user?.name,
    picture: auth0UserActive ? auth0User?.picture : user?.picture,
    role,
    isSuperAdmin,
    hasRole
  };
}