import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useLanguage() {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(async (language: string) => {
    await i18n.changeLanguage(language);
    localStorage.setItem('preferredLanguage', language);
  }, [i18n]);

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    isLoading: i18n.isInitialized === false
  };
}