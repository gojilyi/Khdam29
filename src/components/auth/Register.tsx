import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  MapPin, 
  Wrench, 
  Image as ImageIcon, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { normalizeAlgerianPhone, translateFirebaseError, UserRole } from '../../services/authService';

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
  'فني ألمنيوم'
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
  const { registerWithEmail } = useAuth();

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
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80');

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
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'يرجى إدخال الاسم الكامل (3 أحرف على الأقل)';
    }

    const phoneCheck = normalizeAlgerianPhone(phone);
    if (!phoneCheck.isValid) {
      errs.phone = phoneCheck.error || 'رقم هاتف جزائري غير صالح';
    }

    if (!email.trim() || !email.includes('@')) {
      errs.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    if (!password || password.length < 6) {
      errs.password = 'كلمة المرور يجب أن لا تقل عن 6 أحرف';
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
      if (!validateStep3()) return;
    }

    setLoading(true);
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
        portfolioImages: role === 'craftsman' ? portfolioImages : undefined,
        isProfileComplete: true
      });
      onSuccess();
    } catch (err: any) {
      setGeneralError(translateFirebaseError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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

      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 text-[#C62828] text-[12px] rounded-[8px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span>{generalError}</span>
        </div>
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
                className="w-full h-11 bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-10 text-[13px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F]"
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
                className="w-full h-11 bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-10 text-[13px] font-mono text-[#1C2421] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F]"
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
                className="w-full h-11 bg-white border border-[#DDE3DF] rounded-[8px] px-2 text-[12px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F]"
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
                className="w-full h-11 bg-white border border-[#DDE3DF] rounded-[8px] px-3 text-[12px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F]"
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
                className="w-full h-11 bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-10 text-[13px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F]"
              />
              <Mail className="w-4 h-4 text-[#5B6660] absolute right-3 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            </div>
            {errors.email && <p className="text-[11px] text-[#C62828] mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[12px] font-bold text-[#1C2421] mb-1">
              كلمة المرور (6 أحرف أو أكثر) <span className="text-[#C62828]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
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
            {errors.password && <p className="text-[11px] text-[#C62828] mt-1">{errors.password}</p>}
          </div>

          {/* Action button */}
          {role === 'client' ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#0F6B3F] hover:bg-[#0A4D2E] disabled:opacity-50 text-white font-bold rounded-[8px] text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer mt-3"
            >
              <span>{loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب طالب خدمة'}</span>
              <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full h-11 bg-[#0F6B3F] hover:bg-[#0A4D2E] text-white font-bold rounded-[8px] text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer mt-3"
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
              className="w-full h-11 bg-white border border-[#DDE3DF] rounded-[8px] px-3 text-[13px] text-[#1C2421] font-bold focus:outline-none focus:border-[#0F6B3F]"
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
                  className="w-full h-11 bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-8 text-[13px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F]"
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
                  className="w-full h-11 bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-8 text-[13px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F]"
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
              className="h-11 bg-white hover:bg-[#EEF6F1] border border-[#DDE3DF] text-[#1C2421] font-bold rounded-[8px] text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              <span>الرجوع</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="h-11 bg-[#0F6B3F] hover:bg-[#0A4D2E] text-white font-bold rounded-[8px] text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
              className="flex-1 h-10 bg-white border border-[#DDE3DF] rounded-[8px] px-3 text-[12px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F]"
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
              className="h-11 bg-white hover:bg-[#EEF6F1] border border-[#DDE3DF] text-[#1C2421] font-bold rounded-[8px] text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              <span>الرجوع</span>
            </button>

            <button
              type="submit"
              disabled={loading || portfolioImages.length < 3}
              className="h-11 bg-[#0F6B3F] hover:bg-[#0A4D2E] disabled:opacity-50 text-white font-bold rounded-[8px] text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{loading ? 'جاري التسجيل...' : 'إتمام تسجيل الحرفي'}</span>
              <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </form>
      )}

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
