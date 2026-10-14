import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Smartphone, 
  UserX, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  UserCheck, 
  Briefcase,
  KeyRound
} from 'lucide-react';
import { AuthMethod, Role } from '../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithMethod, t, language } = useApp();

  const [selectedRole, setSelectedRole] = useState<Role>('client');
  const [activeScreen, setActiveScreen] = useState<'methods' | 'sms_otp' | 'email_form'>('methods');
  
  // Phone & OTP state
  const [phoneNumber, setPhoneNumber] = useState('0550 12 34 56');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleStartSms = () => {
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
      setActiveScreen('sms_otp');
    }, 800);
  };

  const handleOtpConfirm = () => {
    loginWithMethod('sms', {
      phone: `+213 ${phoneNumber}`,
      name: selectedRole === 'client' ? 'هشام بن علي' : 'المعلم كمال بلقاسم',
      role: selectedRole
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithMethod('email', {
      name: fullName || 'مستخدم مسجل',
      email: email || 'user@khodam.dz',
      role: selectedRole
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute rtl:left-4 ltr:right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {language === 'ar' ? 'تسجيل الدخول إلى خـدّام' : 'Login to Khodam'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar' ? 'اختر الطريقة الأنسب لك للوصول إلى شبكة الخدمات والحرفيين' : 'Choose your preferred login method'}
          </p>
        </div>

        {/* Role Segmented Selector: Client vs Artisan */}
        <div className="mt-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setSelectedRole('client')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'client'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'ar' ? 'حساب عميل (طالب خدمة)' : 'Client Account'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('artisan')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'artisan'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'ar' ? 'حساب حرفي (مقدم خدمة)' : 'Artisan Account'}</span>
          </button>
        </div>

        {/* SCREEN 1: ALL AUTH METHODS */}
        {activeScreen === 'methods' && (
          <div className="space-y-3 mt-5">
            {/* 1. Google One-Tap */}
            <button
              onClick={() => loginWithMethod('google', { role: selectedRole })}
              className="w-full h-11 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-3 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{language === 'ar' ? 'المتابعة باستخدام قوقل (Google)' : 'Continue with Google'}</span>
            </button>

            {/* 2. Facebook */}
            <button
              onClick={() => loginWithMethod('facebook', { role: selectedRole })}
              className="w-full h-11 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-3 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>{language === 'ar' ? 'المتابعة بحساب فيسبوك (Facebook)' : 'Continue with Facebook'}</span>
            </button>

            {/* 3. SMS Message with Phone OTP */}
            <div className="pt-1">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    dir="ltr"
                    value={phoneNumber}
                    onChange={(e) => {
                      const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
                      const val = e.target.value.replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d).toString());
                      setPhoneNumber(val);
                    }}
                    placeholder="0550 12 34 56"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-left"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleStartSms}
                  disabled={isSendingOtp}
                  className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{isSendingOtp ? 'جاري الإرسال...' : (language === 'ar' ? 'رمز SMS' : 'Get SMS')}</span>
                </button>
              </div>
            </div>

            <div className="relative my-3 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
              <span className="relative bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400">
                {language === 'ar' ? 'أو طرق بديلة' : 'or alternative methods'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* 4. Anonymous Guest */}
              <button
                onClick={() => loginWithMethod('anonymous', { role: selectedRole })}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserX className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'ar' ? 'دخول كزائر (مجهول)' : 'Guest / Anonymous'}</span>
              </button>

              {/* 5. Email & Password trigger */}
              <button
                onClick={() => setActiveScreen('email_form')}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'ar' ? 'البريد الإلكتروني' : 'Email & Pass'}</span>
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: SMS OTP VERIFICATION */}
        {activeScreen === 'sms_otp' && (
          <div className="space-y-4 mt-5 text-center">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200">
              {language === 'ar' 
                ? `تم إرسال رسالة SMS تحتوي على كود التحقق إلى الرقم ${phoneNumber}` 
                : `SMS verification code sent to ${phoneNumber}`}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                {language === 'ar' ? 'أدخل كود التحقق (4 أرقام):' : 'Enter 4-digit verification code:'}
              </label>
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={otpCode[idx] || (idx === 0 ? '7' : idx === 1 ? '4' : idx === 2 ? '2' : '9')}
                    onChange={(e) => {
                      const next = [...otpCode];
                      next[idx] = e.target.value;
                      setOtpCode(next);
                    }}
                    className="w-12 h-12 text-center text-lg font-mono font-bold bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleOtpConfirm}
              className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'تأكيد الرمز والدخول' : 'Verify Code & Enter'}</span>
            </button>

            <button
              onClick={() => setActiveScreen('methods')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline block mx-auto"
            >
              {language === 'ar' ? 'الرجوع لطرق الدخول الأخرى' : 'Back to other methods'}
            </button>
          </div>
        )}

        {/* SCREEN 3: EMAIL & PASSWORD FORM */}
        {activeScreen === 'email_form' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5 mt-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'الاسم الكامل:' : 'Full Name:'}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: يوسف العربي"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'البريد الإلكتروني:' : 'Email Address:'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.dz"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'كلمة المرور:' : 'Password:'}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <span>{language === 'ar' ? 'متابعة الدخول' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <button
              type="button"
              onClick={() => setActiveScreen('methods')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline block mx-auto pt-1"
            >
              {language === 'ar' ? 'الرجوع لاختيار طريقة أخرى' : 'Back to all options'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
