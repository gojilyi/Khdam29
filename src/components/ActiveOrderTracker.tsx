import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, 
  CheckCircle2, 
  Truck, 
  Check, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Star,
  ChevronLeft,
  XCircle,
  Plus
} from 'lucide-react';
import { OrderStatus, Order } from '../types';
import { formatDZD } from '../data/algeriaData';
import { Card, Button, Badge, Rating, Avatar } from './ui';

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
    setActiveTab,
    artisans,
    setBookingModalService
  } = useApp();

  const [confirmCancel, setConfirmCancel] = useState(false);

  // The 4 authentic status steps requested by user:
  // أُرسل ← قُبل ← في الطريق ← مكتمل
  const pipelineSteps: { key: OrderStatus; label: string; icon: any }[] = [
    { key: 'searching', label: 'أُرسل', icon: Send },
    { key: 'artisan_assigned', label: 'قُبل', icon: CheckCircle2 },
    { key: 'on_the_way', label: 'في الطريق', icon: Truck },
    { key: 'completed', label: 'مكتمل', icon: Check },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'searching': return 0;
      case 'artisan_assigned': return 1;
      case 'on_the_way': return 2;
      case 'in_progress': return 2;
      case 'awaiting_confirmation': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 0;
  const currentArtisan = activeOrder?.artisanId ? artisans.find(a => a.id === activeOrder.artisanId) : null;

  return (
    <div className="space-y-6">
      {/* 1. Header & Orders Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-bold text-[#0A4D2E]">
            متابعة الطلبات
          </h1>
          <p className="text-[14px] text-[#5B6660] mt-0.5">
            تابع مسار طلباتك مع الحرفيين خطوة بخطوة من الإرسال حتى اكتمال العمل.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" strokeWidth={1.75} />}
          onClick={() => setBookingModalService({ categoryId: 'home_repair', subServiceId: 'plumbing' })}
          className="shrink-0"
        >
          طلب خدمة جديدة
        </Button>
      </div>

      {activeOrders.length === 0 ? (
        /* Empty State */
        <Card variant="white" className="p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-[8px] bg-[#EEF6F1] text-[#0A4D2E] mx-auto flex items-center justify-center">
            <Clock className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <h3 className="text-[18px] font-bold text-[#0A4D2E]">
            لا توجد طلبات نشطة حالياً
          </h3>
          <p className="text-[14px] text-[#5B6660] max-w-sm mx-auto">
            يمكنك تصفح دليل المهن وطلب سباك أو كهربائي أو أي حرفي في ولايتك بكل سهولة.
          </p>
          <Button 
            variant="primary" 
            onClick={() => setActiveTab('home')}
            className="mt-2"
          >
            تصفح خدمات خدّام
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Order Selector Tabs if multiple */}
          {activeOrders.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {activeOrders.map((ord, idx) => (
                <button
                  key={ord.id}
                  onClick={() => setSelectedActiveOrderId(ord.id)}
                  className={`
                    px-3.5 py-2 rounded-[8px] text-[13px] font-semibold whitespace-nowrap border transition-colors cursor-pointer
                    ${selectedActiveOrderId === ord.id 
                      ? 'bg-[#0F6B3F] text-white border-[#0F6B3F]' 
                      : 'bg-white text-[#5B6660] border-[#DDE3DF] hover:bg-[#EEF6F1]'}
                  `}
                >
                  طلب #{idx + 1}: {ord.subServiceName}
                </button>
              ))}
            </div>
          )}

          {activeOrder && (
            <Card variant="white" className="p-5 sm:p-6 space-y-6">
              {/* Order Info & Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DDE3DF]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-[#0F6B3F] bg-[#EEF6F1] px-2 py-0.5 rounded-[8px]">
                      طلب #{activeOrder.id.slice(-5)}
                    </span>
                    <span className="text-[12px] text-[#5B6660]">
                      {activeOrder.createdAt ? new Date(activeOrder.createdAt).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }) : 'اليوم'}
                    </span>
                  </div>
                  <h2 className="text-[20px] font-bold text-[#1C2421] mt-1">
                    {activeOrder.subServiceName}
                  </h2>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[12px] text-[#5B6660] block">التكلفة التقديرية</span>
                  <span className="text-[18px] font-bold text-[#0A4D2E] tabular-nums">
                    {formatDZD(activeOrder.estimatedCost || 1800)}
                  </span>
                </div>
              </div>

              {/* Status Bar Pipeline: أُرسل ← قُبل ← في الطريق ← مكتمل */}
              <div className="py-2">
                <div className="grid grid-cols-4 relative min-w-0">
                  {/* Connecting Line */}
                  <div className="absolute top-5 right-[12%] left-[12%] h-1 bg-[#DDE3DF] -z-0" />
                  <div 
                    className="absolute top-5 right-[12%] h-1 bg-[#0F6B3F] -z-0 transition-all duration-300"
                    style={{ 
                      width: `${(currentStepIdx / (pipelineSteps.length - 1)) * 76}%` 
                    }}
                  />

                  {pipelineSteps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isPassed = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={step.key} className="flex flex-col items-center text-center relative z-10 min-w-0 px-0.5">
                        <div 
                          className={`
                            w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors shrink-0
                            ${isPassed 
                              ? 'bg-[#0F6B3F] text-white border-2 border-[#0F6B3F]' 
                              : 'bg-white text-[#5B6660] border-2 border-[#DDE3DF]'}
                          `}
                        >
                          <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} />
                        </div>
                        <span 
                          className={`text-[10px] sm:text-[12px] mt-1.5 sm:mt-2 font-medium truncate max-w-full ${
                            isCurrent ? 'text-[#0A4D2E] font-bold' : isPassed ? 'text-[#1C2421]' : 'text-[#5B6660]'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Description Message */}
              <div className="p-3.5 bg-[#EEF6F1] border border-[#DDE3DF] rounded-[8px] text-[13px] text-[#0A4D2E]">
                {currentStepIdx === 0 && (
                  <p>تم إرسال طلبك، جاري إشعار الحرفيين المتوفرين في محيطك لتأكيد استلام المهمة.</p>
                )}
                {currentStepIdx === 1 && (
                  <p>قَبِل الحرفي طلبك بنجاح، جاري تنسيق الوصول وتجهيز المعدات المطلوبة.</p>
                )}
                {currentStepIdx === 2 && (
                  <p>الحرفي في الطريق إليك الآن، يُرجى التأكد من الرد على المكالمات لتسهيل الوصول.</p>
                )}
                {currentStepIdx === 3 && (
                  <p>تم إنجاز الخدمة بنجاح! نرجو تقييم الحرفي لمساعدتنا في الحفاظ على أعلى معايير الجودة.</p>
                )}
              </div>

              {/* Artisan Profile Info if Assigned */}
              {activeOrder.artisanName && (
                <div className="p-4 bg-white border border-[#DDE3DF] rounded-[12px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={currentArtisan?.avatar}
                      alt={activeOrder.artisanName}
                      size="md"
                    />
                    <div>
                      <h4 className="text-[15px] font-bold text-[#1C2421]">
                        {activeOrder.artisanName}
                      </h4>
                      <p className="text-[12px] text-[#5B6660]">
                        حرفي معتمد · {activeOrder.city || 'الجزائر'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Phone className="w-4 h-4 text-[#0F6B3F]" strokeWidth={1.75} />}
                      onClick={() => startCall(activeOrder.artisanId || 'art_1', activeOrder.artisanName || 'الحرفي', '0550 12 34 56')}
                    >
                      اتصال
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<MessageSquare className="w-4 h-4 text-[#0F6B3F]" strokeWidth={1.75} />}
                      onClick={() => setIsChatOpen(true)}
                    >
                      مراسلة
                    </Button>
                  </div>
                </div>
              )}

              {/* Progress & Completion Actions */}
              <div className="pt-3 border-t border-[#DDE3DF] flex flex-wrap items-center justify-between gap-3">
                {activeOrder.status !== 'completed' ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => advanceOrderStatus(activeOrder.id)}
                    >
                      تحديث الحالة للمرحلة التالية
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => completeCurrentOrder()}
                    >
                      تأكيد اكتمال العمل
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Star className="w-4 h-4 fill-white" strokeWidth={1.75} />}
                    onClick={() => setIsReviewModalOpen(true)}
                  >
                    تقييم أداء الحرفي
                  </Button>
                )}

                {activeOrder.status !== 'completed' && (
                  <div>
                    {!confirmCancel ? (
                      <button
                        onClick={() => setConfirmCancel(true)}
                        className="text-[13px] text-[#C62828] hover:underline cursor-pointer"
                      >
                        إلغاء هذا الطلب
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[#C62828]">هل أنت متأكد؟</span>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            cancelCurrentOrder();
                            setConfirmCancel(false);
                          }}
                        >
                          نعم، إلغاء
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmCancel(false)}
                        >
                          تراجع
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
