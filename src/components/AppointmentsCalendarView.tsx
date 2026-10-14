import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Phone, 
  MessageSquare, 
  MapPin, 
  User, 
  Wrench, 
  ShieldCheck, 
  Trash2, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  CalendarCheck,
  Check,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { Appointment, AppointmentStatus, AppointmentType } from '../types';

export const AppointmentsCalendarView: React.FC = () => {
  const { 
    appointments, 
    updateAppointmentStatus, 
    rescheduleAppointment, 
    deleteAppointment, 
    setIsBookingAppointmentModalOpen,
    setSelectedArtisanForAppointment,
    setActiveTab,
    role,
    setRole,
    currentUser,
    language
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [reschedulingAptId, setReschedulingAptId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState('14:00 - 15:30');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Stats calculation
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const pendingCount = appointments.filter(a => a.status === 'pending_confirmation').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter(a => a.date === todayStr).length;

  // Calendar dates strip generator (7 days starting today)
  const daysStrip = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayNamesAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const dayName = i === 0 ? 'اليوم' : i === 1 ? 'غداً' : dayNamesAr[d.getDay()];
    const count = appointments.filter(a => a.date === dateStr).length;
    return { dateStr, dayName, dayNum: d.getDate(), monthNum: d.getMonth() + 1, count };
  });

  // Filtered Appointments
  const filteredAppointments = appointments.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (selectedDateFilter !== 'all' && a.date !== selectedDateFilter) return false;
    return true;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'مؤكد ومثبت ✅',
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
        };
      case 'pending_confirmation':
        return {
          label: 'في انتظار تأكيد الحرفي ⏳',
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
        };
      case 'rescheduled':
        return {
          label: 'تم تعديل الموعد 🔄',
          bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
        };
      case 'completed':
        return {
          label: 'تمت الزيارة والإنجاز 🏁',
          bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30'
        };
      case 'cancelled':
        return {
          label: 'ملغى ❌',
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
        };
    }
  };

  const getTypeLabel = (type: AppointmentType) => {
    switch (type) {
      case 'inspection': return 'معاينة وتشخيص ميداني 🔍';
      case 'execution': return 'تنفيذ وإصلاح مباشر ⚡';
      case 'consultation': return 'استشارة ومقايسة 📐';
      case 'emergency': return 'تدخل مستعجل 🚨';
    }
  };

  const handleOpenGoogleCalendar = (apt: Appointment) => {
    // Generate Google Calendar Link
    const title = encodeURIComponent(`موعد خـدّام: ${apt.serviceName} - ${apt.artisanName}`);
    const details = encodeURIComponent(`خدمة: ${apt.serviceName}\nالحرفي: ${apt.artisanName} (${apt.clientPhone})\nالعنوان: ${apt.address}\nطبيعة الموعد: ${getTypeLabel(apt.type)}\nملاحظات: ${apt.notes || 'لا يوجد'}`);
    const location = encodeURIComponent(`${apt.address}، ${apt.wilaya}`);
    
    // Dates formatted as YYYYMMDDTHHmmssZ
    const cleanDate = apt.date.replace(/-/g, '');
    const startTime = '090000';
    const endTime = '110000';
    const dates = `${cleanDate}T${startTime}/${cleanDate}T${endTime}`;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fade-in">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white border border-amber-500 shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 1. HERO HEADER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-9 shadow-xl border border-amber-900/40">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <CalendarCheck className="w-4 h-4 text-amber-400" />
              <span>نظام إدارة وتأكيد المواعيد والروزنامة الميدانية 📅</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              جدول المواعيد والزيارات الميدانية 🤝
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              احجز موعداً محدداً للمعاينة والتشخيص مع الحرفي المؤهل، وتابع تأكيد الحضور، 
              مع إمكانية تعديل المواعيد أو إضافتها لتقويم هاتفك وحساب Google بنقرة واحدة.
            </p>

            {/* Quick Stat Counter Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <span className="text-[10px] text-slate-400 block">إجمالي المواعيد</span>
                <span className="text-lg font-black text-amber-400">{totalCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <span className="text-[10px] text-slate-400 block">مواعيد مؤكدة ✅</span>
                <span className="text-lg font-black text-emerald-400">{confirmedCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <span className="text-[10px] text-slate-400 block">في انتظار التأكيد ⏳</span>
                <span className="text-lg font-black text-amber-300">{pendingCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <span className="text-[10px] text-slate-400 block">مواعيد اليوم 📌</span>
                <span className="text-lg font-black text-blue-400">{todayCount}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => setIsBookingAppointmentModalOpen(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>حجز موعد جديد +</span>
            </button>

            {/* Role switch pill for testing */}
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center text-xs">
              <span className="text-[10px] text-slate-400 block">المعاينة الحالية:</span>
              <button
                onClick={() => setRole(role === 'client' ? 'artisan' : 'client')}
                className="font-bold text-amber-300 hover:text-white transition-colors underline cursor-pointer"
              >
                {role === 'client' ? 'بصفتك عميل (طالب الموعد)' : 'بصفتك حرفي (منظم الجلسات)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CALENDAR DAY STRIP */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              اختر اليوم لعرض المواعيد المقررة:
            </h3>
          </div>

          {selectedDateFilter !== 'all' && (
            <button
              onClick={() => setSelectedDateFilter('all')}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              عرض كافة الأيام ({totalCount})
            </button>
          )}
        </div>

        {/* 7 Days Row */}
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 overflow-x-auto pb-1">
          {daysStrip.map(day => {
            const isSelected = selectedDateFilter === day.dateStr;
            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDateFilter(isSelected ? 'all' : day.dateStr)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm scale-102 font-black'
                    : 'bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:border-amber-400'
                }`}
              >
                <span className={`text-[11px] ${isSelected ? 'text-slate-950 font-black' : 'text-slate-400 font-bold'}`}>
                  {day.dayName}
                </span>
                <span className="text-base font-black">
                  {day.dayNum}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  day.count > 0 
                    ? isSelected ? 'bg-slate-950 text-white' : 'bg-amber-500 text-slate-950'
                    : 'opacity-40'
                }`}>
                  {day.count} {day.count === 1 ? 'موعد' : 'مواعيد'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. STATUS FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: `كافة المواعيد (${totalCount})` },
          { id: 'confirmed', label: `مؤكدة ✅ (${confirmedCount})` },
          { id: 'pending_confirmation', label: `في انتظار التأكيد ⏳ (${pendingCount})` },
          { id: 'rescheduled', label: `تم تعديلها 🔄 (${appointments.filter(a => a.status === 'rescheduled').length})` },
          { id: 'completed', label: `مكتملة 🏁 (${appointments.filter(a => a.status === 'completed').length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              statusFilter === tab.id
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. APPOINTMENTS LIST */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <h4 className="text-base font-black text-slate-900 dark:text-white">
            لا توجد مواعيد تطابق الفلتر الحالي
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            يمكنك حجز موعد جديد للمعاينة والتشخيص مع أي من الحرفيين المتاحين في التطبيق.
          </p>
          <button
            onClick={() => setIsBookingAppointmentModalOpen(true)}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>حجز موعد الآن</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map(apt => {
            const statusBadge = getStatusBadge(apt.status);
            const isPending = apt.status === 'pending_confirmation';
            const isConfirmed = apt.status === 'confirmed';

            return (
              <div
                key={apt.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                {/* Card Header: Artisan / Service & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={apt.artisanAvatar}
                      alt={apt.artisanName}
                      className="w-13 h-13 rounded-2xl object-cover border-2 border-amber-500 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-slate-900 dark:text-white truncate">
                          {apt.serviceName}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold shrink-0">
                          {getTypeLabel(apt.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        <span>الحرفي: <strong className="text-slate-700 dark:text-slate-200">{apt.artisanName}</strong> ({apt.artisanTrade})</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${statusBadge.bg}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                </div>

                {/* Date & Time Slot Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-xs">
                  <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200">
                    <CalendarIcon className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">تاريخ الزيارة:</span>
                      <strong className="font-mono text-xs">{apt.date}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">الفترة الزمنية:</span>
                      <strong className="font-mono text-xs">{apt.timeSlot}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">الموقع:</span>
                      <span className="truncate block font-bold">{apt.address}</span>
                    </div>
                  </div>
                </div>

                {/* Notes if available */}
                {apt.notes && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-amber-600 dark:text-amber-400">ملاحظات العميل: </span>
                    <span>{apt.notes}</span>
                  </div>
                )}

                {/* Reschedule In-Place Drawer */}
                {reschedulingAptId === apt.id && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                      <span className="flex items-center gap-1.5 text-amber-600">
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>اقتراح وتعديل موعد جديد:</span>
                      </span>
                      <button
                        onClick={() => setReschedulingAptId(null)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                          تاريخ جديد:
                        </label>
                        <input
                          type="date"
                          value={rescheduleDate || apt.date}
                          onChange={(e) => setRescheduleDate(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                          فترة زمنية:
                        </label>
                        <select
                          value={rescheduleTimeSlot}
                          onChange={(e) => setRescheduleTimeSlot(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                        >
                          <option value="08:30 - 10:00">08:30 - 10:00 (صباحاً)</option>
                          <option value="10:00 - 11:30">10:00 - 11:30 (صباحاً)</option>
                          <option value="11:30 - 13:00">11:30 - 13:00 (ظهراً)</option>
                          <option value="14:00 - 15:30">14:00 - 15:30 (بعد الظهر)</option>
                          <option value="15:30 - 17:00">15:30 - 17:00 (عصراً)</option>
                          <option value="17:00 - 18:30">17:00 - 18:30 (مساءً)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newD = rescheduleDate || apt.date;
                          rescheduleAppointment(apt.id, newD, rescheduleTimeSlot);
                          setReschedulingAptId(null);
                          setActionNotice('تم تعديل وقت الموعد بنجاح 🔄');
                          setTimeout(() => setActionNotice(null), 3000);
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        حفظ الموعد الجديد
                      </button>
                      <button
                        onClick={() => setReschedulingAptId(null)}
                        className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Confirm Button (If pending) */}
                    {isPending && (
                      <button
                        onClick={() => {
                          updateAppointmentStatus(apt.id, 'confirmed');
                          setActionNotice(`تم تأكيد الموعد مع الحرفي ${apt.artisanName} بنجاح! ✅`);
                          setTimeout(() => setActionNotice(null), 3000);
                        }}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                        title="تأكيد الموعد والموافقة على الحضور"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تأكيد الحضور ✅</span>
                      </button>
                    )}

                    {/* Reschedule button */}
                    <button
                      onClick={() => {
                        setReschedulingAptId(reschedulingAptId === apt.id ? null : apt.id);
                        setRescheduleDate(apt.date);
                        setRescheduleTimeSlot(apt.timeSlot);
                      }}
                      className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>تعديل الوقت 🔄</span>
                    </button>

                    {/* Add to Google Calendar button */}
                    <button
                      onClick={() => handleOpenGoogleCalendar(apt)}
                      className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-500/20"
                      title="إضافة وتثبيت الموعد في تقويم Google Calendar"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>إضافة للتقويم 📆</span>
                    </button>

                    {/* Direct phone call button */}
                    <a
                      href={`tel:${apt.clientPhone}`}
                      className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-500/20"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span dir="ltr">{apt.clientPhone}</span>
                    </a>

                    {/* Chat button */}
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-500/20"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>محادثة فورية 💬</span>
                    </button>
                  </div>

                  {/* Cancel / Delete */}
                  <div className="flex items-center gap-1.5">
                    {apt.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟`)) {
                            updateAppointmentStatus(apt.id, 'cancelled');
                            setActionNotice('تم إلغاء الموعد ❌');
                            setTimeout(() => setActionNotice(null), 3000);
                          }
                        }}
                        className="px-3 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        title="إلغاء الموعد"
                      >
                        إلغاء الموعد
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm('حذف هذا الموعد نهائياً من السجل؟')) {
                          deleteAppointment(apt.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="حذف من السجل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
