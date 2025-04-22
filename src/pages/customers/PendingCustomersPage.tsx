import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, ChevronDown, MoreVertical, Clock, User, Calendar, 
  Mail, Phone, Building, CheckCircle, XCircle, AlertCircle, ArrowRight
} from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';

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
}

export function PendingCustomersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  
  // États
  const [customers, setCustomers] = useState<PendingCustomer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<PendingCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<keyof PendingCustomer>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<{ id: string, action: string } | null>(null);

  // Statuts des clients en attente
  const statusConfigs = {
    pending_verification: {
      label: t('customers.pending.status.verification', 'En attente de vérification'),
      icon: <Clock className="h-4 w-4" />,
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      description: t('customers.pending.statusDescription.verification', 'Vérification des informations en cours')
    },
    pending_approval: {
      label: t('customers.pending.status.approval', 'En attente d\'approbation'),
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      description: t('customers.pending.statusDescription.approval', 'Nécessite une approbation manuelle')
    },
    pending_info: {
      label: t('customers.pending.status.info', 'Informations manquantes'),
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      description: t('customers.pending.statusDescription.info', 'Informations complémentaires requises')
    },
    pending_payment: {
      label: t('customers.pending.status.payment', 'En attente de paiement'),
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      description: t('customers.pending.statusDescription.payment', 'Premier paiement en attente')
    }
  };

  // Types de clients
  const customerTypes = {
    pme: {
      label: t('customers.types.pme', 'PME'),
      color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    },
    financial: {
      label: t('customers.types.financial', 'Institution Financière'),
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    }
  };

  // Chargement des données
  useEffect(() => {
    const fetchPendingCustomers = async () => {
      setLoading(true);
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données mockées
        const mockPendingCustomers: PendingCustomer[] = [
          {
            id: 'pend-1',
            name: 'TechStart SAS',
            email: 'contact@techstart.fr',
            phone: '+33123456789',
            type: 'pme',
            contactName: 'Sophie Martin',
            contactEmail: 'sophie@techstart.fr',
            status: 'pending_verification',
            createdAt: '2025-04-15'
          },
          {
            id: 'pend-2',
            name: 'Crédit Maritime',
            email: 'integration@credit-maritime.fr',
            type: 'financial',
            contactName: 'Jean Dubois',
            contactEmail: 'j.dubois@credit-maritime.fr',
            status: 'pending_approval',
            createdAt: '2025-04-18',
            notes: 'Vérification d\'identité nécessaire'
          },
          {
            id: 'pend-3',
            name: 'InnoVert',
            email: 'contact@innovert.com',
            phone: '+33789012345',
            type: 'pme',
            status: 'pending_info',
            createdAt: '2025-04-19',
            notes: 'Doit fournir un KBIS'
          },
          {
            id: 'pend-4',
            name: 'MicroFinance SA',
            email: 'operations@microfinance.fr',
            type: 'financial',
            contactName: 'Marie Lefevre',
            contactEmail: 'm.lefevre@microfinance.fr',
            status: 'pending_payment',
            createdAt: '2025-04-10'
          },
          {
            id: 'pend-5',
            name: 'EcoSolutions',
            email: 'contact@ecosolutions.fr',
            phone: '+33456789012',
            type: 'pme',
            contactName: 'Paul Richard',
            contactEmail: 'p.richard@ecosolutions.fr',
            status: 'pending_verification',
            createdAt: '2025-04-20'
          }
        ];
        
        setCustomers(mockPendingCustomers);
        setFilteredCustomers(mockPendingCustomers);
      } catch (error) {
        console.error('Erreur lors du chargement des clients en attente:', error);
        showToast('error', 'Erreur lors du chargement des clients en attente');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingCustomers();
  }, [showToast, t]);

  // Filtrage et tri des clients
  useEffect(() => {
    let filtered = [...customers];
    
    // Appliquer la recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
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
  }, [customers, searchTerm, statusFilter, typeFilter, sortBy, sortDirection]);

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
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      showToast('success', 'Le client a été approuvé avec succès');
      setShowConfirmation(null);
      
      // Rediriger vers la page de détail du client (maintenant actif)
      setTimeout(() => {
        navigate(`/customers/detail/${customerId}`);
      }, 500);
    } catch (error) {
      console.error('Erreur lors de l\'approbation du client:', error);
      showToast('error', 'Erreur lors de l\'approbation du client');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectCustomer = async (customerId: string) => {
    setLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      showToast('success', 'Le client a été rejeté avec succès');
      setShowConfirmation(null);
    } catch (error) {
      console.error('Erreur lors du rejet du client:', error);
      showToast('error', 'Erreur lors du rejet du client');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMoreInfo = async (customerId: string) => {
    setLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedCustomers = customers.map(c => {
        if (c.id === customerId) {
          return { ...c, status: 'pending_info' as const };
        }
        return c;
      });
      
      setCustomers(updatedCustomers);
      showToast('success', 'Demande d\'informations complémentaires envoyée');
      setShowConfirmation(null);
    } catch (error) {
      console.error('Erreur lors de la demande d\'informations:', error);
      showToast('error', 'Erreur lors de l\'envoi de la demande');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmationDialog = (customerId: string, action: string) => {
    setShowActionMenu(null);
    setShowConfirmation({ id: customerId, action });
  };

  // Formatage des dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
        
        {/* Liste des clients en attente */}
        {loading && customers.length === 0 ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={() => handleSelectCustomer(customer.id)}>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${customerTypes[customer.type].color}`}>
                        <Building className="h-3 w-3 mr-1" />
                        {customerTypes[customer.type].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={() => handleSelectCustomer(customer.id)}>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfigs[customer.status].color}`}>
                        {statusConfigs[customer.status].icon}
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
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? t('customers.pending.noResults', 'Aucun résultat trouvé')
                : t('customers.pending.empty', 'Aucune demande en attente')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? t('customers.pending.tryDifferentSearch', 'Essayez une recherche différente')
                : t('customers.pending.checkLater', 'Les nouvelles demandes apparaîtront ici.')}
            </p>
          </div>
        )}
      </div>
      
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
                      {t('customers.pending.actions.approve', 'Approuver')}
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