import apiClient from './client';
import { API_ENDPOINTS } from './config';
import type { Company, CompanyRegistration, Location } from '../../types/company';

export const companyApi = {
  // Obtenir le profil de l'entreprise actuelle
  getProfile: async (): Promise<Company> => {
    const response = await apiClient.get(API_ENDPOINTS.company.profile);
    return response.data;
  },

  // Mettre à jour le profil de l'entreprise
  updateProfile: async (data: Partial<Company>): Promise<Company> => {
    const response = await apiClient.put(API_ENDPOINTS.company.update, data);
    return response.data;
  },

  // Téléverser un logo pour l'entreprise
  uploadLogo: async (file: File): Promise<{ logoUrl: string }> => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await apiClient.post('/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  },

  // Ajouter une nouvelle localisation à l'entreprise
  addLocation: async (location: Omit<Location, 'id'>): Promise<Location> => {
    const response = await apiClient.post('/company/locations', location);
    return response.data;
  },

  // Supprimer une localisation de l'entreprise
  removeLocation: async (locationId: string): Promise<void> => {
    await apiClient.delete(`/company/locations/${locationId}`);
  },

  // Obtenir tous les documents de l'entreprise
  getDocuments: async (): Promise<{ documents: Record<string, string> }> => {
    const response = await apiClient.get(API_ENDPOINTS.company.documents);
    return response.data;
  },

  // Téléverser un document d'entreprise
  uploadDocument: async (type: 'rccm' | 'nationalId' | 'taxNumber' | 'cnss', file: File): Promise<{ fileUrl: string }> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);

    const response = await apiClient.post(API_ENDPOINTS.company.uploadDocument, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  },

  // Télécharger un document d'entreprise
  downloadDocument: async (type: 'rccm' | 'nationalId' | 'taxNumber' | 'cnss'): Promise<Blob> => {
    const response = await apiClient.get(`/company/documents/${type}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Enregistrer une nouvelle entreprise
  registerCompany: async (data: CompanyRegistration): Promise<Company> => {
    const response = await apiClient.post('/company/register', data);
    return response.data;
  },

  // Vérifier si un nom d'entreprise est disponible
  checkNameAvailability: async (name: string): Promise<{ available: boolean }> => {
    const response = await apiClient.get('/company/check-name', {
      params: { name }
    });
    return response.data;
  },
  
  // Vérifier si un numéro RCCM est valide
  validateRCCM: async (rccm: string): Promise<{ valid: boolean; message?: string }> => {
    const response = await apiClient.post('/company/validate-rccm', { rccm });
    return response.data;
  },
  
  // Vérifier si un numéro d'identifiant national est valide
  validateNationalId: async (nationalId: string): Promise<{ valid: boolean; message?: string }> => {
    const response = await apiClient.post('/company/validate-national-id', { nationalId });
    return response.data;
  }
};

export default companyApi;