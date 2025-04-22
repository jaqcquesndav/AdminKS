import React from 'react';
import { useTranslation } from 'react-i18next';

export function CustomersPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('customers.title', 'Tous les clients')}</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p className="text-gray-500 dark:text-gray-400">
          Cette section affiche tous les clients. Utilisez les catégories du menu pour voir les clients spécifiques.
        </p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="font-medium">PME</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Petites et moyennes entreprises
            </p>
            <a 
              href="/customers/pme"
              className="inline-block mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Voir les PME →
            </a>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
            <h3 className="font-medium">Institutions Financières</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Banques et institutions financières
            </p>
            <a 
              href="/customers/financial"
              className="inline-block mt-3 text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Voir les institutions →
            </a>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
            <h3 className="font-medium">Comptes en attente</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Comptes en attente d'activation
            </p>
            <a 
              href="/customers/pending"
              className="inline-block mt-3 text-sm text-amber-600 dark:text-amber-400 hover:underline"
            >
              Voir les comptes en attente →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}