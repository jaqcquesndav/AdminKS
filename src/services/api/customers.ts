import apiClient from './client';
import { apiAdapter } from './adapter';
import { API_ENDPOINTS, replaceUrlParams } from './config';
import type { Customer, CustomerFormData, CustomerFilterParams, CustomerListResponse, CustomerDetailsResponse, CustomerStatistics, CustomerType } from '../../types/customer';

// Données simulées pour les utilisateurs de démonstration
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'PME Test SARL',
    type: 'pme',
    email: 'contact@pmetest.com',
    phone: '+243123456789',
    address: 'Avenue Test 123',
    city: 'Kinshasa',
    country: 'RDC',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    billingContactName: 'John Doe',
    billingContactEmail: 'billing@pmetest.com',
    tokenAllocation: 1000,
    accountType: 'standard',
    ownerId: 'user-123',
    ownerEmail: 'owner@pmetest.com',
    documents: []
  },
  {
    id: '2',
    name: 'Banque XYZ',
    type: 'financial',
    email: 'contact@banquexyz.com',
    phone: '+243987654321',
    address: 'Boulevard Finance 456',
    city: 'Lubumbashi',
    country: 'RDC',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    billingContactName: 'Jane Smith',
    billingContactEmail: 'billing@banquexyz.com',
    tokenAllocation: 10000,
    accountType: 'enterprise',
    ownerId: 'user-456',
    ownerEmail: 'director@banquexyz.com',
    validatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    validatedBy: 'admin-abc',
    documents: []
  }
];

