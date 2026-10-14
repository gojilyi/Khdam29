import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Star, 
  Check, 
  XCircle, 
  ArrowRight, 
  Info,
  Plus,
  Layers,
  Phone,
  User,
  Calendar,
  Zap,
  Globe,
  Award
} from 'lucide-react';
import { OrderStatus, Order } from '../types';

export const ActiveOrderTracker: React.FC = () => {
  const { 
    activeOrders,
    activeOrder, 
    selectedActiveOrderId,
    setSelectedActiveOrderId,
    advanceOrderStatus, 
    cancelCurrentOrder, 
    completeCurrentOrder, 
    startCall, 
    setIsChatOpen, 
    setIsReviewModalOpen,
    setBookingModalService,
    setActiveTab,
    openArtisanFacebookProfile,
    artisans,
    t, 
    language,
    orderHistory
  } = useApp();

  const [confirmCancel, setConfirmCancel] = useState(false);

  const stages: { key: OrderStatus; labelAr: string; labelEn: string; icon: any }[] = [
    { key: 'searching', labelAr: 'البحث عن حرفي', labelEn: 'Searching', icon: Clock },
    { key: 'artisan_assigned', labelAr: 'قبول الطلب', labelEn: 'Assigned', icon: CheckCircle2 },
    { key: 'on_the_way', labelAr: 'في الطريق', labelEn: 'On The Way', icon: Truck },
    { key: 'in_progress', labelAr: 'تنفيذ الخدمة', labelEn: 'In Progress', icon: Wrench },
    { key: 'awaiting_confirmation', labelAr: 'تأكيد الإنجاز', labelEn: 'Confirmation', icon: ShieldCheck },
    { key: 'completed', labelAr: 'مكتمل', labelEn: 'Completed', icon: Check },
  ];

  const getStageIndex = (status: OrderStatus) => {
    return stages.findIndex(s => s.key === status);
  };

  const currentStageIndex = activeOrder ? getStageIndex(activeOrder.status) : -1;

  // Matched artisan object if available
  const currentArtisanObj = activeOrder?.artisanId ? artisans.find(a => a.id === activeOrder.artisanId) : null;

  return (
    <div className="space-y-6">
      {/* 1. Multi-Order Header & System Notice */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>نظام متابعة الطلبات المتعددة (Multi-Orders)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              طلباتي النشطة ({activeOrders.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              يمكنك نشر ومتابعة عدة طلبات لمهام ومهن مختلفة في نفس الوقت بكل استقلالية وأمان.
            </p>
          </div>

          {/* New Request Button */}
          <button
            onClick={() => setActiveTab('home')}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>نشر طلب خدمة جديد +</span>
          </button>
        </div>

        {/* Multi-Order Tabs / Selector Bar */}
        {activeOrders.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
              اختر الطلب لعرض تفاصيله ومساره المباشر:
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {activeOrders.map((order, idx) => {
                const isSelected = order.id === (activeOrder?.id || selectedActiveOrderId);
                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedActiveOrderId(order.id)}
                    className={`p-3 rounded-2xl border text-start transition-all shrink-0 min-w-[210px] ${
                      isSelected
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 dark:border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                        طلب #{idx + 1}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        order.status === 'on_the_way'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : order.status === 'in_progress'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      }`}>
                        {order.status === 'searching' && 'جاري البحث'}
                        {order.status === 'artisan_assigned' && 'تم القبول'}
                        {order.status === 'on_the_way' && 'في الطريق'}
                        {order.status === 'in_progress' && 'قيد التنفيذ'}
                        {order.status === 'awaiting_confirmation' && 'تأكيد الإنجاز'}
                        {order.status === 'completed' && 'مكتمل'}
                      </span>
                    </div>

                    <div className="font-black text-xs text-slate-900 dark:text-white truncate">
                      {order.subServiceName}
                    </div>

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                      <span>{order.artisanName || 'جاري التعيين...'}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {order.estimatedCost} دج
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {activeOrder ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {/* Header Status Bar */}
          <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span>الطلب المعروض حالياً</span>
                <span className="font-mono text-slate-400">#{activeOrder.id}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                {activeOrder.subServiceName}
              </h2>
            </div>

            <div className="text-end">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">
                {language === 'ar' ? 'التكلفة المقدرة' : 'Estimated Cost'}
              </span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {activeOrder.estimatedCost} {t.currency}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* Step Progress Bar */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'مسار تقدم هذا الطلب المباشر:' : 'Live Order Stages:'}
              </div>

              <div className="relative">
                {/* Connecting track */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />
                
                {/* Active progress fill */}
                <div 
                  className="absolute top-4 rtl:right-4 ltr:left-4 h-0.5 bg-amber-500 transition-all duration-500 -z-0"
                  style={{
                    width: `${Math.max(0, (currentStageIndex / (stages.length - 1)) * 100)}%`
                  }}
                />

                <div className="grid grid-cols-6 gap-1 relative z-10">
                  {stages.map((stage, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const StageIcon = stage.icon;

                    return (
                      <div key={stage.key} className="flex flex-col items-center text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isDone 
                            ? 'bg-amber-500 text-white' 
                            : isCurrent 
                              ? 'bg-amber-500 text-white ring-4 ring-amber-500/20 shadow-md scale-110' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}>
                          <StageIcon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] mt-2 font-medium hidden sm:block ${
                          isCurrent 
                            ? 'text-amber-600 dark:text-amber-400 font-bold' 
                            : isDone 
                              ? 'text-slate-700 dark:text-slate-300' 
                              : 'text-slate-400'
                        }`}>
                          {language === 'ar' ? stage.labelAr : stage.labelEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Assigned Artisan Details & Action Channels */}
            {activeOrder.artisanName && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={activeOrder.artisanAvatar} 
                      alt={activeOrder.artisanName} 
                      className="w-14 h-14 rounded-2xl object-cover border border-amber-500/30"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-[8px] text-white">
                      ✓
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {activeOrder.artisanName}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      هاتف الحرفي: <span className="font-mono text-slate-700 dark:text-slate-300">{activeOrder.artisanPhoneMasked || '+213 •• •• •• 89'}</span>
                    </span>

                    {/* View Facebook Profile Button */}
                    {currentArtisanObj && (
                      <button
                        onClick={() => openArtisanFacebookProfile(currentArtisanObj)}
                        className="mt-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" />
                        <span>عرض بروفايل فيسبوك الحرفي وإنجازاته</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Direct Calling & Encrypted Chat Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startCall(activeOrder.artisanName || 'الحرفي', 'مقدم خدمة معتمد', activeOrder.artisanAvatar || '')}
                    className="flex-1 sm:flex-initial h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>اتصال بالحرفي</span>
                  </button>

                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="flex-1 sm:flex-initial h-10 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t.chatArtisan}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Client Personal Contact Info Attached To This Order (إمكانية وضع رقمه ومعلوماته الشخصية) */}
            <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>معلومات العميل ورقم الهاتف المرفق بهذا الطلب:</span>
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeOrder.clientPhoneVisible
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                }`}>
                  {activeOrder.clientPhoneVisible ? 'الرقم متاح مباشرة للحرفي' : 'مكالمات مشفرة'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">اسم صاحب الطلب:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {activeOrder.clientName || 'هشام بن علي'}
                  </span>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">رقم الهاتف للتواصل:</span>
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 dir-ltr inline-block">
                    {activeOrder.clientPhone || '+213 550 12 34 56'}
                  </span>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">طريقة التواصل المفضلة:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {activeOrder.preferredContact === 'whatsapp' && 'واتساب WhatsApp'}
                    {activeOrder.preferredContact === 'masked_call' && 'مكالمة مشفرة عبر التطبيق'}
                    {(!activeOrder.preferredContact || activeOrder.preferredContact === 'direct_call') && 'اتصال هاتفي مباشر'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Location & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-slate-400 block font-medium mb-1">
                  {language === 'ar' ? 'عنوان التدخل والموقع:' : 'Service Location:'}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {activeOrder.city} - {activeOrder.address}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span className="text-slate-400 block font-medium mb-1">
                  {language === 'ar' ? 'ملاحظات وتفاصيل العمل المطلوبة:' : 'Job Notes:'}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                  {activeOrder.notes || (language === 'ar' ? 'لا توجد ملاحظات إضافية' : 'No extra notes')}
                </span>
              </div>
            </div>

            {/* Interactive Simulation Controls to Test Complete Lifecycle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {activeOrder.status !== 'completed' && (
                  <button
                    onClick={() => advanceOrderStatus(activeOrder.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>{language === 'ar' ? 'محاكاة تقديم المرحلة' : 'Advance Stage'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                )}

                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>{t.completeAndRate}</span>
                </button>
              </div>

              {/* Cancellation */}
              {confirmCancel ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-600 font-semibold">
                    {language === 'ar' ? 'هل أنت متأكد من إلغاء هذا الطلب؟' : 'Confirm cancellation?'}
                  </span>
                  <button
                    onClick={() => {
                      cancelCurrentOrder(activeOrder.id);
                      setConfirmCancel(false);
                    }}
                    className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700"
                  >
                    نعم، إلغاء
                  </button>
                  <button
                    onClick={() => setConfirmCancel(false)}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-xs font-semibold rounded-lg"
                  >
                    تراجع
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors"
                >
                  {t.cancelOrder}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty active order state */
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {language === 'ar' ? 'لا توجد طلبات جارية حالياً' : 'No Active Orders'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'ar' 
              ? 'يمكنك الآن نشر طلب خدمة فوري أو مجدول من دليل الخدمات، ويمكنك نشر أكثر من طلب ومتابعتها معاً.' 
              : 'You can now dispatch an artisan or schedule multiple bookings concurrently.'}
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>نشر أول طلب خدمة الآن</span>
          </button>
        </div>
      )}

      {/* Completed Orders History */}
      {orderHistory.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            {language === 'ar' ? 'سجل الطلبات السابقة المنجزة' : 'Past Orders History'}
          </h3>

          <div className="space-y-2">
            {orderHistory.map(ord => (
              <div 
                key={ord.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {ord.subServiceName}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {ord.artisanName} · {ord.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                    {ord.estimatedCost} {t.currency}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    ord.status === 'completed' 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' 
                      : 'bg-rose-50 text-rose-700'
                  }`}>
                    {ord.status === 'completed' ? (language === 'ar' ? 'مكتمل وموثق' : 'Completed') : (language === 'ar' ? 'ملغي' : 'Cancelled')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
