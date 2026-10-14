import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Power, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Upload, 
  Clock, 
  MapPin, 
  PhoneCall, 
  MessageSquare,
  Award,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Camera,
  Sparkles,
  Calendar,
  Bell,
  Compass,
  Radio,
  Coffee,
  Sun,
  Trash2,
  Plus
} from 'lucide-react';

export const ArtisanDashboard: React.FC = () => {
  const { 
    artisanOnline, 
    toggleArtisanOnline, 
    artisanDocs, 
    uploadArtisanDoc, 
    quotes, 
    setIsChatOpen, 
    startCall, 
    setIsProfessionalCardOpen,
    setSelectedArtisanForCard,
    artisans,
    appointments,
    setActiveTab,
    openArtisanFacebookProfile,
    artisanSchedule,
    updateArtisanSchedule,
    geoAlertRadiusKm,
    setGeoAlertRadiusKm,
    triggerSimulatedGeoAlert,
    t, 
    language 
  } = useApp();

  const [activeTaskAccepted, setActiveTaskAccepted] = useState(false);
  const [showDocUploadSuccess, setShowDocUploadSuccess] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [newVacationInput, setNewVacationInput] = useState('');

  const handleDocUpload = (type: 'id' | 'cert') => {
    uploadArtisanDoc(type);
    setShowDocUploadSuccess(true);
    setTimeout(() => setShowDocUploadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Status & Earnings Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-6 text-white border border-slate-700 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
                alt="Artisan Profile"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                artisanOnline ? 'bg-emerald-500' : 'bg-slate-500'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">
                  {language === 'ar' ? 'المعلم كمال بلقاسم' : 'Master Kamal Belkacem'}
                </h2>
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'ar' ? 'سباك معتمد وموثق · الجزائر العاصمة' : 'Certified Plumber · Algiers'}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-amber-400 font-bold mt-1">
                <span>⭐ 4.9 (142 تقييم)</span>
                <span>·</span>
                <span>310 مهمة ناجحة</span>
              </div>
            </div>
          </div>

          {/* Online/Offline Toggle & Professional Card */}
          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('appointments')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                title="أجندة المواعيد والروزنامة"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'أجندة المواعيد' : 'Calendar'}</span>
                {appointments.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white text-emerald-700 text-[10px] font-black">
                    {appointments.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('works')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors border border-white/20 cursor-pointer"
                title="عرض ونشر الأعمال"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'ar' ? 'معرض الأعمال' : 'My Portfolio'}</span>
              </button>

              <button
                onClick={() => openArtisanFacebookProfile(artisans[0])}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                title="بروفايلي على طريقة فيسبوك مع نشر الفيديوهات والمهام المنجزة"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'بروفايلي (Facebook)' : 'Social Profile'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedArtisanForCard(artisans[0] || null);
                  setIsProfessionalCardOpen(true);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'بطاقتي المهنية' : 'My ID Card'}</span>
              </button>

              <button
                onClick={toggleArtisanOnline}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95 ${
                  artisanOnline
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{artisanOnline ? t.availableNow : t.busyNow}</span>
              </button>
            </div>
            <span className="text-[11px] text-slate-400">
              {artisanOnline ? 'يتم توجيه الطلبات المجاورة إليك الآن' : 'وضع عدم الإزعاج مفعل'}
            </span>
          </div>
        </div>

        {/* Quick Numbers Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/60">
          <div className="p-3 bg-white/5 rounded-2xl">
            <span className="text-[10px] text-slate-400 block">{t.todayEarnings}</span>
            <span className="text-lg font-black text-amber-400 tabular-nums">14,500 {t.currency}</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl">
            <span className="text-[10px] text-slate-400 block">{t.completedJobs}</span>
            <span className="text-lg font-black text-white tabular-nums">310</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl">
            <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'نسبة القبول الفوري' : 'Acceptance Rate'}</span>
            <span className="text-lg font-black text-emerald-400 tabular-nums">98.5%</span>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl">
            <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'الرصيد القابل للسحب' : 'Wallet Balance'}</span>
            <span className="text-lg font-black text-white tabular-nums">48,200 {t.currency}</span>
          </div>
        </div>
      </div>

      {/* Incoming Targeted Job Request Alert */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-amber-500" />
          <span>{t.incomingRequests}</span>
        </h3>

        {!activeTaskAccepted ? (
          <div className="p-5 bg-amber-50/70 dark:bg-amber-950/20 border-2 border-amber-400 dark:border-amber-700 rounded-3xl space-y-4 shadow-sm animate-pulse-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px]">
                  {language === 'ar' ? 'طلب فوري مباشر بالقرب منك (0.8 كم)' : 'Instant Direct Request (0.8 km)'}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                  أعمال السباكة وتسريب المياه (مطبخ وحمام)
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>حي البساتين، عمارة 14، الشقة 5، الأبيار</span>
                  <span>·</span>
                  <span>العميل: هشام بن علي</span>
                </div>
              </div>

              <div className="text-start sm:text-end">
                <span className="text-xs text-slate-500 block">العائد المقدر:</span>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  3500 دج
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              "تسريب مائي قوي في أنبوب حوض المطبخ أسفل الحنفية مع رغبة في استبدال الصمام الرئيسي."
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setActiveTaskAccepted(true)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'قبول المهمة والتوجه للعميل' : 'Accept & Head to Site'}</span>
              </button>

              <button
                onClick={() => {}}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs transition-colors"
              >
                {language === 'ar' ? 'اعتذار عن الطلب' : 'Decline'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? 'أنت الآن في الطريق لتنفيذ مهمة حي البساتين' : 'You are currently on route to job'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsChatOpen(true)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-bold flex items-center gap-1 transition-colors text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>مراسلة العميل</span>
              </button>
              <button
                onClick={() => startCall('هشام بن علي (العميل)', 'طالب خدمة', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 text-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t.callArtisan}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. ARTISAN CALENDAR & SCHEDULE MANAGEMENT (إدارة الجدول الزمني ومواعيد العمل) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase">
              <Calendar className="w-4 h-4" />
              <span>إدارة الجدول الزمني ومواعيد العمل</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
              تحديد أوقات الفراغ وأيام العمل والحجوزات
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              تلقي طلبات الحجز والمكالمات في الأوقات التي تناسبك فقط لمنع الإزعاج أثناء أوقات الراحة.
            </p>
          </div>

          {scheduleSuccess && (
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1 self-start sm:self-auto animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تم حفظ الجدول بنجاح!</span>
            </span>
          )}
        </div>

        {/* Working Days Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            أيام العمل المتاحة أسبوعياً:
          </label>
          <div className="grid grid-cols-7 gap-2">
            {[
              { key: 'sat', label: 'السبت' },
              { key: 'sun', label: 'الأحد' },
              { key: 'mon', label: 'الإثنين' },
              { key: 'tue', label: 'الثلاثاء' },
              { key: 'wed', label: 'الأربعاء' },
              { key: 'thu', label: 'الخميس' },
              { key: 'fri', label: 'الجمعة' }
            ].map(({ key, label }) => {
              const isWorking = artisanSchedule.workingDays[key] ?? false;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    const updated = {
                      ...artisanSchedule,
                      workingDays: {
                        ...artisanSchedule.workingDays,
                        [key]: !isWorking
                      }
                    };
                    updateArtisanSchedule(updated);
                    setScheduleSuccess(true);
                    setTimeout(() => setScheduleSuccess(false), 2000);
                  }}
                  className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all border text-center flex flex-col items-center gap-1 ${
                    isWorking
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`w-2 h-2 rounded-full ${isWorking ? 'bg-white' : 'bg-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Working Hours & Break Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>ساعات العمل اليومية الرسمية:</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">من الساعة:</span>
                <input
                  type="time"
                  value={artisanSchedule.startHour}
                  onChange={(e) => {
                    updateArtisanSchedule({ ...artisanSchedule, startHour: e.target.value });
                    setScheduleSuccess(true);
                    setTimeout(() => setScheduleSuccess(false), 2000);
                  }}
                  className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">إلى الساعة:</span>
                <input
                  type="time"
                  value={artisanSchedule.endHour}
                  onChange={(e) => {
                    updateArtisanSchedule({ ...artisanSchedule, endHour: e.target.value });
                    setScheduleSuccess(true);
                    setTimeout(() => setScheduleSuccess(false), 2000);
                  }}
                  className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Coffee className="w-4 h-4 text-amber-500" />
              <span>فترة الاستراحة / الغداء والصلاة:</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">بدء الاستراحة:</span>
                <input
                  type="time"
                  value={artisanSchedule.breakStart || '12:00'}
                  onChange={(e) => {
                    updateArtisanSchedule({ ...artisanSchedule, breakStart: e.target.value });
                    setScheduleSuccess(true);
                    setTimeout(() => setScheduleSuccess(false), 2000);
                  }}
                  className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">انتهاء الاستراحة:</span>
                <input
                  type="time"
                  value={artisanSchedule.breakEnd || '13:30'}
                  onChange={(e) => {
                    updateArtisanSchedule({ ...artisanSchedule, breakEnd: e.target.value });
                    setScheduleSuccess(true);
                    setTimeout(() => setScheduleSuccess(false), 2000);
                  }}
                  className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency calls toggle & Vacations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Emergency calls */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                استقبال طلبات الطوارئ خارج أوقات العمل:
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                يسمح للعملاء بالتواصل في الحالات الحرجة بتسعيرة طوارئ.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const updated = {
                  ...artisanSchedule,
                  acceptsEmergencyCalls: !artisanSchedule.acceptsEmergencyCalls
                };
                updateArtisanSchedule(updated);
                setScheduleSuccess(true);
                setTimeout(() => setScheduleSuccess(false), 2000);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                artisanSchedule.acceptsEmergencyCalls ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                artisanSchedule.acceptsEmergencyCalls ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Vacation Days / Dates off */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              أيام العطل والاستراحة المحددة:
            </span>
            <div className="flex gap-2">
              <input
                type="date"
                value={newVacationInput}
                onChange={(e) => setNewVacationInput(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-900 border rounded-xl px-2.5 py-1 text-xs text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newVacationInput || artisanSchedule.vacationDates.includes(newVacationInput)) return;
                  const updated = {
                    ...artisanSchedule,
                    vacationDates: [...artisanSchedule.vacationDates, newVacationInput]
                  };
                  updateArtisanSchedule(updated);
                  setNewVacationInput('');
                  setScheduleSuccess(true);
                  setTimeout(() => setScheduleSuccess(false), 2000);
                }}
                className="px-3 py-1 bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {artisanSchedule.vacationDates.length === 0 ? (
                <span className="text-[11px] text-slate-400">لا توجد عطل مجدولة قريباً.</span>
              ) : (
                artisanSchedule.vacationDates.map((vDate, vIdx) => (
                  <span
                    key={vIdx}
                    className="px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[11px] font-mono flex items-center gap-1.5"
                  >
                    <span>{vDate}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...artisanSchedule,
                          vacationDates: artisanSchedule.vacationDates.filter((_, idx) => idx !== vIdx)
                        };
                        updateArtisanSchedule(updated);
                      }}
                      className="text-rose-400 hover:text-rose-600"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. GEO-FENCED PUSH NOTIFICATIONS (تنبيهات مخصصة ونطاق جغرافي) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase">
              <Compass className="w-4 h-4" />
              <span>التنبيهات المخصصة والنطاق الجغرافي الحي</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
              إشعارات فورية (Push Notifications) للطلبات القريبة منك فقط
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              حدد أقصى مسافة جغرافية مستعد لقطعها؛ لن تتلقى أي إشعارات مزعجة من خارج نطاقك الجغرافي.
            </p>
          </div>

          <button
            type="button"
            onClick={triggerSimulatedGeoAlert}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-transform active:scale-95 self-start sm:self-auto"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>تجربة إشعار فوري لطلب مجاور</span>
          </button>
        </div>

        {/* Radius Selector Pills */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              النطاق الجغرافي المعتمد للتنبيهات:
            </span>
            <span className="font-black font-mono text-amber-600 dark:text-amber-400 text-sm">
              {geoAlertRadiusKm} كيلومتر
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[1, 3, 5, 10, 20].map((radius) => (
              <button
                key={radius}
                type="button"
                onClick={() => setGeoAlertRadiusKm(radius)}
                className={`py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                  geoAlertRadiusKm === radius
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs scale-102'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                }`}
              >
                <span>{radius} كم</span>
              </button>
            ))}
          </div>

          <p className="text-[11px] text-slate-500">
            ✓ عند نشر عميل طلباً في مسافة أقل من <strong className="text-amber-600 dark:text-amber-400">{geoAlertRadiusKm} كم</strong>، سيهتز هاتفك فوراً بإشعار فوري متضمن العنوان والعائد المادي المقدر.
          </p>
        </div>
      </div>

      {/* Professional Credentials & Verification Badges Hub */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase">
            <Award className="w-4 h-4" />
            <span>{t.verificationDocuments}</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {language === 'ar' ? 'توثيق الهوية والشهادات المهنية' : 'Verification Badges & Proofs'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'ar' 
              ? 'الحرفيون الموثقون يحصلون على شارة التوثيق الرسمية ويزيد معدل طلباتهم بأكثر من 4 أضعاف' 
              : 'Verified artisans get official badges and 4x more customer requests'}
          </p>
        </div>

        {showDocUploadSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{language === 'ar' ? 'تم رفع الوثيقة بنجاح وهي قيد الاعتماد من فريق التحقق خدام.' : 'Document uploaded successfully!'}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* National ID Card Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-500" />
                <span>{t.uploadId}</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                {language === 'ar' ? 'معتمدة ومطابقة' : 'Verified'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {language === 'ar' ? 'تم التحقق من تطابق بطاقة الهوية البيومترية مع البيانات الشخصية للحرفي.' : 'National biometric ID verified.'}
            </p>
            <button
              onClick={() => handleDocUpload('id')}
              className="w-full py-1.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تحديث نسخة الهوية' : 'Re-upload ID'}</span>
            </button>
          </div>

          {/* Vocational Certificate Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-500" />
                <span>{t.uploadCert}</span>
              </span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                {language === 'ar' ? 'شهادة دولة معتمدة' : 'Certified'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {language === 'ar' ? 'شهادة الكفاءة المهنية الصادرة من مركز التكوين المهني والتمهين (CAP).' : 'Vocational qualification certificate.'}
            </p>
            <button
              onClick={() => handleDocUpload('cert')}
              className="w-full py-1.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إضافة شهادة أو دبلوم آخر' : 'Add another certificate'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
