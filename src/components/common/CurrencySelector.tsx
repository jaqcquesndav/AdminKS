import { useTranslation } from 'react-i18next';
import { SupportedCurrency, CURRENCIES } from '../../utils/currency';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';

interface CurrencySelectorProps {
  onChange?: (currency: SupportedCurrency) => void;
  className?: string;
  variant?: 'dropdown' | 'buttons' | 'icons';
}

export function CurrencySelector({ 
  onChange, 
  className = '', 
  variant = 'dropdown' 
}: CurrencySelectorProps) {
  const { t } = useTranslation();
  const { currency, setCurrency, supportedCurrencies } = useCurrencySettings();

  const handleChange = (newCurrency: SupportedCurrency) => {
    console.log(`CurrencySelector: Button clicked for ${newCurrency}`);
    try {
      setCurrency(newCurrency);
      if (onChange) {
        onChange(newCurrency);
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
    'FCFA': '🇨🇮' // Utilisé ici pour représenter l'Afrique de l'Ouest
  };

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={currency}
          onChange={(e) => handleChange(e.target.value as SupportedCurrency)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          aria-label={t('common.selectCurrency', 'Sélectionner une devise')}
        >
          {supportedCurrencies.map((curr) => (
            <option key={curr} value={curr}>
              {currencyFlags[curr]} {curr} - {currencyLabels[curr]}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
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
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              currency === curr
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            aria-label={t('common.switchTo', 'Passer à') + ' ' + currencyLabels[curr]}
            aria-pressed={currency === curr}
          >
            {CURRENCIES[curr]}
          </button>
        ))}
      </div>
    );
  }

  // Variante icônes
  return (
    <div className={`flex space-x-2 ${className}`}>
      {supportedCurrencies.map((curr) => (
        <button
          key={curr}
          onClick={() => handleChange(curr)}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            currency === curr
              ? 'bg-primary text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          aria-label={t('common.switchTo', 'Passer à') + ' ' + currencyLabels[curr]}
          aria-pressed={currency === curr}
        >
          {currencyFlags[curr]}
        </button>
      ))}
    </div>
  );
}