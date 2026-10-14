import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { serviceCategories } from '../data/mockData';
import { 
  X, 
  Zap, 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  User,
  Phone,
  MessageSquare,
  Sparkles,
  Layers,
  Lock,
  Globe
} from 'lucide-react';

export const OrderFlowModal: React.FC = () => {
  const { 
    bookingModalService, 
    setBookingModalService, 
    createOrder, 
    currentUser,
    activeOrders,
    t, 
    language,
    selectedCity 
  } = useApp();

  const [orderType, setOrderType] = useState<'instant' | 'scheduled'>('instant');
  const [scheduledDate, setScheduledDate] = useState('2026-10-07');
  const [scheduledTime, setScheduledTime] = useState('10:00 - 12:00');
  
  // Client personal contact info & preferences
  const [clientName, setClientName] = useState(currentUser.name || 'هشام بن علي');
  const [clientPhone, setClientPhone] = useState(currentUser.phone || '+213 550 12 34 56');
  const [clientPhoneVisible, setClientPhoneVisible] = useState(currentUser.sharePhoneWithArtisans ?? true);
  const [preferredContact, setPreferredContact] = useState<'direct_call' | 'masked_call' | 'whatsapp' | 'chat'>('direct_call');

  // Address and notes
  const [address, setAddress] = useState(currentUser.address || 'حي البساتين، عمارة 14، الشقة 5');
  const [neighborhood, setNeighborhood] = useState(currentUser.neighborhood || 'الأبيار / حيدرة');
  const [notes, setNotes] = useState('');

  if (!bookingModalService) return null;

  // Resolve category and subservice info
  const category = serviceCategories.find(c => c.id === bookingModalService.categoryId) || serviceCategories[0];
  const subService = category.subServices.find(s => s.id === bookingModalService.subServiceId) || category.subServices[0];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    createOrder({
      categoryId: category.id,
      subServiceId: subService.id,
      subServiceName: subService.name,
      type: orderType,
      scheduledDate: orderType === 'scheduled' ? scheduledDate : undefined,
      scheduledTime: orderType === 'scheduled' ? scheduledTime : undefined,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientPhoneVisible,
      preferredContact,
      address: `${address.trim()}${neighborhood.trim() ? `، ${neighborhood.trim()}` : ''}`,
      clientAddressDetails: address.trim(),
      city: selectedCity,
      notes: notes.trim(),
      estimatedCost: 3500
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setBookingModalService(null)}
          className="absolute rtl:left-4 ltr:right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pr-2 rtl:pr-0 rtl:pl-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {category.name}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
              نشر طلب جديد
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            {subService.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {subService.description}
          </p>
        </div>

        {/* Multi-Order Capability Notification Banner */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
          <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">إمكانية نشر ومتابعة عدة طلبات في نفس الوقت:</span>
            <p className="text-[11px] text-blue-800 dark:text-blue-300">
              لديك حالياً {activeOrders.length} طلب نشط. يمكنك إضافة ونشر هذا الطلب فوراً وسيتم تتبعه بشكل مستقل.
            </p>
          </div>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4 mt-4">
          {/* Section: Client Personal Info & Phone Number (إمكانية وضع رقمه ومعلوماته الشخصية) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-500" />
                <span>معلوماتك الشخصية ورقم الهاتف للتواصل:</span>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                بيانات آمنة ومحمية
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  الاسم الكامل للعميل:
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="الاسم واللقب..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  رقم الهاتف المباشر:
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2" />
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
                    className="w-full rtl:pr-8 ltr:pl-8 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500 text-left"
                  />
                </div>
              </div>
            </div>

            {/* Phone Visibility Toggle */}
            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="clientPhoneVisible"
                  checked={clientPhoneVisible}
                  onChange={(e) => setClientPhoneVisible(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                />
                <label htmlFor="clientPhoneVisible" className="cursor-pointer text-[11px] font-medium text-slate-800 dark:text-slate-200">
                  إظهار رقم هاتفي للحرفي المعتمد للاتصال السريع والمباشر
                </label>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                clientPhoneVisible 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {clientPhoneVisible ? 'متاح ومباشر' : 'مكالمة مشفرة عبر التطبيق'}
              </span>
            </div>

            {/* Preferred contact channel */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                طريقة التواصل والتنسيق المفضلة:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPreferredContact('direct_call')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors flex items-center justify-center gap-1 ${
                    preferredContact === 'direct_call'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Phone className="w-3 h-3" />
                  <span>اتصال هاتفي</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredContact('whatsapp')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors flex items-center justify-center gap-1 ${
                    preferredContact === 'whatsapp'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>واتساب</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredContact('masked_call')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-colors flex items-center justify-center gap-1 ${
                    preferredContact === 'masked_call'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  <span>مشفر بالكامل</span>
                </button>
              </div>
            </div>
          </div>

          {/* Timing: Instant vs Scheduled */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              نوع الطلب وتوقيت التنفيذ:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setOrderType('instant')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  orderType === 'instant'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{t.requestNow}</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('scheduled')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  orderType === 'scheduled'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.scheduleBooking}</span>
              </button>
            </div>
          </div>

          {/* Scheduled Date/Time picker if scheduled */}
          {orderType === 'scheduled' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  التاريخ المطلوب:
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الفترة الزمنية:
                </label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-white"
                >
                  <option value="09:00 - 12:00">الصباح (09:00 - 12:00)</option>
                  <option value="13:00 - 16:00">بعد الظهر (13:00 - 16:00)</option>
                  <option value="17:00 - 20:00">المساء (17:00 - 20:00)</option>
                </select>
              </div>
            </div>
          )}

          {/* Location details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>عنوان موقع العمل بالتفصيل:</span>
                </span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="الشارع، رقم العمارة، الطابق..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                الحي / البلدية والمعلم القريب:
              </label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="اسم الحي أو معلم معروف قريب..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Notes & Description of Problem */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ملاحظات وتفاصيل العطل أو العمل المطلوب:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="وصف المشكلة، هل توجد قطع غيار متوفرة، تفضيلات خاصة..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Price & Guarantee notice */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              السعر التقديري المبدئي للخدمة:
            </span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {subService.estimatedPrice}
            </span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>نشر وتأكيد هذا الطلب الآن</span>
          </button>

          {/* Trust badge */}
          <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>ضمان منصة خدام لسلامة الخدمة وجودة التنفيذ</span>
          </div>
        </form>
      </div>
    </div>
  );
};
