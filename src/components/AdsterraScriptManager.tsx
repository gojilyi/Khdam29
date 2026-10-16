import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

/**
 * AdsterraScriptManager
 * Safely manages global Adsterra script units:
 * 1. Social Bar (In-Page Push notifications)
 * 2. Popunder script
 */
export const AdsterraScriptManager: React.FC = () => {
  const { adsterraConfig } = useApp();

  useEffect(() => {
    if (!adsterraConfig || !adsterraConfig.enabled) return;

    const cleanupFns: Array<() => void> = [];

    // Helper to inject HTML/script safely into document
    const injectScriptSnippet = (snippet: string, identifier: string) => {
      if (!snippet || !snippet.trim()) return;

      const trimmed = snippet.trim();
      const container = document.createElement('div');
      container.id = `adsterra-holder-${identifier}`;
      container.style.display = 'none';

      // Parse scripts or src
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = trimmed;

      const scriptElements = tempDiv.querySelectorAll('script');

      if (scriptElements.length > 0) {
        scriptElements.forEach((origScript, idx) => {
          const newScript = document.createElement('script');
          newScript.type = origScript.type || 'text/javascript';
          newScript.id = `adsterra-script-${identifier}-${idx}`;

          if (origScript.src) {
            if (document.querySelector(`script[src="${origScript.src}"]`)) {
              return;
            }
            newScript.src = origScript.src;
            newScript.async = true;
          } else {
            newScript.text = origScript.text || origScript.innerHTML;
          }

          document.body.appendChild(newScript);

          cleanupFns.push(() => {
            if (newScript.parentNode) {
              newScript.parentNode.removeChild(newScript);
            }
          });
        });
      } else if (trimmed.startsWith('http') || trimmed.startsWith('//')) {
        if (document.querySelector(`script[src="${trimmed}"]`)) {
          return;
        }
        // Direct script URL
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = trimmed;
        script.async = true;
        script.id = `adsterra-script-${identifier}`;
        document.body.appendChild(script);

        cleanupFns.push(() => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        });
      }

      document.body.appendChild(container);
      cleanupFns.push(() => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      });
    };

    // 1. Social Bar Injection
    if (adsterraConfig.socialBarEnabled && adsterraConfig.socialBarCode) {
      injectScriptSnippet(adsterraConfig.socialBarCode, 'socialbar');
    }

    // 2. Popunder Injection
    if (adsterraConfig.popunderEnabled && adsterraConfig.popunderCode) {
      injectScriptSnippet(adsterraConfig.popunderCode, 'popunder');
    }

    return () => {
      cleanupFns.forEach(fn => {
        try {
          fn();
        } catch (e) {
          console.error('Error cleaning up Adsterra script', e);
        }
      });
    };
  }, [
    adsterraConfig?.enabled,
    adsterraConfig?.socialBarEnabled,
    adsterraConfig?.socialBarCode,
    adsterraConfig?.popunderEnabled,
    adsterraConfig?.popunderCode
  ]);

  return null;
};
