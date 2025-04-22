import React from 'react';
import { useTranslation } from 'react-i18next';

export function TokensConfigPage() {
  const { t } = useTranslation();

  const tokenPackages = [
    {
      id: 1,
      name: 'Pack Initial',
      tokens: 10000,
      price: 49,
      discount: null,
      bestFor: 'Petites entreprises'
    },
    {
      id: 2,
      name: 'Pack Business',
      tokens: 50000,
      price: 199,
      discount: '20%',
      bestFor: 'Entreprises moyennes',
      popular: true
    },
    {
      id: 3,
      name: 'Pack Enterprise',
      tokens: 250000,
      price: 699,
      discount: '30%',
      bestFor: 'Grandes entreprises'
    },
    {
      id: 4,
      name: 'Pack Illimité',
      tokens: null,
      price: 1999,
      discount: null,
      bestFor: 'Institutions financières'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('configuration.tokens.title', 'Packages de Tokens')}</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
          {t('common.addNew', 'Ajouter un package')}
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">Package</th>
                <th scope="col" className="px-6 py-3">Tokens</th>
                <th scope="col" className="px-6 py-3">Prix</th>
                <th scope="col" className="px-6 py-3">Remise</th>
                <th scope="col" className="px-6 py-3">Idéal pour</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokenPackages.map((pkg) => (
                <tr key={pkg.id} className="border-b dark:border-gray-700">
                  <td className="px-6 py-4 font-medium">
                    {pkg.popular ? (
                      <div>
                        {pkg.name}
                        <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">Populaire</span>
                      </div>
                    ) : (
                      pkg.name
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {pkg.tokens ? pkg.tokens.toLocaleString() : 'Illimité'}
                  </td>
                  <td className="px-6 py-4">
                    {pkg.price.toLocaleString()}€
                  </td>
                  <td className="px-6 py-4">
                    {pkg.discount || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {pkg.bestFor}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:underline">Modifier</button>
                      <button className="text-red-600 hover:underline">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 className="font-medium text-blue-800 dark:text-blue-300">Politique de prix des tokens</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Les packages de tokens sont conçus pour offrir plus de flexibilité aux clients. 
            Ils peuvent acheter des tokens à l'avance et les utiliser selon leurs besoins.
            Les tokens non utilisés expirent après 12 mois.
          </p>
        </div>
      </div>
    </div>
  );
}