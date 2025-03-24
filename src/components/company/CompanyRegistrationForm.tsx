import React, { useState } from 'react';
import type { CompanyRegistration, LegalForm } from '../../types/company';
import { BUSINESS_SECTORS, LEGAL_FORMS } from '../../types/company';

interface CompanyRegistrationFormProps {
  onSubmit: (data: Partial<CompanyRegistration>) => void;
  onCancel: () => void;
  initialData?: Partial<CompanyRegistration>;
}

export function CompanyRegistrationForm({ onSubmit, onCancel, initialData }: CompanyRegistrationFormProps) {
  const [formData, setFormData] = useState({
    businessName: initialData?.businessName || '',
    legalForm: initialData?.legalForm || 'SARL',
    sector: initialData?.sector || '',
    activities: initialData?.activities || [''],
    rccmNumber: initialData?.rccmNumber || '',
    nationalId: initialData?.nationalId || '',
    taxNumber: initialData?.taxNumber || '',
    address: initialData?.address || {
      street: '',
      city: '',
      province: ''
    },
    contactEmail: initialData?.contactEmail || '',
    contactPhone: initialData?.contactPhone || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, '']
    }));
  };

  const updateActivity = (index: number, value: string) => {
    const newActivities = [...formData.activities];
    newActivities[index] = value;
    setFormData(prev => ({
      ...prev,
      activities: newActivities
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Raison Sociale
          </label>
          <input
            type="text"
            value={formData.businessName}
            onChange={e => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Forme Juridique
          </label>
          <select
            value={formData.legalForm}
            onChange={e => setFormData(prev => ({ ...prev, legalForm: e.target.value as LegalForm }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.entries(LEGAL_FORMS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Secteur d'Activité
          </label>
          <select
            value={formData.sector}
            onChange={e => setFormData(prev => ({ ...prev, sector: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Sélectionnez un secteur</option>
            {BUSINESS_SECTORS.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Numéro RCCM
          </label>
          <input
            type="text"
            value={formData.rccmNumber}
            onChange={e => setFormData(prev => ({ ...prev, rccmNumber: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Id. Nat
          </label>
          <input
            type="text"
            value={formData.nationalId}
            onChange={e => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            NIF
          </label>
          <input
            type="text"
            value={formData.taxNumber}
            onChange={e => setFormData(prev => ({ ...prev, taxNumber: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Activités (Produits et/ou Services)
        </label>
        {formData.activities.map((activity, index) => (
          <input
            key={index}
            type="text"
            value={activity}
            onChange={e => updateActivity(index, e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Décrivez une activité"
            required
          />
        ))}
        <button
          type="button"
          onClick={addActivity}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          + Ajouter une activité
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rue et numéro
          </label>
          <input
            type="text"
            value={formData.address.street}
            onChange={e => setFormData(prev => ({
              ...prev,
              address: { ...prev.address, street: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ville
          </label>
          <input
            type="text"
            value={formData.address.city}
            onChange={e => setFormData(prev => ({
              ...prev,
              address: { ...prev.address, city: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Province
          </label>
          <input
            type="text"
            value={formData.address.province}
            onChange={e => setFormData(prev => ({
              ...prev,
              address: { ...prev.address, province: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email de contact
          </label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={e => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Téléphone de contact
          </label>
          <input
            type="tel"
            value={formData.contactPhone}
            onChange={e => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}