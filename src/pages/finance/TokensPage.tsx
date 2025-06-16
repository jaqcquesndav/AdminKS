import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom'; // Commented out as navigate is not used
import { 
  RefreshCw, ChevronDown, Search,
  AlertTriangle, MoreVertical, ChevronUp, Download // Added MoreVertical, ChevronUp, Download
} from 'lucide-react';
// import { useToastContext } from '../../contexts/ToastContext'; // Replaced by useToast from useTokens
// import { useTokenStats } from '../../hooks/useTokenStats'; // Removed local mock hook
import { useTokens } from '../../hooks/useTokens';
import type { TokenTransaction, TokenTransactionFilterParams, TokenType } from '../../types/finance';
import { useToast } from '../../hooks/useToast'; 

// Types
// interface TokenUsage { // Removed, will use TokenTransaction
//   id: string;
//   customerId: string;
//   customerName: string;
//   customerType: 'pme' | 'financial';
//   date: string;
//   tokensConsumed: number;
//   model: string;
//   serviceType: 'text' | 'voice' | 'image' | 'chat';
//   cost: number; // This will store the cost in activeCurrency
//   requestCount: number;
// }

// Intermediate type for mock data with cost in base currency
// type TokenUsageInput = Omit<TokenUsage, 'cost'> & { costBase: number }; // Removed

// interface TokenStats { // Removed, stats handling deferred
//   totalTokensConsumed: number;
//   totalCost: number;
//   averageCostPerToken: number;
//   tokensPerService: {
//     text: number;
//     voice: number;
//     image: number;
//     chat: number;
//   };
//   costPerService: {
//     text: number;
//     voice: number;
//     image: number;
//     chat: number;
//   };
//   topCustomers: Array<{
//     id: string;
//     name: string;
//     tokensConsumed: number;
//     cost: number;
//   }>;
//   dailyUsage: Array<{
//     date: string;
//     tokensConsumed: number;
//     cost: number;
//   }>;
// }

const ITEMS_PER_PAGE = 10;

