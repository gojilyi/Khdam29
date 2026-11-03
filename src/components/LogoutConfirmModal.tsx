import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LogOut, AlertTriangle, X, Check, Shield } from 'lucide-react';

export const LogoutConfirmModal: React.FC = () => {
  const { 
    isLogoutConfirmOpen, 
    setIsLogoutConfirmOpen, 
    currentUser, 
    logout: appLogout, 
    setIsAuthModalOpen,
    sendPushNotification
  } = useApp();
  
  const { profile, logout: authLogout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isLogoutConfirmOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLogoutConfirmOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLogoutConfirmOpen, setIsLogoutConfirmOpen]);

  if (!isLogoutConfirmOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // 1. Sign out Firebase Auth
      await authLogout();
    } catch (e) {
      console.warn('Firebase logout notice:', e);
    }

    try {
      // 2. Clear App Context session state
      appLogout();
    } catch (e) {
      console.warn('App logout notice:', e);
    }

    try {
      // 3. Clear stored sessions, tokens, and verification flags
      localStorage.removeItem('khodam_auth_user');
      localStorage.removeItem('khodam_active_session');
      localStorage.removeItem('khodam_phone_verified');
      sessionStorage.removeItem('khodam_admin_auth');
    } catch (e) {}

    setIsSubmitting(false);
    setIsLogoutConfirmOpen(false);

    // 4. Open login modal / redirect to login screen
    setIsAuthModalOpen(true);

    // 5. Notify user
    sendPushNotification({
      title: 'تسجيل الخروج',
      message: 'تم تسجيل الخروج ومسح بيانات الجلسة بنجاح 👋',
      type: 'announcement',
      audience: 'all'
    });
  };

  const displayName = profile?.displayName || currentUser?.name || 'المستخدم';
  const displayAvatar = profile?.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const displayPhone = profile?.phone || currentUser?.phone || '';

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={() => !isSubmitting && setIsLogoutConfirmOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 my-8 text-right transition-all select-none"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#C62828] flex items-center justify-center shrink-0 border border-red-200/60 dark:border-red-900/40">
              <LogOut className="w-6 h-6 rtl:rotate-180" strokeWidth={2} />
            </div>
            <div>
              <h3 id="logout-dialog-title" className="text-base sm:text-lg font-bold text-[#1C2421] dark:text-white leading-tight">
                هل تريد تسجيل الخروج؟
              </h3>
              <p className="text-xs text-[#5B6660] dark:text-slate-400 mt-1">
                تأكيد إنهاء الجلسة ومسح البيانات المحفوظة
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setIsLogoutConfirmOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Account Card */}
        <div className="flex items-center gap-3 p-3.5 bg-[#EEF6F1] dark:bg-slate-800/60 rounded-xl border border-[#DDE3DF] dark:border-slate-700">
          <img
            src={displayAvatar}
            alt={displayName}
            className="w-11 h-11 rounded-full object-cover border border-[#0F6B3F] shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm font-bold text-[#1C2421] dark:text-white truncate">
              {displayName}
            </div>
            <div className="text-[11px] text-[#5B6660] dark:text-slate-400 font-mono truncate dir-ltr text-right">
              {displayPhone || 'جلسة نشطة معتمدة'}
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#0A4D2E] border border-[#DDE3DF] shrink-0">
            حساب نشط
          </span>
        </div>

        {/* Warning Info */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            سيتم مسح بيانات التوكن والبيانات المؤقتة من هذا الجهاز. سيتعين عليك تسجيل الدخول مرة أخرى للوصول إلى طلباتك ورسائلك.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setIsLogoutConfirmOpen(false)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 text-center"
          >
            إلغاء
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#C62828] hover:bg-[#A82020] text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-4 h-4 rtl:rotate-180" />
            <span>{isSubmitting ? 'جاري تسجيل الخروج...' : 'تأكيد تسجيل الخروج'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
