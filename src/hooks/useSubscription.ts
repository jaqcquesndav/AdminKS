import { useState, useEffect, useCallback } from 'react';
import { useToast } from './useToast';
import { useCurrencySettings } from './useCurrencySettings';
import { 
  CustomerSubscription, 
  SubscriptionPlanDefinition, 
  TokenPackage,
  TokenTransaction,
  PaymentTransaction,
  PlanStatus
} from '../types/subscription';
import { CustomerType } from '../types/customer';
import { subscriptionService } from '../services/subscriptionService';

interface UseSubscriptionProps {
  initialCustomerId?: string;
  initialCustomerType?: CustomerType;
}

export const useSubscription = ({
  initialCustomerId,
  initialCustomerType
}: UseSubscriptionProps = {}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [subscriptions, setSubscriptions] = useState<CustomerSubscription[]>([]);
  const [subscription, setSubscription] = useState<CustomerSubscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlanDefinition[]>([]);
  const [tokenPackages, setTokenPackages] = useState<TokenPackage[]>([]);
  const [tokenTransactions, setTokenTransactions] = useState<TokenTransaction[]>([]);
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>([]);
  const [customerId, setCustomerId] = useState<string | undefined>(initialCustomerId);
  const [customerType, setCustomerType] = useState<CustomerType | undefined>(initialCustomerType);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { showToast } = useToast();
  const { convertCurrency, currentCurrency } = useCurrencySettings();

  // Récupérer les abonnements du client
  const fetchSubscriptions = useCallback(async (
    page: number = 1, 
    pageSize: number = 10, 
    filters: Record<string, any> = {}
  ) => {
    try {
      setLoading(true);
      
      // Ajouter les filtres pour le client si nécessaire
      if (customerId) {
        filters.customerId = customerId;
      }
      
      if (customerType) {
        filters.customerType = customerType;
      }
      
      const response = await subscriptionService.getSubscriptions(page, pageSize, filters);
      
      setSubscriptions(response.data);
      setTotalCount(response.totalCount);
      
      return response;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      showToast('Échec du chargement des abonnements', 'error');
      return { data: [], totalCount: 0 };
    } finally {
      setLoading(false);
    }
  }, [customerId, customerType, showToast]);

  // Récupérer un abonnement spécifique
  const fetchSubscription = useCallback(async (subscriptionId: string) => {
    try {
      setLoading(true);
      
      const data = await subscriptionService.getSubscription(subscriptionId);
      
      setSubscription(data);
      return data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      showToast('Échec du chargement des détails de l\'abonnement', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Récupérer les plans disponibles
  const fetchAvailablePlans = useCallback(async (customerType?: CustomerType) => {
    try {
      setLoading(true);
      
      const response = await subscriptionService.getAvailablePlans(customerType);
      
      setAvailablePlans(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      showToast('Échec du chargement des plans disponibles', 'error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Récupérer les packages de tokens
  const fetchTokenPackages = useCallback(async (customerType?: CustomerType) => {
    try {
      setLoading(true);
      
      const response = await subscriptionService.getTokenPackages(customerType);
      
      setTokenPackages(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching token packages:', error);
      showToast('Échec du chargement des packages de tokens', 'error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Récupérer les transactions de tokens
  const fetchTokenTransactions = useCallback(async (
    subscriptionId?: string,
    page: number = 1, 
    pageSize: number = 10
  ) => {
    try {
      setLoading(true);
      
      const response = await subscriptionService.getTokenTransactions(
        customerId,
        subscriptionId,
        page,
        pageSize
      );
      
      setTokenTransactions(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching token transactions:', error);
      showToast('Échec du chargement des transactions de tokens', 'error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [customerId, showToast]);

  // Créer un nouvel abonnement
  const createSubscription = useCallback(async (subscriptionData: Partial<CustomerSubscription>) => {
    try {
      setLoading(true);
      
      const data = await subscriptionService.createSubscription(subscriptionData);
      
      // Mettre à jour la liste des abonnements
      fetchSubscriptions();
      
      showToast('Abonnement créé avec succès', 'success');
      return data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      showToast('Échec de la création de l\'abonnement', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchSubscriptions, showToast]);

  // Mettre à jour un abonnement
  const updateSubscription = useCallback(async (
    subscriptionId: string,
    updateData: Partial<CustomerSubscription>
  ) => {
    try {
      setLoading(true);
      
      const data = await subscriptionService.updateSubscription(subscriptionId, updateData);
      
      // Mettre à jour l'abonnement en cours si c'est celui qui est modifié
      if (subscription && subscription.id === subscriptionId) {
        setSubscription(data);
      }
      
      // Mettre à jour la liste des abonnements
      fetchSubscriptions();
      
      showToast('Abonnement mis à jour avec succès', 'success');
      return data;
    } catch (error) {
      console.error(`Error updating subscription ${subscriptionId}:`, error);
      showToast('Échec de la mise à jour de l\'abonnement', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [subscription, fetchSubscriptions, showToast]);

  // Annuler un abonnement
  const cancelSubscription = useCallback(async (
    subscriptionId: string,
    reason?: string,
    endImmediately: boolean = false
  ) => {
    try {
      setLoading(true);
      
      const data = await subscriptionService.cancelSubscription(subscriptionId, reason, endImmediately);
      
      // Mettre à jour l'abonnement en cours si c'est celui qui est annulé
      if (subscription && subscription.id === subscriptionId) {
        setSubscription(data);
      }
      
      // Mettre à jour la liste des abonnements
      fetchSubscriptions();
      
      showToast('Abonnement annulé avec succès', 'success');
      return data;
    } catch (error) {
      console.error(`Error cancelling subscription ${subscriptionId}:`, error);
      showToast('Échec de l\'annulation de l\'abonnement', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [subscription, fetchSubscriptions, showToast]);

  // Ajouter des tokens à un abonnement
  const addTokensToSubscription = useCallback(async (
    subscriptionId: string,
    tokenAmount: number,
    packageId?: string,
    price?: number,
    currency?: string,
    validUntil?: string
  ) => {
    try {
      setLoading(true);
      
      const result = await subscriptionService.addTokensToSubscription(
        subscriptionId,
        tokenAmount,
        packageId,
        price,
        currency,
        validUntil
      );
      
      // Mettre à jour l'abonnement en cours si c'est celui auquel on ajoute des tokens
      if (subscription && subscription.id === subscriptionId) {
        setSubscription(result.subscription);
      }
      
      // Mettre à jour la liste des transactions de tokens
      fetchTokenTransactions(subscriptionId);
      
      showToast(`${tokenAmount} tokens ajoutés avec succès`, 'success');
      return result;
    } catch (error) {
      console.error(`Error adding tokens to subscription ${subscriptionId}:`, error);
      showToast('Échec de l\'ajout de tokens', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [subscription, fetchTokenTransactions, showToast]);

  // Traiter un paiement pour un abonnement
  const processPayment = useCallback(async (
    subscriptionId: string,
    paymentData: Partial<PaymentTransaction>
  ) => {
    try {
      setLoading(true);
      
      const result = await subscriptionService.processPayment(subscriptionId, paymentData);
      
      showToast('Paiement traité avec succès', 'success');
      return result;
    } catch (error) {
      console.error(`Error processing payment for subscription ${subscriptionId}:`, error);
      showToast('Échec du traitement du paiement', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Changer le plan d'abonnement
  const changePlan = useCallback(async (
    subscriptionId: string,
    newPlanId: string,
    effectiveDate?: string,
    prorateFees: boolean = true
  ) => {
    try {
      setLoading(true);
      
      const data = await subscriptionService.changePlan(
        subscriptionId,
        newPlanId,
        effectiveDate,
        prorateFees
      );
      
      // Mettre à jour l'abonnement en cours si c'est celui dont on change le plan
      if (subscription && subscription.id === subscriptionId) {
        setSubscription(data);
      }
      
      // Mettre à jour la liste des abonnements
      fetchSubscriptions();
      
      showToast('Plan d\'abonnement changé avec succès', 'success');
      return data;
    } catch (error) {
      console.error(`Error changing plan for subscription ${subscriptionId}:`, error);
      showToast('Échec du changement de plan', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [subscription, fetchSubscriptions, showToast]);

  // Calculer le prix pour un client spécifique
  const calculatePriceForCustomer = useCallback((
    basePrice: number,
    customerType: CustomerType,
    applicationGroup: any,
    billingCycle: 'monthly' | 'yearly'
  ) => {
    return subscriptionService.calculatePriceForCustomer(
      basePrice, 
      customerType, 
      applicationGroup, 
      billingCycle
    );
  }, []);

  // Obtenir les métadonnées spécifiques au type de client
  const getCustomerTypeSpecificMetadata = useCallback((customerType: CustomerType) => {
    return subscriptionService.getCustomerTypeSpecificMetadata(customerType);
  }, []);

  // Changer le type de client (pour le contexte actuel)
  const setActiveCustomerType = useCallback((type: CustomerType) => {
    setCustomerType(type);
    
    // Recharger les plans disponibles et les packages de tokens pour ce type de client
    fetchAvailablePlans(type);
    fetchTokenPackages(type);
  }, [fetchAvailablePlans, fetchTokenPackages]);

  // Changer l'ID du client (pour le contexte actuel)
  const setActiveCustomerId = useCallback((id: string) => {
    setCustomerId(id);
    
    // Recharger les abonnements pour ce client
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Charger les données initiales au montage du composant
  useEffect(() => {
    if (customerType) {
      fetchAvailablePlans(customerType);
      fetchTokenPackages(customerType);
    }
    
    if (customerId) {
      fetchSubscriptions();
    }
  }, [customerType, customerId, fetchAvailablePlans, fetchTokenPackages, fetchSubscriptions]);

  return {
    loading,
    subscriptions,
    subscription,
    availablePlans,
    tokenPackages,
    tokenTransactions,
    paymentTransactions,
    totalCount,
    page,
    pageSize,
    customerId,
    customerType,
    fetchSubscriptions,
    fetchSubscription,
    fetchAvailablePlans,
    fetchTokenPackages,
    fetchTokenTransactions,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    addTokensToSubscription,
    processPayment,
    changePlan,
    calculatePriceForCustomer,
    getCustomerTypeSpecificMetadata,
    setActiveCustomerType,
    setActiveCustomerId,
    setPage,
    setPageSize
  };
};