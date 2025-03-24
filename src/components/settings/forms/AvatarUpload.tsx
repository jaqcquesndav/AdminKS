import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Upload } from 'lucide-react';
import { Button } from '../../common/Button';
import { AvatarEditor } from './AvatarEditor';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (file: File) => Promise<void>;
}

export function AvatarUpload({ currentAvatar, onAvatarChange }: AvatarUploadProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsEditorOpen(true);
    }
  };

  const handleEditorSave = async (editedFile: File) => {
    await onAvatarChange(editedFile);
    setIsEditorOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Camera className="w-8 h-8" />
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full hover:bg-primary-light"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            {t('settings.profile.avatar.change')}
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('settings.profile.avatar.requirements')}
          </p>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {isEditorOpen && selectedFile && (
        <AvatarEditor
          file={selectedFile}
          onSave={handleEditorSave}
          onCancel={() => {
            setIsEditorOpen(false);
            setSelectedFile(null);
          }}
        />
      )}
    </div>
  );
}