import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    const isElementIntersecting = entry.isIntersecting;
    setIsIntersecting(isElementIntersecting);
    
    if (isElementIntersecting && triggerOnce) {
      setHasTriggered(true);
    }
  }, [triggerOnce]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If triggerOnce and already triggered, don't observe
    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      handleIntersection,
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered, handleIntersection]);

  return {
    elementRef,
    isIntersecting: triggerOnce ? (hasTriggered || isIntersecting) : isIntersecting
  };
};