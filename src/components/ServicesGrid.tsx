import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  MapPin, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  ChevronLeft,
  Droplets,
  Zap,
  Hammer,
  Paintbrush,
  Wind,
  BrickWall,
  Flame,
  Wrench,
  LayoutGrid,
  Box,
  CheckCircle2,
  SlidersHorizontal,
  Utensils,
  HeartPulse,
  Gamepad2,
  Tv,
  CreditCard,
  Scissors,
  Sparkles,
  Users,
  Truck,
  Car,
  Sprout,
  Smartphone,
  Key
} from 'lucide-react';
import { ALGERIAN_TRADES, formatDZD } from '../data/algeriaData';
import { Card, Button, Badge, Rating, Avatar } from './ui';

export const ServicesGrid: React.FC = () => {
  const { 
    artisans, 
    setBookingModalService, 
    searchQuery, 
    setSearchQuery,
    setSelectedTradeFilter,
    setActiveTab,
    selectedCity,
    startCall,
    setSelectedArtisan,
    setSelectedArtisanForAppointment,
    setIsBookingAppointmentModalOpen
  } = useApp();

  type CategoryKey = 'all' | 'transport_depannage' | 'farmer_nature' | 'women' | 'digital' | 'maintenance';
  const [categoryFilter, setCategoryFilter] = useState<CategoryKey>('all');

  const filteredTrades = ALGERIAN_TRADES.filter((trade) => {
    if (categoryFilter === 'transport_depannage') {
      return ['transport_mover', 'towing_depannage', 'mechanic', 'car_wash_mobile'].includes(trade.id);
    }
    if (categoryFilter === 'farmer_nature') {
      return ['farmer_gardener'].includes(trade.id);
    }
    if (categoryFilter === 'women') {
      return ['cook_pastry', 'home_nurse', 'tailor_fashion', 'beauty_henna', 'babysitter_nounou', 'home_cleaning'].includes(trade.id);
    }
    if (categoryFilter === 'digital') {
      return ['gaming_recharge', 'channels_iptv', 'digital_balance_flexy', 'phone_pc_repair', 'camera_surveillance'].includes(trade.id);
    }
    if (categoryFilter === 'maintenance') {
      return ['plumber', 'electrician', 'carpenter', 'painter', 'ac_technician', 'mason', 'blacksmith', 'tiler', 'aluminum_technician', 'locksmith_doors'].includes(trade.id);
    }
    return true;
  });

  const categoryCounts = {
    all: ALGERIAN_TRADES.length,
    transport_depannage: 4,
    farmer_nature: 1,
    women: 6,
    digital: 5,
    maintenance: 10
  };

  // Map icon names to Lucide icons
  const getTradeIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6 text-[#0F6B3F]', strokeWidth: 1.75 };
    switch (iconName) {
      case 'Droplets': return <Droplets {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Hammer': return <Hammer {...props} />;
      case 'Paintbrush': return <Paintbrush {...props} />;
      case 'Wind': return <Wind {...props} />;
      case 'BrickWall': return <BrickWall {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Wrench': return <Wrench {...props} />;
      case 'LayoutGrid': return <LayoutGrid {...props} />;
      case 'Box': return <Box {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'HeartPulse': return <HeartPulse {...props} />;
      case 'Gamepad2': return <Gamepad2 {...props} />;
      case 'Tv': return <Tv {...props} />;
      case 'CreditCard': return <CreditCard {...props} />;
      case 'Scissors': return <Scissors {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Truck': return <Truck {...props} />;
      case 'Car': return <Car {...props} />;
      case 'Sprout': return <Sprout {...props} />;
      case 'Smartphone': return <Smartphone {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Key': return <Key {...props} />;
      case 'SprayCan': return <Sparkles {...props} />;
      default: return <Wrench {...props} />;
    }
  };

  const handleTradeClick = (tradeName: string) => {
    setSelectedTradeFilter(tradeName);
    setActiveTab('artisans');
  };

  // Nearby Artisans matching current filter or top 6
  const nearbyArtisans = artisans.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* 1. Hero Search Section: Direct, Clean Algerian Phrasing */}
      <section className="bg-[#EEF6F1] border border-[#DDE3DF] rounded-[12px] p-6 sm:p-8">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-[28px] font-bold text-[#0A4D2E] leading-tight">
            تحتاج سبّاك؟ اطلبه الآن
          </h1>
          <p className="text-[14px] text-[#5B6660] max-w-xl mx-auto">
            منصة تربطك بأمهر الحرفيين والعمال المعتمدين في ولايتك بكل سهولة وأمان، بأسعار واضحة وتقييمات حقيقية.
          </p>

          {/* Quick Search Input */}
          <div className="flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto pt-2">
            <div className="relative w-full">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6660]" strokeWidth={1.75} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن حرفي في ولايتك (سباك، كهربائي، دهان...)"
                className="w-full h-11 pr-10 pl-3.5 bg-white border border-[#DDE3DF] rounded-[8px] text-[14px] text-[#1C2421] placeholder:text-[#5B6660]/70 focus:outline-none focus:ring-1 focus:ring-[#1E9B5C] focus:border-[#1E9B5C]"
              />
            </div>

            <Button 
              variant="primary"
              className="w-full sm:w-auto shrink-0"
              onClick={() => setActiveTab('artisans')}
            >
              بحث فوري
            </Button>
          </div>
        </div>
      </section>

      {/* 2. The 10 Authentic Algerian Trades Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#0A4D2E]">
              المهن والخدمات المتوفرة
            </h2>
            <p className="text-[14px] text-[#5B6660] mt-0.5">
              اختر المهنة لتصفح الحرفيين المتاحين الآن في {selectedCity || 'ولايتك'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('artisans')}
            className="text-[14px] font-semibold text-[#0F6B3F] hover:text-[#0A4D2E] flex items-center gap-1 transition-colors"
          >
            <span>عرض الكل</span>
            <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`h-9 px-3.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'all'
                ? 'bg-[#0F6B3F] text-white shadow-xs'
                : 'bg-white border border-[#DDE3DF] text-[#5B6660] hover:text-[#1C2421]'
            }`}
          >
            <span>جميع المهن</span>
            <span className="text-[11px] opacity-80">({categoryCounts.all})</span>
          </button>

          <button
            onClick={() => setCategoryFilter('transport_depannage')}
            className={`h-9 px-3.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'transport_depannage'
                ? 'bg-[#0F6B3F] text-white shadow-xs'
                : 'bg-white border border-[#DDE3DF] text-[#5B6660] hover:text-[#1C2421]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>نقل وديباناج وسيارات</span>
            <span className="text-[11px] opacity-80">({categoryCounts.transport_depannage})</span>
          </button>

          <button
            onClick={() => setCategoryFilter('farmer_nature')}
            className={`h-9 px-3.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'farmer_nature'
                ? 'bg-[#0F6B3F] text-white shadow-xs'
                : 'bg-white border border-[#DDE3DF] text-[#5B6660] hover:text-[#1C2421]'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>فلاحة وبستنة</span>
            <span className="text-[11px] opacity-80">({categoryCounts.farmer_nature})</span>
          </button>

          <button
            onClick={() => setCategoryFilter('women')}
            className={`h-9 px-3.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'women'
                ? 'bg-[#0F6B3F] text-white shadow-xs'
                : 'bg-white border border-[#DDE3DF] text-[#5B6660] hover:text-[#1C2421]'
            }`}
          >
            <span>مهن المرأة والطبخ والتمريض</span>
            <span className="text-[11px] opacity-80">({categoryCounts.women})</span>
          </button>

          <button
            onClick={() => setCategoryFilter('digital')}
            className={`h-9 px-3.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'digital'
                ? 'bg-[#0F6B3F] text-white shadow-xs'
                : 'bg-white border border-[#DDE3DF] text-[#5B6660] hover:text-[#1C2421]'
            }`}
          >
            <span>شحن ألعاب وتقنية</span>
            <span className="text-[11px] opacity-80">({categoryCounts.digital})</span>
          </button>

          <button
            onClick={() => setCategoryFilter('maintenance')}
            className={`h-9 px-3.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'maintenance'
                ? 'bg-[#0F6B3F] text-white shadow-xs'
                : 'bg-white border border-[#DDE3DF] text-[#5B6660] hover:text-[#1C2421]'
            }`}
          >
            <span>صيانة وتصليح وبناء</span>
            <span className="text-[11px] opacity-80">({categoryCounts.maintenance})</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredTrades.map((trade) => {
            return (
              <Card
                key={trade.id}
                variant="white"
                isInteractive
                onClick={() => handleTradeClick(trade.name)}
                className="flex flex-col items-center text-center p-4 h-full justify-between"
              >
                <div className="w-12 h-12 rounded-[8px] bg-[#EEF6F1] flex items-center justify-center mb-3">
                  {getTradeIcon(trade.iconName)}
                </div>

                <div className="space-y-1">
                  <h3 className="text-[16px] font-bold text-[#1C2421]">
                    {trade.name}
                  </h3>
                  <p className="text-[12px] text-[#5B6660] line-clamp-2">
                    {trade.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#DDE3DF] w-full text-center">
                  <span className="text-[12px] font-semibold text-[#0A4D2E] tabular-nums">
                    ابتداءً من {formatDZD(trade.hourlyRateTypical)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 3. Nearby Artisans ("حرفيون قريبون منك") */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#0A4D2E]">
              حرفيون قريبون منك
            </h2>
            <p className="text-[14px] text-[#5B6660] mt-0.5">
              حرفيون ذوو خبرة وتقييمات عالية في {selectedCity || 'الجزائر'}
            </p>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab('artisans')}
          >
            دليل الحرفيين الكامل
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyArtisans.map((artisan) => (
            <Card key={artisan.id} variant="white" className="flex flex-col justify-between">
              <div>
                {/* Artisan Card Header - Clickable for full profile */}
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
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[16px] font-bold text-[#1C2421] group-hover:text-[#0A4D2E] transition-colors truncate">
                        {artisan.name}
                      </h3>
                      <Badge variant="green" size="sm">
                        {artisan.trade}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Rating 
                        rating={artisan.rating} 
                        reviewCount={artisan.reviewCount} 
                        size="sm" 
                      />
                    </div>

                    <div className="flex items-center gap-1.5 text-[12px] text-[#5B6660] mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F6B3F] shrink-0" strokeWidth={1.75} />
                      <span className="truncate">{artisan.city} · {artisan.neighborhood}</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-[13px] text-[#5B6660] mt-3 line-clamp-2 leading-relaxed">
                  {artisan.bio}
                </p>

                {/* Stats row: Completed jobs + Rate */}
                <div className="mt-3.5 pt-3 border-t border-[#DDE3DF] flex items-center justify-between text-[12px]">
                  <span className="text-[#5B6660]">
                    أعمال منجزة: <strong className="text-[#1C2421] tabular-nums font-semibold">{artisan.completedJobsCount}</strong>
                  </span>
                  <span className="text-[#0A4D2E] font-bold tabular-nums">
                    {formatDZD(artisan.hourlyRate)}/ساعة
                  </span>
                </div>
              </div>

              {/* Action Buttons: Min 44px touch targets */}
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
      </section>

      {/* 4. Trust & Guarantee Statement (Clean, Non-Pretentious) */}
      <section className="bg-[#EEF6F1] border border-[#DDE3DF] rounded-[12px] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-white border border-[#DDE3DF] flex items-center justify-center text-[#0A4D2E] shrink-0">
            <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <h4 className="text-[16px] font-bold text-[#0A4D2E]">
              ضمان خدّام وجودة الخدمة
            </h4>
            <p className="text-[13px] text-[#5B6660] mt-0.5">
              كل الحرفيين مسجلون ببطاقات الهوية الوطنية مع نظام تقييم شفاف من زبائن حقيقيين في الجزائر.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="shrink-0 w-full sm:w-auto"
          onClick={() => setActiveTab('pricing')}
        >
          دليل الأسعار المعتمدة
        </Button>
      </section>
    </div>
  );
};
