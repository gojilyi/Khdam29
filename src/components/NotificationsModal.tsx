import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  Truck, 
  MessageSquare, 
  AlertCircle, 
  Sparkles, 
  ExternalLink, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Send,
  Zap,
  Volume2
} from 'lucide-react';
import { AppNotification } from '../types';
import { requestNotificationPermission } from '../utils/notificationSound';

export const NotificationsModal: React.FC = () => {
  const {
    notifications,
    isNotificationsModalOpen,
    setIsNotificationsModalOpen,
    markAllNotificationsRead,
    markNotificationAsRead,
    clearAllNotifications,
    setActiveTab,
    testSimulateOrderNotification,
    testSimulateQnAReplyNotification,
    language
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'order' | 'qna' | 'system'>('all');
  const [permissionState, setPermissionState] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  if (!isNotificationsModalOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermissionState(res);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'order') return n.type === 'order';
    if (activeFilter === 'qna') return n.type === 'qna';
    if (activeFilter === 'system') return n.type === 'announcement' || n.type === 'alert' || n.type === 'update';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleActionClick = (n: AppNotification) => {
    if (n.id) markNotificationAsRead(n.id);
    setIsNotificationsModalOpen(false);
    if (n.actionLink) {
      setActiveTab(n.actionLink);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  مركز التنبيهات المباشرة
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-black animate-pulse">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                تحديثات لحظية لحالة طلباتك وردود الحرفيين في منتدى الاستشارات
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationsModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Permission Banner (if not granted) */}
        {permissionState !== 'granted' && permissionState !== 'unsupported' && (
          <div className="px-5 py-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
              <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>فعل إشعارات النظام والصوت لتصلك تحديثات الطلبات فوراً</span>
            </div>
            <button
              onClick={handleRequestPermission}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[11px] whitespace-nowrap shadow-xs transition-transform active:scale-95"
            >
              تفعيل التنبيهات 🔔
            </button>
          </div>
        )}

        {/* Quick Testing Bar for Live Feedback */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>تجربة التنبيهات الحية:</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => testSimulateOrderNotification()}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-colors whitespace-nowrap"
              title="محاكاة إشعار تغير حالة الطلب (وصول حرفي، انطلاق، إنجاز...)"
            >
              <Truck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>تنبيه حالة طلب 📦</span>
            </button>
            <button
              onClick={() => testSimulateQnAReplyNotification()}
              className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-[11px] font-bold flex items-center gap-1 transition-colors whitespace-nowrap"
              title="محاكاة إشعار استلام رد حرفي معتمد على استشارتك"
            >
              <MessageSquare className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>تنبيه رد استشارة 💬</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Bulk Actions */}
        <div className="p-4 sm:px-6 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeFilter === 'all'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              الكل ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('order')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeFilter === 'order'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>الطلبات ({notifications.filter(n => n.type === 'order').length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('qna')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeFilter === 'qna'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>الاستشارات ({notifications.filter(n => n.type === 'qna').length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('system')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeFilter === 'system'
                  ? 'bg-slate-800 text-white shadow-xs dark:bg-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              عام
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1"
                title="تحديد جميع التنبيهات كمقروءة"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تحديد كمقروء</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                title="مسح كافة التنبيهات"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 min-h-[280px]">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  لا توجد تنبيهات في هذا القسم حالياً
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  ستصلك تنبيهات صوتية ومباشرة فور تقدم حالة طلباتك أو عند رد الحرفيين على استشاراتك.
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isOrder = notif.type === 'order';
              const isQnA = notif.type === 'qna';

              return (
                <div
                  key={notif.id}
                  onClick={() => notif.id && markNotificationAsRead(notif.id)}
                  className={`p-4 rounded-2xl border transition-all ${
                    !notif.isRead
                      ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-300 dark:border-amber-800 shadow-xs'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isOrder
                          ? 'bg-emerald-500 text-white'
                          : isQnA
                          ? 'bg-blue-600 text-white'
                          : notif.type === 'alert'
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {isOrder ? (
                        <Truck className="w-4 h-4" />
                      ) : isQnA ? (
                        <MessageSquare className="w-4 h-4" />
                      ) : notif.type === 'alert' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              isOrder
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                : isQnA
                                ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            {isOrder ? 'تحديث الطلب' : isQnA ? 'منتدى الاستشارات' : 'تنبيه'}
                          </span>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{notif.sentAt}</span>
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {notif.message}
                      </p>

                      {notif.note && (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 italic">
                          "{notif.note}"
                        </div>
                      )}

                      {notif.actionLink && (
                        <div className="pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick(notif);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 ${
                              isOrder
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : isQnA
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                            }`}
                          >
                            <span>{notif.linkText || (isOrder ? 'تتبع الطلب مباشرة 📍' : 'عرض في المنتدى 💡')}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>نظام إشعارات فوري ومباشر Web Push & In-App Alerts</span>
          </div>
          <button
            onClick={() => setIsNotificationsModalOpen(false)}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-bold transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
