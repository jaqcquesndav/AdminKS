import { jwtDecode } from 'jwt-decode';
import type { AuthUser, LoginCredentials, AuthResponse as AuthResponseBase } from '../types/auth';
import { User, UserRole } from '../types/user';
import { USE_MOCK_AUTH, AUTO_LOGIN, getInitialAuthState, getCurrentDemoUser, getCurrentDemoToken, mockLogin, mockLogout, mockVerifyTwoFactor } from '../utils/mockAuth';

// Extension de l'interface AuthResponse de base pour l'adapter à notre besoin interne
interface AuthResponseExtended extends AuthResponseBase {
  refreshToken?: string;
  user: User; // Type User complet
}

// Interface pour la mise en cache des données d'authentification
interface CachedAuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface JwtPayload {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  azp?: string;
  scope?: string;
  role?: string;
  exp?: number;
  [key: string]: unknown;
}

// Fonction utilitaire pour convertir les rôles UserRole en rôles AuthUser
function convertUserRoleToAuthRole(role: UserRole): AuthUser['role'] {
  // Mapping des rôles UserRole vers les rôles AuthUser
  switch (role) {
    case 'super_admin': return 'superadmin';
    case 'cto': return 'cto';
    case 'growth_finance': return 'growth_finance';
    case 'customer_support': return 'customer_support';
    case 'content_manager': return 'admin'; // Fallback pour content_manager
    default: return 'user';
  }
}

class AuthService {
  private readonly storageKey = 'auth-storage';
  private user: User | null = null;
  private token: string | null = null;
  private refreshToken: string | null = null;
  
  // Cache pour éviter des lectures répétées du localStorage
  private cachedAuthState: CachedAuthState | null = null;

