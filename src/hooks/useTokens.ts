import { useState, useEffect, useCallback, useRef } from 'react';
import { useFinanceService } from './useFinanceService';
import type { TokenTransaction, TokenTransactionFilterParams, TokenPackage, PaginatedResponse } from '../types/finance';
import { useToast } from './useToast';
import { isEqual } from 'lodash'; // Importer lodash pour la comparaison d'objets

export const useTokens = (initialLoadParams?: TokenTransactionFilterParams) => {
  const financeService = useFinanceService();
  const { showToast } = useToast();

  const [tokenTransactions, setTokenTransactions] = useState<TokenTransaction[]>([]);
  const [tokenPackages, setTokenPackages] = useState<TokenPackage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<{ totalCount: number; page: number; totalPages: number } | null>(null);
  
  // Refs pour éviter les appels API en double ou en boucle
  const initialLoadComplete = useRef(false);
  const lastFetchParams = useRef<TokenTransactionFilterParams | undefined>(undefined);
  const fetchInProgress = useRef(false);

  const fetchTokenPackages = useCallback(async () => {
    // Éviter les appels API en parallèle pour les packages
    if (fetchInProgress.current) return;
    
    try {
      fetchInProgress.current = true;
      const packages = await financeService.getTokenPackages();
      setTokenPackages(packages);
    } catch (err) {
      const e = err as Error;
      showToast('error', `Failed to fetch token packages: ${e.message}`);
      console.error('Failed to fetch token packages:', e);
    } finally {
      fetchInProgress.current = false;
    }
  }, [financeService, showToast]);

  const fetchTokenTransactions = useCallback(async (params?: TokenTransactionFilterParams) => {
    // Éviter les appels API en double pour les mêmes paramètres
    if (fetchInProgress.current) {
      console.log('Fetch already in progress, skipping duplicate request');
      return;
    }
    
    // Vérifier si les paramètres sont identiques à la dernière requête
    if (lastFetchParams.current && params && isEqual(lastFetchParams.current, params)) {
      console.log('Same fetch parameters, skipping duplicate request');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    fetchInProgress.current = true;
    lastFetchParams.current = params;
    
    try {
      const response: PaginatedResponse<TokenTransaction> = await financeService.getTokenTransactions(params);
      setTokenTransactions(response.items);
      setPagination({
        totalCount: response.totalCount,
        page: response.page,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch token transactions: ${e.message}`);
      console.error('Failed to fetch token transactions:', err);
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [financeService, showToast]);

  useEffect(() => {
    // N'effectuer le chargement initial qu'une seule fois
    if (!initialLoadComplete.current && initialLoadParams) {
      console.log('Initial load of token data with params:', initialLoadParams);
      fetchTokenTransactions(initialLoadParams);
      fetchTokenPackages();
      initialLoadComplete.current = true;
    }
  }, [fetchTokenTransactions, fetchTokenPackages, initialLoadParams]);

  const getCustomerTokenBalance = useCallback(async (customerId: string, tokenType?: string) => {
    if (fetchInProgress.current) {
      console.log('Another operation in progress, delaying balance check');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    fetchInProgress.current = true;
    
    try {
      const balance = await financeService.getCustomerTokenBalance(customerId, tokenType);
      return balance;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch token balance for customer ${customerId}: ${e.message}`);
      return null;
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [financeService, showToast]);

  return {
    tokenTransactions,
    tokenPackages,
    isLoading,
    error,
    pagination,
    fetchTokenTransactions,
    fetchTokenPackages,
    getCustomerTokenBalance,
  };
};
