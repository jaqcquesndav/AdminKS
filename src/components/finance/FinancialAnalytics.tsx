import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, DollarSign, Filter, Calendar } from 'lucide-react';
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
  const { t } = useTranslation();
  const { format: formatCurrency } = useCurrencySettings();
  
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [period, setPeriod] = useState<'30d' | '90d' | '1y' | 'all'>('30d');
  
  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);
      try {
        // Simuler un délai de requête API
        await new Promise(resolve => setTimeout(resolve, 800));
        
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
          if (weekRevenue > 0) {
            weeklyData.push({
              date: currentWeekStart!.toISOString().split('T')[0],
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
          if (monthRevenue > 0) {
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
          comparisonAverageValue: previousAverageValue
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données financières:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFinancialData();
  }, [customerId, period, timeframe]);
  
  // Fonction pour calculer le pourcentage de changement
  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };
  
  // Formatage des dates selon le timeframe
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (timeframe === 'daily') {
      return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date);
    } else if (timeframe === 'weekly') {
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 6);
      return `${new Intl.DateTimeFormat('fr-FR', { day: 'numeric' }).format(date)} - ${new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(endDate)}`;
    } else {
      return new Intl.DateTimeFormat('fr-FR', { month: 'short', year: '2-digit' }).format(date);
    }
  };
  
  // Définir l'échelle du graphique
  const getChartScale = () => {
    if (revenueData.length === 0) return { max: 1000, step: 250 };
    
    const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
    const roundedMax = Math.ceil(maxRevenue / 1000) * 1000;
    const step = roundedMax / 4;
    
    return { max: roundedMax, step };
  };
  
  const chartScale = getChartScale();
  
  // Obtenir les points du graphique
  const getChartPoints = () => {
    if (revenueData.length < 2) return '';
    
    const height = 200;
    const width = revenueData.length > 30 ? revenueData.length * 20 : 600;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const step = chartWidth / (revenueData.length - 1);
    
    return revenueData.map((item, index) => {
      const x = padding + index * step;
      const y = height - padding - (item.revenue / chartScale.max * chartHeight);
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
  };
  
  // Formater les valeurs monétaires dans le graphique
  const formatCompactCurrency = (amount: number) => {
    // Formatter en format compact (k, M, etc.)
    const formatted = new Intl.NumberFormat('fr-FR', { 
      notation: 'compact', 
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(amount);
    
    return formatted;
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {t('finance.analytics.title', 'Analyse financière')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {t('finance.analytics.subtitle', 'Tendances des revenus et transactions')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as '30d' | '90d' | '1y' | 'all')}
              className="pl-8 pr-4 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="30d">{t('finance.analytics.period.30d', 'Derniers 30 jours')}</option>
              <option value="90d">{t('finance.analytics.period.90d', 'Derniers 90 jours')}</option>
              <option value="1y">{t('finance.analytics.period.1y', 'Dernière année')}</option>
              <option value="all">{t('finance.analytics.period.all', 'Tout l\'historique')}</option>
            </select>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="pl-8 pr-4 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="daily">{t('finance.analytics.timeframe.daily', 'Quotidien')}</option>
              <option value="weekly">{t('finance.analytics.timeframe.weekly', 'Hebdomadaire')}</option>
              <option value="monthly">{t('finance.analytics.timeframe.monthly', 'Mensuel')}</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Cartes des statistiques */}
          {summaryStats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-gray-200 dark:border-gray-700">
              {/* Revenu total */}
              <div className="px-6 py-5 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-50 dark:bg-green-900/20">
                    <DollarSign className="h-6 w-6 text-green-500 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('finance.analytics.stats.revenue', 'Revenu total')}
                    </p>
                    <div className="flex items-end">
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(summaryStats.totalRevenue)}
                      </p>
                      <div className="ml-2 mb-1 flex items-center">
                        {calculateChange(summaryStats.totalRevenue, summaryStats.comparisonRevenue) >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`ml-1 text-xs font-medium ${
                          calculateChange(summaryStats.totalRevenue, summaryStats.comparisonRevenue) >= 0 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`}>
                          {Math.abs(calculateChange(summaryStats.totalRevenue, summaryStats.comparisonRevenue)).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Nombre de transactions */}
              <div className="px-6 py-5 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20">
                    <svg className="h-6 w-6 text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('finance.analytics.stats.transactions', 'Transactions')}
                    </p>
                    <div className="flex items-end">
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">
                        {summaryStats.totalTransactions.toLocaleString('fr-FR')}
                      </p>
                      <div className="ml-2 mb-1 flex items-center">
                        {calculateChange(summaryStats.totalTransactions, summaryStats.comparisonTransactions) >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`ml-1 text-xs font-medium ${
                          calculateChange(summaryStats.totalTransactions, summaryStats.comparisonTransactions) >= 0 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`}>
                          {Math.abs(calculateChange(summaryStats.totalTransactions, summaryStats.comparisonTransactions)).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Valeur moyenne */}
              <div className="px-6 py-5">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-50 dark:bg-purple-900/20">
                    <svg className="h-6 w-6 text-purple-500 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('finance.analytics.stats.avgValue', 'Valeur moyenne')}
                    </p>
                    <div className="flex items-end">
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(summaryStats.averageTransactionValue)}
                      </p>
                      <div className="ml-2 mb-1 flex items-center">
                        {calculateChange(summaryStats.averageTransactionValue, summaryStats.comparisonAverageValue) >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`ml-1 text-xs font-medium ${
                          calculateChange(summaryStats.averageTransactionValue, summaryStats.comparisonAverageValue) >= 0 
                            ? 'text-green-500' 
                            : 'text-red-500'
                        }`}>
                          {Math.abs(calculateChange(summaryStats.averageTransactionValue, summaryStats.comparisonAverageValue)).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Graphique des revenus */}
          <div className="px-6 pt-6 pb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              {t('finance.analytics.chart.revenue', 'Évolution des revenus')}
            </h4>
            
            <div className="relative h-64">
              {/* Échelle Y */}
              <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
                {Array.from({ length: 5 }, (_, i) => {
                  const value = chartScale.max - i * chartScale.step;
                  return (
                    <div key={i} className="flex items-center">
                      <span>{formatCompactCurrency(value)}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Lignes horizontales */}
              <div className="absolute left-10 right-0 top-0 bottom-0 flex flex-col justify-between">
                {Array.from({ length: 5 }, (_, i) => (
                  <div 
                    key={i} 
                    className={`border-t border-gray-200 dark:border-gray-700 w-full ${i === 4 ? 'border-b' : ''}`}
                    style={{ height: i === 4 ? '1px' : '20%' }}
                  ></div>
                ))}
              </div>
              
              {/* Graphique SVG */}
              <div className="absolute left-10 right-0 top-0 bottom-0">
                <svg width="100%" height="100%" viewBox={`0 0 ${revenueData.length > 30 ? revenueData.length * 20 : 600} 200`} preserveAspectRatio="none">
                  {/* Ligne des revenus */}
                  <path
                    d={getChartPoints()}
                    stroke="#10b981"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Aire sous la courbe */}
                  <path
                    d={`${getChartPoints()} L ${40 + (revenueData.length - 1) * ((600 - 80) / (revenueData.length - 1))},160 L 40,160 Z`}
                    fill="url(#revenue-gradient)"
                    opacity="0.2"
                  />
                  
                  {/* Définition du gradient */}
                  <defs>
                    <linearGradient id="revenue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            
            {/* Labels X (dates) */}
            <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400 px-10">
              {revenueData.length > 12 
                ? [0, 2, 4, 6, 8].map(i => {
                    const index = Math.floor(i * revenueData.length / 8);
                    return index < revenueData.length 
                      ? <span key={i}>{formatDate(revenueData[index].date)}</span>
                      : null;
                  })
                : revenueData.map((item, i) => (
                    i % Math.ceil(revenueData.length / 6) === 0 || i === revenueData.length - 1
                      ? <span key={i}>{formatDate(item.date)}</span>
                      : <span key={i}></span>
                  ))
              }
            </div>
          </div>
        </>
      )}
    </div>
  );
}