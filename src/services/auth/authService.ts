import type { AuthUser, AuthResponseBase } from '../../types/auth';
import type { UserRole, UserType } from '../../types/user';

// Define a type for user information
interface UserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: string;
  userType: string;
  scopes: string[];
  customerAccountId?: string;
  auth0Id: string;
}

// Service d'authentification central inspiré de l'implémentation mobile Flutter
class AuthService {
  // Clés de stockage pour les différents tokens
  private readonly ACCESS_TOKEN_KEY = 'wanzo_access_token';
  private readonly ID_TOKEN_KEY = 'wanzo_id_token';
  private readonly REFRESH_TOKEN_KEY = 'wanzo_refresh_token';
  private readonly USER_INFO_KEY = 'wanzo_user_info';
  private readonly AUTH_STATE_KEY = 'wanzo_auth_state';
  private readonly TOKEN_EXPIRY_KEY = 'wanzo_token_expiry';

  // Méthodes de gestion des tokens
  saveAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  saveIdToken(token: string): void {
    localStorage.setItem(this.ID_TOKEN_KEY, token);
  }

  getIdToken(): string | null {
    return localStorage.getItem(this.ID_TOKEN_KEY);
  }

  saveRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  saveTokenExpiry(expiryTime: number): void {
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  getTokenExpiry(): number | null {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  }

  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    
    // Considérer le token expiré 60 secondes avant sa véritable expiration
    // pour éviter les problèmes liés à la latence
    const buffer = 60 * 1000; // 60 secondes en millisecondes
    return Date.now() >= expiry - buffer;
  }

  // Sauvegarde des informations utilisateur
  saveUserInfo(userInfo: UserInfo): void {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
  }

  getUserInfo(): UserInfo | null {
    const userInfoString = localStorage.getItem(this.USER_INFO_KEY);
    return userInfoString ? JSON.parse(userInfoString) as UserInfo : null;
  }

  // Vérification de l'état d'authentification
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !this.isTokenExpired();
  }

  // Méthode de déconnexion complète
  logout(): void {
    // Supprimer tous les tokens et informations d'authentification
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.ID_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
    localStorage.removeItem(this.AUTH_STATE_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    
    // Supprimer les autres données d'authentification stockées
    localStorage.removeItem('auth_user_email');
    localStorage.removeItem('auth_user_name');
    localStorage.removeItem('auth_user_id');
    localStorage.removeItem('auth_user_picture');
    localStorage.removeItem('auth_user_role');
    localStorage.removeItem('auth_user_type');
    localStorage.removeItem('auth_user_scopes');
    localStorage.removeItem('auth_user_customer_id');
    
    console.log('🔒 Déconnexion effectuée, tous les tokens ont été supprimés');
  }

  // Méthode pour rafraîchir le token depuis Auth0
  async refreshTokenFromAuth0(user: { [key: string]: unknown }, accessToken: string, idToken?: string, refreshToken?: string, expiresIn?: number): Promise<void> {
    console.log('🔄 Traitement des tokens Auth0');
    
    try {
      // 1. Sauvegarder les tokens
      this.saveAccessToken(accessToken);
      
      if (idToken) {
        this.saveIdToken(idToken);
      }
      
      if (refreshToken) {
        this.saveRefreshToken(refreshToken);
      }
      
      // 2. Calculer et sauvegarder l'expiration du token si disponible
      if (expiresIn) {
        const expiryTime = Date.now() + expiresIn * 1000;
        this.saveTokenExpiry(expiryTime);
        console.log(`⏱️ Token valide jusqu'à: ${new Date(expiryTime).toLocaleString()}`);
      }
      
      // 3. Extraire et stocker les informations utilisateur
      const email = user.email as string || '';
      const name = user.name as string || '';
      const sub = user.sub as string || '';
      const picture = user.picture as string || '';
      
      // 4. Traiter les claims personnalisés d'Auth0
      const role = user['https://api.wanzo.com/role'] as string || 'customer_support';
      const userType = user['https://api.wanzo.com/userType'] as string || 'internal';
      const scopes = (user['https://api.wanzo.com/scopes'] as string || '').split(' ');
      const customerAccountId = user['https://api.wanzo.com/customerAccountId'] as string;
      
      // 5. Créer un objet utilisateur structuré
      const userInfo: UserInfo = {
        id: sub,
        email,
        name,
        picture,
        role,
        userType,
        scopes,
        customerAccountId,
        auth0Id: sub
      };
      
      // 6. Sauvegarder l'objet utilisateur
      this.saveUserInfo(userInfo);
      
      // 7. Stocker également les informations individuelles pour rétrocompatibilité
      localStorage.setItem('auth_user_email', email);
      localStorage.setItem('auth_user_name', name);
      localStorage.setItem('auth_user_id', sub);
      
      if (picture) {
        localStorage.setItem('auth_user_picture', picture);
      }
      
      localStorage.setItem('auth_user_role', role);
      localStorage.setItem('auth_user_type', userType);
      
      if (scopes.length > 0) {
        localStorage.setItem('auth_user_scopes', JSON.stringify(scopes));
      }
      
      if (customerAccountId) {
        localStorage.setItem('auth_user_customer_id', customerAccountId);
      }
      
      // 8. Synchroniser avec le backend si nécessaire (version future)
      // TODO: Implémenter la synchronisation avec le backend comme dans l'app mobile
      
      console.log('✅ Authentication complète - Tokens et données utilisateur sauvegardés');
    } catch (error) {
      console.error('❌ Erreur lors du traitement des tokens:', error);      throw new Error("Impossible de traiter les informations d'authentification");
    }
  }
  
  // Pour la rétrocompatibilité avec l'ancien système
  convertAuthResponseToUser(response: AuthResponseBase): AuthUser {
    return {
      id: response.user.id,
      email: response.user.email || '',
      name: response.user.name,
      picture: response.user.picture,
      role: (response.user.role as UserRole) || 'customer_support',
      userType: 'internal' as UserType, // Default value with type assertion
      customerAccountId: undefined // Default value
    };
  }  
  // Pour le mode démonstration - vérifier si c'est un email de démo
  isDemoEmail(email: string): boolean {
    return email.endsWith('@demo.wanzo.com') || 
           email.endsWith('@demo.test') || 
           email === 'admin@example.com';
  }
}

// Exporter une instance singleton du service
export const authService = new AuthService();
