import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const loadTranslations = async (language: string) => {
  try {
    const translations = await import(`./locales/${language}.json`);
    return translations.default;
  } catch {
    console.warn(`Failed to load translations for ${language}`);
    return {};
  }
};

import jaTranslations from './locales/ja.json';  
import thTranslations from './locales/th.json';
import enTranslations from './locales/en.json';

// Initialize with preloaded resources for production reliability
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: jaTranslations },
      th: { translation: thTranslations },
      en: { translation: enTranslations }
    },
    lng: 'ja', // Force default to Japanese
    fallbackLng: 'ja',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Override detection to force Japanese by default
      order: ['localStorage', 'sessionStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      caches: ['localStorage', 'sessionStorage']
    }
  });

// Export function to dynamically load language resources
export const loadLanguage = async (language: string) => {
  if (i18n.hasResourceBundle(language, 'translation')) {
    return; // Already loaded
  }
  
  const translations = await loadTranslations(language);
  i18n.addResourceBundle(language, 'translation', translations);
};

export default i18n;