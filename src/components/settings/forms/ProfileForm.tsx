import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone } from 'lucide-react';
import { FormInput } from './inputs/FormInput';
import { AvatarUpload } from './AvatarUpload';
import { Button } from '../../common/Button';
import type { AuthUser } from '../../../types/auth';

interface ProfileFormProps {
  user: AuthUser;
  onSubmit: (data: Partial<AuthUser>) => Promise<void>;
  isLoading?: boolean;
}

export function ProfileForm({ user, onSubmit, isLoading }: ProfileFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    avatar: user.avatar,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('settings.profile.validation.nameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('settings.profile.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('settings.profile.validation.emailInvalid');
    }
    
    if (formData.phone && !/^\+?[\d\s-]{8,}$/.test(formData.phone)) {
      newErrors.phone = t('settings.profile.validation.phoneInvalid');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  const handleAvatarChange = async (file: File) => {
    const avatarUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, avatar: avatarUrl }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AvatarUpload
        currentAvatar={formData.avatar}
        onAvatarChange={handleAvatarChange}
      />

      <div className="grid grid-cols-1 gap-6">
        <FormInput
          label={t('settings.profile.name')}
          value={formData.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          error={errors.name}
        />

        <FormInput
          label={t('settings.profile.email')}
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          error={errors.email}
          icon={Mail}
          type="email"
        />

        <FormInput
          label={t('settings.profile.phone')}
          value={formData.phone}
          onChange={(value) => setFormData({ ...formData, phone: value })}
          error={errors.phone}
          icon={Phone}
          type="tel"
          placeholder="+243 999 999 999"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          isLoading={isLoading}
        >
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
}