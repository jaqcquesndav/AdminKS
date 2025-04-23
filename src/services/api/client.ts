import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authService } from '../authService';
import { API_BASE_URL, API_HEADERS } from './config';
import { USE_MOCK_AUTH, isDemoEmail } from '../../utils/mockAuth';

// Créer l'instance axios avec la configuration de base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: API_HEADERS,
  timeout: 30000
});

// Variable pour suivre si l'utilisateur actuel est un utilisateur de démonstration
let isUsingDemoAccount = false;

// Intercepteur pour ajouter le token aux requêtes
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Vérifier si l'utilisateur actuel est un utilisateur démo
      if (USE_MOCK_AUTH) {
        const currentUser = authService.getStoredUser();
        if (currentUser && isDemoEmail(currentUser.email)) {
          isUsingDemoAccount = true;
          
          // Ajouter un header spécial pour les utilisateurs de démo (peut être utile pour le débogage)
          config.headers['X-Demo-User'] = 'true';
        } else {
          isUsingDemoAccount = false;
        }
      }
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
    if (error.response && error.response.status === 401) {
      // Si nous utilisons un compte démo, ne pas tenter de rafraîchir le token
      if (isUsingDemoAccount) {
        console.warn('Demo account authentication error - redirecting to login');
        authService.logout();
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
      
      // Pour un utilisateur normal, essayer de rafraîchir le token
      try {
        const newToken = await authService.refreshToken();
        
        if (newToken && originalRequest) {
          // Mettre à jour l'en-tête d'autorisation avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Réessayer la requête avec le nouveau token
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Rediriger vers la page de connexion en cas d'échec
        authService.logout();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Gérer les erreurs de validation
    if (error.response && error.response.status === 422) {
      return Promise.reject({
        ...error,
        isValidationError: true,
        validationErrors: error.response.data.errors
      });
    }
    
    // Gérer les erreurs de serveur
    if (error.response && error.response.status >= 500) {
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

// Fonction pour déterminer si l'utilisateur actuel est un compte de démonstration
export function isUsingDemoUser(): boolean {
  return isUsingDemoAccount;
}

// Fonction utilitaire pour gérer les erreurs
export function handleApiError(error: any): { message: string; errors?: Record<string, string[]> } {
  if (error.isValidationError && error.validationErrors) {
    return {
      message: 'Validation error',
      errors: error.validationErrors
    };
  }
  
  return {
    message: error.message || 'An error occurred'
  };
}

export default apiClient;