// Fonctions utilitaires pour les données simulées
const mockGetCustomers = (params?: CustomerFilterParams): CustomerListResponse => {
  const { page = 1, limit = 10, search, status, type } = params || {};
  
  let filteredCustomers = [...mockCustomers];
  
  // Filtrage par recherche
  if (search) {
    const query = search.toLowerCase();
    filteredCustomers = filteredCustomers.filter(customer => 
      customer.name.toLowerCase().includes(query) || 
      customer.email.toLowerCase().includes(query)
    );
  }
  
  // Filtrage par statut
  if (status && status !== 'all') {
    filteredCustomers = filteredCustomers.filter(customer => customer.status === status);
  }
  
  // Filtrage par type de client
  if (type && type !== 'all') {
    filteredCustomers = filteredCustomers.filter(customer => customer.type === type);
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
  
  return {
    customers: paginatedCustomers,
    totalCount: filteredCustomers.length,
    page,
    totalPages: Math.ceil(filteredCustomers.length / limit)
  };
};

// Fonction mock pour obtenir un client par son ID
const mockGetCustomerById = (id: string): CustomerDetailsResponse => {
  const customer = mockCustomers.find(c => c.id === id) || mockCustomers[0];
  
  return {
    customer,
    statistics: {
      tokensUsed: 0,
      lastActivity: new Date().toISOString(),
      activeSubscriptions: 1,
      totalSpent: 0
    },
    activities: []
  };
};

// Fonction mock pour les statistiques clients
const mockGetStatistics = (): CustomerStatistics => {
  return {
    total: 100,
    active: 70,
    inactive: 10,
    pending: 15,
    suspended: 5,
    byType: {
      pme: 80,
      financial: 20
    },
    byAccountType: {
      freemium: 30,
      standard: 40,
      premium: 20,
      enterprise: 10
    }
  };
};

export const customersApi = {
  // Obtenir la liste de tous les clients
  getAll: async (params?: CustomerFilterParams): Promise<CustomerListResponse> => {
    const apiCall = async () => {
      const response = await apiClient.get(API_ENDPOINTS.customers.list, { params });
      return response.data;
    };
    
    return apiAdapter(apiCall, () => mockGetCustomers(params));
  },

  // Obtenir la liste des clients financiers
  getFinancialCustomers: async (params?: CustomerFilterParams): Promise<CustomerListResponse> => {
    const apiCall = async () => {
      const response = await apiClient.get(API_ENDPOINTS.customers.financial, { params });
      return response.data;
    };
    
    const mockFunction = () => {
      const typeParams = { ...params, type: 'financial' as CustomerType };
      return mockGetCustomers(typeParams);
    };
    
    return apiAdapter(apiCall, mockFunction);
  },

  // Obtenir la liste des clients corporate
  getCorporateCustomers: async (params?: CustomerFilterParams): Promise<CustomerListResponse> => {
    const apiCall = async () => {
      const response = await apiClient.get(API_ENDPOINTS.customers.corporate, { params });
      return response.data;
    };
    
    const mockFunction = () => {
      // Using 'pme' as a fallback since 'corporate' is not defined in CustomerType
      const typeParams = { ...params, type: 'pme' as CustomerType };
      return mockGetCustomers(typeParams);
    };
    
    return apiAdapter(apiCall, mockFunction);
  },

  // Obtenir la liste des clients individuels
  getIndividualCustomers: async (params?: CustomerFilterParams): Promise<CustomerListResponse> => {
    const apiCall = async () => {
      const response = await apiClient.get(API_ENDPOINTS.customers.individual, { params });
      return response.data;
    };
    
    const mockFunction = () => {
      // Using 'pme' as a fallback since 'individual' is not defined in CustomerType
      const typeParams = { ...params, type: 'pme' as CustomerType };
      return mockGetCustomers(typeParams);
    };
    
    return apiAdapter(apiCall, mockFunction);
  },

  // Obtenir un client par son ID
  getById: async (id: string): Promise<CustomerDetailsResponse> => {
    const url = replaceUrlParams(API_ENDPOINTS.customers.getById, { id });
    
    const apiCall = async () => {
      const response = await apiClient.get(url);
      return response.data;
    };
    
    return apiAdapter(apiCall, () => mockGetCustomerById(id));
  },

  // Créer un nouveau client
  create: async (customerData: CustomerFormData): Promise<Customer> => {
    const apiCall = async () => {
      const response = await apiClient.post(API_ENDPOINTS.customers.create, customerData);
      return response.data;
    };
    
    const mockFunction = () => {
      const newCustomer: Customer = {
        ...customerData,
        id: `mock-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending',
        documents: []
      };
      
      mockCustomers.push(newCustomer);
      return newCustomer;
    };
    
    return apiAdapter(apiCall, mockFunction);
  },

  // Mettre à jour un client
  update: async (id: string, customerData: Partial<CustomerFormData>): Promise<Customer> => {
    const url = replaceUrlParams(API_ENDPOINTS.customers.update, { id });
    
    const apiCall = async () => {
      const response = await apiClient.put(url, customerData);
      return response.data;
    };
    
    const mockFunction = () => {
      const customerIndex = mockCustomers.findIndex(c => c.id === id);
      if (customerIndex === -1) {
        throw new Error('Customer not found');
      }
      
      mockCustomers[customerIndex] = {
        ...mockCustomers[customerIndex],
        ...customerData,
        updatedAt: new Date().toISOString()
      };
      
      return mockCustomers[customerIndex];
    };
    
    return apiAdapter(apiCall, mockFunction);
  },

  // Supprimer un client
  delete: async (id: string): Promise<void> => {
    const url = replaceUrlParams(API_ENDPOINTS.customers.delete, { id });
    
    const apiCall = async () => {
      await apiClient.delete(url);
    };
    
    const mockFunction = () => {
      const index = mockCustomers.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCustomers.splice(index, 1);
      }
    };
    
    return apiAdapter(apiCall, mockFunction);
  },

  // Obtenir les statistiques des clients
  getStatistics: async (): Promise<CustomerStatistics> => {
    const apiCall = async () => {
      const response = await apiClient.get(API_ENDPOINTS.customers.statistics);
      return response.data;
    };
    
    return apiAdapter(apiCall, mockGetStatistics);
  }
};

export default customersApi;