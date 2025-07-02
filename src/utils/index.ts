import { FONT_CLASSES, SupportedLanguage } from '../constants';

/**
 * Get font class based on current language
 */
export const getFontClass = (language: string): string => {
  const lang = language as SupportedLanguage;
  return FONT_CLASSES[lang] || FONT_CLASSES.en;
};

/**
 * Scroll to section with smooth behavior
 */
export const scrollToSection = (sectionId: string): void => {
  try {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate header height for offset
      const header = document.querySelector('header') as HTMLElement;
      const headerHeight = header ? header.offsetHeight : 0;
      const topInfoBar = document.querySelector('.bg-secondary') as HTMLElement;
      const topInfoHeight = topInfoBar ? topInfoBar.offsetHeight : 0;
      const totalOffset = headerHeight + topInfoHeight;
      
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        const elementPosition = element.offsetTop - totalOffset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      });
    }
  } catch (error) {
    // Fallback scroll without offset
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

/**
 * Format phone number for tel: link
 */
export const formatPhoneLink = (phoneNumber: string): string => {
  return `tel:${phoneNumber}`;
};

/**
 * Get language-specific text with fallback
 */
export const getLanguageText = (
  language: string,
  texts: { [key: string]: string },
  fallback: string = ''
): string => {
  return texts[language] || texts.en || texts.ja || fallback;
};

/**
 * Combine CSS classes
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};