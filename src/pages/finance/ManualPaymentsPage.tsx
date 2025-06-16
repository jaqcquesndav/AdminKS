import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, Filter, Download, Check, X, Clock, ChevronDown, Image, User 
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import { usePayments } from '../../hooks/usePayments'; 
import type { Payment as ManualPaymentType, TransactionFilterParams, VerifyPaymentPayload } from '../../types/finance';
import type { SupportedCurrency } from '../../types/currency';
import { getErrorMessage } from '../../utils/errorUtils';

// Statut du paiement avec les couleurs correspondantes
// Keep existing statusConfig, but ensure its keys match ManualPaymentType['status']
const statusConfig: Record<ManualPaymentType['status'], { labelKey: string; defaultLabel: string; color: string; icon: JSX.Element; }> = {
  pending: { 
    labelKey: 'finance.manualPayments.status.pending', 
    defaultLabel: 'En attente', 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: <Clock className="h-4 w-4" />
  },
  verified: { 
    labelKey: 'finance.manualPayments.status.verified', 
    defaultLabel: 'Vérifié', 
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: <Check className="h-4 w-4" />
  },
  rejected: { 
    labelKey: 'finance.manualPayments.status.rejected', 
    defaultLabel: 'Rejeté', 
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: <X className="h-4 w-4" />
  },
  completed: { // Assuming 'completed' can be a status for manual payments after verification
    labelKey: 'finance.manualPayments.status.completed', 
    defaultLabel: 'Complété', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: <Check className="h-4 w-4" />
  },
  failed: { // Assuming 'failed' can be a status
    labelKey: 'finance.manualPayments.status.failed', 
    defaultLabel: 'Échoué', 
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: <X className="h-4 w-4" />
  },
  canceled: { // Assuming 'canceled' can be a status
    labelKey: 'finance.manualPayments.status.canceled', 
    defaultLabel: 'Annulé', 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    icon: <X className="h-4 w-4" />
  }
};

const proofTypeLabels: Record<string, string> = {
  bank_transfer: 'Preuve de virement bancaire',
  check: 'Image du chèque',
  other: 'Autre preuve de paiement',
};

