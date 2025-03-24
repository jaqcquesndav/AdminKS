import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Document } from '../../types/document';

interface DocumentUploadProps {
  type: Document['type'];
  currentDocument?: Document;
  onUpload: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function DocumentUpload({ type, currentDocument, onUpload, onDelete }: DocumentUploadProps) {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation de la taille (max 5MB) et du type de fichier
    if (file.size > 5 * 1024 * 1024) {
      setError(t('documents.errors.fileTooBig'));
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError(t('documents.errors.invalidType'));
      return;
    }

    setIsUploading(true);
    setError(undefined);

    try {
      await onUpload(file);
    } catch (err) {
      setError(t('documents.errors.uploadFailed'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">
            {t(`company.registration.documents.${type}.title`)}
          </h3>
          <p className="text-sm text-gray-500">
            {t(`company.registration.documents.${type}.description`)}
          </p>
        </div>
      </div>

      {currentDocument ? (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <File className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">{currentDocument.fileName}</p>
              <p className="text-xs text-gray-500">
                {new Date(currentDocument.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500">
            <div className="text-center">
              <Upload className="mx-auto w-8 h-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                {t(`company.registration.documents.${type}.upload`)}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}