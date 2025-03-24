import React, { useState } from 'react';
import { CompanyProfile } from '../../components/company/CompanyProfile';
import { CompanyProfileModal } from '../../components/company/modals/CompanyProfileModal';
import { CompanyDocuments } from '../../components/company/CompanyDocuments';
import { PageLoader } from '../../components/common/PageLoader';
import { useToastStore } from '../../components/common/ToastContainer';
import { cloudinaryService } from '../../services/cloudinary';
import type { Document } from '../../types/document';
import type { Company } from '../../types/company';

// Mock data pour le développement
const mockCompany: Company = {
  id: '1',
  name: 'Acme Corp',
  rccmNumber: 'CD/GOMA/RCCM/23-B-00196',
  nationalId: '19-H5300-N40995F',
  taxNumber: 'A2321658S',
  address: {
    street: '123 Avenue du Commerce',
    city: 'Goma',
    province: 'Nord-Kivu',
    commune: 'Goma',
    quartier: 'Les Volcans',
    coordinates: { lat: -1.6734, lng: 29.2386 }
  },
  locations: [],
  documents: {},
  contactEmail: 'contact@acme.com',
  contactPhone: ['+243 999 999 999'],
  representativeName: 'Jean Dupont',
  representativeRole: 'Directeur Général',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function CompanyProfilePage() {
  const [company, setCompany] = useState<Company>(mockCompany);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToastStore(state => state.addToast);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (data: Partial<Company>) => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour les données de l'entreprise
      setCompany(prev => ({
        ...prev,
        ...data,
        updatedAt: new Date()
      }));
      
      addToast('success', 'Profil mis à jour avec succès');
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      addToast('error', 'Erreur lors de la mise à jour du profil');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (type: Document['type'], file: File) => {
    try {
      const response = await cloudinaryService.upload(file, 'documents');
      
      // Mettre à jour les documents de l'entreprise
      setCompany(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [type]: response.secure_url
        },
        updatedAt: new Date()
      }));

      addToast('success', 'Document téléversé avec succès');
    } catch (error) {
      console.error('Erreur lors du téléversement:', error);
      addToast('error', 'Erreur lors du téléversement du document');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Profil de l'entreprise</h1>
      
      <div className="grid gap-8">
        <CompanyProfile
          company={company}
          onEdit={handleOpenModal}
        />

        <CompanyDocuments
          documents={Object.entries(company.documents).map(([type, url]) => ({
            id: type,
            type: type as Document['type'],
            fileName: `${type}.pdf`,
            fileUrl: url,
            mimeType: 'application/pdf',
            fileSize: 0,
            uploadedAt: new Date(),
            status: 'pending',
            companyId: company.id
          }))}
          onUpload={handleDocumentUpload}
        />
      </div>

      <CompanyProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        company={company}
      />
    </div>
  );
}