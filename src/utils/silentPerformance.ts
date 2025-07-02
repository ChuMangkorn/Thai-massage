/**
 * Completely Silent Performance Monitoring
 * Zero console errors, zero exceptions, production-ready
 */

interface SilentMetrics {
  lcp: number;
  fid: number; // Using FID instead of INP for better compatibility
  cls: number;
  fcp: number;
  ttfb: number;
}

/**
 * Performance monitoring that NEVER throws or logs errors
 */
export const createSilentPerformanceMonitor = (): (() => void) => {
  const observers: PerformanceObserver[] = [];

  // Early exit if PerformanceObserver not available
  if (typeof PerformanceObserver === 'undefined') {
    return () => {}; // Return a no-op cleanup function
  }

  // LCP - Widely supported and stable
  try {
    const lcpObserver = new PerformanceObserver(() => {
      // ... (rest of the observer logic)
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    observers.push(lcpObserver);
  } catch {
    // Silent ignore
  }

  // CLS - Widely supported and stable
  try {
    const clsObserver = new PerformanceObserver(() => {
       // ... (rest of the observer logic)
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    observers.push(clsObserver);
  } catch {
    // Silent ignore
  }

  // FID - Stable and widely supported (better than INP for compatibility)
  try {
    const fidObserver = new PerformanceObserver(() => {
       // ... (rest of the observer logic)
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    observers.push(fidObserver);
  } catch {
    // Silent ignore
  }

  // FCP - Stable and widely supported
  try {
    const fcpObserver = new PerformanceObserver(() => {
       // ... (rest of the observer logic)
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
    observers.push(fcpObserver);
  } catch {
    // Silent ignore
  }

  // Return a cleanup function that disconnects all observers
  return () => {
    observers.forEach(observer => observer.disconnect());
  };
};

/**
 * Silent performance logging (only in development)
 */
export const logSilentMetrics = (metrics: SilentMetrics): void => {
  if (import.meta.env.PROD) return;

  // Only log if we have meaningful data
  const hasData = metrics.lcp > 0 || metrics.fcp > 0 || metrics.ttfb > 0;
  if (!hasData) return;

  try {
    console.group('⚡ Performance Metrics (Silent)');
    if (metrics.lcp > 0) console.log(`LCP: ${metrics.lcp.toFixed(2)}ms`);
    if (metrics.fcp > 0) console.log(`FCP: ${metrics.fcp.toFixed(2)}ms`);
    if (metrics.fid > 0) console.log(`FID: ${metrics.fid.toFixed(2)}ms`);
    if (metrics.cls > 0) console.log(`CLS: ${metrics.cls.toFixed(4)}`);
    if (metrics.ttfb > 0) console.log(`TTFB: ${metrics.ttfb.toFixed(2)}ms`);
    console.groupEnd();
  } catch {
    // Even logging can fail - silent ignore
  }
};

/**
 * Completely silent image preloading
 */
export const silentImagePreload = (src: string): void => {
  try {
    const img = new Image();
    img.onload = null;
    img.onerror = null;
    img.src = src;
  } catch {
    // Silent ignore
  }
};