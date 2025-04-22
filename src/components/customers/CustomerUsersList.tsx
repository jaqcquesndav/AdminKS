import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, UserPlus, MoreVertical, Shield, Mail, User, 
  Calendar, AlertTriangle, Check, X, ChevronDown, Lock, 
  Unlock, Clock, Settings, RefreshCw
} from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';

export interface CustomerUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
  isOwner: boolean;
}

interface CustomerUsersListProps {
  customerId: string;
  customerName: string;
  onInviteUser: () => void;
}

export function CustomerUsersList({ customerId, customerName, onInviteUser }: CustomerUsersListProps) {
  const { t } = useTranslation();
  const { showToast } = useToastContext();
  
  // États
  const [users, setUsers] = useState<CustomerUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<CustomerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState<'remove' | 'suspend' | 'activate' | 'resend'>('remove');
  const [refreshingInvite, setRefreshingInvite] = useState(false);
  
  // Configuration des rôles et statuts
  const roles = {
    admin: { label: t('customers.users.roles.admin', 'Administrateur'), color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    editor: { label: t('customers.users.roles.editor', 'Éditeur'), color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    viewer: { label: t('customers.users.roles.viewer', 'Lecteur'), color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    finance: { label: t('customers.users.roles.finance', 'Finance'), color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' }
  };
  
  const statuses = {
    active: { 
      label: t('customers.users.statuses.active', 'Actif'), 
      icon: <Check className="h-4 w-4" />,
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    inactive: { 
      label: t('customers.users.statuses.inactive', 'Suspendu'), 
      icon: <X className="h-4 w-4" />,
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    },
    pending: { 
      label: t('customers.users.statuses.pending', 'En attente'), 
      icon: <Clock className="h-4 w-4" />,
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }
  };

  // Charger les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données mockées
        const mockUsers: CustomerUser[] = [
          {
            id: 'user1',
            email: 'owner@kiota.tech',
            name: 'Jean Dupont',
            role: 'admin',
            status: 'active',
            createdAt: '2023-01-15',
            lastLogin: '2025-04-21',
            isOwner: true
          },
          {
            id: 'user2',
            email: 'sophie.martin@kiota.tech',
            name: 'Sophie Martin',
            role: 'editor',
            status: 'active',
            createdAt: '2023-02-10',
            lastLogin: '2025-04-20',
            isOwner: false
          },
          {
            id: 'user3',
            email: 'thomas.bernard@kiota.tech',
            name: 'Thomas Bernard',
            role: 'viewer',
            status: 'active',
            createdAt: '2023-03-05',
            lastLogin: '2025-04-18',
            isOwner: false
          },
          {
            id: 'user4',
            email: 'claire.dubois@kiota.tech',
            name: 'Claire Dubois',
            role: 'finance',
            status: 'inactive',
            createdAt: '2023-04-20',
            lastLogin: '2025-03-15',
            isOwner: false
          },
          {
            id: 'user5',
            email: 'marc.petit@kiota.tech',
            role: 'viewer',
            status: 'pending',
            createdAt: '2025-04-15',
            isOwner: false
          }
        ];
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        showToast('error', 'Erreur lors du chargement des utilisateurs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [customerId, showToast]);

  // Filtrage des utilisateurs
  useEffect(() => {
    let results = [...users];
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(user => 
        (user.name?.toLowerCase().includes(term) || false) ||
        user.email.toLowerCase().includes(term)
      );
    }
    
    // Filtre par rôle
    if (roleFilter !== 'all') {
      results = results.filter(user => user.role === roleFilter);
    }
    
    // Filtre par statut
    if (statusFilter !== 'all') {
      results = results.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(results);
  }, [searchTerm, roleFilter, statusFilter, users]);

  // Actions sur un utilisateur
  const handleUserAction = (action: 'remove' | 'suspend' | 'activate' | 'resend', userId: string) => {
    setActionUserId(userId);
    setModalAction(action);
    setShowConfirmModal(true);
  };

  const handleActionConfirmed = async () => {
    if (!actionUserId) return;
    
    setLoading(true);
    const targetUser = users.find(u => u.id === actionUserId);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let updatedUsers: CustomerUser[] = [];
      let successMessage = '';
      
      switch (modalAction) {
        case 'remove':
          updatedUsers = users.filter(user => user.id !== actionUserId);
          successMessage = `L'utilisateur ${targetUser?.name || targetUser?.email} a été supprimé`;
          break;
        case 'suspend':
          updatedUsers = users.map(user => 
            user.id === actionUserId ? { ...user, status: 'inactive' as const } : user
          );
          successMessage = `Le compte de ${targetUser?.name || targetUser?.email} a été suspendu`;
          break;
        case 'activate':
          updatedUsers = users.map(user => 
            user.id === actionUserId ? { ...user, status: 'active' as const } : user
          );
          successMessage = `Le compte de ${targetUser?.name || targetUser?.email} a été activé`;
          break;
        case 'resend':
          // Dans ce cas, nous ne modifions pas l'utilisateur, juste un envoi d'email
          updatedUsers = [...users];
          successMessage = `Invitation renvoyée à ${targetUser?.email}`;
          break;
      }
      
      setUsers(updatedUsers);
      showToast('success', successMessage);
    } catch (error) {
      console.error(`Erreur lors de l'action ${modalAction}:`, error);
      showToast('error', `Erreur lors de l'exécution de l'action`);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setActionUserId(null);
    }
  };

  // Renvoyer une invitation
  const handleResendInvite = async (userId: string) => {
    setRefreshingInvite(true);
    const user = users.find(u => u.id === userId);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('success', `Invitation renvoyée à ${user?.email}`);
    } catch (error) {
      console.error('Erreur lors du renvoi de l\'invitation:', error);
      showToast('error', 'Erreur lors du renvoi de l\'invitation');
    } finally {
      setRefreshingInvite(false);
    }
  };

  // Formatage des dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Afficher le menu d'actions pour un utilisateur
  const renderUserActions = (user: CustomerUser) => {
    const [showActions, setShowActions] = useState(false);
    
    return (
      <div className="relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        
        {showActions && (
          <div 
            className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            onBlur={() => setTimeout(() => setShowActions(false), 100)}
          >
            <div className="py-1">
              {user.status === 'pending' && (
                <button
                  onClick={() => {
                    handleResendInvite(user.id);
                    setShowActions(false);
                  }}
                  disabled={refreshingInvite}
                  className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {refreshingInvite ? (
                    <RefreshCw className="h-4 w-4 mr-3 text-gray-400 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                  )}
                  {t('customers.users.actions.resendInvite', 'Renvoyer l\'invitation')}
                </button>
              )}
              
              {!user.isOwner && (
                <>
                  {user.status === 'active' ? (
                    <button
                      onClick={() => {
                        handleUserAction('suspend', user.id);
                        setShowActions(false);
                      }}
                      className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Lock className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                      {t('customers.users.actions.suspend', 'Suspendre')}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleUserAction('activate', user.id);
                        setShowActions(false);
                      }}
                      className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Unlock className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                      {t('customers.users.actions.activate', 'Activer')}
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      handleUserAction('remove', user.id);
                      setShowActions(false);
                    }}
                    className="group flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4 mr-3 text-red-600 dark:text-red-400" />
                    {t('customers.users.actions.remove', 'Supprimer')}
                  </button>
                </>
              )}
              
              {user.isOwner && (
                <div className="flex items-center w-full px-4 py-2 text-sm text-gray-400 dark:text-gray-500">
                  <Settings className="h-4 w-4 mr-3" />
                  {t('customers.users.actions.isOwner', 'Propriétaire du compte')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Modal de confirmation
  const renderConfirmModal = () => {
    if (!showConfirmModal || !actionUserId) return null;
    
    const targetUser = users.find(u => u.id === actionUserId);
    let title = '';
    let message = '';
    let confirmLabel = '';
    let confirmColor = '';
    let icon = null;
    
    switch (modalAction) {
      case 'remove':
        title = t('customers.users.confirmations.removeTitle', 'Supprimer l\'utilisateur');
        message = t('customers.users.confirmations.removeMessage', 'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.');
        confirmLabel = t('customers.users.confirmations.removeButton', 'Supprimer');
        confirmColor = 'bg-red-600 hover:bg-red-700';
        icon = <AlertTriangle className="h-6 w-6 text-red-600" />;
        break;
      case 'suspend':
        title = t('customers.users.confirmations.suspendTitle', 'Suspendre l\'utilisateur');
        message = t('customers.users.confirmations.suspendMessage', 'Êtes-vous sûr de vouloir suspendre cet utilisateur ? Il ne pourra plus accéder au système.');
        confirmLabel = t('customers.users.confirmations.suspendButton', 'Suspendre');
        confirmColor = 'bg-amber-600 hover:bg-amber-700';
        icon = <Lock className="h-6 w-6 text-amber-600" />;
        break;
      case 'activate':
        title = t('customers.users.confirmations.activateTitle', 'Activer l\'utilisateur');
        message = t('customers.users.confirmations.activateMessage', 'Êtes-vous sûr de vouloir activer cet utilisateur ? Il pourra accéder au système.');
        confirmLabel = t('customers.users.confirmations.activateButton', 'Activer');
        confirmColor = 'bg-green-600 hover:bg-green-700';
        icon = <Unlock className="h-6 w-6 text-green-600" />;
        break;
      case 'resend':
        title = t('customers.users.confirmations.resendTitle', 'Renvoyer l\'invitation');
        message = t('customers.users.confirmations.resendMessage', 'Voulez-vous renvoyer l\'email d\'invitation à cet utilisateur ?');
        confirmLabel = t('customers.users.confirmations.resendButton', 'Renvoyer');
        confirmColor = 'bg-blue-600 hover:bg-blue-700';
        icon = <Mail className="h-6 w-6 text-blue-600" />;
        break;
    }
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {icon}
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {message}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {targetUser?.name || targetUser?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t('common.cancel', 'Annuler')}
            </button>
            <button
              onClick={handleActionConfirmed}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${confirmColor}`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              {t('customers.users.title', 'Utilisateurs')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('customers.users.description', 'Gérer les utilisateurs du compte client')} {customerName}
            </p>
          </div>
          
          <button
            onClick={onInviteUser}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {t('customers.users.addUser', 'Inviter un utilisateur')}
          </button>
        </div>
        
        {/* Filtres */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('customers.users.searchPlaceholder', 'Rechercher par nom ou email...') as string}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
            />
          </div>
          
          {/* Filtres par rôle et statut */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-3 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
              >
                <option value="all">{t('customers.users.filters.allRoles', 'Tous les rôles')}</option>
                <option value="admin">{t('customers.users.roles.admin', 'Administrateur')}</option>
                <option value="editor">{t('customers.users.roles.editor', 'Éditeur')}</option>
                <option value="viewer">{t('customers.users.roles.viewer', 'Lecteur')}</option>
                <option value="finance">{t('customers.users.roles.finance', 'Finance')}</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
              >
                <option value="all">{t('customers.users.filters.allStatuses', 'Tous les statuts')}</option>
                <option value="active">{t('customers.users.statuses.active', 'Actif')}</option>
                <option value="inactive">{t('customers.users.statuses.inactive', 'Suspendu')}</option>
                <option value="pending">{t('customers.users.statuses.pending', 'En attente')}</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Tableau des utilisateurs */}
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('customers.users.columns.user', 'Utilisateur')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('customers.users.columns.role', 'Rôle')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('customers.users.columns.status', 'Statut')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('customers.users.columns.created', 'Créé le')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('customers.users.columns.lastLogin', 'Dernière connexion')}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">{t('common.actions', 'Actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200">
                          {user.name 
                            ? user.name.substring(0, 2).toUpperCase() 
                            : user.email.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name || t('customers.users.unnamed', 'Sans nom')}
                            </div>
                            {user.isOwner && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                <Shield className="h-3 w-3 mr-1" />
                                {t('customers.users.owner', 'Propriétaire')}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roles[user.role as keyof typeof roles]?.color || ''}`}>
                        {roles[user.role as keyof typeof roles]?.label || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statuses[user.status].color}`}>
                        {statuses[user.status].icon}
                        <span className="ml-1">{statuses[user.status].label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.lastLogin ? (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(user.lastLogin)}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                          {user.status === 'pending' 
                            ? t('customers.users.neverLogged', 'Jamais connecté')
                            : t('customers.users.noData', 'Donnée indisponible')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {renderUserActions(user)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? t('customers.users.noMatchingUsers', 'Aucun utilisateur ne correspond aux critères')
                : t('customers.users.noUsers', 'Aucun utilisateur trouvé')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? t('customers.users.tryDifferentSearch', 'Essayez une recherche différente')
                : t('customers.users.addFirstUser', 'Pour ajouter un utilisateur, cliquez sur le bouton "Inviter un utilisateur".')}
            </p>
          </div>
        )}
      </div>
      
      {/* Modal de confirmation */}
      {renderConfirmModal()}
    </div>
  );
}