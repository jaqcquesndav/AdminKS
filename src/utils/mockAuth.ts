import { AuthUser, AuthState, AuthResponse } from '../types/auth';

// Plusieurs utilisateurs de démonstration avec différents rôles
export const demoUsers: Record<string, AuthUser> = {
  superAdmin: {
    id: 'demo-super-admin-123',
    email: 'super-admin@example.com',
    name: 'Super Admin Demo',
    picture: 'https://via.placeholder.com/150?text=SA',
    role: 'super_admin',
    userType: 'internal',
  },
  cto: {
    id: 'demo-cto-123',
    email: 'cto@example.com',
    name: 'CTO Demo',
    picture: 'https://via.placeholder.com/150?text=CTO',
    role: 'cto',
    userType: 'internal',
  },
  finance: {
    id: 'demo-finance-123',
    email: 'finance@example.com',
    name: 'Finance Demo',
    picture: 'https://via.placeholder.com/150?text=FIN',
    role: 'growth_finance',
    userType: 'internal',
  },
  support: {
    id: 'demo-support-123',
    email: 'support@example.com',
    name: 'Support Demo',
    picture: 'https://via.placeholder.com/150?text=SUP',
    role: 'customer_support',
    userType: 'internal',
  }
};

// Utilisateur de démonstration par défaut (pour la rétrocompatibilité)
export const demoUser: AuthUser = demoUsers.superAdmin;

// Token JWT simulés (non valides pour la production)
const DEMO_TOKENS = {
  superAdmin: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXN1cGVyLWFkbWluLTEyMyIsIm5hbWUiOiJTdXBlciBBZG1pbiBEZW1vIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  cto: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLWN0by0xMjMiLCJuYW1lIjoiQ1RPIERlbW8iLCJyb2xlIjoiY3RvIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  finance: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLWZpbmFuY2UtMTIzIiwibmFtZSI6IkZpbmFuY2UgRGVtbyIsInJvbGUiOiJncm93dGhfZmluYW5jZSIsImlhdCI6MTUxNjIzOTAyMn0',
  support: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXN1cHBvcnQtMTIzIiwibmFtZSI6IlN1cHBvcnQgRGVtbyIsInJvbGUiOiJjdXN0b21lcl9zdXBwb3J0IiwiaWF0IjoxNTE2MjM5MDIyfQ'
};

// Constante pour activer/désactiver facilement le mode démo
export const USE_MOCK_AUTH = true;

// Nouvelle constante pour contrôler l'auto-connexion - Activée pour résoudre le problème de connexion des comptes démo
export const AUTO_LOGIN = true;

// Nouvelle constante pour détecter le mode démo basé sur les emails spéciaux
export const isDemoEmail = (email: string): boolean => {
  return Object.values(demoUsers).some(user => user.email === email) ||
         email.endsWith('@example.com') || 
         email.includes('demo') || 
         email === 'admin@kiota-suite.com';
};

// Stocker l'utilisateur sélectionné dans le localStorage pour maintenir la session
const SELECTED_DEMO_USER_KEY = 'selected_demo_user_role';

// Obtenir le rôle utilisateur sélectionné ou utiliser superAdmin par défaut
export const getSelectedDemoUserRole = (): string => {
  return localStorage.getItem(SELECTED_DEMO_USER_KEY) || 'superAdmin';
};

// Définir l'utilisateur de démo sélectionné
export const setSelectedDemoUserRole = (role: string): void => {
  localStorage.setItem(SELECTED_DEMO_USER_KEY, role);
};

// Obtenir les informations de l'utilisateur de démo actuellement sélectionné
export const getCurrentDemoUser = (): AuthUser => {
  const role = getSelectedDemoUserRole();
  return demoUsers[role as keyof typeof demoUsers] || demoUsers.superAdmin;
};

// Obtenir le token de l'utilisateur de démo actuellement sélectionné
export const getCurrentDemoToken = (): string => {
  const role = getSelectedDemoUserRole();
  return DEMO_TOKENS[role as keyof typeof DEMO_TOKENS] || DEMO_TOKENS.superAdmin;
};

