import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExternalLink, Sparkles, Settings, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AdsterraAdBannerProps {
  format: 'top' | 'bottom' | 'native';
  className?: string;
}

export const AdsterraAdBanner: React.FC<AdsterraAdBannerProps> = ({ format, className = '' }) => {
  const { adsterraConfig, setActiveTab, isAdminAuthenticated, role } = useApp();
  const iframeContainerRef = useRef<HTMLDivElement | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  const isEffectiveAdmin = isAdminAuthenticated || role === 'admin';

  const isEnabled = adsterraConfig?.enabled;
  const unitCode = format === 'top' 
    ? adsterraConfig?.topBannerCode 
    : format === 'bottom' 
    ? adsterraConfig?.bottomBannerCode 
    : adsterraConfig?.nativeBannerCode;

  const unitEnabled = format === 'top'
    ? adsterraConfig?.topBannerEnabled
    : format === 'bottom'
    ? adsterraConfig?.bottomBannerEnabled
    : adsterraConfig?.nativeBannerEnabled;

  const formatTitle = format === 'top'
    ? 'بانر علوي (Top Banner 728x90 / 320x50)'
    : format === 'bottom'
    ? 'بانر سفلي مربع (300x250 Medium Rectangle)'
    : 'إعلان مدمج (Native Banner Widget)';

  useEffect(() => {
    if (!iframeContainerRef.current || !isEnabled || !unitEnabled || !unitCode?.trim()) {
      setAdLoaded(false);
      return;
    }

    const container = iframeContainerRef.current;
    container.innerHTML = '';

    // If this is a native banner container (e.g. container-4637141dcafcb73f8eae0c22a79754da)
    if (unitCode.includes('container-')) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = unitCode;
      
      const scriptEl = tempDiv.querySelector('script');
      const containerDiv = tempDiv.querySelector('div');

      if (containerDiv) {
        container.appendChild(containerDiv);
      }
      if (scriptEl && scriptEl.src) {
        const s = document.createElement('script');
        s.src = scriptEl.src;
        s.async = true;
        s.setAttribute('data-cfasync', 'false');
        container.appendChild(s);
      }
      setAdLoaded(true);
      return;
    }

    // Otherwise, create an isolated iframe to cleanly execute Adsterra's script & atOptions
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';
    
    // Detect height dynamically from atOptions if present
    let detectedHeight = 120;
    const heightMatch = unitCode.match(/'height'\s*:\s*(\d+)/i) || unitCode.match(/"height"\s*:\s*(\d+)/i);
    if (heightMatch && heightMatch[1]) {
      detectedHeight = parseInt(heightMatch[1], 10) + 15;
    } else if (format === 'top') {
      detectedHeight = 110;
    } else if (format === 'bottom') {
      detectedHeight = 315;
    } else {
      detectedHeight = 200;
    }
    iframe.style.height = `${detectedHeight}px`;

    container.appendChild(iframe);

    try {
      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
              </style>
            </head>
            <body>
              ${unitCode}
            </body>
          </html>
        `);
        doc.close();
        setAdLoaded(true);
      }
    } catch (e) {
      console.error('Failed to render Adsterra banner unit', e);
    }
  }, [isEnabled, unitEnabled, unitCode, format]);

  if (!isEnabled || !unitEnabled) {
    return null;
  }

  // If code is supplied and rendered
  if (unitCode && unitCode.trim()) {
    return (
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 my-3 ${className}`}>
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs p-2 text-center">
          <div className="flex items-center justify-between pb-1 px-2 text-[10px] text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 mb-1.5">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>إعلان Adsterra</span>
            </span>
            {adsterraConfig.directLinkUrl && (
              <a 
                href={adsterraConfig.directLinkUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-500 hover:underline flex items-center gap-0.5"
              >
                <span>الرابط المباشر</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
          <div ref={iframeContainerRef} className="flex justify-center items-center overflow-hidden" />
        </div>
      </div>
    );
  }

  // If code is not yet supplied, show an elegant, helpful placeholder ready for code
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 my-3 ${className}`}>
      <div className="rounded-2xl border-2 border-dashed border-amber-500/40 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-amber-500/5 dark:from-amber-950/20 dark:to-slate-900/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-sm">
            <span className="text-xs">ADS</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black text-[10px] border border-amber-500/30">
                شبكة Adsterra
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {formatTitle}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              المساحة الإعلانية مهيأة وجاهزة! بانتظار رمز الوحدة الإعلانية من حسابك على Adsterra.
            </p>
          </div>
        </div>

        {isEffectiveAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 shrink-0 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>إدارة ولصق كود Adsterra ⚙️</span>
          </button>
        )}
      </div>
    </div>
  );
};
