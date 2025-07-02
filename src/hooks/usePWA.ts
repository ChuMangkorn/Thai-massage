import { useState, useEffect } from 'react';

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  updateAvailable: boolean;
  installing: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: !navigator.onLine,
    updateAvailable: false,
    installing: false
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as { standalone?: boolean }).standalone === true;
      const isInstalled = isStandalone || isInWebAppiOS;
      
      setState(prev => ({ ...prev, isInstalled }));
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setState(prev => ({ ...prev, isInstallable: true }));
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        isInstallable: false 
      }));
      setDeferredPrompt(null);
    };

    // Listen for online/offline events
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOffline: false }));
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOffline: true }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Temporarily disable service worker to prevent auto-refresh issues
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          setRegistration(reg);

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              setState(prev => ({ ...prev, installing: true }));
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setState(prev => ({ 
                    ...prev, 
                    updateAvailable: true,
                    installing: false 
                  }));
                }
              });
            }
          });

          // Listen for controlling service worker changes
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            // Disable auto-reload to prevent infinite refresh loops
            // Users can manually refresh if they want updates
            if (import.meta.env.DEV) {
              console.log('Service worker updated. Manual refresh recommended.');
            }
          });

        } catch (error) {
          console.error('Service worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
  }, []);

  const installApp = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    try {
      setState(prev => ({ ...prev, installing: true }));
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setState(prev => ({ 
          ...prev, 
          isInstalled: true, 
          isInstallable: false,
          installing: false 
        }));
        setDeferredPrompt(null);
        return true;
      } else {
        setState(prev => ({ ...prev, installing: false }));
        return false;
      }
    } catch (error) {
      console.error('App installation failed:', error);
      setState(prev => ({ ...prev, installing: false }));
      return false;
    }
  };

  const updateApp = async () => {
    if (!registration || !registration.waiting) return;

    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    setState(prev => ({ ...prev, updateAvailable: false }));
  };

  const shareApp = async () => {
    const shareData = {
      title: 'Thai Massage Leelawadee',
      text: 'Experience authentic Thai massage and relaxation services in Utsunomiya, Japan',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return true;
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        return true;
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      return false;
    }
  };

  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  };

  const showNotification = async (title: string, options?: NotificationOptions) => {
    const permission = await requestNotificationPermission();
    
    if (permission === 'granted' && registration) {
      return registration.showNotification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        ...options
      });
    }
  };

  const getInstallInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      return {
        browser: 'Chrome',
        steps: [
          'Tap the menu button (⋮) in the top right',
          'Select "Add to Home screen"',
          'Tap "Add" to confirm'
        ]
      };
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      return {
        browser: 'Safari',
        steps: [
          'Tap the share button (□↗) at the bottom',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to confirm'
        ]
      };
    } else if (userAgent.includes('firefox')) {
      return {
        browser: 'Firefox',
        steps: [
          'Tap the menu button (⋮) in the top right',
          'Select "Install"',
          'Tap "Add" to confirm'
        ]
      };
    } else {
      return {
        browser: 'Browser',
        steps: [
          'Look for an "Install" or "Add to Home Screen" option in your browser menu',
          'Follow the prompts to install the app'
        ]
      };
    }
  };

  return {
    ...state,
    installApp,
    updateApp,
    shareApp,
    requestNotificationPermission,
    showNotification,
    getInstallInstructions,
    canInstall: state.isInstallable && !state.isInstalled,
    registration
  };
};