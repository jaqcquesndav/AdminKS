import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useLanguage } from '../../hooks/useLanguage';
import { useToastContext } from '../../contexts/ToastContext';

const LanguageSettings: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { showToast } = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateFormat, setDateFormat] = useState<string>('DD/MM/YYYY'); // Default date format

  // No need for useEffect to check for error since the hook doesn't provide it
  const handleLanguageChange = async (newLanguage: string) => {
    try {
      setIsSubmitting(true);
      await changeLanguage(newLanguage);
      showToast('success', 'Langue modifiée avec succès');
    } catch (error) {
      console.error('Erreur lors du changement de langue:', error);
      showToast('error', 'Erreur lors de la modification de la langue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateFormatChange = async (newDateFormat: string) => {
    try {
      setIsSubmitting(true);
      await setDateFormat(newDateFormat);
      showToast('success', 'Format de date modifié avec succès');
    } catch (error) {
      console.error('Erreur lors du changement de format de date:', error);
      showToast('error', 'Erreur lors de la modification du format de date. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Supported languages and date formats
  const supportedLanguages = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    // Add other supported languages here
  ];

  const supportedDateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
    // Add other supported date formats here
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language & Date Settings</CardTitle>
      </CardHeader>      <CardContent className="space-y-6">
        {isSubmitting && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <Label htmlFor="language-select">Language</Label>
          <Select 
            value={currentLanguage} 
            onValueChange={handleLanguageChange}
            disabled={isSubmitting}
          >
            <SelectTrigger id="language-select" className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>        <div className="flex items-center justify-between">
          <Label htmlFor="date-format-select">Date Format</Label>
          <Select 
            value={dateFormat} 
            onValueChange={handleDateFormatChange}
            disabled={isSubmitting}
          >
            <SelectTrigger id="date-format-select" className="w-[180px]">
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              {supportedDateFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
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
