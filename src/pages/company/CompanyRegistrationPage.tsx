import React from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyRegistrationForm } from '../../components/company/CompanyRegistrationForm';
import type { CompanyRegistration } from '../../types/company';

export function CompanyRegistrationPage() {
  const { t } = useTranslation();

  const handleSubmit = async (data: Partial<CompanyRegistration>) => {
    console.log('Submitting company registration:', data);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {t('company.registration.title')}
      </h1>

      <CompanyRegistrationForm
        onSubmit={handleSubmit}
        onCancel={() => window.history.back()}
      />
    </div>
  );
}