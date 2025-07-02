import { useTranslation } from 'react-i18next';
import { getFontClass } from '../utils';
import { useCallback, useMemo } from 'react';

/**
 * Custom hook for language-related functionality
 */
export const useLanguage = () => {
  const { t, i18n } = useTranslation();
  
  const currentLanguage = i18n.language;
  
  // Memoize font class calculation to avoid recalculation on every render
  const fontClass = useMemo(() => getFontClass(currentLanguage), [currentLanguage]);
  
  // Memoize changeLanguage function to prevent child re-renders
  const changeLanguage = useCallback((language: string) => {
    i18n.changeLanguage(language);
  }, [i18n]);
  
  return {
    t,
    i18n,
    currentLanguage,
    fontClass,
    changeLanguage
  };
};