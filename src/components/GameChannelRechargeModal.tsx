import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockRechargeCatalog } from '../data/mockData';
import { GameChannelRechargeItem, RechargePackageOption } from '../types';
import { 
  X, 
  Gamepad2, 
  Tv, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink,
  MessageCircle,
  Clock,
  Zap,
  HelpCircle
} from 'lucide-react';

interface GameChannelRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItem?: GameChannelRechargeItem | null;
}

export const GameChannelRechargeModal: React.FC<GameChannelRechargeModalProps> = ({
  isOpen,
  onClose,
  initialItem
}) => {
  const { currentUser, language, createOrder } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | 'game' | 'channel' | 'card'>('all');
  const [selectedItem, setSelectedItem] = useState<GameChannelRechargeItem>(initialItem || mockRechargeCatalog[0]);
  const [selectedPackage, setSelectedPackage] = useState<RechargePackageOption>(
    (initialItem || mockRechargeCatalog[0]).options.find(o => o.popular) || (initialItem || mockRechargeCatalog[0]).options[0]
  );
  const [targetAccountInput, setTargetAccountInput] = useState('');
  const [clientName, setClientName] = useState(currentUser.name || 'هشام بن علي');
  const [clientPhone, setClientPhone] = useState(currentUser.phone || '+213 550 12 34 56');
  const [paymentMethod, setPaymentMethod] = useState<'baridimob' | 'ccp' | 'cash'>('baridimob');
  const [orderStep, setOrderStep] = useState<'select' | 'payment' | 'success'>('select');
  const [copiedRip, setCopiedRip] = useState(false);

  if (!isOpen) return null;

  const filteredItems = mockRechargeCatalog.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleSelectItem = (item: GameChannelRechargeItem) => {
    setSelectedItem(item);
    setSelectedPackage(item.options.find(o => o.popular) || item.options[0]);
    setTargetAccountInput('');
  };

  const baridimobRip = '00799999002233445566';
  const ccpNumber = '0012345678 مفتاح 99';

  const handleCopyRip = (text: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedRip(true);
    setTimeout(() => setCopiedRip(false), 2500);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAccountInput.trim()) return;
    setOrderStep('payment');
  };

  const handleFinalizeOrder = () => {
    // 1. Create a platform tracked order
    createOrder({
      categoryId: 'gaming_channels_recharge',
      subServiceId: selectedItem.id,
      subServiceName: `${selectedItem.nameAr} — ${selectedPackage.labelAr}`,
      type: 'instant',
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientPhoneVisible: true,
      preferredContact: 'whatsapp',
      address: 'طلب شحن رقمي فوري أونلاين',
      city: 'الجزائر العاصمة',
      notes: `المعرف / الحساب: ${targetAccountInput.trim()} | الباقة: ${selectedPackage.labelAr} (${selectedPackage.priceDzd} دج) | وسيلة الدفع: ${paymentMethod === 'baridimob' ? 'بريدي موب BaridiMob' : paymentMethod === 'ccp' ? 'حوالة CCP' : 'يد بيد'}`,
      estimatedCost: selectedPackage.priceDzd
    });

    setOrderStep('success');
  };

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم، أود تأكيد طلب شحن عبر تطبيق خدام:\n` +
    `• الخدمة: ${selectedItem.nameAr}\n` +
    `• الباقة: ${selectedPackage.labelAr}\n` +
    `• السعر: ${selectedPackage.priceDzd} دج\n` +
    `• الآيدي / الحساب: ${targetAccountInput}\n` +
    `• الاسم: ${clientName}\n` +
    `• الهاتف: ${clientPhone}\n` +
    `• وسيلة الدفع: ${paymentMethod === 'baridimob' ? 'بريدي موب BaridiMob' : 'CCP'}\n` +
    `يرجى تزويدي بالوصل والشحن الفوري، شكراً!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative my-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute rtl:left-4 ltr:right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>خدمة رقمية فورية معتمدة بالدينار الجزائري</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
              شحن الألعاب والقنوات والبطاقات الرقمية
            </h3>
          </div>
        </div>

        {orderStep === 'select' && (
          <div className="mt-5 space-y-6">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                جميع الخدمات
              </button>
              <button
                onClick={() => setActiveCategory('game')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === 'game'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>شحن الألعاب (Free Fire, PUBG)</span>
              </button>
              <button
                onClick={() => setActiveCategory('channel')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === 'channel'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>اشتراكات القنوات وIPTV</span>
              </button>
              <button
                onClick={() => setActiveCategory('card')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === 'card'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>بطاقات المتاجر (PlayStation)</span>
              </button>
            </div>

            {/* Select Target Item Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                1. اختر اللعبة أو القناة المطلوبة:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {filteredItems.map(item => {
                  const isSelected = selectedItem.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectItem(item)}
                      className={`p-3 rounded-2xl border text-start transition-all relative flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 ring-2 ring-purple-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {item.badge && (
                        <span className="absolute -top-2 rtl:left-2 ltr:right-2 px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[9px]">
                          {item.badge}
                        </span>
                      )}
                      <div>
                        <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center mb-2">
                          {item.category === 'game' ? (
                            <Gamepad2 className="w-4 h-4" />
                          ) : item.category === 'channel' ? (
                            <Tv className="w-4 h-4" />
                          ) : (
                            <CreditCard className="w-4 h-4" />
                          )}
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                          {item.nameAr}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.name}
                        </p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-purple-700 dark:text-purple-300">
                        <span>من {item.options[0]?.priceDzd} دج</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Package for the chosen item */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  2. حدد الباقة أو كمية الشحن لـ ({selectedItem.nameAr}):
                </label>
                <span className="text-[10px] text-slate-400">
                  الأسعار شاملة الرسوم بالدينار
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedItem.options.map(pkg => {
                  const isPkgSelected = selectedPackage.id === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackage(pkg)}
                      className={`p-3 rounded-2xl border text-start transition-all flex items-center justify-between cursor-pointer ${
                        isPkgSelected
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 ring-2 ring-purple-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {pkg.labelAr}
                          </span>
                          {pkg.popular && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold">
                              الأكثر طلباً
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          {pkg.label}
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="text-sm font-black text-purple-700 dark:text-purple-300">
                          {pkg.priceDzd.toLocaleString()} دج
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Account Input (ID or Email) */}
            <form onSubmit={handleProceedToPayment} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                    <span>3. بيانات الشحن المطلوبة *</span>
                  </label>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                    تأكيد دقيق بدون أخطاء
                  </span>
                </div>
                <input
                  type="text"
                  required
                  placeholder={selectedItem.inputPlaceholderAr}
                  value={targetAccountInput}
                  onChange={(e) => setTargetAccountInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-purple-500 shrink-0" />
                  <span>{selectedItem.instructionsAr}</span>
                </p>
              </div>

              {/* Total Bar and CTA */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div>
                  <span className="text-xs text-purple-200 block">إجمالي المبلغ المطلوب دفعه:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-amber-300">
                      {selectedPackage.priceDzd.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-purple-200">دينار جزائري (دج)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!targetAccountInput.trim()}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <span>متابعة لاختيار وسيلة الدفع والتنفيذ</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: PAYMENT & CONFIRMATION */}
        {orderStep === 'payment' && (
          <div className="mt-5 space-y-6 animate-fade-in">
            <button
              onClick={() => setOrderStep('select')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>العودة لتعديل الباقة أو المعرف</span>
            </button>

            {/* Order Summary Box */}
            <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span>الخدمة المطلوبة:</span>
                <span className="text-purple-700 dark:text-purple-300 font-black">{selectedItem.nameAr}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>الباقة المحددة:</span>
                <span className="font-bold">{selectedPackage.labelAr}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>المعرف / الحساب:</span>
                <span className="font-mono font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                  {targetAccountInput}
                </span>
              </div>
              <div className="pt-2 border-t border-purple-200/60 dark:border-purple-800/60 flex items-center justify-between">
                <span className="font-black text-xs text-slate-900 dark:text-white">المبلغ النهائي:</span>
                <span className="text-lg font-black text-purple-700 dark:text-purple-300">{selectedPackage.priceDzd.toLocaleString()} دج</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                اختر وسيلة تحويل المبلغ:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('baridimob')}
                  className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer ${
                    paymentMethod === 'baridimob'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 ring-2 ring-purple-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      بريدي موب (BaridiMob)
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-black">
                      فوري ⚡
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    تحويل مباشر عبر تطبيق بريدي موب يصل في ثوانٍ معدودة.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ccp')}
                  className={`p-3.5 rounded-2xl border text-start transition-all cursor-pointer ${
                    paymentMethod === 'ccp'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 ring-2 ring-purple-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      حوالة بريدية CCP
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[9px] font-bold">
                      مكاتب البريد
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    إيداع في مركز البريد مع تصوير الوصل وتأكيده.
                  </p>
                </button>
              </div>
            </div>

            {/* Payment Account Details Display */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {paymentMethod === 'baridimob' ? 'رقم الحساب البريدي الجاري RIP (بريدي موب):' : 'رقم الحساب الجاري CCP:'}
                </span>
                <button
                  onClick={() => handleCopyRip(paymentMethod === 'baridimob' ? baridimobRip : ccpNumber)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:bg-slate-100 cursor-pointer"
                >
                  {copiedRip ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRip ? 'تم النسخ ✓' : 'نسخ الرقم'}</span>
                </button>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-purple-400 font-mono text-center text-sm font-black text-purple-700 dark:text-purple-300 tracking-wider">
                {paymentMethod === 'baridimob' ? baridimobRip : ccpNumber}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                بعد التحويل، قم بالنقر على زر التأكيد أدناه وسينتقل طلبك مباشرة للمتابعة مع إمكانية إرسال الإشعار بالواتساب.
              </p>
            </div>

            {/* Confirm & Finalize Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleFinalizeOrder}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-transform active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تأكيد تسجيل طلب الشحن في تطبيق خدام</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS & WHATSAPP LAUNCHER */}
        {orderStep === 'success' && (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                تم تسجيل طلب الشحن بنجاح!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                طلبك محفوظ ومسجل في قائمة طلباتك النشطة. يمكنك الآن إرسال إشعار الدفع مباشرة للتاجر عبر الواتساب لتسريع الشحن فوراً.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 max-w-md mx-auto text-start space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">الطلب:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedItem.nameAr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الباقة:</span>
                <span className="font-bold text-purple-600">{selectedPackage.labelAr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">المعرف:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{targetAccountInput}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">المبلغ:</span>
                <span className="font-black text-emerald-600">{selectedPackage.priceDzd.toLocaleString()} دج</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <a
                href={`https://wa.me/213550123456?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>إرسال الوصل للتاجر عبر الواتساب فوراً</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs sm:text-sm transition-colors"
              >
                إغلاق والعودة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
