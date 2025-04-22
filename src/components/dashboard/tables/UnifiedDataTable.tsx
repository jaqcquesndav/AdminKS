import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types pour les éléments du tableau unifié
export interface TableItem {
  id: string;
  type: 'client' | 'payment' | 'subscription' | 'activity' | 'token';
  title: string;
  subtitle: string;
  status: 'active' | 'pending' | 'approved' | 'rejected' | 'warning';
  date: string;
  amount?: number;
  customerType?: string;
  linkTo: string;
}

interface UnifiedDataTableProps {
  items: TableItem[];
  isLoading: boolean;
  error: string | null;
}

export function UnifiedDataTable({ items, isLoading, error }: UnifiedDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Nombre d'éléments par page
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filtres disponibles
  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'client', label: 'Clients' },
    { id: 'payment', label: 'Paiements' },
    { id: 'subscription', label: 'Abonnements' },
    { id: 'activity', label: 'Activités' },
    { id: 'warning', label: 'Alertes' },
  ];

  // Filtrage des éléments
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return items;
    }
    if (activeFilter === 'warning') {
      return items.filter(item => item.status === 'warning' || item.status === 'pending');
    }
    return items.filter(item => item.type === activeFilter);
  }, [items, activeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Gestion du changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Rendu d'une icône basée sur le statut
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-amber-500" />;
      case 'warning':
      case 'rejected':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  // Rendu d'un badge basé sur le type d'élément
  const renderTypeBadge = (type: string) => {
    const badgeStyles = {
      client: 'bg-blue-100 text-blue-800',
      payment: 'bg-green-100 text-green-800',
      subscription: 'bg-purple-100 text-purple-800',
      activity: 'bg-yellow-100 text-yellow-800',
      token: 'bg-indigo-100 text-indigo-800',
    };

    const badgeLabel = {
      client: 'Client',
      payment: 'Paiement',
      subscription: 'Abonnement',
      activity: 'Activité',
      token: 'Token',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeStyles[type as keyof typeof badgeStyles]}`}>
        {badgeLabel[type as keyof typeof badgeLabel]}
      </span>
    );
  };

  // Rendu d'un statut en texte
  const renderStatus = (status: string) => {
    const statusStyles = {
      active: 'text-green-600',
      approved: 'text-green-600',
      pending: 'text-amber-600',
      rejected: 'text-red-600',
      warning: 'text-red-600',
    };

    const statusLabel = {
      active: 'Actif',
      approved: 'Approuvé',
      pending: 'En attente',
      rejected: 'Rejeté',
      warning: 'Alerte',
    };

    return (
      <span className={`flex items-center space-x-1 ${statusStyles[status as keyof typeof statusStyles]}`}>
        {renderStatusIcon(status)}
        <span>{statusLabel[status as keyof typeof statusLabel]}</span>
      </span>
    );
  };

  // Affichage de l'état de chargement
  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-14 bg-gray-100 rounded-md mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  // Affichage d'une erreur
  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-red-500 flex flex-col items-center">
          <AlertCircle size={32} className="mb-2" />
          <h3 className="text-lg font-medium">Erreur de chargement</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Si aucun résultat après filtrage
  if (filteredItems.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Opérations Récentes et Clients en Attente</h2>
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`px-3 py-1 rounded-full text-sm ${
                activeFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => {
                setActiveFilter(filter.id);
                setCurrentPage(1);
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="text-center py-10 text-gray-500">
          Aucun élément trouvé pour le filtre sélectionné
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Opérations Récentes et Clients en Attente</h2>
      
      {/* Filtres */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`px-3 py-1 rounded-full text-sm ${
              activeFilter === filter.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => {
              setActiveFilter(filter.id);
              setCurrentPage(1);
            }}
          >
              {filter.label}
          </button>
        ))}
      </div>
      
      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Détails</th>
              <th className="px-4 py-2 text-left">Statut</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  {renderTypeBadge(item.type)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.subtitle}</div>
                  {item.amount && (
                    <div className="text-sm font-semibold">
                      {item.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {renderStatus(item.status)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span title={new Date(item.date).toLocaleString()}>
                    {formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: fr })}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={item.linkTo}
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                  >
                    Voir <ExternalLink size={14} className="ml-1" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <div className="text-sm text-gray-700">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Page précédente"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Page suivante"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}