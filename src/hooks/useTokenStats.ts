import { useState, useEffect } from 'react';

interface TokenStats {
  totalSold: number;
  totalUsed: number;
  usageHistory: Array<{
    date: string;
    used: number;
    remaining: number;
  }>;
}

export function useTokenStats() {
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTokenStats({
          totalSold: 1000000,
          totalUsed: 650000,
          usageHistory: [
            { date: '2024-01', used: 100000, remaining: 900000 },
            { date: '2024-02', used: 250000, remaining: 750000 },
            { date: '2024-03', used: 400000, remaining: 600000 },
            { date: '2024-04', used: 550000, remaining: 450000 },
            { date: '2024-05', used: 650000, remaining: 350000 }
          ]
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch token stats'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { tokenStats, isLoading, error };
}