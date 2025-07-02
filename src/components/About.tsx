import React from 'react';
import { Award, Users, Sparkles } from '../icons';
import { useLanguage } from '../hooks/useLanguage';
import { COMMON_STYLES } from '../constants';
import { cn } from '../utils';
import OptimizedImage from './OptimizedImage';
import AboutImage from '../assets/images/about.webp';

const About: React.FC = () => {
  const { t, fontClass } = useLanguage();

  const features = [
    {
      icon: <Award className="w-12 h-12" />,
      title: t('about.features.authentic.title'),
      description: t('about.features.authentic.description'),
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: t('about.features.experience.title'),
      description: t('about.features.experience.description'),
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: t('about.features.environment.title'),
      description: t('about.features.environment.description'),
    },
  ];

  // Get language-specific statistics
  const statistics = [
    { 
      value: '2,500+', 
      label: t('about.statistics.history')
    },
    { 
      value: '10+', 
      label: t('about.statistics.experience')
    },
    { 
      value: '1,000+', 
      label: t('about.statistics.customers')
    },
    { 
      value: '100%', 
      label: t('about.statistics.naturalOils')
    }
  ];

  // Get language-specific testimonial
  const testimonial = {
    text: t('about.testimonial.text'),
    author: t('about.testimonial.author')
  };

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={cn(COMMON_STYLES.sectionTitle, fontClass)}>
            {t('about.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Content */}
          <div className="space-y-8">
            <div className="animate-fade-in">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('about.description')}
              </p>
              
              {/* Statistics */}
              <div className="grid grid-cols-2 gap-6">
                {statistics.map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <OptimizedImage
                src={AboutImage}
                alt="Thai Massage Interior"
                className="w-full h-96 transition-transform duration-700 hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-8 bg-gradient-to-br from-accent to-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                <div className="text-primary">{feature.icon}</div>
              </div>
              <h3 className={cn('text-xl font-bold text-text mb-4', fontClass)}>
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-20 bg-gradient-to-r from-primary/5 via-white to-secondary/5 p-8 md:p-12 rounded-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-4xl text-primary mb-6">"</div>
            <blockquote className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed mb-8 italic">
              {testimonial.text}
            </blockquote>
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Award key={i} className="w-6 h-6 text-primary fill-current" />
              ))}
            </div>
            <cite className="text-gray-600 font-medium">{testimonial.author}</cite>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;