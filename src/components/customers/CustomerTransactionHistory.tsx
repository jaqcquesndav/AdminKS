import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, ArrowDownCircle, ArrowUpCircle, Calendar, ChevronsUpDown, Search, Filter } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';

export interface CustomerTransaction {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  type: 'payment' | 'refund' | 'subscription' | 'credit';
  description: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionDate: string;
  paymentMethod: 'card' | 'bank_transfer' | 'manual' | 'subscription';
  invoiceNumber?: string;
}

interface CustomerTransactionHistoryProps {
  customerId: string;
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

export function CustomerTransactionHistory({
  customerId,
  limit = 5,
  showFilters = true,
  className = ''
}: CustomerTransactionHistoryProps) {
  const { t } = useTranslation();
  const { activeCurrency } = useCurrencySettings();
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Simuler une requête API avec données mockées
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const mockTransactions: CustomerTransaction[] = [
          {
            id: 'txn-001',
            customerId,
            amount: 299.99,
            currency: 'EUR',
            type: 'payment',
            description: 'Abonnement Premium - Janvier 2023',
            status: 'completed',
            transactionDate: '2023-01-05',
            paymentMethod: 'card',
            invoiceNumber: 'INV-2023-001'
          },
          {
            id: 'txn-002',
            customerId,
            amount: 299.99,
            currency: 'EUR',
            type: 'payment',
            description: 'Abonnement Premium - Février 2023',
            status: 'completed',
            transactionDate: '2023-02-05',
            paymentMethod: 'card',
            invoiceNumber: 'INV-2023-025'
          },
          {
            id: 'txn-003',
            customerId,
            amount: 299.99,
            currency: 'EUR',
            type: 'payment',
            description: 'Abonnement Premium - Mars 2023',
            status: 'completed',
            transactionDate: '2023-03-05',
            paymentMethod: 'card',
            invoiceNumber: 'INV-2023-048'
          },
          {
            id: 'txn-004',
            customerId,
            amount: 150.00,
            currency: 'EUR',
            type: 'refund',
            description: 'Remboursement partiel - Service indisponible',
            status: 'refunded',
            transactionDate: '2023-03-20',
            paymentMethod: 'manual',
            invoiceNumber: 'REF-2023-003'
          },
          {
            id: 'txn-005',
            customerId,
            amount: 299.99,
            currency: 'EUR',
            type: 'payment',
            description: 'Abonnement Premium - Avril 2023',
            status: 'pending',
            transactionDate: '2023-04-05',
            paymentMethod: 'bank_transfer'
          },
          {
            id: 'txn-006',
            customerId,
            amount: 500.00,
            currency: 'EUR',
            type: 'credit',
            description: 'Crédit pour période de test prolongée',
            status: 'completed',
            transactionDate: '2023-04-10',
            paymentMethod: 'manual'
          },
          {
            id: 'txn-007',
            customerId,
            amount: 299.99,
            currency: 'EUR',
            type: 'payment',
            description: 'Abonnement Premium - Mai 2023',
            status: 'failed',
            transactionDate: '2023-05-05',
            paymentMethod: 'card'
          }
        ];
        
        setTransactions(mockTransactions);
      } catch (error) {
        console.error('Erreur lors du chargement des transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [customerId]);

  // Formatter les dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  // Fonction pour trier les transactions
  const sortTransactions = (a: CustomerTransaction, b: CustomerTransaction) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.transactionDate).getTime();
      const dateB = new Date(b.transactionDate).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  };

  // Fonction pour filtrer les transactions
  const getFilteredTransactions = () => {
    return transactions
      .filter(transaction => {
        // Filtre par terme de recherche
        const matchesSearch = 
          searchTerm === '' || 
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (transaction.invoiceNumber && 
           transaction.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Filtre par statut
        const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
        
        // Filtre par type
        const matchesType = filterType === 'all' || transaction.type === filterType;
        
        return matchesSearch && matchesStatus && matchesType;
      })
      .sort(sortTransactions)
      .slice(0, limit);
  };

  // Obtenir le style de badge en fonction du statut
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir l'icône en fonction du type de transaction
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <ArrowDownCircle className="h-5 w-5 text-green-500" />;
      case 'refund':
        return <ArrowUpCircle className="h-5 w-5 text-red-500" />;
      case 'subscription':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'credit':
        return <CreditCard className="h-5 w-5 text-purple-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  // Changer le tri
  const toggleSort = (column: 'date' | 'amount') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className={`bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {t('customers.transactions.title', 'Historique des transactions')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {t('customers.transactions.subtitle', 'Dernières transactions financières')}
          </p>
        </div>
      </div>

      {showFilters && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('common.search', 'Rechercher...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">{t('customers.transactions.filters.allStatus', 'Tous les statuts')}</option>
                  <option value="completed">{t('status.completed', 'Complété')}</option>
                  <option value="pending">{t('status.pending', 'En attente')}</option>
                  <option value="failed">{t('status.failed', 'Échoué')}</option>
                  <option value="refunded">{t('status.refunded', 'Remboursé')}</option>
                </select>
              </div>

              <div className="relative">
                <CreditCard className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">{t('customers.transactions.filters.allTypes', 'Tous les types')}</option>
                  <option value="payment">{t('transaction.type.payment', 'Paiement')}</option>
                  <option value="refund">{t('transaction.type.refund', 'Remboursement')}</option>
                  <option value="subscription">{t('transaction.type.subscription', 'Abonnement')}</option>
                  <option value="credit">{t('transaction.type.credit', 'Crédit')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 overflow-hidden">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('customers.transactions.table.type', 'Type')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('customers.transactions.table.description', 'Description')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center">
                      {t('customers.transactions.table.date', 'Date')}
                      <ChevronsUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('amount')}
                  >
                    <div className="flex items-center justify-end">
                      {t('customers.transactions.table.amount', 'Montant')}
                      <ChevronsUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('customers.transactions.table.status', 'Statut')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTransactionTypeIcon(transaction.type)}
                        <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                          {transaction.type === 'payment' && t('transaction.type.payment', 'Paiement')}
                          {transaction.type === 'refund' && t('transaction.type.refund', 'Remboursement')}
                          {transaction.type === 'subscription' && t('transaction.type.subscription', 'Abonnement')}
                          {transaction.type === 'credit' && t('transaction.type.credit', 'Crédit')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {transaction.description}
                      </div>
                      {transaction.invoiceNumber && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.invoiceNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {formatCurrency(transaction.amount, activeCurrency || transaction.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(transaction.status)}`}>
                        {transaction.status === 'completed' && t('status.completed', 'Complété')}
                        {transaction.status === 'pending' && t('status.pending', 'En attente')}
                        {transaction.status === 'failed' && t('status.failed', 'Échoué')}
                        {transaction.status === 'refunded' && t('status.refunded', 'Remboursé')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('customers.transactions.empty.title', 'Pas de transactions')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('customers.transactions.empty.description', 'Aucune transaction trouvée pour ce client.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}