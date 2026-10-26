import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Wrench, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Clock,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { normalizeAlgerianPhone, mapAuthError, AuthErrorInfo, UserRole } from '../../services/authService';
import { AuthorizedDomainAlert } from './AuthorizedDomainAlert';

interface RegisterProps {
  role: UserRole;
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

const TRADES = [
  'سبّاك',
  'كهربائي',
  'نجّار',
  'دهّان',
  'فني تكييف',
  'بنّاء',
  'حدّاد',
  'ميكانيكي',
  'تبليط',
  'فني ألمنيوم',
  'طباخة وحلويات منزلية',
  'تمريض ورعاية صحية منزلية',
  'شحن ألعاب وبطاقات رقمية',
  'اشتراكات قنوات وIPTV',
  'أرصدة إلكترونية وفليكسي',
  'خياطة وتفصيل أزياء',
  'تجميل وحلاقة نسائية ونقش حناء',
  'رعاية أطفال ومربيات (Nounou)',
  'نقل البضائع والعفش (ديمينجمون)',
  'ديباناج وسحب سيارات 24/7',
  'فلاح وبستاني (أشغال فلاحية)',
  'تنظيف منزلي وغسيل سجاد',
  'تصليح هواتف وكمبيوتر',
  'كاميرات مراقبة وأنظمة إنذار',
  'غسيل وتلميع سيارات متنقل',
  'أقفال وتصليح أبواب ومفاتيح'
];

const WILAYAS = [
  'الجزائر العاصمة',
  'وهران',
  'قسنطينة',
  'عنابة',
  'سطيف',
  'البليدة',
  'تيزي وزو',
  'بجاية',
  'باتنة',
  'بومرداس',
  'تيبازة',
  'الشلف',
  'تلمسان',
  'بسكرة'
];

export const Register: React.FC<RegisterProps> = ({ role, onSwitchToLogin, onSuccess }) => {
  const { 
    registerWithEmail, 
    loginWithGoogle, 
    loginWithFacebook, 
    loginWithSocialBypass,
    loginAsGuest, 
    completeInitialProfile 
  } = useAuth();

  // Wizard step for craftsman (1, 2, 3)
  const [step, setStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('0550123456');
  const [wilaya, setWilaya] = useState('الجزائر العاصمة');
  const [commune, setCommune] = useState('الأبيار');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatar] = useState('https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80');

  // Craftsman specific
  const [trade, setTrade] = useState('سبّاك');
  const [experienceYears, setExperienceYears] = useState(5);
  const [selectedWilayas, setSelectedWilayas] = useState<string[]>(['الجزائر العاصمة', 'البليدة']);
  const [approxPrice, setApproxPrice] = useState(2500);
  const [bio, setBio] = useState('حرفي معتمد بخبرة في الصيانة المنزلية والإصلاحات الدقيقة.');
  
  // At least 3 portfolio images
  const [portfolioImages, setPortfolioImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=600&auto=format&fit=crop&q=80'
  ]);
  const [newImageInput, setNewImageInput] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<AuthErrorInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string | null>(null);

  const toggleWilaya = (w: string) => {
    if (selectedWilayas.includes(w)) {
      if (selectedWilayas.length > 1) {
        setSelectedWilayas(selectedWilayas.filter(item => item !== w));
      }
    } else {
      setSelectedWilayas([...selectedWilayas, w]);
    }
  };

  const addPortfolioImage = () => {
    if (newImageInput.trim()) {
      setPortfolioImages([...portfolioImages, newImageInput.trim()]);
      setNewImageInput('');
    }
  };

  const removePortfolioImage = (index: number) => {
    setPortfolioImages(portfolioImages.filter((_, i) => i !== index));
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'يرجى إدخال الاسم الكامل (حرفين على الأقل)';
    }

    const phoneCheck = normalizeAlgerianPhone(phone);
    if (!phoneCheck.isValid) {
      errs.phone = phoneCheck.error || 'رقم هاتف جزائري غير صالح';
    }

