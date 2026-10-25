import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Smartphone, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationResult } from 'firebase/auth';
import { checkRateLimit, normalizeAlgerianPhone, translateFirebaseError, UserRole } from '../../services/authService';

interface LoginProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  onStartOtp: (phone: string, result: ConfirmationResult) => void;
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onSwitchToRegister,
  onForgotPassword,
  onStartOtp,
  onSuccess
}) => {
  const { loginWithEmail, loginWithGoogle, requestPhoneOtp } = useAuth();

  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('0550123456');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check rate limit on render
  const rateLimit = checkRateLimit();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rateLimit.isLocked) {
      setError(`تم حظر المحاولات مؤقتاً لحمايتك. حاول مجدداً بعد ${rateLimit.remainingMinutes} دقيقة.`);
      return;
    }

    if (!email.trim() || !password) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await loginWithEmail(email.trim(), password);
      onSuccess();
    } catch (err: any) {
      setError(translateFirebaseError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rateLimit.isLocked) {
      setError(`تم حظر المحاولات مؤقتاً لحمايتك. حاول مجدداً بعد ${rateLimit.remainingMinutes} دقيقة.`);
      return;
    }

    const check = normalizeAlgerianPhone(phone);
    if (!check.isValid) {
      setError(check.error || 'رقم هاتف غير صالح');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const confirmation = await requestPhoneOtp(phone, 'recaptcha-container');
      onStartOtp(phone, confirmation);
    } catch (err: any) {
      setError(translateFirebaseError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle('client');
      onSuccess();
    } catch (err: any) {
      setError(translateFirebaseError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-[#C62828] text-[12px] rounded-[8px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span>{error}</span>
        </div>
      )}

      {/* Google 1-Click Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full h-11 px-4 bg-white hover:bg-[#EEF6F1] border border-[#DDE3DF] text-[#1C2421] font-bold rounded-[8px] text-[13px] flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(28,36,33,0.05)]"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>المتابعة باستخدام Google</span>
      </button>

      <div className="relative my-3 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#DDE3DF]" /></div>
        <span className="relative bg-white px-3 text-[11px] text-[#5B6660]">أو الدخول عبر</span>
      </div>

      {/* Switcher: Email vs Phone */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#EEF6F1] rounded-[8px]">
        <button
          type="button"
          onClick={() => setLoginMethod('email')}
          className={`h-9 text-[12px] font-bold rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            loginMethod === 'email' ? 'bg-white text-[#0A4D2E] shadow-xs' : 'text-[#5B6660]'
          }`}
        >
          <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>البريد الإلكتروني</span>
        </button>

        <button
          type="button"
          onClick={() => setLoginMethod('phone')}
          className={`h-9 text-[12px] font-bold rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            loginMethod === 'phone' ? 'bg-white text-[#0A4D2E] shadow-xs' : 'text-[#5B6660]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>رقم الهاتف (SMS)</span>
        </button>
      </div>

      {/* 1. Email Form */}
      {loginMethod === 'email' ? (
        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div>
            <label className="block text-[12px] font-bold text-[#1C2421] mb-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="name@example.dz"
                className="w-full h-11 bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-10 text-[13px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F]"
              />
              <Mail className="w-4 h-4 text-[#5B6660] absolute right-3 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[12px] font-bold text-[#1C2421]">
                كلمة المرور
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[11px] font-bold text-[#0F6B3F] hover:underline cursor-pointer"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••••"
                className="w-full h-11 bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-10 pl-10 text-[13px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F]"
              />
              <Lock className="w-4 h-4 text-[#5B6660] absolute right-3 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5B6660] hover:text-[#1C2421] p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.75} /> : <Eye className="w-4 h-4" strokeWidth={1.75} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#0F6B3F] hover:bg-[#0A4D2E] disabled:opacity-50 text-white font-bold rounded-[8px] text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
          >
            <span>{loading ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </form>
      ) : (
        /* 2. Phone Form */
        <form onSubmit={handlePhoneStart} className="space-y-3">
          <div>
            <label className="block text-[12px] font-bold text-[#1C2421] mb-1">
              رقم الهاتف الجزائري (05 / 06 / 07)
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                dir="ltr"
                value={phone}
                onChange={(e) => {
                  const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
                  const val = e.target.value.replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d).toString());
                  setPhone(val);
                  setError(null);
                }}
                placeholder="0550 12 34 56"
                className="w-full h-11 bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-10 text-[13px] font-mono text-[#1C2421] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F]"
              />
              <Smartphone className="w-4 h-4 text-[#5B6660] absolute right-3 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            </div>
            <p className="text-[11px] text-[#5B6660] mt-1">
              سنرسل رسالة نصية قصيرة SMS تحتوي رمز التأكيد السري.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#0F6B3F] hover:bg-[#0A4D2E] disabled:opacity-50 text-white font-bold rounded-[8px] text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
          >
            <KeyRound className="w-4 h-4" strokeWidth={1.75} />
            <span>{loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق (SMS)'}</span>
          </button>
        </form>
      )}

      {/* Switch to Register */}
      <div className="pt-3 border-t border-[#DDE3DF] text-center">
        <p className="text-[12px] text-[#5B6660]">
          ليس لديك حساب بعد؟{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-[#0F6B3F] hover:text-[#0A4D2E] hover:underline cursor-pointer"
          >
            إنشاء حساب جديد
          </button>
        </p>
      </div>
    </div>
  );
};
