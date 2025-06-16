import { useTranslation } from 'react-i18next';

export function AdminUsersPage() {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t('adminUsersPage.title')}</h2>
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-500">{t('adminUsersPage.description')}</p>
        <p className="text-gray-500">{t('adminUsersPage.functionality')}</p>
      </div>
    </div>
  );
}