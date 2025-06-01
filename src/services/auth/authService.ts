import { mockLogin, mockLogout, USE_MOCK_AUTH, AUTO_LOGIN, getInitialAuthState, isDemoEmail, getCurrentDemoUser, getCurrentDemoToken } from '../../utils/mockAuth';
import apiClient from '../api/client';
import type { User, UserRole } from '../../types/user';
import type { AuthUser, AuthResponseBase, AuthResponseExtended, AuthState } from '../../types/auth';

// Fonction de conversion des rôles d'utilisateur
function convertUserRoleToAuthRole(role: UserRole | string): AuthUser['role'] {
  // Mapping des rôles internes vers les rôles de l'API d'authentification
  switch (role) {
    case 'super_admin':
      return 'super_admin';
    case 'customer_support':
      return 'customer_support';
    case 'growth_finance':
      return 'growth_finance';
    case 'cto':
      return 'cto';
    case 'content_manager':
      return 'content_manager';
    default:
      // Si le rôle n'est pas reconnu, par défaut, retourner 'user'
      return 'user';
  }
}

// Fonction de conversion inverse pour les rôles
function convertAuthRoleToUserRole(role: string): UserRole {
  switch (role) {
    case 'superadmin':
      return 'super_admin';
    case 'customer_support':
      return 'customer_support';
    case 'growth_finance':
      return 'growth_finance';
    case 'cto':
      return 'cto';
    case 'content_manager':
      return 'content_manager';
    case 'admin':
      return 'customer_support'; // Map admin to customer_support as fallback
    default:
      // Si le rôle n'est pas reconnu, assumer un rôle par défaut
      return 'customer_support';
  }
}

class AuthService {
  private storageKey: string = 'auth-storage';
  private cachedAuthState: AuthState | null = null;
  
