import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  DollarSign, 
  Search, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Zap, 
  HelpCircle, 
  Wrench, 
  Sparkles, 
  AlertCircle, 
  Filter,
  Layers,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { BenchmarkPriceItem } from '../types';

export const BenchmarkPricingGuide: React.FC = () => {
  const { 
    benchmarkPrices, 
    setBookingModalService, 
    categories, 
    setActiveTab, 
    language,
    t 
  } = useApp();

  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categoriesList = [
    { id: 'all', label: 'جميع الخدمات الشائعة' },
    { id: 'أعمال وحرف النساء والإنتاج المنزلي', label: 'حرف النساء والطبخ والحلويات' },
    { id: 'التبريد والتكييف والأجهزة', label: 'تكييف وأجهزة كهرومنزلية' },
    { id: 'السباكة والترصيص الصحي', label: 'سباكة وترصيص صحي' },
    { id: 'الكهرباء المنزلية والإنارة', label: 'كهرباء وإنارة' },
    { id: 'النجارة والأقفال', label: 'نجارة وأقفال' },
    { id: 'الدهان والتشطيبات والديكور', label: 'دهان وديكور' },
    { id: 'البناء والترميم والتشطيب', label: 'بناء وسيراميك' },
    { id: 'ميكانيك وسحب السيارات', label: 'ميكانيك وسحب سيارات' }
  ];

  const filteredItems = benchmarkPrices.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookService = (item: BenchmarkPriceItem) => {
    // Find matching category
    const cat = categories.find(c => 
      c.name.includes(item.category.slice(0, 4)) || 
      item.category.includes(c.name.slice(0, 4))
    ) || categories[0];

    const sub = cat.subServices[0];
    if (cat && sub) {
      setBookingModalService({
        categoryId: cat.id,
        subServiceId: sub.id
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-black backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>تسعيرات عادلة وشفافة تمنع الاستغلال والمساومة</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            قائمة الأسعار الاسترشادية للخدمات الشائعة
          </h2>

          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            توفر منصة "خدّام" دليلاً رسمياً لمتوسط أسعار الصيانة والأعطال البسيطة في السوق الجزائري (بالدينار الجزائري دج)، لضمان راحة بالك ومنع المبالغة وتجنب الخلافات حول السعر.
          </p>
        </div>
      </div>

      {/* Guarantees Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">تسعيرة استرشادية واضحة</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              تحدد الحد الأدنى والأقصى قبل بدء الحرفي بالعمل.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">فصل أجرة اليد عن القطع</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              توضيح شفاف لما إذا كان السعر يشمل قطع الغيار أم لا.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">تقدير دقيق لوقت الإنجاز</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              معرفة زمن الإصلاح المتوقع لتنظيم يومك.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن تسعيرة خدمة محددة (مثل: تركيب مكيف، تغيير قفل، تسريب حنفية، سخان ماء...)"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rtl:pr-11 rtl:pl-11 ltr:pl-11 ltr:pr-11 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              مسح
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between hover:shadow-md transition-all hover:border-amber-400/80 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide block">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors mt-0.5">
                    {item.title}
                  </h3>
                </div>

                {item.popular && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-black shrink-0">
                    شائعة جداً
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {/* Price Range Box */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">متوسط التسعيرة:</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {item.avgPrice.toLocaleString()} {t.currency}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/60 dark:border-slate-700/60 pt-1.5">
                  <span>الحد الأدنى: <strong className="text-slate-700 dark:text-slate-200">{item.minPrice.toLocaleString()} دج</strong></span>
                  <span>الحد الأقصى: <strong className="text-slate-700 dark:text-slate-200">{item.maxPrice.toLocaleString()} دج</strong></span>
                </div>
              </div>

              {/* Duration & Inclusions */}
              <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>الوقت المقدر: <strong>{item.durationEstimate}</strong></span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{item.includesMaterials ? '✓ تشمل اللوازم الأساسية' : 'ℹ️ أجرة اليد العاملة فقط'}</span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-xl border border-amber-200/50 dark:border-amber-900/30">
                  💡 {item.pricingNotes}
                </p>
              </div>
            </div>

            {/* Direct Booking CTA */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleBookService(item)}
                className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>طلب هذه الخدمة بالتسعيرة المعتمدة</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Search className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            لم نجد خدمة مطابقة لبحثك "{searchQuery}"
          </h3>
          <p className="text-xs text-slate-500">
            يمكنك نشر طلب عرض أسعار مخصص لمشروعك وسيقوم الحرفيون بتقديم عروضهم مباشرة.
          </p>
          <button
            onClick={() => setActiveTab('quotes')}
            className="px-4 py-2 bg-amber-500 text-white font-bold rounded-xl text-xs"
          >
            طلب عروض أسعار خاصة
          </button>
        </div>
      )}
    </div>
  );
};
