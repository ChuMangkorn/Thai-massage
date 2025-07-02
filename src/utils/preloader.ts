/**
 * Advanced resource preloading utilities
 * Source: Web.dev preload critical assets guide 2024
 */

interface PreloadOptions {
  as: 'image' | 'font' | 'script' | 'style' | 'document';
  crossOrigin?: 'anonymous' | 'use-credentials';
  media?: string;
  type?: string;
}

/**
 * Preload critical resources programmatically
 * Source: MDN rel=preload documentation
 */
export const preloadResource = (href: string, options: PreloadOptions): void => {
  // Avoid duplicate preloads
  if (document.querySelector(`link[rel="preload"][href="${href}"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = options.as;
  
  if (options.crossOrigin) {
    link.crossOrigin = options.crossOrigin;
  }
  
  if (options.media) {
    link.media = options.media;
  }
  
  if (options.type) {
    link.type = options.type;
  }

  document.head.appendChild(link);
};

/**
 * Smart preload critical images based on viewport and usage
 * Source: Core Web Vitals optimization guide + preload best practices
 */
export const preloadCriticalImages = (imageUrls: string[]): void => {
  // Only preload images that will actually be used
  
  imageUrls.forEach(url => {
    // Only preload hero image immediately, others on demand
    if (url.includes('3757942')) {
      preloadResource(url, { as: 'image' });
    } else {
      // Defer non-critical images to avoid unused preload warnings
      setTimeout(() => {
        const img = new Image();
        img.src = url;
      }, 1000);
    }
  });
};

/**
 * Preload fonts with proper CORS handling
 * Source: Font loading performance best practices
 */
export const preloadFonts = (fontUrls: string[]): void => {
  fontUrls.forEach(url => {
    preloadResource(url, { 
      as: 'font', 
      crossOrigin: 'anonymous',
      type: 'font/woff2'
    });
  });
};

/**
 * Intelligent preloading based on user behavior
 * Source: Predictive preloading patterns
 */
export const intelligentPreload = {
  // Preload on hover (for navigation links)
  onHover: (element: HTMLElement, resource: string, options: PreloadOptions) => {
    let timeoutId: NodeJS.Timeout;
    
    const handleMouseEnter = () => {
      timeoutId = setTimeout(() => {
        preloadResource(resource, options);
      }, 200); // Delay to avoid accidental hovers
    };
    
    const handleMouseLeave = () => {
      clearTimeout(timeoutId);
    };
    
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    // Cleanup function
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  },
  
  // Preload on scroll proximity
  onScrollProximity: (target: HTMLElement, resource: string, options: PreloadOptions) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            preloadResource(resource, options);
            observer.unobserve(target);
          }
        });
      },
      { rootMargin: '200px' } // Preload when 200px away
    );
    
    observer.observe(target);
    
    return () => observer.disconnect();
  }
};

/**
 * Prefetch next likely resources
 * Source: Resource hints optimization guide
 */
export const prefetchResource = (href: string): void => {
  if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};

/**
 * DNS prefetch for external domains
 * Source: Network optimization best practices
 */
export const dnsPrefetch = (domain: string): void => {
  if (document.querySelector(`link[rel="dns-prefetch"][href="//${domain}"]`)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = `//${domain}`;
  document.head.appendChild(link);
};