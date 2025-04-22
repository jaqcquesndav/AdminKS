import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Filter, Search, 
  ArrowUpDown, ExternalLink, User, CreditCard, 
  AlertCircle, CheckCircle, Clock, Download 
} from 'lucide-react';

// Types
type ItemType = 'customer' | 'payment' | 'subscription' | 'token';

interface DashboardItem {
  id: string;
  type: ItemType;
  date: string;
  customerName: string;
  customerId: string;
  customerType: 'pme' | 'financial';
  status: string;
  amount?: number;
  details: string;
  actionUrl: string;
}

interface UnifiedDashboardTableProps {
  items: DashboardItem[];
  totalItems: number;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
}

export function UnifiedDashboardTable({
  items,
  totalItems,
  isLoading = false,
  onPageChange = () => {},
  onFilterChange = () => {}
}: UnifiedDashboardTableProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<keyof DashboardItem>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Configuration des types d'éléments
  const itemTypeConfig = {
    customer: {
      label: t('dashboard.table.types.customer', 'Client'),
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      icon: <User className="h-4 w-4" />
    },
    payment: {
      label: t('dashboard.table.types.payment', 'Paiement'),
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      icon: <CreditCard className="h-4 w-4" />
    },
    subscription: {
      label: t('dashboard.table.types.subscription', 'Abonnement'),
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      icon: <Clock className="h-4 w-4" />
    },
    token: {
      label: t('dashboard.table.types.token', 'Tokens IA'),
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      icon: <Download className="h-4 w-4" />
    }
  };

  // Configuration des statuts
  const statusConfig: Record<string, { label: string, color: string, icon: React.ReactNode }> = {
    pending: {
      label: t('dashboard.table.status.pending', 'En attente'),
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      icon: <Clock className="h-4 w-4" />
    },
    approved: {
      label: t('dashboard.table.status.approved', 'Approuvé'),
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      icon: <CheckCircle className="h-4 w-4" />
    },
    rejected: {
      label: t('dashboard.table.status.rejected', 'Rejeté'),
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      icon: <AlertCircle className="h-4 w-4" />
    },
    active: {
      label: t('dashboard.table.status.active', 'Actif'),
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      icon: <CheckCircle className="h-4 w-4" />
    },
    inactive: {
      label: t('dashboard.table.status.inactive', 'Inactif'),
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      icon: <AlertCircle className="h-4 w-4" />
    }
  };

  // Gérer le changement de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  // Gérer le changement des filtres
  const handleFilterChange = () => {
    onFilterChange({
      search: searchTerm,
      type: typeFilter,
      status: statusFilter,
      sortBy,
      sortDirection
    });
  };

  // Format de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format de la devise
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Gérer le changement de tri
  const handleSortChange = (column: keyof DashboardItem) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
    
    // Appliquer les filtres avec le nouveau tri
    setTimeout(handleFilterChange, 0);
  };

  // Pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationRange = useMemo(() => {
    const delta = 2; // Nombre de pages à afficher autour de la page actuelle
    
    const pages: Array<number | null> = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - delta - 1 || 
        i === currentPage + delta + 1
      ) {
        pages.push(null); // Représente les "..."
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  // Détermine si des filtres sont appliqués
  const hasActiveFilters = typeFilter !== 'all' || statusFilter !== 'all' || searchTerm.trim() !== '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('dashboard.table.title', 'Activités & Opérations')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('dashboard.table.description', 'Vue unifiée des transactions, opérations et comptes à traiter')}
        </p>
      </div>
      
      {/* Barre de filtres */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('dashboard.table.search', 'Rechercher...')}
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative w-full md:w-40">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary"
            >
              <option value="all">{t('dashboard.table.filters.allTypes', 'Tous types')}</option>
              <option value="customer">{t('dashboard.table.types.customer', 'Client')}</option>
              <option value="payment">{t('dashboard.table.types.payment', 'Paiement')}</option>
              <option value="subscription">{t('dashboard.table.types.subscription', 'Abonnement')}</option>
              <option value="token">{t('dashboard.table.types.token', 'Tokens IA')}</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="relative w-full md:w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary"
            >
              <option value="all">{t('dashboard.table.filters.allStatuses', 'Tous statuts')}</option>
              <option value="pending">{t('dashboard.table.status.pending', 'En attente')}</option>
              <option value="approved">{t('dashboard.table.status.approved', 'Approuvé')}</option>
              <option value="rejected">{t('dashboard.table.status.rejected', 'Rejeté')}</option>
              <option value="active">{t('dashboard.table.status.active', 'Actif')}</option>
              <option value="inactive">{t('dashboard.table.status.inactive', 'Inactif')}</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <button 
            onClick={handleFilterChange} 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {t('dashboard.table.filters.apply', 'Filtrer')}
          </button>
          
          {hasActiveFilters && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setStatusFilter('all');
                setSortBy('date');
                setSortDirection('desc');
                setTimeout(handleFilterChange, 0);
              }} 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {t('dashboard.table.filters.clear', 'Réinitialiser')}
            </button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {hasActiveFilters 
              ? t('dashboard.table.noResults', 'Aucun élément ne correspond à vos critères')
              : t('dashboard.table.noData', 'Aucune donnée disponible')
            }
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSortChange('type')}
                  >
                    {t('dashboard.table.headers.type', 'Type')}
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSortChange('date')}
                  >
                    {t('dashboard.table.headers.date', 'Date')}
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSortChange('customerName')}
                  >
                    {t('dashboard.table.headers.customer', 'Client')}
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none"
                    onClick={() => handleSortChange('status')}
                  >
                    {t('dashboard.table.headers.status', 'Statut')}
                    <ArrowUpDown className="h-3 w-3 ml-1" />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('dashboard.table.headers.details', 'Détails')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('dashboard.table.headers.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${itemTypeConfig[item.type].color}`}>
                      {itemTypeConfig[item.type].icon}
                      <span className="ml-1">{itemTypeConfig[item.type].label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.customerName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.customerType === 'pme' ? 'PME' : 'Institution Financière'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${statusConfig[item.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {statusConfig[item.status]?.icon}
                      <span className="ml-1">{statusConfig[item.status]?.label || item.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                      {item.details}
                      {item.amount !== undefined && (
                        <span className="font-medium ml-1">
                          {formatCurrency(item.amount)}
                        </span>
                      )}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      to={item.actionUrl}
                      className="inline-flex items-center text-primary hover:text-primary-dark dark:hover:text-primary-light"
                    >
                      <span className="mr-1">{t('dashboard.table.actions.view', 'Consulter')}</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
              currentPage === 1
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {t('dashboard.table.pagination.previous', 'Précédent')}
          </button>
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {t('dashboard.table.pagination.next', 'Suivant')}
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t('dashboard.table.pagination.showing', 'Affichage de')}{' '}
              <span className="font-medium">{totalItems === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}</span>{' '}
              {t('dashboard.table.pagination.to', 'à')}{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span>{' '}
              {t('dashboard.table.pagination.of', 'sur')}{' '}
              <span className="font-medium">{totalItems}</span>{' '}
              {t('dashboard.table.pagination.results', 'résultats')}
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                  currentPage === 1
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="sr-only">{t('dashboard.table.pagination.previous', 'Précédent')}</span>
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {paginationRange.map((page, index) => (
                page === null ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-primary border-primary text-white'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
              
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                  currentPage === totalPages || totalPages === 0
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="sr-only">{t('dashboard.table.pagination.next', 'Suivant')}</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}