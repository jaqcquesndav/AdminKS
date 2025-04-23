import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, Download, TrendingUp, 
  DollarSign, ArrowUp, ArrowDown,
  ChevronDown, RefreshCw, Users, Package
} from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/currency';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';

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
  category: string;
  amount: number;
  percentage: number;
}

interface RevenueByPlan {
  planName: string;
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
  type: 'pme' | 'financial';
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
  const { showToast } = useToastContext();
  const { activeCurrency } = useCurrencySettings();
  
  const [timeFrame, setTimeFrame] = useState<'month' | 'quarter' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [comparisonMode, setComparisonMode] = useState<'previous' | 'year'>('previous');
  const [activeSection, setActiveSection] = useState<'overview' | 'breakdown' | 'trends'>('overview');

  // Chargement des données de revenus
  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données mockées pour les revenus
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
              { category: 'Abonnements', amount: 98750.50, percentage: 78.7 },
              { category: 'Tokens supplémentaires', amount: 19350.25, percentage: 15.4 },
              { category: 'Services professionnels', amount: 7360.00, percentage: 5.9 }
            ],
            byPlan: [
              { planName: 'Starter', planType: 'starter', amount: 12580.25, percentage: 10.0, customers: 18 },
              { planName: 'Professional', planType: 'pro', amount: 25940.50, percentage: 20.7, customers: 12 },
              { planName: 'Enterprise', planType: 'enterprise', amount: 32760.00, percentage: 26.1, customers: 6 },
              { planName: 'Financial Institution', planType: 'financial', amount: 54180.00, percentage: 43.2, customers: 4 }
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
        
        setRevenueStats(mockRevenueData);
      } catch (error) {
        console.error('Erreur lors du chargement des données de revenus:', error);
        showToast('error', 'Erreur lors du chargement des données de revenus');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRevenueData();
  }, [timeFrame, showToast]);

  // Formatage des nombres
  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  };

  // Formatage des pourcentages
  const formatPercentage = (number: number) => {
    return `${number.toFixed(1)}%`;
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
    showToast('success', 'Export des données de revenus initié');
    // Dans une application réelle, cela déclencherait un téléchargement de fichier
  };

  // Rafraîchir les données
  const handleRefreshData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    showToast('success', 'Données de revenus mises à jour');
    setLoading(false);
  };

  // Données pour le graphique de tendance des revenus
  const revenueChartData = revenueStats?.historicalData.map(data => ({
    period: new Date(data.period + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
    amount: data.amount,
    recurring: data.recurring,
    oneTime: data.oneTime
  })) || [];

  // Calcul de la variation par rapport à la période précédente
  const calculateVariation = (current: number, previous: number) => {
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

  // Carte métrique
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
          {trend !== null && (
            <div className="mt-2">
              <TrendIndicator value={trend} />
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('primary', 'primary/10')}`}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: `h-6 w-6 ${color}` 
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('finance.revenue.title', 'Analyse des Revenus')}
        </h1>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as 'month' | 'quarter' | 'year')}
              className="pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="month">{t('finance.revenue.timeFrames.month', 'Ce mois')}</option>
              <option value="quarter">{t('finance.revenue.timeFrames.quarter', 'Ce trimestre')}</option>
              <option value="year">{t('finance.revenue.timeFrames.year', 'Cette année')}</option>
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
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('common.refresh', 'Actualiser')}
          </button>
          
          <button
            onClick={handleExportData}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('common.export', 'Exporter')}
          </button>
        </div>
      </div>
      
      {/* Navigation par onglets */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px space-x-8">
          {['overview', 'breakdown', 'trends'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section as 'overview' | 'breakdown' | 'trends')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeSection === section
                  ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              {section === 'overview' && t('finance.revenue.tabs.overview', 'Vue d\'ensemble')}
              {section === 'breakdown' && t('finance.revenue.tabs.breakdown', 'Répartition')}
              {section === 'trends' && t('finance.revenue.tabs.trends', 'Tendances')}
            </button>
          ))}
        </nav>
      </div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Vue d'ensemble */}
          {activeSection === 'overview' && revenueStats && (
            <div className="space-y-6">
              {/* Métriques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title={t('finance.revenue.metrics.totalRevenue', 'Revenu Total')}
                  value={formatCurrency(revenueStats.currentPeriod.metrics.totalRevenue, activeCurrency)}
                  trend={totalRevenueVariation}
                  icon={<DollarSign />}
                  color="text-primary"
                />
                
                <MetricCard
                  title={t('finance.revenue.metrics.recurringRevenue', 'Revenu Récurrent')}
                  value={formatCurrency(revenueStats.currentPeriod.metrics.recurringRevenue, activeCurrency)}
                  trend={recurringRevenueVariation}
                  icon={<TrendingUp />}
                  color="text-green-600"
                />
                
                <MetricCard
                  title={t('finance.revenue.metrics.oneTimeRevenue', 'Revenu Ponctuel')}
                  value={formatCurrency(revenueStats.currentPeriod.metrics.oneTimeRevenue, activeCurrency)}
                  trend={oneTimeRevenueVariation}
                  icon={<Package />}
                  color="text-purple-600"
                />
                
                <MetricCard
                  title={t('finance.revenue.metrics.customers', 'Clients Actifs')}
                  value={formatNumber(revenueStats.currentPeriod.byCustomerType.reduce((acc, curr) => acc + curr.count, 0))}
                  subtitle={formatCurrency(revenueStats.currentPeriod.metrics.averageRevenuePerCustomer, activeCurrency) + ' par client'}
                  icon={<Users />}
                  color="text-blue-600"
                />
              </div>
              
              {/* Graphique de tendance */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {t('finance.revenue.revenueOverTime', 'Évolution des revenus')}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {t('finance.revenue.last5Periods', 'Tendance sur les 5 dernières périodes')}
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
                
                {/* Simulation simple d'un graphique */}
                <div className="h-64">
                  <div className="flex items-end justify-between h-48 space-x-2">
                    {revenueChartData.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="relative w-full max-w-[60px] flex flex-col items-center">
                          {/* Barre de revenu ponctuel */}
                          <div 
                            className="w-full bg-purple-500 rounded-t"
                            style={{ 
                              height: `${(data.oneTime / (revenueChartData[revenueChartData.length - 1].amount * 1.2)) * 100}%` 
                            }}
                          ></div>
                          {/* Barre de revenu récurrent */}
                          <div 
                            className="w-full bg-green-500 absolute bottom-0"
                            style={{ 
                              height: `${(data.recurring / (revenueChartData[revenueChartData.length - 1].amount * 1.2)) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 w-full text-center">
                          {data.period}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* KPIs supplémentaires */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    {t('finance.revenue.metrics.arpc', 'Revenu moyen par client')}
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(revenueStats.currentPeriod.metrics.averageRevenuePerCustomer, activeCurrency)}
                  </p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendIndicator value={5.8} />
                    <span className="ml-1 text-gray-500 dark:text-gray-400">vs période précédente</span>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    {t('finance.revenue.metrics.ltv', 'Valeur client à vie (LTV)')}
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(revenueStats.currentPeriod.metrics.customerLifetimeValue, activeCurrency)}
                  </p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendIndicator value={3.2} />
                    <span className="ml-1 text-gray-500 dark:text-gray-400">vs période précédente</span>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    {t('finance.revenue.metrics.growth', 'Croissance des revenus')}
                  </h3>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatPercentage(revenueStats.currentPeriod.metrics.revenueGrowth)}
                  </p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendIndicator value={1.8} />
                    <span className="ml-1 text-gray-500 dark:text-gray-400">vs période précédente</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Répartition des revenus */}
          {activeSection === 'breakdown' && revenueStats && (
            <div className="space-y-6">
              {/* Répartition par type de client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                    {t('finance.revenue.breakdown.byCustomerType', 'Répartition par type de client')}
                  </h3>
                  
                  <div className="flex space-x-6">
                    {/* Représentation visuelle */}
                    <div className="flex items-center justify-center w-32 h-32 relative">
                      <div className="rounded-full w-full h-full border-8 border-primary"></div>
                      <div 
                        className="absolute top-0 left-0 rounded-full w-full h-full border-8 border-transparent border-t-blue-500 border-r-blue-500"
                        style={{
                          transform: `rotate(${revenueStats.currentPeriod.byCustomerType[0].percentage * 3.6}deg)`
                        }}
                      ></div>
                    </div>
                    
                    {/* Légende */}
                    <div className="space-y-4">
                      {revenueStats.currentPeriod.byCustomerType.map((type, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`w-4 h-4 rounded-sm mr-2 ${
                            type.type === 'pme' ? 'bg-primary' : 'bg-blue-500'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {type.type === 'pme' ? 'PME' : 'Institutions Financières'}
                            </p>
                            <div className="flex space-x-3 text-xs text-gray-500 dark:text-gray-400">
                              <span>{formatCurrency(type.amount, activeCurrency)}</span>
                              <span>{formatPercentage(type.percentage)}</span>
                              <span>{formatNumber(type.count)} clients</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Répartition par catégorie de revenu */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                    {t('finance.revenue.breakdown.byCategory', 'Répartition par catégorie')}
                  </h3>
                  
                  <div className="space-y-4">
                    {revenueStats.currentPeriod.byCategory.map((category, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {category.category}
                          </span>
                          <div className="flex items-center space-x-2">
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(category.amount, activeCurrency)}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ({formatPercentage(category.percentage)})
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              index === 0 ? 'bg-primary' : 
                              index === 1 ? 'bg-purple-500' : 'bg-amber-500'
                            }`} 
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Répartition par plan d'abonnement */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                  {t('finance.revenue.breakdown.byPlan', 'Répartition par plan d\'abonnement')}
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('finance.revenue.plan', 'Plan')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('finance.revenue.customers', 'Clients')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('finance.revenue.amount', 'Montant')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t('finance.revenue.percentage', '%')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {revenueStats.currentPeriod.byPlan.map((plan, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`h-3 w-3 rounded-sm mr-2 ${
                                plan.planType === 'starter' ? 'bg-blue-500' :
                                plan.planType === 'pro' ? 'bg-green-500' :
                                plan.planType === 'enterprise' ? 'bg-purple-500' :
                                'bg-amber-500'
                              }`}></div>
                              <span className="font-medium text-gray-900 dark:text-white">{plan.planName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatNumber(plan.customers)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(plan.amount, activeCurrency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                            {formatPercentage(plan.percentage)}
                          </td>
                        </tr>
                      ))}
                      
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {t('finance.revenue.total', 'Total')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {formatNumber(revenueStats.currentPeriod.byPlan.reduce((acc, plan) => acc + plan.customers, 0))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(revenueStats.currentPeriod.metrics.totalRevenue, activeCurrency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right">
                          100%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Tendances */}
          {activeSection === 'trends' && revenueStats && (
            <div className="space-y-6">
              {/* Comparaison avec période précédente */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                      {t('finance.revenue.trends.comparison', 'Comparaison des périodes')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {comparisonMode === 'previous' 
                        ? t('finance.revenue.trends.vsPrevious', 'vs période précédente') 
                        : t('finance.revenue.trends.vsLastYear', 'vs même période année précédente')}
                    </p>
                  </div>
                  
                  <div className="mt-3 sm:mt-0">
                    <select
                      value={comparisonMode}
                      onChange={(e) => setComparisonMode(e.target.value as 'previous' | 'year')}
                      className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:border-primary focus:ring-primary"
                    >
                      <option value="previous">{t('finance.revenue.trends.previous', 'Période précédente')}</option>
                      <option value="year">{t('finance.revenue.trends.year', 'Année précédente')}</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('finance.revenue.metrics.totalRevenue', 'Revenu Total')}
                      </h4>
                      <TrendIndicator value={totalRevenueVariation} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Actuel</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(revenueStats.currentPeriod.metrics.totalRevenue, activeCurrency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Précédent</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(revenueStats.comparison.totalRevenue, activeCurrency)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('finance.revenue.metrics.recurringRevenue', 'Revenu Récurrent')}
                      </h4>
                      <TrendIndicator value={recurringRevenueVariation} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Actuel</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(revenueStats.currentPeriod.metrics.recurringRevenue, activeCurrency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Précédent</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(revenueStats.comparison.recurringRevenue, activeCurrency)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('finance.revenue.metrics.oneTimeRevenue', 'Revenu Ponctuel')}
                      </h4>
                      <TrendIndicator value={oneTimeRevenueVariation} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Actuel</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(revenueStats.currentPeriod.metrics.oneTimeRevenue, activeCurrency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Précédent</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(revenueStats.comparison.oneTimeRevenue, activeCurrency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tendance croissance */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                  {t('finance.revenue.trends.growthChart', 'Tendance de croissance')}
                </h3>
                
                <div className="h-64 flex flex-col">
                  <div className="flex-grow flex items-end justify-between">
                    {/* Simulation de graphique de croissance */}
                    {revenueStats.historicalData.map((period, index) => {
                      const prevPeriod = index > 0 ? revenueStats.historicalData[index - 1].amount : 0;
                      const growth = prevPeriod ? ((period.amount - prevPeriod) / prevPeriod) * 100 : 0;
                      
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <div className="relative">
                            <div 
                              className={`w-12 rounded-sm ${growth >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ 
                                height: `${Math.abs(growth) * 3}px`,
                                minHeight: '4px',
                                marginTop: growth >= 0 ? 'auto' : '0'
                              }}
                            ></div>
                          </div>
                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
                            {new Date(period.period + '-01').toLocaleDateString(undefined, { month: 'short' })}
                            <div className={growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {growth.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}