    if (!email.trim() || !email.includes('@')) {
      errs.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    if (!password || password.length < 6) {
      errs.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!trade) {
      errs.trade = 'يرجى اختيار مهنتك الرئيسية';
    }
    if (experienceYears < 0) {
      errs.experienceYears = 'سنوات الخبرة غير صحيحة';
    }
    if (selectedWilayas.length === 0) {
      errs.wilayas = 'يرجى اختيار ولاية واحدة على الأقل للتغطية';
    }
    if (!approxPrice || approxPrice < 500) {
      errs.approxPrice = 'التسعيرة يجب أن تكون 500 دج على الأقل';
    }
    if (!bio.trim() || bio.trim().length < 10) {
      errs.bio = 'يرجى كتابة نبذة توضيحية لخبرتك (10 أحرف على الأقل)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (portfolioImages.length < 3) {
      errs.portfolio = `يجب توفير 3 صور لأعمالك السابقة على الأقل (حالياً ${portfolioImages.length} صور)`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (role === 'client') {
      if (!validateStep1()) return;
    } else {
      // Craftsman registration flow: advance step if not on step 3
      if (step === 1) {
        if (validateStep1()) {
          setStep(2);
        }
        return;
      }
      if (step === 2) {
        if (validateStep2()) {
          setStep(3);
        }
        return;
      }
      // On Step 3: ensure all previous steps are valid
      if (!validateStep1()) {
        setStep(1);
        return;
      }
      if (!validateStep2()) {
        setStep(2);
        return;
      }
      if (!validateStep3()) {
        return;
      }
    }

    setLoading(true);
    setLoadingType('email');
    try {
      const phoneNorm = normalizeAlgerianPhone(phone).normalized;
      await registerWithEmail(email.trim(), password, {
        role,
        displayName: fullName.trim(),
        phone: phoneNorm,
        wilaya,
        commune,
        avatar,
        trade: role === 'craftsman' ? trade : undefined,
        experienceYears: role === 'craftsman' ? experienceYears : undefined,
        wilayas: role === 'craftsman' ? selectedWilayas : undefined,
        approximatePriceDzd: role === 'craftsman' ? approxPrice : undefined,
        bio: role === 'craftsman' ? bio : undefined,
        portfolioImages: role === 'craftsman' ? (portfolioImages.length > 0 ? portfolioImages : [
          'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=600&auto=format&fit=crop&q=80'
        ]) : undefined,
        isProfileComplete: true
      });
      onSuccess();
    } catch (err: any) {
      setGeneralError(mapAuthError(err));
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setLoadingType('google');
    setGeneralError(null);
    try {
      const res = await loginWithGoogle();
      if (!res.profile) {
        await completeInitialProfile(role, fullName.trim() || undefined);
      }
      onSuccess();
    } catch (err: any) {
      setGeneralError(mapAuthError(err));
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleFacebookRegister = async () => {
    setLoading(true);
    setLoadingType('facebook');
    setGeneralError(null);
    try {
      const res = await loginWithFacebook();
      if (!res.profile) {
        await completeInitialProfile(role, fullName.trim() || undefined);
      }
      onSuccess();
    } catch (err: any) {
      setGeneralError(mapAuthError(err));
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleGuestRegister = async () => {
    setLoading(true);
    setLoadingType('guest');
    setGeneralError(null);
    try {
      await loginAsGuest();
      onSuccess();
    } catch (err: any) {
      setGeneralError(mapAuthError(err));
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Role Banner */}
      <div className="p-3 bg-[#EEF6F1] border border-[#DDE3DF] rounded-[8px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[6px] bg-[#0F6B3F] text-white flex items-center justify-center shrink-0">
            {role === 'craftsman' ? <Wrench className="w-4 h-4" strokeWidth={1.75} /> : <User className="w-4 h-4" strokeWidth={1.75} />}
          </div>
          <div>
            <span className="text-[11px] text-[#5B6660] block">أنت تسجل الآن كـ:</span>
            <span className="text-[13px] font-bold text-[#0A4D2E]">
              {role === 'craftsman' ? 'حرفي معتمد (مقدم خدمة)' : 'طالب خدمة (زبون)'}
            </span>
          </div>
        </div>
      </div>

      {/* Social Register Buttons on Step 1 */}
      {step === 1 && (
        <div className="space-y-2">
          {/* 1. Google */}
          <button
            type="button"
            onClick={handleGoogleRegister}
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
            <span>التسجيل السريع عبر Google</span>
          </button>

          {/* 2. Facebook */}
          <button
            type="button"
            onClick={handleFacebookRegister}
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
            <span>التسجيل السريع عبر Facebook</span>
          </button>

          <div className="relative my-2 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#DDE3DF]" /></div>
            <span className="relative bg-white px-3 text-[11px] text-[#5B6660]">أو التسجيل بالبيانات الكاملة</span>
          </div>
        </div>
      )}

      {/* Craftsman 3-Step Progress Bar */}
      {role === 'craftsman' && (
        <div className="space-y-1.5 pb-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#5B6660]">
            <span className={step >= 1 ? 'text-[#0F6B3F]' : ''}>1. البيانات الشخصية</span>
            <span className={step >= 2 ? 'text-[#0F6B3F]' : ''}>2. المهنة والخبرة</span>
            <span className={step >= 3 ? 'text-[#0F6B3F]' : ''}>3. معرض الأعمال</span>
          </div>
          <div className="h-1.5 w-full bg-[#DDE3DF] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0F6B3F] transition-all duration-300" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* General Error Banner with Error Code */}
      {generalError && (
        (generalError.code === 'auth/unauthorized-domain' || generalError.code === 'auth/token-service-api-disabled') ? (
          <AuthorizedDomainAlert 
            code={generalError.code}
            customMessage={generalError.message}
            onBypass={() => {
              loginWithSocialBypass('google', role, fullName.trim() || undefined);
              onSuccess();
            }}
            onSwitchToEmailForm={() => {
              const formEl = document.getElementById('register-fullname-input');
              formEl?.focus();
            }} 
          />
        ) : (
          <div className="p-3 bg-red-50 border border-red-200 text-[#C62828] text-[12px] rounded-[8px] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} />
            <div className="flex-1 space-y-1">
              <p className="font-medium leading-relaxed">{generalError.message}</p>
              {generalError.code && (
                <div className="pt-0.5">
                  <span className="inline-block text-[10px] font-mono px-1.5 py-0.5 bg-red-100 text-red-900 rounded border border-red-200" dir="ltr">
                    code: {generalError.code}
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* FORM: Client or Step 1 of Craftsman */}
      {(role === 'client' || step === 1) && (
        <form onSubmit={role === 'client' ? handleFinalSubmit : (e) => { e.preventDefault(); handleNextStep(); }} className="space-y-3">
          {/* Full Name */}
          <div>
            <label className="block text-[12px] font-bold text-[#1C2421] mb-1">
              الاسم الكامل <span className="text-[#C62828]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: '' })); }}
                placeholder="مثال: يوسف العربي"
                className="w-full h-11 min-h-[44px] bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-10 text-[13px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F]"
              />
              <User className="w-4 h-4 text-[#5B6660] absolute right-3 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            </div>
            {errors.fullName && <p className="text-[11px] text-[#C62828] mt-1">{errors.fullName}</p>}
          </div>

          {/* Algerian Phone */}
          <div>
            <label className="block text-[12px] font-bold text-[#1C2421] mb-1">
              رقم الهاتف الجزائري (05 / 06 / 07) <span className="text-[#C62828]">*</span>
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
                  setErrors(p => ({ ...p, phone: '' }));
                }}
                placeholder="0550 12 34 56"
                className="w-full h-11 min-h-[44px] bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-10 text-[13px] font-mono text-[#1C2421] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F]"
              />
              <Smartphone className="w-4 h-4 text-[#5B6660] absolute right-3 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            </div>
            {errors.phone && <p className="text-[11px] text-[#C62828] mt-1">{errors.phone}</p>}
          </div>

          {/* Wilaya & Commune */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[12px] font-bold text-[#1C2421] mb-1">الولاية</label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="w-full h-11 min-h-[44px] bg-white border border-[#DDE3DF] rounded-[8px] px-2 text-[12px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F]"
              >
                {WILAYAS.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#1C2421] mb-1">البلدية</label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder="مثال: باب الوادي"
                className="w-full h-11 min-h-[44px] bg-white border border-[#DDE3DF] rounded-[8px] px-3 text-[12px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[12px] font-bold text-[#1C2421] mb-1">
              البريد الإلكتروني <span className="text-[#C62828]">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                placeholder="name@example.dz"
                className="w-full h-11 min-h-[44px] bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-10 text-[13px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F]"
              />
              <Mail className="w-4 h-4 text-[#5B6660] absolute right-3 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            </div>
            {errors.email && <p className="text-[11px] text-[#C62828] mt-1">{errors.email}</p>}
          </div>

          {/* Password (8 characters) */}
          <div>
            <label className="block text-[12px] font-bold text-[#1C2421] mb-1">
              كلمة المرور (8 أحرف أو أكثر) <span className="text-[#C62828]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
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
            {errors.password && <p className="text-[11px] text-[#C62828] mt-1">{errors.password}</p>}
          </div>

          {/* Action button */}
          {role === 'client' ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 min-h-[44px] bg-[#0F6B3F] hover:bg-[#0A4D2E] disabled:opacity-50 text-white font-bold rounded-[8px] text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer mt-3"
            >
              {loadingType === 'email' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />}
              <span>{loadingType === 'email' ? 'جاري إنشاء الحساب...' : 'إنشاء حساب طالب خدمة'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full h-11 min-h-[44px] bg-[#0F6B3F] hover:bg-[#0A4D2E] text-white font-bold rounded-[8px] text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer mt-3"
            >
              <span>المتابعة إلى بيانات المهنة (الخطوة 2)</span>
              <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            </button>
          )}
        </form>
      )}

      {/* CRAFTSMAN STEP 2: Trade, Experience, Pricing */}
      {role === 'craftsman' && step === 2 && (
        <div className="space-y-3">
          {/* Trade Select */}
          <div>
            <label className="block text-[12px] font-bold text-[#1C2421] mb-1">
              المهنة الرئيسية <span className="text-[#C62828]">*</span>
            </label>
            <select
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full h-11 min-h-[44px] bg-white border border-[#DDE3DF] rounded-[8px] px-3 text-[13px] text-[#1C2421] font-bold focus:outline-none focus:border-[#0F6B3F]"
            >
              {TRADES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.trade && <p className="text-[11px] text-[#C62828] mt-1">{errors.trade}</p>}
          </div>

          {/* Experience Years & Price */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[12px] font-bold text-[#1C2421] mb-1">سنوات الخبرة</label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                  className="w-full h-11 min-h-[44px] bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-8 text-[13px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F]"
                />
                <Clock className="w-4 h-4 text-[#5B6660] absolute right-2.5 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#1C2421] mb-1">التسعيرة التقريبية (دج)</label>
              <div className="relative">
                <input
                  type="number"
                  step={100}
                  min={500}
                  value={approxPrice}
                  onChange={(e) => setApproxPrice(parseInt(e.target.value) || 2500)}
                  className="w-full h-11 min-h-[44px] bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-8 text-[13px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F]"
                />
                <DollarSign className="w-4 h-4 text-[#5B6660] absolute right-2.5 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
              </div>
            </div>
          </div>

          {/* Covered Wilayas */}
          <div>
            <label className="block text-[12px] font-bold text-[#1C2421] mb-1">
              الولايات التي تغطيها بخدماتك ({selectedWilayas.length})
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-[#EEF6F1] border border-[#DDE3DF] rounded-[8px]">
              {WILAYAS.map(w => {
                const isSelected = selectedWilayas.includes(w);
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => toggleWilaya(w)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-[6px] transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F6B3F] text-white shadow-xs'
                        : 'bg-white text-[#5B6660] border border-[#DDE3DF] hover:border-[#0F6B3F]'
                    }`}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
            {errors.wilayas && <p className="text-[11px] text-[#C62828] mt-1">{errors.wilayas}</p>}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[12px] font-bold text-[#1C2421] mb-1">
              نبذة عن خبرتك وكفاءتك المهنية
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => { setBio(e.target.value); setErrors(p => ({ ...p, bio: '' })); }}
              placeholder="مثال: متخصص في ترصيص شبكات المياه النحاسية والـ PPR..."
              className="w-full bg-white border border-[#DDE3DF] rounded-[8px] p-2.5 text-[12px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F]"
            />
            {errors.bio && <p className="text-[11px] text-[#C62828] mt-1">{errors.bio}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-11 min-h-[44px] bg-white hover:bg-[#EEF6F1] border border-[#DDE3DF] text-[#1C2421] font-bold rounded-[8px] text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              <span>الرجوع</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="h-11 min-h-[44px] bg-[#0F6B3F] hover:bg-[#0A4D2E] text-white font-bold rounded-[8px] text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>معرض الأعمال (الخطوة 3)</span>
              <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}

      {/* CRAFTSMAN STEP 3: Portfolio & Gallery (Min 3) */}
      {role === 'craftsman' && step === 3 && (
        <form onSubmit={handleFinalSubmit} className="space-y-3">
          <div className="p-3 bg-[#EEF6F1] border border-[#DDE3DF] rounded-[8px] space-y-1">
            <div className="flex items-center gap-2 text-[12px] font-bold text-[#0A4D2E]">
              <ShieldCheck className="w-4 h-4 text-[#0F6B3F]" strokeWidth={1.75} />
              <span>معرض أعمال الحرفي (3 صور على الأقل)</span>
            </div>
            <p className="text-[11px] text-[#5B6660]">
              صور إنجازاتك السابقة تساعد الزبائن في ولايتك على اختيارك. لا تظهر في دليل البحث العام حتى تكتمل هذه الصور.
            </p>
          </div>

          {/* Portfolio grid */}
          <div className="grid grid-cols-3 gap-2">
            {portfolioImages.map((img, i) => (
              <div key={i} className="relative aspect-video rounded-[8px] overflow-hidden border border-[#DDE3DF] group bg-slate-100">
                <img src={img} alt="عمل سابق" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePortfolioImage(i)}
                  className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#C62828] transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Image Link */}
          <div className="flex gap-2">
            <input
              type="url"
              dir="ltr"
              value={newImageInput}
              onChange={(e) => setNewImageInput(e.target.value)}
              placeholder="https://example.com/work.jpg"
              className="flex-1 h-10 min-h-[40px] bg-white border border-[#DDE3DF] rounded-[8px] px-3 text-[12px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F]"
            />
            <button
              type="button"
              onClick={addPortfolioImage}
              className="h-10 px-3 bg-[#EEF6F1] hover:bg-[#DDE3DF] text-[#0A4D2E] font-bold rounded-[8px] text-[12px] flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" strokeWidth={1.75} />
              <span>إضافة صورة</span>
            </button>
          </div>
          {errors.portfolio && <p className="text-[11px] text-[#C62828]">{errors.portfolio}</p>}

          <div className="p-3 bg-white border border-[#DDE3DF] rounded-[8px] flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8A317] shrink-0" />
            <div className="text-[11px] text-[#5B6660]">
              حالة التوثيق الأولية: <strong className="text-[#1C2421]">قيد المراجعة (Pending)</strong> — ستمنح الشارة الخضراء المعتمدة بعد مراجعة الإدارة السريعة.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="h-11 min-h-[44px] bg-white hover:bg-[#EEF6F1] border border-[#DDE3DF] text-[#1C2421] font-bold rounded-[8px] text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              <span>الرجوع</span>
            </button>

            <button
              type="submit"
              disabled={loading || portfolioImages.length < 3}
              className="h-11 min-h-[44px] bg-[#0F6B3F] hover:bg-[#0A4D2E] disabled:opacity-50 text-white font-bold rounded-[8px] text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />}
              <span>{loading ? 'جاري التسجيل...' : 'إتمام تسجيل الحرفي'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Guest Browse Option */}
      <div className="pt-1 text-center">
        <button
          type="button"
          onClick={handleGuestRegister}
          disabled={loading}
          className="text-[12px] font-bold text-[#5B6660] hover:text-[#0F6B3F] transition-colors cursor-pointer py-1 underline decoration-[#DDE3DF] underline-offset-4"
        >
          {loadingType === 'guest' ? 'جاري الدخول كزائر...' : 'تصفّح كزائر دون تسجيل'}
        </button>
      </div>

      {/* Switch to Login */}
      <div className="pt-3 border-t border-[#DDE3DF] text-center">
        <p className="text-[12px] text-[#5B6660]">
          لديك حساب مسجل بالفعل؟{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-[#0F6B3F] hover:text-[#0A4D2E] hover:underline cursor-pointer"
          >
            تسجيل الدخول
          </button>
        </p>
      </div>
    </div>
  );
};
