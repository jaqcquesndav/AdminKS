import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface AvatarEditorProps {
  file: File;
  onSave: (file: File) => void;
  onCancel: () => void;
}

export function AvatarEditor({ file, onSave, onCancel }: AvatarEditorProps) {
  const { t } = useTranslation();
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    aspect: 1,
    x: 5,
    y: 5,
  });
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleSave = async () => {
    if (!imgRef.current) return;

    setIsLoading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = 400;
      canvas.height = 400;

      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        400,
        400
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          onSave(croppedFile);
        }
      }, 'image/jpeg', 0.95);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={t('settings.profile.avatar.editor.title')}
    >
      <div className="p-6 space-y-6">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          aspect={1}
          circularCrop
        >
          <img
            ref={imgRef}
            src={URL.createObjectURL(file)}
            alt="Crop preview"
            className="max-h-[400px] w-auto"
          />
        </ReactCrop>

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            isLoading={isLoading}
          >
            {t('common.save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}