import { useState, useEffect } from 'react';
import { SupportedCurrency } from '../utils/currency';

interface ExchangeRate {
  from: SupportedCurrency;
  to: SupportedCurrency;
  rate: number;
  date: string;
}

interface ExchangeRatesHistory {
  rates: ExchangeRate[];
  loading: boolean;
  error: string | null;
  getRate: (from: SupportedCurrency, to: SupportedCurrency) => number;
  getRateHistory: (from: SupportedCurrency, to: SupportedCurrency, days?: number) => ExchangeRate[];
}

/**
 * Hook pour suivre l'historique des taux de change entre les devises supportées
 * @param days Nombre de jours d'historique à récupérer (par défaut 30)
 */
export function useExchangeRates(days: number = 30): ExchangeRatesHistory {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dans une application réelle, vous feriez un appel API ici
    // pour récupérer les taux de change actuels et historiques
    const fetchRates = async () => {
      try {
        setLoading(true);
        
        // Simuler un appel API avec des données fictives
        setTimeout(() => {
          const baseRates = {
            'USD-CDF': 2500,
            'USD-FCFA': 600,
            'CDF-FCFA': 0.24, // 1 CDF = 0.24 FCFA (approximatif)
          };
          
          const today = new Date();
          const generatedRates: ExchangeRate[] = [];
          
          // Générer un historique fictif pour les 30 derniers jours
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
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        setError("Erreur lors de la récupération des taux de change");
        setLoading(false);
      }
    };
    
    fetchRates();
  }, [days]);
  
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
    
    // Valeurs par défaut au cas où les données ne sont pas disponibles
    const defaultRates: Record<string, number> = {
      'USD-CDF': 2500,
      'USD-FCFA': 600,
      'CDF-USD': 1/2500,
      'CDF-FCFA': 0.24,
      'FCFA-USD': 1/600,
      'FCFA-CDF': 1/0.24,
    };
    
    return defaultRates[`${from}-${to}`] || 1;
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
    return rates
      .filter(r => r.from === from && r.to === to)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, period);
  };
  
  return {
    rates,
    loading,
    error,
    getRate,
    getRateHistory
  };
}