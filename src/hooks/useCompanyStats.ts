import { useState, useEffect } from 'react';

interface CompanyStats {
  activeUsers: number;
  activeCompanies: number;
  activeSubscriptions: number;
  totalRevenue: {
    usd: number;
    cdf: number;
  };
}

export function useCompanyStats() {
  const [companyStats, setCompanyStats] = useState<CompanyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setCompanyStats({
          activeUsers: 125,
          activeCompanies: 45,
          activeSubscriptions: 38,
          totalRevenue: {
            usd: 15000,
            cdf: 37500000
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch company stats'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { companyStats, isLoading, error };
}