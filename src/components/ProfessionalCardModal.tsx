import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Award, 
  QrCode, 
  Download, 
  Share2, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  FileText, 
  Star,
  Sparkles,
  Lock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const ProfessionalCardModal: React.FC = () => {
  const { 
    isProfessionalCardOpen, 
    setIsProfessionalCardOpen, 
    selectedArtisanForCard, 
    currentUser, 
    role,
    language,
    setActiveTab
  } = useApp();

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isProfessionalCardOpen) return null;

  // If a specific artisan was selected, show their card; otherwise show the logged-in user / active profile card
  const artisanName = selectedArtisanForCard?.name || (role === 'artisan' ? 'المعلم كمال بلقاسم' : currentUser.name || 'المعلم كمال بلقاسم');
  const artisanTrade = selectedArtisanForCard ? selectedArtisanForCard.bio : (role === 'artisan' ? 'سباك وترصيص صحي وشبكات تدفئة' : 'فني وخدمات متخصصة');
  const artisanAvatar = selectedArtisanForCard?.avatar || currentUser.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80';
  const verificationLevel = selectedArtisanForCard?.verification.level ?? (role === 'artisan' ? 2 : 1);
  const matricule = selectedArtisanForCard?.verification.matricule || 'KD-DZ-2026-8842';
  const rating = selectedArtisanForCard?.rating || 4.9;
  const completedJobs = selectedArtisanForCard?.verification.completedJobsCount || 310;
  const experienceYears = selectedArtisanForCard?.verification.yearsExperience || 14;
  const city = selectedArtisanForCard?.city || 'الجزائر العاصمة (الأبيار)';

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative my-6">
        {/* Close Button */}
        <button
          onClick={() => setIsProfessionalCardOpen(false)}
          className="absolute rtl:left-4 ltr:right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'البطاقة المهنية الرقمية الرسمية' : 'Official Professional Artisan Card'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            {language === 'ar' ? 'بطاقة إثبات الكفاءة والتوثيق' : 'Artisan Digital ID Card'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ar' 
              ? 'وثيقة رقمية معتمدة ومحمية برمز استجابة سريع (QR) للتحقق الفوري من الهوية ومستوى التوثيق' 
              : 'Verifiable digital credentials backed by biometric and diploma verification.'}
          </p>
        </div>

        {/* PHYSICAL BADGE CARD CONTAINER (High-security luxury look) */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/80 dark:border-amber-500/60 bg-gradient-to-br from-slate-900 via-amber-950 to-slate-950 text-white p-6 sm:p-7 space-y-5">
          {/* Guilloché security pattern / watermark effect */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

          {/* Top Card Bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-amber-500/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black tracking-wide block uppercase text-amber-200">
                  خـدّام · KHODAM
                </span>
                <span className="text-[9px] text-amber-300/80 font-mono">
                  REPUBLIQUE DIGITALE DES ARTISANS
                </span>
              </div>
            </div>

            {/* Smart Microchip simulation */}
            <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-amber-400 to-yellow-200 border border-amber-200/50 shadow-inner flex flex-col justify-around p-1">
              <div className="h-0.5 w-full bg-amber-800/40" />
              <div className="h-0.5 w-full bg-amber-800/40" />
            </div>
          </div>

          {/* Center Card Content: Photo, Identity & Level Badge */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Portrait Photo with Security Ring */}
            <div className="relative shrink-0">
              <img
                src={artisanAvatar}
                alt={artisanName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-lg"
                referrerPolicy="no-referrer"
              />
              {/* Level indicator dot */}
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-slate-900 border border-amber-400 text-[10px] font-bold text-amber-300 flex items-center gap-1 shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>Niv.{verificationLevel}</span>
              </div>
            </div>

            {/* Details & Verification Status */}
            <div className="text-center sm:text-start flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h4 className="text-lg font-black text-white">
                  {artisanName}
                </h4>
              </div>

              <div className="text-xs font-bold text-amber-300">
                {artisanTrade}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                {/* Level 0: Unverified */}
                {verificationLevel === 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>غير موثق (المستوى 0)</span>
                  </span>
                )}

                {/* Level 1: Biometric ID & Selfie Verified */}
                {verificationLevel === 1 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/50">
                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                    <span>موثق بالهوية والصورة (المستوى 1)</span>
                  </span>
                )}

                {/* Level 2: Certified with Vocational Diploma */}
                {verificationLevel === 2 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/50">
                    <Award className="w-3 h-3 text-emerald-300" />
                    <span>معتمد بالدبلوم المهني (المستوى 2 - ذهبي)</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <span>{rating} ({completedJobs} مهمة)</span>
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-300 pt-1 font-sans">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{city}</span>
                </span>
                <span>·</span>
                <span>خبرة {experienceYears} سنة</span>
              </div>
            </div>
          </div>

          {/* Bottom Card Bar: Registration Matricule & QR Code */}
          <div className="relative z-10 pt-3 border-t border-amber-500/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">
                رقم القيد المهني (MATRICULE)
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 tracking-wider">
                {matricule}
              </span>
              <span className="text-[9px] text-slate-400 block font-mono">
                صادر: 2026/01 · صالح لغاية: 2027/12
              </span>
            </div>

            {/* Verifiable QR Code Simulation */}
            <div className="p-1.5 bg-white rounded-xl shadow-md text-slate-950 flex flex-col items-center">
              <QrCode className="w-11 h-11 text-slate-900" />
              <span className="text-[8px] font-mono font-bold">SCAN VERIFY</span>
            </div>
          </div>
        </div>

        {/* Level explanation details */}
        <div className="mt-4 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>معايير مستويات التوثيق في منصة خدام:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className={`p-2 rounded-xl border ${verificationLevel >= 1 ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-300 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}>
              <div className="flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3 text-blue-500" />
                <span>المستوى 1 (الهوية + سيلفي)</span>
              </div>
              <p className="text-[10px] mt-0.5 opacity-80">
                تدقيق بطاقة التعريف الوطنية البيومترية والمطابقة الوجهية الحية.
              </p>
            </div>

            <div className={`p-2 rounded-xl border ${verificationLevel === 2 ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300 font-semibold' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}>
              <div className="flex items-center gap-1 font-bold">
                <Award className="w-3 h-3 text-emerald-500" />
                <span>المستوى 2 (الدبلوم المهني)</span>
              </div>
              <p className="text-[10px] mt-0.5 opacity-80">
                فحص شهادة الكفاءة المهنية (CAP/BTS) أو دبلوم الحرفة التخصصي.
              </p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'تم حفظ البطاقة ✓' : (language === 'ar' ? 'تحميل البطاقة الرقمية' : 'Download ID')}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? 'تم نسخ الرابط ✓' : (language === 'ar' ? 'مشاركة' : 'Share')}</span>
            </button>
          </div>

          {verificationLevel < 2 && (
            <button
              onClick={() => {
                setIsProfessionalCardOpen(false);
                setActiveTab('profile');
              }}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>{language === 'ar' ? 'ترقية التوثيق إلى المستوى 2' : 'Upgrade to Level 2'}</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
