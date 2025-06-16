import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, ChevronDown, MoreVertical, Clock, User, Calendar, 
  Mail, Phone, Building, CheckCircle, XCircle, ArrowRight
} from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import { pendingCustomersApiService } from '../../services/customers/pendingCustomersApiService';
import { ConnectionError } from '../../components/common/ConnectionError';

// Status configuration for various pending states
const statusConfigs = {
  'pending_verification': {
    label: 'Pending Verification',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    icon: Clock,
    description: 'Waiting for document verification'
  },
  'pending_approval': {
    label: 'Pending Approval',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    icon: User,
    description: 'Waiting for admin approval'
  },
  'pending_info': {
    label: 'Pending Information',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
    icon: Mail,
    description: 'Additional information requested'
  },
  'pending_payment': {
    label: 'Pending Payment',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
    icon: Calendar,
    description: 'Waiting for payment confirmation'
  }
};

// Customer type configuration
const customerTypes = {
  'pme': {
    label: 'SME',
    color: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    icon: Building
  },
  'financial': {
    label: 'Financial Institution',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100',
    icon: Building
  }
};

// Types
interface PendingCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'pme' | 'financial';
  contactName?: string;
  contactEmail?: string;
  status: 'pending_verification' | 'pending_approval' | 'pending_info' | 'pending_payment';
  createdAt: string;
  notes?: string;
  billingContactName?: string;
  billingContactEmail?: string;
  address?: string;
  city?: string;
  country?: string;
  accountType?: string;
  tokenAllocation?: number;
  updatedAt?: string;
}

