import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { injectCriticalCSS } from './utils/criticalCSS';
import './index.css';
import './styles/viewTransitions.css';

injectCriticalCSS();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
