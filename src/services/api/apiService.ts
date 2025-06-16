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
            console.log('🔐 Token Auth0 récupéré avec succès:', token.substring(0, 20) + '...');
            config.headers.Authorization = `Bearer ${token}`;
            // Log pour vérifier les headers de la requête
            console.log('📤 Requête API avec token:', {
              url: config.url,
              method: config.method?.toUpperCase(),
              hasAuthHeader: !!config.headers.Authorization
            });
          } else {
            console.warn('⚠️ Token Auth0 vide ou non défini');
          }
        } catch (error) {
          console.error('❌ Erreur lors de l\'obtention du token:', error);
        }
      } else {
        console.log('👤 Utilisateur non authentifié - aucun token envoyé');
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
    // Ajout de postMultipart pour gérer FormData explicitement si nécessaire
    postMultipart: <T>(endpoint: string, formData: FormData) =>
      apiClient.post<T>(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    put: <T>(endpoint: string, data: unknown) => apiClient.put<T>(endpoint, data),
    delete: <T>(endpoint: string) => apiClient.delete<T>(endpoint),
    // Vous pouvez ajouter PATCH ici si votre backend le supporte et que vous en avez besoin
    // patch: <T>(endpoint: string, data: unknown) => apiClient.patch<T>(endpoint, data),
  };
};
