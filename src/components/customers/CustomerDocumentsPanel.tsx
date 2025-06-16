import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import type { CustomerDocument, DocumentType } from '../../types/customer';

interface CustomerDocumentsPanelProps {
  customerType: 'pme' | 'financial';
  documents?: CustomerDocument[];
  onDocumentUpload: (document: Omit<CustomerDocument, 'id' | 'uploadedAt' | 'uploadedBy' | 'status'>) => Promise<void>;
  onDocumentApprove: (documentId: string) => Promise<void>;
  onDocumentReject: (documentId: string, note: string) => Promise<void>;
  isAdmin?: boolean;
}

const requiredDocumentsByType: Record<'pme' | 'financial', DocumentType[]> = {
  pme: ['rccm', 'id_nat', 'nif', 'cnss', 'inpp', 'patente'],
  financial: ['agrement'],
};

export function CustomerDocumentsPanel({
  customerType,
  documents = [],
  onDocumentUpload,
  onDocumentApprove,
  onDocumentReject,
  isAdmin = false,
}: CustomerDocumentsPanelProps) {
  const { t } = useTranslation();
  const { showToast } = useToastContext();
  const [uploading, setUploading] = useState<DocumentType | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [documentToReject, setDocumentToReject] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requiredDocuments = requiredDocumentsByType[customerType];
  
  const getDocumentLabel = (type: DocumentType): string => {
    switch (type) {
      case 'rccm': return t('customers.documents.types.rccm', 'Registre du Commerce et du Crédit Mobilier');
      case 'id_nat': return t('customers.documents.types.id_nat', 'Identification Nationale');
      case 'nif': return t('customers.documents.types.nif', 'Numéro d\\\'Identification Fiscale');
      case 'cnss': return t('customers.documents.types.cnss', 'Caisse Nationale de Sécurité Sociale');
      case 'inpp': return t('customers.documents.types.inpp', 'Institut National de Préparation Professionnelle');
      case 'patente': return t('customers.documents.types.patente', 'Patente');
      case 'agrement': return t('customers.documents.types.agrement', 'Document d\\\'Agrément');
      case 'contract': return t('customers.documents.types.contract', 'Contrat');
      default: return '';
    }
  };

  const handleFileChange = async (type: DocumentType, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    setUploading(type);
    
    try {
      // Simulating file upload
      const fileUrl = URL.createObjectURL(file);
      
      await onDocumentUpload({
        type,
        fileName: file.name,
        fileUrl,
      });
      
      showToast('success', t('customers.documents.toast.uploadSuccess', 'Document téléchargé avec succès'));
    } catch {
      // Catch error without naming it to avoid lint errors
      showToast('error', t('customers.documents.toast.uploadError', 'Erreur lors du téléchargement du document'));
    } finally {
      setUploading(null);
    }
  };

  const renderDocumentStatus = (type: DocumentType) => {
    const document = documents.find(doc => doc.type === type);
    
    if (!document) {
      return (
        <div className="flex items-center">
          <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">
            <Upload size={16} />
            <span>{t('customers.documents.actions.add', 'Ajouter')}</span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(type, e)}
              disabled={!!uploading}
            />
          </label>
        </div>
      );
    }

    switch (document.status) {
      case 'approved':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={16} />
            <span>{t('customers.documents.status.approved', 'Approuvé')}</span>
            <a href={document.fileUrl} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 hover:underline">
              {t('customers.documents.actions.view', 'Voir le document')}
            </a>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle size={16} />
              <span>{t('customers.documents.status.rejected', 'Rejeté')}</span>
              <a href={document.fileUrl} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 hover:underline">
                {t('customers.documents.actions.view', 'Voir le document')}
              </a>
            </div>
            {document.reviewNote && (
              <div className="text-sm text-gray-600 mt-1">
                {t('customers.documents.rejectionReason', 'Raison')}: {document.reviewNote}
              </div>
            )}
            <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 mt-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 w-fit">
              <Upload size={16} />
              <span>{t('customers.documents.actions.resubmit', 'Renvoyer')}</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(type, e)}
                disabled={!!uploading}
              />
            </label>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-orange-600">
              <AlertTriangle size={16} />
              <span>{t('customers.documents.status.pendingReview', 'En attente de vérification')}</span>
              <a href={document.fileUrl} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 hover:underline">
                {t('customers.documents.actions.view', 'Voir le document')}
              </a>
            </div>
            
            {isAdmin && (
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onDocumentApprove(document.id!)}
                  className="p-1 rounded text-green-600 hover:bg-green-50"
                  title={t('customers.documents.actions.approve', 'Approuver')}
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  onClick={() => setDocumentToReject(document.id!)}
                  className="p-1 rounded text-red-600 hover:bg-red-50"
                  title={t('customers.documents.actions.reject', 'Rejeter')}
                >
                  <XCircle size={16} />
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('customers.documents.title', 'Documents légaux')}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {customerType === 'pme' 
            ? t('customers.documents.pme.description', 'Documents requis pour valider le compte de votre entreprise')
            : t('customers.documents.financial.description', 'Document d\\\'agrément requis pour valider votre institution financière')}
        </p>
      </div>

      <div className="px-6 py-4">
        <div className="space-y-4">
          {requiredDocuments.map((type) => (
            <div key={type} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{getDocumentLabel(type)}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {type === 'agrement' 
                    ? t('customers.documents.types.agrementDescription', 'Document officiel certifiant votre institution financière')
                    : t('customers.documents.types.genericDescription', 'Document officiel requis pour la validation')}
                </p>
              </div>
              <div>
                {uploading === type ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="animate-spin" size={16} />
                    <span>{t('customers.documents.status.uploading', 'Téléchargement...')}</span>
                  </div>
                ) : renderDocumentStatus(type)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {documentToReject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('customers.documents.modals.rejectDocument.title', 'Rejeter le document')}
            </h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {t('customers.documents.modals.rejectDocument.description', 'Veuillez fournir une raison pour le rejet.')}
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-4 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder={t('customers.documents.modals.rejectDocument.reasonPlaceholder', 'Raison du rejet...')}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setDocumentToReject(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={async () => {
                  if (!rejectReason) {
                    showToast('error', t('customers.documents.toast.rejectionReasonRequired', 'La raison du rejet est requise.'));
                    return;
                  }
                  setLoading(true);
                  try {
                    await onDocumentReject(documentToReject, rejectReason);
                    showToast('success', t('customers.documents.toast.rejectSuccess', 'Document rejeté avec succès.'));
                    setDocumentToReject(null);
                    setRejectReason('');
                  } catch {
                    showToast('error', t('customers.documents.toast.rejectError', 'Erreur lors du rejet du document.'));
                  } finally {
                    setLoading(false);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                disabled={loading}
              >
                {loading ? t('common.loading', 'Chargement...') : t('customers.documents.actions.reject', 'Rejeter')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}