// Fonction de connexion simulée
export const mockLogin = async (credentials: { username: string, password: string }): Promise<AuthResponse> => {
  console.log('Tentative de connexion avec:', credentials.username);
  
  // Simuler le besoin d'authentification à deux facteurs (pour tester cette fonctionnalité)
  // Si le nom d'utilisateur contient "2fa", simuler une réponse avec 2FA
  if (credentials.username.toLowerCase().includes('2fa')) {
    console.log('Authentification à deux facteurs requise pour:', credentials.username);
    return {
      requiresTwoFactor: true,
      twoFactorMethods: ['email', 'sms'],
      tempToken: 'temp-token-for-2fa-verification',
      token: '', // Pas de token valide avant vérification 2FA
      user: {
        id: '',
        name: ''
      }
    };
  }
  
  // Vérifier si le nom d'utilisateur correspond à un utilisateur de démo
  if (credentials.username) {
    const matchingRole = Object.entries(demoUsers).find(
      ([, user]) => user.email === credentials.username
    )?.[0];
    
    if (matchingRole) {
      setSelectedDemoUserRole(matchingRole);
      console.log(`Connecté en tant que ${matchingRole} avec email: ${credentials.username}`);
    } else {
      // Si pas de correspondance exacte mais un username a été fourni, essayons de trouver une correspondance partielle
      const lowerUsername = credentials.username.toLowerCase();
      for (const [role, user] of Object.entries(demoUsers)) {
        if (user.email.toLowerCase().includes(lowerUsername.split('@')[0])) {
          setSelectedDemoUserRole(role);
          console.log(`Connecté en tant que ${role} avec correspondance partielle pour: ${credentials.username}`);
          break;
        }
      }
    }
  }
  
  // Obtenir l'utilisateur sélectionné
  const selectedUser = getCurrentDemoUser();
  const selectedToken = getCurrentDemoToken();
  
  // Simuler un délai réseau pour une expérience plus réaliste
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    token: selectedToken,
    user: {
      id: selectedUser.id,
      name: selectedUser.name
    }
  };
};

// Fonction pour obtenir l'état d'authentification initial
export const getInitialAuthState = (): AuthState => {
  // Vérifier si l'utilisateur est déjà authentifié dans le localStorage
  const authData = localStorage.getItem('auth-storage');
  if (authData) {
    try {
      const { state } = JSON.parse(authData);
      if (state && state.isAuthenticated) {
        const selectedUser = getCurrentDemoUser();
        const selectedToken = getCurrentDemoToken();
        return {
          user: selectedUser,
          token: selectedToken,
          isAuthenticated: true
        };
      }
    } catch (e) {
      console.error('Erreur lors de la lecture de l\'état d\'authentification:', e);
    }
  }
  
  // Si AUTO_LOGIN est activé, retourner un utilisateur connecté automatiquement
  if (AUTO_LOGIN) {
    const selectedUser = getCurrentDemoUser();
    const selectedToken = getCurrentDemoToken();
    return {
      user: selectedUser,
      token: selectedToken,
      isAuthenticated: true
    };
  }
  
  // Par défaut, retourner non authentifié
  return {
    user: null,
    token: null,
    isAuthenticated: false
  };
};

// Fonction de déconnexion simulée
export const mockLogout = async (): Promise<void> => {
  console.log('Déconnexion de l\'utilisateur démo');
  
  // Nettoyer les données de session stockées
  localStorage.removeItem(SELECTED_DEMO_USER_KEY);
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  
  await new Promise(resolve => setTimeout(resolve, 300));
};

// Fonctions supplémentaires pour simuler d'autres aspects de l'auth
export const mockVerifyTwoFactor = async (code: string): Promise<AuthResponse> => {
  console.log('Vérification 2FA simulée avec code:', code);
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const selectedUser = getCurrentDemoUser();
  const selectedToken = getCurrentDemoToken();
  
  return {
    token: selectedToken,
    user: {
      id: selectedUser.id,
      name: selectedUser.name
    }
  };
};

export const mockRefreshToken = async (): Promise<AuthResponse> => {
  console.log('Rafraîchissement de token simulé');
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const selectedUser = getCurrentDemoUser();
  const selectedToken = getCurrentDemoToken();
  
  return {
    token: selectedToken,
    user: {
      id: selectedUser.id,
      name: selectedUser.name
    }
  };
};