import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Types
type ItemType = 'customer' | 'payment' | 'subscription' | 'token';

interface DashboardItem {
  id: string;
  type: ItemType;
  date: string;
  customerName: string;
  customerId: string;
  customerType: 'pme' | 'financial';
  status: string;
  amount?: number;
  details: string;
  actionUrl: string;
}

interface UnifiedDashboardTableFilters {
  search?: string;
  type?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

interface UseUnifiedDashboardTableResult {
  items: DashboardItem[];
  totalItems: number;
  isLoading: boolean;
  error: Error | null;
  filters: UnifiedDashboardTableFilters;
  setFilters: (filters: Partial<UnifiedDashboardTableFilters>) => void;
}

export function useUnifiedDashboardTable(): UseUnifiedDashboardTableResult {
  const { i18n } = useTranslation();
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<UnifiedDashboardTableFilters>({
    search: '',
    type: 'all',
    status: 'all',
    sortBy: 'date',
    sortDirection: 'desc',
    page: 1,
    pageSize: 10
  });

  // Cette fonction sera remplacée par un appel API
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulation d'un délai de chargement pour imiter un appel API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Données simulées - à remplacer par un appel API
      const mockData: DashboardItem[] = [
        {
          id: 'cust-001',
          type: 'customer',
          date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          customerName: 'Acme Corporation',
          customerId: 'C12345',
          customerType: 'pme',
          status: 'pending',
          details: 'Nouveau client en attente de validation',
          actionUrl: '/customers/cust-001'
        },
        {
          id: 'pay-001',
          type: 'payment',
          date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          customerName: 'Global Finance Ltd',
          customerId: 'C12346',
          customerType: 'financial',
          status: 'approved',
          amount: 2500.00,
          details: 'Paiement trimestriel',
          actionUrl: '/finance/payments/pay-001'
        },
        {
          id: 'sub-001',
          type: 'subscription',
          date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          customerName: 'Tech Innovators',
          customerId: 'C12347',
          customerType: 'pme',
          status: 'active',
          amount: 199.99,
          details: 'Abonnement Premium - Renouvellement mensuel',
          actionUrl: '/subscription/sub-001'
        },
        {
          id: 'tok-001',
          type: 'token',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          customerName: 'DataAnalytics SA',
          customerId: 'C12348',
          customerType: 'pme',
          status: 'pending',
          amount: 500,
          details: 'Demande de 500 tokens supplémentaires',
          actionUrl: '/finance/tokens/tok-001'
        },
        {
          id: 'cust-002',
          type: 'customer',
          date: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
          customerName: 'XYZ Industries',
          customerId: 'C12349',
          customerType: 'pme',
          status: 'active',
          details: 'Client activé',
          actionUrl: '/customers/cust-002'
        },
        {
          id: 'pay-002',
          type: 'payment',
          date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          customerName: 'French Investment Bank',
          customerId: 'C12350',
          customerType: 'financial',
          status: 'rejected',
          amount: 5000.00,
          details: 'Paiement rejeté - solde insuffisant',
          actionUrl: '/finance/payments/pay-002'
        },
        {
          id: 'sub-002',
          type: 'subscription',
          date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
          customerName: 'SmartSolutions',
          customerId: 'C12351',
          customerType: 'pme',
          status: 'inactive',
          amount: 49.99,
          details: 'Abonnement Standard - Expiré',
          actionUrl: '/subscription/sub-002'
        },
        {
          id: 'tok-002',
          type: 'token',
          date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
          customerName: 'CyberSec Partners',
          customerId: 'C12352',
          customerType: 'pme',
          status: 'approved',
          amount: 1000,
          details: 'Allocation de 1000 tokens approuvée',
          actionUrl: '/finance/tokens/tok-002'
        },
        {
          id: 'cust-003',
          type: 'customer',
          date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
          customerName: 'GreenEnergy Co',
          customerId: 'C12353',
          customerType: 'pme',
          status: 'pending',
          details: 'En attente de documents KYC',
          actionUrl: '/customers/cust-003'
        },
        {
          id: 'pay-003',
          type: 'payment',
          date: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
          customerName: 'Banque Centrale de Paris',
          customerId: 'C12354',
          customerType: 'financial',
          status: 'approved',
          amount: 10000.00,
          details: 'Paiement annuel',
          actionUrl: '/finance/payments/pay-003'
        },
        {
          id: 'sub-003',
          type: 'subscription',
          date: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
          customerName: 'Digital Marketing Agency',
          customerId: 'C12355',
          customerType: 'pme',
          status: 'active',
          amount: 299.99,
          details: 'Abonnement Enterprise - Mensuel',
          actionUrl: '/subscription/sub-003'
        }
      ];

      // Filtrage et tri des données
      let filteredData = [...mockData];
      
      // Filtre par recherche
      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.customerName.toLowerCase().includes(searchTerm) ||
          item.customerId.toLowerCase().includes(searchTerm) ||
          item.details.toLowerCase().includes(searchTerm)
        );
      }
      
      // Filtre par type
      if (filters.type && filters.type !== 'all') {
        filteredData = filteredData.filter(item => item.type === filters.type);
      }
      
      // Filtre par statut
      if (filters.status && filters.status !== 'all') {
        filteredData = filteredData.filter(item => item.status === filters.status);
      }
      
      // Tri
      if (filters.sortBy) {
        const sortKey = filters.sortBy as keyof DashboardItem;
        filteredData.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) {
            return filters.sortDirection === 'asc' ? -1 : 1;
          }
          if (a[sortKey] > b[sortKey]) {
            return filters.sortDirection === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      // Enregistrer le nombre total avant la pagination
      setTotalItems(filteredData.length);

      // Pagination
      const startIndex = ((filters.page || 1) - 1) * (filters.pageSize || 10);
      const endIndex = startIndex + (filters.pageSize || 10);
      filteredData = filteredData.slice(startIndex, endIndex);

      setItems(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, i18n.language]);

  const updateFilters = (newFilters: Partial<UnifiedDashboardTableFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Si on change un filtre, revenir à la première page
      page: newFilters.page || (Object.keys(newFilters).length > 0 && !newFilters.page ? 1 : prev.page)
    }));
  };

  return {
    items,
    totalItems,
    isLoading,
    error,
    filters,
    setFilters: updateFilters
  };
}