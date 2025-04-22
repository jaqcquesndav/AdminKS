import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, Filter, Download, Check, X, Clock, FileText, 
  ChevronDown, ExternalLink, Image, User, FileCheck, Calendar
} from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';

// Types pour les paiements manuels
interface ManualPayment {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  reference: string;
  date: string;
  status: 'pending' | 'verified' | 'rejected';
  proofUrl?: string;
  proofType: 'bank_transfer' | 'check' | 'other';
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  invoiceId?: string;
  paymentMethod: string;
}

// Statut du paiement avec les couleurs correspondantes
const statusConfig = {
  pending: { 
    label: 'En attente', 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: <Clock className="h-4 w-4" />
  },
  verified: { 
    label: 'Vérifié', 
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: <Check className="h-4 w-4" />
  },
  rejected: { 
    label: 'Rejeté', 
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: <X className="h-4 w-4" />
  }
};

export function ManualPaymentsPage() {
  const { t } = useTranslation();
  const { showToast } = useToastContext();
  
  // États
  const [payments, setPayments] = useState<ManualPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<ManualPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<ManualPayment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [verificationNote, setVerificationNote] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Charger les paiements manuels
  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données mockées pour les paiements manuels
        const mockPayments: ManualPayment[] = [
          {
            id: 'mp-001',
            customerId: 'cust-123',
            customerName: 'Kiota Tech',
            amount: 1200,
            currency: 'EUR',
            reference: 'INV20250422-001',
            date: '2025-04-20',
            status: 'pending',
            proofUrl: 'https://example.com/proofs/proof001.pdf',
            proofType: 'bank_transfer',
            notes: 'Paiement pour le renouvellement annuel',
            paymentMethod: 'Virement bancaire'
          },
          {
            id: 'mp-002',
            customerId: 'cust-456',
            customerName: 'SmartFinance SA',
            amount: 2500,
            currency: 'EUR',
            reference: 'INV20250419-003',
            date: '2025-04-19',
            status: 'verified',
            proofUrl: 'https://example.com/proofs/proof002.jpg',
            proofType: 'bank_transfer',
            notes: 'Paiement pour l\'extension du pack de tokens',
            verifiedBy: 'Jean Dupont',
            verifiedAt: '2025-04-21T14:30:00Z',
            invoiceId: 'INV20250419-003',
            paymentMethod: 'Virement bancaire'
          },
          {
            id: 'mp-003',
            customerId: 'cust-789',
            customerName: 'Startup Innovation',
            amount: 499,
            currency: 'EUR',
            reference: 'INV20250418-007',
            date: '2025-04-18',
            status: 'rejected',
            proofUrl: 'https://example.com/proofs/proof003.pdf',
            proofType: 'check',
            notes: 'Preuve de paiement illisible, demande d\'une nouvelle preuve',
            verifiedBy: 'Marie Martin',
            verifiedAt: '2025-04-19T09:15:00Z',
            paymentMethod: 'Chèque'
          },
          {
            id: 'mp-004',
            customerId: 'cust-101',
            customerName: 'ConsultPro SARL',
            amount: 750,
            currency: 'EUR',
            reference: 'INV20250417-012',
            date: '2025-04-17',
            status: 'pending',
            proofUrl: 'https://example.com/proofs/proof004.jpg',
            proofType: 'other',
            paymentMethod: 'Autre'
          },
          {
            id: 'mp-005',
            customerId: 'cust-202',
            customerName: 'DataAnalytics Plus',
            amount: 1899,
            currency: 'EUR',
            reference: 'INV20250415-018',
            date: '2025-04-15',
            status: 'verified',
            proofUrl: 'https://example.com/proofs/proof005.pdf',
            proofType: 'bank_transfer',
            verifiedBy: 'Sophie Dubois',
            verifiedAt: '2025-04-16T11:45:00Z',
            invoiceId: 'INV20250415-018',
            paymentMethod: 'Virement bancaire'
          }
        ];
        
        setPayments(mockPayments);
        setFilteredPayments(mockPayments);
      } catch (error) {
        console.error('Erreur lors du chargement des paiements:', error);
        showToast('error', 'Erreur lors du chargement des paiements manuels');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, [showToast]);

  // Filtrage des paiements
  useEffect(() => {
    let results = payments;
    
    // Filtre par statut
    if (selectedStatus !== 'all') {
      results = results.filter(payment => payment.status === selectedStatus);
    }
    
    // Filtre par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(payment => 
        payment.customerName.toLowerCase().includes(term) ||
        payment.reference.toLowerCase().includes(term) ||
        payment.amount.toString().includes(term)
      );
    }
    
    setFilteredPayments(results);
  }, [searchTerm, selectedStatus, payments]);

  // Gestion de la vérification d'un paiement
  const handleVerifyPayment = async (status: 'verified' | 'rejected') => {
    if (!selectedPayment) return;
    
    // Simuler un appel API
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mise à jour du statut du paiement
      const updatedPayments = payments.map(payment => {
        if (payment.id === selectedPayment.id) {
          return {
            ...payment,
            status,
            notes: verificationNote ? verificationNote : payment.notes,
            verifiedBy: 'Admin Utilisateur', // Normalement récupéré depuis le contexte d'authentification
            verifiedAt: new Date().toISOString()
          };
        }
        return payment;
      });
      
      setPayments(updatedPayments);
      
      // Fermer le modal et réinitialiser les états
      setIsDetailsModalOpen(false);
      setSelectedPayment(null);
      setVerificationNote('');
      
      // Message de confirmation
      showToast(
        'success', 
        status === 'verified' 
          ? 'Paiement validé avec succès' 
          : 'Paiement rejeté avec succès'
      );
    } catch (error) {
      console.error('Erreur lors de la vérification du paiement:', error);
      showToast('error', 'Erreur lors de la vérification du paiement');
    } finally {
      setLoading(false);
    }
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Formatage du montant
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
  };

  // Ouvrir le modal de détails d'un paiement
  const openDetailsModal = (payment: ManualPayment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  // Prévisualiser l'image de preuve
  const handleImagePreview = (url: string) => {
    setPreviewImage(url);
    setIsImageModalOpen(true);
  };
  
  // Télécharger la liste des paiements
  const handleDownloadPayments = () => {
    // Dans une vraie application, générerait un fichier CSV ou Excel
    showToast('info', 'Téléchargement des données en cours...');
    
    // Simulation d'un délai de téléchargement
    setTimeout(() => {
      showToast('success', 'Liste des paiements téléchargée avec succès');
    }, 1500);
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
      
      {/* Filtres et recherche */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('common.search', 'Rechercher...') as string}
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="pl-10 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
            >
              <option value="all">{t('finance.manualPayments.filters.allStatus', 'Tous les statuts')}</option>
              <option value="pending">{t('finance.manualPayments.filters.pending', 'En attente')}</option>
              <option value="verified">{t('finance.manualPayments.filters.verified', 'Vérifiés')}</option>
              <option value="rejected">{t('finance.manualPayments.filters.rejected', 'Rejetés')}</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Statistiques des paiements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total des paiements</p>
            <h4 className="text-xl font-bold mt-1">
              {payments.length}
            </h4>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">En attente</p>
            <h4 className="text-xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
              {payments.filter(p => p.status === 'pending').length}
            </h4>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Vérifiés</p>
            <h4 className="text-xl font-bold mt-1 text-green-600 dark:text-green-400">
              {payments.filter(p => p.status === 'verified').length}
            </h4>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rejetés</p>
            <h4 className="text-xl font-bold mt-1 text-red-600 dark:text-red-400">
              {payments.filter(p => p.status === 'rejected').length}
            </h4>
          </div>
        </div>
      </div>
      
      {/* Tableau des paiements */}
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
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200">
                          {payment.customerName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.customerName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {payment.customerId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.reference}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatAmount(payment.amount, payment.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(payment.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[payment.status].color}`}>
                        {statusConfig[payment.status].icon}
                        <span className="ml-1">{statusConfig[payment.status].label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.paymentMethod}
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
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              {searchTerm || selectedStatus !== 'all'
                ? t('finance.manualPayments.noSearchResults', 'Aucun paiement correspondant aux critères')
                : t('finance.manualPayments.noPayments', 'Aucun paiement manuel')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedStatus !== 'all'
                ? t('finance.manualPayments.tryDifferentSearch', 'Essayez une recherche différente')
                : t('finance.manualPayments.paymentsEmpty', 'Les paiements manuels en attente de validation apparaîtront ici.')}
            </p>
          </div>
        )}
      </div>
      
      {/* Modal de détails de paiement */}
      {isDetailsModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('finance.manualPayments.detailsTitle', 'Détails du paiement')} - {selectedPayment.reference}
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
                    {selectedPayment.customerName}
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
                    {selectedPayment.reference}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t('finance.manualPayments.details.date', 'Date de paiement')}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(selectedPayment.date)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('finance.manualPayments.details.amount', 'Montant')}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {formatAmount(selectedPayment.amount, selectedPayment.currency)}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('finance.manualPayments.details.method', 'Méthode de paiement')}
                  </h4>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {selectedPayment.paymentMethod}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('finance.manualPayments.details.status', 'Statut')}
                  </h4>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedPayment.status].color}`}>
                      {statusConfig[selectedPayment.status].icon}
                      <span className="ml-1">{statusConfig[selectedPayment.status].label}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preuve de paiement */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('finance.manualPayments.details.proof', 'Preuve de paiement')}
              </h4>
              
              {selectedPayment.proofUrl ? (
                <div className="flex flex-col items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md p-4">
                  <Image className="h-8 w-8 text-gray-400 mb-2" />
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {selectedPayment.proofType === 'bank_transfer'
                      ? 'Preuve de virement bancaire'
                      : selectedPayment.proofType === 'check'
                        ? 'Image du chèque'
                        : 'Autre preuve de paiement'}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => selectedPayment.proofUrl && handleImagePreview(selectedPayment.proofUrl)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {t('common.view', 'Voir')}
                    </button>
                    <a
                      href={selectedPayment.proofUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      {t('common.download', 'Télécharger')}
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {t('finance.manualPayments.details.noProof', 'Aucune preuve fournie')}
                </p>
              )}
            </div>
            
            {/* Notes et vérification */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              {selectedPayment.status === 'pending' ? (
                <>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('finance.manualPayments.details.verification', 'Vérification du paiement')}
                  </h4>
                  <textarea
                    placeholder={t('finance.manualPayments.details.notesPlaceholder', 'Ajoutez une note concernant ce paiement...') as string}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4"
                    rows={3}
                    value={verificationNote}
                    onChange={(e) => setVerificationNote(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {t('finance.manualPayments.details.notes', 'Notes')}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {selectedPayment.notes || t('finance.manualPayments.details.noNotes', 'Aucune note')}
                  </p>
                  
                  {selectedPayment.verifiedBy && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedPayment.status === 'verified'
                        ? `Vérifié par ${selectedPayment.verifiedBy} le ${formatDate(selectedPayment.verifiedAt || '')}`
                        : `Rejeté par ${selectedPayment.verifiedBy} le ${formatDate(selectedPayment.verifiedAt || '')}`}
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('common.close', 'Fermer')}
              </button>
              
              {selectedPayment.status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleVerifyPayment('rejected')}
                    className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                  >
                    <X className="h-4 w-4 inline mr-1" />
                    {t('finance.manualPayments.actions.reject', 'Rejeter')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVerifyPayment('verified')}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 inline mr-1" />
                    {t('finance.manualPayments.actions.approve', 'Approuver')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de prévisualisation d'image */}
      {isImageModalOpen && previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full">
            <div className="relative">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-0 right-0 -mt-10 -mr-10 text-white hover:text-gray-200"
              >
                <X className="h-8 w-8" />
              </button>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={previewImage}
                  alt="Preuve de paiement"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}