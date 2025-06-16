import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useLanguage } from '../../hooks/useLanguage';
import { useToastContext } from '../../contexts/ToastContext';
import { showNetworkErrorToast } from '../../utils/errorUtils';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const LanguageSettings: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { showToast } = useToastContext();
  const { t } = useTranslation(); // Initialize t function
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateFormat, setDateFormat] = useState<string>(localStorage.getItem('dateFormat') || 'DD/MM/YYYY');

  const handleLanguageChange = async (newLanguage: string) => {
    try {
      setIsSubmitting(true);
      await changeLanguage(newLanguage);
      showToast('success', t('settings.language.languageChangeSuccess', 'Language changed successfully'));
    } catch (error) {
      console.error(t('settings.language.languageChangeError', 'Error changing language:'), error);
      showNetworkErrorToast(showToast, error, t('settings.language.languageChangeActionError', 'change language'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateFormatChange = async (newDateFormat: string) => {
    try {
      setIsSubmitting(true);
      setDateFormat(newDateFormat);
      localStorage.setItem('dateFormat', newDateFormat);
      showToast('success', t('settings.language.dateFormatChangeSuccess', 'Date format changed successfully'));
    } catch (error) {
      console.error(t('settings.language.dateFormatChangeError', 'Error changing date format:'), error);
      showNetworkErrorToast(showToast, error, t('settings.language.dateFormatChangeActionError', 'change date format'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportedLanguages = [
    { value: 'en', label: t('settings.language.english', 'English') },
    { value: 'fr', label: t('settings.language.french', 'Français') },
  ];

  const supportedDateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  ];

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">{t('settings.language.title', 'Language & Date Settings')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isSubmitting && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <Label htmlFor="language-select" className="text-gray-700 dark:text-gray-300">{t('settings.language.languageLabel', 'Language')}</Label>
          <Select 
            value={currentLanguage} 
            onValueChange={handleLanguageChange}
            disabled={isSubmitting}
          >
            <SelectTrigger id="language-select" className="w-[180px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder={t('settings.language.selectLanguagePlaceholder', 'Select language')} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700">
              {supportedLanguages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600">
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="date-format-select" className="text-gray-700 dark:text-gray-300">{t('settings.language.dateFormatLabel', 'Date Format')}</Label>
          <Select 
            value={dateFormat} 
            onValueChange={handleDateFormatChange}
            disabled={isSubmitting}
          >
            <SelectTrigger id="date-format-select" className="w-[180px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder={t('settings.language.selectDateFormatPlaceholder', 'Select date format')} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700">
              {supportedDateFormats.map((format) => (
                <SelectItem key={format.value} value={format.value} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600">
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSettings;
