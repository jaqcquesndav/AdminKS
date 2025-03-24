import React from 'react';
import { useTranslation } from 'react-i18next';

export function NotificationSettings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('settings.notifications.email.title')}</h3>
        <p className="text-sm text-gray-500">{t('settings.notifications.email.description')}</p>
        <div className="mt-4 space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="security"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="security" className="text-sm font-medium text-gray-700">
                {t('settings.notifications.security.title')}
              </label>
              <p className="text-sm text-gray-500">
                {t('settings.notifications.security.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="updates"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="updates" className="text-sm font-medium text-gray-700">
                {t('settings.notifications.updates.title')}
              </label>
              <p className="text-sm text-gray-500">
                {t('settings.notifications.updates.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}