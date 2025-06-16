import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  RefreshCw, ChevronDown, Search,
  AlertTriangle, MoreVertical, ChevronUp, Download
} from 'lucide-react';
import { useTokens } from '../../hooks/useTokens';
import type { TokenTransaction, TokenTransactionFilterParams, TokenType } from '../../types/finance';
import { useToast } from '../../hooks/useToast';

const ITEMS_PER_PAGE = 10;

export function TokensPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<'all' | TokenType>('all');
  const [sortBy, setSortBy] = useState<keyof TokenTransaction | 'serviceType' | 'tokensConsumed' | 'date'>('transactionDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState<{ startDate: string | null, endDate: string | null }>({ startDate: null, endDate: null });
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filters: TokenTransactionFilterParams = useMemo(() => {
    const newFilters: TokenTransactionFilterParams = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: searchTerm || undefined,
      tokenType: serviceFilter === 'all' ? undefined : serviceFilter,
      sortBy: sortBy as string, // The API should handle string-based sorting keys
      sortDirection: sortDirection,
    };

    if (dateRangeFilter !== 'all' && dateRangeFilter !== 'custom') {
      const now = new Date();
      const startDate = new Date();
      if (dateRangeFilter === '7d') startDate.setDate(now.getDate() - 7);
      else if (dateRangeFilter === '30d') startDate.setDate(now.getDate() - 30);
      else if (dateRangeFilter === '90d') startDate.setDate(now.getDate() - 90);
      newFilters.startDate = startDate.toISOString().split('T')[0];
      newFilters.endDate = now.toISOString().split('T')[0];
    } else if (dateRangeFilter === 'custom' && customDateRange.startDate && customDateRange.endDate) {
      newFilters.startDate = customDateRange.startDate;
      newFilters.endDate = customDateRange.endDate;
    }
    return newFilters;
  }, [currentPage, searchTerm, serviceFilter, sortBy, sortDirection, dateRangeFilter, customDateRange]);

  const { 
    tokenTransactions, 
    isLoading, 
    error, 
    pagination, 
  } = useTokens(filters);

  useEffect(() => {
    if (error) {
      showToast('error', error.message);
    }
  }, [error, showToast]);

  const serviceTypeConfig: Record<string, { label: string; color: string }> = useMemo(() => ({
    text_generation: { 
      label: t('finance.tokens.serviceTypes.text'),
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    },
    voice_transcription: {
      label: t('finance.tokens.serviceTypes.voice'),
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    },
    image_generation: {
      label: t('finance.tokens.serviceTypes.image'),
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
    },
    chat_completion: {
      label: t('finance.tokens.serviceTypes.chat'),
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    wanzo_credit: {
      label: t('finance.tokens.serviceTypes.wanzo_credit'),
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    },
    api_call: {
      label: t('finance.tokens.serviceTypes.api_call'),
      color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    },
    storage_gb: {
        label: t('finance.tokens.serviceTypes.storage_gb'),
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    },
    processing_unit: {
        label: t('finance.tokens.serviceTypes.processing_unit'),
        color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    },
    generic: {
        label: t('finance.tokens.serviceTypes.generic'),
        color: 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200'
    },
    unknown: {
      label: t('finance.tokens.serviceTypes.unknown'),
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }), [t]);

  const serviceFilterOptions = useMemo(() => {
    const options = Object.keys(serviceTypeConfig).map(key => ({
      value: key,
      label: serviceTypeConfig[key].label
    }));
    return [{ value: 'all', label: t('finance.tokens.filters.allServices') }, ...options];
  }, [serviceTypeConfig, t]);

  const dateRangeOptions = useMemo(() => [
    { value: 'all', label: t('finance.tokens.filters.allTime') },
    { value: '7d', label: t('finance.tokens.filters.last7Days') },
    { value: '30d', label: t('finance.tokens.filters.last30Days') },
    { value: '90d', label: t('finance.tokens.filters.last90Days') },
    { value: 'custom', label: t('finance.tokens.filters.customRange') },
  ], [t]);

  const tableHeaderKeys = useMemo(() => [
    { key: 'customerName', label: t('finance.tokens.table.customer'), sortable: true, className: 'w-1/6' },
    { key: 'transactionDate', label: t('finance.tokens.table.date'), sortable: true, className: 'w-1/6' },
    { key: 'serviceType', label: t('finance.tokens.table.serviceType'), sortable: true, className: 'w-1/6' },
    { key: 'tokenType', label: t('finance.tokens.table.tokenType'), sortable: true, className: 'w-1/6' },
    { key: 'amount', label: t('finance.tokens.table.tokens'), sortable: true, className: 'w-1/6 text-right' },
    { key: 'actions', label: t('finance.tokens.table.actions'), sortable: false, className: 'w-1/12 text-center' },
  ], [t]);

  const handleExport = useCallback(() => {
    showToast('info', t('finance.tokens.exportNotImplemented'));
  }, [showToast, t]);

  const toggleActionMenu = useCallback((transactionId: string) => {
    setShowActionMenu(prev => (prev === transactionId ? null : transactionId));
  }, []);
  
  const getServiceTypeDetails = useCallback((transaction: TokenTransaction): { label: string; color: string } => {
    const serviceTypeKey = transaction.metadata?.serviceType as string || transaction.tokenType || 'unknown';
    return serviceTypeConfig[serviceTypeKey] || serviceTypeConfig.unknown;
  }, [serviceTypeConfig]);

  const handleRefresh = useCallback(() => {
    // The useTokens hook automatically refreshes when filters change.
    // For a manual refresh, you might need to implement a refresh function in useTokens
    // or slightly change a filter to trigger a re-fetch.
    // For now, we can show a toast.
    showToast('info', t('finance.tokens.refreshingData'));
  }, [showToast, t]);

  const handleSort = useCallback((newSortBy: keyof TokenTransaction | 'serviceType' | 'tokensConsumed' | 'date') => {
    if (sortBy === newSortBy) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  }, [sortBy]);

  const totalPages = pagination ? pagination.totalPages : 1;

  const renderPagination = () => {
    if (!pagination || pagination.totalCount === 0) return null;
    return (
      <div className="flex justify-between items-center py-2">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t('finance.tokens.pagination.info', { 
            from: Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, pagination.totalCount), 
            to: Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalCount),
            total: pagination.totalCount,
          })}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md shadow hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('finance.tokens.pagination.prev')}
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentPage} / {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md shadow hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('finance.tokens.pagination.next')}
          </button>
        </div>
      </div>
    );
  };

  if (error && !tokenTransactions) { // Only show full-page error if there's no data to display
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500 p-4">
        <AlertTriangle size={48} className="mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('finance.tokens.errorLoadingTitle')}</h2>
        <p>{error.message}</p>
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
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('finance.tokens.title')}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('finance.tokens.subtitle')}</p>
      </header>
      
      {/* Filters section */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
      </div>

      {/* Table section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
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
                      disabled={key === 'actions'}
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
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="animate-pulse">
                <td className="px-4 py-2"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" /></td>
                <td className="px-4 py-2"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                <td className="px-4 py-2"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28" /></td>
                <td className="px-4 py-2"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                <td className="px-4 py-2 text-right"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto" /></td>
                <td className="px-4 py-2 text-center"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-10 mx-auto" /></td>
              </tr>
            ))}
            {!isLoading && error && (
              <tr>
                <td colSpan={tableHeaderKeys.length} className="px-4 py-8 text-center text-red-500">
                  <AlertTriangle className="inline-block mr-2" />
                  {t('common.error_loading_data')}
                </td>
              </tr>
            )}
            {!isLoading && !error && tokenTransactions && tokenTransactions.length === 0 && (
              <tr>
                <td colSpan={tableHeaderKeys.length} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {t('common.no_data_available')}
                </td>
              </tr>
            )}
            {!isLoading && !error && tokenTransactions && tokenTransactions.length > 0 && tokenTransactions.map(transaction => (
              <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.customerName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{transaction.customerId}</div>
                </td>
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
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => toggleActionMenu(transaction.id)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {showActionMenu === transaction.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
                        <button 
                          onClick={() => {
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
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination section */}
      {!isLoading && !error && tokenTransactions && tokenTransactions.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          {renderPagination()}
        </div>
      )}
    </div>
  );
}