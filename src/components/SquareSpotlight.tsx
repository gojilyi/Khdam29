import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  Maximize2, 
  X, 
  ExternalLink, 
  Video, 
  ImageIcon, 
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';

export const SquareSpotlight: React.FC = () => {
  const { squareSpotlightConfig, setActiveTab, language } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!squareSpotlightConfig || !squareSpotlightConfig.isVisible || !squareSpotlightConfig.mediaUrl) {
    return null;
  }

  const handleAction = () => {
    if (squareSpotlightConfig.linkUrl) {
      if (squareSpotlightConfig.linkUrl.startsWith('http')) {
        window.open(squareSpotlightConfig.linkUrl, '_blank');
      } else {
        setActiveTab(squareSpotlightConfig.linkUrl);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* 5cm x 5cm Physical Container Card */}
      <div className="relative group bg-white dark:bg-slate-900 rounded-3xl p-3.5 border-2 border-amber-500/40 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center gap-4">
        {/* The 5cm by 5cm Media Screen */}
        <div 
          style={{ width: '5cm', height: '5cm' }} 
          className="relative rounded-2xl overflow-hidden bg-slate-950 shrink-0 shadow-md border border-slate-700/60 aspect-square flex items-center justify-center"
        >
          {squareSpotlightConfig.mediaType === 'video' ? (
            <div className="relative w-full h-full">
              <video
                src={squareSpotlightConfig.mediaUrl}
                autoPlay={isPlaying}
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsPlaying(!isPlaying)}
              />
              
              {/* Video Overlay Controls */}
              <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between px-1.5 py-1 rounded-xl bg-slate-950/70 backdrop-blur-xs text-white">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(!isPlaying);
                  }}
                  className="p-1 hover:text-amber-400 transition-colors"
                  title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-1 hover:text-amber-400 transition-colors"
                  title={isMuted ? 'كتم الصوت' : 'تشغيل الصوت'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                  className="p-1 hover:text-amber-400 transition-colors"
                  title="تكبير"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="relative w-full h-full cursor-pointer group/img"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={squareSpotlightConfig.mediaUrl}
                alt={squareSpotlightConfig.title || 'منطقة 5×5 الإعلانية'}
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Maximize2 className="w-5 h-5 drop-shadow-md" />
              </div>
            </div>
          )}

          {/* 5x5 Dimension Indicator Badge */}
          <div className="absolute top-1.5 rtl:right-1.5 ltr:left-1.5 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[9px] font-black tracking-wider uppercase shadow-xs">
            {squareSpotlightConfig.badge || '5×5 cm'}
          </div>
        </div>

        {/* Optional Title and Text Content (معه عنوان أو نص أو بدونه) */}
        {(squareSpotlightConfig.title || squareSpotlightConfig.text) && (
          <div className="flex-1 min-w-0 space-y-2 text-start">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-bold">
                {squareSpotlightConfig.mediaType === 'video' ? 'مقطع فيديو حصري' : 'صورة مميزة'}
              </span>
            </div>

            {squareSpotlightConfig.title && (
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                {squareSpotlightConfig.title}
              </h3>
            )}

            {squareSpotlightConfig.text && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                {squareSpotlightConfig.text}
              </p>
            )}

            {squareSpotlightConfig.linkUrl && (
              <button
                onClick={handleAction}
                className="mt-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <span>{language === 'ar' ? 'عرض المزيد والتفاصيل' : 'View Details'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Expanded Modal (Zoomed View) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                  لوحة العرض 5×5 سم
                </span>
                <h4 className="font-bold text-sm text-slate-200">
                  {squareSpotlightConfig.title || 'عرض الوسائط'}
                </h4>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              {squareSpotlightConfig.mediaType === 'video' ? (
                <video
                  src={squareSpotlightConfig.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={squareSpotlightConfig.mediaUrl}
                  alt={squareSpotlightConfig.title || 'Spotlight Image'}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {squareSpotlightConfig.text && (
              <p className="text-xs text-slate-300 leading-relaxed p-2 bg-slate-800/40 rounded-xl">
                {squareSpotlightConfig.text}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
