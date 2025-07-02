import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { LazyServices, LazyAbout, LazyLocation } from './components/LazyComponents';
import SEO from './components/SEO';
import InstallPrompt from './components/InstallPrompt';
import { useLanguage } from './hooks/useLanguage';
import { usePWA } from './hooks/usePWA';
import { enableSpeculativeLoading, optimizePaintHolding } from './utils/react19Optimizations';
import { createSilentPerformanceMonitor, silentImagePreload } from './utils/silentPerformance';
import { initializeHTTP2Push } from './utils/http2Push';
import { injectCriticalCSS } from './utils/criticalCSS';
import { initializePerformanceOptimizations2025 } from './utils/performanceOptimizations2025';
import './i18n/i18n';

function App() {
  const { fontClass, t } = useLanguage();
  const { isOffline, updateAvailable } = usePWA();

  React.useEffect(() => {
    document.body.className = fontClass;
  }, [fontClass]);

  React.useEffect(() => {
    // 🚀 2025 Ultra-Fast Performance Optimizations
    
    // Preload the LCP image with high priority
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = '/src/assets/images/thai-massage.webp'; // Adjust if format changes
    preloadLink.setAttribute('fetchpriority', 'high');
    document.head.appendChild(preloadLink);

    // ⚡ Critical CSS injection for instant first paint
    injectCriticalCSS();
    
    // 🚀 Zero-error performance optimization for 2025
    
    // ⚡ Completely silent performance optimization
    
    // Silent critical resource preloading (zero errors, zero warnings)
    silentImagePreload('/src/assets/images/thai-massage.webp');
    silentImagePreload('/src/assets/images/logo.webp');
    silentImagePreload('/src/assets/images/face.webp');
    silentImagePreload('/src/assets/images/foot.webp');
    silentImagePreload('/src/assets/images/oil.webp');
    
    // Enable latest 2025 web performance APIs
    enableSpeculativeLoading();    // Instant navigation with Speculation Rules
    optimizePaintHolding();        // Smooth visual transitions
    initializeHTTP2Push();         // HTTP/2 server push simulation
    const cleanupPerformance = initializePerformanceOptimizations2025(); // React 19+ & Core Web Vitals 2025
    
    // Silent performance monitoring (zero console errors)
    const cleanupSilentMonitor = createSilentPerformanceMonitor();

    const loadAnalytics = async () => {
      try {
        const { trackPageView } = await import('./utils/analytics');
        trackPageView();
      } catch (error) {
        console.warn('Analytics failed to load:', error);
      }
    };
    
    // Load analytics after page is interactive
    if (document.readyState === 'complete') {
      loadAnalytics();
    } else {
      window.addEventListener('load', loadAnalytics, { once: true });
    }

    // Cleanup function to be called on component unmount
    return () => {
      cleanupPerformance();
      cleanupSilentMonitor();
      document.head.removeChild(preloadLink);
    };
  }, []);

  return (
    <HelmetProvider>
        <div className="min-h-screen bg-white">
        <SEO 
          title={t('hero.title') || ''}
          description={t('hero.subtitle') || ''}
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
          <LazyServices />
          <LazyAbout />
          <LazyLocation />
        </main>
        <Footer />
        
        {/* PWA Install Prompt */}
        <InstallPrompt />
        
        
        </div>
    </HelmetProvider>
  );
}

export default App;
