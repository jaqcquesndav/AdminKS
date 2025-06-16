import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import Backend from 'i18next-http-backend'; // For loading translations - Removed
import LanguageDetector from 'i18next-browser-languagedetector'; // For detecting browser language

// Import your translation files
import frTranslations from './fr'; // Adjusted path
import enTranslations from './en'; // Adjusted path

i18n
  // .use(Backend) // Removed Backend
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      fr: {
        translation: frTranslations,
      },
    },
    // lng: 'fr', // Remove this to let LanguageDetector work or set a default
    fallbackLng: 'en', // Fallback language if detected language is not available
    debug: process.env.NODE_ENV === 'development', // Enable debug mode in development

    interpolation: {
      escapeValue: false, // React already safes from xss
    },

    // Language detector options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'], // Cache the language in localStorage
    },
  });

export default i18n;