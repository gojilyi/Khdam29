import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle, Share2, PlusSquare } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'compact') {
      return (
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          title="تثبيت التطبيق على جهازك للعمل دون إنترنت"
          className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 transition-all flex items-center gap-1.5 text-xs font-bold"
        >
          <Download className="w-4 h-4 animate-bounce" />
          <span className="hidden sm:inline">تثبيت التطبيق</span>
        </button>
      );
    }

    return (
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-sm hover:from-amber-400 hover:to-amber-500 transition active:scale-95 cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>تثبيت التطبيق 📱</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-500 hover:bg-amber-500/20 transition cursor-pointer"
        >
          <Smartphone className="w-4 h-4" />
          <span>تثبيت على آيفون</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-right">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/20 text-amber-500 rounded-xl">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">تثبيت خـدّام على iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  لتشغيل التطبيق والعمل به حتى في حالة انقطاع الإنترنت:
                </p>
                
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">1. اضغط زر المشاركة (Share)</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">في الشريط السفلي لمتصفح Safari.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">2. اختر "إضافة إلى الشاشة الرئيسية"</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">Add to Home Screen لإنشاء أيقونة التطبيق المستقلة.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold pt-1">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>سيعمل التطبيق بعدها في وضع الشاشة الكاملة وبدون إنترنت.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-amber-500 hover:bg-amber-600 py-2.5 text-xs font-bold text-slate-950 transition cursor-pointer"
              >
                فهمت، حسناً
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
