// Error tracking and reporting utilities

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId?: string;
}

export class ErrorTracker {
  private errors: ErrorInfo[] = [];
  private maxErrors = 50;
  private endpoint?: string;

  constructor(endpoint?: string) {
    this.endpoint = endpoint;
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers(): void {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });

    // Handle React errors (will be called from ErrorBoundary)
    (window as Window & { __errorTracker?: ErrorTracker }).__errorTracker = this;
  }

  public captureError(errorInfo: Partial<ErrorInfo>): void {
    const fullErrorInfo: ErrorInfo = {
      message: errorInfo.message || 'Unknown error',
      stack: errorInfo.stack,
      componentStack: errorInfo.componentStack,
      timestamp: errorInfo.timestamp || Date.now(),
      url: errorInfo.url || window.location.href,
      userAgent: errorInfo.userAgent || navigator.userAgent,
      userId: errorInfo.userId,
      sessionId: errorInfo.sessionId || this.getSessionId(),
    };

    this.errors.push(fullErrorInfo);

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group('🚨 Error Captured');
      console.error('Message:', fullErrorInfo.message);
      console.error('Stack:', fullErrorInfo.stack);
      console.error('Component Stack:', fullErrorInfo.componentStack);
      console.groupEnd();
    }

    // Send to endpoint if configured
    this.sendError(fullErrorInfo);
  }

  private sendError(errorInfo: ErrorInfo): void {
    if (this.endpoint) {
      fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo),
      }).catch(error => {
        console.warn('Failed to send error report:', error);
      });
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  public getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  public clearErrors(): void {
    this.errors = [];
  }

  public getErrorSummary(): { total: number; recent: number; byType: Record<string, number> } {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    const recent = this.errors.filter(error => now - error.timestamp < oneHour).length;
    
    const byType: Record<string, number> = {};
    this.errors.forEach(error => {
      const type = error.message.split(':')[0] || 'Unknown';
      byType[type] = (byType[type] || 0) + 1;
    });

    return {
      total: this.errors.length,
      recent,
      byType,
    };
  }
}

// Singleton instance
export const errorTracker = new ErrorTracker();

// Utility function to wrap async functions with error tracking
export function withErrorTracking<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorTracker.captureError({
        message: `${context ? `[${context}] ` : ''}${error instanceof Error ? error.message : String(error)}`,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
      throw error;
    }
  };
}

// Performance error detection
export function detectPerformanceIssues(): void {
  if ('performance' in window) {
    // Check for slow loading resources
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    resources.forEach(resource => {
      const loadTime = resource.responseEnd - resource.startTime;
      if (loadTime > 3000) { // 3 seconds threshold
        errorTracker.captureError({
          message: `Slow resource loading: ${resource.name}`,
          stack: `Load time: ${loadTime.toFixed(2)}ms`,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        });
      }
    });

    // Check for memory issues
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      if (memory) {
        const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
        if (memoryUsage > 0.9) { // 90% memory usage
          errorTracker.captureError({
            message: 'High memory usage detected',
            stack: `Memory usage: ${(memoryUsage * 100).toFixed(2)}%`,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          });
        }
      }
    }
  }
}