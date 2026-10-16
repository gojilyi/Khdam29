import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { serviceCategories } from '../data/mockData';
import { 
  Wrench, 
  Sparkles, 
  Trees, 
  Car, 
  HeartHandshake, 
  Cpu, 
  Utensils, 
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Search,
  Calendar,
  Zap,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Star,
  BookOpen,
  MessageSquarePlus,
  Paintbrush,
  Hammer,
  Flame,
  Truck,
  Scissors,
  Home,
  Key,
  Smartphone,
  Camera,
  Droplet,
  Settings,
  Briefcase,
  Plus
} from 'lucide-react';
import { ServiceCategory, SubService } from '../types';
import { AppIconRenderer } from './AppIconRenderer';
import { GameChannelRechargeModal } from './GameChannelRechargeModal';
import { VehicleRentalModal } from './VehicleRentalModal';

export const ServicesGrid: React.FC = () => {
  const { 
    t, 
    language, 
    categories,
    setBookingModalService, 
    searchQuery, 
    setSearchQuery,
    setActiveTab,
    setIsCraftCharterOpen,
    setSelectedCraftForCharter,
    setIsReviewModalOpen,
    navigateToTradeArtisans,
    isAdminAuthenticated,
    isAddCraftModalOpen,
    setIsAddCraftModalOpen,
    getAdminCustomText,
    setAdminEditModalTarget
  } = useApp();

  const [expandedCatId, setExpandedCatId] = useState<string | null>('home_repair');
  const [selectedFilterCat, setSelectedFilterCat] = useState<string>('all');
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);

  const getCategoryIcon = (iconName: string) => {
    return <AppIconRenderer icon={iconName} className="w-5 h-5 text-amber-500" />;
  };

  const filteredCategories = categories.filter(cat => {
    if (selectedFilterCat !== 'all' && cat.id !== selectedFilterCat) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const catMatches = cat.name.toLowerCase().includes(q) || cat.nameEn.toLowerCase().includes(q) || cat.nameFr.toLowerCase().includes(q);
    const subMatches = cat.subServices.some(s => 
      s.name.toLowerCase().includes(q) || 
      s.nameEn.toLowerCase().includes(q) || 
      s.description.toLowerCase().includes(q)
    );
    return catMatches || subMatches;
  });

  return (
    <div className="space-y-6">
      {/* Search and Section Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'ar' ? 'شبكة الحرف والمهن المعيارية' : 'Verified Crafts Catalog'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t.categoriesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.categoriesSubtitle}
            </p>
          </div>

          {/* Quick Actions Header: Big Project Quotes & Review */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{language === 'ar' ? 'إضافة تقييم وتعليق' : 'Write Review'}</span>
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>{language === 'ar' ? 'طلب عروض أسعار لمشروع' : 'Request Quotes'}</span>
              {language === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'سوق العمل (بحث عن عامل أو عمل)' : 'Job Market & Workers'}</span>
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute right-4 rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rtl:pr-12 rtl:pl-4 ltr:pl-12 ltr:pr-4 text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded"
            >
              مسح
            </button>
          )}
        </div>

        {/* Quick Filter Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedFilterCat('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors shrink-0 ${
              selectedFilterCat === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {language === 'ar' ? `الكل (${categories.length} فئات)` : `All (${categories.length} Categories)`}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedFilterCat(cat.id);
                setExpandedCatId(cat.id);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors shrink-0 ${
                selectedFilterCat === cat.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {language === 'ar' ? cat.name : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCategories.map((category) => {
          const isExpanded = expandedCatId === category.id;
          const subCount = category.subServices.length;

          return (
            <div
              key={category.id}
              data-category-id={category.id}
              className={`rounded-3xl transition-all duration-200 border overflow-hidden ${
                isExpanded
                  ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800/80 shadow-md ring-1 ring-amber-400/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Category Cover Image & Header */}
              <div className="relative h-40 overflow-hidden group">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                  referrerPolicy="no-referrer"
                  title={isAdminAuthenticated ? "انقر مرتين لتغيير الصورة أو اسحب صورة جديدة وضعها هنا" : category.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

                {/* Top badges on cover */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                      {subCount} {language === 'ar' ? 'خدمات معتمدة' : 'services'}
                    </span>
                    {isAdminAuthenticated && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAdminEditModalTarget({
                            type: 'icon',
                            id: `icon_${category.id}`,
                            title: `أيقونة: ${category.name}`,
                            currentValue: category.icon,
                            categoryId: category.id
                          });
                        }}
                        className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold shadow flex items-center gap-1"
                        title="تغيير أيقونة الحرفة"
                      >
                        <span>تغيير الأيقونة</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCraftForCharter(category);
                      setIsCraftCharterOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
                    title="عرض ميثاق شرف الحرفة والآية الكريمة"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'ميثاق الحرفة' : 'Craft Charter'}</span>
                  </button>
                </div>

                {/* Bottom title on cover */}
                <div className="absolute bottom-3 inset-x-4 z-10 flex items-end justify-between">
                  <div className="flex items-center gap-2.5">
                    <div 
                      onClick={(e) => {
                        if (isAdminAuthenticated) {
                          e.stopPropagation();
                          setAdminEditModalTarget({
                            type: 'icon',
                            id: `icon_${category.id}`,
                            title: `أيقونة: ${category.name}`,
                            currentValue: category.icon,
                            categoryId: category.id
                          });
                        }
                      }}
                      className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-amber-500/80 backdrop-blur-md flex items-center justify-center text-white shrink-0 cursor-pointer shadow-md transition-colors"
                      title={isAdminAuthenticated ? "انقر مرتين لاختيار أيقونة جديدة" : category.name}
                    >
                      {getCategoryIcon(category.icon)}
                    </div>
                    <div>
                      <h3 
                        className="text-lg font-black text-white drop-shadow-sm cursor-pointer"
                        data-admin-text-id={`cat_name_${category.id}`}
                        title={isAdminAuthenticated ? "انقر مرتين لتعديل النص" : category.name}
                      >
                        {getAdminCustomText(`cat_name_${category.id}`, language === 'ar' ? category.name : language === 'fr' ? category.nameFr : category.nameEn)}
                      </h3>
                      <p 
                        className="text-[11px] text-amber-100/90 mt-0.5 line-clamp-1 drop-shadow-xs cursor-pointer"
                        data-admin-text-id={`cat_desc_${category.id}`}
                        title={isAdminAuthenticated ? "انقر مرتين لتعديل الوصف" : category.description}
                      >
                        {getAdminCustomText(`cat_desc_${category.id}`, category.description)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedCatId(isExpanded ? null : category.id)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-colors shrink-0"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sub-services list */}
              {isExpanded && (
                <div className="p-4 sm:p-5 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800">
                  {category.subServices.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Subservice info with real photography */}
                        <div className="flex items-center gap-3">
                          <img
                            src={sub.image}
                            alt={sub.name}
                            className="w-16 h-16 rounded-xl object-cover border border-amber-500/20 shrink-0 shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {language === 'ar' ? sub.name : language === 'fr' ? sub.nameFr : sub.nameEn}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                              {sub.description}
                            </p>
                            <span className="inline-block text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                              {sub.estimatedPrice}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => {
                              if (category.id === 'gaming_channels_recharge') {
                                setIsRechargeModalOpen(true);
                              } else if (category.id === 'vehicle_truck_rentals') {
                                setIsRentalModalOpen(true);
                              } else {
                                setBookingModalService({
                                  categoryId: category.id,
                                  subServiceId: sub.id
                                });
                              }
                            }}
                            className={`flex-1 sm:w-32 py-1.5 px-3 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors shadow-xs active:scale-95 cursor-pointer text-white ${
                              category.id === 'gaming_channels_recharge'
                                ? 'bg-purple-600 hover:bg-purple-700'
                                : category.id === 'vehicle_truck_rentals'
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-amber-500 hover:bg-amber-600'
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5 fill-white" />
                            <span>
                              {category.id === 'gaming_channels_recharge'
                                ? 'شحن فوري 🎮'
                                : category.id === 'vehicle_truck_rentals'
                                ? 'حجز واستئجار 🚗'
                                : t.requestNow}
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              if (category.id === 'gaming_channels_recharge') {
                                setIsRechargeModalOpen(true);
                              } else if (category.id === 'vehicle_truck_rentals') {
                                setIsRentalModalOpen(true);
                              } else {
                                setBookingModalService({
                                  categoryId: category.id,
                                  subServiceId: sub.id
                                });
                              }
                            }}
                            className="flex-1 sm:w-32 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{category.id === 'vehicle_truck_rentals' ? 'تحديد المدة' : t.scheduleBooking}</span>
                          </button>
                        </div>
                      </div>

                      {/* Micro actions row: Craft charter info, View artisans, & Review */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <button
                          onClick={() => navigateToTradeArtisans(sub.name)}
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold"
                          title="عرض جميع الحرفيين المؤهلين في هذه المهمة"
                        >
                          <Briefcase className="w-3 h-3" />
                          <span>{language === 'ar' ? 'عرض جميع العاملين بهذه المهمة' : 'View all artisans for this trade'}</span>
                        </button>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedCraftForCharter(category);
                              setIsCraftCharterOpen(true);
                            }}
                            className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>{language === 'ar' ? 'ميثاق إتقان العمل' : 'Work Charter'}</span>
                          </button>

                          <button
                            onClick={() => setIsReviewModalOpen(true)}
                            className="text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 flex items-center gap-1 font-semibold"
                          >
                            <MessageSquarePlus className="w-3 h-3" />
                            <span>{language === 'ar' ? 'تقييم' : 'Review'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Admin Quick Add Craft Card */}
        {isAdminAuthenticated && (
          <div
            onClick={() => setIsAddCraftModalOpen(true)}
            className="group relative min-h-[260px] rounded-3xl border-2 border-dashed border-amber-400 dark:border-amber-500/60 bg-amber-500/5 hover:bg-amber-500/10 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.01] shadow-xs"
            title="انقر لإضافة حرفة جديدة ورفع صورها وتحديد خدماتها"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
              <Plus className="w-7 h-7" />
            </div>
            <h3 className="mt-4 font-black text-base text-slate-900 dark:text-white">
              إضافة حرفة جديدة مع صورها
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              خاصية المشرف: أضف تصنيفاً حرفياً جديداً (خياطة، طبخ، مكيفات، حدادة...) وارفع صورته وصور الخدمات الفرعية.
            </p>
            <span className="mt-4 px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow-xs flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة حرفة وصورها الآن</span>
            </span>
          </div>
        )}
      </div>

      {/* Instant Game & Channel Top-Up Modal */}
      <GameChannelRechargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
      />

      {/* Vehicle, Truck & Cart Rental Modal */}
      <VehicleRentalModal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
      />
    </div>
  );
};
