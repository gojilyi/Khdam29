import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExternalLink, X, Info } from 'lucide-react';

interface AdBannerProps {
  position?: 'top' | 'bottom' | 'inline';
}

export const AdBanner: React.FC<AdBannerProps> = ({ position = 'bottom' }) => {
  const { startIoConfig, adMobConfig, language } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);

  // If user dismissed this instance
  if (isDismissed) return null;

  // Check if either Start.io or AdMob banner is enabled
  const showStartIo = startIoConfig.enabled && startIoConfig.bannerEnabled;
  const showAdMob = adMobConfig.enabled && adMobConfig.bannerEnabled;

  if (!showStartIo && !showAdMob) {
    return null;
  }

  // Active network
  const network = showStartIo ? 'startio' : 'admob';

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 my-4 animate-fade-in ${
      position === 'bottom' ? 'mb-2' : position === 'top' ? 'mt-2' : ''
    }`}>
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-100 via-amber-50/50 to-slate-100 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 p-3 sm:p-4 shadow-xs flex items-center justify-between gap-3">
        {/* Ad Content */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          {/* Network icon */}
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
            {network === 'startio' ? (
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">
                Start.io
              </span>
            ) : (
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">
                AdMob
              </span>
            )}
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                {language === 'ar' ? 'إعلان ممول' : 'Sponsored'}
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {network === 'startio' 
                  ? 'أكبر شبكة للتجهيزات ومعدات الحرفيين في الجزائر' 
                  : 'عروض حصرية لخدمات الصيانة والتشطيبات المنزلية'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {network === 'startio'
                ? `Start.io Ad Unit: ${startIoConfig.appId ? `App ID: ${startIoConfig.appId}` : 'Test Mode'}`
                : `AdMob Unit ID: ${adMobConfig.bannerUnitId || 'ca-app-pub-3940256099942544/6300978111'}`}
            </p>
          </div>
        </div>

        {/* CTA and Close */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={network === 'startio' ? 'https://www.start.io' : 'https://admob.google.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
          >
            <span>{language === 'ar' ? 'معرفة المزيد' : 'Learn More'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            title="إخفاء الإعلان"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
