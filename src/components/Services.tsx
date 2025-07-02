import React from 'react';
import { Clock, Star, Heart, Sparkles, Phone, Smile } from '../icons';
import { useLanguage } from '../hooks/useLanguage';
import { CONTACT_INFO, COMMON_STYLES, SERVICE_PRICING } from '../constants';
import { formatPhoneLink, cn } from '../utils';
import OptimizedImage from './OptimizedImage';
import faceImage from '../assets/images/face.webp';
import footImage from '../assets/images/foot.webp';
import thaiMassageImage from '../assets/images/thai-massage.webp';
import oilImage from '../assets/images/oil.webp';

const Services: React.FC = () => {
  const { t, fontClass } = useLanguage();

  const services = [
    {
      icon: <Heart className="w-8 h-8" />,
      name: t('services.traditional.name'),
      description: t('services.traditional.description'),
      image: thaiMassageImage,
      courses: [
        { duration: t('services.traditional.30min'), price: SERVICE_PRICING.traditional['30min'], time: '30分' },
        { duration: t('services.traditional.60min'), price: SERVICE_PRICING.traditional['60min'], time: '60分' },
        { duration: t('services.traditional.90min'), price: SERVICE_PRICING.traditional['90min'], time: '90分' },
        { duration: t('services.traditional.120min'), price: SERVICE_PRICING.traditional['120min'], time: '120分' },
      ],
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      name: t('services.oil.name'),
      description: t('services.oil.description'),
      image: oilImage,
      courses: [
        { duration: t('services.oil.60min'), price: SERVICE_PRICING.oil['60min'], time: '60分' },
        { duration: t('services.oil.90min'), price: SERVICE_PRICING.oil['90min'], time: '90分' },
        { duration: t('services.oil.120min'), price: SERVICE_PRICING.oil['120min'], time: '120分' },
      ],
    },
    {
      icon: <Smile className="w-8 h-8" />,
      name: t('services.face.name'),
      description: t('services.face.description'),
      image: faceImage,
      courses: [
        { duration: t('services.face.60min'), price: SERVICE_PRICING.face['60min'], time: '60分' },
      ],
    },
    {
      icon: <Star className="w-8 h-8" />,
      name: t('services.foot.name'),
      description: t('services.foot.description'),
      image: footImage,
      courses: [
        { duration: t('services.foot.30min'), price: SERVICE_PRICING.foot['30min'], time: '30分' },
        { duration: t('services.foot.60min'), price: SERVICE_PRICING.foot['60min'], time: '60分' },
      ],
    },
  ];

  // Get language-specific CTA text
  const ctaText = {
    button: t('services.cta.button'),
    bookService: t('services.cta.bookService'),
    disclaimer: t('services.cta.disclaimer')
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-accent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={cn(COMMON_STYLES.sectionTitle, fontClass)}>
            {t('services.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('services.subtitle')}
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={cn(COMMON_STYLES.card)}
            >
              {/* Service Image */}
              <div className="relative h-64 overflow-hidden">
                <OptimizedImage
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-primary text-white p-3 rounded-full">
                  {service.icon}
                </div>
              </div>

              {/* Service Content */}
              <div className="p-8">
                <h3 className={cn('text-2xl font-bold text-text mb-3', fontClass)}>
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Pricing */}
                <div className="space-y-4">
                  {service.courses.map((course, courseIndex) => (
                    <div
                      key={courseIndex}
                      className="flex items-center justify-between p-4 bg-accent/50 rounded-lg hover:bg-accent/70 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-medium text-text">{course.duration}</span>
                      </div>
                      <span className="text-2xl font-bold text-primary">{course.price}</span>
                    </div>
                  ))}
                </div>

                {/* Book Button */}
                <a
                  href={formatPhoneLink(CONTACT_INFO.phone)}
                  className={cn(COMMON_STYLES.button.primary, 'w-full mt-6 py-3 font-semibold transform hover:scale-105 duration-200 flex items-center justify-center space-x-2')}
                >
                  <Phone className="w-5 h-5" />
                  <span>{ctaText.bookService}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">{ctaText.disclaimer}</p>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              {t('services.cta.contactTitle')}
            </h3>
            <p className="text-lg opacity-90 mb-6">
              {t('services.cta.contactSubtitle')}
            </p>
            <a
              href={formatPhoneLink(CONTACT_INFO.phone)}
              className={cn(COMMON_STYLES.button.secondary, 'inline-flex items-center space-x-2')}
            >
              <Phone className="w-5 h-5" />
              <span>{ctaText.button}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;