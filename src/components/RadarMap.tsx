import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Clock, 
  PhoneCall, 
  CheckCircle2, 
  Navigation, 
  Zap, 
  Filter,
  Award
} from 'lucide-react';
import { Artisan } from '../types';

export const RadarMap: React.FC = () => {
  const { 
    artisans, 
    searchRadiusKm, 
    setSearchRadiusKm, 
    selectedCity, 
    setSelectedCity,
    createOrder,
    startCall,
    setIsChatOpen,
    t, 
    language,
    setBookingModalService
  } = useApp();

  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(artisans[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [orderError, setOrderError] = useState<string | null>(null);

  // Filter artisans by radius & category
  const filteredArtisans = artisans.filter(art => {
    const matchesRadius = art.distanceKm <= searchRadiusKm;
    const matchesCat = filterCategory === 'all' || art.categoryId === filterCategory;
    return matchesRadius && matchesCat;
  });

  const handleInstantDispatch = (artisan: Artisan) => {
    setOrderError(null);
    const result = createOrder({
      artisanId: artisan.id,
      artisanName: artisan.name,
      artisanAvatar: artisan.avatar,
      artisanPhoneMasked: artisan.phoneMasked,
      categoryId: artisan.categoryId,
      subServiceId: artisan.subCategoryIds[0] || 'plumbing',
      subServiceName: artisan.bio.slice(0, 35) + '...',
      type: 'instant',
      estimatedCost: artisan.hourlyRate * 2,
      notes: 'طلب تدخل فوري عبر الرادار الجغرافي المباشر'
    });

    if (!result.success && result.error) {
      setOrderError(result.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Proximity Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>{t.proximitySearchTitle}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {language === 'ar' ? 'الرادار الجغرافي والربط اللحظي' : 'Live Proximity Radar & Dispatch'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t.proximitySearchDesc}
          </p>
        </div>

        {/* Live response time badge */}
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl px-3.5 py-2">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <div className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
              {t.averageResponseTime}
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
              3 - 5 {t.minutes}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Radius and Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-amber-500" />
            {t.radarRadius}:
          </span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {[2, 5, 10, 20].map(radius => (
              <button
                key={radius}
                onClick={() => setSearchRadiusKm(radius)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  searchRadiusKm === radius
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {radius} {t.kmAway}
              </button>
            ))}
          </div>
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-amber-500 outline-none cursor-pointer"
          >
            <option value="all">{language === 'ar' ? 'جميع التخصصات' : 'All Trades'}</option>
            <option value="home_repair">{language === 'ar' ? 'صيانة المنازل' : 'Home Repair'}</option>
            <option value="automotive_roadside">{language === 'ar' ? 'مساعدة السيارات Dépannage' : 'Auto & Roadside'}</option>
            <option value="health_personal">{language === 'ar' ? 'تمريض ورعاية' : 'Nursing & Care'}</option>
            <option value="tech_smart_home">{language === 'ar' ? 'تقنية وكاميرات' : 'Tech & CCTV'}</option>
            <option value="cleaning_facility">{language === 'ar' ? 'نظافة ونقل' : 'Cleaning & Moving'}</option>
          </select>
        </div>
      </div>

      {orderError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span>{orderError}</span>
        </div>
      )}

      {/* Radar Canvas & Active Artisan Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Center: Radar Visualization Canvas */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 relative overflow-hidden border border-slate-800 min-h-[420px] flex items-center justify-center">
          {/* Radar Circles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Concentric rings */}
            <div className="w-[100px] h-[100px] rounded-full border border-amber-500/20" />
            <div className="w-[200px] h-[200px] rounded-full border border-amber-500/15" />
            <div className="w-[300px] h-[300px] rounded-full border border-amber-500/10" />
            <div className="w-[400px] h-[400px] rounded-full border border-amber-500/10" />

            {/* Radar Crosshairs */}
            <div className="absolute w-full h-[1px] bg-slate-800" />
            <div className="absolute h-full w-[1px] bg-slate-800" />

            {/* Animated rotating sweep beam */}
            <div 
              className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, rgba(245, 158, 11, 0.25) 0deg, rgba(245, 158, 11, 0) 60deg, transparent 360deg)',
                animation: 'spin 4s linear infinite'
              }}
            />
          </div>

          {/* Center User Pin */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/50">
                <MapPin className="w-6 h-6 fill-slate-950 stroke-none" />
              </div>
              <div className="absolute inset-0 rounded-full bg-amber-500/40 animate-ping" />
            </div>
            <span className="mt-2 text-[11px] font-bold text-amber-300 bg-slate-800/90 px-2.5 py-0.5 rounded-full border border-slate-700">
              {language === 'ar' ? 'موقعك الحالي' : 'Your Location'}
            </span>
          </div>

          {/* Render Artisans dynamically placed on radar rings */}
          {filteredArtisans.map((artisan, index) => {
            // Distribute artisans mathematically on concentric rings
            const angleDeg = (index * 360) / Math.max(filteredArtisans.length, 1) + 25;
            const angleRad = (angleDeg * Math.PI) / 180;
            // Radius proportional to distance
            const distanceRatio = Math.min(artisan.distanceKm / (searchRadiusKm || 5), 0.9);
            const radiusPx = 60 + distanceRatio * 130;
            const x = Math.cos(angleRad) * radiusPx;
            const y = Math.sin(angleRad) * radiusPx;

            const isSelected = selectedArtisan?.id === artisan.id;

            return (
              <button
                key={artisan.id}
                onClick={() => setSelectedArtisan(artisan)}
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
                className={`absolute z-20 group focus:outline-none transition-all duration-300 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
                title={`${artisan.name} (${artisan.distanceKm} km)`}
              >
                <div className="relative flex items-center justify-center">
                  <div className={`w-10 h-10 rounded-full p-0.5 overflow-hidden border-2 shadow-md transition-all ${
                    isSelected 
                      ? 'border-amber-400 ring-4 ring-amber-500/30' 
                      : artisan.isOnline 
                        ? 'border-emerald-400 bg-slate-800' 
                        : 'border-slate-500 opacity-60'
                  }`}>
                    <img 
                      src={artisan.avatar} 
                      alt={artisan.name} 
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Online indicator */}
                  {artisan.isOnline && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                  )}

                  {/* Distance pill tooltip */}
                  <span className={`absolute -bottom-5 whitespace-nowrap text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                    isSelected 
                      ? 'bg-amber-400 text-slate-950 shadow' 
                      : 'bg-slate-800/90 text-slate-300 border border-slate-700'
                  }`}>
                    {artisan.distanceKm} {t.kmAway}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Radius Legend Watermark */}
          <div className="absolute bottom-3 left-4 text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>{filteredArtisans.length} {language === 'ar' ? 'حرفي متاح في النطاق' : 'Artisans within radius'}</span>
          </div>
        </div>

        {/* Right: Selected Artisan Spotlight Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          {selectedArtisan ? (
            <div className="space-y-5">
              {/* Header profile row */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={selectedArtisan.avatar}
                    alt={selectedArtisan.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/20 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  {selectedArtisan.isOnline && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded-full">
                      {language === 'ar' ? 'متاح' : 'Active'}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {selectedArtisan.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
                      {selectedArtisan.rating}
                    </span>
                    <span>({selectedArtisan.reviewCount} {language === 'ar' ? 'تقييم' : 'reviews'})</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {selectedArtisan.distanceKm} {t.kmAway}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{selectedArtisan.city} - {selectedArtisan.neighborhood}</span>
                  </div>
                </div>
              </div>

              {/* Bio & Experience */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {selectedArtisan.bio}
              </p>

              {/* Verification Badges */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-2">
                  {language === 'ar' ? 'شارات التوثيق المهني والضمان:' : 'Verified Credentials:'}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedArtisan.verification.idVerified && (
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg font-medium text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.verifiedId}</span>
                    </div>
                  )}
                  {selectedArtisan.verification.certVerified && (
                    <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg font-medium text-[11px]">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.certifiedBadge}</span>
                    </div>
                  )}
                  {selectedArtisan.verification.khodamGuaranteed && (
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg font-medium text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.guaranteeBadge}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg font-medium text-[11px]">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    <span>{selectedArtisan.verification.completedJobsCount} {language === 'ar' ? 'مهمة منجزة' : 'Jobs'}</span>
                  </div>
                </div>
              </div>

              {/* Secure Phone Number Mask Notice */}
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between py-2 border-y border-slate-100 dark:border-slate-800">
                <span>{language === 'ar' ? 'الاتصال الآمن المشفر:' : 'Encrypted VoIP:'}</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                  {selectedArtisan.phoneMasked}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => handleInstantDispatch(selectedArtisan)}
                  className="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98] text-xs sm:text-sm"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>{t.requestNow}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => startCall(selectedArtisan.name, 'مقدم خدمة', selectedArtisan.avatar)}
                    className="h-10 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.callArtisan}</span>
                  </button>

                  <button
                    onClick={() => {
                      setBookingModalService({
                        categoryId: selectedArtisan.categoryId,
                        subServiceId: selectedArtisan.subCategoryIds[0]
                      });
                    }}
                    className="h-10 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{t.scheduleBooking}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              {language === 'ar' ? 'حدد حرفياً من الرادار لعرض بياناته والطلب المباشر' : 'Select an artisan from radar'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
