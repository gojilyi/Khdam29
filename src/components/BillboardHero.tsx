import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Compass, 
  ShieldCheck, 
  Video, 
  Image as ImageIcon 
} from 'lucide-react';

export const BillboardHero: React.FC = () => {
  const { 
    billboardConfig, 
    setActiveTab, 
    language,
    isAdminAuthenticated,
    setAdminEditModalTarget,
    getAdminCustomText
  } = useApp();

  if (!billboardConfig || !billboardConfig.isVisible) {
    return null;
  }

  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleAction = () => {
    if (billboardConfig.buttonLink) {
      if (billboardConfig.buttonLink.startsWith('http')) {
        window.open(billboardConfig.buttonLink, '_blank');
      } else {
        setActiveTab(billboardConfig.buttonLink);
      }
    } else {
      setActiveTab('radar');
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/30 bg-slate-950 text-white min-h-[300px] sm:min-h-[380px] flex items-center">
      {/* Background Media: Video or Image */}
      {billboardConfig.mediaType === 'video' ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-45"
            src={billboardConfig.mediaUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={billboardConfig.mediaUrl}
            alt={billboardConfig.title}
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity cursor-pointer"
            referrerPolicy="no-referrer"
            title={isAdminAuthenticated ? "انقر مرتين لاستبدال صورة الهيرو أو اسحب صورة جديدة وضعها هنا" : billboardConfig.title}
            onClick={() => {
              if (isAdminAuthenticated) {
                setAdminEditModalTarget({
                  type: 'image',
                  id: 'billboard',
                  title: 'صورة لافتة الهيرو الكبرى',
                  currentValue: billboardConfig.mediaUrl
                });
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Decorative ambient glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      {/* Content overlay */}
      <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-bold text-amber-300 backdrop-blur-md">
          {billboardConfig.mediaType === 'video' ? (
            <Video className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>{billboardConfig.badge || 'إعلان رسمي من منصة خدام'}</span>
          {isAdminAuthenticated && (
            <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-black mr-1">
              أدمن
            </span>
          )}
        </div>

        {/* Title */}
        <h2 
          className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md cursor-pointer"
          data-admin-text-id="billboard_title"
          title={isAdminAuthenticated ? "انقر مرتين لتعديل العنوان" : undefined}
        >
          {getAdminCustomText('billboard_title', billboardConfig.title)}
        </h2>

        {/* Description / Custom Text */}
        <p 
          className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl drop-shadow-xs cursor-pointer"
          data-admin-text-id="billboard_desc"
          title={isAdminAuthenticated ? "انقر مرتين لتعديل الوصف" : undefined}
        >
          {getAdminCustomText('billboard_desc', billboardConfig.description)}
        </p>

        {/* Action Button */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleAction}
            className="h-12 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-transform active:scale-95"
          >
            <Compass className="w-4 h-4 text-white" />
            <span>{billboardConfig.buttonText || (language === 'ar' ? 'تشغيل رادار البحث الحي' : 'Explore Now')}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
