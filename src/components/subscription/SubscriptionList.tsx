import React from 'react';
import { Check, X } from 'lucide-react';
import type { Subscription } from '../../types/subscription';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onRenew: (subscriptionId: string) => void;
  onCancel: (subscriptionId: string) => void;
}

export function SubscriptionList({ subscriptions, onRenew, onCancel }: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Aucun abonnement actif</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subscriptions.map((subscription) => (
        <div key={subscription.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{subscription.name}</h3>
            <span className={`px-3 py-1 rounded-full text-sm ${
              subscription.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {subscription.status === 'active' ? 'Actif' : 'Inactif'}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p>Date de début: {subscription.startDate.toLocaleDateString()}</p>
            <p>Date de fin: {subscription.endDate.toLocaleDateString()}</p>
            <p>Prix: {subscription.price} USD/mois</p>
          </div>
          
          <div className="mt-4 flex space-x-2">
            {subscription.status !== 'active' && (
              <button
                onClick={() => onRenew(subscription.id)}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Renouveler
              </button>
            )}
            {subscription.status === 'active' && (
              <button
                onClick={() => onCancel(subscription.id)}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}