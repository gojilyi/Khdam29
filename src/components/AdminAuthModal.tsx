import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Key, AlertCircle, X, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

export const AdminAuthModal: React.FC = () => {
  const {
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    checkAdminPassword,
    language
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || isVerifying) return;

    setIsVerifying(true);
    setAuthError(false);

    try {
      const isValid = await checkAdminPassword(passwordInput);
      if (isValid) {
        setPasswordInput('');
        setAuthError(false);
      } else {
        setAuthError(true);
      }
    } catch {
      setAuthError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative text-center">
        <button
          onClick={() => {
            setIsAdminAuthModalOpen(false);
            setAuthError(false);
            setPasswordInput('');
          }}
          className="absolute rtl:left-4 ltr:right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer transition-colors"
          title={language === 'ar' ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/30 shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-1">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            {language === 'ar' ? 'بوابة الإدارة المركزية (المشرف)' : 'Admin Restricted Portal'}
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          {language === 'ar' 
            ? 'تم استدعاء شاشة الإدارة بعد النقر 7 مرات على زر الخدم. أدخل كلمة سر المشرف المشفرة للمتابعة.' 
            : 'Access summoned via 7-tap Khodam trigger. Enter encrypted admin password to continue.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoFocus
              required
              placeholder="••••••••••••"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setAuthError(false);
              }}
              className={`w-full text-center px-10 py-3 bg-slate-50 dark:bg-slate-800/90 border rounded-xl text-sm font-mono tracking-widest text-slate-900 dark:text-white focus:outline-none transition-all ${
                authError 
                  ? 'border-rose-500 ring-2 ring-rose-500/20' 
                  : 'border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
              title={showPassword ? (language === 'ar' ? 'إخفاء كلمة السر' : 'Hide password') : (language === 'ar' ? 'إظهار كلمة السر' : 'Show password')}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {authError && (
            <div className="text-xs text-rose-500 font-semibold flex items-center justify-center gap-1.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{language === 'ar' ? 'كلمة السر غير صحيحة، تم رفض الوصول.' : 'Invalid password, access denied.'}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying || !passwordInput.trim()}
            className="w-full h-11 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer shadow-amber-500/20"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'ar' ? 'جارٍ التحقق المشفر...' : 'Verifying hash...'}</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>{language === 'ar' ? 'التحقق وفتح لوحة الإدارة' : 'Authenticate & Unlock'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
