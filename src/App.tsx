import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import LazySection from './components/LazySection';
import { LazyServices, LazyAbout, LazyLocation } from './components/LazyComponents';
import SEO from './components/SEO';
import InstallPrompt from './components/InstallPrompt';
import { useLanguage } from './hooks/useLanguage';
import { usePWA } from './hooks/usePWA';
import './i18n/i18n';

function App() {
  const { fontClass, t } = useLanguage();
  const { isOffline, updateAvailable } = usePWA();

  React.useEffect(() => {
    document.body.className = fontClass;
  }, [fontClass]);

  React.useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const { trackPageView } = await import('./utils/analytics');
        trackPageView();
      } catch (error) {
        console.warn('Analytics failed to load:', error);
      }
    };
    
    setTimeout(loadAnalytics, 1000);
  }, []);

  return (
    <HelmetProvider>
        <div className="min-h-screen bg-white">
        <SEO 
          title={t('hero.title')}
          description={t('hero.subtitle')}
        />
        
        {/* Offline/Update Banners */}
        {isOffline && (
          <div className="bg-gray-800 text-white text-center py-2 text-sm">
            {t('pwa.offline', 'You are currently offline')}
          </div>
        )}
        
        {updateAvailable && import.meta.env.DEV && (
          <div className="bg-primary text-white text-center py-2 text-sm">
            {t('pwa.updateAvailable', 'App update available')} - 
            <button 
              onClick={() => window.location.reload()}
              className="ml-2 underline hover:no-underline"
            >
              {t('pwa.update', 'Update')}
            </button>
          </div>
        )}
        
        <Header />
        <main>
          <Hero />
          
          <LazySection minHeight="500px">
            <LazyServices />
          </LazySection>
          
          <LazySection minHeight="400px">
            <LazyAbout />
          </LazySection>
          
          <LazySection minHeight="300px">
            <LazyLocation />
          </LazySection>
        </main>
        <Footer />
        
        {/* PWA Install Prompt */}
        <InstallPrompt />
        
        
        </div>
    </HelmetProvider>
  );
}

export default App;