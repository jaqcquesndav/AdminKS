import { jwtDecode } from 'jwt-decode';
import type { AuthUser } from '../types/auth';

interface JwtPayload {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  azp?: string;
  scope?: string;
  role?: 'admin' | 'user';
  [key: string]: any;
}

class AuthService {
  private readonly storageKey = 'auth-storage';

  initialize(): void {
    console.log('Initializing auth service...');
    const token = this.getTokenFromUrl();
    if (token) {
      console.log('Token found in URL, processing...');
      this.handleToken(token);
      // Remove token from URL without reloading the page
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      console.log('No token found in URL');
    }
  }

  private getTokenFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    console.log('Token from URL:', token ? 'Found' : 'Not found');
    return token;
  }

  private handleToken(token: string): void {
    try {
      console.log('Decoding JWT token...');
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Token decoded successfully:', {
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        exp: decoded.exp
      });

      const user: AuthUser = {
        id: decoded.sub,
        email: decoded.email || '',
        name: decoded.name || '',
        picture: decoded.picture,
        role: decoded.role || 'user',
      };

      localStorage.setItem(this.storageKey, JSON.stringify({
        state: {
          user,
          token,
          isAuthenticated: true
        }
      }));
      console.log('Auth state saved to localStorage');
    } catch (error) {
      console.error('Error handling token:', error);
      this.logout();
    }
  }

  getStoredUser(): AuthUser | null {
    const authData = localStorage.getItem(this.storageKey);
    if (!authData) {
      console.log('No stored user found');
      return null;
    }

    try {
      const { state } = JSON.parse(authData);
      console.log('Retrieved stored user:', state.user);
      return state.user;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  getToken(): string | null {
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
    const token = this.getToken();
    if (!token) {
      console.log('No token found, not authenticated');
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const isValid = decoded.exp ? decoded.exp * 1000 > Date.now() : false;
      console.log('Token validation:', {
        isValid,
        expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : 'No expiration'
      });
      return isValid;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  isAdmin(): boolean {
    const user = this.getStoredUser();
    const isAdmin = user?.role === 'admin';
    console.log('Admin check:', { isAdmin, userRole: user?.role });
    return isAdmin;
  }

  logout(): void {
    console.log('Logging out...');
    localStorage.removeItem(this.storageKey);
    const logoutUrl = import.meta.env.VITE_AUTH_LOGOUT_URL || 'http://localhost:5173/auth/apps/sme';
    const currentPath = encodeURIComponent(window.location.pathname);
    window.location.href = `${logoutUrl}?redirect=${currentPath}`;
  }
}

export const authService = new AuthService();