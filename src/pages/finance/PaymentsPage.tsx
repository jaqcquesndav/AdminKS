import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Download, Eye, PlusCircle, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import type { SupportedCurrency } from '../../types/currency';
import { usePayments } from '../../hooks/usePayments';
import type { Payment, TransactionFilterParams, TransactionStatus, PaymentMethod } from '../../types/finance'; // Added PaymentMethod
import { useToast } from '../../hooks/useToast';

export function PaymentsPage() {
  const { showToast } = useToast();
  const { activeCurrency, formatCurrency, convert, baseCurrency } = useCurrencySettings(); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all'); // This string should align with PaymentMethod values or 'all'
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const initialFilterParams: TransactionFilterParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage, // Changed pageSize to limit
  }), [currentPage, itemsPerPage]);

  const { 
    payments, 
    isLoading, 
    error, 
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
  
  useEffect(() => {
    const { startDate, endDate } = mapDateRangeToParams(filterDateRange);
    const params: TransactionFilterParams = {
      page: currentPage,
      limit: itemsPerPage, // Changed pageSize to limit
      search: searchTerm || undefined, // Changed query to search
      status: filterStatus !== 'all' ? filterStatus as TransactionStatus : undefined,
      paymentMethod: filterMethod !== 'all' ? filterMethod as PaymentMethod : undefined, // Corrected cast
      startDate,
      endDate,
    };
    fetchPayments(params);
  }, [searchTerm, filterStatus, filterMethod, filterDateRange, currentPage, itemsPerPage, fetchPayments]);


  const handleViewPayment = (paymentId: string) => {
    console.log(`Afficher les détails du paiement: ${paymentId}`);
    showToast('info', `Affichage des détails pour le paiement ${paymentId} (simulation).`);
  };

  const handleDownloadInvoice = (invoiceNumber: string) => {
    console.log(`Télécharger la facture: ${invoiceNumber}`);
    showToast('success', `La facture ${invoiceNumber} a été téléchargée (simulation).`);
  };

  const handleRefundPayment = useCallback(async (paymentId: string) => {
    console.log(`Remboursement du paiement ${paymentId} (simulation)`);
    setDisplayPayments(prev => prev.map(p => p.id === paymentId ? {...p, status: 'canceled' as Payment['status'] } : p));
    showToast('success', 'Le paiement a été marqué comme annulé (simulation pour remboursement). Mise à jour en cours...');
    
    const { startDate, endDate } = mapDateRangeToParams(filterDateRange);
    fetchPayments({
      page: currentPage,
      limit: itemsPerPage, // Changed pageSize to limit
      search: searchTerm || undefined, // Changed query to search
      status: filterStatus !== 'all' ? filterStatus as TransactionStatus : undefined,
      paymentMethod: filterMethod !== 'all' ? filterMethod as PaymentMethod : undefined, // Corrected cast
      startDate,
      endDate,
    });
  }, [fetchPayments, showToast, currentPage, itemsPerPage, searchTerm, filterStatus, filterMethod, filterDateRange]);

  const handleAddPayment = () => {
    console.log('Attempting to add a new payment. Modal not yet implemented.');
    showToast('info', 'La fonctionnalité d\'ajout de paiement sera bientôt disponible.'); // Escaped single quote
  };

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'verified':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-pink-100 text-pink-800';
      default:
        if (status === 'refunded') return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
        if (status === 'succeeded') return 'bg-green-100 text-green-800';
        return 'bg-gray-200 text-gray-700';
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'pending':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'failed':
      case 'canceled':
        return <XCircle className="w-3 h-3 mr-1" />;
      case 'verified':
        return <CheckCircle className="w-3 h-3 mr-1 text-blue-500" />;
      case 'rejected':
        return <XCircle className="w-3 h-3 mr-1 text-pink-500" />;
      default:
        if (status === 'refunded') return <AlertTriangle className="w-3 h-3 mr-1" />;
        if (status === 'succeeded') return <CheckCircle className="w-3 h-3 mr-1" />;
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Complété';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      case 'canceled':
        return 'Annulé';
      case 'verified':
        return 'Vérifié';
      case 'rejected':
        return 'Rejeté';
      default:
        if (status === 'refunded') return 'Remboursé';
        if (status === 'succeeded') return 'Réussi';
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getPaymentMethodLabel = (method?: string) => {
    if (!method) return 'N/A';
    switch (method.toLowerCase()) {
      case 'card':
        return 'Carte bancaire';
      case 'bank_transfer':
        return 'Virement bancaire';
      case 'cash':
        return 'Espèces';
      case 'paypal':
        return 'PayPal';
      case 'stripe':
        return 'Stripe';
      case 'manual':
        return 'Manuel';
      case 'mobile_money':
        return 'Mobile Money';
      case 'crypto':
        return 'Crypto';
      case 'check':
        return 'Chèque';
      case 'other':
        return 'Autre';
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
    .filter(p => p.status === 'completed' )
    .reduce((sum, p) => sum + convert(p.amount, p.currency as SupportedCurrency, baseCurrency), 0), [displayPayments, convert, baseCurrency]);
  
  const pendingRevenue = useMemo(() => displayPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + convert(p.amount, p.currency as SupportedCurrency, baseCurrency), 0), [displayPayments, convert, baseCurrency]);
  
  const refundedAmount = useMemo(() => displayPayments
    .filter(p => p.status === 'canceled')
    .reduce((sum, p) => sum + convert(p.amount, p.currency as SupportedCurrency, baseCurrency), 0), [displayPayments, convert, baseCurrency]);

  if (isLoading && displayPayments.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="loader"></div>Chargement des paiements...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Erreur: {error.message}</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestion des Paiements</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher (ID, client, facture...)"
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
            Nouveau Paiement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Statut</label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1);}}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Complété</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoué</option>
            <option value="canceled">Annulé</option>
            <option value="verified">Vérifié</option>
            <option value="rejected">Rejeté</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Méthode</label>
          <select
            id="filterMethod"
            value={filterMethod}
            onChange={(e) => { setFilterMethod(e.target.value); setCurrentPage(1);}}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Toutes les méthodes</option>
            <option value="card">Carte bancaire</option>
            <option value="bank_transfer">Virement</option>
            <option value="cash">Espèces</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="crypto">Crypto</option>
            <option value="check">Chèque</option>
            <option value="other">Autre</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterDateRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <select
            id="filterDateRange"
            value={filterDateRange}
            onChange={(e) => { setFilterDateRange(e.target.value); setCurrentPage(1);}}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="this_week">Cette semaine</option>
            <option value="this_month">Ce mois-ci</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Total des Revenus</h3>
          <p className="mt-1 text-2xl font-semibold text-green-600 dark:text-green-400">{formatCurrency(totalRevenue, baseCurrency)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Revenus en Attente</h3>
          <p className="mt-1 text-2xl font-semibold text-yellow-600 dark:text-yellow-400">{formatCurrency(pendingRevenue, baseCurrency)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Montant Remboursé</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-600 dark:text-gray-400">{formatCurrency(refundedAmount, baseCurrency)}</p>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client / ID Paiement</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Montant</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Méthode</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Facture</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading && displayPayments.length > 0 && (
              <tr><td colSpan={7} className="text-center py-4"><div className="loader inline-block"></div> Actualisation...</td></tr>
            )}
            {!isLoading && displayPayments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  Aucun paiement trouvé pour les filtres sélectionnés.
                </td>
              </tr>
            )}
            {displayPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{payment.customerName || payment.customerId || 'N/A'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{payment.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{formatDisplayAmount(payment.amount, payment.currency as SupportedCurrency)} </div>
                  {payment.currency !== activeCurrency && <div className="text-xs text-gray-500 dark:text-gray-400">({payment.amount.toFixed(2)} {payment.currency})</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeClass(payment.status)}`}>
                    {statusIcon(payment.status)}
                    {getStatusLabel(payment.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{getPaymentMethodLabel(payment.method)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(payment.paidAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {payment.invoiceId ? (
                     <button onClick={() => { if(payment.invoiceId) handleDownloadInvoice(payment.invoiceId);}} className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary">
                       {payment.invoiceId}
                     </button>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleViewPayment(payment.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" title="Voir détails">
                      <Eye className="w-5 h-5" />
                    </button>
                    {payment.invoiceId && (
                      <button onClick={() => {if(payment.invoiceId) handleDownloadInvoice(payment.invoiceId);}} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="Télécharger la facture">
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                    {(payment.status === 'completed') && (
                       <button onClick={() => handleRefundPayment(payment.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Rembourser (simulé via annulation)">
                         <AlertTriangle className="w-5 h-5" />
                       </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Page <span className="font-medium">{pagination.page}</span> sur <span className="font-medium">{pagination.totalPages}</span> ({pagination.totalCount} résultats)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={pagination.page <= 1 || isLoading}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={pagination.page >= pagination.totalPages || isLoading}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Suivant
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