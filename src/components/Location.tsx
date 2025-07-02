import React from 'react';
import { MapPin, Phone, Clock, Car, Train, ExternalLink } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { CONTACT_INFO, COMMON_STYLES, BUSINESS_HOURS } from '../constants';
import { formatPhoneLink, cn } from '../utils';

const Location: React.FC = () => {
  const { t, fontClass } = useLanguage();

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('location.addressTitle'),
      content: t('location.address'),
      action: () => window.open('https://maps.app.goo.gl/va4TqjVnkE8SG8eJ6', '_blank'),
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('location.phoneTitle'),
      content: CONTACT_INFO.phone,
      action: () => window.open(formatPhoneLink(CONTACT_INFO.phone)),
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('location.hoursTitle'),
      content: (
        <div className="space-y-2">
          <div className="text-lg font-semibold text-primary">{BUSINESS_HOURS.weekdays}</div>
          <div className="text-sm text-gray-500">
            {t('location.checkGoogleMaps')}
            <button
              onClick={() => window.open('https://maps.app.goo.gl/va4TqjVnkE8SG8eJ6', '_blank')}
              className="text-primary hover:text-primary/80 font-medium ml-1 underline"
            >
              {t('location.googleMaps')}
            </button>
          </div>
        </div>
      ),
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: t('location.parkingTitle'),
      content: t('location.parking'),
    },
    {
      icon: <Train className="w-6 h-6" />,
      title: t('location.directionsTitle'),
      content: t('location.directions'),
    },
  ];

  return (
    <section id="location" className="py-20 bg-gradient-to-b from-accent/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={cn(COMMON_STYLES.sectionTitle, fontClass)}>
            {t('location.title')}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  info.action ? 'cursor-pointer hover:scale-105' : ''
                }`}
                onClick={info.action}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <div className="text-primary">{info.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-text mb-2">{info.title}</h3>
                    <div className="text-gray-600">
                      {typeof info.content === 'string' ? (
                        <span className={info.action ? 'hover:text-primary transition-colors' : ''}>
                          {info.content}
                        </span>
                      ) : (
                        info.content
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Phone Booking CTA */}
            <div className="mt-8">
              <a
                href={formatPhoneLink(CONTACT_INFO.phone)}
                className={cn(COMMON_STYLES.button.primary, 'w-full flex items-center justify-center space-x-2 p-6 rounded-xl font-semibold text-lg')}
              >
                <Phone className="w-6 h-6" />
                <span>{t('location.phoneBooking')}</span>
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="relative">
            <div className="bg-gray-200 rounded-2xl overflow-hidden shadow-xl h-96 lg:h-full">
              {/* Placeholder for Google Maps */}
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                <div className="text-center text-gray-600">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-semibold mb-2">Google Maps</p>
                  <p className="text-sm mb-4">
                    {t('location.address')}
                  </p>
                  <button
                    onClick={() => window.open('https://maps.app.goo.gl/va4TqjVnkE8SG8eJ6', '_blank')}
                    className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <span>{t('location.openMap')}</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Floating Info Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <div>
                      <div className="font-semibold text-text">
                        {t('hero.title')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {BUSINESS_HOURS.weekdays} | {t('location.directions')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;