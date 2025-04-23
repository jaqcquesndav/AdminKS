import { useState, useEffect, useCallback } from 'react';
import { 
  SupportedCurrency, 
  ExchangeRate,
  DEFAULT_EXCHANGE_RATES
} from '../types/currency';
import { updateExchangeRates, getCurrentExchangeRates } from '../utils/currency';

interface ExchangeRatesHistory {
  rates: ExchangeRate[];
  loading: boolean;
  error: string | null;
  lastUpdated: string;
  getRate: (from: SupportedCurrency, to: SupportedCurrency) => number;
  getRateHistory: (from: SupportedCurrency, to: SupportedCurrency, days?: number) => ExchangeRate[];
  refreshRates: () => Promise<void>;
}

// Intervalle de rafraîchissement des taux de change en ms (1 heure par défaut)
const DEFAULT_REFRESH_INTERVAL = 60 * 60 * 1000;

/**
 * Hook pour suivre l'historique des taux de change entre les devises supportées
 * @param days Nombre de jours d'historique à récupérer (par défaut 30)
 * @param autoRefresh Active le rafraîchissement automatique des taux de change
 * @param refreshInterval Intervalle de rafraîchissement en ms
 */
export function useExchangeRates(
  days: number = 30, 
  autoRefresh: boolean = true,
  refreshInterval: number = DEFAULT_REFRESH_INTERVAL
): ExchangeRatesHistory {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(getCurrentExchangeRates().lastUpdated);

  /**
   * Récupère les taux de change depuis l'API et met à jour le système
   */
  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      
      // Dans une application réelle, vous feriez un appel API ici pour les taux actuels
      // Exemple:
      // const response = await fetch('https://api.exchangerate.host/latest?base=USD');
      // const data = await response.json();
      // if (data && data.rates) { ... }
      
      // Simuler un appel API avec des données fictives
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const baseRates = {
            'USD-CDF': DEFAULT_EXCHANGE_RATES.rates.CDF,
            'USD-FCFA': DEFAULT_EXCHANGE_RATES.rates.FCFA,
            'CDF-FCFA': DEFAULT_EXCHANGE_RATES.rates.FCFA / DEFAULT_EXCHANGE_RATES.rates.CDF,
          };
          
          const today = new Date();
          const generatedRates: ExchangeRate[] = [];
          
          // Générer un historique fictif pour les jours demandés
          for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            // Variation quotidienne aléatoire de +/- 1%
            const dailyVariation = () => 1 + (Math.random() * 0.02 - 0.01);
            
            generatedRates.push(
              {
                from: 'USD',
                to: 'CDF',
                rate: baseRates['USD-CDF'] * dailyVariation(),
                date: dateString
              },
              {
                from: 'USD',
                to: 'FCFA',
                rate: baseRates['USD-FCFA'] * dailyVariation(),
                date: dateString
              },
              {
                from: 'CDF',
                to: 'FCFA',
                rate: baseRates['CDF-FCFA'] * dailyVariation(),
                date: dateString
              },
              // Ajouter les taux inverses
              {
                from: 'CDF',
                to: 'USD',
                rate: 1 / (baseRates['USD-CDF'] * dailyVariation()),
                date: dateString
              },
              {
                from: 'FCFA',
                to: 'USD',
                rate: 1 / (baseRates['USD-FCFA'] * dailyVariation()),
                date: dateString
              },
              {
                from: 'FCFA',
                to: 'CDF',
                rate: 1 / (baseRates['CDF-FCFA'] * dailyVariation()),
                date: dateString
              }
            );
          }
          
          setRates(generatedRates);
          
          // IMPORTANT: Mettre à jour les taux de change du système
          // Prendre les taux les plus récents pour mettre à jour le système
          const latestRates = generatedRates.filter(r => r.date === generatedRates[0]?.date);
          
          const systemRates: Record<SupportedCurrency, number> = {
            USD: 1,
            CDF: latestRates.find(r => r.from === 'USD' && r.to === 'CDF')?.rate || DEFAULT_EXCHANGE_RATES.rates.CDF,
            FCFA: latestRates.find(r => r.from === 'USD' && r.to === 'FCFA')?.rate || DEFAULT_EXCHANGE_RATES.rates.FCFA
          };
          
          const timestamp = new Date().toISOString();
          
          // Mettre à jour les taux de change dans le système global
          updateExchangeRates(systemRates, timestamp);
          setLastUpdated(timestamp);
          
          setLoading(false);
          resolve();
        }, 1000);
      });
      
    } catch (err) {
      const errorMsg = "Erreur lors de la récupération des taux de change";
      console.error(errorMsg, err);
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }
  }, [days]);
  
  // Récupérer les taux de change au chargement et configurer un intervalle de rafraîchissement
  useEffect(() => {
    fetchRates();
    
    // Configuration du rafraîchissement automatique si activé
    let intervalId: number | undefined;
    if (autoRefresh) {
      intervalId = window.setInterval(() => {
        fetchRates().catch(console.error);
      }, refreshInterval);
    }
    
    // Nettoyer l'intervalle lors du démontage du composant
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchRates, autoRefresh, refreshInterval]);
  
  /**
   * Récupère le taux de change actuel entre deux devises
   */
  const getRate = (from: SupportedCurrency, to: SupportedCurrency): number => {
    if (from === to) return 1;
    
    const latestRates = rates.filter(r => r.date === rates[0]?.date);
    const rate = latestRates.find(r => r.from === from && r.to === to);
    
    if (rate) return rate.rate;
    
    // Si la conversion directe n'existe pas, passer par USD
    const fromToUSD = latestRates.find(r => r.from === from && r.to === 'USD');
    const usdToTarget = latestRates.find(r => r.from === 'USD' && r.to === to);
    
    if (fromToUSD && usdToTarget) {
      return fromToUSD.rate * usdToTarget.rate;
    }
    
    // Utiliser les taux de change du système comme valeurs par défaut
    const currentRates = getCurrentExchangeRates().rates;
    
    // Valeurs par défaut au cas où les données ne sont pas disponibles
    if (from === 'USD' && to === 'CDF') return currentRates.CDF;
    if (from === 'USD' && to === 'FCFA') return currentRates.FCFA;
    if (from === 'CDF' && to === 'USD') return 1 / currentRates.CDF;
    if (from === 'FCFA' && to === 'USD') return 1 / currentRates.FCFA;
    if (from === 'CDF' && to === 'FCFA') return currentRates.FCFA / currentRates.CDF;
    if (from === 'FCFA' && to === 'CDF') return currentRates.CDF / currentRates.FCFA;
    
    return 1;
  };
  
  /**
   * Récupère l'historique des taux de change entre deux devises
   */
  const getRateHistory = (from: SupportedCurrency, to: SupportedCurrency, period: number = days): ExchangeRate[] => {
    if (from === to) {
      // Si même devise, créer un historique avec taux = 1
      return Array.from({ length: period }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          from,
          to,
          rate: 1,
          date: date.toISOString().split('T')[0]
        };
      });
    }
    
    // Filtrer l'historique pour les devises demandées
    const directRates = rates
      .filter(r => r.from === from && r.to === to)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, period);
      
    if (directRates.length > 0) {
      return directRates;
    }
    
    // Si pas de taux direct, essayer de calculer via USD
    const uniqueDates = [...new Set(rates.map(r => r.date))].sort().reverse().slice(0, period);
    
    return uniqueDates.map(date => {
      const dayRates = rates.filter(r => r.date === date);
      const fromToUsd = dayRates.find(r => r.from === from && r.to === 'USD');
      const usdToTo = dayRates.find(r => r.from === 'USD' && r.to === to);
      
      let rate = 1;
      if (fromToUsd && usdToTo) {
        rate = fromToUsd.rate * usdToTo.rate;
      } else {
        // Utiliser les taux par défaut
        const currentRates = getCurrentExchangeRates().rates;
        if (from === 'USD') rate = currentRates[to];
        else if (to === 'USD') rate = 1 / currentRates[from];
        else rate = currentRates[to] / currentRates[from];
      }
      
      return {
        from,
        to,
        rate,
        date
      };
    });
  };
  
  return {
    rates,
    loading,
    error,
    lastUpdated,
    getRate,
    getRateHistory,
    refreshRates: fetchRates
  };
}