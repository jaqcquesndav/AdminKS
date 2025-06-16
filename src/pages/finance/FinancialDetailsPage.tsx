import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download, Edit, Printer, Share2 } from 'lucide-react';
import { CustomerDetailsCard, type CustomerDetails as CustomerDetailsForCardType } from '../../components/customers/CustomerDetailsCard';
import { CustomerTransactionHistory } from '../../components/customers/CustomerTransactionHistory';
import { useToastContext } from '../../contexts/ToastContext';
import { useCustomers } from '../../hooks/useCustomers';
import type { Customer } from '../../types/customer';

export function FinancialDetailsPage() {
  const { t } = useTranslation();
  const { id: customerIdFromParams } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const { getCustomerDetails, isDetailsLoading } = useCustomers();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!customerIdFromParams) {
        showToast('error', t('customers.errors.invalidId', 'ID client invalide.'));
        setFetchError(t('customers.errors.invalidId', 'ID client invalide.'));
        navigate('/finance', { replace: true });
        return;
      }
      
      setFetchError(null);
      const fetchedCustomerData = await getCustomerDetails(customerIdFromParams);
      
      if (fetchedCustomerData && fetchedCustomerData.customer) {
        if (!fetchedCustomerData.customer.id) {
          console.error('Fetched customer data is missing an ID.');
          showToast('error', t('customers.errors.loadDetailsFailed', 'Erreur de chargement du client: ID manquant.'));
          setFetchError(t('customers.errors.loadDetailsFailed', 'Erreur de chargement du client: ID manquant.'));
          setCustomer(null);
        } else {
          setCustomer(fetchedCustomerData.customer);
        }
      } else {
        setFetchError(t('customers.errors.loadDetailsFailedHook', 'Impossible de charger les détails du client via le hook.'));
        setCustomer(null);
      }
    };
    
    fetchDetails();
  }, [customerIdFromParams, getCustomerDetails, showToast, t, navigate]);

  const handleEditCustomer = () => {
    if (customer && customer.id) {
      navigate(`/customers/edit/${customer.id}`);
    } else {
      showToast('info', t('customers.editNotAvailable', 'Modification impossible: client non chargé ou ID manquant.'));
    }
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

  const adaptCustomerForCard = (cust: Customer): CustomerDetailsForCardType | null => {
    if (!cust.id) {
      console.warn('Attempted to adapt customer for card, but customer ID is missing.', cust);
      return null; 
    }

    let cardStatus: CustomerDetailsForCardType['status'] = 'inactive';
    if (cust.status === 'active') cardStatus = 'active';
    else if (['pending', 'needs_validation', 'validation_in_progress'].includes(cust.status)) cardStatus = 'pending';
    else if (cust.status === 'suspended') cardStatus = 'suspended';

    return {
      id: cust.id, // Now guaranteed to be string by the check above
      name: cust.name,
      type: cust.type,
      email: cust.email,
      phone: cust.phone, 
      address: `${cust.address}, ${cust.city}, ${cust.country}`,
      website: undefined, 
      contactPerson: cust.billingContactName,
      taxId: undefined, 
      status: cardStatus,
      createdAt: cust.createdAt || new Date(0).toISOString(), 
      paymentMethod: undefined, 
      notes: undefined, 
    };
  };
  
  const customerForCard = customer ? adaptCustomerForCard(customer) : null;

  if (isDetailsLoading) {
    return (
      <div className="p-4 md:p-6 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (fetchError && !customerForCard) {
    return (
      <div className="p-4 md:p-6 min-h-screen text-center py-12">
        <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">
          {t('customers.errors.loadDetailsFailed', 'Erreur de chargement du client')}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {fetchError}
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate('/finance', { replace: true })}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.backToFinance', 'Retour aux finances')}
          </button>
        </div>
      </div>
    );
  }
  
  if (!customerForCard) {
    return (
      <div className="p-4 md:p-6 min-h-screen text-center py-12">
        <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">
          {t('customers.notFound.title', 'Client non trouvé')}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {t('customers.notFound.financialDetailsDescription', "Le client avec l'ID fourni n'a pas été trouvé ou les données sont incomplètes.")}
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate('/finance', { replace: true })}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.backToFinance', 'Retour aux finances')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate('/finance')}
            className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            aria-label={t('common.back', 'Retour') ?? 'Retour'}
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{customerForCard.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('finance.customer.id', 'ID Client')}: {customerForCard.id}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CustomerDetailsCard customer={customerForCard} onEdit={handleEditCustomer} />
        </div>
        
        <div className="lg:col-span-2">
          <CustomerTransactionHistory customerId={customerForCard.id} limit={10} />
        </div>
      </div>
    </div>
  );
}