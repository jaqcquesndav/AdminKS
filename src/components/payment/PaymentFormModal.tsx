import React, { useState, useEffect } from 'react';
import { X, CreditCard, Building, CalendarClock, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaymentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormData) => void;
  payment?: PaymentFormData;
  title?: string;
}

export interface PaymentFormData {
  id?: string;
  customerId: string;
  customerName: string;
  amount: string;
  currency: string;
  description: string;
  paymentMethod: 'card' | 'bank_transfer' | 'manual' | 'subscription';
  invoiceNumber?: string;
  notes?: string;
  paymentDate: string;
}

interface CustomerOption {
  id: string;
  name: string;
}

export function PaymentFormModal({
  isOpen,
  onClose,
  onSubmit,
  payment,
  title = 'Ajouter un paiement manuel'
}: PaymentFormModalProps) {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>(
    payment || {
      customerId: '',
      customerName: '',
      amount: '',
      currency: 'EUR',
      description: '',
      paymentMethod: 'manual',
      paymentDate: new Date().toISOString().split('T')[0],
    }
  );

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // Simuler une requête API pour les clients
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockCustomers: CustomerOption[] = [
          { id: '123', name: 'Kiota Tech' },
          { id: '456', name: 'Exoscode' },
          { id: '789', name: 'Banque Centrale' },
          { id: '101', name: 'Startup Innovation' },
          { id: '112', name: 'Crédit Mutuel' },
        ];
        
        setCustomers(mockCustomers);
      } catch (error) {
        console.error("Erreur lors du chargement des clients:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Si le client change, mettre à jour le nom du client automatiquement
    if (name === 'customerId') {
      const selectedCustomer = customers.find(c => c.id === value);
      if (selectedCustomer) {
        setFormData(prev => ({ ...prev, customerName: selectedCustomer.name }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sélection du client */}
            <div>
              <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Building className="inline-block w-4 h-4 mr-1" />
                {t('payments.form.customer', 'Client')}*
              </label>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                  <span className="text-sm text-gray-500">Chargement des clients...</span>
                </div>
              ) : (
                <select
                  name="customerId"
                  id="customerId"
                  required
                  value={formData.customerId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">-- Sélectionner un client --</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Montant et devise */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <CreditCard className="inline-block w-4 h-4 mr-1" />
                  {t('payments.form.amount', 'Montant')}*
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  step="0.01"
                  min="0"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('payments.form.currency', 'Devise')}*
                </label>
                <select
                  name="currency"
                  id="currency"
                  required
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="XOF">XOF (FCFA)</option>
                </select>
              </div>
            </div>

            {/* Date de paiement */}
            <div>
              <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <CalendarClock className="inline-block w-4 h-4 mr-1" />
                {t('payments.form.paymentDate', 'Date de paiement')}*
              </label>
              <input
                type="date"
                name="paymentDate"
                id="paymentDate"
                required
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Méthode de paiement */}
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('payments.form.paymentMethod', 'Méthode de paiement')}*
              </label>
              <select
                name="paymentMethod"
                id="paymentMethod"
                required
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="manual">Paiement manuel</option>
                <option value="bank_transfer">Virement bancaire</option>
                <option value="card">Carte bancaire</option>
                <option value="subscription">Abonnement</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('payments.form.description', 'Description')}*
              </label>
              <textarea
                name="description"
                id="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: Abonnement mensuel, Service de consultation, etc."
              />
            </div>

            {/* Numéro de facture */}
            <div>
              <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FileText className="inline-block w-4 h-4 mr-1" />
                {t('payments.form.invoiceNumber', 'Numéro de facture')}
              </label>
              <input
                type="text"
                name="invoiceNumber"
                id="invoiceNumber"
                value={formData.invoiceNumber || ''}
                onChange={handleChange}
                placeholder="INV-XXXXX"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('payments.form.notes', 'Notes internes')}
              </label>
              <textarea
                name="notes"
                id="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Notes internes (non visibles par le client)"
              />
            </div>
          </form>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t('common.cancel', 'Annuler')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
          >
            {payment ? t('common.save', 'Enregistrer') : t('common.create', 'Créer')}
          </button>
        </div>
      </div>
    </div>
  );
}