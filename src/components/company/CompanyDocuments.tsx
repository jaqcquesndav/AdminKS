import React from 'react';
import { useTranslation } from 'react-i18next';
import { File, CheckCircle2, XCircle } from 'lucide-react';
import type { Document } from '../../types/document';

interface CompanyDocumentsProps {
  documents: Document[];
}

export function CompanyDocuments({ documents }: CompanyDocumentsProps) {
  const { t } = useTranslation();

  const getDocumentByType = (type: Document['type']) => {
    return documents.find(doc => doc.type === type);
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className={`w-5 h-5 ${getStatusColor(status)}`} />;
      case 'rejected':
        return <XCircle className={`w-5 h-5 ${getStatusColor(status)}`} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">
        {t('company.registration.documents.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(['rccm', 'nationalId', 'taxNumber'] as const).map((type) => {
          const document = getDocumentByType(type);
          
          return (
            <div key={type} className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    {t(`company.registration.documents.${type}.title`)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t(`company.registration.documents.${type}.description`)}
                  </p>
                </div>

                {document ? (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <File className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {document.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(document.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusIcon(document.status)}
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">
                      Document non disponible
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}