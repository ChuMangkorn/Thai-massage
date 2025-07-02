import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../hooks/useLanguage';
import { CONTACT_INFO } from '../constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'business';
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = '/og-image.jpg',
  url,
  type = 'business',
  structuredData
}) => {
  const { t, currentLanguage } = useLanguage();
  
  const defaultTitle = t('hero.title');
  const defaultDescription = t('hero.subtitle');
  const defaultKeywords = currentLanguage === 'ja' 
    ? 'タイマッサージ,宇都宮,リラクゼーション,マッサージ,タイ古式,アロマオイル,フットマッサージ'
    : currentLanguage === 'th'
    ? 'นวดไทย,อุซึโนะมิยะ,ผ่อนคลาย,นวด,นวดแผนไทย,อโรมาออยล์,นวดเท้า'
    : 'thai massage,utsunomiya,relaxation,massage,traditional thai,aroma oil,foot massage';

  const siteTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const siteDescription = description || defaultDescription;
  const siteKeywords = keywords || defaultKeywords;
  const siteUrl = url || window.location.href;

  // Default structured data for local business
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Thai Massage Leelawadee",
    "alternateName": "タイマッサージ リーラワディー",
    "description": siteDescription,
    "url": "https://leelawadee.com",
    "telephone": CONTACT_INFO.phone,
    "email": CONTACT_INFO.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1-16-9 Shukugo",
      "addressLocality": "Utsunomiya",
      "addressRegion": "Tochigi",
      "postalCode": "321-0945",
      "addressCountry": "JP"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "36.5583",
      "longitude": "139.8836"
    },
    "openingHours": [
      "Mo-Su 13:00-23:00"
    ],
    "priceRange": "¥2,500-¥8,500",
    "servedCuisine": [],
    "serviceType": "Thai Massage",
    "areaServed": {
      "@type": "City",
      "name": "Utsunomiya"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Massage Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Traditional Thai Massage",
            "description": "Traditional Thai stretching and massage therapy"
          },
          "price": "4500-8500",
          "priceCurrency": "JPY"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Aroma Oil Massage",
            "description": "Relaxing massage with natural aromatic oils"
          },
          "price": "4500-8500",
          "priceCurrency": "JPY"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Foot Reflexology",
            "description": "Therapeutic foot massage and reflexology"
          },
          "price": "2500-4500",
          "priceCurrency": "JPY"
        }
      ]
    }
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={siteKeywords} />
      <meta name="author" content="Thai Massage Leelawadee" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content={currentLanguage} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Thai Massage Leelawadee" />
      <meta property="og:locale" content={currentLanguage === 'ja' ? 'ja_JP' : currentLanguage === 'th' ? 'th_TH' : 'en_US'} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#B8860B" />
      <meta name="msapplication-TileColor" content="#B8860B" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Leelawadee" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.pexels.com" />
      
      {/* Optimized Google Fonts - Load only for current language */}
      <link 
        href={
          currentLanguage === 'ja' 
            ? "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap"
            : currentLanguage === 'th'
            ? "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap" 
            : "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
        }
        rel="stylesheet" 
      />
    </Helmet>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default SEO;