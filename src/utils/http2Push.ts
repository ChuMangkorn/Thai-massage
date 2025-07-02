// HTTP/2 Server Push Simulation for Ultra-Fast Loading
// Simulates server push by preloading critical resources intelligently

interface PushResource {
  url: string;
  type: 'script' | 'style' | 'image' | 'font' | 'preload';
  priority: 'high' | 'medium' | 'low';
  crossorigin?: boolean;
}

// Critical resources to push immediately
const CRITICAL_PUSH_RESOURCES: PushResource[] = [
  {
    url: '/src/assets/images/thai-massage.webp',
    type: 'image',
    priority: 'high'
  },
  {
    url: '/src/assets/images/logo.webp', 
    type: 'image',
    priority: 'high'
  },
];

// Secondary resources to push after critical path
const SECONDARY_PUSH_RESOURCES: PushResource[] = [
  {
    url: '/src/assets/images/face.webp',
    type: 'image', 
    priority: 'medium'
  },
  {
    url: '/src/assets/images/foot.webp',
    type: 'image',
    priority: 'medium'
  },
  {
    url: '/src/assets/images/oil.webp',
    type: 'image',
    priority: 'medium'
  }
];

// Track what's already been pushed to avoid duplicates
const pushedResources = new Set<string>();

// HTTP/2 Push simulation using Resource Hints
export function simulateHTTP2Push(): void {
  if (typeof window === 'undefined') return;

  // Push critical resources immediately
  pushCriticalResources();
  
  // Push secondary resources after a short delay
  setTimeout(() => {
    pushSecondaryResources();
  }, 100);
  
  // Push remaining resources when network is idle
  requestIdleCallback(() => {
    pushRemainingResources();
  }, { timeout: 2000 });
}

// Push critical resources for instant loading
function pushCriticalResources(): void {
  CRITICAL_PUSH_RESOURCES.forEach(resource => {
    if (!pushedResources.has(resource.url)) {
      createResourceHint(resource);
      pushedResources.add(resource.url);
    }
  });
}

// Push secondary resources for fast subsequent loading
function pushSecondaryResources(): void {
  SECONDARY_PUSH_RESOURCES.forEach(resource => {
    if (!pushedResources.has(resource.url)) {
      createResourceHint(resource);
      pushedResources.add(resource.url);
    }
  });
}

// Push any remaining important resources
function pushRemainingResources(): void {
  // Skip remaining resources to avoid preload warnings
  // These resources will load naturally when needed
}

// Create optimized resource hint elements
function createResourceHint(resource: PushResource): void {
  const link = document.createElement('link');
  
  // Set relationship based on resource type
  switch (resource.type) {
    case 'style':
      link.rel = 'preload';
      link.as = 'style';
      break;
    case 'script':
      link.rel = 'preload';
      link.as = 'script';
      break;
    case 'image':
      link.rel = 'preload';
      link.as = 'image';
      break;
    case 'font':
      link.rel = 'preload';
      link.as = 'font';
      link.crossOrigin = 'anonymous';
      break;
    default:
      link.rel = 'preload';
  }
  
  link.href = resource.url;
  
  // Set fetch priority (Chrome 102+)
  if ('fetchPriority' in link) {
    (link as any).fetchPriority = resource.priority;
  }
  
  // Set crossorigin if needed
  if (resource.crossorigin) {
    link.crossOrigin = 'anonymous';
  }
  
  // Add silent error handling
  link.onerror = () => {
    // Silent failure - no console warnings for production
  };
  
  // Insert into head for immediate processing
  document.head.appendChild(link);
}

// Modern requestIdleCallback polyfill
function requestIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): number {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Fallback for browsers without requestIdleCallback
  const start = performance.now();
  return (window as Window & typeof globalThis).setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining() {
        return Math.max(0, 50 - (performance.now() - start));
      }
    });
  }, 1) as any;
}

// Intelligent preloading based on user behavior
export function enableIntelligentPreloading(): void {
  if (typeof window === 'undefined') return;
  
  // Preload on hover (desktop)
  document.addEventListener('mouseover', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a[href]') as HTMLAnchorElement;
    
    if (link && link.href && !pushedResources.has(link.href)) {
      // Preload the linked page's critical resources
      setTimeout(() => {
        createResourceHint({
          url: link.href,
          type: 'preload',
          priority: 'medium'
        });
        pushedResources.add(link.href);
      }, 65); // Small delay to avoid accidental hovers
    }
  });
  
  // Preload on touchstart (mobile)
  document.addEventListener('touchstart', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a[href]') as HTMLAnchorElement;
    
    if (link && link.href && !pushedResources.has(link.href)) {
      createResourceHint({
        url: link.href,
        type: 'preload', 
        priority: 'high'
      });
      pushedResources.add(link.href);
    }
  }, { passive: true });
}

// Preload resources based on intersection observer
export function enableViewportPreloading(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        const imageSrc = element.dataset.preloadSrc;
        
        if (imageSrc && !pushedResources.has(imageSrc)) {
          createResourceHint({
            url: imageSrc,
            type: 'image',
            priority: 'medium'
          });
          pushedResources.add(imageSrc);
        }
        
        observer.unobserve(element);
      }
    });
  }, {
    rootMargin: '50px' // Start loading 50px before element enters viewport
  });
  
  // Observe elements with preload data attributes
  document.querySelectorAll('[data-preload-src]').forEach(el => {
    observer.observe(el);
  });
}

// Initialize all HTTP/2 push simulations
export function initializeHTTP2Push(): void {
  // Run immediately
  simulateHTTP2Push();
  
  // Enable intelligent preloading
  enableIntelligentPreloading();
  
  // Enable viewport-based preloading
  enableViewportPreloading();
  
  // Silent initialization - no console logs for production
}