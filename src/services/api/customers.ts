import apiClient from './client';
import { API_ENDPOINTS, replaceUrlParams } from './config';
import type { Customer, CustomerFormData, CustomerFilterParams, CustomerListResponse, CustomerDetailsResponse, CustomerStatistics } from '../../types/customer';

export const customersApi = {
  // Obtenir la liste de tous les clients
  getAll: async (params?: CustomerFilterParams): Promise<CustomerListResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.customers.list, { params });
    return response.data;
  },

  // Obtenir la liste des clients financiers
  getFinancialCustomers: async (params?: CustomerFilterParams): Promise<CustomerListResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.customers.financial, { params });
    return response.data;
  },

  // Obtenir la liste des clients corporate
  getCorporateCustomers: async (params?: CustomerFilterParams): Promise<CustomerListResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.customers.corporate, { params });
    return response.data;
  },

  // Obtenir la liste des clients individuels
  getIndividualCustomers: async (params?: CustomerFilterParams): Promise<CustomerListResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.customers.individual, { params });
    return response.data;
  },

  // Obtenir un client par son ID
  getById: async (id: string): Promise<CustomerDetailsResponse> => {
    const url = replaceUrlParams(API_ENDPOINTS.customers.getById, { id });
    const response = await apiClient.get(url);
    return response.data;
  },

  // Créer un nouveau client
  create: async (customerData: CustomerFormData): Promise<Customer> => {
    const response = await apiClient.post(API_ENDPOINTS.customers.create, customerData);
    return response.data;
  },

  // Mettre à jour un client
  update: async (id: string, customerData: Partial<CustomerFormData>): Promise<Customer> => {
    const url = replaceUrlParams(API_ENDPOINTS.customers.update, { id });
    const response = await apiClient.put(url, customerData);
    return response.data;
  },

  // Supprimer un client
  delete: async (id: string): Promise<void> => {
    const url = replaceUrlParams(API_ENDPOINTS.customers.delete, { id });
    await apiClient.delete(url);
  },

  // Obtenir les statistiques des clients
  getStatistics: async (): Promise<CustomerStatistics> => {
    const response = await apiClient.get(API_ENDPOINTS.customers.statistics);
    return response.data;
  }
};

export default customersApi;