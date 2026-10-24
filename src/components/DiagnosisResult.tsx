import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Plus, 
  ShieldAlert, 
  Sparkles, 
  MapPin, 
  RotateCcw,
  ThumbsUp, 
  ThumbsDown, 
  Check, 
  HelpCircle,
  Banknote
} from 'lucide-react';
import { AIDiagnosisResponse } from '../services/aiDiagnosis';
import { useApp } from '../context/AppContext';
import { formatDZD } from '../data/algeriaData';
import { Avatar, Badge, Button, Rating } from './ui';
import { Artisan } from '../types';

interface DiagnosisResultProps {
  result: AIDiagnosisResponse;
  userDescription: string;
  userImage: string | null;
  onReset: () => void;
  onCloseSheet: () => void;
}

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  result,
  userDescription,
  userImage,
  onReset,
  onCloseSheet
}) => {
  const { 
    artisans, 
    selectedCity, 
    startCall, 
    setBookingModalService,
    setSelectedArtisan
  } = useApp();

  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);

  // Map Arabic profession title to category / keywords in app
  const professionKeywords = [
    result.profession,
    ...(result.alternative_professions || [])
  ].map(p => p.toLowerCase());

  // Match and sort artisans:
  // 1. Trade matching
  // 2. Online first
  // 3. Same wilaya first
  // 4. Highest rating
  const matchingArtisans = artisans
    .filter(a => {
      const tradeStr = (a.trade || '').toLowerCase();
      const bioStr = (a.bio || '').toLowerCase();
      const skillsStr = (a.skills || []).join(' ').toLowerCase();
      return professionKeywords.some(kw => 
        tradeStr.includes(kw) || bioStr.includes(kw) || skillsStr.includes(kw)
      );
    })
    .sort((a, b) => {
      // Online first
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;

      // Same wilaya
      const aInCity = selectedCity && a.city?.includes(selectedCity) ? 1 : 0;
      const bInCity = selectedCity && b.city?.includes(selectedCity) ? 1 : 0;
      if (aInCity !== bInCity) return bInCity - aInCity;

      // Rating
      return b.rating - a.rating;
    })
    .slice(0, 4); // Top 4 matching artisans

  // Fallback to top rated artisans if none directly matched
  const displayedArtisans = matchingArtisans.length > 0 
    ? matchingArtisans 
    : artisans.slice(0, 3);

  const handleOrderService = (artisan?: Artisan) => {
    // Open order flow modal prefilled with diagnosis data
    setBookingModalService({
      categoryId: artisan?.categoryId || 'home_repair',
      subServiceId: artisan?.subCategoryIds?.[0] || 'plumbing',
      artisanId: artisan?.id,
      prefilledTrade: result.profession,
      prefilledDescription: userDescription,
      prefilledImage: userImage || undefined
    });
    onCloseSheet();
  };

  const isUrgent = result.urgency === 'عاجل';
  const isNormal = result.urgency === 'عادي';

  return (
    <div className="space-y-5 animate-fade-in text-right">
      
      {/* 1. Critical Safety Warning Banner (if detected) */}
      {result.safety_warning && result.safety_warning.trim() !== '' && (
        <div className="p-4 bg-red-50 border-2 border-[#C62828] rounded-[12px] flex items-start gap-3 text-right">
          <ShieldAlert className="w-6 h-6 text-[#C62828] shrink-0 mt-0.5" strokeWidth={1.75} />
          <div>
            <h4 className="text-[14px] font-bold text-[#C62828]">
              تنبيه أمني عاجل للسلامة
            </h4>
            <p className="text-[13px] text-[#C62828] mt-1 leading-relaxed font-semibold">
              {result.safety_warning}
            </p>
          </div>
        </div>
      )}

      {/* 2. Need More Information Banner if query was too vague */}
      {result.needs_more_info && result.follow_up_question && (
        <div className="p-4 bg-[#EEF6F1] border border-[#1E9B5C] rounded-[12px] flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-[#0F6B3F] shrink-0 mt-0.5" strokeWidth={1.75} />
          <div className="flex-1">
            <h4 className="text-[13px] font-bold text-[#0A4D2E]">
              نحتاج تفاصيل إضافية لمساعدتك بدقة أفضل:
            </h4>
            <p className="text-[13px] text-[#1C2421] mt-1 leading-relaxed">
              {result.follow_up_question}
            </p>
            <button
              onClick={onReset}
              className="mt-2 text-[12px] font-bold text-[#0F6B3F] hover:underline cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة كتابة وتوضيح المشكلة</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Diagnostic Card */}
      <div className="bg-white border border-[#DDE3DF] rounded-[12px] p-5 shadow-[0_2px_8px_rgba(28,36,33,0.06)] space-y-4">
        
        {/* Title, Badges & Urgency */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#DDE3DF]">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[11px] font-bold text-[#0A4D2E] bg-[#EEF6F1] px-2 py-0.5 rounded-[8px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#0F6B3F]" strokeWidth={1.75} />
                <span>تشخيص ذكي</span>
              </span>

              {/* Urgency Badge */}
              <span 
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-[8px] flex items-center gap-1 ${
                  isUrgent 
                    ? 'bg-red-100 text-[#C62828] border border-red-200' 
                    : isNormal 
                      ? 'bg-[#EEF6F1] text-[#0F6B3F] border border-[#1E9B5C]/30'
                      : 'bg-slate-100 text-[#5B6660]'
                }`}
              >
                <Clock className="w-3 h-3" strokeWidth={1.75} />
                <span>درجة الاستعجال: {result.urgency}</span>
              </span>
            </div>

            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0A4D2E] leading-snug">
              {result.problem_title}
            </h3>
          </div>

          {/* Suggested Profession Pill */}
          <div className="self-start sm:self-auto bg-[#0F6B3F] text-white px-3.5 py-1.5 rounded-[8px] text-[13px] font-bold flex items-center gap-1.5 shrink-0 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2} />
            <span>الحرفي المناسب: {result.profession}</span>
          </div>
        </div>

        {/* Alternative Professions if any */}
        {result.alternative_professions && result.alternative_professions.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-[12px] text-[#5B6660]">
            <span>تخصصات ذات صلة:</span>
            {result.alternative_professions.map((alt, i) => (
              <span key={i} className="bg-[#EEF6F1] text-[#0A4D2E] px-2 py-0.5 rounded-[6px] font-medium">
                {alt}
              </span>
            ))}
          </div>
        )}

        {/* Possible Causes */}
        {result.possible_causes && result.possible_causes.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <h4 className="text-[13px] font-bold text-[#1C2421]">
              الأسباب المحتملة:
            </h4>
            <ul className="space-y-1 text-[13px] text-[#5B6660]">
              {result.possible_causes.map((cause, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F6B3F] mt-2 shrink-0" />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Tips */}
        {result.quick_tips && result.quick_tips.length > 0 && (
          <div className="p-3.5 bg-[#EEF6F1] border border-[#DDE3DF] rounded-[8px] space-y-1.5">
            <h4 className="text-[13px] font-bold text-[#0A4D2E] flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#0F6B3F]" strokeWidth={2} />
              <span>نصائح سريعة قبل وصول الحرفي:</span>
            </h4>
            <ul className="space-y-1 text-[12.5px] text-[#1C2421]">
              {result.quick_tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#0F6B3F] font-bold shrink-0">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Estimated Price in DZD */}
        <div className="pt-3 border-t border-[#DDE3DF] flex flex-wrap items-center justify-between gap-2 bg-[#EEF6F1]/50 p-3 rounded-[8px]">
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-[#0F6B3F]" strokeWidth={1.75} />
            <div>
              <span className="text-[11px] text-[#5B6660] block leading-tight">التكلفة التقديرية</span>
              <span className="text-[16px] font-bold text-[#0A4D2E] tabular-nums">
                {formatDZD(result.estimated_price_dzd?.min || 1500)} — {formatDZD(result.estimated_price_dzd?.max || 3500)}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-[#5B6660] bg-white px-2 py-1 rounded-[6px] border border-[#DDE3DF]">
            تقدير تقريبي
          </span>
        </div>
      </div>

      {/* 4. Matching Artisans List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[15px] font-bold text-[#0A4D2E] flex items-center gap-2">
            <span>حرفيون مناسبون متاحون الآن</span>
            <span className="text-[12px] font-normal text-[#5B6660]">({displayedArtisans.length})</span>
          </h4>
          <span className="text-[11px] text-[#5B6660]">مرتبون حسب التقييم والتواجد</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayedArtisans.map((artisan) => (
            <div 
              key={artisan.id}
              className="p-3.5 bg-white border border-[#DDE3DF] rounded-[12px] flex flex-col justify-between space-y-3 shadow-xs hover:border-[#1E9B5C] transition-colors"
            >
              <div 
                className="flex items-start gap-2.5 cursor-pointer"
                onClick={() => setSelectedArtisan(artisan)}
              >
                <Avatar
                  src={artisan.avatar}
                  alt={artisan.name}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="text-[14px] font-bold text-[#1C2421] truncate">
                      {artisan.name}
                    </h5>
                    {artisan.isOnline && (
                      <span className="text-[10px] text-[#0A4D2E] bg-[#EEF6F1] px-1.5 py-0.5 rounded-[4px] font-bold shrink-0">
                        متاح الآن
                      </span>
                    )}
                  </div>

                  <div className="text-[12px] text-[#0F6B3F] font-semibold mt-0.5">
                    {artisan.trade}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <Rating rating={artisan.rating} reviewCount={artisan.reviewCount} size="sm" />
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-[#5B6660] mt-1">
                    <MapPin className="w-3 h-3 text-[#0F6B3F] shrink-0" strokeWidth={1.75} />
                    <span className="truncate">{artisan.city} {artisan.neighborhood ? `· ${artisan.neighborhood}` : ''}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Min 44px touch targets */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DDE3DF]">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Phone className="w-3.5 h-3.5 text-[#0F6B3F]" strokeWidth={1.75} />}
                  onClick={() => startCall(artisan.id, artisan.name, artisan.phoneMasked)}
                >
                  اتصل
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" strokeWidth={2} />}
                  onClick={() => handleOrderService(artisan)}
                >
                  اطلب الخدمة
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Primary Direct Request CTA */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={() => handleOrderService()}
          leftIcon={<Plus className="w-4 h-4" strokeWidth={2} />}
          className="w-full text-[14px] font-bold"
        >
          طلب خدمة {result.profession} بالبيانات المشخّصة
        </Button>
      </div>

      {/* 6. Feedback & Edit Section */}
      <div className="pt-3 border-t border-[#DDE3DF] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#5B6660]">
        <div className="flex items-center gap-2">
          <span>هل كان التشخيص مفيدًا؟</span>
          {feedbackGiven ? (
            <span className="text-[#0F6B3F] font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" strokeWidth={2} />
              شكراً على تقييمك!
            </span>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFeedbackGiven('yes')}
                className="h-8 px-2.5 bg-[#EEF6F1] hover:bg-[#DDE3DF] text-[#0A4D2E] rounded-[6px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>نعم</span>
              </button>
              <button
                onClick={() => setFeedbackGiven('no')}
                className="h-8 px-2.5 bg-[#EEF6F1] hover:bg-[#DDE3DF] text-[#5B6660] rounded-[6px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ThumbsDown className="w-3 h-3" />
                <span>لا</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onReset}
          className="text-[#0F6B3F] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>غيّر الوصف أو جرّب مشكلة أخرى</span>
        </button>
      </div>

      {/* 7. Mandatory AI Disclaimer */}
      <p className="text-[11px] text-[#5B6660] text-center pt-2">
        التشخيص بواسطة الذكاء الاصطناعي وهو استرشادي، والحرفي يؤكد المشكلة بعد المعاينة.
      </p>

    </div>
  );
};
