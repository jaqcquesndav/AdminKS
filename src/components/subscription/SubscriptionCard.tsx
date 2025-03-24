import React from 'react';
import { Check, X } from 'lucide-react';
import type { Subscription } from '../../types/auth';

interface SubscriptionCardProps {
  subscription: Subscription;
  onRenew?: () => void;
  onCancel?: () => void;
}

export function SubscriptionCard({ subscription, onRenew, onCancel }: SubscriptionCardProps) {
  const isActive = subscription.status === 'active';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{subscription.applicationId}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {subscription.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p>Start Date: {subscription.startDate.toLocaleDateString()}</p>
        <p>End Date: {subscription.endDate.toLocaleDateString()}</p>
      </div>
      
      <div className="mt-4 flex space-x-2">
        {!isActive && onRenew && (
          <button
            onClick={onRenew}
            className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Renew
          </button>
        )}
        {isActive && onCancel && (
          <button
            onClick={onCancel}
            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}