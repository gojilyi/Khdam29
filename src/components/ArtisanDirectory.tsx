import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  PhoneCall, 
  Clock, 
  Award, 
  CheckCircle2, 
  Zap, 
  Filter,
  Search,
  MessageSquare,
  Globe,
  Briefcase,
  Wrench,
  Sparkles,
  Phone,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Heart,
  Calendar
} from 'lucide-react';
import { Artisan } from '../types';

export const ArtisanDirectory: React.FC = () => {
  const { 
    artisans, 
    reviews, 
    startCall, 
    setIsChatOpen, 
    setBookingModalService, 
    createOrder,
    setSelectedArtisanForCard,
    setIsProfessionalCardOpen,
    openArtisanFacebookProfile,
    setIsBookingAppointmentModalOpen,
    setSelectedArtisanForAppointment,
    selectedTradeFilter,
    setSelectedTradeFilter,
    searchQuery,
    setSearchQuery,
    favoriteArtisanIds,
    toggleFavoriteArtisan,
    isArtisanFavorite,
    t, 
    language 
  } = useApp();

  const [searchWord, setSearchWord] = useState(searchQuery || '');
  const [selectedTrade, setSelectedTrade] = useState<string>(selectedTradeFilter || 'all');
  const [onlyGuaranteed, setOnlyGuaranteed] = useState(false);
  const [onlyLevel2, setOnlyLevel2] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Sync external filter with local state
  useEffect(() => {
    if (selectedTradeFilter && selectedTradeFilter !== 'all') {
      setSelectedTrade(selectedTradeFilter);
    }
  }, [selectedTradeFilter]);

  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== searchWord) {
      setSearchWord(searchQuery);
    }
  }, [searchQuery]);

  // Quick Profession Presets (أزرار الاختصاصات والمهن السريعة)
  const tradePills = [
    { id: 'all', label: 'جميع المهن والخدمات', keyword: '' },
    { id: 'plumbing', label: 'سباكة وترصيص صحي', keyword: 'سباك' },
    { id: 'electrical', label: 'كهرباء منازل وإنارة', keyword: 'كهربا' },
    { id: 'carpentry', label: 'نجارة خشب وأثاث', keyword: 'نجار' },
    { id: 'painting', label: 'دهان وديكور وجبس', keyword: 'دهان' },
    { id: 'mechanic', label: 'ميكانيك وسحب سيارات', keyword: 'ميكانيك' },
    { id: 'nursing', label: 'تمريض ورعاية صحية', keyword: 'تمريض' },
    { id: 'gardening', label: 'بستنة ومساحات خضراء', keyword: 'بستن' },
    { id: 'locks', label: 'أقفال ومفاتيح أبواب', keyword: 'أقفال' },
    { id: 'masonry', label: 'بناء وسيراميك وترميم', keyword: 'بناء' },
    { id: 'appliance', label: 'تبريد وتكييف وأجهزة', keyword: 'تبريد' },
    { id: 'cleaning', label: 'تنظيف عميق ونقل', keyword: 'تنظيف' }
  ];

  // Helper dictionary to normalize synonymous profession terms
  const normalizeProfessionKeywords = (text: string): string[] => {
    const lower = text.toLowerCase().trim();
    const tokens = [lower];

    if (/سباك|سباكة|رصاص|ترصيص|plomb|مياه|تسريب/.test(lower)) {
      tokens.push('سباكة', 'ترصيص', 'plumbing');
    }
    if (/كهربا|إنارة|قواطع|electr/.test(lower)) {
      tokens.push('كهرباء', 'إنارة', 'electrical');
    }
    if (/نجار|خشب|أثاث|مطابخ|menuis/.test(lower)) {
      tokens.push('نجارة', 'أثاث', 'carpentry');
    }
    if (/دهان|صباغ|طلاء|جبس|ديكور|peint/.test(lower)) {
      tokens.push('دهان', 'صباغة', 'جبس', 'painting');
    }
    if (/ميكانيك|سيار|ديباناج|depan|عجلات/.test(lower)) {
      tokens.push('ميكانيك', 'سيارات', 'dépannage', 'mechanic');
    }
    if (/ممرض|تمريض|رعاية|حقن|ضماد|infirm/.test(lower)) {
      tokens.push('تمريض', 'رعاية', 'nursing');
    }
    if (/بستان|حديق|أشجار|سقي|jardin/.test(lower)) {
      tokens.push('بستنة', 'حدائق', 'gardening');
    }
    if (/قفل|أقفال|مفتاح|مفاتيح|serrur/.test(lower)) {
      tokens.push('أقفال', 'مفاتيح', 'locks');
    }
    if (/بناء|بناي|ماصو|سيراميك|فاينس|maçon/.test(lower)) {
      tokens.push('بناء', 'سيراميك', 'ترميم', 'masonry');
    }
    if (/تبريد|تكييف|كهرومنزلي|غسال|ثلاج|فريكو|climat/.test(lower)) {
      tokens.push('تبريد', 'كهرومنزلي', 'تكييف');
    }
    if (/تنظيف|نظاف|نقل|ترحيل|حشرات|nettoy/.test(lower)) {
      tokens.push('تنظيف', 'نقل', 'cleaning');
    }

    return tokens;
  };

  // Filter artisans matching the selected trade and search word
  const filteredArtisans = useMemo(() => {
    return artisans.filter(art => {
      // 1. Trade filter pill matching
      if (selectedTrade !== 'all') {
        const pill = tradePills.find(p => p.id === selectedTrade);
        if (pill) {
          const pillKeywords = normalizeProfessionKeywords(pill.label + ' ' + pill.keyword);
          const artTradeStr = `${art.trade || ''} ${art.bio} ${(art.skills || []).join(' ')} ${art.categoryId} ${art.subCategoryIds.join(' ')}`.toLowerCase();
          const matchesPill = pillKeywords.some(kw => artTradeStr.includes(kw));
          if (!matchesPill) return false;
        }
      }

      // 2. Search query matching
      if (searchWord.trim()) {
        const searchTokens = normalizeProfessionKeywords(searchWord);
        const artText = `${art.name} ${art.trade || ''} ${art.bio} ${art.neighborhood} ${art.city} ${(art.skills || []).join(' ')} ${art.categoryId} ${art.subCategoryIds.join(' ')}`.toLowerCase();
        const matchesSearch = searchTokens.some(tok => artText.includes(tok));
        if (!matchesSearch) return false;
      }

      // 3. Guarantees & Level filters
      if (onlyGuaranteed && !art.verification.khodamGuaranteed) {
        return false;
      }

      if (onlyLevel2 && art.verification.level < 2) {
        return false;
      }

      // 4. Favorite Artisans Filter (حرفي مفضل)
      if (onlyFavorites && !favoriteArtisanIds.includes(art.id)) {
        return false;
      }

      return true;
    });
  }, [artisans, selectedTrade, searchWord, onlyGuaranteed, onlyLevel2, onlyFavorites, favoriteArtisanIds]);

  const activeTradeLabel = onlyFavorites 
    ? `الحرفيون المفضلون لديك (${favoriteArtisanIds.length})` 
    : (tradePills.find(p => p.id === selectedTrade)?.label || (searchWord ? `بحث: "${searchWord}"` : 'جميع المهن'));

  const handleSelectTrade = (tradeId: string) => {
    setSelectedTrade(tradeId);
    setSelectedTradeFilter(tradeId);
  };

  const handleResetFilters = () => {
    setSelectedTrade('all');
    setSelectedTradeFilter('all');
    setSearchWord('');
    setSearchQuery('');
    setOnlyGuaranteed(false);
    setOnlyLevel2(false);
    setOnlyFavorites(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>شبكة الحرفيين والمهنيين المعتمدين</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              دليل المهن والحرفيين الميدانيين
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              ابحث عن أي مهنة محددة وسيظهر لك مباشرة جميع الحرفيين المعتمدين العاملين بها مع بياناتهم وبروفايلاتهم.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>إجمالي الحرفيين: {artisans.length}</span>
            </span>
          </div>
        </div>

        {/* 2. Search by Trade or Name Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-4 rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchWord}
            onChange={(e) => {
              setSearchWord(e.target.value);
              setSearchQuery(e.target.value);
            }}
            placeholder="ابحث عن مهنة محددة (مثل: سباك، كهربائي، نجار، صباغ، ميكانيكي، بستاني، أقفال، سيراميك...)"
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl rtl:pr-11 rtl:pl-20 ltr:pl-11 ltr:pr-20 py-3 text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 shadow-inner"
          />
          {searchWord && (
            <button
              onClick={() => {
                setSearchWord('');
                setSearchQuery('');
              }}
              className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-lg"
            >
              مسح
            </button>
          )}
        </div>

        {/* 3. Quick Profession Chips (أزرار تصفية المهن المباشرة) */}
        <div>
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
            <span>اختر المهنة لعرض جميع من يعمل بهذه المهمة:</span>
            {(selectedTrade !== 'all' || searchWord || onlyGuaranteed || onlyLevel2) && (
              <button
                onClick={handleResetFilters}
                className="text-amber-600 dark:text-amber-400 hover:underline text-[11px] font-bold"
              >
                إلغاء التصفية وعرض الكل
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {tradePills.map((pill) => {
              const isSelected = selectedTrade === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => handleSelectTrade(pill.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Filters: Guarantee & Level 2 */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setOnlyGuaranteed(!onlyGuaranteed)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              onlyGuaranteed
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ضمان منصة خدام المالي</span>
          </button>

          <button
            onClick={() => setOnlyLevel2(!onlyLevel2)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              onlyLevel2
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>حرفيون ذوو دبلوم معتمد (مستوى 2)</span>
          </button>

          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              onlyFavorites
                ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white text-white' : 'text-rose-500'}`} />
            <span>الحرفيون المفضلون لدي ({favoriteArtisanIds.length})</span>
          </button>
        </div>
      </div>

      {/* 4. Active Profession Filter Results Banner (يظهر عند البحث عن مهنة معينة) */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-950 dark:text-amber-200">
              جميع العاملين في المهنة: <span className="underline decoration-amber-500 font-black">{activeTradeLabel}</span>
            </div>
            <div className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
              تم العثور على <strong>{filteredArtisans.length} حرفي معتمد</strong> متخصص في هذه المهمة ومستعد لاستقبال طلباتك.
            </div>
          </div>
        </div>

        {filteredArtisans.length > 0 && (
          <div className="text-xs font-bold text-amber-700 dark:text-amber-400 tabular-nums">
            {filteredArtisans.length} حرفي متوفر
          </div>
        )}
      </div>

      {/* 5. Artisans Cards Grid */}
      {filteredArtisans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArtisans.map((artisan) => (
            <div
              key={artisan.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div className="space-y-3.5">
                {/* Profile Top with Favorite Heart Button */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={artisan.avatar}
                        alt={artisan.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/30 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      {artisan.isOnline && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" title="متصل الآن ومتاح للعمل" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {artisan.name}
                        </h3>
                        <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                      </div>

                      {/* Specific Profession Title Highlight (المهنة المحددة) */}
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-bold">
                          <Briefcase className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>{artisan.trade || 'حرفي معتمد'}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
                          {artisan.rating}
                        </span>
                        <span>({artisan.reviewCount} تقييم)</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {artisan.distanceKm} {t.kmAway}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{artisan.city} - {artisan.neighborhood}</span>
                      </div>
                    </div>
                  </div>

                  {/* Favorite Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteArtisan(artisan.id);
                    }}
                    className={`p-2 rounded-xl border transition-all shrink-0 ${
                      isArtisanFavorite(artisan.id)
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                    }`}
                    title={isArtisanFavorite(artisan.id) ? 'إزالة من قائمة الحرفيين المفضلين' : 'حفظ في قائمة المفضلات لسهولة طلبه لاحقاً'}
                  >
                    <Heart className={`w-4 h-4 transition-transform ${isArtisanFavorite(artisan.id) ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                  </button>
                </div>

                {/* Experience & Completed Jobs Badges */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs py-1.5 px-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">سنوات الخبرة</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {artisan.experienceYears || artisan.verification.yearsExperience || 8} سنوات
                    </span>
                  </div>
                  <div className="border-r rtl:border-r ltr:border-l border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">المهام المنجزة</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {artisan.completedJobsCount || artisan.verification.completedJobsCount || 150}+ مهمة
                    </span>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {artisan.bio}
                </p>

                {/* Skills tags */}
                {artisan.skills && artisan.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {artisan.skills.slice(0, 3).map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Official Verification Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {artisan.verification.level === 2 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                      <Award className="w-3 h-3 text-emerald-600" />
                      <span>دبلوم معتمد (مستوى 2)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      <span>هوية موثقة (مستوى 1)</span>
                    </span>
                  )}

                  {artisan.verification.khodamGuaranteed && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3" />
                      <span>ضمان خدام المالي</span>
                    </span>
                  )}
                </div>

                {/* View Facebook Profile & Digital Professional Card */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => openArtisanFacebookProfile(artisan)}
                    className="py-2 px-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
                    title="البروفايل الاجتماعي الشبيه بفيسبوك مع المنشورات والفيديوهات"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>بروفايل فيسبوك للحرفي</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedArtisanForCard(artisan);
                      setIsProfessionalCardOpen(true);
                    }}
                    className="py-2 px-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
                    title="معاينة البطاقة المهنية الرسمية برمز QR"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>البطاقة المهنية الرقمية</span>
                  </button>
                </div>
              </div>

              {/* Bottom Actions: Pricing, Direct Booking & Call */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500">سعر الساعة التقريبي:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
                    {artisan.hourlyRate} {t.currency}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {/* Direct Order */}
                  <button
                    onClick={() => {
                      setBookingModalService({
                        categoryId: artisan.categoryId,
                        subServiceId: artisan.subCategoryIds[0]
                      });
                    }}
                    className="py-2 px-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-[11px] flex items-center justify-center gap-1 transition-colors shadow-sm active:scale-95 cursor-pointer"
                    title="طلب خدمة فورية من هذا الحرفي"
                  >
                    <Zap className="w-3 h-3 fill-white shrink-0" />
                    <span>طلب خدمة</span>
                  </button>

                  {/* Book Appointment via Calendar */}
                  <button
                    onClick={() => {
                      setSelectedArtisanForAppointment(artisan);
                      setIsBookingAppointmentModalOpen(true);
                    }}
                    className="py-2 px-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[11px] flex items-center justify-center gap-1 transition-colors shadow-sm active:scale-95 cursor-pointer"
                    title="حجز موعد معاينة ميدانية في الروزنامة"
                  >
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>حجز موعد 📅</span>
                  </button>

                  {/* Audio Call */}
                  <button
                    onClick={() => startCall(artisan.name, artisan.trade || 'حرفي معتمد', artisan.avatar)}
                    className="py-2 px-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-[11px] flex items-center justify-center gap-1 transition-colors active:scale-95 cursor-pointer"
                    title="اتصال صوتي مشفر"
                  >
                    <PhoneCall className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>اتصال</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty results state */
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            لم يتم العثور على حرفيين مطابقين لبحث: "{searchWord || activeTradeLabel}"
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            جرب البحث بمصطلحات عامة مثل "سباك"، "كهربائي"، "نجار"، أو اختر من قائمة المهن السريعة في الأعلى.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1 shadow-sm transition-all"
          >
            عرض جميع الحرفيين ({artisans.length})
          </button>
        </div>
      )}
    </div>
  );
};
