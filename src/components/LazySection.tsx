import React, { Suspense } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  minHeight?: string;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback,
  className = '',
  minHeight = '200px'
}) => {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px', // Start loading 100px before the section comes into view
    triggerOnce: true
  });

  return (
    <div 
      ref={elementRef} 
      className={className}
      style={{ minHeight: isIntersecting ? 'auto' : minHeight }}
    >
      {isIntersecting ? (
        <ErrorBoundary>
          <Suspense fallback={fallback || <LoadingSpinner size="lg" />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      ) : (
        <div className="flex items-center justify-center" style={{ height: minHeight }}>
          <LoadingSpinner size="md" />
        </div>
      )}
    </div>
  );
};

export default LazySection;