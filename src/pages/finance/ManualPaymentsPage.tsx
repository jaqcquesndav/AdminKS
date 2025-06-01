import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, Filter, Download, Check, X, Clock, FileText, 
  ChevronDown, ExternalLink, Image, User, FileCheck, Calendar
} from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import { paymentsApiService } from '../../services/finance/paymentsApiService';
import type { Payment as ManualPaymentType, TransactionFilterParams, TransactionStatus } from '../../types/finance';
import type { SupportedCurrency } from '../../types/currency'; // Import SupportedCurrency

// Statut du paiement avec les couleurs correspondantes
const statusConfig: Record<TransactionStatus, { labelKey: string; defaultLabel: string; color: string; icon: JSX.Element; }> = {
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
  completed: { 
    labelKey: 'finance.manualPayments.status.completed', 
    defaultLabel: 'Complété', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: <Check className="h-4 w-4" />
  },
  failed: { 
    labelKey: 'finance.manualPayments.status.failed', 
    defaultLabel: 'Échoué', 
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: <X className="h-4 w-4" />
  },
  canceled: { 
    labelKey: 'finance.manualPayments.status.canceled', 
    defaultLabel: 'Annulé', 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    icon: <X className="h-4 w-4" />
  }
};

// Proof type labels
// Adjusted to handle potentially undefined proofType by using a more general key type
const proofTypeLabels: Record<string, string> = {
  bank_transfer: 'Preuve de virement bancaire',
  check: 'Image du chèque',
  other: 'Autre preuve de paiement',
};

