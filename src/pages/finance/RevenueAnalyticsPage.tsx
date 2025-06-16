import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, Download, TrendingUp, 
  DollarSign, ArrowUp, ArrowDown,
  ChevronDown, RefreshCw, Users, Package,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import { ConnectionError, BackendError } from '../../components/common/ConnectionError';
import { getErrorMessage, isNetworkError } from '../../utils/errorUtils';

// Custom interface for network errors
interface NetworkError extends Error {
  isNetworkError: boolean;
}

// Types pour les données de revenus
interface RevenueMetrics {
  totalRevenue: number;
  recurringRevenue: number;
  oneTimeRevenue: number;
  revenueGrowth: number;
  averageRevenuePerCustomer: number;
  customerLifetimeValue: number;
}

interface RevenueByCategory {
  category: string; // This will be a key for translation e.g., 'subscriptions', 'additionalTokens'
  amount: number;
  percentage: number;
}

interface RevenueByPlan {
  planName: string; // This will be a key for translation e.g., 'starter', 'pro'
  planType: 'starter' | 'pro' | 'enterprise' | 'financial';
  amount: number;
  percentage: number;
  customers: number;
}

interface RevenueByPeriod {
  period: string; // YYYY-MM
  amount: number;
  recurring: number;
  oneTime: number;
}

interface RevenueByCustomerType {
  type: 'pme' | 'financial'; // This will be a key for translation
  count: number;
  amount: number;
  percentage: number;
}

interface RevenueStats {
  currentPeriod: {
    metrics: RevenueMetrics;
    byCategory: RevenueByCategory[];
    byPlan: RevenueByPlan[];
    byCustomerType: RevenueByCustomerType[];
  };
  comparison: {
    totalRevenue: number;
    recurringRevenue: number;
    oneTimeRevenue: number;
    revenueGrowth: number;
  };
  historicalData: RevenueByPeriod[];
}

