import axios, { AxiosError } from 'axios';

/**
 * Détecte si une erreur est une erreur de connexion réseau
 */
export function isNetworkError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    // Une erreur réseau est généralement caractérisée par l'absence de réponse
    return !axiosError.response;
  }
  return false;
}

/**
 * Détecte si une erreur est une erreur de serveur (5xx)
 */
export function isServerError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return !!axiosError.response && axiosError.response.status >= 500;
  }
  return false;
}

/**
 * Obtient un message d'erreur utilisable à partir d'une erreur axios
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Erreur réseau
    if (!axiosError.response) {
      return 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
    }
    
    // Erreur de serveur
    if (axiosError.response.status >= 500) {
      return 'Erreur interne du serveur. Veuillez réessayer plus tard.';
    }
    
    // Erreur d'authentification
    if (axiosError.response.status === 401) {
      return 'Votre session a expiré. Veuillez vous reconnecter.';
    }
    
    // Erreur d'autorisation
    if (axiosError.response.status === 403) {
      return 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.';
    }
    
    // Erreur de validation
    if (axiosError.response.status === 422 && axiosError.response.data) {
      // On pourrait extraire plus de détails des erreurs de validation si nécessaire
      return 'Certaines données sont invalides. Veuillez vérifier vos entrées.';
    }
    
    // Autres erreurs HTTP
    return `Erreur ${axiosError.response.status}: ${axiosError.response.statusText || 'Une erreur est survenue'}`;
  }
  
  // Pour les erreurs non-Axios
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Une erreur inconnue est survenue';
}

/**
 * Fonction utilitaire pour afficher un toast pour une erreur réseau
 * à utiliser dans les hooks et les services
 */
export function showNetworkErrorToast(
  showToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void, 
  error: unknown, 
  context: string
): void {
  if (isNetworkError(error)) {
    showToast('error', `Problème de connexion réseau. Impossible de ${context}.`);
  } else if (isServerError(error)) {
    showToast('error', `Le serveur a rencontré une erreur. Impossible de ${context}.`);
  } else {
    showToast('error', `Erreur: ${getErrorMessage(error)}. Impossible de ${context}.`);
  }
}