  // Initialiser le service d'authentification
  initialize(): void {
    console.log('Initializing auth service...');
    // Vérifier si l'authentification existante est valide dans localStorage
    const authData = localStorage.getItem(this.storageKey);
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state && state.isAuthenticated && state.user && state.token) {
          // Valider que le token est encore valide (peut être expiré)
          const tokenExpired = this.isTokenExpired(state.token);
          
          if (tokenExpired) {
            console.warn('Token expired, cleaning up session');
            this.clearSession();
            return;
          }
          
          // Mettre en cache l'état d'authentification pour les futures vérifications
          this.cachedAuthState = {
            user: state.user as AuthUser,
            token: state.token,
            isAuthenticated: true
          };
          console.log('User authenticated from stored session');
          return; // Authentifié, ne rien faire de plus
        } else {
          console.log('Invalid stored auth state, clearing session');
          this.clearSession(); // Nettoyer la session si elle est invalide
        }
      } catch (e) {
        console.error('Error parsing auth data:', e);
        this.clearSession(); // Nettoyer en cas d'erreur
      }
    } else {
      console.log('No stored auth data found');
    }
    
    // Si le mode mock est activé mais pas de session active
    if (USE_MOCK_AUTH) {
      // Seulement si AUTO_LOGIN est activé, initialiser avec l'utilisateur de démo
      if (AUTO_LOGIN) {
        console.log('AUTO_LOGIN is enabled, initializing mock auth');
        this.initializeMockAuth();
      } else {
        console.log('AUTO_LOGIN is disabled, skipping mock auth initialization');
      }
    }
  }
  
  // Nouvelle méthode pour nettoyer la session
  private clearSession(): void {
    this.cachedAuthState = null;
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
  
  // Vérifier si un token est expiré (simple vérification basique)
  private isTokenExpired(token: string): boolean {
    try {
      // Si c'est un JWT, on peut vérifier l'expiration
      const base64Url = token.split('.')[1];
      if (!base64Url) return true; // Si ce n'est pas un JWT valide, considérer comme expiré
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const { exp } = JSON.parse(jsonPayload);
      if (!exp) return false; // Si pas de date d'expiration, considérer comme valide
      
      return Date.now() >= exp * 1000;
    } catch (e) {
      console.error('Error checking token expiration:', e);
      return false; // En cas d'erreur, on considère que le token est valide
    }
  }
  
  // Initialiser avec l'utilisateur de démo
  private initializeMockAuth(): void {
    const initialState = getInitialAuthState();
    
    if (initialState.isAuthenticated && initialState.user && initialState.token) {
      // Conversion de l'utilisateur de démo en utilisateur complet
      const fullUser = this.convertToFullUser(initialState.user);
      
      // Mettre à jour le cache avec l'utilisateur complet
      this.cachedAuthState = {
        user: initialState.user,
        token: initialState.token,
        isAuthenticated: true
      };
      
      // Stockage explicite du token pour les fonctions qui le recherchent
      localStorage.setItem('auth_token', initialState.token);
      
      // Mise à jour du localStorage avec l'état complet
      localStorage.setItem(this.storageKey, JSON.stringify({
        state: {
          user: initialState.user,
          token: initialState.token,
          isAuthenticated: true
        }
      }));
      
      console.log('Mock auth initialized with user:', fullUser.name, 'role:', fullUser.role);
    } else {
      console.warn('Auto-login enabled but no valid demo user was found.');
    }
  }
  
  // Convertir un AuthUser basique en utilisateur complet
  private convertToFullUser(authUser: AuthUser): User {
    // Transformation en structure User complète
    return {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: convertAuthRoleToUserRole(authUser.role),
      status: 'active',
      createdAt: new Date().toISOString(),
      permissions: [], // Les permissions devraient idéalement être basées sur le rôle
      avatar: authUser.picture
    };
  }
  
  // Vérifier si un email est celui d'un compte de démonstration
  private isUsingMockAuth(email?: string): boolean {
    if (!USE_MOCK_AUTH) return false;
    if (!email) return AUTO_LOGIN; // Si pas d'email, utiliser le paramètre global
    
    return isDemoEmail(email);
  }
  
  // Connexion d'un utilisateur
  async login(email: string, password: string): Promise<AuthResponseExtended> {
    try {
      // Utiliser l'authentification simulée pour les utilisateurs de démo
      if (this.isUsingMockAuth(email)) {
        const response = await mockLogin({ username: email, password });
        return this.convertAuthResponse(response);
      }
      
      // Authentification réelle pour les utilisateurs normaux
      const response = await apiClient.post('/auth/login', { email, password });
      return this.convertAuthResponse(response.data);
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }
  // Adapter la réponse d'authentification de base à notre format étendu
  private convertAuthResponse(response: AuthResponseBase): AuthResponseExtended {    // Si la réponse indique que l'authentification à deux facteurs est requise, 
    // transmettre simplement les informations sans conversion supplémentaire
    if (response.requiresTwoFactor) {
      return {
        ...response,
        user: {} as User, // On n'a pas encore les données complètes de l'utilisateur
      };
    }
    
    // En mode mock, récupérer les données complètes de l'utilisateur de démo
    if (USE_MOCK_AUTH && response.user && (!response.user.email || isDemoEmail(response.user.email))) {
      const demoUser = getCurrentDemoUser();
      
      // Créer une version User complète en utilisant les données de démo
      const fullUser: User = {
        id: response.user.id || demoUser.id,
        name: response.user.name || demoUser.name,
        email: demoUser.email || '',
        role: convertAuthRoleToUserRole(demoUser.role || 'superadmin'),
        status: 'active',
        createdAt: new Date().toISOString(),
        permissions: [],
        avatar: demoUser.picture
      };
      
      return {
        ...response,
        user: fullUser
      };
    }
    
    // Pour l'authentification normale
    const authRole = typeof response.user?.role === 'string' ? response.user.role : 'user';
    const fullUser: User = {
      id: response.user.id,
      name: response.user.name,
      email: response.user?.email || '',
      role: convertAuthRoleToUserRole(authRole),
      status: 'active',
      createdAt: new Date().toISOString(),
      permissions: [],
      avatar: response.user?.picture
    };
    
    return {
      ...response,
      user: fullUser
    };
  }
  
  // Enregistrement d'un nouvel utilisateur
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponseExtended> {
    try {
      // Utiliser l'authentification simulée pour les utilisateurs de démo
      if (this.isUsingMockAuth(userData.email)) {
        // Simuler un enregistrement réussi
        const response = await mockLogin({ username: userData.email, password: userData.password });
        return this.convertAuthResponse(response);
      }
      
      // Enregistrement réel pour les utilisateurs normaux
      const response = await apiClient.post('/auth/register', userData);
      return this.convertAuthResponse(response.data);
    } catch (error) {
      console.error('Erreur d\'enregistrement:', error);
      throw error;
    }
  }
  
  // Déconnexion de l'utilisateur
  async logout(): Promise<void> {
    try {
      // Si nous utilisons un utilisateur de démo
      if (USE_MOCK_AUTH && this.cachedAuthState?.user) {
        const user = this.cachedAuthState.user;
        if (user.email && isDemoEmail(user.email)) {
          await mockLogout();
          this.cachedAuthState = null;
          localStorage.removeItem(this.storageKey);
          localStorage.removeItem('auth_token');
          return;
        }
      }
      
      // Déconnexion réelle pour les utilisateurs normaux
      await apiClient.post('/auth/logout');
      
      // Nettoyer les données locales
      this.cachedAuthState = null;
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  }
  
  // Récupérer l'utilisateur stocké
  getStoredUser(): AuthUser | null {
    // Utiliser le cache si disponible
    if (this.cachedAuthState && this.cachedAuthState.user) {
      return this.cachedAuthState.user;
    }
    
    // Si le mode mock est activé, retourner l'utilisateur de démo
    if (USE_MOCK_AUTH && AUTO_LOGIN) {
      return getCurrentDemoUser();
    }

    const authData = localStorage.getItem(this.storageKey);
    if (!authData) {
      return null;
    }

    try {
      const { state } = JSON.parse(authData);
      if (!state || !state.user) {
        return null;
      }

      // Conversion du rôle si nécessaire
      const userRole = state.user.role;
      const role: AuthUser['role'] = 
        typeof userRole === 'string' ? 
        (convertUserRoleToAuthRole(userRole) as AuthUser['role']) : 
        'user';

      return {
        id: state.user.id,
        name: state.user.name,
        email: state.user.email,
        role,
        picture: state.user.avatar || state.user.picture
      };
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }
  
  // Récupérer le token stocké
  getToken(): string | null {
    // Utiliser le cache si disponible
    if (this.cachedAuthState && this.cachedAuthState.token) {
      return this.cachedAuthState.token;
    }
    
    // Si le mode mock est activé et l'utilisateur a une session active
    if (USE_MOCK_AUTH && this.getStoredUser()) {
      return getCurrentDemoToken();
    }
    
    // Essayer de récupérer depuis localStorage
    try {
      const authData = localStorage.getItem(this.storageKey);
      if (!authData) {
        return null;
      }
      
      const { state } = JSON.parse(authData);
      return state && state.token ? state.token : null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }
  
  // Restaurer la session utilisateur depuis le localStorage
  restoreSession(): {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
  } {
    // Utiliser le cache si disponible
    if (this.cachedAuthState) {
      return this.cachedAuthState;
    }
    
    // Si le mode mock est activé, récupérer l'utilisateur de démo
    if (USE_MOCK_AUTH && AUTO_LOGIN) {
      const initialState = getInitialAuthState();
      if (initialState.isAuthenticated) {
        return {
          user: initialState.user,
          token: initialState.token,
          isAuthenticated: true
        };
      }
    }
    
    // Essayer de récupérer depuis localStorage
    try {
      const authData = localStorage.getItem(this.storageKey);
      if (!authData) {
        return { user: null, token: null, isAuthenticated: false };
      }
      
      const { state } = JSON.parse(authData);
      if (!state || !state.isAuthenticated || !state.user || !state.token) {
        return { user: null, token: null, isAuthenticated: false };
      }
      
      // Conversion du rôle si nécessaire
      const userRole = state.user.role;
      const role: AuthUser['role'] = 
        typeof userRole === 'string' ? 
        (convertUserRoleToAuthRole(userRole) as AuthUser['role']) : 
        'user';
      
      // Convertir l'utilisateur stocké au format AuthUser
      const authUser: AuthUser = {
        id: state.user.id,
        name: state.user.name,
        email: state.user.email,
        role,
        picture: state.user.avatar || state.user.picture
      };
      
      return {
        user: authUser,
        token: state.token,
        isAuthenticated: true
      };
    } catch (error) {
      console.error('Error restoring session:', error);
      return { user: null, token: null, isAuthenticated: false };
    }
  }
  
  // Vérifier si un utilisateur est authentifié
  isAuthenticated(): boolean {
    console.log('Checking authentication status...');
    
    // Récupérer les informations d'authentification
    const token = this.getToken();
    const user = this.getStoredUser();
    
    // Vérifier que le token et l'utilisateur sont présents
    if (!token || !user) {
      console.log('Authentication failed: Missing token or user data');
      return false;
    }
    
    // Vérifier si le token est expiré
    if (this.isTokenExpired(token)) {
      console.log('Authentication failed: Token is expired');
      this.clearSession();
      return false;
    }
    
    // Tout est valide, l'utilisateur est authentifié
    console.log('User is authenticated', user.name);
    
    // Mettre à jour le cache pour optimiser les futures vérifications
    this.cachedAuthState = {
      user,
      token,
      isAuthenticated: true
    };
    
    return true;
  }
  
  // Actualiser le token d'authentification
  async refreshToken(): Promise<string | null> {
    try {
      if (USE_MOCK_AUTH) {
        // Si nous utilisons le mode démo, simuler le rafraîchissement du token
        const response = await mockRefreshToken();
        
        // Mettre à jour le cache et le stockage local
        this.cachedAuthState = {
          user: getCurrentDemoUser(),
          token: response.token,
          isAuthenticated: true
        };
        
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem(this.storageKey, JSON.stringify({
          state: {
            user: getCurrentDemoUser(),
            token: response.token,
            isAuthenticated: true
          }
        }));
        
        return response.token;
      }
      
      // Utiliser un endpoint d'API pour rafraîchir le token
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        return null;
      }
      
      const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
      const { token, refreshToken: newRefreshToken } = response.data;
      
      // Mettre à jour les tokens en cache et stockage local
      if (this.cachedAuthState) {
        this.cachedAuthState.token = token;
      }
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', newRefreshToken);
      
      // Mettre à jour le stockage avec le nouvel état
      const currentState = this.restoreSession();
      if (currentState.isAuthenticated && currentState.user) {
        localStorage.setItem(this.storageKey, JSON.stringify({
          state: {
            ...currentState,
            token
          }
        }));
      }
      
      return token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  // Vérifier le code d'authentification à deux facteurs
  async verifyTwoFactor(code: string, method: 'email' | 'sms' = 'email'): Promise<AuthResponseExtended> {
    try {
      // Utiliser l'authentification simulée pour le mode démo
      if (USE_MOCK_AUTH) {
        // Simuler une vérification réussie après un délai
        console.log('Simulation de vérification 2FA avec code:', code);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockResponse = {
          token: getCurrentDemoToken(),
          user: getCurrentDemoUser()
        };
        
        return this.convertAuthResponse(mockResponse);
      }
      
      // Vérification réelle pour les utilisateurs normaux
      const response = await apiClient.post('/auth/2fa/verify', { 
        code, 
        method 
      });
      
      return this.convertAuthResponse(response.data);
    } catch (error) {
      console.error('Erreur lors de la vérification 2FA:', error);
      throw error;
    }
  }
  
  // Configuration de l'authentification à deux facteurs
  async setupTwoFactor(): Promise<{
    qrCode: string;
    secret: string;
  }> {
    try {
      // En mode démo, simuler une réponse
      if (USE_MOCK_AUTH) {
        // Simuler un délai de traitement
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nO3dQY4bMRAFQdqY+59Z9i0GjC2ZEFXrH/FxJbfTj9fr9QOY82f7BwDbBABiBABiBABiBABiBABiBABiBABiBABi/l7+4OM49v4P8I9Xy9t0AYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYCYy3uAT9bzge3Jw/RdxfT/v3lPstkv+vYdwiVdACBGACBGACBGACBGACBGACBGACBGACBGACBGACBmfQ/waXqSsHkPsGn6Hd38/NzoBQExAgAxAgAxAgAxAgAxAgAxAgAxAgAxAgAxAgAx3+4B3jZ9nzC9R7hxQjH9jrZ7uTe6AECMAECMAECMAECMAECMAECMAECMAECMAECMAEDMw/YAb5vTh80TiukThM1TiG/3crt0AYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYAYCYavcA06YnCdO7hRu9o80+M10AIEYAIEYAIEYAIEYAIEYAIEYAIEYAIEYAIEYAIGZkD3Dj5GH6rmL6HmB697C5W7jRy+3SBQBiBABiBABiBABiBABiBABiBABiBABiBABiBABiRvYA05OH6buK6XuATdOnENNnJF7uf3QBgBgBgBgBgBgBgBgBgBgBgBgBgBgBgBgBgBgBgJiRPcCNk4cbu4XpXcWNfcX0Pcnm5+dGFwCIEQCIEQCIEQCIEQCIEQCIEQCIEQCIEQCIEQCIGdkDTE8DNncL07uK6T3Ct3vJ7+gCADECADECADECADECADECADECADECADECADECADEje4Dp04PNycP0PcD0KcT0PuHGXmeTLgAQIwAQIwAQIwAQIwAQIwAQIwAQIwAQIwAQIwAQ87A9wKbpaczmruLGCcWNE5Ibpzab7xAu6QIAMQIAMQIAMQIAMQIAMQIAMQIAMQIAMQIAMQIAMSN7gE/T9wDTJw83/r7N3cL0Pcnm5+dGFwCIEQCIEQCIEQCIEQCIEQCIEQCIEQCIEQCIEQCIWd8DwIN4gRoXdAGAGAGAGAGAGAGAGAGAGAGAGAGAGAGAGAGAmL8WYHrIQIIz4QAAAABJRU5ErkJggg==',
          secret: 'ABCDEFGHIJKLMNOP'
        };
      }
      
      // Configuration réelle pour les utilisateurs normaux
      const response = await apiClient.post('/auth/2fa/setup');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la configuration 2FA:', error);
      throw error;
    }
  }
  
  // Génération de codes de secours pour l'authentification à deux facteurs
  async generateBackupCodes(): Promise<string[]> {
    try {
      // En mode démo, simuler des codes de secours
      if (USE_MOCK_AUTH) {
        // Simuler un délai de traitement
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return [
          '1234-5678-9012',
          '2345-6789-0123',
          '3456-7890-1234',
          '4567-8901-2345',
          '5678-9012-3456'
        ];
      }
      
      // Génération réelle pour les utilisateurs normaux
      const response = await apiClient.post('/auth/2fa/backup-codes');
      return response.data.codes;
    } catch (error) {
      console.error('Erreur lors de la génération des codes de secours:', error);
      throw error;
    }
  }

  // Demande de réinitialisation de mot de passe
  async requestPasswordReset(email: string): Promise<void> {
    try {
      // Simuler la demande en mode démo
      if (this.isUsingMockAuth(email)) {
        console.log('Simulation de demande de réinitialisation pour:', email);
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      }
      
      // Demande réelle pour les utilisateurs normaux
      await apiClient.post('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      throw error;
    }
  }
  
  // Réinitialisation du mot de passe avec le token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Simuler la réinitialisation en mode démo
      if (USE_MOCK_AUTH) {
        console.log('Simulation de réinitialisation de mot de passe avec token:', token);
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      }
      
      // Réinitialisation réelle pour les utilisateurs normaux
      await apiClient.post('/auth/reset-password', { 
        token, 
        password: newPassword 
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();

// Fonction manquante pour la compatibilité
const mockRefreshToken = async () => {
  console.log('Refreshing demo token');
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    token: getCurrentDemoToken(),
    user: {
      id: getCurrentDemoUser().id,
      name: getCurrentDemoUser().name
    }
  };
};