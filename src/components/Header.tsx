import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MapPin, Clock } from '../icons';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../hooks/useLanguage';
import { CONTACT_INFO, COMMON_STYLES } from '../constants';
import { scrollToSection, formatPhoneLink, cn } from '../utils';
import logo from '/src/assets/images/logo.png';

const Header: React.FC = () => {
  const { t, currentLanguage, fontClass } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Top Info Bar */}
      <div className="bg-secondary text-white py-2 px-4 text-sm z-[9999] relative">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>{CONTACT_INFO.phone}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{t('location.address')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{t('location.hours.weekdays')}</span>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Header */}
      <header className={`fixed top-0 left-0 right-0 z-[9998] transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white/95 backdrop-blur-sm py-4'
      }`} style={{ top: isScrolled ? '0' : '34px' }}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="Leelawadee Thai Massage Logo" 
                  className="w-20 h-20 object-contain select-none pointer-events-none"
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
              <div>
                <h1 className={cn('text-xl font-bold text-text', fontClass)}>
                  {t('hero.title')}
                </h1>
                
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => handleScrollToSection('home')}
                className="text-text hover:text-primary transition-colors font-medium"
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => handleScrollToSection('services')}
                className="text-text hover:text-primary transition-colors font-medium"
              >
                {t('nav.services')}
              </button>
              <button
                onClick={() => handleScrollToSection('about')}
                className="text-text hover:text-primary transition-colors font-medium"
              >
                {t('nav.about')}
              </button>
              <button
                onClick={() => handleScrollToSection('location')}
                className="text-text hover:text-primary transition-colors font-medium"
              >
                {t('nav.location')}
              </button>
              <a
                href={formatPhoneLink(CONTACT_INFO.phone)}
                className={cn(COMMON_STYLES.button.primary, 'z-10 relative flex items-center space-x-2')}
              >
                <Phone className="w-4 h-4" />
                <span>{t('nav.contact')}</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-text hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={() => handleScrollToSection('home')}
                  className="text-left text-text hover:text-primary transition-colors font-medium py-2"
                >
                  {t('nav.home')}
                </button>
                <button
                  onClick={() => handleScrollToSection('services')}
                  className="text-left text-text hover:text-primary transition-colors font-medium py-2"
                >
                  {t('nav.services')}
                </button>
                <button
                  onClick={() => handleScrollToSection('about')}
                  className="text-left text-text hover:text-primary transition-colors font-medium py-2"
                >
                  {t('nav.about')}
                </button>
                <button
                  onClick={() => handleScrollToSection('location')}
                  className="text-left text-text hover:text-primary transition-colors font-medium py-2"
                >
                  {t('nav.location')}
                </button>
                <a
                  href={formatPhoneLink(CONTACT_INFO.phone)}
                  className={cn(COMMON_STYLES.button.primary, 'text-center mt-4 flex items-center justify-center space-x-2 py-3')}
                >
                  <Phone className="w-4 h-4" />
                  <span>{t('nav.contact')}</span>
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;