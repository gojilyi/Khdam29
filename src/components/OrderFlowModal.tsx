import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { serviceCategories } from '../data/mockData';
import { 
  X, 
  Check, 
  MapPin, 
  Calendar, 
  Phone, 
  FileText, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  UploadCloud
} from 'lucide-react';
import { ALGERIA_WILAYAS, formatDZD, validateAlgerianPhone } from '../data/algeriaData';
import { Button, Input, Card } from './ui';

export const OrderFlowModal: React.FC = () => {
  const { 
    bookingModalService, 
    setBookingModalService, 
    createOrder, 
    currentUser,
    selectedCity,
    artisans
  } = useApp();

  // 4 Steps: 1: نوع الخدمة | 2: وصف وصور | 3: العنوان والموعد | 4: تأكيد
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedTrade, setSelectedTrade] = useState<string>(bookingModalService?.prefilledTrade || 'سبّاك');
  const [description, setDescription] = useState<string>(bookingModalService?.prefilledDescription || '');
  const [attachedImage, setAttachedImage] = useState<string | null>(bookingModalService?.prefilledImage || null);
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [wilaya, setWilaya] = useState<string>(selectedCity || 'الجزائر العاصمة');
  const [commune, setCommune] = useState<string>('حيدرة');
  const [streetAddress, setStreetAddress] = useState<string>('حي السلام، عمارة 4');
  const [clientName, setClientName] = useState<string>(currentUser?.name || 'كريم بن عيسى');
  const [phone, setPhone] = useState<string>('0550 12 34 56');
  const [phoneError, setPhoneError] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('اليوم - في أقرب وقت');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (bookingModalService?.prefilledTrade) {
      setSelectedTrade(bookingModalService.prefilledTrade);
    }
    if (bookingModalService?.prefilledDescription) {
      setDescription(bookingModalService.prefilledDescription);
    }
    if (bookingModalService?.prefilledImage) {
      setAttachedImage(bookingModalService.prefilledImage);
    }
  }, [bookingModalService]);

  if (!bookingModalService) return null;

  // Selected matched artisan if passed
  const targetArtisan = bookingModalService.artisanId 
    ? artisans.find(a => a.id === bookingModalService.artisanId) 
    : null;

  const currentWilayaObj = ALGERIA_WILAYAS.find(w => w.name === wilaya) || ALGERIA_WILAYAS[15]; // default Alger

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (phoneError) {
      const res = validateAlgerianPhone(val);
      if (res.isValid) {
        setPhoneError('');
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 3) {
      // Validate phone before moving to confirmation
      const phoneRes = validateAlgerianPhone(phone);
      if (!phoneRes.isValid) {
        setPhoneError(phoneRes.error || 'يرجى إدخال رقم هاتف جزائري صحيح');
        return;
      }
      setPhoneError('');
    }
    setCurrentStep((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : prev));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : prev));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRes = validateAlgerianPhone(phone);
    if (!phoneRes.isValid) {
      setPhoneError(phoneRes.error || 'يرجى إدخال رقم هاتف جزائري صحيح');
      setCurrentStep(3);
      return;
    }

    createOrder({
      categoryId: bookingModalService.categoryId,
      subServiceId: bookingModalService.subServiceId,
      subServiceName: targetArtisan ? `${targetArtisan.trade} - ${targetArtisan.name}` : selectedTrade,
      type: urgency === 'urgent' ? 'instant' : 'scheduled',
      scheduledDate,
      clientName: clientName.trim(),
      clientPhone: phoneRes.formatted || phone.trim(),
      clientPhoneVisible: true,
      preferredContact: 'direct_call',
      address: `${streetAddress}، ${commune}، ${wilaya}`,
      city: wilaya,
      notes: description.trim(),
      estimatedCost: targetArtisan?.hourlyRate || 1800,
      artisanId: targetArtisan?.id
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setBookingModalService(null);
    }, 2200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C2421]/60"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-[calc(100%-32px)] sm:max-w-xl bg-white border border-[#DDE3DF] rounded-[12px] p-4 sm:p-6 shadow-[0_4px_16px_rgba(28,36,33,0.12)] relative max-h-[90vh] max-h-[90dvh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setBookingModalService(null)}
          className="absolute left-3 top-3 sm:left-4 sm:top-4 w-9 h-9 flex items-center justify-center text-[#5B6660] hover:text-[#1C2421] hover:bg-[#EEF6F1] rounded-[8px] transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center mx-auto border border-[#1E9B5C]/30">
              <Check className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <h3 className="text-[20px] font-bold text-[#0A4D2E]">
              تم إرسال طلبك، ننتظر ردّ الحرفي
            </h3>
            <p className="text-[14px] text-[#5B6660] max-w-sm mx-auto">
              سيصلك إشعار فوري وتنبيه عبر التطبيق بمجرد قبول الحرفي للطلب وبدء التوجه إلى موقعك.
            </p>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="mb-5 pl-8 sm:pl-10">
              <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0A4D2E]">
                طلب خدمة حرفية
              </h2>
              <p className="text-[12px] sm:text-[13px] text-[#5B6660] mt-0.5">
                {targetArtisan ? `طلب مباشر من الحرفي ${targetArtisan.name}` : 'أرسل تفاصيل العطل وسيتواصل معك الحرفي'}
              </p>
            </div>

            {/* Step Progress Indicators: 4 Steps */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-6 min-w-0">
              {[
                { num: 1, label: 'الخدمة' },
                { num: 2, label: 'التفاصيل' },
                { num: 3, label: 'الموعد' },
                { num: 4, label: 'تأكيد' }
              ].map((s) => (
                <div key={s.num} className="text-center min-w-0">
                  <div 
                    className={`
                      h-1.5 rounded-[4px] mb-1.5 transition-colors
                      ${currentStep >= s.num ? 'bg-[#0F6B3F]' : 'bg-[#DDE3DF]'}
                    `} 
                  />
                  <span className={`text-[10px] sm:text-[11px] truncate block font-medium ${currentStep === s.num ? 'text-[#0A4D2E] font-bold' : 'text-[#5B6660]'}`}>
                    {s.num}. {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: نوع الخدمة */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[14px] font-semibold text-[#1C2421]">
                    نوع الحرفة أو المشكل
                  </label>
                  <select
                    value={selectedTrade}
                    onChange={(e) => setSelectedTrade(e.target.value)}
                    className="w-full h-11 px-3.5 bg-white border border-[#DDE3DF] rounded-[8px] text-[14px] text-[#1C2421] focus:outline-none focus:ring-1 focus:ring-[#1E9B5C] focus:border-[#1E9B5C]"
                  >
                    <option value="سبّاك">سبّاك (تسربات مياه، ترصيص صحي، سخانات)</option>
                    <option value="كهربائي">كهربائي (أعطال كهربائية، إنارة، قواطع)</option>
                    <option value="نجّار">نجّار (أبواب، خزائن، مطابخ خشبية)</option>
                    <option value="دهّان (صباغ)">دهّان (طلاء جدران، جبس بورد BA13)</option>
                    <option value="فني تكييف">فني تكييف (شحن فريون، صيانة مكيفات)</option>
                    <option value="بنّاء">بنّاء (ترميم، أشغال خرسانة وإسمنت)</option>
                    <option value="حدّاد">حدّاد (أبواب حديدية، شبابيك حماية، لحام)</option>
                    <option value="ميكانيكي">ميكانيكي (صيانة سيارات، مساعدة طريق)</option>
                    <option value="تبليط (كارلاج)">تبليط (كارلاج، سيراميك، فايونس)</option>
                    <option value="فني ألمنيوم">فني ألمنيوم (شبابيك، أبواب PVC، مطابخ)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[14px] font-semibold text-[#1C2421]">
                    درجة الاستعجال
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUrgency('normal')}
                      className={`
                        h-11 px-3 rounded-[8px] border text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer
                        ${urgency === 'normal' 
                          ? 'border-[#0F6B3F] bg-[#EEF6F1] text-[#0A4D2E]' 
                          : 'border-[#DDE3DF] text-[#5B6660] hover:bg-[#EEF6F1]'}
                      `}
                    >
                      <Clock className="w-4 h-4" strokeWidth={1.75} />
                      <span>موعد عادي</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUrgency('urgent')}
                      className={`
                        h-11 px-3 rounded-[8px] border text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer
                        ${urgency === 'urgent' 
                          ? 'border-[#0F6B3F] bg-[#EEF6F1] text-[#0A4D2E]' 
                          : 'border-[#DDE3DF] text-[#5B6660] hover:bg-[#EEF6F1]'}
                      `}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#E8A317]" />
                      <span>تدخل عاجل (اليوم)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: وصف + صور */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[14px] font-semibold text-[#1C2421]">
                    اشرح العطل أو العمل المطلوب بدقة
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="مثال: تسرب ماء تحت حوض المطبخ، نحتاج تغيير الأنبوب وفحص المضخة..."
                    className="w-full p-3.5 bg-white border border-[#DDE3DF] rounded-[8px] text-[14px] text-[#1C2421] placeholder:text-[#5B6660]/70 focus:outline-none focus:ring-1 focus:ring-[#1E9B5C] focus:border-[#1E9B5C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[14px] font-semibold text-[#1C2421]">
                    صورة العطل (اختياري)
                  </label>
                  {attachedImage ? (
                    <div className="relative rounded-[8px] overflow-hidden border border-[#1E9B5C] p-1 bg-[#EEF6F1]">
                      <img src={attachedImage} alt="صورة العطل" className="w-full h-36 object-cover rounded-[6px]" />
                      <button
                        type="button"
                        onClick={() => setAttachedImage(null)}
                        className="absolute top-3 left-3 bg-[#1C2421]/80 hover:bg-[#1C2421] text-white p-1 rounded-full cursor-pointer"
                        title="حذف الصورة"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="block text-[11px] text-[#0A4D2E] font-medium p-1 text-center">
                        تم إرفاق صورة العطل بنجاح ✓
                      </span>
                    </div>
                  ) : (
                    <div className="border border-dashed border-[#DDE3DF] hover:border-[#1E9B5C] rounded-[8px] p-4 text-center bg-[#EEF6F1]/50 cursor-pointer transition-colors">
                      <UploadCloud className="w-6 h-6 text-[#0F6B3F] mx-auto mb-1" strokeWidth={1.75} />
                      <span className="text-[13px] font-medium text-[#0A4D2E]">انقر لرفع صورة العطل من هاتفك</span>
                      <p className="text-[11px] text-[#5B6660] mt-0.5">تساعد الحرفي على تجهيز الأدوات المناسبة قبل القدوم</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: العنوان ورقم الهاتف الجزائري */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[13px] font-semibold text-[#1C2421]">الولاية</label>
                    <select
                      value={wilaya}
                      onChange={(e) => setWilaya(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-[#DDE3DF] rounded-[8px] text-[13px] text-[#1C2421] focus:outline-none focus:ring-1 focus:ring-[#1E9B5C]"
                    >
                      {ALGERIA_WILAYAS.map(w => (
                        <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[13px] font-semibold text-[#1C2421]">البلدية</label>
                    <select
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-[#DDE3DF] rounded-[8px] text-[13px] text-[#1C2421] focus:outline-none focus:ring-1 focus:ring-[#1E9B5C]"
                    >
                      {(currentWilayaObj.communes || ['البلدية المركزية']).map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Input
                  label="الحي وعنوان السكن"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="مثال: حي 500 مسكن، عمارة 12، باب 4"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="اسمك الكامل"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="الاسم واللقب"
                  />

                  {/* Algerian Phone Input with Regex Validation */}
                  <Input
                    label="رقم الهاتف (05 / 06 / 07)"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="0550 12 34 56"
                    error={phoneError}
                    hint="يتواصل معك الحرفي مباشرة لتأكيد الموعد"
                  />
                </div>
              </div>
            )}

            {/* Step 4: تأكيد الطلب */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <Card variant="light" className="p-4 space-y-3">
                  <h4 className="text-[14px] font-bold text-[#0A4D2E] border-b border-[#DDE3DF] pb-2">
                    ملخص الطلب
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-[13px]">
                    <div>
                      <span className="text-[#5B6660]">الخدمة المطلوبة:</span>
                      <p className="font-semibold text-[#1C2421]">{targetArtisan ? targetArtisan.trade : selectedTrade}</p>
                    </div>
                    <div>
                      <span className="text-[#5B6660]">الموقع:</span>
                      <p className="font-semibold text-[#1C2421] truncate">{wilaya} · {commune}</p>
                    </div>
                    <div>
                      <span className="text-[#5B6660]">رقم الهاتف:</span>
                      <p className="font-semibold text-[#1C2421] tabular-nums font-mono">{phone}</p>
                    </div>
                    <div>
                      <span className="text-[#5B6660]">التسعيرة التقديرية:</span>
                      <p className="font-bold text-[#0A4D2E] tabular-nums">
                        {formatDZD(targetArtisan?.hourlyRate || 1800)}/ساعة
                      </p>
                    </div>
                  </div>

                  {description && (
                    <div className="pt-2 border-t border-[#DDE3DF] text-[12px] text-[#5B6660]">
                      <span>ملاحظات: </span>
                      <span className="text-[#1C2421]">{description}</span>
                    </div>
                  )}
                </Card>

                <p className="text-[12px] text-[#5B6660]">
                  بالنقر على "تأكيد وإرسال الطلب"، سيتم ربطك بأقرب حرفي معتمد مع ضمان حماية بياناتك وأمان المعاملة.
                </p>
              </div>
            )}

            {/* Footer Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-[#DDE3DF]">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  leftIcon={<ChevronRight className="w-4 h-4" strokeWidth={1.75} />}
                >
                  السابق
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  onClick={handleNextStep}
                  rightIcon={<ChevronLeft className="w-4 h-4" strokeWidth={1.75} />}
                >
                  متابعة ({currentStep}/4)
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmitOrder}
                  leftIcon={<Check className="w-4 h-4" strokeWidth={2} />}
                >
                  تأكيد وإرسال الطلب
                </Button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
