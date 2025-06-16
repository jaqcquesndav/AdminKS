import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, DollarSign, Filter, Calendar, BarChart2, AlertCircle } from 'lucide-react';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';

interface RevenueData {
  date: string;
  revenue: number;
  transactions: number;
}

interface SummaryStats {
  totalRevenue: number;
  comparisonRevenue: number;
  totalTransactions: number;
  comparisonTransactions: number;
  averageTransactionValue: number;
  comparisonAverageValue: number;
}

interface FinancialAnalyticsProps {
  customerId?: string;
  className?: string;
}

export function FinancialAnalytics({ customerId, className = '' }: FinancialAnalyticsProps) {
  const { t, i18n } = useTranslation();
  const { formatCurrency, activeCurrency } = useCurrencySettings(); 
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [period, setPeriod] = useState<'30d' | '90d' | '1y' | 'all'>('30d');
  
  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);
      setError(null); 
      try {
        // Simuler un délai de requête API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Replace with actual API call: e.g., financeApi.getAnalytics(customerId, period, timeframe)
        // For now, we keep the mock data generation but add a potential error simulation
        if (Math.random() < 0.1 && !customerId) { // Simulate an error for general analytics occasionally
          throw new Error(t('finance.analytics.errors.generalError'));
        }

        // Génération de données mockées
        const generateMockData = () => {
          const data: RevenueData[] = [];
          const now = new Date();
          let dayCount: number;
          
          switch (period) {
            case '30d':
              dayCount = 30;
              break;
            case '90d':
              dayCount = 90;
              break;
            case '1y':
              dayCount = 365;
              break;
            case 'all':
            default:
              dayCount = 730; // 2 ans
              break;
          }
          
          for (let i = dayCount; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            // Générer une valeur de revenu avec une tendance à la hausse et une variabilité
            const baseRevenue = 500 + (dayCount - i) * 10;
            const variability = baseRevenue * 0.3;
            const revenue = baseRevenue + (Math.random() * variability * 2 - variability);
            
            // Générer un nombre de transactions avec corrélation au revenu
            const transactions = Math.floor(revenue / (80 + Math.random() * 40));
            
            data.push({
              date: date.toISOString().split('T')[0],
              revenue: revenue,
              transactions: transactions
            });
          }
          
          return data;
        };
        
        const rawData = generateMockData();
        
        // Adapter les données au timeframe sélectionné
        let processedData: RevenueData[];
        
        if (timeframe === 'daily') {
          processedData = rawData;
        } else if (timeframe === 'weekly') {
          // Regrouper par semaine
          const weeklyData: RevenueData[] = [];
          let currentWeekStart: Date | null = null;
          let weekRevenue = 0;
          let weekTransactions = 0;
          
          for (const item of rawData) {
            const date = new Date(item.date);
            
            if (!currentWeekStart) {
              currentWeekStart = new Date(date);
              currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
            }
            
            const isNewWeek = date.getTime() >= currentWeekStart.getTime() + 7 * 86400000;
            
            if (isNewWeek && weekRevenue > 0) {
              weeklyData.push({
                date: currentWeekStart.toISOString().split('T')[0],
                revenue: weekRevenue,
                transactions: weekTransactions
              });
              
              currentWeekStart = new Date(date);
              currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
              weekRevenue = 0;
              weekTransactions = 0;
            }
            
            weekRevenue += item.revenue;
            weekTransactions += item.transactions;
          }
          
          // Ajouter la dernière semaine
          if (weekRevenue > 0 && currentWeekStart) {
            weeklyData.push({
              date: currentWeekStart.toISOString().split('T')[0],
              revenue: weekRevenue,
              transactions: weekTransactions
            });
          }
          
          processedData = weeklyData;
        } else {
          // Regrouper par mois
          const monthlyData: RevenueData[] = [];
          let currentMonth = -1;
          let monthRevenue = 0;
          let monthTransactions = 0;
          let monthDate = '';
          
          for (const item of rawData) {
            const date = new Date(item.date);
            const month = date.getMonth();
            const year = date.getFullYear();
            
            if (currentMonth === -1) {
              currentMonth = month;
              monthDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
            }
            
            if (month !== currentMonth) {
              monthlyData.push({
                date: monthDate,
                revenue: monthRevenue,
                transactions: monthTransactions
              });
              
              currentMonth = month;
              monthDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
              monthRevenue = 0;
              monthTransactions = 0;
            }
            
            monthRevenue += item.revenue;
            monthTransactions += item.transactions;
          }
          
          // Ajouter le dernier mois
          if (monthRevenue > 0 && monthDate) {
            monthlyData.push({
              date: monthDate,
              revenue: monthRevenue,
              transactions: monthTransactions
            });
          }
          
          processedData = monthlyData;
        }
        
        setRevenueData(processedData);
        
        // Calculer les statistiques récapitulatives
        const currentPeriodData = processedData.slice(-Math.floor(processedData.length / 2));
        const previousPeriodData = processedData.slice(0, Math.floor(processedData.length / 2));
        
        const currentTotalRevenue = currentPeriodData.reduce((sum, item) => sum + item.revenue, 0);
        const previousTotalRevenue = previousPeriodData.reduce((sum, item) => sum + item.revenue, 0);
        
        const currentTotalTransactions = currentPeriodData.reduce((sum, item) => sum + item.transactions, 0);
        const previousTotalTransactions = previousPeriodData.reduce((sum, item) => sum + item.transactions, 0);
        
        const currentAverageValue = currentTotalTransactions > 0 ? currentTotalRevenue / currentTotalTransactions : 0;
        const previousAverageValue = previousTotalTransactions > 0 ? previousTotalRevenue / previousTotalTransactions : 0;
        
        setSummaryStats({
          totalRevenue: currentTotalRevenue,
          comparisonRevenue: previousTotalRevenue,
          totalTransactions: currentTotalTransactions,
          comparisonTransactions: previousTotalTransactions,
          averageTransactionValue: currentAverageValue,
          comparisonAverageValue: previousAverageValue,
        });

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('finance.analytics.errors.unknownError');
        console.error('Failed to fetch financial data:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [customerId, timeframe, period, t, i18n.language, activeCurrency, formatCurrency]); // Added formatCurrency to dependencies

  const renderPercentageChange = (current: number, previous: number) => {
    if (previous === 0) {
      return <span className="text-sm text-gray-500">{t('common.notAvailable')}</span>;
    }
    const change = ((current - previous) / previous) * 100;
    const isPositive = change > 0;
    return (
      <span className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {change.toFixed(1)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className} flex flex-col items-center justify-center`}>
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('finance.analytics.errors.title')}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{error}</p>
        <button 
          onClick={() => { 
            setLoading(true); // Trigger a re-fetch by changing state
            setError(null);
          }}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  if (!summaryStats || revenueData.length === 0) {
    return (
      <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className} flex flex-col items-center justify-center`}>
        <BarChart2 className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('finance.analytics.noData.title')}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{t('finance.analytics.noData.message')}</p>
      </div>
    );
  }

  const timeframeOptions = [
    { value: 'daily', label: t('finance.analytics.timeframes.daily') },
    { value: 'weekly', label: t('finance.analytics.timeframes.weekly') },
    { value: 'monthly', label: t('finance.analytics.timeframes.monthly') },
  ];

  const periodOptions = [
    { value: '30d', label: t('finance.analytics.periods.last30days') },
    { value: '90d', label: t('finance.analytics.periods.last90days') },
    { value: '1y', label: t('finance.analytics.periods.lastYear') },
    { value: 'all', label: t('finance.analytics.periods.allTime') },
  ];

  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {customerId ? t('finance.analytics.customerTitle') : t('finance.analytics.generalTitle')}
        </h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="pl-8 pr-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-primary focus:border-primary"
              aria-label={t('finance.analytics.timeframes.label')}
            >
              {timeframeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <Calendar className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="relative">
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value as '30d' | '90d' | '1y' | 'all')}
              className="pl-8 pr-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-primary focus:border-primary"
              aria-label={t('finance.analytics.periods.label')}
            >
              {periodOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <Filter className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Total Revenue Card */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="text-sm">{t('finance.analytics.cards.totalRevenue')}</span>
          </div>
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            {formatCurrency(summaryStats.totalRevenue, activeCurrency)}
          </p>
          {renderPercentageChange(summaryStats.totalRevenue, summaryStats.comparisonRevenue)}
        </div>

        {/* Total Transactions Card */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
            <BarChart2 className="w-4 h-4 mr-2" />
            <span className="text-sm">{t('finance.analytics.cards.totalTransactions')}</span>
          </div>
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            {summaryStats.totalTransactions.toLocaleString(i18n.language)}
          </p>
          {renderPercentageChange(summaryStats.totalTransactions, summaryStats.comparisonTransactions)}
        </div>

        {/* Average Transaction Value Card */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="text-sm">{t('finance.analytics.cards.avgTransactionValue')}</span>
          </div>
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            {formatCurrency(summaryStats.averageTransactionValue, activeCurrency)}
          </p>
          {renderPercentageChange(summaryStats.averageTransactionValue, summaryStats.comparisonAverageValue)}
        </div>
      </div>

      {/* Revenue Chart (Placeholder) */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {t('finance.analytics.charts.revenueTrend')}
        </h3>
        <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          {revenueData.length > 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              {t('finance.analytics.charts.placeholder')} 
              ({revenueData.length} {t('finance.analytics.charts.dataPoints', { count: revenueData.length })})
            </p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              {t('finance.analytics.noData.chartMessage')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
