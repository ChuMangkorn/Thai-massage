import React, { useState, useEffect } from 'react';
import { X, Download, Share, Smartphone } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { useLanguage } from '../hooks/useLanguage';
import { cn } from '../utils';

interface InstallPromptProps {
  className?: string;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ className }) => {
  const { t } = useLanguage();
  const { 
    canInstall, 
    isOffline, 
    updateAvailable, 
    installing,
    installApp, 
    updateApp, 
    shareApp,
    getInstallInstructions 
  } = usePWA();
  
  const [showPrompt, setShowPrompt] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show install prompt after user has been on site for 30 seconds
    const timer = setTimeout(() => {
      if (canInstall && !dismissed) {
        setShowPrompt(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [canInstall, dismissed]);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const isDismissed = localStorage.getItem('install-prompt-dismissed') === 'true';
    setDismissed(isDismissed);
  }, []);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowPrompt(false);
    } else {
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('install-prompt-dismissed', 'true');
  };

  const handleShare = async () => {
    const success = await shareApp();
    if (success) {
      // Show success message or close prompt
      setShowPrompt(false);
    }
  };

  const handleUpdate = () => {
    updateApp();
  };

  const instructions = getInstallInstructions();

  // Update available banner
  if (updateAvailable) {
    return (
      <div className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-primary text-white p-4',
        className
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5" />
            <span className="font-medium">
              {t('pwa.updateAvailable', 'App update available')}
            </span>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {t('pwa.update', 'Update')}
          </button>
        </div>
      </div>
    );
  }

  // Offline banner
  if (isOffline) {
    return (
      <div className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white p-4',
        className
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="font-medium">
              {t('pwa.offline', 'You are currently offline')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Install instructions modal
  if (showInstructions) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {t('pwa.installInstructions', 'Install Instructions')}
            </h3>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <Smartphone className="w-6 h-6 text-primary" />
              <span className="font-medium">{instructions.browser}</span>
            </div>
            
            <ol className="space-y-2 text-sm text-gray-600">
              {instructions.steps.map((step, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleShare}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Share className="w-4 h-4" />
              <span>{t('pwa.share', 'Share')}</span>
            </button>
            <button
              onClick={() => setShowInstructions(false)}
              className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {t('common.close', 'Close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Install prompt
  if (showPrompt && canInstall && !dismissed) {
    return (
      <div className={cn(
        'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50',
        className
      )}>
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {t('pwa.installTitle', 'Install App')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('pwa.installSubtitle', 'Get the full experience')}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            {t('pwa.installDescription', 'Install our app for faster access, offline support, and a better experience.')}
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={handleInstall}
              disabled={installing}
              className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {installing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('pwa.installing', 'Installing...')}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{t('pwa.install', 'Install')}</span>
                </>
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {t('common.later', 'Later')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default InstallPrompt;