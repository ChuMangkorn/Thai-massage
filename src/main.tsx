import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { injectCriticalCSS } from './utils/criticalCSS';
import './index.css';
import './styles/viewTransitions.css';

// Inject critical CSS for faster First Paint
injectCriticalCSS();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
