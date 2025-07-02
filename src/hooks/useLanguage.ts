import { useTranslation } from 'react-i18next';
import { getFontClass } from '../utils';

/**
 * Custom hook for language-related functionality
 */
export const useLanguage = () => {
  const { t, i18n } = useTranslation();
  
  const currentLanguage = i18n.language;
  const fontClass = getFontClass(currentLanguage);
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };
  
  return {
    t,
    i18n,
    currentLanguage,
    fontClass,
    changeLanguage
  };
};