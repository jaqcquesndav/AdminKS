import React from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Mail, Chrome } from 'lucide-react';

interface SocialAuthProps {
  onGoogleAuth: () => Promise<void>;
  onMicrosoftAuth: () => Promise<void>;
  onGithubAuth: () => Promise<void>;
}

export function SocialAuth({ onGoogleAuth, onMicrosoftAuth, onGithubAuth }: SocialAuthProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-6 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            {t('auth.social.or')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={onGoogleAuth}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Chrome className="w-5 h-5 mr-2 text-red-500" />
          {t('auth.social.google')}
        </button>

        <button
          onClick={onMicrosoftAuth}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Mail className="w-5 h-5 mr-2 text-blue-500" />
          {t('auth.social.microsoft')}
        </button>

        <button
          onClick={onGithubAuth}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Github className="w-5 h-5 mr-2" />
          {t('auth.social.github')}
        </button>
      </div>
    </div>
  );
}