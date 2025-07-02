/**
 * Critical CSS extraction and optimization utilities
 * Source: Critical CSS performance optimization guide 2024
 */

/**
 * Critical above-the-fold styles for immediate rendering
 * Source: Core Web Vitals optimization - eliminate render blocking CSS
 */
export const criticalCSS = `
/* Ultra-optimized critical CSS for instant first paint */
*,*::before,*::after{box-sizing:border-box}
html{height:100%;font-family:system-ui,-apple-system,sans-serif}
body{margin:0;line-height:1.6;color:#1f2937;background:#fff;min-height:100vh}

/* Critical layout utilities */
.min-h-screen{min-height:100vh}
.bg-white{background:#fff}
.flex{display:flex}
.items-center{align-items:center}
.justify-center{justify-content:center}
.text-center{text-align:center}
.text-white{color:#fff}
.relative{position:relative}
.absolute{position:absolute}
.inset-0{top:0;right:0;bottom:0;left:0}
.z-10{z-index:10}
.w-full{width:100%}
.h-full{height:100%}
.object-cover{object-fit:cover}
.font-bold{font-weight:700}
.opacity-90{opacity:.9}
.overflow-hidden{overflow:hidden}

/* Hero critical styles - above the fold */
.text-4xl{font-size:2.25rem;line-height:2.5rem}
.text-xl{font-size:1.25rem;line-height:1.75rem}
.mb-6{margin-bottom:1.5rem}
.mb-8{margin-bottom:2rem}
.px-4{padding-left:1rem;padding-right:1rem}
.max-w-4xl{max-width:56rem}
.mx-auto{margin-left:auto;margin-right:auto}
.font-light{font-weight:300}

/* Header critical styles */
.fixed{position:fixed}
.top-0{top:0}
.left-0{left:0}
.right-0{right:0}
.z-\\[9998\\]{z-index:9998}
.transition-all{transition:all .3s}
.duration-300{transition-duration:.3s}
.bg-white\\/95{background:rgba(255,255,255,.95)}
.backdrop-blur-sm{backdrop-filter:blur(4px)}
.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}
.py-2{padding-top:.5rem;padding-bottom:.5rem}
.py-4{padding-top:1rem;padding-bottom:1rem}

/* Top info bar critical */
.bg-gradient-to-r{background:linear-gradient(to right,var(--tw-gradient-stops))}
.from-secondary{--tw-gradient-from:#8B0000;--tw-gradient-to:rgba(139,0,0,0);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
.to-primary{--tw-gradient-to:#B8860B}
.z-\\[9999\\]{z-index:9999}
.text-sm{font-size:.875rem}
.text-white{color:#fff !important}

/* Button critical styles */
.bg-primary{background:#10b981}
.text-white{color:#fff}
.px-12{padding-left:3rem;padding-right:3rem}
.py-6{padding-top:1.5rem;padding-bottom:1.5rem}
.rounded-xl{border-radius:.75rem}
.font-semibold{font-weight:600}
.space-x-3>*+*{margin-left:.75rem}
.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}

/* Critical responsive */
@media(min-width:768px){
.md\\:text-6xl{font-size:3.75rem;line-height:1}
.md\\:text-2xl{font-size:1.5rem;line-height:2rem}
.md\\:block{display:block}
.hidden{display:none}
}
@media(min-width:1024px){
.lg\\:text-7xl{font-size:4.5rem;line-height:1}
.lg\\:text-3xl{font-size:1.875rem;line-height:2.25rem}
}
@media(max-width:767px){
.md\\:hidden{display:none}
}

/* Critical animations */
.animate-fade-in{animation:fadeIn .6s ease-out}
@keyframes fadeIn{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
`;

/**
 * Inject critical CSS inline for faster First Paint
 * Source: Critical rendering path optimization
 */
export const injectCriticalCSS = (): void => {
  // Avoid duplicate injection
  if (document.getElementById('critical-css')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'critical-css';
  style.textContent = criticalCSS;
  
  // Insert before any existing stylesheets
  const firstLink = document.querySelector('link[rel="stylesheet"]');
  if (firstLink) {
    document.head.insertBefore(style, firstLink);
  } else {
    document.head.appendChild(style);
  }
};

/**
 * Load non-critical CSS asynchronously
 * Source: Async CSS loading best practices
 */
export const loadAsyncCSS = (href: string, media = 'all'): void => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  link.onload = function() {
    // @ts-ignore
    this.onload = null;
    // @ts-ignore
    this.rel = 'stylesheet';
    // @ts-ignore
    this.media = media;
  };
  
  document.head.appendChild(link);
  
  // Fallback for browsers that don't support preload
  const noscript = document.createElement('noscript');
  const fallbackLink = document.createElement('link');
  fallbackLink.rel = 'stylesheet';
  fallbackLink.href = href;
  fallbackLink.media = media;
  noscript.appendChild(fallbackLink);
  document.head.appendChild(noscript);
};

/**
 * Optimize CSS delivery for Core Web Vitals
 * Source: Web.dev CSS optimization guide
 */
export const optimizeCSSDelivery = {
  // Remove unused CSS at runtime (for development/analysis)
  removeUnusedStyles: (): void => {
    if (import.meta.env.PROD) return; // Only in development
    
    const allElements = document.querySelectorAll('*');
    const usedClasses = new Set<string>();
    
    allElements.forEach(el => {
      if (el.className && typeof el.className === 'string') {
        el.className.split(' ').forEach(cls => {
          if (cls.trim()) usedClasses.add(cls.trim());
        });
      }
    });
    
    console.log('🎨 Used CSS classes:', Array.from(usedClasses).sort());
  },

  // Monitor CSS performance
  measureCSSPerformance: (): void => {
    if (import.meta.env.DEV) {
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      console.group('📊 CSS Performance');
      console.log(`Total stylesheets: ${stylesheets.length}`);
      
      stylesheets.forEach((sheet, index) => {
        const link = sheet as HTMLLinkElement;
        console.log(`${index + 1}. ${link.href}`);
      });
      
      console.groupEnd();
    }
  }
};