export function RevenueAnalyticsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { formatCurrency: format, convert, activeCurrency, baseCurrency } = useCurrencySettings(); 
    const [timeFrame, setTimeFrame] = useState<'month' | 'quarter' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [error, setError] = useState<string | null>(null); 
  const [activeSection, setActiveSection] = useState<'overview' | 'breakdown' | 'trends'>('overview');

  const fetchRevenueData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRevenueStats(null); 
    try {      // Simulate API call (replace with actual implementation)
      // const actualData = await revenueService.getStats({ timeFrame });
      // setRevenueStats(actualData);

      const data: RevenueStats = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.9) { 
            // Simulate a network error specifically for testing ConnectionError component
            if (Math.random() > 0.5) {
                // Create a network error with the isNetworkError property
                const netError = new Error(t('finance.revenue.errors.simulatedNetworkError', 'Simulated Network Error: Failed to connect.')) as NetworkError;
                netError.isNetworkError = true; // Mark as network error for isNetworkError util
                reject(netError);
            } else {
                reject(new Error(t('finance.revenue.errors.simulatedApiError', 'Simulated API Error: Failed to fetch revenue data.')));
            }
          } else {
            const mockRevenueData: RevenueStats = {
              currentPeriod: {
                metrics: {
                  totalRevenue: 125460.75,
                  recurringRevenue: 98750.50,
                  oneTimeRevenue: 26710.25,
                  revenueGrowth: 8.3,
                  averageRevenuePerCustomer: 3622.45,
                  customerLifetimeValue: 18750.20
                },
                byCategory: [
                  { category: 'subscriptions', amount: 98750.50, percentage: 78.7 },
                  { category: 'additionalTokens', amount: 19350.25, percentage: 15.4 },
                  { category: 'professionalServices', amount: 7360.00, percentage: 5.9 }
                ],
                byPlan: [
                  { planName: 'starter', planType: 'starter', amount: 12580.25, percentage: 10.0, customers: 18 },
                  { planName: 'pro', planType: 'pro', amount: 25940.50, percentage: 20.7, customers: 12 },
                  { planName: 'enterprise', planType: 'enterprise', amount: 32760.00, percentage: 26.1, customers: 6 },
                  { planName: 'financial', planType: 'financial', amount: 54180.00, percentage: 43.2, customers: 4 }
                ],
                byCustomerType: [
                  { type: 'pme', count: 36, amount: 71280.75, percentage: 56.8 },
                  { type: 'financial', count: 4, amount: 54180.00, percentage: 43.2 }
                ]
              },
              comparison: {
                totalRevenue: 115850.20,
                recurringRevenue: 92580.30,
                oneTimeRevenue: 23269.90,
                revenueGrowth: 6.5
              },
              historicalData: [
                { period: '2024-11', amount: 98750.50, recurring: 85420.30, oneTime: 13330.20 },
                { period: '2024-12', amount: 103250.80, recurring: 87650.50, oneTime: 15600.30 },
                { period: '2025-01', amount: 109780.40, recurring: 91230.70, oneTime: 18549.70 },
                { period: '2025-02', amount: 115850.20, recurring: 92580.30, oneTime: 23269.90 },
                { period: '2025-03', amount: 125460.75, recurring: 98750.50, oneTime: 26710.25 }
              ]
            };
            resolve(mockRevenueData);
          }
        }, 1000);
      });
      setRevenueStats(data);
    } catch (apiError: unknown) { // Changed from any to unknown for better type safety
      const typedError = apiError as Error; // Type assertion
      const errorMessage = getErrorMessage(typedError); // Corrected: getErrorMessage expects 1 argument
      setError(errorMessage);
      if (!isNetworkError(typedError)) { 
        showToast('error', errorMessage);
      }
      console.error(t('finance.revenue.errors.loadErrorDefault'), typedError);    } finally {
      setLoading(false);
    }
  // Dependencies for useCallback: `t` and `showToast` are stable. `timeFrame` would be needed if the API call used it.
  // For mock, it is not strictly necessary but kept for eventual real API integration.
  }, [t, showToast]);

  useEffect(() => { 
    fetchRevenueData();
  }, [fetchRevenueData]);

  // Formatage des pourcentages
  const formatPercentage = (number: number) => {
    return t('finance.revenue.percentageFormat', '{{value, number}}%', { value: parseFloat(number.toFixed(1)) });
  };

  // Indicateur de tendance
  const TrendIndicator = ({ value, reversed = false }: { value: number, reversed?: boolean }) => {
    const isPositive = reversed ? value < 0 : value > 0;
    const absoluteValue = Math.abs(value);
    
    return (
      <div className={`flex items-center text-sm ${
        isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      }`}>
        {isPositive ? (
          <ArrowUp className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDown className="h-4 w-4 mr-1" />
        )}
        <span>{formatPercentage(absoluteValue)}</span>
      </div>
    );
  };

  // Export des données
  const handleExportData = () => {
    if (!revenueStats) {
      showToast('info', t('finance.revenue.info.noDataToExport'));
      return;
    }
    showToast('success', t('finance.revenue.success.exportInitiated'));
    // console.log("Exporting data:", revenueStats);
  };

  // Rafraîchir les données
  const handleRefreshData = async () => {
    await fetchRevenueData(); 
    if (!error && revenueStats) { 
        showToast('success', t('finance.revenue.success.dataRefreshed'));
    } 
  };

  // Données pour le graphique de tendance des revenus
  const revenueChartData = revenueStats?.historicalData.map(data => ({
    period: new Date(data.period + '-01').toLocaleDateString(t('common.locale', 'en-US'), { month: 'short', year: '2-digit' }),
    amount: data.amount,
    recurring: data.recurring,
    oneTime: data.oneTime
  })) || [];

  // Calcul de la variation par rapport à la période précédente
  const calculateVariation = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? Infinity : (current < 0 ? -Infinity : 0); 
    return previous ? ((current - previous) / previous) * 100 : 0;
  };

  const currentMetrics = revenueStats?.currentPeriod.metrics;
  const comparisonMetrics = revenueStats?.comparison;
  
  const totalRevenueVariation = currentMetrics && comparisonMetrics
    ? calculateVariation(currentMetrics.totalRevenue, comparisonMetrics.totalRevenue)
    : 0;
    
  const recurringRevenueVariation = currentMetrics && comparisonMetrics
    ? calculateVariation(currentMetrics.recurringRevenue, comparisonMetrics.recurringRevenue)
    : 0;
    
  const oneTimeRevenueVariation = currentMetrics && comparisonMetrics
    ? calculateVariation(currentMetrics.oneTimeRevenue, comparisonMetrics.oneTimeRevenue)
    : 0;

  const MetricCard = ({ 
    title, 
    value, 
    trend = null, 
    icon, 
    color = 'text-primary',
    subtitle = null
  }: { 
    title: string; 
    value: React.ReactNode; 
    trend?: number | null; 
    icon: React.ReactNode;
    color?: string;
    subtitle?: string | null;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {trend !== null && typeof trend === 'number' && isFinite(trend) && ( 
            <div className="mt-2">
              <TrendIndicator value={trend} />
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('primary', 'bg-primary/10')}`}> 
          {React.cloneElement(icon as React.ReactElement, { 
            className: `h-6 w-6 ${color}` 
          })}
        </div>
      </div>
    </div>
  );

  // Conditional rendering for loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">{t('common.loading', 'Loading revenue data...')}</p>
        </div>
      </div>
    );
  }

  // Pass the original error object to isNetworkError
  if (error && isNetworkError(new Error(error))) { // Recreate an error object for isNetworkError if error is just a string message
    return <ConnectionError message={error} retry={fetchRevenueData} />;
  }
  
  if (error) { 
    return <BackendError message={error} retry={fetchRevenueData} />;
  }

  if (!revenueStats) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">{t('finance.revenue.errors.noDataTitle')}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('finance.revenue.errors.noDataMessage')}</p>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleRefreshData}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
          >
            <RefreshCw className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {t('common.retry', 'Retry')}
          </button>
        </div>
      </div>
    );
  }

  // Helper to create pie chart segments for byCustomerType
  const 고객유형별파이차트세그먼트 = () => { // Renamed to avoid potential character issues, original: 고객유형별파이차트세그먼트
    let accumulatedPercentage = 0;
    return revenueStats.currentPeriod.byCustomerType.map((typeData, index) => {
      const percentage = typeData.percentage;
      const offset = accumulatedPercentage;
      accumulatedPercentage += percentage;
      const color = typeData.type === 'pme' ? 'var(--color-primary)' : '#3b82f6'; // Tailwind primary and blue-500

      return (
        <circle 
          key={index}
          cx="18" 
          cy="18" 
          r="15.91549430918954" 
          fill="transparent" 
          stroke={color}
          strokeWidth="3.5" 
          strokeDasharray={`${percentage}, 100`} 
          strokeDashoffset={`-${offset}`}
          transform="rotate(-90 18 18)"
        />
      );
    });
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('finance.revenue.title')}
        </h1>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as 'month' | 'quarter' | 'year')}
              className="pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary"
            >
              <option value="month">{t('finance.revenue.timeFrames.month')}</option>
              <option value="quarter">{t('finance.revenue.timeFrames.quarter')}</option>
              <option value="year">{t('finance.revenue.timeFrames.year')}</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <button
            onClick={handleRefreshData}
            disabled={loading} 
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('common.refresh', 'Refresh')}
          </button>
          
          <button
            onClick={handleExportData}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('common.export', 'Export')}
          </button>
        </div>
      </div>
      
      {/* Navigation par onglets */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex -mb-px space-x-8" aria-label={t('finance.revenue.sections.ariaLabel', 'Revenue sections navigation')}>
          {([
            { key: 'overview', label: t('finance.revenue.sections.overview') },
            { key: 'breakdown', label: t('finance.revenue.sections.breakdown') },
            { key: 'trends', label: t('finance.revenue.sections.trends') }
          ] as { key: 'overview' | 'breakdown' | 'trends'; label: string }[]).map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeSection === section.key
                  ? 'border-primary text-primary dark:border-primary-dark dark:text-primary-light'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                }
              `}
              aria-current={activeSection === section.key ? 'page' : undefined}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Content Display based on activeSection */}
      <div className="mt-6">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Métriques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                  title={t('finance.revenue.metrics.totalRevenue')}
                  value={format(currentMetrics?.totalRevenue || 0, activeCurrency)}
                  trend={totalRevenueVariation}
                  icon={<DollarSign />}
                  subtitle={t('finance.revenue.metrics.vsPreviousPeriod')}
                />
                
                <MetricCard
                  title={t('finance.revenue.metrics.recurringRevenue')}
                  value={format(currentMetrics?.recurringRevenue || 0, activeCurrency)}
                  trend={recurringRevenueVariation}
                  icon={<TrendingUp />}
                  subtitle={t('finance.revenue.metrics.vsPreviousPeriod')}
                />
                
                <MetricCard
                  title={t('finance.revenue.metrics.oneTimeRevenue')}
                  value={format(currentMetrics?.oneTimeRevenue || 0, activeCurrency)}
                  trend={oneTimeRevenueVariation}
                  icon={<Package />}
                  subtitle={t('finance.revenue.metrics.vsPreviousPeriod')}
                />
                
                <MetricCard
                  title={t('finance.revenue.metrics.revenueGrowth')}
                  value={formatPercentage(currentMetrics?.revenueGrowth || 0)}
                  icon={<TrendingUp />}
                  color="text-green-500"
                />
                
                <MetricCard
                  title={t('finance.revenue.metrics.avgRevenuePerCustomer')}
                  value={format(currentMetrics?.averageRevenuePerCustomer || 0, activeCurrency)}
                  icon={<Users />}
                />
                
                <MetricCard
                  title={t('finance.revenue.metrics.customerLifetimeValue')}
                  value={format(currentMetrics?.customerLifetimeValue || 0, activeCurrency)}
                  icon={<DollarSign />}
                />
              </div>
              
              {/* Graphique de tendance */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {t('finance.revenue.revenueOverTime', 'Évolution des revenus')}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('finance.revenue.lastNPeriods', { count: revenueChartData.length, defaultValue: 'Tendance sur les {{count}} dernières périodes' })}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-primary rounded-sm mr-2"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('finance.revenue.total', 'Total')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-green-500 rounded-sm mr-2"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('finance.revenue.recurring', 'Récurrent')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-purple-500 rounded-sm mr-2"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('finance.revenue.oneTime', 'Ponctuel')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {revenueChartData.length > 0 ? (
                  <div className="h-72">
                    <div className="flex items-end justify-around h-full space-x-1 md:space-x-2 pt-4">
                      {revenueChartData.map((data, index) => {
                        const maxAmount = Math.max(...revenueChartData.map(d => d.amount), 0) * 1.1;
                        const totalHeightPercent = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center justify-end h-full max-w-[50px] md:max-w-[70px]">
                            <div 
                              className="relative w-full bg-primary rounded-t group cursor-pointer"
                              style={{ height: `${totalHeightPercent}%` }}
                              title={`${t('finance.revenue.total', 'Total')}: ${format(convert(data.amount, baseCurrency, activeCurrency))}\n${t('finance.revenue.recurring', 'Récurrent')}: ${format(convert(data.recurring, baseCurrency, activeCurrency))}\n${t('finance.revenue.oneTime', 'Ponctuel')}: ${format(convert(data.oneTime, baseCurrency, activeCurrency))}`}
                            >
                              <div 
                                className="absolute bottom-0 left-0 w-full bg-green-500 group-hover:bg-green-400 transition-colors duration-150 rounded-t"
                                style={{ height: `${data.amount > 0 ? (data.recurring / data.amount) * 100 : 0}%` }} // Ensure data.amount is not zero
                              ></div>
                              <div 
                                className="absolute bottom-0 left-0 w-full bg-purple-500 group-hover:bg-purple-400 transition-colors duration-150 rounded-t"
                                style={{ height: `${data.amount > 0 ? (data.oneTime / data.amount) * 100 : 0}%`, bottom: `${data.amount > 0 ? (data.recurring / data.amount) * 100 : 0}%`  }}
                              ></div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 bg-gray-700 text-white text-xs rounded whitespace-nowrap z-10">
                                {t('finance.revenue.total', 'Total')}: {format(convert(data.amount, baseCurrency, activeCurrency))}<br/>
                                {t('finance.revenue.recurring', 'Récurrent')}: {format(convert(data.recurring, baseCurrency, activeCurrency))}<br/>
                                {t('finance.revenue.oneTime', 'Ponctuel')}: {format(convert(data.oneTime, baseCurrency, activeCurrency))}
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 w-full text-center truncate">
                              {data.period}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-72 flex items-center justify-center text-gray-500">
                    {t('finance.revenue.noChartData', 'Aucune donnée disponible pour le graphique.')}
                  </div>
                )}
              </div>
              
              {/* KPIs supplémentaires */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    {t('finance.revenue.metrics.arpc', 'Revenu moyen par client')}
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {format(convert(revenueStats.currentPeriod.metrics.averageRevenuePerCustomer, baseCurrency, activeCurrency))}
                  </p>
                  {comparisonMetrics && comparisonMetrics.totalRevenue > 0 && (
                     <div className="mt-2 flex items-center text-sm">
                        <TrendIndicator value={calculateVariation(revenueStats.currentPeriod.metrics.averageRevenuePerCustomer, comparisonMetrics.totalRevenue / (revenueStats.currentPeriod.byCustomerType.reduce((acc, curr) => acc + curr.count, 0) || 1) )} /> 
                        <span className="ml-1 text-gray-500 dark:text-gray-400">{t('common.vsPreviousPeriod', 'vs. previous period')}</span>
                     </div>
                  )}
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    {t('finance.revenue.metrics.ltv', 'Valeur client à vie (LTV)')}
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {format(convert(revenueStats.currentPeriod.metrics.customerLifetimeValue, baseCurrency, activeCurrency))}
                  </p>
                   {comparisonMetrics && comparisonMetrics.totalRevenue > 0 && (
                     <div className="mt-2 flex items-center text-sm">
                        <TrendIndicator value={5.2} /> 
                        <span className="ml-1 text-gray-500 dark:text-gray-400">{t('common.vsPreviousPeriod', 'vs. previous period')}</span>
                     </div>
                   )}
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    {t('finance.revenue.metrics.growth', 'Croissance des revenus')}
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatPercentage(revenueStats.currentPeriod.metrics.revenueGrowth)}
                  </p>
                  {comparisonMetrics && (
                    <div className="mt-2 flex items-center text-sm">
                        <TrendIndicator value={calculateVariation(revenueStats.currentPeriod.metrics.revenueGrowth, comparisonMetrics.revenueGrowth)} />
                        <span className="ml-1 text-gray-500 dark:text-gray-400">{t('common.vsPreviousPeriod', 'vs. previous period')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'breakdown' && (
            <div className="space-y-6">
              {/* Répartition par type de client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                    {t('finance.revenue.breakdown.byCustomerType', 'Répartition par type de client')}
                  </h3>
                  
                  {revenueStats.currentPeriod.byCustomerType.length > 0 ? (
                    <div className="flex flex-col md:flex-row items-center md:space-x-6">
                      <div className="w-36 h-36 md:w-40 md:h-40 relative mb-4 md:mb-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#eee" strokeWidth="3.5"></circle>
                          {고객유형별파이차트세그먼트()} {/* Corrected: Call the helper function */}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                                {revenueStats.currentPeriod.byCustomerType.reduce((sum, type) => sum + type.count, 0)}
                            </span>
                        </div>
                      </div>
                      
                      {/* Légende */}
                      <div className="space-y-3 flex-1">
                        {revenueStats.currentPeriod.byCustomerType.map((typeData, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-sm mr-2 ${typeData.type === 'pme' ? 'bg-primary' : 'bg-blue-500'}`}></div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {typeData.type === 'pme' ? t('customers.types.sme', 'PME') : t('customers.types.financial', 'Institutions Financières')}
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({typeData.count})</span>
                              </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{format(convert(typeData.amount, baseCurrency, activeCurrency))}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{formatPercentage(typeData.percentage)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('finance.revenue.breakdown.noCustomerTypeData', 'Aucune donnée de répartition par type de client disponible.')}</p>
                  )}
                </div>

                {/* Répartition par catégorie de revenus */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                    {t('finance.revenue.breakdown.byCategory', 'Répartition par catégorie de revenus')}
                  </h3>
                  {revenueStats.currentPeriod.byCategory.length > 0 ? (
                    <div className="space-y-3">
                      {revenueStats.currentPeriod.byCategory.map((category, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{category.category}</span>
                            <span className="text-gray-900 dark:text-white font-semibold">{format(convert(category.amount, baseCurrency, activeCurrency))}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${category.percentage}%` }}
                              title={`${formatPercentage(category.percentage)}`}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                     <p className="text-sm text-gray-500 dark:text-gray-400">{t('finance.revenue.breakdown.noCategoryData', 'Aucune donnée de répartition par catégorie disponible.')}</p>
                  )}
                </div>
              </div>

              {/* Répartition par plan d'abonnement */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                  {t('finance.revenue.breakdown.byPlan', 'Répartition par plan d\'abonnement')}
                </h3>
                {revenueStats.currentPeriod.byPlan.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('finance.revenue.table.planName', 'Nom du Plan')}</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('finance.revenue.table.customers', 'Clients')}</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('finance.revenue.table.revenue', 'Revenu')}</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('finance.revenue.table.percentage', '% du Total')}</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {revenueStats.currentPeriod.byPlan.map((plan, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              <span className={`inline-block w-3 h-3 rounded-sm mr-2 ${{
                                starter: 'bg-yellow-400',
                                pro: 'bg-blue-500',
                                enterprise: 'bg-purple-500',
                                financial: 'bg-green-500'
                              }[plan.planType] || 'bg-gray-300'}`}></span>
                              {plan.planName}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{plan.customers}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{format(convert(plan.amount, baseCurrency, activeCurrency))}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                                  <div 
                                    className={`h-1.5 rounded-full ${{
                                      starter: 'bg-yellow-400',
                                      pro: 'bg-blue-500',
                                      enterprise: 'bg-purple-500',
                                      financial: 'bg-green-500'
                                    }[plan.planType] || 'bg-gray-300'}`}
                                    style={{ width: `${plan.percentage}%` }}
                                  ></div>
                                </div>
                                {formatPercentage(plan.percentage)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('finance.revenue.breakdown.noPlanData', 'Aucune donnée de répartition par plan disponible.')}</p>
                )}
              </div>
            </div>
          )}
          
          {activeSection === 'trends' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {t('finance.revenue.trends.title', 'Tendances Détaillées des Revenus')}
                </h3>
                <div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 text-primary" />
                    <p className="text-lg font-semibold">{t('finance.revenue.trends.placeholderTitle', 'Analyses de tendances avancées')}</p>
                    <p className="text-sm">{t('finance.revenue.trends.placeholderText', 'Des graphiques interactifs et des analyses approfondies des tendances des revenus seront bientôt disponibles ici.')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

// Helper to translate plan names - can be expanded or moved
// const translatePlanName = (t: TFunction, planName: string, planType: string): string => {
//   const key = `finance.revenue.planTypes.${planName.toLowerCase().replace(/\\s+/g, '_')}`;
//   const fallback = planName; // Default to original name if no translation
//   // A more robust solution might involve a mapping if planName isn't a direct key
//   return t(key, fallback);
// };

// Helper to translate category names
// const translateCategoryName = (t: TFunction, categoryKey: string): string => {
//   const key = `finance.revenue.categoryNames.${categoryKey}`;
//   // Fallback to a capitalized version of the key if specific translation is missing
//   const fallback = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1).replace(/([A-Z])/g, ' $1').trim();
//   return t(key, fallback);
// };
// Helper to translate customer types
// const translateCustomerType = (t: TFunction, customerTypeKey: 'pme' | 'financial'): string => {
//   const key = `finance.revenue.customerTypes.${customerTypeKey}`;
//   const fallback = customerTypeKey.toUpperCase();
//   return t(key, fallback);
// };

// Add default props or ensure keys exist for simulated errors
// t('finance.revenue.errors.simulatedNetworkError', 'Simulated Network Error: Failed to connect.')
// t('finance.revenue.errors.simulatedApiError', 'Simulated API Error: Failed to fetch revenue data.')
// t('finance.revenue.sections.ariaLabel', 'Revenue sections navigation')
// t('finance.revenue.charts.actualChartPlaceholder', 'Actual chart rendering using a library like Recharts would go here.')
// t('finance.revenue.charts.dataPoints', { count: revenueChartData.length }) -> ensure 'dataPoints_one', 'dataPoints_other', 'dataPoints_zero' if needed
// t('finance.revenue.tableHeaders.customers', { count: item.customers }) -> ensure pluralization for customers
// Make sure all `t()` calls have a default value if the key might not exist during development or if some languages are incomplete.
// Example: t('some.key', 'Default Text')
// The `formatPercentage` function was updated to use `t()` for number formatting, which is good.
// The `revenueChartData`'s `toLocaleDateString` was updated to use `t('common.locale')`.

// Consider adding default values to all t() calls for robustness, e.g.
// t('finance.revenue.title', 'Revenue Analytics')
// t('common.refresh', 'Refresh')
// t('common.export', 'Export')
// t('finance.revenue.metrics.vsPreviousPeriod', 'vs. previous period')
// t('finance.revenue.tableHeaders.period', 'Period')
// t('finance.revenue.charts.total', 'Total')
// t('finance.revenue.charts.recurring', 'Recurring')
// t('finance.revenue.charts.oneTime', 'One-Time')
// t('finance.revenue.charts.noData', 'No data available for chart')

// For pluralization like `dataPoints` and `customers`, ensure your i18next setup supports it (e.g., `key_zero`, `key_one`, `key_other`).