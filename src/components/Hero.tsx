import React from 'react';
import { ArrowDown, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { CONTACT_INFO, COMMON_STYLES, BUSINESS_HOURS } from '../constants';
import { scrollToSection, formatPhoneLink, cn } from '../utils';
import OptimizedImage from './OptimizedImage';

const Hero: React.FC = () => {
  const { t, fontClass } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src="https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt="Thai Massage Background"
          className="w-full h-full"
          loading="eager"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className={cn('text-4xl md:text-6xl lg:text-7xl font-bold mb-6', fontClass)}>
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 font-light opacity-90">
            {t('hero.subtitle')}
          </p>
          
          {/* CTA Button - Phone Only */}
          <div className="flex justify-center mb-12">
            <a
              href={formatPhoneLink(CONTACT_INFO.phone)}
              className={cn(COMMON_STYLES.button.primary, 'flex items-center space-x-3 px-12 py-6 text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg')}
            >
              <Phone className="w-6 h-6" />
              <span>{t('hero.cta')}</span>
            </a>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{t('location.directions')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>•</span>
              <span>{t('location.parking')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>•</span>
              <span>{BUSINESS_HOURS.weekdays}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection('services')}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce hover:text-primary transition-colors"
      >
        <ArrowDown className="w-8 h-8" />
      </button>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float hidden lg:block"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-accent/30 rounded-full animate-float hidden lg:block" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-20 w-12 h-12 bg-thai-gold/20 rounded-full animate-float hidden lg:block" style={{ animationDelay: '2s' }}></div>
    </section>
  );
};

export default Hero;