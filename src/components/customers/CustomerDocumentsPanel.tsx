import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, FilePlus, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import type { Customer, CustomerDocument, DocumentType, DocumentStatus } from '../../types/customer';

interface CustomerDocumentsPanelProps {
  customerId: string;
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
  customerId,
  customerType,
  documents = [],
  onDocumentUpload,
  onDocumentApprove,
  onDocumentReject,
  isAdmin = false,
}: CustomerDocumentsPanelProps) {
  const { t } = useTranslation();
  const { showToast } = useToastContext();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<DocumentType | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [documentToReject, setDocumentToReject] = useState<string | null>(null);

  const requiredDocuments = requiredDocumentsByType[customerType];
  
  const documentLabels: Record<DocumentType, string> = {
    rccm: 'Registre du Commerce et du Crédit Mobilier',
    id_nat: 'Identification Nationale',
    nif: 'Numéro d\'Identification Fiscale',
    cnss: 'Caisse Nationale de Sécurité Sociale',
    inpp: 'Institut National de Préparation Professionnelle',
    patente: 'Patente',
    agrement: 'Document d\'Agrément',
  };

  const handleFileChange = async (type: DocumentType, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    setUploading(type);
    
    try {
      // Normalement on upload le fichier via une API, ici on simule
      // Avec un service comme Cloudinary en production
      const fileUrl = URL.createObjectURL(file);
      
      await onDocumentUpload({
        type,
        fileName: file.name,
        fileUrl,
      });
      
      showToast('success', 'Document téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement du document:', error);
      showToast('error', 'Erreur lors du téléchargement du document');
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
            <span>Ajouter</span>
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
            <span>Approuvé</span>
            <a href={document.fileUrl} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 hover:underline">
              Voir le document
            </a>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-red-600">
              <XCircle size={16} />
              <span>Rejeté</span>
              <a href={document.fileUrl} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 hover:underline">
                Voir le document
              </a>
            </div>
            {document.reviewNote && (
              <div className="text-sm text-gray-600 mt-1">
                Raison: {document.reviewNote}
              </div>
            )}
            <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 mt-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 w-fit">
              <Upload size={16} />
              <span>Renvoyer</span>
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
              <span>En attente de vérification</span>
              <a href={document.fileUrl} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 hover:underline">
                Voir le document
              </a>
            </div>
            
            {isAdmin && (
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onDocumentApprove(document.id!)}
                  className="p-1 rounded text-green-600 hover:bg-green-50"
                  title="Approuver"
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  onClick={() => setDocumentToReject(document.id!)}
                  className="p-1 rounded text-red-600 hover:bg-red-50"
                  title="Rejeter"
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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {t('customers.documents.title', 'Documents légaux')}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {customerType === 'pme' 
            ? t('customers.documents.pme.description', 'Documents requis pour valider le compte de votre entreprise')
            : t('customers.documents.financial.description', 'Document d\'agrément requis pour valider votre institution financière')}
        </p>
      </div>

      <div className="px-6 py-4">
        <div className="space-y-4">
          {requiredDocuments.map((type) => (
            <div key={type} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <h4 className="font-medium text-gray-900">{documentLabels[type]}</h4>
                <p className="text-sm text-gray-500">
                  {type === 'agrement' 
                    ? 'Document officiel certifiant votre institution financière'
                    : 'Document officiel requis pour la validation'}
                </p>
              </div>
              <div>
                {uploading === type ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Téléchargement...</span>
                  </div>
                ) : (
                  renderDocumentStatus(type)
                )}
              </div>
            </div>
          ))}

          {documentToReject && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">Motif de rejet</h3>
                <textarea
                  className="w-full border border-gray-300 rounded p-2 mb-4"
                  rows={3}
                  placeholder="Expliquez pourquoi ce document est rejeté..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setDocumentToReject(null);
                      setRejectReason('');
                    }}
                    className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      if (!rejectReason.trim()) {
                        showToast('error', 'Veuillez fournir un motif de rejet');
                        return;
                      }
                      
                      try {
                        await onDocumentReject(documentToReject, rejectReason);
                        showToast('success', 'Document rejeté');
                      } catch (error) {
                        console.error('Erreur lors du rejet du document', error);
                        showToast('error', 'Erreur lors du rejet du document');
                      } finally {
                        setDocumentToReject(null);
                        setRejectReason('');
                      }
                    }}
                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                    disabled={!rejectReason.trim()}
                  >
                    Rejeter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}