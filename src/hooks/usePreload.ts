import { useEffect } from 'react';

interface PreloadOptions {
  images?: string[];
  fonts?: string[];
  scripts?: string[];
}

export const usePreload = (options: PreloadOptions) => {
  useEffect(() => {
    const { images = [], fonts = [], scripts = [] } = options;

    // Preload images
    images.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload fonts
    fonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = href;
      link.crossOrigin = 'anonymous';
      
      // Add error handling
      link.onerror = () => {
        console.warn(`Failed to preload font: ${href}`);
      };
      
      document.head.appendChild(link);
    });

    // Preload scripts
    scripts.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = src;
      document.head.appendChild(link);
    });

    // Cleanup function
    return () => {
      // Remove preload links when component unmounts
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      preloadLinks.forEach(link => {
        if (
          images.includes(link.getAttribute('href') || '') ||
          fonts.includes(link.getAttribute('href') || '') ||
          scripts.includes(link.getAttribute('href') || '')
        ) {
          document.head.removeChild(link);
        }
      });
    };
  }, [options]);
};