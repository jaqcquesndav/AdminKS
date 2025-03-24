import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, FileText, Edit3 } from 'lucide-react';
import { Button } from '../common/Button';
import { SignaturePad } from './SignaturePad';
import { useAuth } from '../../hooks/useAuth';
import { useToastStore } from '../common/ToastContainer';

export function AdminProfileSettings() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const addToast = useToastStore(state => state.addToast);
  const [isEditing, setIsEditing] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setIsEditing(false);
      addToast('success', 'Profil mis à jour avec succès');
    } catch (error) {
      addToast('error', 'Erreur lors de la mise à jour du profil');
    }
  };

  const handleIdCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type et la taille du fichier
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      addToast('error', 'Format de fichier non supporté. Utilisez JPG, PNG ou PDF.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      addToast('error', 'Le fichier est trop volumineux. Maximum 5MB.');
      return;
    }

    try {
      // Simuler l'upload vers Cloudinary
      const fakeCloudinaryUrl = URL.createObjectURL(file);
      
      await updateUser({
        kyc: {
          ...user?.kyc,
          idCard: {
            type: 'nationalId',
            number: 'ID-' + Date.now(),
            expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000), // +5 ans
            fileUrl: fakeCloudinaryUrl,
            verified: false
          }
        }
      });
      
      addToast('success', 'Document d\'identité téléversé avec succès');
    } catch (error) {
      addToast('error', 'Erreur lors du téléversement');
    }
  };

  const handleSignatureSave = async (signatureDataUrl: string) => {
    try {
      await updateUser({
        kyc: {
          ...user?.kyc,
          signature: {
            fileUrl: signatureDataUrl,
            timestamp: new Date()
          }
        }
      });
      
      setIsSignatureModalOpen(false);
      addToast('success', 'Signature enregistrée avec succès');
    } catch (error) {
      addToast('error', 'Erreur lors de l\'enregistrement de la signature');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profil Administrateur</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Modifier
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom complet</label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  placeholder="+243 999 999 999"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">Nom complet</label>
              <p className="font-medium">{user.name}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Téléphone</label>
              <p className="font-medium">{user.phoneNumber || 'Non défini'}</p>
            </div>
          </div>
        </div>
      )}

      {/* KYC Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Documents d'identité</h3>
        
        <div className="space-y-4">
          {/* ID Card Upload */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Carte d'identité ou Passeport</p>
                <p className="text-sm text-gray-500">
                  {user.kyc?.idCard 
                    ? 'Document téléversé' + (user.kyc.idCard.verified ? ' et vérifié' : ' (en attente de vérification)')
                    : 'Aucun document téléversé'}
                </p>
              </div>
            </div>
            <div>
              <input
                type="file"
                id="id-card-upload"
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleIdCardUpload}
              />
              <label
                htmlFor="id-card-upload"
                className="btn btn-primary cursor-pointer"
              >
                {user.kyc?.idCard ? 'Mettre à jour' : 'Téléverser'}
              </label>
            </div>
          </div>

          {/* Signature */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Edit3 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Signature</p>
                <p className="text-sm text-gray-500">
                  {user.kyc?.signature 
                    ? 'Signature enregistrée le ' + new Date(user.kyc.signature.timestamp).toLocaleDateString()
                    : 'Aucune signature enregistrée'}
                </p>
              </div>
            </div>
            <Button onClick={() => setIsSignatureModalOpen(true)}>
              {user.kyc?.signature ? 'Modifier' : 'Signer'}
            </Button>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {isSignatureModalOpen && (
        <SignaturePad
          onSave={handleSignatureSave}
          onClose={() => setIsSignatureModalOpen(false)}
        />
      )}
    </div>
  );
}