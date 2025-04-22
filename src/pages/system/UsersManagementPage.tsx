import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, UserPlus, Edit2, Trash2, MoreHorizontal, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  companyId: string;
  role: 'super_admin' | 'admin' | 'manager' | 'user';
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  lastLogin: string | null;
  createdAt: string;
}

export function UsersManagementPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [companies, setCompanies] = useState<{id: string, name: string}[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simuler le chargement des données
      setTimeout(() => {
        // Données fictives pour les sociétés
        const mockCompanies = [
          { id: 'comp-1', name: 'Acme Inc.' },
          { id: 'comp-2', name: 'Tech Solutions' },
          { id: 'comp-3', name: 'Global Finance' },
          { id: 'comp-4', name: 'Digital Marketing' }
        ];
        
        // Données fictives pour les utilisateurs
        const mockUsers = [
          {
            id: 'user-1',
            name: 'Jean Dupont',
            email: 'jean.dupont@acme.com',
            company: 'Acme Inc.',
            companyId: 'comp-1',
            role: 'admin',
            status: 'active',
            lastLogin: '2025-04-20T10:30:00Z',
            createdAt: '2024-09-15T08:00:00Z'
          },
          {
            id: 'user-2',
            name: 'Marie Lambert',
            email: 'marie.lambert@acme.com',
            company: 'Acme Inc.',
            companyId: 'comp-1',
            role: 'user',
            status: 'active',
            lastLogin: '2025-04-19T14:45:00Z',
            createdAt: '2024-10-05T09:30:00Z'
          },
          {
            id: 'user-3',
            name: 'Paul Martin',
            email: 'paul.martin@techsolutions.com',
            company: 'Tech Solutions',
            companyId: 'comp-2',
            role: 'admin',
            status: 'active',
            lastLogin: '2025-04-18T11:20:00Z',
            createdAt: '2024-08-20T10:15:00Z'
          },
          {
            id: 'user-4',
            name: 'Sophie Bernard',
            email: 'sophie.bernard@techsolutions.com',
            company: 'Tech Solutions',
            companyId: 'comp-2',
            role: 'manager',
            status: 'active',
            lastLogin: '2025-04-21T09:10:00Z',
            createdAt: '2024-11-10T14:00:00Z'
          },
          {
            id: 'user-5',
            name: 'Thomas Richard',
            email: 'thomas.richard@globalfinance.com',
            company: 'Global Finance',
            companyId: 'comp-3',
            role: 'admin',
            status: 'suspended',
            lastLogin: null,
            createdAt: '2024-07-25T08:45:00Z'
          },
          {
            id: 'user-6',
            name: 'Julie Lefebvre',
            email: 'julie.lefebvre@digmark.com',
            company: 'Digital Marketing',
            companyId: 'comp-4',
            role: 'user',
            status: 'pending',
            lastLogin: null,
            createdAt: '2025-04-18T16:30:00Z'
          },
          {
            id: 'user-7',
            name: 'Marc Dubois',
            email: 'marc.dubois@ksuit.com',
            company: 'Ksuit',
            companyId: 'system',
            role: 'super_admin',
            status: 'active',
            lastLogin: '2025-04-21T08:00:00Z',
            createdAt: '2024-01-01T00:00:00Z'
          }
        ] as User[];
        
        setCompanies(mockCompanies);
        setUsers(mockUsers);
        setTotalPages(Math.ceil(mockUsers.length / 10));
        setLoading(false);
      }, 800);
    };
    
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleCompanyFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompany(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      // Afficher notification de succès
    }
  };

  const handleCreateUser = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditUser = (userId: string) => {
    // Naviguer vers la page d'édition ou ouvrir un modal
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchRole = selectedRole === '' || user.role === selectedRole;
    const matchStatus = selectedStatus === '' || user.status === selectedStatus;
    const matchCompany = selectedCompany === '' || user.companyId === selectedCompany;
    
    return matchSearch && matchRole && matchStatus && matchCompany;
  });
  
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * 10, currentPage * 10);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'manager':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('system.users.title', 'Gestion des utilisateurs')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('system.users.subtitle', 'Gérez tous les utilisateurs du système')}</p>
        </div>
        <button 
          onClick={handleCreateUser}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {t('system.users.create', 'Créer un utilisateur')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t('system.users.searchPlaceholder', 'Rechercher par nom ou email...')}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
              <div className="w-full md:w-36">
                <select
                  value={selectedRole}
                  onChange={handleRoleFilter}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">{t('system.users.filters.allRoles', 'Tous les rôles')}</option>
                  <option value="super_admin">{t('roles.superAdmin', 'Super Admin')}</option>
                  <option value="admin">{t('roles.admin', 'Admin')}</option>
                  <option value="manager">{t('roles.manager', 'Manager')}</option>
                  <option value="user">{t('roles.user', 'Utilisateur')}</option>
                </select>
              </div>
              
              <div className="w-full md:w-40">
                <select
                  value={selectedStatus}
                  onChange={handleStatusFilter}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">{t('system.users.filters.allStatuses', 'Tous les statuts')}</option>
                  <option value="active">{t('status.active', 'Actif')}</option>
                  <option value="pending">{t('status.pending', 'En attente')}</option>
                  <option value="suspended">{t('status.suspended', 'Suspendu')}</option>
                  <option value="inactive">{t('status.inactive', 'Inactif')}</option>
                </select>
              </div>
              
              <div className="w-full md:w-52">
                <select
                  value={selectedCompany}
                  onChange={handleCompanyFilter}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">{t('system.users.filters.allCompanies', 'Toutes les entreprises')}</option>
                  <option value="system">Ksuit (Système)</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('system.users.table.user', 'Utilisateur')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('system.users.table.company', 'Entreprise')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('system.users.table.role', 'Rôle')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('system.users.table.status', 'Statut')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('system.users.table.lastLogin', 'Dernière connexion')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('system.users.table.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{user.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                      {t(`roles.${user.role}`, user.role === 'super_admin' ? 'Super Admin' : 
                        user.role === 'admin' ? 'Admin' : 
                        user.role === 'manager' ? 'Manager' : 'Utilisateur')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                      {t(`status.${user.status}`, user.status === 'active' ? 'Actif' : 
                        user.status === 'pending' ? 'En attente' : 
                        user.status === 'suspended' ? 'Suspendu' : 'Inactif')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {user.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <div className="relative group">
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 hidden group-hover:block">
                          <div className="py-1">
                            {user.status === 'active' ? (
                              <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                                Suspendre
                              </button>
                            ) : (
                              <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                                Activer
                              </button>
                            )}
                            <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                              Réinitialiser le mot de passe
                            </button>
                            <button className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                              Voir le profil
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-10 w-10 text-gray-400 mb-3" />
                      <h3 className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                        Aucun utilisateur trouvé
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mt-1">
                        Aucun utilisateur ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Affichage de <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> à{' '}
              <span className="font-medium">{Math.min(currentPage * 10, filteredUsers.length)}</span> sur{' '}
              <span className="font-medium">{filteredUsers.length}</span> utilisateurs
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
                Confirmer la suppression
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de création d'utilisateur - à implémenter */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Créer un nouvel utilisateur
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                La fonctionnalité de création d'utilisateur sera implémentée dans une prochaine version.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}