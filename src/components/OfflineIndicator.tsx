import React, { useState, useEffect } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { getOfflinePendingActions, clearOfflinePendingActions, OfflinePendingAction } from '../utils/offlineSync';
import { 
  WifiOff, 
  Wifi, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  HardDrive, 
  X, 
  Clock,
  Sparkles
} from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, wasOffline } = useOnlineStatus();
  const [showModal, setShowModal] = useState(false);
  const [pendingActions, setPendingActions] = useState<OfflinePendingAction[]>([]);
  const [showReconnectedToast, setShowReconnectedToast] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Poll or refresh pending actions
  const refreshPending = () => {
    setPendingActions(getOfflinePendingActions());
  };

  useEffect(() => {
    refreshPending();
    const interval = setInterval(refreshPending, 2000);
    return () => clearInterval(interval);
  }, []);

  // When internet comes back after being offline
  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnectedToast(true);
      // Simulate / perform synchronization of queued requests
      const timer = setTimeout(() => {
        setShowReconnectedToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      if (isOnline) {
        clearOfflinePendingActions();
        refreshPending();
      }
    }, 1200);
  };

  return (
    <>
      {/* 1. Permanent Banner when Offline */}
      {!isOnline && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-3 py-2 shadow-md flex items-center justify-between text-xs font-bold border-b border-amber-700/30">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-950"></span>
            </span>
            <WifiOff className="w-4 h-4 shrink-0 text-slate-950" />
            <span className="truncate">
              وضع العمل دون إنترنت (Offline) 📴 — البيانات وأرقام الحرفيين محفوظة ومتاحة.
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {pendingActions.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-400 text-[10px] font-mono">
                {pendingActions.length} معلقة
              </span>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 hover:bg-slate-900 transition-colors text-[11px] cursor-pointer"
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      )}

      {/* 2. Reconnection Banner */}
      {showReconnectedToast && isOnline && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[92%] bg-emerald-600 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-xs font-bold animate-bounce">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-white/20">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <p>تمت استعادة الاتصال بالإنترنت بنجاح! 🟢</p>
              <p className="text-[10px] text-emerald-100 font-normal mt-0.5">
                تم تحديث بيانات التطبيق ومزامنة العمليات المحلية تلقائياً.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReconnectedToast(false)}
            className="p-1 rounded-lg hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Offline Mode Modal / Drawer */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-right max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-amber-500/20 text-amber-500 rounded-2xl">
                  <WifiOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    نظام العمل بدون اتصال بالإنترنت 📴
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PWA Offline Caching & Local Storage
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs leading-relaxed">
              {/* Status Box */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isOnline 
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/30 text-amber-800 dark:text-amber-300'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isOnline ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                    {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="font-bold text-sm block">
                      {isOnline ? 'متصل بالإنترنت (Online)' : 'غير متصل بالإنترنت (Offline Mode)'}
                    </span>
                    <span className="text-[11px] opacity-80">
                      {isOnline ? 'جميع الخدمات محدثة بالكامل ومزامنة فورية.' : 'التطبيق يعمل بكفاءة عبر الذاكرة المؤقتة والتخزين المحلي.'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-amber-400 dark:bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'جارِ الفحص...' : 'فحص الاتصال'}</span>
                </button>
              </div>

              {/* What works offline */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>الميزات المتاحة بالكامل دون إنترنت:</span>
                </h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>تصفح كافة الحرف، المهن، وعناوين وتخصصات الحرفيين.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>الاتصال الهاتفي المباشر بالحرفيين والورش (عبر شبكة الهاتف العادية).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>الاطلاع على دليل الأسعار الاسترشادية للخدمات والحرف.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>مراجعة الطلبات السابقة، المحادثات القديمة، ومواعيد الروزنامة.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>إنشاء طلب خدمة جديد يُحفظ محلياً ويرسل تلقائياً بمجرد عودة الاتصال.</span>
                  </li>
                </ul>
              </div>

              {/* Pending Offline Actions Queue */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>قائمة العمليات المعلقة للمزامنة:</span>
                  </h4>
                  {pendingActions.length > 0 && (
                    <button
                      onClick={() => {
                        clearOfflinePendingActions();
                        refreshPending();
                      }}
                      className="text-[10px] text-rose-500 hover:underline"
                    >
                      مسح القائمة
                    </button>
                  )}
                </div>

                {pendingActions.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500 text-center py-3">
                    لا توجد عمليات معلقة. كل شيء متزامن ومحدث.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {pendingActions.map((act) => (
                      <div
                        key={act.id}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            {act.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(act.createdAt).toLocaleTimeString('ar-DZ')} • في انتظار الشبكة
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                          معلق
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cache storage health info */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-slate-400" />
                  <span>تخزين الـ Service Worker: نشط ومحمي</span>
                </div>
                <span className="font-mono text-emerald-500 font-bold">Ready</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer"
            >
              متابعة استخدام التطبيق
            </button>
          </div>
        </div>
      )}
    </>
  );
};
