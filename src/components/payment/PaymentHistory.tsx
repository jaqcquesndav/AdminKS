import React from 'react';
import { Download } from 'lucide-react';
import type { PaymentHistory } from '../../types/payment';
import { formatCurrency } from '../../utils/currency';

interface PaymentHistoryProps {
  payments: PaymentHistory[];
  onDownloadInvoice: (payment: PaymentHistory) => void;
}

export function PaymentHistory({ payments, onDownloadInvoice }: PaymentHistoryProps) {
  const handleDownload = async (payment: PaymentHistory) => {
    try {
      onDownloadInvoice(payment);
    } catch (error) {
      console.error('Erreur lors du téléchargement de la facture:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Historique des paiements</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° Facture
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facture
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.invoiceNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {payment.description}
                  {payment.tokenConsumption && (
                    <div className="text-xs text-gray-500">
                      {payment.tokenConsumption.count} tokens à {payment.tokenConsumption.rate} USD/token
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(payment.amount.usd, 'USD')}
                  <br />
                  <span className="text-xs text-gray-500">
                    {formatCurrency(payment.amount.cdf, 'CDF')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : payment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status === 'completed' ? 'Payé' : payment.status === 'pending' ? 'En attente' : 'Échoué'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleDownload(payment)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}