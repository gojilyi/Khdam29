import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Smartphone, AlertCircle, ArrowLeft, KeyRound, Loader2, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationResult } from 'firebase/auth';
import { checkRateLimit, normalizeAlgerianPhone, mapAuthError, AuthErrorInfo, isAppOrWebView } from '../../services/authService';
import { AuthorizedDomainAlert } from './AuthorizedDomainAlert';
import { InAppSocialHelper } from './InAppSocialHelper';

interface LoginProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  onStartOtp: (phone: string, result: ConfirmationResult) => void;
  onSuccess: () => void;
  onNeedRoleSelection: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onSwitchToRegister,
  onForgotPassword,
  onStartOtp,
  onSuccess,
  onNeedRoleSelection
}) => {
  const { 
    loginWithEmail, 
    loginWithGoogle, 
    loginWithFacebook, 
    loginWithSocialBypass,
    loginAsGuest, 
    requestPhoneOtp, 
    authModalPrompt 
  } = useAuth();

  const isApp = isAppOrWebView();
  const [showInAppHelper, setShowInAppHelper] = useState<boolean>(isApp);
  const [activeSocialFailedProvider, setActiveSocialFailedProvider] = useState<'google' | 'facebook' | 'both'>('both');

  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('0550123456');

  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [error, setError] = useState<AuthErrorInfo | null>(null);

  const rateLimit = checkRateLimit();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rateLimit.isLocked) {
      setError({
        message: `تم حظر المحاولات مؤقتاً لحمايتك. حاول مجدداً بعد ${rateLimit.remainingMinutes} دقيقة.`,
        code: 'auth/too-many-requests'
      });
      return;
    }

    if (!email.trim() || !password) {
      setError({ message: 'يرجى ملء جميع الحقول المطلوبة' });
      return;
    }

    setLoading(true);
    setLoadingType('email');
    setError(null);
    try {
      await loginWithEmail(email.trim(), password);
      onSuccess();
    } catch (err: any) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handlePhoneStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rateLimit.isLocked) {
      setError({
        message: `تم حظر المحاولات مؤقتاً لحمايتك. حاول مجدداً بعد ${rateLimit.remainingMinutes} دقيقة.`,
        code: 'auth/too-many-requests'
      });
      return;
    }

    const check = normalizeAlgerianPhone(phone);
    if (!check.isValid) {
      setError({ message: check.error || 'رقم هاتف جزائري غير صالح' });
      return;
    }

    setLoading(true);
    setLoadingType('phone');
    setError(null);
    try {
      const confirmation = await requestPhoneOtp(phone, 'recaptcha-container');
      onStartOtp(phone, confirmation);
    } catch (err: any) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setLoadingType('google');
    setError(null);
    try {
      const res = await loginWithGoogle();
      if (res.isNewUser || !res.profile) {
        onNeedRoleSelection();
      } else {
        onSuccess();
      }
    } catch (err: any) {
      const mapped = mapAuthError(err);
      setError(mapped);
      setActiveSocialFailedProvider('google');
      setShowInAppHelper(true);
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    setLoadingType('facebook');
    setError(null);
    try {
      const res = await loginWithFacebook();
      if (res.isNewUser || !res.profile) {
        onNeedRoleSelection();
      } else {
        onSuccess();
      }
    } catch (err: any) {
      const mapped = mapAuthError(err);
      setError(mapped);
      setActiveSocialFailedProvider('facebook');
      setShowInAppHelper(true);
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setLoadingType('guest');
    setError(null);
    try {
      await loginAsGuest();
      onSuccess();
    } catch (err: any) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Contextual prompt if redirected from an action */}
      {authModalPrompt && (
        <div className="p-3 bg-[#EEF6F1] border border-[#0F6B3F]/20 text-[#0A4D2E] text-[12px] rounded-[8px] flex items-center gap-2">
          <UserCheck className="w-4 h-4 shrink-0 text-[#0F6B3F]" strokeWidth={1.75} />
          <span>{authModalPrompt}</span>
        </div>
      )}

      {/* In-App WebView Fast Login Assistant */}
      {showInAppHelper && (
        <InAppSocialHelper
          provider={activeSocialFailedProvider}
          onSuccess={onSuccess}
          onNeedRoleSelection={onNeedRoleSelection}
        />
      )}

      {/* Error Banner with Real Error Code */}
      {error && !showInAppHelper && (
        (error.code === 'auth/unauthorized-domain' || error.code === 'auth/token-service-api-disabled') ? (
          <AuthorizedDomainAlert 
            code={error.code}
            customMessage={error.message}
            onBypass={() => {
              loginWithSocialBypass('google');
              onSuccess();
            }}
            onSwitchToEmailForm={() => {
              setLoginMethod('email');
              const emailInput = document.getElementById('login-email-input');
              emailInput?.focus();
            }} 
          />
        ) : (
          <div className="p-3 bg-red-50 border border-red-200 text-[#C62828] text-[12px] rounded-[8px] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} />
            <div className="flex-1 space-y-1">
              <p className="font-medium leading-relaxed">{error.message}</p>
              {error.code && (
                <div className="pt-0.5">
                  <span className="inline-block text-[10px] font-mono px-1.5 py-0.5 bg-red-100 text-red-900 rounded border border-red-200" dir="ltr">
                    code: {error.code}
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* 1. Google Button (Official colors and logo) */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full h-11 min-h-[44px] px-4 bg-white hover:bg-[#F8FAF9] active:bg-[#EEF6F1] border border-[#DDE3DF] text-[#1C2421] font-bold rounded-[8px] text-[13px] flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(28,36,33,0.05)]"
      >
        {loadingType === 'google' ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#0F6B3F]" />
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        )}
        <span>المتابعة باستخدام Google</span>
      </button>

      {/* 2. Facebook Button (Official Facebook brand color #1877F2 and icon) */}
      <button
        type="button"
        onClick={handleFacebookLogin}
        disabled={loading}
        className="w-full h-11 min-h-[44px] px-4 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold rounded-[8px] text-[13px] flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(24,119,242,0.2)]"
      >
        {loadingType === 'facebook' ? (
          <Loader2 className="w-4 h-4 animate-spin text-white" />
        ) : (
          <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )}
        <span>المتابعة باستخدام Facebook</span>
      </button>

      {/* Divider */}
      <div className="relative my-3 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#DDE3DF]" /></div>
        <span className="relative bg-white px-3 text-[11px] text-[#5B6660]">أو تسجيل الدخول عبر</span>
      </div>

      {/* Switcher: Phone (SMS) vs Email */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#EEF6F1] rounded-[8px]">
        {/* 3. Phone (SMS) */}
        <button
          type="button"
          onClick={() => setLoginMethod('phone')}
          className={`h-9 min-h-[36px] text-[12px] font-bold rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            loginMethod === 'phone' ? 'bg-white text-[#0A4D2E] shadow-xs' : 'text-[#5B6660]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>رقم الهاتف (SMS)</span>
        </button>

        {/* 4. Email */}
        <button
          type="button"
          onClick={() => setLoginMethod('email')}
          className={`h-9 min-h-[36px] text-[12px] font-bold rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            loginMethod === 'email' ? 'bg-white text-[#0A4D2E] shadow-xs' : 'text-[#5B6660]'
          }`}
        >
          <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>البريد الإلكتروني</span>
        </button>
      </div>

      {/* Phone Form */}
      {loginMethod === 'phone' ? (
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
                className="w-full h-11 min-h-[44px] bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-10 text-[13px] font-mono text-[#1C2421] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F]"
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
            className="w-full h-11 min-h-[44px] bg-[#0F6B3F] hover:bg-[#0A4D2E] disabled:opacity-50 text-white font-bold rounded-[8px] text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
          >
            {loadingType === 'phone' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4" strokeWidth={1.75} />
            )}
            <span>{loadingType === 'phone' ? 'جاري إرسال الرمز...' : 'إرسال رمز التحقق (SMS)'}</span>
          </button>
        </form>
      ) : (
        /* Email Form */
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
                className="w-full h-11 min-h-[44px] bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-10 text-[13px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F]"
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
                className="w-full h-11 min-h-[44px] bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-10 pl-10 text-[13px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F]"
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
            className="w-full h-11 min-h-[44px] bg-[#0F6B3F] hover:bg-[#0A4D2E] disabled:opacity-50 text-white font-bold rounded-[8px] text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
          >
            <span>{loadingType === 'email' ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
            {loadingType === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />}
          </button>
        </form>
      )}

      {/* 5. Guest / Anonymous Browse Link */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={loading}
          className="text-[12px] font-bold text-[#5B6660] hover:text-[#0F6B3F] transition-colors cursor-pointer py-1.5 underline decoration-[#DDE3DF] underline-offset-4"
        >
          {loadingType === 'guest' ? 'جاري الدخول كزائر...' : 'تصفّح كزائر دون تسجيل'}
        </button>
      </div>

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
