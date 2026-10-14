import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  HeartHandshake, 
  Scale, 
  BookOpen, 
  Award, 
  Sparkles,
  MessageSquarePlus,
  Share2
} from 'lucide-react';

export const CraftCharterCard: React.FC = () => {
  const { 
    isCraftCharterOpen, 
    setIsCraftCharterOpen, 
    selectedCraftForCharter, 
    setIsReviewModalOpen,
    language 
  } = useApp();

  if (!isCraftCharterOpen || !selectedCraftForCharter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-3xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setIsCraftCharterOpen(false)}
          className="absolute rtl:left-4 ltr:right-4 top-4 z-20 p-2 text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 rounded-full shadow-sm backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          {/* Top Banner with Noble Quranic Verse */}
          <div className="relative bg-gradient-to-b from-amber-900 via-amber-800 to-amber-950 text-white p-7 text-center overflow-hidden">
            {/* Background image overlay */}
            <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
              style={{ backgroundImage: `url('/src/assets/images/quran_craft_charter_1791156522692.jpg')` }}
            />
            
            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-[11px] font-bold text-amber-200">
                <BookOpen className="w-3.5 h-3.5" />
                <span>ميثاق شرف العمل والأمانة المهنية</span>
              </span>

              {/* Quranic Verse */}
              <div className="p-4 bg-amber-950/60 border border-amber-500/30 rounded-2xl shadow-inner my-2">
                <p className="text-base sm:text-lg font-serif font-bold text-amber-100 leading-loose tracking-wide">
                  ﴿ وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ وَرَسُولُهُ وَالْمُؤْمِنُونَ ﴾
                </p>
                <span className="text-[11px] text-amber-300/80 font-serif block mt-1">
                  [سورة التوبة: الآية 105]
                </span>
              </div>

              {/* Hadith */}
              <p className="text-xs text-amber-200/90 italic font-serif leading-relaxed">
                قال رسول الله ﷺ: «إِنَّ اللَّهَ تَعَالَى يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ»
              </p>
            </div>
          </div>

          {/* Craft Information Section */}
          <div className="p-6 space-y-5">
            {/* Craft Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedCraftForCharter.image}
                  alt={selectedCraftForCharter.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-amber-500/30 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    بطاقة الحرفة المعتمدة
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {selectedCraftForCharter.name}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedCraftForCharter.subServices.length} تخصصات دقيقة تحت رقابة منصة خدام
                  </span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
            </div>

            {/* Ethical Principles Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-500" />
                <span>شروط وأخلاقيات ممارسة الحرفة في خدام:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>الإتقان بلا غش أو مداراة</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    استخدام المواد الأصلية فقط وتجنب الترقيعات الوقتية مع ضمان العيوب الخفية.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-amber-500" />
                    <span>حرمة البيوت وكتمان الأسرار</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    غض البصر، وحفظ أمانة العائلات، والتحلي بأعلى درجات الأدب داخل منازل العملاء.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-blue-500" />
                    <span>وضوح الأسعار والعدل في الأجر</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    بيان تكلفة الخدمة وقطع الغيار مسبقاً دون فرض أي زيادة مفاجئة أو مبالغة.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>النظافة والسلامة بعد الإنجاز</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    تنظيف موقع العمل من المخلفات والتأكد من أمان التمديدات قبل المغادرة.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Rating & Feedback CTA */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h5 className="font-bold text-xs text-amber-950 dark:text-amber-200">
                  هل تعاملت مع حرفي في هذه المهنة؟
                </h5>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  مشاركتك لتقييمك وتعليقك بأمانة تحافظ على جودة المنظومة ومصداقية الحرفيين.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsCraftCharterOpen(false);
                  setIsReviewModalOpen(true);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-sm transition-transform active:scale-95"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>إضافة تقييم وتعليق الآن</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
