import { lazy } from 'react';

// Lazy load heavy components
export const LazyServices = lazy(() => import('./Services'));
export const LazyAbout = lazy(() => import('./About'));
export const LazyLocation = lazy(() => import('./Location'));

// Keep Header, Hero, and Footer as regular imports since they're critical for initial render