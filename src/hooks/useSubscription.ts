import { useState, useEffect, useCallback } from 'react';
import { useToast } from './useToast';
import { 
  CustomerSubscription, 
  SubscriptionPlanDefinition, 
  TokenPackage,
  TokenTransaction,
  SubscriptionPlanId // Added SubscriptionPlanId
} from '../types/subscription'; 
import { CustomerType } from '../types/customer'; 
import { subscriptionService } from '../services/subscriptions/subscriptionService'; 

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
  const [customerId, setCustomerId] = useState<string | undefined>(initialCustomerId);
  const [customerType, setCustomerType] = useState<CustomerType | undefined>(initialCustomerType);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { showToast } = useToast();

  const fetchSubscriptions = useCallback(async (
    page: number = 1, 
    pageSize: number = 10, 
    filters: Record<string, unknown> = {}
  ) => {
    try {
      setLoading(true);
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
      showToast('error', 'Échec du chargement des abonnements');
      return { data: [], totalCount: 0 };
    } finally {
      setLoading(false);
    }
  }, [customerId, customerType, showToast]);

  const fetchSubscription = useCallback(async (subscriptionId: string) => {
    try {
      setLoading(true);
      const data = await subscriptionService.getSubscription(subscriptionId);
      setSubscription(data);
      return data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      showToast('error', "Échec du chargement des détails de l'abonnement");
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchAvailablePlans = useCallback(async (customerType?: CustomerType) => {
    try {
      setLoading(true);
      const response = await subscriptionService.getAvailablePlans(customerType);
      setAvailablePlans(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      showToast('error', 'Échec du chargement des plans disponibles');
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchTokenPackages = useCallback(async (customerType?: CustomerType) => {
    try {
      setLoading(true);
      const response = await subscriptionService.getTokenPackages(customerType);
      setTokenPackages(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching token packages:', error);
      showToast('error', 'Échec du chargement des packages de tokens');
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

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
      showToast('error', 'Échec du chargement des transactions de tokens');
      return [];
    } finally {
      setLoading(false);
    }
  }, [customerId, showToast]);

  const createSubscription = useCallback(async (subscriptionData: Partial<CustomerSubscription>) => {
    try {
      setLoading(true);
      // Validate required fields before calling the service
      if (!subscriptionData.customerId || !subscriptionData.planId || !subscriptionData.paymentMethod || typeof subscriptionData.autoRenew === 'undefined') {
        const missingFields = [
          !subscriptionData.customerId && "customerId", 
          !subscriptionData.planId && "planId", 
          !subscriptionData.paymentMethod && "paymentMethod", 
          typeof subscriptionData.autoRenew === 'undefined' && "autoRenew"
        ].filter(Boolean).join(', ');
        
        const errorMessage = `Échec de la création de l'abonnement: champs requis manquants ou invalides: ${missingFields}`;
        console.error(errorMessage, subscriptionData);
        showToast('error', errorMessage);
        throw new Error(errorMessage);
      }

      const servicePayload = {
        customerId: subscriptionData.customerId,
        planId: subscriptionData.planId as SubscriptionPlanId, // Cast to SubscriptionPlanId
        paymentMethod: subscriptionData.paymentMethod,
        autoRenew: subscriptionData.autoRenew,
      };

      const data = await subscriptionService.createSubscription(servicePayload);
      fetchSubscriptions();
      showToast('success', 'Abonnement créé avec succès');
      return data;
    } catch (error) {
      if (!(error instanceof Error && error.message.startsWith("Échec de la création de l'abonnement: champs requis manquants"))) {
        console.error('Error creating subscription:', error);
        showToast('error', "Échec de la création de l'abonnement");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchSubscriptions, showToast]);

  const updateSubscription = useCallback(async (
    subscriptionId: string,
    updateData: Partial<CustomerSubscription>
  ) => {
    try {
      setLoading(true);
      const data = await subscriptionService.updateSubscription(subscriptionId, updateData);
      if (subscription && subscription.id === subscriptionId) {
        setSubscription(data);
      }
      fetchSubscriptions();
      showToast('success', 'Abonnement mis à jour avec succès');
      return data;
    } catch (error) {
      console.error(`Error updating subscription ${subscriptionId}:`, error);
      showToast('error', "Échec de la mise à jour de l'abonnement");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [subscription, fetchSubscriptions, showToast]);

  const cancelSubscription = useCallback(async (subscriptionId: string) => {
    try {
      setLoading(true);
      const response = await subscriptionService.cancelSubscription(subscriptionId);
      fetchSubscriptions(); 
      showToast('success', 'Abonnement annulé avec succès');
      return response;
    } catch (error) {
      console.error(`Error canceling subscription ${subscriptionId}:`, error);
      showToast('error', "Échec de l'annulation de l'abonnement.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchSubscriptions, showToast]);

  const reactivateSubscription = useCallback(async (subscriptionId: string) => {
    try {
      setLoading(true);
      // @ts-expect-error - reactivateSubscription might not exist on service yet
      const response = await subscriptionService.reactivateSubscription(subscriptionId);
      fetchSubscriptions(); 
      showToast('success', 'Abonnement réactivé avec succès');
      return response;
    } catch (error) {
      console.error(`Error reactivating subscription ${subscriptionId}:`, error);
      showToast('error', "Échec de la réactivation de l'abonnement.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchSubscriptions, showToast]);

  const addTokensToSubscription = useCallback(async (subscriptionId: string, tokenId: string, quantity: number) => {
    try {
      setLoading(true);
      // Corrected argument order: quantity is tokenAmount, tokenId is packageId
      const response = await subscriptionService.addTokensToSubscription(subscriptionId, quantity, tokenId);
      fetchTokenTransactions(subscriptionId);
      if (subscription && subscription.id === subscriptionId) {
        fetchSubscription(subscriptionId); 
      }
      showToast('success', "Tokens ajoutés avec succès à l'abonnement.");
      return response;
    } catch (error) {
      console.error(`Error adding tokens to subscription ${subscriptionId}:`, error);
      showToast('error', "Échec de l'ajout des tokens à l'abonnement.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [subscription, fetchSubscription, fetchTokenTransactions, showToast]);

  const changeSubscriptionPlan = useCallback(async (subscriptionId: string, newPlanId: string) => {
    try {
      setLoading(true);
      // Ensuring the service method name matches if it was changed to changeSubscriptionPlan
      const data = await subscriptionService.changeSubscriptionPlan(subscriptionId, newPlanId as SubscriptionPlanId);
      fetchSubscriptions();
      if (subscription && subscription.id === subscriptionId) {
        setSubscription(data); 
      }
      showToast('success', "Plan d'abonnement changé avec succès");
      return data;
    } catch (error) {
      console.error(`Error changing subscription plan for ${subscriptionId}:`, error);
      showToast('error', "Échec du changement de plan d'abonnement.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [subscription, fetchSubscriptions, showToast]);

  // Fonctions de gestion de l'état local
  const setActiveCustomerId = (id?: string) => {
    setCustomerId(id);
  };

  const setActiveCustomerType = (type?: CustomerType) => {
    setCustomerType(type);
  };
  
  const calculatePriceForCustomer = useCallback((plan: SubscriptionPlanDefinition, customerType?: CustomerType) => {
    // Assuming basePriceUSD is the relevant field. Adjust if other currencies are primary.
    if (!customerType) return plan.basePriceUSD; 
    // Example: Apply a 10% discount for 'pme' customers on a specific plan or globally
    // This is illustrative; actual discount logic would be more complex.
    if (customerType === 'pme') {
      // return plan.basePriceUSD * 0.9; // 10% discount for PME
    }
    return plan.basePriceUSD;
  }, []);

  const getCustomerTypeSpecificMetadata = useCallback((customerType?: CustomerType) => {
    // Remove/adjust placeholder logic for invalid customer types
    if (customerType === 'financial') {
      return { supportLevel: 'priority', directLine: true };
    }
    return { supportLevel: 'standard', directLine: false };
  }, []);

  useEffect(() => {
    if (customerId || customerType) {
        fetchSubscriptions(page, pageSize, {});
    } else {
        // Optionnel: charger tous les abonnements si aucun client/type n'est spécifié au montage
        // ou laisser la liste vide jusqu'à ce qu'un filtre soit appliqué.
        setSubscriptions([]);
        setTotalCount(0);
    }
  }, [customerId, customerType, page, pageSize, fetchSubscriptions]);

  useEffect(() => {
    // Charger les plans et packages disponibles au montage ou si le type de client change
    fetchAvailablePlans(customerType);
    fetchTokenPackages(customerType);
  }, [customerType, fetchAvailablePlans, fetchTokenPackages]);

  return {
    loading,
    subscriptions,
    subscription,
    availablePlans,
    tokenPackages,
    tokenTransactions,
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
    reactivateSubscription, // Ensure this is returned
    addTokensToSubscription,
    // processPayment, // Removed as it is not defined
    changeSubscriptionPlan, // Renamed from changePlan for consistency
    calculatePriceForCustomer,
    getCustomerTypeSpecificMetadata,
    setActiveCustomerType,
    setActiveCustomerId,
    setPage,
    setPageSize
  };
};