import { useTranslation } from 'react-i18next';
import { Building, Mail, Phone, Calendar, MapPin, Globe, User, FileText, CreditCard } from 'lucide-react';

export interface CustomerDetails {
  id: string;
  name: string;
  type: 'pme' | 'financial';
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  contactPerson?: string;
  taxId?: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  createdAt: string;
  paymentMethod?: string;
  notes?: string;
}

interface CustomerDetailsCardProps {
  customer: CustomerDetails;
  onEdit?: () => void;
}

export function CustomerDetailsCard({ customer, onEdit }: CustomerDetailsCardProps) {
  const { t, i18n } = useTranslation();

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language).format(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {t('customers.details.title', 'Informations du client')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {t('customers.details.subtitle', 'Détails et coordonnées')}
          </p>
        </div>
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(customer.status)}`}>
            {customer.status === 'active' ? t('status.active', 'Actif') :
             customer.status === 'pending' ? t('status.pending', 'En attente') :
             customer.status === 'suspended' ? t('status.suspended', 'Suspendu') : 
             t('status.inactive', 'Inactif')}
          </span>
          {onEdit && (
            <button
              onClick={onEdit}
              className="ml-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
            >
              {t('common.edit', 'Modifier')}
            </button>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <dl>
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <Building className="h-4 w-4 mr-2" />
              {t('customers.details.name', 'Nom')}
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
              {customer.name}
            </dd>
          </div>
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              {t('customers.details.email', 'Email')}
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
              {customer.email}
            </dd>
          </div>
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              {t('customers.details.phone', 'Téléphone')}
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
              {customer.phone || '-'}
            </dd>
          </div>
          {customer.address && (
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {t('customers.details.address', 'Adresse')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                {customer.address}
              </dd>
            </div>
          )}
          {customer.website && (
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                {t('customers.details.website', 'Site web')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                <a 
                  href={customer.website.startsWith('http') ? customer.website : `https://${customer.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {customer.website}
                </a>
              </dd>
            </div>
          )}
          {customer.contactPerson && (
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <User className="h-4 w-4 mr-2" />
                {t('customers.details.contactPerson', 'Personne à contacter')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                {customer.contactPerson}
              </dd>
            </div>
          )}
          {customer.taxId && (
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {t('customers.details.taxId', 'Numéro fiscal')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                {customer.taxId}
              </dd>
            </div>
          )}
          {customer.paymentMethod && (
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                {t('customers.details.paymentMethod', 'Méthode de paiement préférée')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                {customer.paymentMethod === 'card' 
                  ? t('payment.methods.card', 'Carte bancaire')
                  : customer.paymentMethod === 'bank_transfer'
                  ? t('payment.methods.bankTransfer', 'Virement bancaire')
                  : customer.paymentMethod === 'manual'
                  ? t('payment.methods.manual', 'Paiement manuel')
                  : customer.paymentMethod === 'subscription'
                  ? t('payment.methods.subscription', 'Abonnement')
                  : customer.paymentMethod
                }
              </dd>
            </div>
          )}
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {t('customers.details.createdAt', 'Date de création')}
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
              {formatDate(customer.createdAt)}
            </dd>
          </div>
          {customer.notes && (
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {t('customers.details.notes', 'Notes')}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                {customer.notes}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}