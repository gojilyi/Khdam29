import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  X, 
  Download, 
  Sparkles, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Compass,
  PhoneCall,
  DollarSign
} from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { 
    activeNotificationToast, 
    dismissNotificationToast, 
    activeGeoAlert,
    dismissGeoAlert,
    acceptGeoAlertTask,
    isUpdateModalOpen, 
    updateModalData, 
    closeUpdateModal,
    setActiveTab,
    language 
  } = useApp();

  return (
    <>
      {/* 0. Geo-Fenced Targeted Proximity Push Alert (تنبيهات فورية للطلبات في النطاق الجغرافي) */}
      {activeGeoAlert && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 sm:w-[420px] z-50 animate-slide-down">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white border-2 border-amber-500 rounded-3xl p-5 shadow-2xl space-y-3 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg shadow-amber-500/30 animate-bounce">
                  <Compass className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                      <span>طلب فوري في نطاقك الجغرافي</span>
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">
                      {activeGeoAlert.distanceKm} كم فقط
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white mt-0.5">
                    {activeGeoAlert.title}
                  </h4>
                </div>
              </div>

              <button
                onClick={dismissGeoAlert}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="إغلاق التنبيه"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-400 font-bold">{activeGeoAlert.subService}</span>
                <span className="text-emerald-400 font-mono font-black text-xs">{activeGeoAlert.payout} دج</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{activeGeoAlert.neighborhood}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                <span>العميل: </span>
                <span className="text-white font-bold">{activeGeoAlert.clientName}</span>
                <span className="mx-1.5">·</span>
                <span className="text-slate-500">{activeGeoAlert.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={acceptGeoAlertTask}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>قبول المهمة والتوجه للعميل</span>
              </button>
              <button
                onClick={dismissGeoAlert}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                تجاهل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Real-Time Push Notification Toast Banner */}
      {activeNotificationToast && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-slide-down">
          <div className="bg-slate-900 text-white border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl flex items-start gap-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
              {activeNotificationToast.type === 'update' ? (
                <Download className="w-5 h-5" />
              ) : activeNotificationToast.type === 'alert' ? (
                <AlertTriangle className="w-5 h-5 text-rose-950" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                  Firebase Cloud Messaging · FCM
                </span>
                <button
                  onClick={dismissNotificationToast}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="font-bold text-xs sm:text-sm text-white">
                {activeNotificationToast.title}
              </h4>
              <p className="text-xs text-slate-300 leading-snug">
                {activeNotificationToast.message}
              </p>

              {activeNotificationToast.note && (
                <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-xl text-[11px] text-amber-200 mt-1.5 flex items-start gap-1.5">
                  <span className="font-bold shrink-0">تنويه:</span>
                  <span>{activeNotificationToast.note}</span>
                </div>
              )}

              {activeNotificationToast.imageUrl && (
                <img
                  src={activeNotificationToast.imageUrl}
                  alt="Notification Attachment"
                  className="w-full h-28 object-cover rounded-xl mt-2 border border-slate-700"
                />
              )}

              {activeNotificationToast.actionLink && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (activeNotificationToast.actionLink?.startsWith('http')) {
                        window.open(activeNotificationToast.actionLink, '_blank');
                      } else if (activeNotificationToast.actionLink) {
                        setActiveTab(activeNotificationToast.actionLink);
                      }
                      dismissNotificationToast();
                    }}
                    className="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    <span>{activeNotificationToast.linkText || 'زيارة الرابط والمزيد'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Mandatory / Recommended App Update Modal */}
      {isUpdateModalOpen && updateModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-center space-y-4">
            <button
              onClick={closeUpdateModal}
              className="absolute rtl:left-4 ltr:right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <Download className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold font-mono">
                {updateModalData.version || 'إصدار جديد متاح'}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white pt-2">
                {updateModalData.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                {updateModalData.message}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-start space-y-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                مزايا وتحديثات الإصدار الجديد:
              </span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>سرعة استجابة فائقة لرادار التتبع الجغرافي.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>تفعيل البطاقة المهنية الرقمية بالدبلومات التخصصية.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>تحسينات الأمان وتشفير المكالمات الصوتية بدون كشف الرقم.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={updateModalData.updateUrl || 'https://play.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeUpdateModal}
                className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'ar' ? 'تحديث التطبيق الآن' : 'Update Now'}</span>
              </a>

              <button
                onClick={closeUpdateModal}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs transition-colors"
              >
                {language === 'ar' ? 'لاحقاً' : 'Dismiss'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
