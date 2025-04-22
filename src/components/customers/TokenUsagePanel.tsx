import React, { useState } from 'react';
import { Coins, RefreshCw, AlertTriangle, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TokenUsagePanelProps {
  customerId: string;
  customerName: string;
  customerType: 'pme' | 'financial';
  tokenAllocation: number;
  tokenUsage: number;
  nextRenewalDate: Date;
  onAddTokens: (customerId: string, amount: number) => Promise<void>;
}

export function TokenUsagePanel({
  customerId,
  customerName,
  customerType,
  tokenAllocation,
  tokenUsage,
  nextRenewalDate,
  onAddTokens
}: TokenUsagePanelProps) {
  const { t } = useTranslation();
  const [isAddingTokens, setIsAddingTokens] = useState(false);
  const [additionalTokens, setAdditionalTokens] = useState<number>(1000000);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate token usage percentage
  const usagePercentage = tokenAllocation > 0 
    ? Math.min(Math.round((tokenUsage / tokenAllocation) * 100), 100) 
    : 100;
  
  // Determine if tokens are running low (less than 20% remaining)
  const isLowOnTokens = tokenAllocation > 0 && (tokenAllocation - tokenUsage) / tokenAllocation < 0.2;
  
  // Format token numbers with commas for readability
  const formatTokens = (tokens: number) => {
    return new Intl.NumberFormat().format(tokens);
  };

  // Handle adding tokens
  const handleAddTokens = async () => {
    if (additionalTokens <= 0) return;
    
    setIsLoading(true);
    try {
      await onAddTokens(customerId, additionalTokens);
      setIsAddingTokens(false);
    } catch (error) {
      console.error("Failed to add tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate estimated cost based on additional tokens (10 USD per million)
  const calculateCost = () => {
    return (additionalTokens / 1000000) * 10;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center text-gray-800 dark:text-white">
          <Coins className="h-5 w-5 mr-2 text-amber-500" />
          {t('customers.tokenUsage.title', 'Utilisation des tokens')}
        </h3>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 flex items-center">
            <RefreshCw className="h-3 w-3 mr-1" />
            {t('customers.tokenUsage.nextRenewal', 'Renouvellement: ')} 
            {nextRenewalDate.toLocaleDateString()}
          </span>
          
          {!isAddingTokens && (
            <button
              onClick={() => setIsAddingTokens(true)}
              className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
            >
              <Plus className="h-3 w-3 mr-1" />
              {t('customers.tokenUsage.addTokens', 'Ajouter')}
            </button>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatTokens(tokenUsage)} / {formatTokens(tokenAllocation)} tokens
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {usagePercentage}%
            </span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
          <div 
            className={`h-2.5 rounded-full ${
              usagePercentage > 90 
                ? 'bg-red-600' 
                : usagePercentage > 70 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
            }`}
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
        
        {isLowOnTokens && (
          <div className="flex items-center mt-2 text-yellow-700 dark:text-yellow-500">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="text-xs">
              {t('customers.tokenUsage.lowTokens', 'Tokens restants faibles. Envisagez d\'ajouter plus de tokens.')}
            </span>
          </div>
        )}
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {customerType === 'pme' 
            ? t('customers.tokenUsage.pmeAllocation', 'PME: 1 million de tokens par mois inclus avec les forfaits payants.')
            : t('customers.tokenUsage.financialAllocation', 'Institution financière: 10 millions de tokens par mois inclus avec les forfaits payants.')}
        </div>
      </div>
      
      {/* Add tokens form */}
      {isAddingTokens && (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md border border-gray-200 dark:border-gray-600 mt-4">
          <h4 className="font-medium text-gray-800 dark:text-white mb-3">
            {t('customers.tokenUsage.addTokensTitle', 'Ajouter des tokens pour')} {customerName}
          </h4>
          
          <div className="flex flex-col space-y-3">
            <div>
              <label htmlFor="tokenAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('customers.tokenUsage.tokenAmount', 'Quantité de tokens')}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  id="tokenAmount"
                  value={additionalTokens}
                  onChange={(e) => setAdditionalTokens(Math.max(0, parseInt(e.target.value) || 0))}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white sm:text-sm"
                  placeholder="1000000"
                  min="1000000"
                  step="1000000"
                />
                <button
                  type="button"
                  onClick={() => setAdditionalTokens(1000000)}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded"
                >
                  1M
                </button>
                <button
                  type="button"
                  onClick={() => setAdditionalTokens(5000000)}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded"
                >
                  5M
                </button>
                <button
                  type="button"
                  onClick={() => setAdditionalTokens(10000000)}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded"
                >
                  10M
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t('customers.tokenUsage.estimatedCost', 'Coût estimé: ')} {calculateCost().toFixed(2)} USD
              </p>
            </div>
            
            <div className="flex items-center space-x-3 justify-end">
              <button
                type="button"
                onClick={() => setIsAddingTokens(false)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={isLoading}
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                type="button"
                onClick={handleAddTokens}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={isLoading || additionalTokens <= 0}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('common.processing', 'Traitement...')}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    {t('customers.tokenUsage.confirm', 'Confirmer l\'ajout')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Token usage details */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('customers.tokenUsage.details', 'Détails d\'utilisation')}
        </h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">{t('customers.tokenUsage.allocated', 'Allocation')}</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatTokens(tokenAllocation)} tokens</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">{t('customers.tokenUsage.used', 'Utilisés')}</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatTokens(tokenUsage)} tokens</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">{t('customers.tokenUsage.remaining', 'Restants')}</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatTokens(Math.max(0, tokenAllocation - tokenUsage))} tokens</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">{t('customers.tokenUsage.rate', 'Taux journalier moyen')}</p>
            <p className="font-medium text-gray-900 dark:text-white">~{formatTokens(Math.round(tokenUsage / (new Date().getDate())))} tokens/jour</p>
          </div>
        </div>
      </div>
    </div>
  );
}