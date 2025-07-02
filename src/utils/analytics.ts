// Analytics and tracking utilities

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, string | number | boolean>;
}

interface UserProperties {
  language?: string;
  device_type?: string;
  user_agent?: string;
  screen_resolution?: string;
  timezone?: string;
}

class Analytics {
  private isInitialized = false;
  private queue: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeAnalytics();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeAnalytics() {
    try {
      // Initialize Google Analytics 4 if gtag is available
      if (typeof gtag !== 'undefined') {
        this.isInitialized = true;
        this.flushQueue();
      }

      // Initialize custom analytics
      await this.setupCustomAnalytics();
      
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
  }

  private async setupCustomAnalytics() {
    // Set up user properties
    const userProperties: UserProperties = {
      language: navigator.language,
      device_type: this.getDeviceType(),
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    this.setUserProperties(userProperties);

    // Track page view
    this.trackPageView();

    // Set up automatic event tracking
    this.setupAutomaticTracking();
  }

  private getDeviceType(): string {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private setupAutomaticTracking() {
    // Track scroll depth
    this.trackScrollDepth();

    // Track time on page
    this.trackTimeOnPage();

    // Track clicks on important elements
    this.trackClicks();

    // Track form interactions
    this.trackFormInteractions();
  }

  private trackScrollDepth() {
    const thresholds = [25, 50, 75, 90, 100];
    const triggered = new Set<number>();

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !triggered.has(threshold)) {
          triggered.add(threshold);
          this.track({
            action: 'scroll_depth',
            category: 'engagement',
            label: `${threshold}%`,
            value: threshold
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  private trackTimeOnPage() {
    const startTime = Date.now();

    const trackTime = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      this.track({
        action: 'time_on_page',
        category: 'engagement',
        value: timeSpent
      });
    };

    // Track time when user leaves
    window.addEventListener('beforeunload', trackTime);
    
    // Track time at intervals
    setInterval(() => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent % 30 === 0) { // Every 30 seconds
        this.track({
          action: 'time_milestone',
          category: 'engagement',
          value: timeSpent
        });
      }
    }, 1000);
  }

  private trackClicks() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Track phone number clicks
      if (target.closest('a[href^="tel:"]')) {
        this.track({
          action: 'phone_click',
          category: 'contact',
          label: target.closest('a')?.getAttribute('href')
        });
      }

      // Track email clicks
      if (target.closest('a[href^="mailto:"]')) {
        this.track({
          action: 'email_click',
          category: 'contact',
          label: target.closest('a')?.getAttribute('href')
        });
      }

      // Track navigation clicks
      if (target.closest('nav a')) {
        const link = target.closest('a') as HTMLAnchorElement;
        this.track({
          action: 'navigation_click',
          category: 'navigation',
          label: link.textContent || link.getAttribute('href')
        });
      }

      // Track CTA button clicks
      if (target.closest('button, .btn, [role="button"]')) {
        const button = target.closest('button, .btn, [role="button"]') as HTMLElement;
        this.track({
          action: 'button_click',
          category: 'interaction',
          label: button.textContent || button.getAttribute('aria-label')
        });
      }
    });
  }

  private trackFormInteractions() {
    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.track({
        action: 'form_submit',
        category: 'form',
        label: form.id || form.className
      });
    });

    // Track form field interactions
    document.addEventListener('focus', (event) => {
      const target = event.target as HTMLElement;
      if (target.matches('input, textarea, select')) {
        this.track({
          action: 'form_field_focus',
          category: 'form',
          label: target.getAttribute('name') || target.getAttribute('id')
        });
      }
    }, true);
  }

  public track(event: AnalyticsEvent) {
    const enrichedEvent = {
      ...event,
      timestamp: Date.now(),
      session_id: this.sessionId,
      user_id: this.userId,
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer,
      custom_parameters: {
        ...event.custom_parameters,
        device_type: this.getDeviceType(),
        language: navigator.language
      }
    };

    if (this.isInitialized) {
      this.sendEvent(enrichedEvent);
    } else {
      this.queue.push(enrichedEvent);
    }
  }

  private sendEvent(event: AnalyticsEvent & { timestamp: number; session_id: string; user_id?: string; page_url: string; page_title: string; referrer: string }) {
    try {
      // Send to Google Analytics if available
      if (typeof gtag !== 'undefined') {
        gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          custom_map: event.custom_parameters
        });
      }

      // Send to custom analytics endpoint
      this.sendToCustomEndpoint(event);

      // Log in development
      if (import.meta.env.DEV) {
        console.log('📊 Analytics Event:', event);
      }

    } catch (error) {
      console.warn('Failed to send analytics event:', error);
    }
  }

  private async sendToCustomEndpoint(event: Record<string, unknown>) {
    // You can implement custom analytics endpoint here
    // For now, we'll store in localStorage for debugging
    try {
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
    }
  }

  private flushQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      if (event) {
        this.sendEvent(event);
      }
    }
  }

  public trackPageView(page?: string) {
    this.track({
      action: 'page_view',
      category: 'navigation',
      label: page || window.location.pathname
    });
  }

  public trackServiceView(serviceName: string) {
    this.track({
      action: 'service_view',
      category: 'services',
      label: serviceName
    });
  }

  public trackLanguageChange(language: string) {
    this.track({
      action: 'language_change',
      category: 'localization',
      label: language
    });
  }

  public trackError(error: string, context?: string) {
    this.track({
      action: 'error',
      category: 'error',
      label: error,
      custom_parameters: {
        context,
        stack: new Error().stack
      }
    });
  }

  public trackPerformance(metric: string, value: number) {
    this.track({
      action: 'performance_metric',
      category: 'performance',
      label: metric,
      value: Math.round(value)
    });
  }

  public setUserId(userId: string) {
    this.userId = userId;
    
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId
      });
    }
  }

  public setUserProperties(properties: UserProperties) {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        custom_map: properties
      });
    }
  }

  public getAnalyticsData() {
    try {
      return JSON.parse(localStorage.getItem('analytics_events') || '[]');
    } catch {
      return [];
    }
  }

  public clearAnalyticsData() {
    localStorage.removeItem('analytics_events');
  }
}

// Singleton instance
export const analytics = new Analytics();

// Convenience functions
export const trackEvent = (event: AnalyticsEvent) => analytics.track(event);
export const trackPageView = (page?: string) => analytics.trackPageView(page);
export const trackServiceView = (serviceName: string) => analytics.trackServiceView(serviceName);
export const trackLanguageChange = (language: string) => analytics.trackLanguageChange(language);
export const trackError = (error: string, context?: string) => analytics.trackError(error, context);
export const trackPerformance = (metric: string, value: number) => analytics.trackPerformance(metric, value);

// Global gtag type declaration
declare global {
  function gtag(command: string, ...args: unknown[]): void;
}