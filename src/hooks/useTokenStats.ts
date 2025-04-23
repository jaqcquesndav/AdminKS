import { useState, useEffect, useCallback } from 'react';

// Update interface to match the expected structure in TokensPage.tsx
interface TokenStats {
  totalTokensConsumed: number;
  totalCost: number;
  averageCostPerToken: number;
  tokensPerService: {
    text: number;
    voice: number;
    image: number;
    chat: number;
  };
  costPerService: {
    text: number;
    voice: number;
    image: number;
    chat: number;
  };
  topCustomers: Array<{
    id: string;
    name: string;
    tokensConsumed: number;
    cost: number;
  }>;
  dailyUsage: Array<{
    date: string;
    tokensConsumed: number;
    cost: number;
  }>;
}

export function useTokenStats() {
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getTokenStats = useCallback(async (dateRange: string = '7d') => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log(`Fetching token stats for date range: ${dateRange}`);
      
      // Adjust mock data based on dateRange
      let dataMultiplier = 1.0;
      switch(dateRange) {
        case '1d':
          dataMultiplier = 0.15;
          break;
        case '7d':
          dataMultiplier = 1.0;
          break;
        case '30d':
          dataMultiplier = 4.2;
          break;
        case '90d':
          dataMultiplier = 12.5;
          break;
        case 'all':
          dataMultiplier = 24.0;
          break;
      }
      
      // Returning mock data that matches the expected structure
      const mockStats: TokenStats = {
        totalTokensConsumed: Math.round(1727300 * dataMultiplier),
        totalCost: +(52.49 * dataMultiplier).toFixed(2),
        averageCostPerToken: 0.00003,
        tokensPerService: {
          text: Math.round(527750 * dataMultiplier),
          voice: Math.round(405000 * dataMultiplier),
          image: Math.round(180000 * dataMultiplier),
          chat: Math.round(614550 * dataMultiplier)
        },
        costPerService: {
          text: +(10.33 * dataMultiplier).toFixed(2),
          voice: +(12.15 * dataMultiplier).toFixed(2),
          image: +(18.00 * dataMultiplier).toFixed(2),
          chat: +(12.01 * dataMultiplier).toFixed(2)
        },
        topCustomers: [
          {
            id: 'cust-2',
            name: 'Crédit Maritime',
            tokensConsumed: Math.round(829650 * dataMultiplier),
            cost: +(20.62 * dataMultiplier).toFixed(2)
          },
          {
            id: 'cust-1',
            name: 'TechStart SAS',
            tokensConsumed: Math.round(278700 * dataMultiplier),
            cost: +(5.57 * dataMultiplier).toFixed(2)
          },
          {
            id: 'cust-5',
            name: 'MicroFinance SA',
            tokensConsumed: Math.round(318750 * dataMultiplier),
            cost: +(6.37 * dataMultiplier).toFixed(2)
          }
        ],
        dailyUsage: [
          {
            date: '2025-04-17',
            tokensConsumed: Math.round(316000 * dataMultiplier),
            cost: +(15.50 * dataMultiplier).toFixed(2)
          },
          {
            date: '2025-04-18',
            tokensConsumed: Math.round(387150 * dataMultiplier),
            cost: +(7.46 * dataMultiplier).toFixed(2)
          },
          {
            date: '2025-04-19',
            tokensConsumed: Math.round(216500 * dataMultiplier),
            cost: +(11.85 * dataMultiplier).toFixed(2)
          },
          {
            date: '2025-04-20',
            tokensConsumed: Math.round(227800 * dataMultiplier),
            cost: +(6.09 * dataMultiplier).toFixed(2)
          },
          {
            date: '2025-04-21',
            tokensConsumed: Math.round(579850 * dataMultiplier),
            cost: +(11.59 * dataMultiplier).toFixed(2)
          }
        ]
      };
      
      setTokenStats(mockStats);
      setIsLoading(false);
      return mockStats;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch token stats');
      setError(error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  useEffect(() => {
    getTokenStats();
  }, [getTokenStats]);

  return { tokenStats, isLoading, error, getTokenStats };
}