export function TokensPage() {
  const { t } = useTranslation();
  const { showToast } = useToast(); 
  // const navigate = useNavigate(); // Commented out as navigate is not used
  
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<'all' | TokenType>('all'); 
  const [sortBy, setSortBy] = useState<keyof TokenTransaction | 'serviceType' | 'tokensConsumed' | 'date'>('transactionDate'); 
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateRangeFilter, setDateRangeFilter] = useState('all'); // e.g., '7d', '30d', 'custom'
  const [customDateRange, setCustomDateRange] = useState<{ startDate: string | null, endDate: string | null }>({ startDate: null, endDate: null });
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const initialFilters: TokenTransactionFilterParams = useMemo(() => ({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    // transactionType: 'usage', // Removed: useTokens hook handles this internally based on function called
  }), [currentPage]);

  const { 
    tokenTransactions, 
    // tokenPackages, // Not used in this page directly yet
    isLoading, 
    error, 
    pagination, 
    fetchTokenTransactions,
    // purchaseTokens, // Action, not for display
    // issueTokens // Action, not for display
  } = useTokens(initialFilters);

  // const [stats, setStats] = useState<TokenStats | null>(null); // Stats handling deferred

  // Configuration des types de service - This needs to map from TokenTransaction.tokenType or metadata.serviceType
  // This is a placeholder, actual mapping will depend on backend data.
  const serviceTypeConfig: Record<string, { label: string; color: string }> = useMemo(() => ({
    text_generation: { // Example: mapping 'text_generation' (from backend) to UI label/color
      label: t('finance.tokens.serviceTypes.text', 'Text Processing'),
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    },
    voice_transcription: {
      label: t('finance.tokens.serviceTypes.voice', 'Voice Recognition'),
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    },
    image_generation: {
      label: t('finance.tokens.serviceTypes.image', 'Image Processing'),
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
    },
    chat_completion: {
      label: t('finance.tokens.serviceTypes.chat', 'AI Chat'),
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    wanzo_credit: {
      label: t('finance.tokens.serviceTypes.wanzo_credit', 'Wanzo Credit'),
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    },
    api_call: {
      label: t('finance.tokens.serviceTypes.api_call', 'API Call'),
      color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    },
    storage_gb: {
        label: t('finance.tokens.serviceTypes.storage_gb', 'Storage GB'),
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    },
    processing_unit: {
        label: t('finance.tokens.serviceTypes.processing_unit', 'Processing Unit'),
        color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    },
    generic: {
        label: t('finance.tokens.serviceTypes.generic', 'Generic Token'),
        color: 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200'
    },
    unknown: {
      label: t('finance.tokens.serviceTypes.unknown', 'Unknown Service'),
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }), [t]);
  
  const getServiceTypeDetails = React.useCallback((transaction: TokenTransaction): { label: string; color: string } => {
    const serviceTypeKey = transaction.metadata?.serviceType as string || transaction.tokenType || 'unknown';
    return serviceTypeConfig[serviceTypeKey] || serviceTypeConfig.unknown;
  }, [serviceTypeConfig]); // serviceTypeConfig is now memoized, t is removed from deps


  // Data fetching and filtering logic
  useEffect(() => {
    const filters: TokenTransactionFilterParams = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: searchTerm || undefined,
      tokenType: serviceFilter === 'all' ? undefined : serviceFilter,
      // transactionType: 'usage', // Removed: useTokens hook handles this internally
    };
    
    if (dateRangeFilter !== 'all' && dateRangeFilter !== 'custom') {
      const now = new Date();
      const startDate = new Date(); // Changed to const
      if (dateRangeFilter === '7d') startDate.setDate(now.getDate() - 7);
      else if (dateRangeFilter === '30d') startDate.setDate(now.getDate() - 30);
      else if (dateRangeFilter === '90d') startDate.setDate(now.getDate() - 90);
      filters.startDate = startDate.toISOString().split('T')[0];
      filters.endDate = now.toISOString().split('T')[0];
    } else if (dateRangeFilter === 'custom' && customDateRange.startDate && customDateRange.endDate) {
      filters.startDate = customDateRange.startDate;
      filters.endDate = customDateRange.endDate;
    }

    fetchTokenTransactions(filters);
  }, [searchTerm, serviceFilter, dateRangeFilter, customDateRange, currentPage, fetchTokenTransactions]);

  // Client-side sorting for now, ideally backend should handle this
  const sortedTransactions = useMemo(() => {
    if (!tokenTransactions) return [];
    return [...tokenTransactions].sort((a, b) => {
      let valA: string | number | undefined | null, valB: string | number | undefined | null;
      
      // Handle specific sort keys that require custom logic or accessors
      if (sortBy === 'date') { // Mapped to 'transactionDate'
        valA = new Date(a.transactionDate).getTime();
        valB = new Date(b.transactionDate).getTime();
      } else if (sortBy === 'tokensConsumed') { // Mapped to 'amount'
        valA = a.amount;
        valB = b.amount;
      } else if (sortBy === 'serviceType') { // Sorting by derived serviceType label
        valA = getServiceTypeDetails(a).label.toLowerCase();
        valB = getServiceTypeDetails(b).label.toLowerCase();
      } else if (sortBy === 'customerName') {
        valA = a.customerName?.toLowerCase() || '';
        valB = b.customerName?.toLowerCase() || '';
      } else if (sortBy === 'tokenType') { // model / tokenType
        valA = a.tokenType?.toLowerCase() || '';
        valB = b.tokenType?.toLowerCase() || '';
      }
      else { // Default case for direct properties of TokenTransaction
        const key = sortBy as keyof TokenTransaction;
        if (key === 'metadata') {
          // Cannot sort by metadata object directly.
          valA = null; 
          valB = null;
        } else {
          // Assert that other properties are sortable primitives or null/undefined
          valA = a[key] as string | number | null | undefined;
          valB = b[key] as string | number | null | undefined;
        }
      }

      // Handle cases where valA or valB might be null or undefined after extraction
      if (valA == null && valB == null) return 0;
      if (valA == null) return sortDirection === 'asc' ? -1 : 1; // or 1 / -1 depending on how you want to sort nulls
      if (valB == null) return sortDirection === 'asc' ? 1 : -1; // or -1 / 1

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tokenTransactions, sortBy, sortDirection, getServiceTypeDetails]);


  const handleSort = (column: keyof TokenTransaction | 'serviceType' | 'tokensConsumed' | 'date') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const handleRefresh = () => {
    const currentFilters: TokenTransactionFilterParams = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: searchTerm || undefined,
      tokenType: serviceFilter === 'all' ? undefined : serviceFilter,
      // transactionType: 'usage', // Removed: useTokens hook handles this internally
    };
    if (dateRangeFilter !== 'all' && dateRangeFilter !== 'custom') {
      const now = new Date();
      const startDate = new Date(); // Changed to const
      if (dateRangeFilter === '7d') startDate.setDate(now.getDate() - 7);
      else if (dateRangeFilter === '30d') startDate.setDate(now.getDate() - 30);
      else if (dateRangeFilter === '90d') startDate.setDate(now.getDate() - 90);
      currentFilters.startDate = startDate.toISOString().split('T')[0];
      currentFilters.endDate = now.toISOString().split('T')[0];
    } else if (dateRangeFilter === 'custom' && customDateRange.startDate && customDateRange.endDate) {
      currentFilters.startDate = customDateRange.startDate;
      currentFilters.endDate = customDateRange.endDate;
    }
    fetchTokenTransactions(currentFilters);
    showToast('info', t('finance.tokens.refreshMessage'));
  };

  const handleExport = () => {
    // TODO: Implement actual CSV/PDF export functionality
    showToast('info', t('finance.tokens.exportMessage'));
    console.log('Exporting data:', sortedTransactions);
  };

  const toggleActionMenu = (id: string | null) => {
    setShowActionMenu(showActionMenu === id ? null : id);
  };
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Placeholder for service filter options - should be dynamic based on available tokenTypes or metadata
  const serviceFilterOptions = [
    { value: 'all', label: t('finance.tokens.filters.allServices') },
    { value: 'text_generation' as TokenType, label: t('finance.tokens.serviceTypes.text') },
    { value: 'voice_transcription' as TokenType, label: t('finance.tokens.serviceTypes.voice') },
    { value: 'image_generation' as TokenType, label: t('finance.tokens.serviceTypes.image') },
    { value: 'chat_completion' as TokenType, label: t('finance.tokens.serviceTypes.chat') },
    { value: 'wanzo_credit' as TokenType, label: t('finance.tokens.serviceTypes.wanzo_credit') },
    { value: 'api_call' as TokenType, label: t('finance.tokens.serviceTypes.api_call') },
    { value: 'storage_gb' as TokenType, label: t('finance.tokens.serviceTypes.storage_gb') },
    { value: 'processing_unit' as TokenType, label: t('finance.tokens.serviceTypes.processing_unit') },
    { value: 'generic' as TokenType, label: t('finance.tokens.serviceTypes.generic') },
  ];
  
  const dateRangeOptions = [
    { value: 'all', label: t('finance.tokens.filters.allTime') },
    { value: '7d', label: t('finance.tokens.filters.last7Days') },
    { value: '30d', label: t('finance.tokens.filters.last30Days') },
    { value: '90d', label: t('finance.tokens.filters.last90Days') },
    { value: 'custom', label: t('finance.tokens.filters.customRange') },
  ];

  const tableHeaderKeys: Array<{ key: keyof TokenTransaction | 'serviceType' | 'tokensConsumed' | 'date' | 'actions'; label: string; sortable: boolean; className?: string }> = [
    { key: 'customerName', label: t('finance.tokens.table.customer'), sortable: true, className: 'w-1/6' },
    // { key: 'customerType', label: t('finance.tokens.table.customerType\'), sortable: true, className: 'w-1/12' }, // customerType not directly on TokenTransaction
    { key: 'transactionDate' as 'date', label: t('finance.tokens.table.date'), sortable: true, className: 'w-1/12' }, // Mapped to transactionDate, ensure key matches handleSort
    { key: 'serviceType', label: t('finance.tokens.table.serviceType'), sortable: true, className: 'w-1/6' }, // Derived from tokenType/metadata
    { key: 'tokenType', label: t('finance.tokens.table.model'), sortable: true, className: 'w-1/6' }, // Mapped to tokenType (model)
    { key: 'amount' as 'tokensConsumed', label: t('finance.tokens.table.tokens'), sortable: true, className: 'w-1/12 text-right' }, // Mapped to amount, ensure key matches handleSort
    // { key: 'cost', label: t('finance.tokens.table.cost\'), sortable: true, className: 'w-1/12 text-right' }, // Cost not on TokenTransaction
    // { key: 'requestCount', label: t('finance.tokens.table.requests\'), sortable: true, className: 'w-1/12 text-right' }, // requestCount not directly on TokenTransaction
    { key: 'actions', label: t('finance.tokens.table.actions'), sortable: false, className: 'w-1/12 text-center' }
  ];


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <AlertTriangle size={48} className="mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('finance.tokens.errorLoadingTitle')}</h2>
        <p>{t('finance.tokens.errorLoadingMessage', { message: error.message })}</p>
        <button 
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <RefreshCw size={18} className="mr-2" />
          {t('finance.tokens.tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('finance.tokens.title')}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('finance.tokens.subtitle')}</p>
      </header>
      
      {/* Token Usage Table Section */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <div className="relative w-full sm:w-auto max-w-xs">
            <input 
              type="text"
              placeholder={t('finance.tokens.filters.searchPlaceholder')}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white w-full"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center"> {/* Added items-center for alignment */}
            <div className="relative">
              <select 
                value={serviceFilter}
                onChange={(e) => { setServiceFilter(e.target.value as 'all' | TokenType); setCurrentPage(1);}}
                className="appearance-none pr-8 py-2 pl-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                {serviceFilterOptions.map((option: {value: string, label: string}) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={dateRangeFilter}
                onChange={(e) => { setDateRangeFilter(e.target.value); setCurrentPage(1); if (e.target.value !== 'custom') setCustomDateRange({ startDate: null, endDate: null }); }}
                className="appearance-none pr-8 py-2 pl-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
            {dateRangeFilter === 'custom' && (
              <div className="flex gap-2 items-center">
                <input 
                  type="date" 
                  value={customDateRange.startDate || ''}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <span className="text-gray-500 dark:text-gray-400">-</span>
                <input 
                  type="date" 
                  value={customDateRange.endDate || ''}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  min={customDateRange.startDate || undefined}
                />
              </div>
            )}
             <button 
              onClick={handleRefresh}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              title={t('finance.tokens.filters.refresh')}
            >
              <RefreshCw size={20} />
            </button>
            <button 
              onClick={handleExport} // Attached handleExport
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              title={t('finance.tokens.filters.export')}
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw size={32} className="animate-spin text-blue-500" />
            <p className="ml-2 text-gray-600 dark:text-gray-400">{t('finance.tokens.loading')}</p>
          </div>
        ) : (
          <>
            {/* Table - Token Transactions */}
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    {tableHeaderKeys.map(({ key, label, sortable, className }) => (
                      <th key={key as string} className={`px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}>
                        {sortable ? (
                          <button 
                            onClick={() => {
                              handleSort(key as keyof TokenTransaction | 'serviceType' | 'tokensConsumed' | 'date');
                            }}
                            className="flex items-center focus:outline-none"
                            disabled={key === 'actions'} // Disable button for 'actions'
                          >
                            <span>{label}</span>
                            {sortBy === key && (
                              sortDirection === 'asc' ? 
                              <ChevronUp size={16} className="ml-2" /> : 
                              <ChevronDown size={16} className="ml-2" />
                            )}
                          </button>
                        ) : (
                          <span>{label}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={tableHeaderKeys.length} className="px-4 py-2 text-center text-gray-500 dark:text-gray-400">
                        {t('finance.tokens.noData')}
                      </td>
                    </tr>
                  ) : (
                    sortedTransactions.map(transaction => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.customerName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{transaction.customerId}</div>
                        </td>
                        {/* <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{transaction.customerType}</div>
                        </td> */}
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{new Date(transaction.transactionDate).toLocaleString()}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getServiceTypeDetails(transaction).color}`}>
                            {getServiceTypeDetails(transaction).label}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{transaction.tokenType}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900 dark:text-white">{transaction.amount}</div>
                        </td>
                        {/* <td className="px-4 py-2 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900 dark:text-white">{transaction.cost}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900 dark:text-white">{transaction.requestCount}</div>
                        </td> */}
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => toggleActionMenu(transaction.id)}
                              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {/* Action menu - Placeholder for future actions (e.g., edit, delete) */}
                            {showActionMenu === transaction.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
                                {/* <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  {t('finance.tokens.actions.edit')}
                              </button> */}
                                <button 
                                  onClick={() => {
                                    // handleDeleteTransaction(transaction.id); // Implement delete logic
                                    showToast('info', t('finance.tokens.actions.deleteNotImplemented'));
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
                                >
                                  {t('finance.tokens.actions.delete')}
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalCount > 0 && ( // Ensure pagination object and totalCount exist
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
                  {t('finance.tokens.pagination.info', { 
                    from: Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, pagination.totalCount), 
                    to: Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalCount),
                    total: pagination.totalCount,
                    //totalPages: pagination.totalPages // Add if available and needed
                  })}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md shadow hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('finance.tokens.pagination.prev')}
                  </button>
                  {/* Page numbers can be added here if pagination.totalPages is available */}
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination || currentPage === pagination.totalPages || pagination.totalCount === 0}
                    className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md shadow hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('finance.tokens.pagination.next')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div> {/* Closing div for "bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow" */}
    </div> // Closing div for "p-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
  );
}