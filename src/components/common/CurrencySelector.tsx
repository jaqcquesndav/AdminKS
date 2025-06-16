import { useTranslation } from 'react-i18next';
import { SupportedCurrency } from '../../types/currency';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';

interface CurrencySelectorProps {
  onSelectCurrency?: (currency: SupportedCurrency) => void; 
  className?: string;
  variant?: 'dropdown' | 'buttons' | 'icons';
}

export function CurrencySelector({ 
  onSelectCurrency, 
  className = '', 
  variant = 'dropdown' 
}: CurrencySelectorProps) {
  const { t } = useTranslation();
  const { currency, setCurrency, supportedCurrencies } = useCurrencySettings();

  const handleChange = (newCurrency: SupportedCurrency) => {
    console.log(`CurrencySelector: Selected ${newCurrency}`);
    try {
      setCurrency(newCurrency); // Update context/global state
      if (onSelectCurrency) {
        onSelectCurrency(newCurrency); // Notify parent component
      }
    } catch (error) {
      console.error('Erreur lors du changement de devise:', error);
    }
  };

  const currencyLabels: Record<SupportedCurrency, string> = {
    'USD': 'Dollar américain',
    'CDF': 'Franc congolais',
    'FCFA': 'Franc CFA'
  };

  const currencyFlags: Record<SupportedCurrency, string> = {
    'USD': '🇺🇸',
    'CDF': '🇨🇩',
    'FCFA': '🇨🇮' 
  };

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={currency} // Controlled by the hook's currency state
          onChange={(e) => handleChange(e.target.value as SupportedCurrency)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          aria-label={t('common.selectCurrency', 'Sélectionner une devise')}
        >
          {supportedCurrencies.map((curr) => (
            <option key={curr} value={curr}>
              {currencyFlags[curr]} {currencyLabels[curr]} ({curr})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {supportedCurrencies.map((curr) => (
          <button
            key={curr}
            onClick={() => handleChange(curr)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
              ${currency === curr 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}
            `}
          >
            {currencyFlags[curr]} {currencyLabels[curr]}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'icons') {
    return (
      <div className={`flex space-x-3 ${className}`}>
        {supportedCurrencies.map((curr) => (
          <button
            key={curr}
            onClick={() => handleChange(curr)}
            title={`${currencyLabels[curr]} (${curr})`}
            className={`p-2 rounded-full transition-all 
              ${currency === curr 
                ? 'bg-primary text-white scale-110 ring-2 ring-primary/50' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}
            `}
          >
            <span className="text-xl">{currencyFlags[curr]}</span>
          </button>
        ))}
      </div>
    );
  }

  return null;
}