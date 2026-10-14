import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Wrench, 
  ShieldCheck, 
  Sparkles,
  Info,
  CalendarCheck
} from 'lucide-react';
import { AppointmentType } from '../types';

export const BookingAppointmentModal: React.FC = () => {
  const {
    isBookingAppointmentModalOpen,
    setIsBookingAppointmentModalOpen,
    selectedArtisanForAppointment,
    setSelectedArtisanForAppointment,
    artisans,
    createAppointment,
    currentUser,
    categories,
    selectedCity,
    setActiveTab,
    language
  } = useApp();

  if (!isBookingAppointmentModalOpen) return null;

  // Form State
  const defaultArtisan = selectedArtisanForAppointment || artisans[0];
  const [artisanId, setArtisanId] = useState(defaultArtisan?.id || artisans[0]?.id || 'art_1');
  const chosenArtisan = artisans.find(a => a.id === artisanId) || defaultArtisan;

  const [serviceName, setServiceName] = useState('معاينة ميدانية وكشف الأعطال');
  const [date, setDate] = useState(() => {
    // Default to tomorrow
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 - 11:30');
  const [type, setType] = useState<AppointmentType>('inspection');
  
  // Client contact info (dir="ltr" for phone)
  const [clientName, setClientName] = useState(currentUser.name || 'هشام بن علي');
  const [clientPhone, setClientPhone] = useState(currentUser.phone || '0550 12 34 56');
  const [address, setAddress] = useState(currentUser.address || 'حي البساتين، عمارة 14، الشقة 5 - الأبيار');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const timeSlots = [
    '08:30 - 10:00 (صباحاً)',
    '10:00 - 11:30 (صباحاً)',
    '11:30 - 13:00 (ظهراً)',
    '14:00 - 15:30 (بعد الظهر)',
    '15:30 - 17:00 (عصراً)',
    '17:00 - 18:30 (مساءً)'
  ];

  const appointmentTypes: { id: AppointmentType; label: string; desc: string; icon: any }[] = [
    {
      id: 'inspection',
      label: 'معاينة وتشخيص العطل 🔍',
      desc: 'حضور الحرفي لتفقد الموقع وتحديد المشكلة وتقديم تقدير التكلفة',
      icon: Wrench
    },
    {
      id: 'execution',
      label: 'تنفيذ وإصلاح مباشر ⚡',
      desc: 'حضور الحرفي بكامل معداته وقطع الغيار للبدء في الأشغال فوراً',
      icon: Sparkles
    },
    {
      id: 'consultation',
      label: 'استشارة فنية ومقايسة 📐',
      desc: 'دراسة مشروع أو تجديد، قياس المساحات، واختيار المواد المناسبة',
      icon: Info
    },
    {
      id: 'emergency',
      label: 'تدخل مستعجل 🚨',
      desc: 'حالة طارئة (تسريب حاد، انقطاع كلي للكهرباء، قفل مغلق)',
      icon: ShieldCheck
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createAppointment({
      clientId: currentUser.id || 'client_me',
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      artisanId: chosenArtisan?.id || 'art_1',
      artisanName: chosenArtisan?.name || 'حرفي معتمد',
      artisanTrade: chosenArtisan?.trade || 'صيانة عامة',
      artisanAvatar: chosenArtisan?.avatar || '',
      serviceName: serviceName.trim(),
      date,
      timeSlot: timeSlot.split(' ')[0] + ' ' + (timeSlot.split(' ')[1] || '') + ' ' + (timeSlot.split(' ')[2] || ''),
      type,
      status: 'pending_confirmation',
      wilaya: selectedCity || 'الجزائر العاصمة',
      address: address.trim(),
      notes: notes.trim(),
      estimatedPrice: type === 'inspection' ? 2500 : type === 'emergency' ? 4500 : 3500
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsBookingAppointmentModalOpen(false);
      setSelectedArtisanForAppointment(null);
      setActiveTab('calendar');
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => {
            setIsBookingAppointmentModalOpen(false);
            setSelectedArtisanForAppointment(null);
          }}
          className="absolute rtl:left-4 ltr:right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-500">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              تم تسجيل طلب الموعد بنجاح! 📅
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              تم إرسال إشعار فوري للحرفي {chosenArtisan.name} لتأكيد الحضور، وجاري تحويلك إلى جدول المواعيد...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <CalendarCheck className="w-4 h-4" />
                <span>حجز موعد ميداني جديد</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                تحديد موعد زيارة ومعاينة مع الحرفي 🤝
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                اختر اليوم والوقت المناسبين لك، وسيصل تنبيه فوري للحرفي لتأكيد الموعد أو اقتراح بديل.
              </p>
            </div>

            {/* Selected Artisan Card / Selector */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={chosenArtisan.avatar}
                  alt={chosenArtisan.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {chosenArtisan.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold shrink-0">
                      حرفي معتمد
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate block">
                    {chosenArtisan.trade} • {chosenArtisan.city}
                  </span>
                </div>
              </div>

              {artisans.length > 1 && (
                <select
                  value={artisanId}
                  onChange={(e) => setArtisanId(e.target.value)}
                  className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none shrink-0"
                >
                  {artisans.map(art => (
                    <option key={art.id} value={art.id}>
                      {art.name} ({art.trade})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Appointment Type Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                طبيعة الموعد المطلوب:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {appointmentTypes.map(t => {
                  const Icon = t.icon;
                  const isSelected = type === t.id;
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setType(t.id)}
                      className={`p-3 rounded-2xl border text-right transition-all flex items-start gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/15 text-slate-900 dark:text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-amber-500' : 'text-slate-400'}`} />
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-black">{t.label}</div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                          {t.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Slot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>تاريخ الزيارة *</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>الفترة الزمنية المفضلة *</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {timeSlots.map((ts, idx) => (
                    <option key={idx} value={ts}>{ts}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                موضوع الزيارة / نوع العطل *
              </label>
              <input
                type="text"
                required
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="مثال: فحص تسريب مائي تحت البلاط أو تجديد قواطع الكهرباء"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Client Contact Info with dir="ltr" on Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>اسم العميل *</span>
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="الاسم الكامل"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>رقم الهاتف للتأكيد *</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={clientPhone}
                    onChange={(e) => {
                      const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
                      const val = e.target.value.replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d).toString());
                      setClientPhone(val);
                    }}
                    placeholder="0550 12 34 56"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono text-left focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                    🇩🇿 +213
                  </span>
                </div>
              </div>
            </div>

            {/* Address & Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>العنوان وموقع التدخل *</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="الحي، رقم العمارة أو الفيلا، الطابق، المدينة"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Additional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                ملاحظات إضافية للحرفي (اختياري)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أضف أي تفاصيل تهم الحرفي (مثل: وجود ركن للسيارة، إحضار سلم طويل، نوعية السخان...)"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-transform active:scale-95 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>تأكيد وحجز الموعد الآن 📅</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsBookingAppointmentModalOpen(false);
                  setSelectedArtisanForAppointment(null);
                }}
                className="px-5 h-12 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
