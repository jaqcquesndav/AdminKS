import React, { useState } from 'react';
import { ProductServiceForm } from './forms/ProductServiceForm';
import type { Company, LegalForm } from '../../types/company';
import { LEGAL_FORMS, BUSINESS_SECTORS } from '../../types/company';

interface CompanyFormProps {
  company?: Partial<Company>;
  onSubmit: (data: Partial<Company>) => void;
  onCancel: () => void;
}

export function CompanyForm({ company, onSubmit, onCancel }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    rccmNumber: company?.rccmNumber || '',
    nationalId: company?.nationalId || '',
    taxNumber: company?.taxNumber || '',
    legalForm: company?.legalForm || 'SARL',
    capital: company?.capital || 0,
    createdAt: company?.createdAt ? new Date(company.createdAt) : new Date(),
    businessSector: company?.businessSector || '',
    description: company?.description || '',
    employeeCount: company?.employeeCount || 0,
    website: company?.website || '',
    address: company?.address || {
      street: '',
      city: '',
      province: '',
      commune: '',
      quartier: '',
    },
    contactEmail: company?.contactEmail || '',
    contactPhone: company?.contactPhone || [''],
    representativeName: company?.representativeName || '',
    representativeRole: company?.representativeRole || '',
    products: company?.products || [],
    services: company?.services || [],
    socialMedia: company?.socialMedia || {
      facebook: '',
      linkedin: '',
      twitter: '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="card">
        <h3 className="text-lg font-medium mb-6">Informations générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Raison sociale
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Forme juridique
            </label>
            <select
              value={formData.legalForm}
              onChange={(e) => setFormData({ ...formData, legalForm: e.target.value as LegalForm })}
              className="input"
            >
              {Object.entries(LEGAL_FORMS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capital social
            </label>
            <input
              type="number"
              value={formData.capital}
              onChange={(e) => setFormData({ ...formData, capital: Number(e.target.value) })}
              className="input"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secteur d'activité
            </label>
            <select
              value={formData.businessSector}
              onChange={(e) => setFormData({ ...formData, businessSector: e.target.value })}
              className="input"
              required
            >
              <option value="">Sélectionnez un secteur</option>
              {BUSINESS_SECTORS.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input"
            rows={4}
          />
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium mb-6">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rue/Avenue
            </label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, street: e.target.value }
              })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville
            </label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, city: e.target.value }
              })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <input
              type="text"
              value={formData.address.province}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, province: e.target.value }
              })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commune
            </label>
            <input
              type="text"
              value={formData.address.commune}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, commune: e.target.value }
              })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quartier
            </label>
            <input
              type="text"
              value={formData.address.quartier}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, quartier: e.target.value }
              })}
              className="input"
              required
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium mb-6">Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email professionnel
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.contactPhone[0]}
              onChange={(e) => setFormData({
                ...formData,
                contactPhone: [e.target.value]
              })}
              className="input"
              placeholder="+243 999 999 999"
              required
            />
          </div>
        </div>
      </div>

      <div className="card">
        <ProductServiceForm
          products={formData.products}
          services={formData.services}
          onProductsChange={(products) => setFormData({ ...formData, products })}
          onServicesChange={(services) => setFormData({ ...formData, services })}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}