export function PendingCustomersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<PendingCustomer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<PendingCustomer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<{ action: string; id: string } | null>(null);
  // Define sorting state
  const [sortBy, setSortBy] = useState<keyof PendingCustomer>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Define the fetchPendingCustomers function
  const fetchPendingCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Utiliser le service API pour récupérer les clients en attente
      const pendingCustomers = await pendingCustomersApiService.getPendingCustomers();
        // Adapter les données si nécessaire pour correspondre à l'interface PendingCustomer
      const formattedCustomers: PendingCustomer[] = pendingCustomers.map((customer: {
        id?: string;
        name: string;
        email: string;
        phone?: string;
        type: 'pme' | 'financial';
        status: 'pending_verification' | 'pending_approval' | 'pending_info' | 'pending_payment';
        createdAt?: string;
        notes?: string;
        contactName?: string;
        contactEmail?: string;
        billingContactName?: string;
        billingContactEmail?: string;
      }) => ({
        id: customer.id || '',
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        type: customer.type,
        status: customer.status,
        createdAt: customer.createdAt || new Date().toISOString(),
        notes: customer.notes,
        // Add contact properties explicitly
        contactName: customer.contactName || customer.billingContactName,
        contactEmail: customer.contactEmail || customer.billingContactEmail
      }));
      
      setCustomers(formattedCustomers);
      setFilteredCustomers(formattedCustomers);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des clients en attente:', error);
      setError(t('customers.pending.loadError', 'Erreur lors du chargement des clients en attente'));
      setLoading(false);
    }
  }, [t]);
  
  useEffect(() => {
    fetchPendingCustomers();
  }, [fetchPendingCustomers]);

  // Filtrage et tri des clients
  useEffect(() => {
    let filtered = [...customers];
    
    // Appliquer la recherche
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      filtered = filtered.filter(
        customer => 
          customer.name.toLowerCase().includes(term) ||
          customer.email.toLowerCase().includes(term) ||
          (customer.contactName && customer.contactName.toLowerCase().includes(term))
      );
    }
    
    // Appliquer le filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }
    
    // Appliquer le filtre par type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(customer => customer.type === typeFilter);
    }
    
    // Appliquer le tri
    filtered.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return sortDirection === 'asc' ? -1 : 1;
    });
    
    setFilteredCustomers(filtered);
  }, [customers, searchQuery, statusFilter, typeFilter, sortBy, sortDirection]);

  // Gestion des actions sur un client
  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id === selectedCustomerId ? null : id);
  };

  const handleToggleActionMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionMenu(showActionMenu === id ? null : id);
  };

  const handleApproveCustomer = async (customerId: string) => {
    setLoading(true);
    try {
      await pendingCustomersApiService.approveCustomer(customerId);
      
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      showToast('success', t('customers.pending.approveSuccess', 'Customer has been successfully approved'));
      setShowConfirmation(null);
      
      // Rediriger vers la page de détail du client (maintenant actif)
      setTimeout(() => {
        navigate(`/customers/detail/${customerId}`);
      }, 500);
    } catch (error) {
      console.error('Error approving customer:', error);
      showToast('error', t('customers.pending.approveError', 'Error approving customer'));
    } finally {
      setLoading(false);
    }
  };
  const handleRejectCustomer = async (customerId: string) => {
    setLoading(true);
    try {
      await pendingCustomersApiService.rejectCustomer(customerId, 'Rejected by admin');
      
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      showToast('success', t('customers.pending.rejectSuccess', 'Le client a été rejeté avec succès'));
      setShowConfirmation(null);
    } catch (error) {
      console.error('Erreur lors du rejet du client:', error);
      showToast('error', t('customers.pending.rejectError', 'Erreur lors du rejet du client'));
    } finally {
      setLoading(false);
    }
  };
  const handleRequestMoreInfo = async (customerId: string) => {
    setLoading(true);
    try {
      await pendingCustomersApiService.requestMoreInfo(customerId, t('customers.pending.moreInfoMessage', 'Additional information is required'));
      
      const updatedCustomers = customers.map(c => {
        if (c.id === customerId) {
          return { ...c, status: 'pending_info' as const };
        }
        return c;
      });
      
      setCustomers(updatedCustomers);
      showToast('success', t('customers.pending.requestInfoSuccess', 'Request for additional information sent'));
      setShowConfirmation(null);
    } catch (error) {
      console.error('Error requesting more information:', error);
      showToast('error', t('customers.pending.requestInfoError', 'Error sending information request'));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmationDialog = (customerId: string, action: string) => {
    setShowActionMenu(null);
    setShowConfirmation({ id: customerId, action });
  };

  // Formatage des dates
  // Format dates based on the current language
  const formatDate = (dateString: string) => {
    const locale = t('common.locale', 'en-US');
    return new Date(dateString).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Composant pour le menu d'actions
  const ActionMenu = ({ customer }: { customer: PendingCustomer }) => (
    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1" role="menu" aria-orientation="vertical">
        {customer.status !== 'pending_info' && (
          <button
            onClick={() => handleConfirmationDialog(customer.id, 'request-info')}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            role="menuitem"
          >
            <Mail className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            {t('customers.pending.actions.requestInfo', 'Demander plus d\'infos')}
          </button>
        )}
        
        <button
          onClick={() => handleConfirmationDialog(customer.id, 'approve')}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          role="menuitem"
        >
          <CheckCircle className="mr-3 h-4 w-4 text-green-600 dark:text-green-400" />
          {t('customers.pending.actions.approve', 'Approuver')}
        </button>
        
        <button
          onClick={() => handleConfirmationDialog(customer.id, 'reject')}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          role="menuitem"
        >
          <XCircle className="mr-3 h-4 w-4 text-red-600 dark:text-red-400" />
          {t('customers.pending.actions.reject', 'Rejeter')}
        </button>
        
        <button
          onClick={() => navigate(`/customers/edit/${customer.id}`)}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          role="menuitem"
        >
          <ArrowRight className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
          {t('customers.pending.actions.view', 'Voir les détails')}
        </button>
      </div>
    </div>
  );

  // Composant pour la boîte de dialogue de confirmation
  const ConfirmationDialog = () => {
    if (!showConfirmation) return null;
    
    const customer = customers.find(c => c.id === showConfirmation.id);
    if (!customer) return null;
    
    let title = '';
    let message = '';
    let confirmButton = '';
    let confirmAction = () => {};
    let confirmButtonColor = '';
    let icon = null;
    
    switch (showConfirmation.action) {
      case 'approve':
        title = t('customers.pending.confirmations.approveTitle', 'Approuver le client');
        message = t('customers.pending.confirmations.approveMessage', 'Êtes-vous sûr de vouloir approuver cette demande de client ? Ce compte sera activé et le client sera notifié.');
        confirmButton = t('customers.pending.confirmations.approveButton', 'Approuver');
        confirmAction = () => handleApproveCustomer(showConfirmation.id);
        confirmButtonColor = 'bg-green-600 hover:bg-green-700';
        icon = <CheckCircle className="h-6 w-6 text-green-600" />;
        break;
      case 'reject':
        title = t('customers.pending.confirmations.rejectTitle', 'Rejeter le client');
        message = t('customers.pending.confirmations.rejectMessage', 'Êtes-vous sûr de vouloir rejeter cette demande de client ? Cette action est irréversible.');
        confirmButton = t('customers.pending.confirmations.rejectButton', 'Rejeter');
        confirmAction = () => handleRejectCustomer(showConfirmation.id);
        confirmButtonColor = 'bg-red-600 hover:bg-red-700';
        icon = <XCircle className="h-6 w-6 text-red-600" />;
        break;
      case 'request-info':
        title = t('customers.pending.confirmations.requestInfoTitle', 'Demander des informations');
        message = t('customers.pending.confirmations.requestInfoMessage', 'Un email sera envoyé au contact pour demander des informations complémentaires. Continuer ?');
        confirmButton = t('customers.pending.confirmations.requestInfoButton', 'Envoyer la demande');
        confirmAction = () => handleRequestMoreInfo(showConfirmation.id);
        confirmButtonColor = 'bg-blue-600 hover:bg-blue-700';
        icon = <Mail className="h-6 w-6 text-blue-600" />;
        break;
    }
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-opacity-90 transition-opacity" aria-hidden="true"></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white dark:bg-gray-800 px-6 pt-5 pb-4 sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                  {icon}
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                    {title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {message}
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {customer.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                disabled={loading}
                onClick={confirmAction}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${confirmButtonColor}`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : confirmButton}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => setShowConfirmation(null)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {t('common.cancel', 'Annuler')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <ConnectionError 
          title={t('common.connectionError.title', 'Erreur de connexion')}
          message={t('common.connectionError.message', 'Impossible de charger les données. Vérifiez votre connexion et réessayez.')}
          onRetry={() => {
            setError(null);
            setLoading(true);
            fetchPendingCustomers();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('customers.pending.title', 'Clients en attente')}
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* En-tête et filtres */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('customers.pending.subtitle', 'Demandes en attente de traitement')}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('customers.pending.description', 'Gérez les demandes de création de compte client')}
              </p>
            </div>
          </div>
          
          {/* Filtres et recherche */}
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('common.searchPlaceholder', 'Rechercher...') as string}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
                >
                  <option value="all">{t('customers.pending.filters.allStatuses', 'Tous les statuts')}</option>
                  <option value="pending_verification">{t('customers.pending.status.verification', 'En attente de vérification')}</option>
                  <option value="pending_approval">{t('customers.pending.status.approval', 'En attente d\'approbation')}</option>
                  <option value="pending_info">{t('customers.pending.status.info', 'Informations manquantes')}</option>
                  <option value="pending_payment">{t('customers.pending.status.payment', 'En attente de paiement')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="pl-3 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
                >
                  <option value="all">{t('customers.pending.filters.allTypes', 'Tous les types')}</option>
                  <option value="pme">{t('customers.types.pme', 'PME')}</option>
                  <option value="financial">{t('customers.types.financial', 'Institution Financière')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          {loading && customers.length > 0 && (
            <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        {/* Liste des clients en attente */}
        {loading && customers.length === 0 ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="p-8">
            <ConnectionError 
              message={error} 
              retryAction={() => {
                const fetchPendingCustomers = async () => {
                  setLoading(true);
                  setError(null);
                  try {                    const pendingCustomers = await pendingCustomersApiService.getPendingCustomers();
                    const formattedCustomers = pendingCustomers.map((customer: {
                      id?: string;
                      name: string;
                      email: string;
                      phone?: string;
                      type: 'pme' | 'financial';
                      status: 'pending_verification' | 'pending_approval' | 'pending_info' | 'pending_payment';
                      createdAt?: string;
                      notes?: string;
                      contactName?: string;
                      contactEmail?: string;
                      billingContactName?: string;
                      billingContactEmail?: string;
                    }) => ({
                      id: customer.id || '',
                      name: customer.name,
                      email: customer.email,
                      phone: customer.phone,
                      type: customer.type,
                      status: customer.status,
                      createdAt: customer.createdAt || new Date().toISOString(),
                      notes: customer.notes,
                      // Add contact properties explicitly
                      contactName: customer.contactName || customer.billingContactName,
                      contactEmail: customer.contactEmail || customer.billingContactEmail
                    }));
                    setCustomers(formattedCustomers);
                    setFilteredCustomers(formattedCustomers);
                  } catch (err) {
                    console.error('Erreur lors du chargement des clients en attente:', err);
                    setError(t('customers.pending.loadError', 'Erreur lors du chargement des clients en attente'));
                  } finally {
                    setLoading(false);
                  }
                };
                fetchPendingCustomers();
              }}
            />
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'name') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('name');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    {t('customers.pending.columns.name', 'Nom')}
                    {sortBy === 'name' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'type') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('type');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    {t('customers.pending.columns.type', 'Type')}
                    {sortBy === 'type' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'status') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('status');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    {t('customers.pending.columns.status', 'Statut')}
                    {sortBy === 'status' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'createdAt') {
                        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('createdAt');
                        setSortDirection('desc');
                      }
                    }}
                  >
                    {t('customers.pending.columns.createdAt', 'Date de demande')}
                    {sortBy === 'createdAt' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('customers.pending.columns.contact', 'Contact')}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">{t('common.actions', 'Actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedCustomerId === customer.id ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap" onClick={() => handleSelectCustomer(customer.id)}>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200">
                          {customer.name.substring(0, 1).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>                    <td className="px-6 py-4 whitespace-nowrap" onClick={() => handleSelectCustomer(customer.id)}>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customerTypes[customer.type].color}`}>
                        {React.createElement(customerTypes[customer.type].icon, { className: "h-3 w-3 mr-1" })}
                        {customerTypes[customer.type].label}
                      </span>
                    </td><td className="px-6 py-4 whitespace-nowrap" onClick={() => handleSelectCustomer(customer.id)}>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfigs[customer.status].color}`}>
                        {React.createElement(statusConfigs[customer.status].icon, { className: "h-3 w-3 mr-1" })}
                        <span className="ml-1">{statusConfigs[customer.status].label}</span>
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {statusConfigs[customer.status].description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={() => handleSelectCustomer(customer.id)}>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(customer.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={() => handleSelectCustomer(customer.id)}>
                      {customer.contactName ? (
                        <>
                          <div className="text-sm text-gray-900 dark:text-white flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {customer.contactName}
                          </div>
                          {customer.contactEmail && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {customer.contactEmail}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={(e) => handleToggleActionMenu(customer.id, e)}
                          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {showActionMenu === customer.id && <ActionMenu customer={customer} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? t('customers.pending.noResults', 'Aucun résultat trouvé')
                : t('customers.pending.empty', 'Aucune demande en attente')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? t('customers.pending.tryDifferentSearch', 'Essayez une recherche différente')
                : t('customers.pending.checkLater', 'Les nouvelles demandes apparaîtront ici.')}
            </p>
          </div>
        )}
        </div> {/* This closes the div with className="relative" */}
      </div> {/* This closes the div with className="bg-white dark:bg-gray-800 ..." */}
      
      {/* Détails du client sélectionné */}
      {selectedCustomerId && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {t('customers.pending.detailsTitle', 'Informations complémentaires')}
          </h3>
          
          {(() => {
            const customer = customers.find(c => c.id === selectedCustomerId);
            if (!customer) return null;
            
            return (
              <div className="space-y-4">
                {/* Notes */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('customers.pending.notes', 'Notes')}
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {customer.notes || t('customers.pending.noNotes', 'Aucune note disponible')}
                  </p>
                </div>
                
                {/* Actions rapides */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleConfirmationDialog(customer.id, 'approve')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      {t('customers.pending.actions.approuver', 'Approuver')}
                    </button>
                    
                    <button
                      onClick={() => handleConfirmationDialog(customer.id, 'reject')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircle className="mr-1.5 h-4 w-4" />
                      {t('customers.pending.actions.reject', 'Rejeter')}
                    </button>
                    
                    {customer.status !== 'pending_info' && (
                      <button
                        onClick={() => handleConfirmationDialog(customer.id, 'request-info')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Mail className="mr-1.5 h-4 w-4" />
                        {t('customers.pending.actions.requestInfo', 'Demander plus d\'infos')}
                      </button>
                    )}
                    
                    <button
                      onClick={() => navigate(`/customers/edit/${customer.id}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <ArrowRight className="mr-1.5 h-4 w-4" />
                      {t('customers.pending.actions.viewDetails', 'Voir tous les détails')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
      
      {/* Boîte de dialogue de confirmation */}
      {showConfirmation && <ConfirmationDialog />}
    </div>
  );
}