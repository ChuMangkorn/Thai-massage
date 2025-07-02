import React from 'react';
import { Phone, MapPin, Facebook, Instagram, ExternalLink } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { CONTACT_INFO, COMMON_STYLES, BUSINESS_HOURS } from '../constants';
import { scrollToSection, formatPhoneLink, cn } from '../utils';

const Footer: React.FC = () => {
  const { t, fontClass, currentLanguage } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-text to-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <h3 className={cn('text-xl font-bold', fontClass)}>
                  {t('hero.title')}
                </h3>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              {t('about.description')}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary/20 hover:bg-primary/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary/20 hover:bg-primary/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-primary">{t('location.title')}</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-300">{t('location.address')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={formatPhoneLink(CONTACT_INFO.phone)} className="text-gray-300 hover:text-primary transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-primary">{t('location.hours.title')}</h4>
            <div className="space-y-4">
              <div className="text-gray-300">
                <div className="text-xl font-bold text-primary mb-2">{BUSINESS_HOURS.weekdays}</div>
                <p className="mb-2">{t('location.hours.closed')}</p>
                <button
                  onClick={() => window.open('https://maps.app.goo.gl/va4TqjVnkE8SG8eJ6', '_blank')}
                  className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors underline"
                >
                  <span>{t('location.googleMaps')}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  {t('location.confirmBeforeVisit')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-300 hover:text-primary transition-colors"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-gray-300 hover:text-primary transition-colors"
            >
              {t('nav.services')}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-primary transition-colors"
            >
              {t('nav.about')}
            </button>
            <button
              onClick={() => scrollToSection('location')}
              className="text-gray-300 hover:text-primary transition-colors"
            >
              {t('nav.location')}
            </button>
            <a
              href={formatPhoneLink(CONTACT_INFO.phone)}
              className="text-gray-300 hover:text-primary transition-colors flex items-center space-x-1"
            >
              <Phone className="w-4 h-4" />
              <span>{t('nav.contact')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 text-sm">
              <a 
                href={`/privacy${currentLanguage === 'ja' ? '' : `-${currentLanguage}`}.html`} 
                className="text-gray-400 hover:text-primary transition-colors"
              >
                {t('footer.privacy')}
              </a>
              <a 
                href={`/terms${currentLanguage === 'ja' ? '' : `-${currentLanguage}`}.html`} 
                className="text-gray-400 hover:text-primary transition-colors"
              >
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Contact Button */}
      <a
        href={formatPhoneLink(CONTACT_INFO.phone)}
        className={cn(COMMON_STYLES.button.primary, 'fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 z-50')}
      >
        <Phone className="w-6 h-6" />
      </a>
    </footer>
  );
};

export default Footer;