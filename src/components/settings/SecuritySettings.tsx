import React, { useState } from 'react';
import { FileText, Edit3 } from 'lucide-react';
import { Button } from '../common/Button';
import { SignaturePad } from './SignaturePad';
import { useAuth } from '../../hooks/useAuth';
import { useToastStore } from '../common/ToastContainer';
import { AuthUser } from '../../types/auth';

// Extension du type AuthUser pour les fonctionnalités spécifiques à ce composant
interface ExtendedAuthUser extends AuthUser {
  kyc?: {
    idCard?: {
      type: string;
      number: string;
      expiryDate: Date;
      fileUrl: string;
      verified: boolean;
    };
    signature?: {
      fileUrl: string;
      timestamp: Date;
    };
  };
  notifications?: {
    twoFactorAuth: {
      enabled: boolean;
      method: 'email' | 'sms';
    };
    email: boolean;
    sms: boolean;
  };
}

export function SecuritySettings() {  const { user: authUser, updateUser } = useAuth();
  const addToast = useToastStore(state => state.addToast);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  
  // Cast user to ExtendedAuthUser to access the additional properties
  const user = authUser as unknown as ExtendedAuthUser;

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
    }    try {
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
      } as unknown as Partial<AuthUser>);
      
      addToast('success', 'Document d\'identité téléversé avec succès');
    } catch {
      addToast('error', 'Erreur lors du téléversement');
    }
  };  const handleSignatureSave = async (signatureDataUrl: string) => {
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
      } as unknown as Partial<AuthUser>);
      
      setIsSignatureModalOpen(false);
      addToast('success', 'Signature enregistrée avec succès');
    } catch {
      addToast('error', 'Erreur lors de l\'enregistrement de la signature');
    }
  };
  return (
    <div className="space-y-6">
      {/* KYC Section */}
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
          Documents d'identité
        </h3>
        
        <div className="space-y-4">
          {/* ID Card Upload */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Carte d'identité ou Passeport</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
                className="btn btn-primary cursor-pointer bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                {user?.kyc?.idCard ? 'Mettre à jour' : 'Téléverser'}
              </label>
            </div>
          </div>          {/* Signature */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Edit3 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Signature</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
          Authentification à deux facteurs
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
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

      {/* Notifications Section */}      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
          Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Notifications par email</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recevoir les notifications par email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">              <input
                type="checkbox"
                checked={user?.notifications?.email}
                onChange={async (e) => {
                  try {
                    await updateUser({
                      notifications: {
                        ...user?.notifications,
                        email: e.target.checked
                      }
                    } as unknown as Partial<AuthUser>);
                  } catch {
                    addToast('error', 'Erreur lors de la mise à jour');
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary-dark"></div>
            </label>
          </div>          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Notifications par SMS</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recevoir les notifications par SMS
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">              <input
                type="checkbox"
                checked={user?.notifications?.sms}
                onChange={async (e) => {
                  try {
                    await updateUser({
                      notifications: {
                        ...user?.notifications,
                        sms: e.target.checked
                      }
                    } as unknown as Partial<AuthUser>);
                  } catch {
                    addToast('error', 'Erreur lors de la mise à jour');
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary-dark"></div>
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