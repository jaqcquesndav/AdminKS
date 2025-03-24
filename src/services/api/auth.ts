import api from './client';
import type { LoginCredentials, AuthResponse, TwoFactorVerification } from '../../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  verifyTwoFactor: async (verification: TwoFactorVerification): Promise<AuthResponse> => {
    const response = await api.post('/auth/2fa/verify', verification);
    return response.data;
  },

  setupTwoFactor: async (method: 'email' | 'sms', contact: string) => {
    const response = await api.post('/auth/2fa/setup', { method, contact });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  // KS Auth (OIDC) methods
  initiateKsAuth: async (): Promise<string> => {
    const response = await api.get('/auth/ks/authorize');
    return response.data.authorizationUrl;
  },

  handleKsAuthCallback: async (code: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/ks/callback', { code });
    return response.data;
  },

  logoutKsAuth: async () => {
    const response = await api.post('/auth/ks/logout');
    return response.data.logoutUrl;
  }
};