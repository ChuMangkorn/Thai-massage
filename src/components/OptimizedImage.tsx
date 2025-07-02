import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { cn } from '../utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty' | string;
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  retryable?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  loading = 'lazy',
  onLoad,
  onError,
  retryable = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  });

  // Generate responsive image URLs for Pexels with modern formats
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc.includes('pexels.com')) return '';
    
    const widths = [400, 800, 1200, 1600, 1920];
    const h = height ? `&h=${Math.round(height * (1600 / (width || 1600)))}` : '';
    
    return widths
      .map(w => `${baseSrc}?auto=compress&cs=tinysrgb&fit=crop&w=${w}${h}&q=${quality}&fm=webp ${w}w`)
      .join(', ');
  };

  // Generate optimized src with modern formats
  const getOptimizedSrc = useCallback((baseSrc: string, targetWidth?: number) => {
    if (!baseSrc.includes('pexels.com')) return baseSrc;
    
    const w = targetWidth || width || 1920;
    const h = height ? `&h=${height}` : '';
    
    // Add modern format support and better compression
    return `${baseSrc}?auto=compress&cs=tinysrgb&fit=crop&w=${w}${h}&q=${quality}&fm=webp`;
  }, [width, height, quality]);

  // Create blur placeholder
  const createBlurPlaceholder = () => {
    if (blurDataURL) return blurDataURL;
    
    // Simple blur placeholder SVG
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEMyNC40MTgzIDI4IDI4IDI0LjQxODMgMjggMjBDMjggMTUuNTgxNyAyNC40MTgzIDEyIDIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhaIiBmaWxsPSIjRTVFN0VCIi8+Cjwvc3ZnPgo=';
  };

  useEffect(() => {
    if (priority || isIntersecting) {
      setCurrentSrc(getOptimizedSrc(src, width));
    }
  }, [src, width, priority, isIntersecting, getOptimizedSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoaded(false);
    setCurrentSrc(getOptimizedSrc(src, width));
  };

  // Show placeholder while not intersecting (unless priority)
  if (!priority && !isIntersecting) {
    return (
      <div
        ref={elementRef}
        className={cn(
          'bg-gray-200 animate-pulse flex items-center justify-center',
          className
        )}
        style={{ width, height }}
      >
        <svg
          className="w-8 h-8 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div
        className={cn(
          'bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-4',
          className
        )}
        style={{ width, height }}
      >
        <svg
          className="w-8 h-8 text-gray-400 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm text-gray-500 mb-2">Failed to load image</p>
        {retryable && (
          <button
            onClick={handleRetry}
            className="text-xs text-primary hover:text-primary/80 underline"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div ref={elementRef} className={cn('relative overflow-hidden', className)}>
      {/* Blur placeholder */}
      {placeholder === 'blur' && !isLoaded && (
        <img
          src={createBlurPlaceholder()}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      {currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          decoding="async"
        />
      )}
      
      {/* Loading indicator */}
      {!isLoaded && !hasError && currentSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;