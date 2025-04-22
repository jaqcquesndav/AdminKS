import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download, Edit, Printer, Share2 } from 'lucide-react';
import { CustomerDetails } from '../../components/customers/CustomerDetailsCard';
import { CustomerDetailsCard } from '../../components/customers/CustomerDetailsCard';
import { CustomerTransactionHistory } from '../../components/customers/CustomerTransactionHistory';
import { useToastContext } from '../../contexts/ToastContext';

export function FinancialDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Simuler une requête API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données mockées pour un client
        const mockCustomer: CustomerDetails = {
          id,
          name: 'Banque Centrale',
          type: 'financial',
          email: 'contact@banquecentrale.fr',
          phone: '+33 1 45 67 89 10',
          address: '12 avenue des Champs-Élysées, 75008 Paris',
          website: 'www.banquecentrale.fr',
          contactPerson: 'Jean Dupont',
          taxId: 'FR1234567890',
          status: 'active',
          createdAt: '2023-03-10',
          paymentMethod: 'bank_transfer',
          notes: 'Client important avec contrat spécifique. Prévoir un suivi trimestriel.'
        };
        
        setCustomer(mockCustomer);
      } catch (error) {
        console.error('Erreur lors du chargement des détails du client:', error);
        showToast('error', t('errors.loading', 'Erreur lors du chargement des données'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomerDetails();
  }, [id, showToast, t]);

  const handleEditCustomer = () => {
    showToast('info', t('features.coming_soon', 'Fonctionnalité à venir'));
  };

  const handleGeneratePDF = () => {
    showToast('info', t('features.coming_soon', 'Fonctionnalité à venir'));
  };

  const handleShareDetails = () => {
    showToast('info', t('features.coming_soon', 'Fonctionnalité à venir'));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">
          {t('customers.notFound.title', 'Client non trouvé')}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {t('customers.notFound.description', "Le client que vous recherchez n'existe pas ou a été supprimé.")}
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate('/customers')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back', 'Retour')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate('/finance')}
            className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('finance.customer.id', 'ID Client')}: {customer.id}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <Printer className="mr-2 h-4 w-4" />
            {t('common.print', 'Imprimer')}
          </button>
          <button
            type="button"
            onClick={handleGeneratePDF}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <Download className="mr-2 h-4 w-4" />
            {t('common.export', 'Exporter')}
          </button>
          <button
            type="button"
            onClick={handleShareDetails}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <Share2 className="mr-2 h-4 w-4" />
            {t('common.share', 'Partager')}
          </button>
          <button
            type="button"
            onClick={handleEditCustomer}
            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            <Edit className="mr-2 h-4 w-4" />
            {t('common.edit', 'Modifier')}
          </button>
        </div>
      </div>

      {/* Main content - two columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CustomerDetailsCard customer={customer} onEdit={handleEditCustomer} />
        </div>
        
        <div className="lg:col-span-2">
          <CustomerTransactionHistory customerId={customer.id} limit={10} />
        </div>
      </div>
    </div>
  );
}