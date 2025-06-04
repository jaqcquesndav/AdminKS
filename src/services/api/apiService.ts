import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

// Créer une instance axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hook pour obtenir une instance API authentifiée
export const useApi = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Ajouter le token aux requêtes si l'utilisateur est authentifié
  apiClient.interceptors.request.use(
    async (config) => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Erreur lors de l\'obtention du token:', error);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return {
    // Méthodes API génériques
    get: <T>(endpoint: string) => apiClient.get<T>(endpoint),
    post: <T>(endpoint: string, data: unknown) => apiClient.post<T>(endpoint, data),
    put: <T>(endpoint: string, data: unknown) => apiClient.put<T>(endpoint, data),
    delete: <T>(endpoint: string) => apiClient.delete<T>(endpoint),
    
    // Méthodes API spécifiques à l'administration
    getUsers: () => apiClient.get('/admin/users'),
    getSettings: () => apiClient.get('/admin/settings'),
    getCompanies: () => apiClient.get('/admin/companies'),
    getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
  };
};
