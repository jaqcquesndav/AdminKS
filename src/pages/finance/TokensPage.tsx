import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, Filter, ChevronDown, MoreVertical, Clock, 
  Download, FileText, BarChart2, ArrowUp, ArrowDown,
  RefreshCw, AlertTriangle, ChevronRight, Calendar
} from 'lucide-react';
import { useTokenStats } from '../../hooks/useTokenStats';
import { useToastContext } from '../../contexts/ToastContext';

// Types
interface TokenUsage {
  id: string;
  customerId: string;
  customerName: string;
  customerType: 'pme' | 'financial';
  date: string;
  tokensConsumed: number;
  model: string;
  serviceType: 'text' | 'voice' | 'image' | 'chat';
  cost: number;
  requestCount: number;
}

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

export function TokensPage() {
  const { t } = useTranslation();
  const { showToast } = useToastContext();
  const { getTokenStats, loading: statsLoading } = useTokenStats();
  
  // États
  const [usageData, setUsageData] = useState<TokenUsage[]>([]);
  const [filteredUsage, setFilteredUsage] = useState<TokenUsage[]>([]);
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [sortBy, setSortBy] = useState<keyof TokenUsage>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateRangeFilter, setDateRangeFilter] = useState('7d');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  // Configuration des types de service
  const serviceTypeConfig = {
    text: {
      label: t('finance.tokens.serviceTypes.text', 'Traitement de texte'),
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    },
    voice: {
      label: t('finance.tokens.serviceTypes.voice', 'Reconnaissance vocale'),
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    },
    image: {
      label: t('finance.tokens.serviceTypes.image', 'Traitement d\'images'),
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
    },
    chat: {
      label: t('finance.tokens.serviceTypes.chat', 'Conversation IA'),
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
  };

  // Chargement des données
  useEffect(() => {
    const fetchTokenUsage = async () => {
      setLoading(true);
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données mockées
        const mockUsageData: TokenUsage[] = [
          {
            id: 'usage-1',
            customerId: 'cust-1',
            customerName: 'TechStart SAS',
            customerType: 'pme',
            date: '2025-04-21',
            tokensConsumed: 156200,
            model: 'GPT-4',
            serviceType: 'text',
            cost: 3.12,
            requestCount: 45
          },
          {
            id: 'usage-2',
            customerId: 'cust-2',
            customerName: 'Crédit Maritime',
            customerType: 'financial',
            date: '2025-04-21',
            tokensConsumed: 423650,
            model: 'GPT-4',
            serviceType: 'chat',
            cost: 8.47,
            requestCount: 97
          },
          {
            id: 'usage-3',
            customerId: 'cust-3',
            customerName: 'InnoVert',
            customerType: 'pme',
            date: '2025-04-20',
            tokensConsumed: 52800,
            model: 'GPT-3.5',
            serviceType: 'text',
            cost: 0.84,
            requestCount: 28
          },
          {
            id: 'usage-4',
            customerId: 'cust-2',
            customerName: 'Crédit Maritime',
            customerType: 'financial',
            date: '2025-04-20',
            tokensConsumed: 175000,
            model: 'Whisper',
            serviceType: 'voice',
            cost: 5.25,
            requestCount: 35
          },
          {
            id: 'usage-5',
            customerId: 'cust-4',
            customerName: 'EcoSolutions',
            customerType: 'pme',
            date: '2025-04-19',
            tokensConsumed: 94000,
            model: 'DALL-E 3',
            serviceType: 'image',
            cost: 9.40,
            requestCount: 12
          },
          {
            id: 'usage-6',
            customerId: 'cust-1',
            customerName: 'TechStart SAS',
            customerType: 'pme',
            date: '2025-04-19',
            tokensConsumed: 122500,
            model: 'GPT-4',
            serviceType: 'chat',
            cost: 2.45,
            requestCount: 32
          },
          {
            id: 'usage-7',
            customerId: 'cust-5',
            customerName: 'MicroFinance SA',
            customerType: 'financial',
            date: '2025-04-18',
            tokensConsumed: 318750,
            model: 'GPT-4',
            serviceType: 'text',
            cost: 6.37,
            requestCount: 65
          },
          {
            id: 'usage-8',
            customerId: 'cust-4',
            customerName: 'EcoSolutions',
            customerType: 'pme',
            date: '2025-04-18',
            tokensConsumed: 68400,
            model: 'GPT-3.5',
            serviceType: 'chat',
            cost: 1.09,
            requestCount: 43
          },
          {
            id: 'usage-9',
            customerId: 'cust-3',
            customerName: 'InnoVert',
            customerType: 'pme',
            date: '2025-04-17',
            tokensConsumed: 86000,
            model: 'DALL-E 3',
            serviceType: 'image',
            cost: 8.60,
            requestCount: 8
          },
          {
            id: 'usage-10',
            customerId: 'cust-2',
            customerName: 'Crédit Maritime',
            customerType: 'financial',
            date: '2025-04-17',
            tokensConsumed: 230000,
            model: 'Whisper',
            serviceType: 'voice',
            cost: 6.90,
            requestCount: 41
          }
        ];

        setUsageData(mockUsageData);
        setFilteredUsage(mockUsageData);
        
        // Charger les statistiques
        await fetchTokenStats();
      } catch (error) {
        console.error('Erreur lors du chargement des données de consommation:', error);
        showToast('error', 'Erreur lors du chargement des données de consommation');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTokenUsage();
  }, [showToast, t]);

  const fetchTokenStats = async () => {
    try {
      const tokenStats = await getTokenStats(dateRangeFilter);
      setStats(tokenStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      showToast('error', 'Erreur lors du chargement des statistiques');
    }
  };

  // Filtrage et tri des données
  useEffect(() => {
    let filtered = [...usageData];
    
    // Appliquer la recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        usage => 
          usage.customerName.toLowerCase().includes(term) ||
          usage.model.toLowerCase().includes(term)
      );
    }
    
    // Appliquer le filtre par service
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(usage => usage.serviceType === serviceFilter);
    }
    
    // Appliquer le filtre par client
    if (customerFilter !== 'all') {
      filtered = filtered.filter(usage => usage.customerId === customerFilter);
    }
    
    // Filtre par date
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (dateRangeFilter) {
      case '1d':
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      default:
        // 'all', ne pas filtrer
        cutoffDate = new Date(0);
    }
    
    if (dateRangeFilter !== 'all') {
      filtered = filtered.filter(usage => new Date(usage.date) >= cutoffDate);
    }
    
    // Appliquer le tri
    filtered.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' 
          ? valueA - valueB 
          : valueB - valueA;
      }
      
      return 0;
    });
    
    setFilteredUsage(filtered);
  }, [usageData, searchTerm, serviceFilter, customerFilter, dateRangeFilter, sortBy, sortDirection]);

  // Gestion des actions sur une entrée
  const handleToggleActionMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionMenu(showActionMenu === id ? null : id);
  };

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('success', 'Données de consommation mises à jour');
      
      // Rechargement des données
      // Dans une application réelle, cette fonction ferait un appel API
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
      showToast('error', 'Erreur lors de la mise à jour des données');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    // Dans une application réelle, cette fonction générerait un fichier CSV
    showToast('success', 'Export CSV généré avec succès');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Simuler des statistiques pour l'affichage
  const mockStats: TokenStats = {
    totalTokensConsumed: 1727300,
    totalCost: 52.49,
    averageCostPerToken: 0.00003,
    tokensPerService: {
      text: 527750,
      voice: 405000,
      image: 180000,
      chat: 614550
    },
    costPerService: {
      text: 10.33,
      voice: 12.15,
      image: 18.00,
      chat: 12.01
    },
    topCustomers: [
      {
        id: 'cust-2',
        name: 'Crédit Maritime',
        tokensConsumed: 829650,
        cost: 20.62
      },
      {
        id: 'cust-1',
        name: 'TechStart SAS',
        tokensConsumed: 278700,
        cost: 5.57
      },
      {
        id: 'cust-5',
        name: 'MicroFinance SA',
        tokensConsumed: 318750,
        cost: 6.37
      }
    ],
    dailyUsage: [
      {
        date: '2025-04-17',
        tokensConsumed: 316000,
        cost: 15.50
      },
      {
        date: '2025-04-18',
        tokensConsumed: 387150,
        cost: 7.46
      },
      {
        date: '2025-04-19',
        tokensConsumed: 216500,
        cost: 11.85
      },
      {
        date: '2025-04-20',
        tokensConsumed: 227800,
        cost: 6.09
      },
      {
        date: '2025-04-21',
        tokensConsumed: 579850,
        cost: 11.59
      }
    ]
  };

  // Composants pour la page
  const StatCard = ({ title, value, icon, trend, trendValue, info }: {
    title: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | null;
    trendValue?: string;
    info?: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <div className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</div>
          {trend && (
            <div className={`mt-2 flex items-center text-sm ${
              trend === 'up' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
            }`}>
              {trend === 'up' ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
          {info && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{info}</p>
          )}
        </div>
        <div className="p-3 bg-primary-50 dark:bg-primary-900 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );

  const ServiceBreakdown = () => (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
        {t('finance.tokens.breakdown.title', 'Répartition par service')}
      </h3>
      
      {stats && (
        <div className="space-y-4">
          {Object.entries(serviceTypeConfig).map(([key, config]) => {
            const serviceKey = key as keyof typeof stats.tokensPerService;
            const tokensConsumed = stats.tokensPerService[serviceKey];
            const cost = stats.costPerService[serviceKey];
            const percentage = (tokensConsumed / stats.totalTokensConsumed) * 100;
            
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {formatNumber(tokensConsumed)} tokens
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${Math.round(percentage)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{Math.round(percentage)}%</span>
                  <span>{formatCurrency(cost)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const TopCustomersChart = () => (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
        {t('finance.tokens.topCustomers.title', 'Clients avec le plus de consommation')}
      </h3>
      
      {stats && (
        <div className="space-y-4">
          {stats.topCustomers.map((customer, index) => {
            const percentage = (customer.tokensConsumed / stats.totalTokensConsumed) * 100;
            
            return (
              <div key={customer.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {customer.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {formatNumber(customer.tokensConsumed)} tokens
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-purple-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.round(percentage)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{Math.round(percentage)}%</span>
                  <span>{formatCurrency(customer.cost)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const DailyUsageChart = () => (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          {t('finance.tokens.dailyUsage.title', 'Consommation journalière')}
        </h3>
        <select 
          value={dateRangeFilter}
          onChange={(e) => setDateRangeFilter(e.target.value)}
          className="text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:border-primary focus:ring-primary"
        >
          <option value="1d">{t('finance.tokens.timeRanges.1d', 'Dernier jour')}</option>
          <option value="7d">{t('finance.tokens.timeRanges.7d', '7 derniers jours')}</option>
          <option value="30d">{t('finance.tokens.timeRanges.30d', '30 derniers jours')}</option>
          <option value="90d">{t('finance.tokens.timeRanges.90d', '90 derniers jours')}</option>
        </select>
      </div>
      
      {stats && (
        <div className="flex flex-col h-64">
          <div className="flex justify-between items-end h-48 mt-4">
            {stats.dailyUsage.map((day) => {
              const maxUsage = Math.max(...stats.dailyUsage.map(d => d.tokensConsumed));
              const heightPercentage = (day.tokensConsumed / maxUsage) * 100;
              
              return (
                <div key={day.date} className="flex flex-col items-center flex-1">
                  <div className="relative w-full px-1 flex justify-center">
                    <div 
                      className="w-10 bg-primary rounded-t-sm"
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between mt-2">
            {stats.dailyUsage.map((day) => (
              <div key={day.date} className="flex flex-col items-center text-xs text-gray-500 dark:text-gray-400">
                {new Date(day.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const ActionMenu = ({ tokenUsage }: { tokenUsage: TokenUsage }) => (
    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button
          onClick={() => {
            setShowActionMenu(null);
            navigate(`/customers/detail/${tokenUsage.customerId}`);
          }}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          role="menuitem"
        >
          <ChevronRight className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
          {t('finance.tokens.actions.viewCustomer', 'Voir le client')}
        </button>
        
        <button
          onClick={() => {
            setShowActionMenu(null);
            // Dans une application réelle, cette fonction générerait un rapport détaillé
            showToast('info', 'Génération du rapport détaillé...');
          }}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          role="menuitem"
        >
          <FileText className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
          {t('finance.tokens.actions.detailedReport', 'Rapport détaillé')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('finance.tokens.title', 'Tokens & Consommation IA')}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshData}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('finance.tokens.refresh', 'Actualiser')}
          </button>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('finance.tokens.export', 'Exporter CSV')}
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('finance.tokens.stats.totalTokens', 'Total tokens consommés')}
          value={formatNumber(mockStats.totalTokensConsumed)}
          icon={<BarChart2 className="h-6 w-6 text-primary" />}
          trend="up"
          trendValue="+8.3% depuis la période précédente"
        />
        
        <StatCard 
          title={t('finance.tokens.stats.totalCost', 'Coût total')}
          value={formatCurrency(mockStats.totalCost)}
          icon={<FileText className="h-6 w-6 text-primary" />}
          trend="up"
          trendValue="+6.1% depuis la période précédente"
        />
        
        <StatCard 
          title={t('finance.tokens.stats.avgCost', 'Coût moyen / 1k tokens')}
          value={formatCurrency(mockStats.averageCostPerToken * 1000)}
          icon={<AlertTriangle className="h-6 w-6 text-primary" />}
          info="Basé sur la consommation moyenne"
        />
        
        <StatCard 
          title={t('finance.tokens.stats.activeCustomers', 'Clients actifs')}
          value="5"
          icon={<Calendar className="h-6 w-6 text-primary" />}
          trend="up"
          trendValue="+2 depuis la période précédente"
        />
      </div>

      {/* Graphiques et répartition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ServiceBreakdown />
        <TopCustomersChart />
        <DailyUsageChart />
      </div>

      {/* Tableau des consommations */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('finance.tokens.usageTable.title', 'Détail de la consommation')}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('finance.tokens.usageTable.description', 'Historique détaillé de la consommation de tokens par client et par service')}
              </p>
            </div>
          </div>
          
          {/* Filtres et recherche */}
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('common.searchPlaceholder', 'Rechercher...') as string}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
                >
                  <option value="all">{t('finance.tokens.filters.allServices', 'Tous les services')}</option>
                  <option value="text">{t('finance.tokens.serviceTypes.text', 'Traitement de texte')}</option>
                  <option value="voice">{t('finance.tokens.serviceTypes.voice', 'Reconnaissance vocale')}</option>
                  <option value="image">{t('finance.tokens.serviceTypes.image', 'Traitement d\'images')}</option>
                  <option value="chat">{t('finance.tokens.serviceTypes.chat', 'Conversation IA')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  value={dateRangeFilter}
                  onChange={(e) => setDateRangeFilter(e.target.value)}
                  className="pl-3 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
                >
                  <option value="1d">{t('finance.tokens.timeRanges.1d', 'Dernier jour')}</option>
                  <option value="7d">{t('finance.tokens.timeRanges.7d', '7 derniers jours')}</option>
                  <option value="30d">{t('finance.tokens.timeRanges.30d', '30 derniers jours')}</option>
                  <option value="90d">{t('finance.tokens.timeRanges.90d', '90 derniers jours')}</option>
                  <option value="all">{t('finance.tokens.timeRanges.all', 'Toute la période')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tableau des consommations */}
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredUsage.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'customerName') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('customerName');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    {t('finance.tokens.columns.customer', 'Client')}
                    {sortBy === 'customerName' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'date') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('date');
                        setSortDirection('desc');
                      }
                    }}
                  >
                    {t('finance.tokens.columns.date', 'Date')}
                    {sortBy === 'date' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'serviceType') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('serviceType');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    {t('finance.tokens.columns.service', 'Service')}
                    {sortBy === 'serviceType' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'model') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('model');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    {t('finance.tokens.columns.model', 'Modèle')}
                    {sortBy === 'model' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'tokensConsumed') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('tokensConsumed');
                        setSortDirection('desc');
                      }
                    }}
                  >
                    {t('finance.tokens.columns.tokens', 'Tokens')}
                    {sortBy === 'tokensConsumed' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'requestCount') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('requestCount');
                        setSortDirection('desc');
                      }
                    }}
                  >
                    {t('finance.tokens.columns.requests', 'Requêtes')}
                    {sortBy === 'requestCount' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'cost') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('cost');
                        setSortDirection('desc');
                      }
                    }}
                  >
                    {t('finance.tokens.columns.cost', 'Coût')}
                    {sortBy === 'cost' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">{t('common.actions', 'Actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsage.map((usage) => (
                  <tr 
                    key={usage.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {usage.customerName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {usage.customerId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(usage.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${serviceTypeConfig[usage.serviceType].color}`}>
                        {serviceTypeConfig[usage.serviceType].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {usage.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatNumber(usage.tokensConsumed)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {usage.requestCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(usage.cost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={(e) => handleToggleActionMenu(usage.id, e)}
                          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {showActionMenu === usage.id && <ActionMenu tokenUsage={usage} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              {searchTerm || serviceFilter !== 'all' || customerFilter !== 'all'
                ? t('finance.tokens.noResults', 'Aucun résultat trouvé')
                : t('finance.tokens.noUsage', 'Aucune consommation enregistrée')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || serviceFilter !== 'all' || customerFilter !== 'all'
                ? t('finance.tokens.tryDifferentSearch', 'Essayez une recherche différente')
                : t('finance.tokens.checkLater', 'Les nouvelles consommations apparaîtront ici.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}