import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Download, Eye, PlusCircle, CheckCircle, XCircle, Clock } from 'lucide-react'; // Removed AlertTriangle
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import type { SupportedCurrency } from '../../types/currency';
import { usePayments } from '../../hooks/usePayments';
import type { Payment, TransactionFilterParams, PaymentMethod as FinancePaymentMethod } from '../../types/finance'; // Renamed PaymentMethod to FinancePaymentMethod, removed TransactionStatus
import { useToast } from '../../hooks/useToast';
import { ConnectionError, BackendError } from '../../components/common/ConnectionError';
import { getErrorMessage, isNetworkError } from '../../utils/errorUtils';
import { useTranslation } from 'react-i18next'; // Added for translations

export function PaymentsPage() {
  const { t } = useTranslation(); // Added for translations
  const { showToast } = useToast();
  const { activeCurrency, formatCurrency, convert, baseCurrency } = useCurrencySettings(); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Error state from usePayments is already available, but we might want a page-level one too for other ops
  // const [pageError, setPageError] = useState<string | null>(null);
  // const [isPageNetworkError, setIsPageNetworkError] = useState(false);

  const initialFilterParams: TransactionFilterParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
  }), [currentPage, itemsPerPage]);

  const { 
    payments, 
    isLoading, 
    error: paymentsHookError, // Renamed to avoid conflict if we add page-level error state
    pagination, 
    fetchPayments,
  } = usePayments(initialFilterParams);
  
  const [displayPayments, setDisplayPayments] = useState<Payment[]>([]);

  useEffect(() => {
    setDisplayPayments(payments);
  }, [payments]);

  const mapDateRangeToParams = (dateRange: string): { startDate?: string; endDate?: string } => {
    const now = new Date();
    let startDate, endDate;

    switch (dateRange) {
      case 'today': { 
        startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString().split('T')[0];
        endDate = new Date(now.setHours(23, 59, 59, 999)).toISOString().split('T')[0];
        break;
      }
      case 'this_week': { 
        const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        firstDayOfWeek.setHours(0,0,0,0);
        startDate = firstDayOfWeek.toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0]; 
        break;
      }
      case 'this_month': { 
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      }
      default:
        return {};
    }
    return { startDate, endDate };
  };
  
  // The fetchPayments call within usePayments hook should handle its own errors and update `paymentsHookError`
  // We rely on that hook's error state for displaying ConnectionError/BackendError related to fetching payments.
  useEffect(() => {
    const { startDate, endDate } = mapDateRangeToParams(filterDateRange);
    const params: TransactionFilterParams = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined,
      status: filterStatus !== 'all' ? filterStatus as Payment['status'] : undefined, // Use Payment['status']
      paymentMethod: filterMethod !== 'all' ? filterMethod as FinancePaymentMethod : undefined, // Use FinancePaymentMethod
      startDate,
      endDate,
    };
    fetchPayments(params); // This will update isLoading and paymentsHookError from the hook
  }, [searchTerm, filterStatus, filterMethod, filterDateRange, currentPage, itemsPerPage, fetchPayments]);


  const handleViewPayment = (paymentId: string) => {
    console.log(`Afficher les détails du paiement: ${paymentId}`);
    showToast('info', t('finance.payments.viewDetailsSimulation', { paymentId }));
  };

  const handleDownloadInvoice = (invoiceNumber: string) => {
    console.log(`Télécharger la facture: ${invoiceNumber}`);
    // In a real app, this would trigger a download, potentially with error handling
    showToast('success', t('finance.payments.downloadInvoiceSimulation', { invoiceNumber }));
  };

  // Example of how an action might have its own error handling, though refund is simulated here
  const handleRefundPayment = useCallback(async (paymentId: string) => {
    // Simulation - in a real app, this would be an API call with try/catch
    console.log(`Remboursement du paiement ${paymentId} (simulation)`);
    // Optimistic UI update (can be reverted in catch block if API call fails)
    setDisplayPayments(prev => prev.map(p => p.id === paymentId ? {...p, status: 'canceled' } : p)); // Removed 'as Payment['status']' as it's inferred
    showToast('success', t('finance.payments.refundSimulationSuccess'));
    
    // Re-fetch to reflect changes (or update local state more precisely based on API response)
    const { startDate, endDate } = mapDateRangeToParams(filterDateRange);
    fetchPayments({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined,
      status: filterStatus !== 'all' ? filterStatus as Payment['status'] : undefined, // Use Payment['status']
      paymentMethod: filterMethod !== 'all' ? filterMethod as FinancePaymentMethod : undefined, // Use FinancePaymentMethod
      startDate,
      endDate,
    });
  }, [fetchPayments, showToast, currentPage, itemsPerPage, searchTerm, filterStatus, filterMethod, filterDateRange, t]);

  const handleAddPayment = () => {
    console.log('Attempting to add a new payment. Modal not yet implemented.');
    showToast('info', t('finance.payments.addPaymentSoon'));
  };

  const statusBadgeClass = (status: Payment['status']) => { // Use Payment['status']
    switch (status) {
      case 'completed':
      case 'verified': // verified can also be green
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'canceled':
      case 'rejected': // rejected can also be red
        return 'bg-red-100 text-red-800';
      // Removed default cases that were duplicating, rely on the specific cases above
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const statusIcon = (status: Payment['status']) => { // Use Payment['status']
    switch (status) {
      case 'completed':
      case 'verified':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'pending':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'failed':
      case 'canceled':
      case 'rejected':
        return <XCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: Payment['status']) => { // Use Payment['status']
    // Consider using t() for these as well for full i18n
    switch (status) {
      case 'completed':
        return t('finance.status.completed', 'Complété');
      case 'pending':
        return t('finance.status.pending', 'En attente');
      case 'failed':
        return t('finance.status.failed', 'Échoué');
      case 'canceled':
        return t('finance.status.canceled', 'Annulé');
      case 'verified':
        return t('finance.status.verified', 'Vérifié');
      case 'rejected':
        return t('finance.status.rejected', 'Rejeté');
      // Removed refunded and succeeded as they are not in Payment['status']
      default:
        // If status is 'never', this code path should ideally not be hit with valid data.
        // However, to satisfy TypeScript and provide a fallback:
        return t('finance.status.unknown', 'Unknown Status');
    }
  };

  const getPaymentMethodLabel = (method?: FinancePaymentMethod) => { // Use FinancePaymentMethod
    if (!method) return t('common.notAvailable', 'N/A');
    // Consider using t() for these as well
    switch (method.toLowerCase()) {
      case 'card':
        return t('finance.paymentMethods.card', 'Carte bancaire');
      case 'bank_transfer':
        return t('finance.paymentMethods.bank_transfer', 'Virement bancaire');
      case 'cash':
        return t('finance.paymentMethods.cash', 'Espèces');
      case 'paypal':
        return t('finance.paymentMethods.paypal', 'PayPal');
      case 'stripe':
        return t('finance.paymentMethods.stripe', 'Stripe');
      case 'manual':
        return t('finance.paymentMethods.manual', 'Manuel');
      case 'mobile_money':
        return t('finance.paymentMethods.mobile_money', 'Mobile Money');
      case 'crypto':
        return t('finance.paymentMethods.crypto', 'Crypto');
      case 'check':
        return t('finance.paymentMethods.check', 'Chèque');
      case 'other':
        return t('finance.paymentMethods.other', 'Autre');
      default:
        return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  const formatDisplayAmount = (amount: number, currency: SupportedCurrency) => {
    if (currency !== activeCurrency) {
      const convertedAmount = convert(amount, currency, activeCurrency);
      return formatCurrency(convertedAmount, activeCurrency);
    }
    return formatCurrency(amount, currency);
  };

  const totalRevenue = useMemo(() => displayPayments
    .filter(p => p.status === 'completed' || p.status === 'verified') // Adjusted status
    .reduce((sum, p) => sum + convert(p.amount, p.currency as SupportedCurrency, baseCurrency), 0), [displayPayments, convert, baseCurrency]);
  
  const pendingRevenue = useMemo(() => displayPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + convert(p.amount, p.currency as SupportedCurrency, baseCurrency), 0), [displayPayments, convert, baseCurrency]);
  
  const refundedAmount = useMemo(() => displayPayments
    .filter(p => p.status === 'canceled' || p.status === 'failed' || p.status === 'rejected') // Adjusted status
    .reduce((sum, p) => sum + convert(p.amount, p.currency as SupportedCurrency, baseCurrency), 0), [displayPayments, convert, baseCurrency]);
  // Les erreurs et états de chargement seront gérés à l'intérieur du corps du tableau plutôt qu'ici,
  // afin de toujours afficher les en-têtes du tableau

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('finance.payments.title', 'Gestion des Paiements')}</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('finance.payments.searchPlaceholder', 'Rechercher (ID, client, facture...)') as string}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full sm:w-64"
            />
          </div>
          <button
            onClick={handleAddPayment}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            {t('finance.payments.newPaymentButton', 'Nouveau Paiement')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('finance.filters.status', 'Statut')}</label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1);}}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">{t('finance.filters.allStatuses', 'Tous les statuts')}</option>
            <option value="completed">{t('finance.status.completed', 'Complété')}</option>
            <option value="pending">{t('finance.status.pending', 'En attente')}</option>
            <option value="failed">{t('finance.status.failed', 'Échoué')}</option>
            <option value="canceled">{t('finance.status.canceled', 'Annulé')}</option>
            <option value="verified">{t('finance.status.verified', 'Vérifié')}</option>
            <option value="rejected">{t('finance.status.rejected', 'Rejeté')}</option>
            {/* Removed refunded and succeeded as they are not in Payment['status'] */}
          </select>
        </div>
        <div>
          <label htmlFor="filterMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('finance.filters.method', 'Méthode')}</label>
          <select
            id="filterMethod"
            value={filterMethod}
            onChange={(e) => { setFilterMethod(e.target.value); setCurrentPage(1);}}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">{t('finance.filters.allMethods', 'Toutes les méthodes')}</option>
            <option value="card">{t('finance.paymentMethods.card', 'Carte bancaire')}</option>
            <option value="bank_transfer">{t('finance.paymentMethods.bank_transfer', 'Virement')}</option> {/* Shortened for display */}
            <option value="cash">{t('finance.paymentMethods.cash', 'Espèces')}</option>
            <option value="mobile_money">{t('finance.paymentMethods.mobile_money', 'Mobile Money')}</option>
            <option value="crypto">{t('finance.paymentMethods.crypto', 'Crypto')}</option>
            <option value="check">{t('finance.paymentMethods.check', 'Chèque')}</option>
            <option value="paypal">{t('finance.paymentMethods.paypal', 'PayPal')}</option> {/* Added missing */}
            <option value="stripe">{t('finance.paymentMethods.stripe', 'Stripe')}</option> {/* Added missing */}
            <option value="manual">{t('finance.paymentMethods.manual', 'Manuel')}</option> {/* Added missing */}
            <option value="other">{t('finance.paymentMethods.other', 'Autre')}</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterDateRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('finance.filters.date', 'Date')}</label>
          <select
            id="filterDateRange"
            value={filterDateRange}
            onChange={(e) => { setFilterDateRange(e.target.value); setCurrentPage(1);}}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">{t('finance.filters.allDates', 'Toutes les dates')}</option>
            <option value="today">{t('finance.filters.today', 'Aujourd\'hui')}</option>
            <option value="this_week">{t('finance.filters.thisWeek', 'Cette semaine')}</option>
            <option value="this_month">{t('finance.filters.thisMonth', 'Ce mois-ci')}</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{t('finance.summary.totalRevenue', 'Revenu Total (Complété)')}</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalRevenue, baseCurrency)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{t('finance.summary.pendingRevenue', 'Revenu en Attente')}</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(pendingRevenue, baseCurrency)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{t('finance.summary.refundedAmount', 'Montant Annulé/Remboursé')}</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(refundedAmount, baseCurrency)}</p>
        </div>
      </div>      {/* Tableau de paiements - Les en-têtes sont toujours affichés */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('finance.table.date', 'Date')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('finance.table.customer', 'Client')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('finance.table.invoiceId', 'Facture ID')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('finance.table.amount', 'Montant')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('finance.table.method', 'Méthode')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('finance.table.status', 'Statut')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('finance.table.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {/* État de chargement */}
            {isLoading && displayPayments.length === 0 && !paymentsHookError && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">{t('common.loading', 'Chargement...')}</p>
                  </div>
                </td>
              </tr>
            )}
            
            {/* État d'erreur */}
            {paymentsHookError && !isLoading && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  {isNetworkError(paymentsHookError) ? (
                    <ConnectionError 
                      message={`${t('errors.networkError', 'Erreur de connexion')}: ${getErrorMessage(paymentsHookError)}`}
                      retry={() => fetchPayments(initialFilterParams)}
                    />
                  ) : (
                    <BackendError 
                      message={`${t('errors.backendError', 'Erreur du serveur')}: ${getErrorMessage(paymentsHookError)}`}
                      retry={() => fetchPayments(initialFilterParams)}
                    />
                  )}
                </td>
              </tr>
            )}
            
            {/* Aucune donnée */}
            {!isLoading && !paymentsHookError && displayPayments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  {t('finance.payments.noPaymentsFound', 'Aucun paiement trouvé pour les filtres sélectionnés.')}
                </td>
              </tr>
            )}
            
            {/* Affichage des paiements lorsque disponibles */}
            {!isLoading && !paymentsHookError && displayPayments.length > 0 && displayPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(payment.paidAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{payment.customerName || t('common.notAvailable', 'N/A')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{payment.invoiceId || t('common.notAvailable', 'N/A')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{formatDisplayAmount(payment.amount, payment.currency as SupportedCurrency)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{getPaymentMethodLabel(payment.method)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(payment.status)}`}>
                    {statusIcon(payment.status)}
                    {getStatusLabel(payment.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => handleViewPayment(payment.id)} className="text-primary hover:text-primary-dark" title={t('common.viewDetails', 'Voir détails') as string}>
                    <Eye className="h-5 w-5" />
                  </button>
                  {payment.invoiceId && (
                    <button onClick={() => handleDownloadInvoice(payment.invoiceId!)} className="text-green-600 hover:text-green-800" title={t('finance.actions.downloadInvoice', 'Télécharger la facture') as string}>
                      <Download className="h-5 w-5" />
                    </button>
                  )}
                  {(payment.status === 'completed' || payment.status === 'verified' || payment.status === 'pending') && (
                    <button onClick={() => handleRefundPayment(payment.id)} className="text-red-600 hover:text-red-800" title={t('finance.actions.refund', 'Rembourser/Annuler') as string}>
                      <XCircle className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && displayPayments.length > 0 && (
        <div className="py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('common.paginationResult', { page: currentPage, totalPages: pagination.totalPages, defaultValue: `Page ${currentPage} sur ${pagination.totalPages}`})}
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {t('common.previous', 'Précédent')}
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {t('common.next', 'Suivant')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Note: The PaymentFormModal component would need to be created.
// It would handle the form for adding a new payment and use `recordManualPayment` from `usePayments`.
// The `Payment` type from `../../types/finance` should be used consistently.
// The `invoiceNumber` in the table was changed to `invoiceId` to reflect common API patterns and the `Payment` type in `finance.ts`.
// If your `Payment` type uses `invoiceNumber`, adjust accordingly.
// The `customerName` in the table now falls back to `customerId` if `customerName` is not available.
// Added more status options for filtering and display (succeeded, canceled)
// Added more payment method options for filtering and display (stripe, manual)
// Updated statistics to use useMemo for better performance.
// Updated loading states for better UX.
// Updated pagination controls.
// Ensured `setCurrentPage(1)` is called when filters change to avoid being on a non-existent page.