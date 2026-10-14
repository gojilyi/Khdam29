import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';

export const InterstitialAdModal: React.FC = () => {
  const { activeInterstitial, closeInterstitial, language } = useApp();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (activeInterstitial?.isOpen) {
      setCountdown(5);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeInterstitial?.isOpen]);

  if (!activeInterstitial || !activeInterstitial.isOpen) {
    return null;
  }

  const canSkip = countdown === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative text-white space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 uppercase">
              {activeInterstitial.network === 'startio' ? 'Start.io Fullscreen Ad' : 'Google AdMob Interstitial'}
            </span>
          </div>

          {canSkip ? (
            <button
              onClick={closeInterstitial}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <span>{language === 'ar' ? 'تخطي الإعلان' : 'Skip Ad'}</span>
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-mono">
              {language === 'ar' ? `يمكنك التخطي بعد ${countdown} ثوانٍ` : `Skip in ${countdown}s`}
            </span>
          )}
        </div>

        {/* Media visual */}
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 flex items-center justify-center">
          <img
            src={activeInterstitial.image}
            alt={activeInterstitial.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
          <div className="absolute bottom-3 right-3 left-3">
            <h4 className="font-bold text-base text-white">
              {activeInterstitial.title}
            </h4>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">
            {language === 'ar' ? 'إعلان معتمد من شبكة الإعلانات الرسمية' : 'Verified Ad Network Unit'}
          </span>

          <a
            href={activeInterstitial.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeInterstitial}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
          >
            <span>{language === 'ar' ? 'تثبيت أو استكشاف' : 'Visit Sponsor'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
