import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Edit3, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToastStore } from '../common/ToastContainer';
import type { AuthUser, KYCInfo, KYCIdCard, KYCSignature } from '../../types/auth';

// Helper component to display profile information items
interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string | undefined | null;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center">
    <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm text-gray-900 dark:text-gray-100">{value || '-'}</p>
    </div>
  </div>
);

// Helper component to render KYC item status
interface KycItemStatusProps {
  item: KYCIdCard | KYCSignature | undefined;
  notUploadedText: string;
  uploadedText: string; // This will be used for the generic uploaded message
  verifiedText: string;
  pendingText: string; // This will be used for the generic pending message
  verifiedDate?: Date | string | null;
  itemType: 'idCard' | 'signature';
}

const KycItemStatus: React.FC<KycItemStatusProps> = ({ 
  item,
  notUploadedText,
  uploadedText, // Kept for generic uploaded message
  verifiedText,
  pendingText, // Kept for generic pending message
  verifiedDate,
  itemType
}) => {
  const { t } = useTranslation();
  if (!item?.fileUrl) {
    return <p className="text-sm text-gray-500"><XCircle className="inline h-4 w-4 mr-1" />{notUploadedText}</p>;
  }

  const isIdCard = itemType === 'idCard';
  const idCardItem = item as KYCIdCard; // Type assertion for idCard specific properties
  const signatureItem = item as KYCSignature; // Type assertion for signature specific properties

  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-900 dark:text-gray-100"><CheckCircle className="inline h-4 w-4 mr-1 text-green-500" />{uploadedText}</p>
      {isIdCard && idCardItem.verified && (
        <p className="text-sm text-green-600">
          <CheckCircle className="inline h-4 w-4 mr-1" />
          {verifiedText}
          {verifiedDate && ` ${new Date(verifiedDate).toLocaleDateString(t('common.locale'))}`}
        </p>
      )}
      {isIdCard && !idCardItem.verified && (
        <p className="text-sm text-yellow-600">
          <Clock className="inline h-4 w-4 mr-1" />
          {pendingText} {/* Use the prop here */}
        </p>
      )}
      {!isIdCard && signatureItem.timestamp && (
        <p className="text-sm text-gray-700 dark:text-gray-300"><Clock className="inline h-4 w-4 mr-1" /> 
        {t('settings.profile.kyc.signatureSavedDate', { date: new Date(signatureItem.timestamp).toLocaleDateString(t('common.locale')) })}
        </p>
      )}
    </div>
  );
};

