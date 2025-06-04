import { useState } from 'react';
import { useAdminApi as useAdminApiService } from '../services/api/adminApiService';
import type { AdminUser, Company, DashboardStats } from '../services/api/adminApiService';

// Hook pour faciliter l'utilisation de l'API d'administration
export const useAdminApi = () => {
  const adminApi = useAdminApiService();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction utilitaire pour gérer les requêtes API
  const handleApiRequest = async <T,>(
    requestFn: () => Promise<{ data: T }>,
    errorMessage: string
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await requestFn();
      return response.data;
    } catch (err: unknown) {
      console.error(`${errorMessage}:`, err);
      setError(err instanceof Error ? err.message : errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    
    // Opérations sur les utilisateurs
    getUsers: () => 
      handleApiRequest<AdminUser[]>(
        () => adminApi.getUsers(),
        "Erreur lors de la récupération des utilisateurs"
      ),
    
    getUserById: (id: string) => 
      handleApiRequest<AdminUser>(
        () => adminApi.getUserById(id),
        `Erreur lors de la récupération de l'utilisateur ${id}`
      ),
    
    createUser: (userData: Partial<AdminUser>) => 
      handleApiRequest<AdminUser>(
        () => adminApi.createUser(userData),
        "Erreur lors de la création de l'utilisateur"
      ),
    
    updateUser: (id: string, userData: Partial<AdminUser>) => 
      handleApiRequest<AdminUser>(
        () => adminApi.updateUser(id, userData),
        `Erreur lors de la mise à jour de l'utilisateur ${id}`
      ),
    
    deleteUser: (id: string) => 
      handleApiRequest<void>(
        () => adminApi.deleteUser(id),
        `Erreur lors de la suppression de l'utilisateur ${id}`
      ),
    
    // Opérations sur les entreprises
    getCompanies: () => 
      handleApiRequest<Company[]>(
        () => adminApi.getCompanies(),
        "Erreur lors de la récupération des entreprises"
      ),
    
    getCompanyById: (id: string) => 
      handleApiRequest<Company>(
        () => adminApi.getCompanyById(id),
        `Erreur lors de la récupération de l'entreprise ${id}`
      ),
    
    // Statistiques du tableau de bord
    getDashboardStats: () => 
      handleApiRequest<DashboardStats>(
        () => adminApi.getDashboardStats(),
        "Erreur lors de la récupération des statistiques du tableau de bord"
      ),
    
    // Paramètres système
    getSettings: () => 
      handleApiRequest(
        () => adminApi.getSettings(),
        "Erreur lors de la récupération des paramètres"
      ),
    
    // Fonctionnalités spécifiques
    approveCustomer: (id: string) => 
      handleApiRequest(
        () => adminApi.approveCustomer(id),
        `Erreur lors de l'approbation du client ${id}`
      ),
    
    rejectCustomer: (id: string, reason: string) => 
      handleApiRequest(
        () => adminApi.rejectCustomer(id, reason),
        `Erreur lors du rejet du client ${id}`
      ),
  };
};