  initialize(): void {
    // Vérifier si l'authentification existante est valide dans localStorage
    const authData = localStorage.getItem(this.storageKey);
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state && state.isAuthenticated && state.user && state.token) {
          // Mettre en cache l'état d'authentification pour les futures vérifications
          this.cachedAuthState = {
            user: state.user as User,
            token: state.token,
            isAuthenticated: true
          };
          return; // Authentifié, ne rien faire de plus
        }
      } catch (e) {
        console.error('Error parsing auth data:', e);
      }
    }
    
    // Si le mode mock est activé mais pas de session active
    if (USE_MOCK_AUTH) {
      // Seulement si AUTO_LOGIN est activé, initialiser avec l'utilisateur de démo
      if (AUTO_LOGIN) {
        this.initializeMockAuth();
      } else {
        // S'assurer qu'il n'y a pas de restes d'authentification précédente
        localStorage.removeItem(this.storageKey);
      }
      return;
    }
    
    // Logique normale pour Auth0
    const token = this.getTokenFromUrl();
    if (token) {
      this.handleToken(token);
      // Remove token from URL without reloading the page
      window.history.replaceState({}, document.title, window.location.pathname);
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
        user: fullUser,
        token: initialState.token,
        isAuthenticated: true
      };
      
      // Stockage explicite du token pour les fonctions qui le recherchent
      localStorage.setItem('auth_token', initialState.token);
      
      // Mise à jour du localStorage avec l'état complet
      localStorage.setItem(this.storageKey, JSON.stringify({
        state: {
          user: fullUser,
          token: initialState.token,
          isAuthenticated: true
        }
      }));
      
      console.log('Mock auth initialized with user:', fullUser.name, 'role:', fullUser.role);
    } else {
      console.warn('Auto-login enabled but no valid demo user was found.');
    }
  }

  private getTokenFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
  }

  // Convertit un AuthUser en User complet
  private convertToFullUser(authUser: AuthUser): User {
    // Mapper le rôle de AuthUser vers UserRole
    let userRole: UserRole = 'customer_support'; // Valeur par défaut
    
    // Mapping des rôles entre AuthUser et UserRole
    if (authUser.role === 'admin' || authUser.role === 'superadmin') {
      userRole = 'super_admin';
    } else if (['cto', 'growth_finance', 'customer_support', 'content_manager'].includes(authUser.role)) {
      userRole = authUser.role as UserRole;
    }
    
    return {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: userRole,
      status: 'active',
      createdAt: new Date().toISOString(),
      permissions: []
    };
  }

  private handleToken(token: string): void {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Assurons-nous que le rôle est soit 'user' soit 'admin'
      const role = decoded.role && ['admin', 'user'].includes(decoded.role) ? decoded.role as 'admin' | 'user' : 'user';

      const authUser: AuthUser = {
        id: decoded.sub,
        email: decoded.email || '',
        name: decoded.name || '',
        picture: decoded.picture,
        role: role,
      };
      
      // Convertir AuthUser en User complet
      const user = this.convertToFullUser(authUser);
      
      // Mettre à jour le cache
      this.cachedAuthState = {
        user,
        token,
        isAuthenticated: true
      };

      localStorage.setItem(this.storageKey, JSON.stringify({
        state: this.cachedAuthState
      }));
    } catch (err) {
      console.error('Error handling token:', err);
      this.logout();
    }
  }

  // Adapter la réponse d'authentification de base à notre format étendu
  private convertAuthResponse(response: AuthResponseBase): AuthResponseExtended {
    // En mode mock, récupérer les données complètes de l'utilisateur de démo
    if (USE_MOCK_AUTH) {
      const demoUser = getCurrentDemoUser();
      
      // Créer une version User complète en utilisant les données de démo
      const fullUser: User = {
        id: response.user.id || demoUser.id,
        name: response.user.name || demoUser.name,
        email: demoUser.email || '',
        role: 'super_admin', // Utiliser un rôle valide
        status: 'active',
        createdAt: new Date().toISOString(),
        permissions: []
      };
      
      return {
        ...response,
        user: fullUser
      };
    }
    
    // Pour l'authentification normale
    const fullUser: User = {
      id: response.user.id,
      name: response.user.name,
      email: '', 
      role: 'customer_support',
      status: 'active',
      createdAt: new Date().toISOString(),
      permissions: []
    };

    return {
      ...response,
      user: fullUser
    };
  }

  // La méthode handleAuthResponse peut maintenant utiliser l'interface étendue
  private processAuthResponse(response: AuthResponseExtended): User {
    this.user = response.user;
    this.token = response.token;
    this.refreshToken = response.refreshToken || null;
    
    // Stocker le token séparément (pour compatibilité)
    localStorage.setItem('auth_token', this.token);
    if (this.refreshToken) {
      localStorage.setItem('refresh_token', this.refreshToken);
    }
    
    // Mettre à jour le cache
    this.cachedAuthState = {
      user: this.user,
      token: this.token,
      isAuthenticated: true
    };
    
    // Stocker l'état d'authentification complet dans localStorage
    localStorage.setItem(this.storageKey, JSON.stringify({
      state: this.cachedAuthState
    }));
    
    return this.user;
  }

  getStoredUser(): AuthUser | null {
    // Utiliser le cache si disponible
    if (this.cachedAuthState && this.cachedAuthState.user) {
      const user = this.cachedAuthState.user;
      // Convertir User en AuthUser pour la compatibilité
      const authUser: AuthUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: convertUserRoleToAuthRole(user.role), // Utiliser la fonction pour convertir le rôle
        picture: user.avatar
      };
      return authUser;
    }
    
    // Si le mode mock est activé, retourner l'utilisateur de démo
    if (USE_MOCK_AUTH) {
      return getCurrentDemoUser();
    }

    const authData = localStorage.getItem(this.storageKey);
    if (!authData) {
      return null;
    }

    try {
      const { state } = JSON.parse(authData);
      
      // Mettre à jour le cache
      if (state && state.user) {
        this.cachedAuthState = {
          user: state.user as User,
          token: state.token,
          isAuthenticated: Boolean(state.isAuthenticated)
        };
        
        // Convertir User en AuthUser pour la compatibilité
        const user = state.user as User;
        const authUser: AuthUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: convertUserRoleToAuthRole(user.role), // Utiliser la fonction pour convertir le rôle
          picture: user.avatar
        };
        return authUser;
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  getToken(): string | null {
    // Utiliser le cache si disponible
    if (this.cachedAuthState && this.cachedAuthState.token) {
      return this.cachedAuthState.token;
    }
    
    // Si le mode mock est activé, retourner un token de démonstration
    if (USE_MOCK_AUTH) {
      return getCurrentDemoToken();
    }

    const authData = localStorage.getItem(this.storageKey);
    if (!authData) return null;

    try {
      const { state } = JSON.parse(authData);
      return state.token;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    // Utiliser le cache si disponible
    if (this.cachedAuthState !== null) {
      return this.cachedAuthState.isAuthenticated;
    }
    
    // En mode mock, vérification plus simple et robuste du localStorage
    if (USE_MOCK_AUTH) {
      const authData = localStorage.getItem(this.storageKey);
      if (!authData) {
        return false;
      }
      
      try {
        const { state } = JSON.parse(authData);
        const isValid = Boolean(state && state.isAuthenticated);
        
        // Mettre à jour le cache
        this.cachedAuthState = {
          user: state?.user as User || null,
          token: state?.token || null,
          isAuthenticated: isValid
        };
        
        return isValid;
      } catch (error) {
        // Logger l'erreur au lieu de l'ignorer
        console.error('Error parsing authentication state:', error);
        return false;
      }
    }
    
    // Pour l'authentification normale (non-mock)
    const authData = localStorage.getItem(this.storageKey);
    if (!authData) {
      return false;
    }
    
    try {
      const { state } = JSON.parse(authData);
      if (!state || !state.isAuthenticated || !state.token) {
        return false;
      }

      // Vérifier la validité du token
      const token = state.token;
      const decoded = jwtDecode<JwtPayload>(token);
      const isValid = decoded.exp ? decoded.exp * 1000 > Date.now() : false;
      
      // Mettre à jour le cache
      this.cachedAuthState = {
        user: state.user as User,
        token: state.token,
        isAuthenticated: isValid
      };
      
      return isValid;
    } catch (error) {
      // Logger l'erreur au lieu de l'ignorer
      console.error('Error validating authentication token:', error);
      return false;
    }
  }

  isAdmin(): boolean {
    // Utiliser le cache si disponible
    if (this.cachedAuthState && this.cachedAuthState.user) {
      // Vérifier si le rôle de l'utilisateur est super_admin (équivalent à admin)
      return this.cachedAuthState.user.role === 'super_admin';
    }
    
    // Si le mode mock est activé, l'utilisateur démo est admin si son rôle est admin
    if (USE_MOCK_AUTH) {
      const demoUser = getCurrentDemoUser();
      return demoUser.role === 'admin' || demoUser.role === 'superadmin';
    }

    const user = this.getStoredUser();
    // Vérifier les rôles qui correspondent à un admin
    return user?.role === 'admin' || user?.role === 'superadmin';
  }

  // Mettre à jour la méthode login pour utiliser l'interface étendue et processAuthResponse
  async login(credentials: LoginCredentials): Promise<AuthResponseExtended> {
    if (USE_MOCK_AUTH) {
      const response = await mockLogin(credentials);
      const extendedResponse = this.convertAuthResponse(response);
      this.processAuthResponse(extendedResponse);
      return extendedResponse;
    }
    
    // Logic for real authentication
    throw new Error('Real authentication not implemented');
  }
  
  // Mettre à jour la méthode verifyTwoFactor pour utiliser l'interface étendue et processAuthResponse
  async verifyTwoFactor(verification: { code: string, method: 'email' | 'sms' }): Promise<AuthResponseExtended> {
    if (USE_MOCK_AUTH) {
      const response = await mockVerifyTwoFactor(verification.code);
      const extendedResponse = this.convertAuthResponse(response);
      this.processAuthResponse(extendedResponse);
      return extendedResponse;
    }
    
    // Logic for real 2FA verification
    throw new Error('Real 2FA verification not implemented');
  }

  logout(): void {
    // Réinitialiser le cache
    this.cachedAuthState = null;
    
    // Nettoyer les tokens locaux
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem(this.storageKey);
    
    // Si mode mock, utiliser la déconnexion simulée
    if (USE_MOCK_AUTH) {
      mockLogout();
      
      // Forcer la redirection vers la page de login
      setTimeout(() => {
        window.location.replace('/login');
      }, 100);
      return;
    }
    
    // Pour l'authentification réelle
    const logoutUrl = import.meta.env.VITE_AUTH_LOGOUT_URL || 'http://localhost:5173/auth/apps/sme';
    const currentPath = encodeURIComponent(window.location.pathname);
    window.location.href = `${logoutUrl}?redirect=${currentPath}`;
  }
}

export const authService = new AuthService();