export function AdminProfileSettings() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const addToast = useToastStore(state => state.addToast);
  const [isEditing, setIsEditing] = useState(false);
  // const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false); // Removed state for SignaturePad modal
  const [formData, setFormData] = useState<{ name: string; email: string; phoneNumber: string }>({
    name: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      // Construct the payload carefully, ensuring not to send undefined fields if not intended
      const payload: Partial<AuthUser> = { ...formData };
      await updateUser(payload);
      setIsEditing(false);
      addToast('success', t('settings.profile.updateSuccess', 'Profil mis à jour avec succès'));
    } catch (error) {
      console.error("Error updating profile:", error);
      addToast('error', t('settings.profile.updateError', 'Erreur lors de la mise à jour du profil'));
    }
  };

  const handleIdCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      addToast('error', t('settings.profile.idCard.fileTypeError', 'Format de fichier non supporté. Utilisez JPG, PNG ou PDF.'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      addToast('error', t('settings.profile.idCard.fileSizeError', 'Le fichier est trop volumineux. Maximum 5MB.'));
      return;
    }

    try {
      const fakeCloudinaryUrl = URL.createObjectURL(file);
      
      const updatedKyc: KYCInfo = {
        ...user.kyc,
        idCard: {
          type: 'nationalId',
          number: 'ID-' + Date.now(),
          expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000), // +5 ans
          fileUrl: fakeCloudinaryUrl,
          verified: false
        }
      };
      await updateUser({ kyc: updatedKyc });
      
      addToast('success', t('settings.profile.idCard.uploadSuccess', 'Document d\\\'identité téléversé avec succès'));
    } catch (error) {
      console.error("Error uploading ID card:", error);
      addToast('error', t('settings.profile.idCard.uploadError', 'Erreur lors du téléversement du document d\\\'identité'));
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('settings.profile.title')}</h2>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" icon={Edit3}>
              {t('settings.profile.editButton')}
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.profile.form.nameLabel')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="focus:ring-primary focus:border-primary dark:focus:ring-primary-light dark:focus:border-primary-light block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.profile.form.emailLabel')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="focus:ring-primary focus:border-primary dark:focus:ring-primary-light dark:focus:border-primary-light block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.profile.form.phoneLabel')}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  className="focus:ring-primary focus:border-primary dark:focus:ring-primary-light dark:focus:border-primary-light block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder={t('settings.profile.form.phonePlaceholder')}
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {t('common.saveChanges')}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Display Name, Email, Phone */}
            <InfoItem icon={User} label={t('settings.profile.view.nameLabel')} value={user.name} />
            <InfoItem icon={Mail} label={t('settings.profile.view.emailLabel')} value={user.email} />
            <InfoItem icon={Phone} label={t('settings.profile.view.phoneLabel')} value={user.phoneNumber || t('settings.profile.view.phoneNotDefined')} />
          </div>
        )}
      </div>

      {/* KYC Section */}
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-1 text-gray-900 dark:text-gray-100">{t('settings.profile.kyc.title')}</h3>
        
        {/* ID Card */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">{t('settings.profile.kyc.idCardLabel')}</h4>
          {user && user.kyc && (
            <KycItemStatus 
              item={user.kyc.idCard}
              itemType='idCard'
              notUploadedText={t('settings.profile.kyc.idCardNotUploaded')}
              uploadedText={t('settings.profile.kyc.idCardUploaded')}
              verifiedText={t('settings.profile.kyc.idCardVerified')}
              pendingText={t('settings.profile.kyc.idCardPending')}
              verifiedDate={user.kyc.idCard?.expiryDate} 
            />
          )}
          <input type="file" id="idCardUpload" className="hidden" onChange={handleIdCardUpload} accept=".jpg,.jpeg,.png,.pdf" />
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={() => document.getElementById('idCardUpload')?.click()}
          >
            {user?.kyc?.idCard?.fileUrl ? t('settings.profile.kyc.updateIdCardButton') : t('settings.profile.kyc.uploadIdCardButton')}
          </Button>
        </div>

        {/* Signature - Placeholder for future implementation if SignaturePad becomes available */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">{t('settings.profile.kyc.signatureLabel')}</h4>
          {user && user.kyc && (
            <KycItemStatus 
              item={user.kyc.signature}
              itemType='signature'
              notUploadedText={t('settings.profile.kyc.signatureNotSaved')}
              uploadedText={t('settings.profile.kyc.signatureSaved')} // New key for generic "Signature Saved"
              verifiedText={t('settings.profile.kyc.signatureVerified')} // This might not be used if signature doesn't have explicit verification step
              pendingText={t('settings.profile.kyc.signaturePending')} // This might not be used 
              verifiedDate={user.kyc.signature?.timestamp}
            />
          )}
           {/* Commenting out SignaturePad related UI until component is available
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => setIsSignatureModalOpen(true)}
          >
            {user.kyc?.signature?.fileUrl ? t('settings.profile.kyc.updateSignatureButton') : t('settings.profile.kyc.signButton')}
          </Button>
          */}
        </div>
      </div>

      {/* {isSignatureModalOpen && (
        <SignaturePad
          onSave={handleSignatureSave}
          onClose={() => setIsSignatureModalOpen(false)}
        />
      )} */}
    </div>
  );
}

// Removed original renderKycItemStatus function as it's replaced by KycItemStatus component