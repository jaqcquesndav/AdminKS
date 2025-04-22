import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  User, 
  CreditCard, 
  Package, 
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useUnifiedDashboardTable } from '../../hooks/useUnifiedDashboardTable';
import { formatCurrency } from '../../utils/currency';

interface UnifiedDashboardTableProps {
  title?: string;
  showFilters?: boolean;
  limit?: number;
}

export function UnifiedDashboardTable({ 
  title = 'Activité récente', 
  showFilters = true,
  limit
}: UnifiedDashboardTableProps) {
  const { t } = useTranslation();
  const { 
    items, 
    totalItems, 
    isLoading, 
    filters, 
    setFilters 
  } = useUnifiedDashboardTable();

  // Configuration des types d'éléments
  const itemTypeConfig = {
    customer: {
      icon: <User className="h-4 w-4" />,
      label: t('dashboard.unified.types.customer', 'Client'),
      colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    },
    payment: {
      icon: <CreditCard className="h-4 w-4" />,
      label: t('dashboard.unified.types.payment', 'Paiement'),
      colorClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    subscription: {
      icon: <Package className="h-4 w-4" />,
      label: t('dashboard.unified.types.subscription', 'Abonnement'),
      colorClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    },
    token: {
      icon: <Layers className="h-4 w-4" />,
      label: t('dashboard.unified.types.token', 'Tokens'),
      colorClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
    }
  };

  // Configuration des statuts
  const statusConfig = {
    active: {
      colorClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    pending: {
      colorClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
    },
    inactive: {
      colorClass: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    },
    approved: {
      colorClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    rejected: {
      colorClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
  };

  // Options des filtres
  const typeOptions = [
    { value: 'all', label: t('common.all', 'Tous') },
    { value: 'customer', label: t('dashboard.unified.types.customer', 'Client') },
    { value: 'payment', label: t('dashboard.unified.types.payment', 'Paiement') },
    { value: 'subscription', label: t('dashboard.unified.types.subscription', 'Abonnement') },
    { value: 'token', label: t('dashboard.unified.types.token', 'Tokens') }
  ];

  const statusOptions = [
    { value: 'all', label: t('common.all', 'Tous') },
    { value: 'active', label: t('dashboard.unified.status.active', 'Actif') },
    { value: 'pending', label: t('dashboard.unified.status.pending', 'En attente') },
    { value: 'inactive', label: t('dashboard.unified.status.inactive', 'Inactif') },
    { value: 'approved', label: t('dashboard.unified.status.approved', 'Approuvé') },
    { value: 'rejected', label: t('dashboard.unified.status.rejected', 'Rejeté') }
  ];

  // Gestion des colonnes et tri
  const handleSort = (column: string) => {
    if (filters.sortBy === column) {
      setFilters({
        sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setFilters({
        sortBy: column,
        sortDirection: 'asc'
      });
    }
  };

  // Formatter les dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Calculer le nombre de pages
  const pageCount = Math.ceil(totalItems / (filters.pageSize || 10));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* En-tête du tableau avec titre et filtres */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-3 md:space-y-0">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h2>

          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Recherche */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('common.search', 'Rechercher...')}
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ search: e.target.value })}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Filtre par type */}
              <div className="relative">
                <select
                  value={filters.type || 'all'}
                  onChange={(e) => setFilters({ type: e.target.value })}
                  className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Filtre par statut */}
              <div className="relative">
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => setFilters({ status: e.target.value })}
                  className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Corps du tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {/* Type */}
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center space-x-1">
                  <span>{t('dashboard.unified.columns.type', 'Type')}</span>
                  {filters.sortBy === 'type' && (
                    filters.sortDirection === 'asc' 
                      ? <ChevronUp className="h-4 w-4" /> 
                      : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              
              {/* Date */}
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>{t('dashboard.unified.columns.date', 'Date')}</span>
                  {filters.sortBy === 'date' && (
                    filters.sortDirection === 'asc' 
                      ? <ChevronUp className="h-4 w-4" /> 
                      : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              
              {/* Client */}
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center space-x-1">
                  <span>{t('dashboard.unified.columns.customer', 'Client')}</span>
                  {filters.sortBy === 'customerName' && (
                    filters.sortDirection === 'asc' 
                      ? <ChevronUp className="h-4 w-4" /> 
                      : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              
              {/* Statut */}
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>{t('dashboard.unified.columns.status', 'Statut')}</span>
                  {filters.sortBy === 'status' && (
                    filters.sortDirection === 'asc' 
                      ? <ChevronUp className="h-4 w-4" /> 
                      : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              
              {/* Montant */}
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center space-x-1">
                  <span>{t('dashboard.unified.columns.amount', 'Montant')}</span>
                  {filters.sortBy === 'amount' && (
                    filters.sortDirection === 'asc' 
                      ? <ChevronUp className="h-4 w-4" /> 
                      : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </th>
              
              {/* Détails */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('dashboard.unified.columns.details', 'Détails')}
              </th>
              
              {/* Actions */}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('common.actions', 'Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              // État de chargement
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              // État vide
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {t('common.noResults', 'Aucun élément trouvé')}
                </td>
              </tr>
            ) : (
              // Données chargées
              items.slice(0, limit).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {/* Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${itemTypeConfig[item.type].colorClass}`}>
                      <span className="mr-1">{itemTypeConfig[item.type].icon}</span>
                      {itemTypeConfig[item.type].label}
                    </div>
                  </td>
                  
                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.date)}
                  </td>
                  
                  {/* Client */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.customerName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {item.customerId}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.customerType === 'pme' ? 'PME' : 'Institution Financière'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Statut */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[item.status as keyof typeof statusConfig].colorClass}`}>
                      {t(`dashboard.unified.status.${item.status}`, item.status)}
                    </span>
                  </td>
                  
                  {/* Montant */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.amount !== undefined ? (
                      item.type === 'token' ? (
                        `${new Intl.NumberFormat('fr-FR').format(item.amount)} tokens`
                      ) : (
                        formatCurrency(item.amount, 'USD')
                      )
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </td>
                  
                  {/* Détails */}
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {item.details}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={item.actionUrl}
                      className="text-primary hover:text-primary-dark dark:hover:text-primary-light"
                    >
                      {t('common.view', 'Voir')}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showFilters && pageCount > 1 && (
        <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setFilters({ page: Math.max(1, (filters.page || 1) - 1) })}
                disabled={(filters.page || 1) <= 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  (filters.page || 1) <= 1 
                    ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800' 
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {t('common.previous', 'Précédent')}
              </button>
              <button
                onClick={() => setFilters({ page: Math.min(pageCount, (filters.page || 1) + 1) })}
                disabled={(filters.page || 1) >= pageCount}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  (filters.page || 1) >= pageCount 
                    ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800' 
                    : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {t('common.next', 'Suivant')}
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t('common.showing', 'Affichage de')}{' '}
                  <span className="font-medium">{((filters.page || 1) - 1) * (filters.pageSize || 10) + 1}</span>{' '}
                  {t('common.to', 'à')}{' '}
                  <span className="font-medium">
                    {Math.min((filters.page || 1) * (filters.pageSize || 10), totalItems)}
                  </span>{' '}
                  {t('common.of', 'sur')}{' '}
                  <span className="font-medium">{totalItems}</span>{' '}
                  {t('common.results', 'résultats')}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setFilters({ page: Math.max(1, (filters.page || 1) - 1) })}
                    disabled={(filters.page || 1) <= 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                      (filters.page || 1) <= 1 
                        ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800' 
                        : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">{t('common.previous', 'Précédent')}</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {/* Pages numérotées - simplifié pour la clarté */}
                  {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
                    const pageNumber = i + 1;
                    const isCurrent = pageNumber === (filters.page || 1);
                    
                    return (
                      <button
                        key={i}
                        onClick={() => setFilters({ page: pageNumber })}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          isCurrent 
                            ? 'z-10 bg-primary dark:bg-primary-dark border-primary dark:border-primary-dark text-white' 
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  {pageCount > 5 && (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                      ...
                    </span>
                  )}
                  
                  <button
                    onClick={() => setFilters({ page: Math.min(pageCount, (filters.page || 1) + 1) })}
                    disabled={(filters.page || 1) >= pageCount}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                      (filters.page || 1) >= pageCount 
                        ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800' 
                        : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">{t('common.next', 'Suivant')}</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}