export function ManualPaymentsPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { activeCurrency, formatCurrency: format, convert } = useCurrencySettings(); // Renamed formatCurrency to format
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ManualPaymentType['status'] | 'all'>('all'); // Use ManualPaymentType['status']
  const [selectedPayment, setSelectedPayment] = useState<ManualPaymentType | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [verificationNote, setVerificationNote] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    payments: allPaymentsFromHook,
    isLoading,
    error: paymentsHookError, 
    pagination,
    fetchPayments: fetchHookPayments,
    verifyManualPayment,
  } = usePayments();

  const [clientSideManualPayments, setClientSideManualPayments] = useState<ManualPaymentType[]>([]);
  const [filteredDisplayPayments, setFilteredDisplayPayments] = useState<ManualPaymentType[]>([]);

  const fetchManualPayments = useCallback((params: TransactionFilterParams) => {
    fetchHookPayments(params);
  }, [fetchHookPayments]);

  useEffect(() => {
    const params: TransactionFilterParams = {
      page: currentPage,
      limit: itemsPerPage,
      status: selectedStatusFilter === 'all' ? undefined : selectedStatusFilter,
    };
    fetchManualPayments(params);
  }, [currentPage, selectedStatusFilter, itemsPerPage, fetchManualPayments]);

  useEffect(() => {
    if (allPaymentsFromHook) {
      const manualOnly = allPaymentsFromHook.filter(p => 
        p.proofUrl || 
        p.method === 'bank_transfer' || 
        p.method === 'check' ||
        p.status === 'pending' || 
        p.status === 'verified' || 
        p.status === 'rejected'
      );
      setClientSideManualPayments(manualOnly);
    } else {
      setClientSideManualPayments([]);
    }
  }, [allPaymentsFromHook]);

  useEffect(() => {
    let currentResults = clientSideManualPayments; // Renamed to avoid conflict
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      currentResults = currentResults.filter(payment => 
        payment.customerName?.toLowerCase().includes(term) ||
        payment.transactionReference.toLowerCase().includes(term) ||
        payment.amount.toString().includes(term)
      );
    }
    setFilteredDisplayPayments(currentResults); // Use the renamed variable
  }, [searchTerm, clientSideManualPayments]);

  // Removed the useEffect for error handling as it will be handled by the main return block

  const handleVerifyPayment = async (newStatus: 'verified' | 'rejected') => {
    if (!selectedPayment) return;
    
    try {
      const payload: VerifyPaymentPayload = {
        paymentId: selectedPayment.id,
        status: newStatus,
        adminNotes: verificationNote,
      };
      
      await verifyManualPayment(payload);
      
      setIsDetailsModalOpen(false);
      setSelectedPayment(null);
      setVerificationNote('');
      
      showToast(
        'success', 
        newStatus === 'verified' 
          ? t('finance.manualPayments.success.approved', 'Paiement validé avec succès') 
          : t('finance.manualPayments.success.rejected', 'Paiement rejeté avec succès')
      );
      const currentParams: TransactionFilterParams = {
        page: currentPage,
        limit: itemsPerPage,
        status: selectedStatusFilter === 'all' ? undefined : selectedStatusFilter,
      };
      fetchManualPayments(currentParams); // Use the new callback
    } catch (err) {      const verificationError = err as Error;
      console.error(t('finance.manualPayments.errors.verificationErrorDefault', 'Erreur lors de la vérification du paiement:'), verificationError);
      // Use getErrorMessage for consistent error message display
      const errorMessage = getErrorMessage(verificationError);
      showToast('error', `${t('finance.manualPayments.errors.verificationError', 'Erreur lors de la vérification du paiement')}: ${errorMessage}`);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(t('common.locale', 'fr-FR'), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPaymentAmount = (amount: number, originalCurrency: string) => {
    const amountInActiveCurrency = convert(amount, originalCurrency as SupportedCurrency, activeCurrency);
    return format(amountInActiveCurrency);
  };

  const openDetailsModal = (payment: ManualPaymentType) => {
    setSelectedPayment(payment);
    setVerificationNote(payment.metadata?.approvalNotes as string || payment.description || '');
    setIsDetailsModalOpen(true);
  };

  const handleImagePreview = (url: string) => {
    setPreviewImage(url);
    setIsImageModalOpen(true);
  };
  
  const handleDownloadPayments = () => {
    showToast('info', t('common.downloadInitiated', 'Téléchargement des données en cours...'));
    console.log("Downloading payments:", filteredDisplayPayments);
    setTimeout(() => {
      showToast('success', t('common.downloadSuccess', 'Liste des paiements téléchargée avec succès (simulation)'));
    }, 1500);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatusFilter(e.target.value as ManualPaymentType['status'] | 'all');
    setCurrentPage(1); 
  };

  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalCount || 0;

  const tableHeaderKeys = [
    'finance.manualPayments.table.customer', 
    'finance.manualPayments.table.reference', 
    'finance.manualPayments.table.amount', 
    'finance.manualPayments.table.currency',
    'finance.manualPayments.table.paymentDate', 
    'finance.manualPayments.table.submissionDate', 
    'finance.manualPayments.table.status', 
    'finance.manualPayments.table.actions'
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
          {t('finance.manualPayments.title', 'Gestion des Paiements Manuels')}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('finance.manualPayments.description', 'Vérifiez et gérez les paiements soumis manuellement.')}
        </p>
      </header>

      {/* Search and Filter Bar */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Search Input */}
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('common.search', 'Rechercher')}
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder={t('finance.manualPayments.searchPlaceholder', 'Ref, Nom, Montant...') ?? "Ref, Nom, Montant..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          {/* Status Filter */}
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('common.status', 'Statut')}
            </label>
            <div className="relative">
              <select
                id="statusFilter"
                value={selectedStatusFilter}
                onChange={handleStatusFilterChange}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
              >
                <option value="all">{t('common.allStatuses', 'Tous les statuts')}</option>
                {/* Filter available statuses based on ManualPaymentType['status'] */}
                {(Object.keys(statusConfig) as Array<ManualPaymentType['status']>).map((status) => (
                  <option key={status} value={status}>{t(statusConfig[status].labelKey, statusConfig[status].defaultLabel)}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
          </div>
          {/* Download Button */}
          <div className="col-span-1 md:col-span-1 flex justify-end">
            <button
              onClick={handleDownloadPayments}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <Download className="h-5 w-5 mr-2" />
              {t('common.download', 'Télécharger')}
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {tableHeaderKeys.map(headerKey => (
                <th key={headerKey} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t(headerKey)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="animate-pulse">
                <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" /></td>
                <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" /></td>
                <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" /></td>
                <td className="px-4 py-3"><div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-10 mx-auto" /></td>
              </tr>
            ))}
            {!isLoading && paymentsHookError && (
              <tr>
                <td colSpan={tableHeaderKeys.length} className="px-4 py-12 text-center text-red-500">
                  {t('finance.manualPayments.errorLoading', 'Erreur de chargement des paiements manuels.')}
                </td>
              </tr>
            )}
            {!isLoading && !paymentsHookError && filteredDisplayPayments.length === 0 && (
              <tr>
                <td colSpan={tableHeaderKeys.length} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                  {t('finance.manualPayments.noPaymentsFound', 'Aucun paiement manuel trouvé')}
                </td>
              </tr>
            )}
            {!isLoading && !paymentsHookError && filteredDisplayPayments.length > 0 && filteredDisplayPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{payment.customerName || 'N/A'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{payment.customerId || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{payment.transactionReference}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatPaymentAmount(payment.amount, payment.currency)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{payment.currency}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(payment.paidAt)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(payment.createdAt)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[payment.status].color}`}>
                    {statusConfig[payment.status].icon}
                    {t(statusConfig[payment.status].labelKey, statusConfig[payment.status].defaultLabel)}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  {/* Actions: voir, vérifier, rejeter, etc. */}
                  <button onClick={() => openDetailsModal(payment)} className="text-blue-600 hover:text-blue-800 text-xs mr-2">{t('common.view', 'Voir')}</button>
                  {/* ...autres actions... */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - ensure this is also conditional on data existing */}
      {!isLoading && !paymentsHookError && totalPages > 1 && filteredDisplayPayments.length > 0 && (
        <div className="mt-6 py-3 flex items-center justify-between bg-white dark:bg-gray-800 px-4 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1 || isLoading}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              {t('common.previous', 'Précédent')}
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages || isLoading}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              {t('common.next', 'Suivant')}
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {t('common.paginationShowing', 'Affichage de')}
                <span className="font-medium"> {filteredDisplayPayments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} </span>
                {t('common.paginationTo', 'à')}
                <span className="font-medium"> {(currentPage - 1) * itemsPerPage + filteredDisplayPayments.length} </span>
                {t('common.paginationOf', 'sur')}
                <span className="font-medium"> {totalItems} </span> 
                {t('common.results', 'résultats')}
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1 || isLoading}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <span className="sr-only">{t('common.previous', 'Précédent')}</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('common.page', 'Page')} {currentPage} {t('common.of', 'sur')} {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages || isLoading}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <span className="sr-only">{t('common.next', 'Suivant')}</span>
                  <ChevronDown className="h-5 w-5 -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {t('finance.manualPayments.modal.detailsTitle', 'Détails du Paiement Manuel')}
              </h2>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <strong className="text-gray-600 dark:text-gray-300">{t('finance.manualPayments.modal.customerName', 'Nom du client')}:</strong>
                <p className="text-gray-800 dark:text-white">{selectedPayment.customerName || 'N/A'}</p>
              </div>
              <div>
                <strong className="text-gray-600 dark:text-gray-300">{t('finance.manualPayments.modal.customerId', 'ID Client')}:</strong>
                <p className="text-gray-800 dark:text-white">{selectedPayment.customerId || 'N/A'}</p>
              </div>
              <div>
                <strong className="text-gray-600 dark:text-gray-300">{t('finance.manualPayments.modal.transactionRef', 'Référence de transaction')}:</strong>
                <p className="text-gray-800 dark:text-white">{selectedPayment.transactionReference}</p>
              </div>
              <div>
                <strong className="text-gray-600 dark:text-gray-300">{t('finance.manualPayments.modal.amount', 'Montant')}:</strong>
                <p className="text-gray-800 dark:text-white">{formatPaymentAmount(selectedPayment.amount, selectedPayment.currency)} ({selectedPayment.currency})</p>
              </div>
              <div>
                <strong className="text-gray-600 dark:text-gray-300">{t('finance.manualPayments.modal.paymentDate', 'Date de paiement')}:</strong>
                <p className="text-gray-800 dark:text-white">{formatDate(selectedPayment.paidAt)}</p>
              </div>
              <div>
                <strong className="text-gray-600 dark:text-gray-300">{t('finance.manualPayments.modal.submissionDate', 'Date de soumission')}:</strong>
                <p className="text-gray-800 dark:text-white">{formatDate(selectedPayment.createdAt)}</p>
              </div>
              <div className="md:col-span-2">
                <strong className="text-gray-600 dark:text-gray-300">{t('finance.manualPayments.modal.status', 'Statut actuel')}:</strong>
                <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${statusConfig[selectedPayment.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                  {statusConfig[selectedPayment.status]?.icon}
                  <span className="ml-1.5">{t(statusConfig[selectedPayment.status]?.labelKey || 'common.unknown', statusConfig[selectedPayment.status]?.defaultLabel || 'Inconnu')}</span>
                </div>
              </div>
              {selectedPayment.description && (
                <div className="md:col-span-2">
                  <strong className="text-gray-600 dark:text-gray-300">{t('finance.manualPayments.modal.description', 'Description/Notes Client')}:</strong>
                  <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{selectedPayment.description}</p>
                </div>
              )}
              {selectedPayment.proofUrl && (
                <div className="md:col-span-2">
                  <strong className="text-gray-600 dark:text-gray-300">{t('finance.manualPayments.modal.proofOfPayment', 'Preuve de paiement')}:</strong>
                  <div className="mt-1 flex items-center space-x-3">
                    <button 
                      onClick={() => handleImagePreview(selectedPayment.proofUrl!)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Image className="h-4 w-4 mr-1" /> 
                      {proofTypeLabels[selectedPayment.metadata?.proofType as string || 'other'] || t('finance.manualPayments.modal.viewProof', 'Voir la preuve')}
                    </button>
                    <a 
                      href={selectedPayment.proofUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Download className="h-4 w-4 mr-1" /> 
                      {t('common.download', 'Télécharger')}
                    </a>
                  </div>
                </div>
              )}
              {selectedPayment.metadata?.approvalNotes && (
                <div className="md:col-span-2">
                  <strong className="text-gray-600 dark:text-gray-300">{t('finance.manualPayments.modal.adminNotes', 'Notes Administrateur')}:</strong>
                  <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{selectedPayment.metadata.approvalNotes as string}</p>
                </div>
              )}
            </div>

            {/* Verification Section - only if payment is pending */}
            {selectedPayment.status === 'pending' && (
              <div className="mt-6 border-t dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                  {t('finance.manualPayments.modal.verifyPaymentTitle', 'Vérifier le Paiement')}
                </h3>
                <textarea
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  placeholder={t('finance.manualPayments.modal.verificationNotesPlaceholder', 'Ajouter une note (optionnel)...') ?? "Ajouter une note (optionnel)..."}
                  rows={3}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white mb-4"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleVerifyPayment('rejected')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition duration-150 flex items-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <X className="h-5 w-5 mr-2" />
                    {t('common.reject', 'Rejeter')}
                  </button>
                  <button
                    onClick={() => handleVerifyPayment('verified')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm transition duration-150 flex items-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    {t('common.approve', 'Approuver')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {isImageModalOpen && previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-md p-4" onClick={() => setIsImageModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl max-h-[90vh] p-2 relative" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsImageModalOpen(false)} 
              className="absolute -top-3 -right-3 z-10 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-1.5 shadow-md"
              aria-label={t('common.close', 'Fermer') ?? "Fermer"}
            >
              <X className="h-5 w-5" />
            </button>
            <img src={previewImage} alt={t('finance.manualPayments.modal.proofPreviewAlt', 'Aperçu de la preuve') ?? "Aperçu de la preuve"} className="max-w-full max-h-[85vh] rounded object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}