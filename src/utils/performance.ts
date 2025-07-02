// Performance monitoring utilities

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Observe paint metrics (FCP, LCP)
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);

        // LCP Observer
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // FID Observer
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.metrics.fid = entry.processingStart - entry.startTime;
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

        // CLS Observer
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value || 0;
              this.metrics.cls = clsValue;
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);

      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }

    // TTFB from Navigation Timing
    this.measureTTFB();
  }

  private measureTTFB() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const entry = navigationEntries[0];
        this.metrics.ttfb = entry.responseStart - entry.requestStart;
      }
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public logMetrics(): void {
    if (import.meta.env.DEV) {
      console.group('🚀 Performance Metrics');
      console.log('First Contentful Paint (FCP):', this.metrics.fcp?.toFixed(2), 'ms');
      console.log('Largest Contentful Paint (LCP):', this.metrics.lcp?.toFixed(2), 'ms');
      console.log('First Input Delay (FID):', this.metrics.fid?.toFixed(2), 'ms');
      console.log('Cumulative Layout Shift (CLS):', this.metrics.cls?.toFixed(4));
      console.log('Time to First Byte (TTFB):', this.metrics.ttfb?.toFixed(2), 'ms');
      console.groupEnd();
    }
  }

  public sendMetrics(endpoint?: string): void {
    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: this.metrics,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      }).catch(error => {
        console.warn('Failed to send metrics:', error);
      });
    }
  }

  public disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility function to measure component render time
export function measureRenderTime<T extends unknown[], R>(
  componentName: string,
  renderFunction: (...args: T) => R
) {
  return (...args: T) => {
    const startTime = performance.now();
    const result = renderFunction(...args);
    const endTime = performance.now();
    
    if (import.meta.env.DEV) {
      console.log(`⏱️ ${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
    }
    
    return result;
  };
}

// Bundle size tracking
export function trackBundleSize(): void {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    let totalSize = 0;
    const breakdown: Record<string, number> = {};
    
    resources.forEach(resource => {
      if (resource.name.includes('.js') || resource.name.includes('.css')) {
        const size = resource.transferSize || 0;
        totalSize += size;
        
        const filename = resource.name.split('/').pop() || 'unknown';
        breakdown[filename] = size;
      }
    });
    
    if (import.meta.env.DEV) {
      console.group('📦 Bundle Size Analysis');
      console.log('Total bundle size:', (totalSize / 1024).toFixed(2), 'KB');
      console.table(
        Object.entries(breakdown)
          .map(([name, size]) => ({
            File: name,
            Size: `${(size / 1024).toFixed(2)} KB`
          }))
          .sort((a, b) => parseFloat(b.Size) - parseFloat(a.Size))
      );
      console.groupEnd();
    }
  }
}