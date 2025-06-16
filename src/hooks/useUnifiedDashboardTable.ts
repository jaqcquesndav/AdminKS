import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useCustomers } from './useCustomers';
import { usePayments } from './usePayments';
import { useSubscriptions } from './useSubscriptions';
import { useTokens } from './useTokens';
import { Customer, CustomerStatus } from '../types/customer';
import { Payment, Subscription, TokenTransaction, TransactionStatus, SubscriptionStatus } from '../types/finance';

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
  // Utiliser les hooks sources pour obtenir les données
  const { 
    customers, 
    isLoading: isCustomersLoading, 
    loadCustomers
  } = useCustomers();

  const {
    payments,
    isLoading: isPaymentsLoading,
    error: paymentsError,
    fetchPayments
  } = usePayments();

  const {
    subscriptions,
    isLoading: isSubscriptionsLoading,
    error: subscriptionsError,
    fetchSubscriptions
  } = useSubscriptions();

  const {
    tokenTransactions,
    isLoading: isTokensLoading,
    error: tokensError,
    fetchTokenTransactions
  } = useTokens();
  // Fonction pour convertir les données sources en format DashboardItem
  const mapCustomerToDashboardItem = useCallback((customer: Customer): DashboardItem => {
    return {
      id: customer.id || `customer-${Math.random().toString(36).substr(2, 9)}`,
      type: 'customer',
      date: customer.createdAt || new Date().toISOString(),
      customerName: customer.name || 'Unknown Company',
      customerId: customer.id || '',
      customerType: customer.type || 'pme',
      status: customer.status,
      details: `${customer.type === 'financial' ? 'Institution financière' : 'PME'} - ${customer.phone || 'Pas de contact'}`,
      actionUrl: `/customers/${customer.id}`
    };
  }, []);
  const mapPaymentToDashboardItem = useCallback((payment: Payment): DashboardItem => {
    return {
      id: payment.id,
      type: 'payment',
      date: payment.paidAt || payment.createdAt || new Date().toISOString(),
      customerName: payment.customerName || 'Client inconnu',
      customerId: payment.customerId || '',
      customerType: 'pme', // Valeur par défaut car non présente dans le type Payment
      status: payment.status,
      amount: payment.amount,
      details: payment.description || `Paiement ${payment.method ? `via ${payment.method}` : ''}`,
      actionUrl: `/finance/payments/${payment.id}`
    };
  }, []);

  const mapSubscriptionToDashboardItem = useCallback((subscription: Subscription): DashboardItem => {
    return {
      id: subscription.id,
      type: 'subscription',
      date: subscription.startDate || subscription.createdAt || new Date().toISOString(),
      customerName: subscription.customerName || 'Client inconnu',
      customerId: subscription.customerId || '',
      customerType: 'pme', // Valeur par défaut car non présente dans le type Subscription
      status: subscription.status,
      amount: subscription.amount,
      details: `${subscription.planName || 'Abonnement'} - ${subscription.billingCycle || 'Mensuel'}`,
      actionUrl: `/finance/subscriptions/${subscription.id}`
    };
  }, []);

  const mapTokenTransactionToDashboardItem = useCallback((transaction: TokenTransaction): DashboardItem => {
    return {
      id: transaction.id,
      type: 'token',
      date: transaction.transactionDate || new Date().toISOString(),
      customerName: transaction.customerName || 'Client inconnu',
      customerId: transaction.customerId || '',
      customerType: 'pme', // Valeur par défaut car non présente dans le type TokenTransaction
      status: 'active', // Valeur par défaut car non présente dans le type TokenTransaction
      amount: transaction.amount, // Utilise amount au lieu de quantity
      details: transaction.description || `Transaction de ${transaction.amount} tokens`,
      actionUrl: `/finance/tokens/${transaction.id}`
    };
  }, []);
  // Fonction pour charger toutes les données
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Chargement des données de chaque source
      await Promise.all([
        loadCustomers({ page: 1, limit: 10, status: filters.status !== 'all' ? filters.status as CustomerStatus : undefined }),
        fetchPayments({ page: 1, limit: 10, status: filters.status !== 'all' ? filters.status as TransactionStatus : undefined }),
        fetchSubscriptions({ page: 1, limit: 10, status: filters.status !== 'all' ? filters.status as SubscriptionStatus : undefined }),
        fetchTokenTransactions({ page: 1, limit: 10 }) // Note: status n'existe pas pour TokenTransactionFilterParams
      ]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [
    loadCustomers, 
    fetchPayments, 
    fetchSubscriptions, 
    fetchTokenTransactions, 
    filters.status
  ]);

  // Convertir et combiner les données dès qu'elles sont disponibles
  useEffect(() => {
    // Vérifier si toutes les données sont chargées
    if (isCustomersLoading || isPaymentsLoading || isSubscriptionsLoading || isTokensLoading) {
      setIsLoading(true);
      return;
    }    // Vérifier s'il y a des erreurs
    if (paymentsError || subscriptionsError || tokensError) {
      const errorMessage = [
        paymentsError?.message, 
        subscriptionsError?.message, 
        tokensError?.message
      ].filter(Boolean).join(', ');
      
      setError(new Error(`Erreur lors du chargement des données: ${errorMessage}`));
      setIsLoading(false);
      return;
    }

    // Mapper les données en items de tableau de bord
    let combinedItems: DashboardItem[] = [];

    // Ajouter les clients si le filtre le permet
    if (filters.type === 'all' || filters.type === 'customer') {
      combinedItems = [...combinedItems, ...customers.map(mapCustomerToDashboardItem)];
    }

    // Ajouter les paiements si le filtre le permet
    if (filters.type === 'all' || filters.type === 'payment') {
      combinedItems = [...combinedItems, ...payments.map(mapPaymentToDashboardItem)];
    }

    // Ajouter les abonnements si le filtre le permet
    if (filters.type === 'all' || filters.type === 'subscription') {
      combinedItems = [...combinedItems, ...subscriptions.map(mapSubscriptionToDashboardItem)];
    }

    // Ajouter les transactions de tokens si le filtre le permet
    if (filters.type === 'all' || filters.type === 'token') {
      combinedItems = [...combinedItems, ...tokenTransactions.map(mapTokenTransactionToDashboardItem)];
    }

    // Filtrage par recherche
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase();
      combinedItems = combinedItems.filter(item => 
        item.customerName.toLowerCase().includes(searchTerm) ||
        item.customerId.toLowerCase().includes(searchTerm) ||
        item.details.toLowerCase().includes(searchTerm)
      );
    }

    // Tri
    if (filters.sortBy) {
      const sortKey = filters.sortBy as keyof DashboardItem;
      combinedItems.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        
        // Handle undefined values
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return filters.sortDirection === 'asc' ? -1 : 1;
        if (bValue === undefined) return filters.sortDirection === 'asc' ? 1 : -1;
        
        // Compare values
        if (aValue < bValue) {
          return filters.sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return filters.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // Enregistrer le nombre total avant la pagination
    setTotalItems(combinedItems.length);

    // Pagination
    const startIndex = ((filters.page || 1) - 1) * (filters.pageSize || 10);
    const endIndex = startIndex + (filters.pageSize || 10);
    combinedItems = combinedItems.slice(startIndex, endIndex);

    setItems(combinedItems);
    setIsLoading(false);  }, [
    customers, 
    payments, 
    subscriptions, 
    tokenTransactions, 
    isCustomersLoading, 
    isPaymentsLoading, 
    isSubscriptionsLoading, 
    isTokensLoading,
    paymentsError,
    subscriptionsError,
    tokensError,
    filters,
    mapCustomerToDashboardItem,
    mapPaymentToDashboardItem,
    mapSubscriptionToDashboardItem,
    mapTokenTransactionToDashboardItem
  ]);

  // Charger les données initiales
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, filters, i18n.language]);

  // Mettre à jour les filtres
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