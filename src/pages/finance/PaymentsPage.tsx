import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, PlusCircle, CheckCircle, XCircle, AlertTriangle, Clock, MoreHorizontal } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import type { SupportedCurrency } from '../../types/currency'; // Import SupportedCurrency

// Types pour les paiements
interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  amount: number; // Assumed to be in the currency specified by the `currency` field
  currency: string; // Original currency of the payment, should be a SupportedCurrency
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'cash' | 'paypal';
  date: string;
  invoiceNumber: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export function PaymentsPage() {
  const { showToast } = useToastContext();
  const { activeCurrency, format, convert, baseCurrency } = useCurrencySettings();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  
  // This state is used in handleAddPayment and will be used when PaymentFormModal is implemented
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  useEffect(() => {
    // Simuler un appel API pour récupérer la liste des paiements
    const fetchPayments = async () => {
      setLoading(true);
      try {
        // Simule une requête API avec données mockées
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockPayments: Payment[] = [
          {
            id: 'pay_123456',
            customerId: '123',
            customerName: 'Kiota Tech',
            amount: 599.99,
            currency: 'USD', // Assuming mock data amounts are in USD (baseCurrency)
            status: 'completed',
            paymentMethod: 'card',
            date: '2023-04-15',
            invoiceNumber: 'INV-2023-0042',
            description: 'Abonnement Enterprise - Mai 2023',
          },
          {
            id: 'pay_123457',
            customerId: '456',
            customerName: 'Exoscode',
            amount: 199.99,
            currency: 'USD', // Assuming mock data amounts are in USD (baseCurrency)
            status: 'completed',
            paymentMethod: 'bank_transfer',
            date: '2023-04-02',
            invoiceNumber: 'INV-2023-0041',
            description: 'Abonnement Professional - Mai 2023',
          },
          {
            id: 'pay_123458',
            customerId: '789',
            customerName: 'Banque Centrale',
            amount: 1299.99,
            currency: 'USD', // Assuming mock data amounts are in USD (baseCurrency)
            status: 'pending',
            paymentMethod: 'bank_transfer',
            date: '2023-04-19',
            invoiceNumber: 'INV-2023-0043',
            description: 'Abonnement Financial Institution - Mai 2023',
          },
          {
            id: 'pay_123459',
            customerId: '101',
            customerName: 'Startup Innovation',
            amount: 49.99,
            currency: 'USD', // Assuming mock data amounts are in USD (baseCurrency)
            status: 'failed',
            paymentMethod: 'card',
            date: '2023-04-10',
            invoiceNumber: 'INV-2023-0040',
            description: 'Abonnement Starter - Mai 2023',
          },
          {
            id: 'pay_123460',
            customerId: '112',
            customerName: 'Crédit Mutuel',
            amount: 1299.99,
            currency: 'USD', // Assuming mock data amounts are in USD (baseCurrency)
            status: 'refunded',
            paymentMethod: 'card',
            date: '2023-04-05',
            invoiceNumber: 'INV-2023-0039',
            description: 'Abonnement Financial Institution - Mai 2023',
          },
          {
            id: 'pay_123461',
            customerId: '145',
            customerName: 'Digisave',
            amount: 199.99,
            currency: 'USD', // Assuming mock data amounts are in USD (baseCurrency)
            status: 'completed',
            paymentMethod: 'paypal',
            date: '2023-04-12',
            invoiceNumber: 'INV-2023-0038',
            description: 'Abonnement Professional - Mai 2023',
          },
          {
            id: 'pay_123462',
            customerId: '178',
            customerName: 'Fintech Solutions',
            amount: 599.99,
            currency: 'USD', // Assuming mock data amounts are in USD (baseCurrency)
            status: 'completed',
            paymentMethod: 'bank_transfer',
            date: '2023-04-08',
            invoiceNumber: 'INV-2023-0037',
            description: 'Abonnement Enterprise - Mai 2023',
          },
        ];
        
        setPayments(mockPayments);
      } catch (error) {
        console.error('Erreur lors du chargement des paiements:', error);
        showToast('error', 'Erreur lors du chargement des paiements');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, [showToast]);

  const handleViewPayment = (paymentId: string) => {
    // Naviguer vers les détails du paiement
    console.log(`Afficher les détails du paiement: ${paymentId}`);
  };

  const handleDownloadInvoice = (invoiceNumber: string) => {
    // Télécharger la facture
    console.log(`Télécharger la facture: ${invoiceNumber}`);
    showToast('success', `La facture ${invoiceNumber} a été téléchargée`);
  };

  const handleRefundPayment = (paymentId: string) => {
    // Simuler un remboursement
    setPayments(pays => pays.map(pay => 
      pay.id === paymentId 
        ? { ...pay, status: 'refunded' } 
        : pay
    ));
    showToast('success', 'Le paiement a été remboursé avec succès');
  };

  const handleAddPayment = () => {
    setShowAddPaymentModal(true);
  };

  const filteredPayments = payments.filter(payment => {
    // Filtre par terme de recherche
    const matchesSearch = searchTerm === '' || 
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre par statut
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    
    // Filtre par méthode de paiement
    const matchesMethod = filterMethod === 'all' || payment.paymentMethod === filterMethod;
    
    // Filtre par plage de dates
    let matchesDateRange = true;
    const paymentDate = new Date(payment.date);
    const now = new Date();
    
    if (filterDateRange === 'today') {
      const today = new Date();
      matchesDateRange = paymentDate.toDateString() === today.toDateString();
    } else if (filterDateRange === 'this_week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      matchesDateRange = paymentDate >= startOfWeek;
    } else if (filterDateRange === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      matchesDateRange = paymentDate >= startOfMonth;
    }
    
    return matchesSearch && matchesStatus && matchesMethod && matchesDateRange;
  });

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'pending':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'failed':
        return <XCircle className="w-3 h-3 mr-1" />;
      case 'refunded':
        return <AlertTriangle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Complété';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      case 'refunded':
        return 'Remboursé';
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return 'Carte bancaire';
      case 'bank_transfer':
        return 'Virement bancaire';
      case 'cash':
        return 'Espèces';
      case 'paypal':
        return 'PayPal';
      default:
        return method;
    }
  };

  // Helper function to format payment amounts
  const formatPaymentAmount = (amount: number, currency: string) => {
    const convertedAmount = convert(amount, currency as SupportedCurrency, activeCurrency);
    return format(convertedAmount); // format from useCurrencySettings implicitly uses activeCurrency
  };

  // Statistiques des paiements
  const totalRevenue = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + convert(p.amount, p.currency as SupportedCurrency, baseCurrency), 0);
  
  const pendingRevenue = filteredPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + convert(p.amount, p.currency as SupportedCurrency, baseCurrency), 0);
  
  const refundedAmount = filteredPayments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + convert(p.amount, p.currency as SupportedCurrency, baseCurrency), 0);

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des Paiements</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un paiement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
            />
          </div>
          <button
            onClick={handleAddPayment}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un paiement manuel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center">
          <Filter className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Filtres:</span>
        </div>
        
        <div className="space-x-2 flex flex-wrap gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Complétés</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoués</option>
            <option value="refunded">Remboursés</option>
          </select>
          
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1"
          >
            <option value="all">Toutes les méthodes</option>
            <option value="card">Carte bancaire</option>
            <option value="bank_transfer">Virement bancaire</option>
            <option value="cash">Espèces</option>
            <option value="paypal">PayPal</option>
          </select>
          
          <select
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="this_week">Cette semaine</option>
            <option value="this_month">Ce mois-ci</option>
          </select>
        </div>
      </div>

      {/* Payment stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex items-center">
          <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-full p-3">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenus confirmés</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {format(convert(totalRevenue, baseCurrency, activeCurrency))} {/* Convert stats to active and format */}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex items-center">
          <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-full p-3">
            <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Paiements en attente</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {format(convert(pendingRevenue, baseCurrency, activeCurrency))} {/* Convert stats to active and format */}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex items-center">
          <div className="flex-shrink-0 bg-red-100 dark:bg-red-900 rounded-full p-3">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Montants remboursés</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {format(convert(refundedAmount, baseCurrency, activeCurrency))} {/* Convert stats to active and format */}
            </p>
          </div>
        </div>
      </div>

      {/* Payments table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID Facture
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayments.map((payment) => (
                  <tr 
                    key={payment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {payment.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {payment.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {payment.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatPaymentAmount(payment.amount, payment.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {getPaymentMethodLabel(payment.paymentMethod)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(payment.status)}`}>
                        {statusIcon(payment.status)}
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleViewPayment(payment.id)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(payment.invoiceNumber)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Télécharger la facture"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        {payment.status === 'completed' && (
                          <button
                            onClick={() => handleRefundPayment(payment.id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                            title="Rembourser"
                          >
                            Rembourser
                          </button>
                        )}
                        <button
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Aucun paiement trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' || filterMethod !== 'all' || filterDateRange !== 'all'
                ? "Aucun paiement ne correspond à vos critères de recherche."
                : "Commencez par enregistrer un nouveau paiement."}
            </p>
            <div className="mt-6">
              <button
                onClick={handleAddPayment}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un paiement manuel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Le modal pour ajouter un paiement sera implémenté séparément comme un composant */}
      {showAddPaymentModal && (
        <div className="hidden">
          {/* Placeholder for PaymentFormModal component - will be implemented later */}
          {/* This ensures showAddPaymentModal is actually used in the component */}
        </div>
      )}
    </div>
  );
}