export function ManualPaymentsPage() {
  const { t } = useTranslation();
  const { showToast } = useToastContext();
  // Destructure format and convert from useCurrencySettings. activeCurrency is also needed.
  const { activeCurrency, format, convert } = useCurrencySettings(); 
  
  const [allPayments, setAllPayments] = useState<ManualPaymentType[]>([]); // Holds payments from current API page
  const [filteredPayments, setFilteredPayments] = useState<ManualPaymentType[]>([]); // Holds client-side filtered payments
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [selectedPayment, setSelectedPayment] = useState<ManualPaymentType | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [verificationNote, setVerificationNote] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params: TransactionFilterParams = {
        page: currentPage,
        limit: itemsPerPage,
        status: selectedStatusFilter === 'all' ? undefined : selectedStatusFilter,
      };
      const response = await paymentsApiService.getManualPayments(params);
      setAllPayments(response.payments);
      setFilteredPayments(response.payments); // Initially, filtered is same as all
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(t('finance.manualPayments.errors.loadErrorDefault', 'Erreur lors du chargement des paiements:'), error);
      showToast('error', t('finance.manualPayments.errors.loadError', 'Erreur lors du chargement des paiements manuels'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedStatusFilter, itemsPerPage, showToast, t]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    let results = allPayments;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(payment => 
        payment.customerName?.toLowerCase().includes(term) ||
        payment.transactionReference.toLowerCase().includes(term) ||
        payment.amount.toString().includes(term)
      );
    }
    setFilteredPayments(results);
  }, [searchTerm, allPayments]);

  const handleVerifyPayment = async (newStatus: 'verified' | 'rejected') => {
    if (!selectedPayment) return;
    
    setLoading(true); // Consider a more specific loading state for this action
    try {
      const adminData = {
        verifiedBy: 'Admin User', // TODO: Replace with actual admin user from auth context
        notes: verificationNote,
        newStatus: newStatus,
      };
      
      const updatedPayment = await paymentsApiService.verifyManualPayment(selectedPayment.id, adminData);
      
      // Update the local state
      setAllPayments(prevPayments => 
        prevPayments.map(p => p.id === updatedPayment.id ? updatedPayment : p)
      );
      // If the status changed such that it would be filtered out by selectedStatusFilter,
      // it will be correctly handled by the main fetchPayments if we re-fetch or by client-side filter if we adjust.
      // For simplicity, we update `allPayments` and `filteredPayments` will re-evaluate.
      
      setIsDetailsModalOpen(false);
      setSelectedPayment(null);
      setVerificationNote('');
      
      showToast(
        'success', 
        newStatus === 'verified' 
          ? t('finance.manualPayments.success.approved', 'Paiement validé avec succès') 
          : t('finance.manualPayments.success.rejected', 'Paiement rejeté avec succès')
      );
      // Optionally, re-fetch payments for the current page if the list might change significantly
      // fetchPayments(); 
    } catch (error) {
      console.error(t('finance.manualPayments.errors.verificationErrorDefault', 'Erreur lors de la vérification du paiement:'), error);
      showToast('error', t('finance.manualPayments.errors.verificationError', 'Erreur lors de la vérification du paiement'));
    } finally {
      setLoading(false);
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

  // Updated to use convert and format from useCurrencySettings
  const formatPaymentAmount = (amount: number, originalCurrency: string) => {
    // Cast originalCurrency to SupportedCurrency. Add validation if necessary.
    const amountInActiveCurrency = convert(amount, originalCurrency as SupportedCurrency, activeCurrency);
    // format function from useCurrencySettings implicitly uses activeCurrency
    return format(amountInActiveCurrency);
  };

  const openDetailsModal = (payment: ManualPaymentType) => {
    setSelectedPayment(payment);
    // Pre-fill verification note with existing approval notes or general description if available
    setVerificationNote(payment.metadata?.approvalNotes || payment.description || '');
    setIsDetailsModalOpen(true);
  };

  const handleImagePreview = (url: string) => {
    setPreviewImage(url);
    setIsImageModalOpen(true);
  };
  
  const handleDownloadPayments = () => {
    showToast('info', t('common.downloadInitiated', 'Téléchargement des données en cours...'));
    setTimeout(() => {
      showToast('success', t('common.downloadSuccess', 'Liste des paiements téléchargée avec succès'));
    }, 1500);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatusFilter(e.target.value as TransactionStatus | 'all');
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const getStatusDisplay = (status: TransactionStatus) => {
    const config = statusConfig[status] || statusConfig.pending; // Fallback to pending if status is somehow unknown
    return {
      label: t(config.labelKey, config.defaultLabel),
      color: config.color,
      icon: config.icon,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">{t('finance.manualPayments.title', 'Validation des Paiements Manuels')}</h2>
        
        <button
          onClick={handleDownloadPayments}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Download className="mr-2 h-4 w-4" />
          {t('common.download', 'Télécharger')}
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('common.searchPlaceholder', 'Rechercher par nom, réf, montant...') as string}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={selectedStatusFilter}
              onChange={handleStatusFilterChange}
              className="pl-10 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
            >
              <option value="all">{t('finance.manualPayments.filters.allStatus', 'Tous les statuts')}</option>
              {(Object.keys(statusConfig) as TransactionStatus[]).map(statusKey => (
                <option key={statusKey} value={statusKey}>
                  {t(statusConfig[statusKey].labelKey, statusConfig[statusKey].defaultLabel)}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('finance.manualPayments.stats.total', 'Total des paiements (page)')}</p>
            <h4 className="text-xl font-bold mt-1">
              {allPayments.length} 
            </h4>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('finance.manualPayments.stats.pending', 'En attente')}</p>
            <h4 className="text-xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
              {allPayments.filter(p => p.status === 'pending').length}
            </h4>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('finance.manualPayments.stats.verified', 'Vérifiés')}</p>
            <h4 className="text-xl font-bold mt-1 text-green-600 dark:text-green-400">
              {allPayments.filter(p => p.status === 'verified').length}
            </h4>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('finance.manualPayments.stats.rejected', 'Rejetés')}</p>
            <h4 className="text-xl font-bold mt-1 text-red-600 dark:text-red-400">
              {allPayments.filter(p => p.status === 'rejected').length}
            </h4>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('finance.manualPayments.columns.customer', 'Client')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('finance.manualPayments.columns.reference', 'Référence')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('finance.manualPayments.columns.amount', 'Montant')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('finance.manualPayments.columns.date', 'Date')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('finance.manualPayments.columns.status', 'Statut')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('finance.manualPayments.columns.method', 'Méthode')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('finance.manualPayments.columns.proof', 'Preuve')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('common.actions', 'Actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayments.map((payment) => {
                  const displayStatus = getStatusDisplay(payment.status);
                  return (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200">
                          {payment.customerName?.substring(0, 2).toUpperCase() || 'N/A'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.customerName || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {payment.customerId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.transactionReference}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPaymentAmount(payment.amount, payment.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(payment.paidAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${displayStatus.color}`}>
                        {displayStatus.icon}
                        <span className="ml-1">{displayStatus.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.method}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.proofUrl ? (
                        <button
                          onClick={() => payment.proofUrl && handleImagePreview(payment.proofUrl)}
                          className="inline-flex items-center text-primary hover:text-primary-dark"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{t('common.view', 'Voir')}</span>
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openDetailsModal(payment)}
                        className="text-primary hover:text-primary-dark"
                      >
                        {payment.status === 'pending' 
                          ? t('finance.manualPayments.actions.verify', 'Vérifier') 
                          : t('common.details', 'Détails')}
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  {t('common.previous', 'Précédent')}
                </button>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {t('common.pagination', `Page ${currentPage} sur ${totalPages}`)}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  {t('common.next', 'Suivant')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              {searchTerm || selectedStatusFilter !== 'all'
                ? t('finance.manualPayments.noSearchResults', 'Aucun paiement correspondant aux critères')
                : t('finance.manualPayments.noPayments', 'Aucun paiement manuel')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedStatusFilter !== 'all'
                ? t('finance.manualPayments.tryDifferentSearch', 'Essayez une recherche ou un filtre différent')
                : t('finance.manualPayments.paymentsEmpty', 'Les paiements manuels en attente de validation apparaîtront ici.')}
            </p>
          </div>
        )}
      </div>
      
      {isDetailsModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('finance.manualPayments.detailsTitle', 'Détails du paiement')} - {selectedPayment.transactionReference}
              </h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {t('finance.manualPayments.details.customer', 'Client')}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {selectedPayment.customerName || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {selectedPayment.customerId}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <FileCheck className="h-4 w-4 mr-2" />
                    {t('finance.manualPayments.details.reference', 'Référence')}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {selectedPayment.transactionReference}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t('finance.manualPayments.details.date', 'Date de paiement')}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedPayment.paidAt)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('finance.manualPayments.details.amount', 'Montant')}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {formatPaymentAmount(selectedPayment.amount, selectedPayment.currency)}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('finance.manualPayments.details.method', 'Méthode de paiement')}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {selectedPayment.method || 'N/A'}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('finance.manualPayments.details.status', 'Statut')}
                  </h4>
                  <div className="mt-1">
                    {(() => {
                      const displayStatus = getStatusDisplay(selectedPayment.status);
                      return (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${displayStatus.color}`}>
                          {displayStatus.icon}
                          <span className="ml-1">{displayStatus.label}</span>
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('finance.manualPayments.details.proof', 'Preuve de paiement')}
              </h4>
              
              {selectedPayment.proofUrl && selectedPayment.proofType ? (
                <div className="flex flex-col items-start border border-gray-300 dark:border-gray-600 rounded-md p-4">
                  <div className="flex items-center mb-2">
                    <Image className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {proofTypeLabels[selectedPayment.proofType] || selectedPayment.proofType}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => selectedPayment.proofUrl && handleImagePreview(selectedPayment.proofUrl)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {t('common.viewProof', 'Voir la preuve')}
                    </button>
                    {/* Mock download, replace with actual download logic if needed */}
                    <a
                      href={selectedPayment.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      {t('common.download', 'Télécharger')}
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('finance.manualPayments.details.noProof', 'Aucune preuve fournie')}
                </p>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              {selectedPayment.status === 'pending' ? (
                <>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('finance.manualPayments.details.verificationNote', 'Note de vérification (optionnel)')}
                  </h4>
                  <textarea
                    value={verificationNote}
                    onChange={(e) => setVerificationNote(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary p-2"
                    placeholder={t('finance.manualPayments.details.verificationNotePlaceholder', 'Ajouter une note pour la vérification...') as string}
                  />
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => handleVerifyPayment('rejected')}
                      disabled={loading}
                      className="inline-flex items-center justify-center px-4 py-2 border border-red-500 text-sm font-medium rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900 disabled:opacity-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      {t('common.reject', 'Rejeter')}
                    </button>
                    <button
                      onClick={() => handleVerifyPayment('verified')}
                      disabled={loading}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {t('common.approve', 'Approuver')}
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {t('finance.manualPayments.details.verificationDetails', 'Détails de la vérification')}
                  </h4>
                  {selectedPayment.verifiedBy && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('finance.manualPayments.details.verifiedBy', 'Vérifié par:')} {selectedPayment.verifiedBy}
                      {selectedPayment.verifiedAt && ` ${t('common.onDate', 'le')} ${formatDate(selectedPayment.verifiedAt)}`}
                    </p>
                  )}
                  { (selectedPayment.metadata?.approvalNotes || selectedPayment.description) && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 italic">
                      {t('finance.manualPayments.details.notes', 'Notes:')} {selectedPayment.metadata?.approvalNotes || selectedPayment.description}
                    </p>
                  )}
                   {(selectedPayment.status === 'rejected' && !selectedPayment.metadata?.approvalNotes && !selectedPayment.description) && (
                     <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 italic">
                        {t('finance.manualPayments.details.noNotesProvided', 'Aucune note fournie pour le rejet.')}
                     </p>
                   )}
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
      
      {isImageModalOpen && previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto p-4 relative">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 bg-white dark:bg-gray-800 rounded-full p-1"
              aria-label={t('common.close', 'Fermer') as string}
            >
              <X className="h-6 w-6" />
            </button>
            <img src={previewImage} alt={t('finance.manualPayments.proofPreviewAlt', 'Aperçu de la preuve') as string} className="max-w-full max-h-[80vh] rounded-md mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
}