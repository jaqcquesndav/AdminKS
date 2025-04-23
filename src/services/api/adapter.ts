import { isUsingDemoUser } from './client';
import { USE_MOCK_AUTH } from '../../utils/mockAuth';

/**
 * Adaptateur qui gère automatiquement le basculement entre API réelle et données simulées
 * pour les utilisateurs de démonstration
 * 
 * @param apiCall - Fonction qui effectue l'appel API réel
 * @param mockData - Fonction ou données qui simulent la réponse pour les utilisateurs de démo
 */
export async function apiAdapter<T, P extends any[]>(
  apiCall: (...args: P) => Promise<T>,
  mockData: ((...args: P) => T) | T,
  ...args: P
): Promise<T> {
  // Si le mode démo est désactivé, utiliser toujours l'API réelle
  if (!USE_MOCK_AUTH) {
    return apiCall(...args);
  }

  // Si nous utilisons un compte de démonstration, retourner les données simulées
  if (isUsingDemoUser()) {
    console.log('[API Adapter] Utilisation des données simulées pour le compte de démonstration');
    
    // Si mockData est une fonction, l'exécuter avec les arguments
    // Sinon, retourner directement les données
    return typeof mockData === 'function' 
      ? (mockData as (...args: P) => T)(...args)
      : mockData;
  }

  // Pour les utilisateurs normaux, utiliser l'API réelle
  return apiCall(...args);
}

// Fonction utilitaire pour créer un adaptateur avec un délai simulé pour les appels API simulés
export function createDelayedMock<T>(data: T, delayMs: number = 300): () => Promise<T> {
  return () => new Promise(resolve => setTimeout(() => resolve(data), delayMs));
}