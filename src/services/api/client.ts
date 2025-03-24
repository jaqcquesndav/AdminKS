import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authService } from '../authService';
import { API_BASE_URL, API_HEADERS } from './config';

// Créer l'instance axios avec la configuration de base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: API_HEADERS,
  timeout: 30000
});

// Intercepteur pour ajouter le token aux requêtes
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Gérer les erreurs d'authentification
    if (error.response?.status === 401) {
      // Si le token est expiré et qu'on n'a pas déjà essayé de rafraîchir
      if (error.response.data?.code === 'token_expired' && !originalRequest?._retry) {
        originalRequest._retry = true;
        
        try {
          // Rediriger vers la page d'authentification
          authService.logout();
          return Promise.reject(error);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      
      // Autres erreurs d'authentification
      authService.logout();
      return Promise.reject(error);
    }

    // Gérer les erreurs de validation (422)
    if (error.response?.status === 422) {
      return Promise.reject({
        ...error,
        message: 'Validation failed',
        errors: error.response.data.errors
      });
    }

    // Gérer les erreurs serveur (500)
    if (error.response?.status === 500) {
      return Promise.reject({
        ...error,
        message: 'Internal server error'
      });
    }

    // Gérer les erreurs réseau
    if (!error.response) {
      return Promise.reject({
        ...error,
        message: 'Network error'
      });
    }

    return Promise.reject(error);
  }
);

// Fonction utilitaire pour gérer les erreurs
export function handleApiError(error: any): { message: string; errors?: Record<string, string[]> } {
  if (error.response?.data?.errors) {
    return {
      message: error.response.data.message || 'Validation error',
      errors: error.response.data.errors
    };
  }

  if (error.response?.data?.message) {
    return { message: error.response.data.message };
  }

  if (error.message) {
    return { message: error.message };
  }

  return { message: 'An unexpected error occurred' };
}

export default apiClient;