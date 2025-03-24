import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, MapPin, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { LocationPicker } from '../LocationPicker';
import { useToastStore } from '../../common/ToastContainer';
import { cloudinaryService } from '../../../services/cloudinary';
import { LEGAL_FORMS, BUSINESS_SECTORS } from '../../../types/company';
import type { Company, Location } from '../../../types/company';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Company>) => Promise<void>;
  company: Company;
}

export function CompanyProfileModal({ isOpen, onClose, onSubmit, company }: CompanyProfileModalProps) {
  const { t } = useTranslation();
  const addToast = useToastStore(state => state.addToast);
  const [formData, setFormData] = useState<Partial<Company>>(company);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('error', 'Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('error', 'L\'image est trop volumineuse. Maximum 5MB.');
      return;
    }

    setUploadingLogo(true);
    try {
      const result = await cloudinaryService.upload(file, 'logos');
      setFormData(prev => ({
        ...prev,
        logo: result.secure_url
      }));
      addToast('success', 'Logo téléversé avec succès');
    } catch (error) {
      console.error('Erreur lors du téléversement du logo:', error);
      addToast('error', error instanceof Error ? error.message : 'Erreur lors du téléversement du logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setFormData(prev => ({
      ...prev,
      locations: [...(prev.locations || []), location]
    }));
    setIsLocationPickerOpen(false);
  };

  const handleRemoveLocation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Modifier le profil de l'entreprise"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Logo et informations de base */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="relative">
                {formData.logo ? (
                  <img
                    src={formData.logo}
                    alt="Logo"
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  id="logo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />
                <label
                  htmlFor="logo-upload"
                  className="absolute bottom-2 right-2 p-1.5 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 text-gray-600" />
                </label>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Raison sociale</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Forme juridique</label>
                <select
                  value={formData.legalForm}
                  onChange={(e) => setFormData({ ...formData, legalForm: e.target.value })}
                  className="input"
                >
                  <option value="">Sélectionner</option>
                  {Object.entries(LEGAL_FORMS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Secteur d'activité</label>
                <select
                  value={formData.businessSector}
                  onChange={(e) => setFormData({ ...formData, businessSector: e.target.value })}
                  className="input"
                >
                  <option value="">Sélectionner</option>
                  {BUSINESS_SECTORS.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Numéros d'identification */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">RCCM</label>
              <input
                type="text"
                value={formData.rccmNumber}
                onChange={(e) => setFormData({ ...formData, rccmNumber: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ID. NAT</label>
              <input
                type="text"
                value={formData.nationalId}
                onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NIF</label>
              <input
                type="text"
                value={formData.taxNumber}
                onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CNSS</label>
              <input
                type="text"
                value={formData.cnssNumber}
                onChange={(e) => setFormData({ ...formData, cnssNumber: e.target.value })}
                className="input"
              />
            </div>
          </div>

          {/* Adresse du siège */}
          <div>
            <h3 className="text-lg font-medium mb-4">Adresse du siège</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Rue/Avenue</label>
                <input
                  type="text"
                  value={formData.address?.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Commune</label>
                <input
                  type="text"
                  value={formData.address?.commune}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, commune: e.target.value }
                  })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quartier</label>
                <input
                  type="text"
                  value={formData.address?.quartier}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, quartier: e.target.value }
                  })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ville</label>
                <input
                  type="text"
                  value={formData.address?.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Province</label>
                <input
                  type="text"
                  value={formData.address?.province}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, province: e.target.value }
                  })}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Autres localisations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Autres localisations</h3>
              <button
                type="button"
                onClick={() => setIsLocationPickerOpen(true)}
                className="flex items-center text-sm text-primary hover:text-primary-dark"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </button>
            </div>

            <div className="space-y-3">
              {formData.locations?.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{location.address}</p>
                      <p className="text-sm text-gray-500">
                        {location.coordinates.lat}, {location.coordinates.lng}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={formData.contactPhone?.[0]}
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

          {/* Représentant légal */}
          <div>
            <h3 className="text-lg font-medium mb-4">Représentant légal</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom complet</label>
                <input
                  type="text"
                  value={formData.representativeName}
                  onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fonction</label>
                <input
                  type="text"
                  value={formData.representativeRole}
                  onChange={(e) => setFormData({ ...formData, representativeRole: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>

      {isLocationPickerOpen && (
        <LocationPicker
          onSelect={handleLocationSelect}
          onClose={() => setIsLocationPickerOpen(false)}
        />
      )}
    </>
  );
}