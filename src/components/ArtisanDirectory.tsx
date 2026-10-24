import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  MapPin, 
  Phone, 
  SlidersHorizontal, 
  CheckCircle2, 
  Clock, 
  Calendar,
  X,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { ALGERIA_WILAYAS, ALGERIAN_TRADES, formatDZD } from '../data/algeriaData';
import { Card, Button, Badge, Rating, Avatar } from './ui';

export const ArtisanDirectory: React.FC = () => {
  const { 
    artisans, 
    startCall, 
    setBookingModalService, 
    selectedTradeFilter, 
    setSelectedTradeFilter,
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    setSelectedArtisan,
    setSelectedArtisanForAppointment,
    setIsBookingAppointmentModalOpen
  } = useApp();

  const [searchWord, setSearchWord] = useState(searchQuery || '');
  const [selectedTrade, setSelectedTrade] = useState<string>(selectedTradeFilter || 'all');
  const [selectedWilaya, setSelectedWilaya] = useState<string>(selectedCity || 'all');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [onlyAvailableNow, setOnlyAvailableNow] = useState<boolean>(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Filter artisans based on selected criteria
  const filteredArtisans = useMemo(() => {
    return artisans.filter(art => {
      // 1. Trade filter
      if (selectedTrade !== 'all') {
        const matchesTrade = art.trade?.toLowerCase().includes(selectedTrade.toLowerCase()) ||
          art.skills?.some(s => s.toLowerCase().includes(selectedTrade.toLowerCase())) ||
          art.bio?.toLowerCase().includes(selectedTrade.toLowerCase());
        if (!matchesTrade) return false;
      }

      // 2. Search query
      if (searchWord.trim()) {
        const q = searchWord.toLowerCase().trim();
        const matchesQuery = art.name.toLowerCase().includes(q) ||
          art.trade?.toLowerCase().includes(q) ||
          art.city?.toLowerCase().includes(q) ||
          art.neighborhood?.toLowerCase().includes(q) ||
          art.bio?.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 3. Wilaya filter
      if (selectedWilaya !== 'all') {
        const matchesWilaya = art.city?.includes(selectedWilaya);
        if (!matchesWilaya) return false;
      }

      // 4. Rating filter
      if (minRating > 0 && art.rating < minRating) {
        return false;
      }

      // 5. Price filter
      if (art.hourlyRate && art.hourlyRate > maxPrice) {
        return false;
      }

      // 6. Availability filter
      if (onlyAvailableNow && !art.isOnline) {
        return false;
      }

      return true;
    });
  }, [artisans, selectedTrade, searchWord, selectedWilaya, minRating, maxPrice, onlyAvailableNow]);

  const handleResetFilters = () => {
    setSearchWord('');
    setSearchQuery('');
    setSelectedTrade('all');
    setSelectedTradeFilter('all');
    setSelectedWilaya('all');
    setMinRating(0);
    setMaxPrice(5000);
    setOnlyAvailableNow(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Direct Search */}
      <div className="space-y-2">
        <h1 className="text-[28px] font-bold text-[#0A4D2E]">
          دليل الحرفيين والعمال في الجزائر
        </h1>
        <p className="text-[14px] text-[#5B6660]">
          ابحث عن حرفي موثوق حسب المهنة، الولاية، التقييم أو السعر للتواصل المباشر.
        </p>
      </div>

      {/* 2. Search & Filter Bar */}
      <Card variant="white" className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search by Name / Keyword */}
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6660]" strokeWidth={1.75} />
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="ابحث بالاسم أو التخصص..."
              className="w-full h-11 pr-10 pl-3.5 bg-white border border-[#DDE3DF] rounded-[8px] text-[14px] text-[#1C2421] placeholder:text-[#5B6660]/70 focus:outline-none focus:ring-1 focus:ring-[#1E9B5C] focus:border-[#1E9B5C]"
            />
          </div>

          {/* Trade Filter */}
          <div>
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="w-full h-11 px-3.5 bg-white border border-[#DDE3DF] rounded-[8px] text-[14px] text-[#1C2421] focus:outline-none focus:ring-1 focus:ring-[#1E9B5C] focus:border-[#1E9B5C]"
              aria-label="تصفية حسب المهنة"
            >
              <option value="all">كل المهن (10 مهن جزائرية)</option>
              {ALGERIAN_TRADES.map(t => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Wilaya Filter (All 58 Wilayas) */}
          <div>
            <select
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="w-full h-11 px-3.5 bg-white border border-[#DDE3DF] rounded-[8px] text-[14px] text-[#1C2421] focus:outline-none focus:ring-1 focus:ring-[#1E9B5C] focus:border-[#1E9B5C]"
              aria-label="تصفية حسب الولاية"
            >
              <option value="all">كل الولايات (58 ولاية)</option>
              {ALGERIA_WILAYAS.map(w => (
                <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
              ))}
            </select>
          </div>

          {/* Mobile Filter Toggle or Quick Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyAvailableNow(!onlyAvailableNow)}
              className={`
                h-11 px-3.5 rounded-[8px] border text-[13px] font-semibold transition-colors flex-1 flex items-center justify-center gap-1.5 cursor-pointer
                ${onlyAvailableNow 
                  ? 'bg-[#EEF6F1] border-[#1E9B5C] text-[#0A4D2E]' 
                  : 'bg-white border-[#DDE3DF] text-[#5B6660] hover:bg-[#EEF6F1]'}
              `}
            >
              <span className={`w-2 h-2 rounded-full ${onlyAvailableNow ? 'bg-[#1E9B5C]' : 'bg-[#DDE3DF]'}`} />
              <span>متاح الآن</span>
            </button>

            <button
              onClick={handleResetFilters}
              title="إعادة ضبط الفلاتر"
              className="h-11 w-11 shrink-0 flex items-center justify-center rounded-[8px] border border-[#DDE3DF] text-[#5B6660] hover:text-[#1C2421] hover:bg-[#EEF6F1] transition-colors cursor-pointer"
              aria-label="إعادة ضبط الفلاتر"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Secondary Filters: Rating & Price Range */}
        <div className="pt-3 border-t border-[#DDE3DF] flex flex-wrap items-center justify-between gap-4 text-[13px]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#1C2421]">التقييم الأدنى:</span>
            <div className="flex items-center gap-1">
              {[0, 3.5, 4.0, 4.5].map((val) => (
                <button
                  key={val}
                  onClick={() => setMinRating(val)}
                  className={`
                    px-2.5 py-1 rounded-[8px] text-[12px] font-medium transition-colors cursor-pointer
                    ${minRating === val 
                      ? 'bg-[#0A4D2E] text-white font-bold' 
                      : 'bg-[#EEF6F1] text-[#5B6660] hover:text-[#1C2421]'}
                  `}
                >
                  {val === 0 ? 'الكل' : `${val}+`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#1C2421]">السعر الأقصى:</span>
            <span className="text-[#0A4D2E] font-bold tabular-nums">{formatDZD(maxPrice)}/ساعة</span>
            <input
              type="range"
              min={1000}
              max={5000}
              step={200}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-28 sm:w-36 accent-[#0F6B3F] cursor-pointer"
              aria-label="السعر الأقصى بالساعة"
            />
          </div>

          <span className="text-[12px] text-[#5B6660]">
            النتائج: <strong className="text-[#1C2421] tabular-nums">{filteredArtisans.length}</strong> حرفي
          </span>
        </div>
      </Card>

      {/* 3. Artisan Cards Grid */}
      {filteredArtisans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArtisans.map((artisan) => (
            <Card key={artisan.id} variant="white" className="flex flex-col justify-between">
              <div>
                {/* Header: Avatar, Name, Trade, Availability - Clickable to open profile */}
                <div 
                  onClick={() => setSelectedArtisan(artisan)}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <Avatar
                    src={artisan.avatar}
                    alt={artisan.name}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-[16px] font-bold text-[#1C2421] group-hover:text-[#0A4D2E] transition-colors truncate">
                        {artisan.name}
                      </h3>
                      {artisan.isOnline && (
                        <span className="text-[11px] font-medium text-[#0A4D2E] bg-[#EEF6F1] px-2 py-0.5 rounded-[8px] shrink-0 border border-[#1E9B5C]/30">
                          متاح الآن
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[13px] font-semibold text-[#0F6B3F]">
                        {artisan.trade}
                      </span>
                      <span className="text-[#DDE3DF]">·</span>
                      <Rating 
                        rating={artisan.rating} 
                        reviewCount={artisan.reviewCount} 
                        size="sm" 
                      />
                    </div>

                    <div className="flex items-center gap-1 text-[12px] text-[#5B6660] mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F6B3F] shrink-0" strokeWidth={1.75} />
                      <span className="truncate">{artisan.city} {artisan.neighborhood ? `· ${artisan.neighborhood}` : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Bio & Skills */}
                <p className="text-[13px] text-[#5B6660] mt-3 line-clamp-2 leading-relaxed">
                  {artisan.bio}
                </p>

                {artisan.skills && artisan.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {artisan.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="text-[11px] text-[#5B6660] bg-[#EEF6F1] px-2 py-0.5 rounded-[8px]">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Completed Jobs & Rate */}
                <div className="mt-3.5 pt-3 border-t border-[#DDE3DF] flex items-center justify-between text-[12px]">
                  <span className="text-[#5B6660]">
                    أعمال منجزة: <strong className="text-[#1C2421] tabular-nums font-semibold">{artisan.completedJobsCount}</strong>
                  </span>
                  <span className="text-[#0A4D2E] font-bold tabular-nums">
                    {formatDZD(artisan.hourlyRate)}/ساعة
                  </span>
                </div>
              </div>

              {/* Action Buttons: 44px min touch targets */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#DDE3DF]">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Phone className="w-4 h-4 text-[#0F6B3F]" strokeWidth={1.75} />}
                  onClick={() => startCall(artisan.id, artisan.name, artisan.phoneMasked)}
                >
                  اتصل
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setBookingModalService({ 
                      categoryId: artisan.categoryId, 
                      subServiceId: artisan.subCategoryIds[0] || 'plumbing',
                      artisanId: artisan.id
                    });
                  }}
                >
                  اطلب الخدمة
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card variant="white" className="p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-[8px] bg-[#EEF6F1] text-[#0A4D2E] mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <h3 className="text-[18px] font-bold text-[#0A4D2E]">
            لم نعثر على حرفي بهذه المواصفات
          </h3>
          <p className="text-[14px] text-[#5B6660] max-w-md mx-auto">
            جرّب تغيير خيارات البحث أو تصفية ولاية أخرى، أو قم بإعادة ضبط الفلاتر لتصفح جميع الحرفيين المسجلين.
          </p>
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
            className="mt-2"
          >
            إعادة ضبط الفلاتر
          </Button>
        </Card>
      )}
    </div>
  );
};
