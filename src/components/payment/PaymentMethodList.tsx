import React from 'react';
import { CreditCard, Trash2, Plus } from 'lucide-react';
import type { PaymentMethod } from '../../types/payment';

interface PaymentMethodListProps {
  methods: PaymentMethod[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function PaymentMethodList({ methods, onAdd, onDelete, onSetDefault }: PaymentMethodListProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Moyens de paiement enregistrés</h3>
        <button
          onClick={onAdd}
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
        >
          <Plus className="w-4 h-4 mr-1" />
          Ajouter
        </button>
      </div>

      {methods.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Aucun moyen de paiement enregistré
        </p>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <CreditCard className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="font-medium">{method.name}</p>
                  {method.details.lastFour && (
                    <p className="text-sm text-gray-500">
                      •••• {method.details.lastFour}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {!method.isDefault && (
                  <button
                    onClick={() => onSetDefault(method.id)}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Définir par défaut
                  </button>
                )}
                {method.isDefault && (
                  <span className="text-sm text-green-600">
                    Par défaut
                  </span>
                )}
                <button
                  onClick={() => onDelete(method.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}