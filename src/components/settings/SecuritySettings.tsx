import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Key, Smartphone, FileText, Edit3 } from 'lucide-react';
import { Button } from '../common/Button';
import { SignaturePad } from './SignaturePad';
import { useAuth } from '../../hooks/useAuth';
import { useToastStore } from '../common/ToastContainer';

export function SecuritySettings() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const addToast = useToastStore(state => state.addToast);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

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
      // Dans une vraie application, utilisez l'API Cloudinary
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
      // Simuler l'upload vers Cloudinary
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

  return (
    <div className="space-y-6">
      {/* KYC Section */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">
          Documents d'identité
        </h3>
        
        <div className="space-y-4">
          {/* ID Card Upload */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Carte d'identité ou Passeport</p>
                <p className="text-sm text-gray-500">
                  {user?.kyc?.idCard 
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
                {user?.kyc?.idCard ? 'Mettre à jour' : 'Téléverser'}
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
                  {user?.kyc?.signature 
                    ? 'Signature enregistrée le ' + new Date(user.kyc.signature.timestamp).toLocaleDateString()
                    : 'Aucune signature enregistrée'}
                </p>
              </div>
            </div>
            <Button onClick={() => setIsSignatureModalOpen(true)}>
              {user?.kyc?.signature ? 'Modifier' : 'Signer'}
            </Button>
          </div>
        </div>
      </div>

      {/* 2FA Section */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">
          Authentification à deux facteurs
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              {user?.notifications?.twoFactorAuth.enabled
                ? `Activée (${user.notifications.twoFactorAuth.method === 'email' ? 'Email' : 'SMS'})`
                : 'Désactivée'}
            </p>
          </div>
          <Button
            variant={user?.notifications?.twoFactorAuth.enabled ? 'outline' : 'primary'}
            onClick={() => {/* Toggle 2FA */}}
          >
            {user?.notifications?.twoFactorAuth.enabled ? 'Désactiver' : 'Activer'}
          </Button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">
          Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications par email</p>
              <p className="text-sm text-gray-500">
                Recevoir les notifications par email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user?.notifications?.email}
                onChange={async (e) => {
                  try {
                    await updateUser({
                      notifications: {
                        ...user?.notifications,
                        email: e.target.checked
                      }
                    });
                  } catch (error) {
                    addToast('error', 'Erreur lors de la mise à jour');
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications par SMS</p>
              <p className="text-sm text-gray-500">
                Recevoir les notifications par SMS
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user?.notifications?.sms}
                onChange={async (e) => {
                  try {
                    await updateUser({
                      notifications: {
                        ...user?.notifications,
                        sms: e.target.checked
                      }
                    });
                  } catch (error) {
                    addToast('error', 'Erreur lors de la mise à jour');
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
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