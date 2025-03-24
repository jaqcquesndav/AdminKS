import React from 'react';
import { Check, Coins } from 'lucide-react';
import { PriceDisplay } from './PriceDisplay';
import type { ApplicationGroup } from '../../types/subscription';

interface SubscriptionPlansProps {
  plans: ApplicationGroup[];
  onSelectPlan: (groupId: string, billingCycle: 'monthly' | 'yearly') => void;
}

export function SubscriptionPlans({ plans, onSelectPlan }: SubscriptionPlansProps) {
  return (
    <div className="space-y-8">
      {plans.map(plan => (
        <div key={plan.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 bg-gray-50 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            <p className="mt-2 text-gray-600">{plan.description}</p>
          </div>
          
          <div className="px-6 py-8">
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">Mensuel</span>
                </div>
                <PriceDisplay
                  usd={plan.monthlyPrice.usd}
                  cdf={plan.monthlyPrice.cdf}
                  cycle="monthly"
                />
                <div className="mt-2 flex items-center justify-center text-sm text-green-600">
                  <Coins className="w-4 h-4 mr-1" />
                  <span>+{plan.tokenBonus.monthly.toLocaleString()} tokens/mois</span>
                </div>
                <button
                  onClick={() => onSelectPlan(plan.id, 'monthly')}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Choisir ce plan
                </button>
              </div>
              
              <div className="text-center">
                <div className="mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Économisez 17%
                  </span>
                </div>
                <PriceDisplay
                  usd={plan.yearlyPrice.usd}
                  cdf={plan.yearlyPrice.cdf}
                  cycle="yearly"
                />
                <div className="mt-2 flex items-center justify-center text-sm text-green-600">
                  <Coins className="w-4 h-4 mr-1" />
                  <span>+{plan.tokenBonus.yearly.toLocaleString()} tokens/an</span>
                </div>
                <button
                  onClick={() => onSelectPlan(plan.id, 'yearly')}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Choisir ce plan
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Applications incluses</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.applications.map(app => (
                  <div key={app.id} className="border rounded-lg p-4">
                    <h5 className="font-semibold">{app.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">{app.description}</p>
                    <ul className="space-y-2">
                      {app.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}