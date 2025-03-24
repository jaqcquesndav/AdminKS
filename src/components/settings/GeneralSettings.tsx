import React from 'react';
import { useTranslation } from 'react-i18next';

export function GeneralSettings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('settings.general.language.title')}</h3>
        <p className="text-sm text-gray-500">{t('settings.general.language.description')}</p>
        <div className="mt-4">
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">{t('settings.general.timezone.title')}</h3>
        <p className="text-sm text-gray-500">{t('settings.general.timezone.description')}</p>
        <div className="mt-4">
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option value="Africa/Kinshasa">Africa/Kinshasa (UTC+1)</option>
            <option value="Africa/Lubumbashi">Africa/Lubumbashi (UTC+2)</option>
          </select>
        </div>
      </div>
    </div>
  );
}