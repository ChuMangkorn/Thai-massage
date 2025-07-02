import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { loadLanguage } from '../i18n/i18n';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const handleChangeLanguage = async (languageCode: string) => {
    setIsLoading(true);
    try {
      // Load language resources dynamically before changing language
      await loadLanguage(languageCode);
      changeLanguage(languageCode);
      setIsOpen(false);
    } catch (error) {
      console.error(`Failed to load language ${languageCode}:`, error);
      // Still attempt to change language even if loading fails
      changeLanguage(languageCode);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-50">
      <button 
        onClick={toggleDropdown}
        disabled={isLoading}
        className="flex items-center space-x-2 text-white hover:text-accent transition-colors bg-white/10 px-3 py-1 rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <Globe className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {getCurrentLanguage().flag} {getCurrentLanguage().name}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${isLoading ? 'opacity-50' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 min-w-[140px] z-50 ring-1 ring-black/5">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleChangeLanguage(language.code)}
                disabled={isLoading}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentLanguage === language.code ? 'bg-primary/10 text-primary' : 'text-gray-700'
                }`}
              >
                <span>{language.flag}</span>
                <span className="text-sm">{language.name}</span>
                {isLoading && currentLanguage !== language.code && (
                  <div className="ml-auto w-3 h-3 border border-gray-300 border-t-primary rounded-full animate-spin"></div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;