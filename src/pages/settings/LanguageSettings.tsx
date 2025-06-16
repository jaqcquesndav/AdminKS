import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useLanguage } from '../../hooks/useLanguage'; // Assuming a useLanguage hook exists or will be created

const LanguageSettings: React.FC = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage, dateFormat, setDateFormat } = useLanguage();

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const handleDateFormatChange = (newDateFormat: string) => {
    setDateFormat(newDateFormat);
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
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="language-select">Language</Label>
          <Select value={language} onValueChange={handleLanguageChange}>
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
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="date-format-select">Date Format</Label>
          <Select value={dateFormat} onValueChange={handleDateFormatChange}>
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
