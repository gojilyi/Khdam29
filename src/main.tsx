import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Prevent unwanted service worker reloads
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  // In development, actively unregister any stale service workers to prevent unexpected page reloads
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().catch(() => {});
      }
    });
  } else {
    // In production, safely register service worker without automatic page reloading
    registerSW({
      immediate: true,
      onNeedRefresh() {
        console.log('New content available');
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
    });
  }
}

const rootElement = document.getElementById('root') || (() => {
  const el = document.createElement('div');
  el.id = 'root';
  document.body.appendChild(el);
  return el;
})();

createRoot(rootElement).render(<App />);
