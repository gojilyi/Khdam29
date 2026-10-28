import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Headphones, MessageSquare, Phone, X, MessageCircle } from 'lucide-react';

export const FloatingContactButton: React.FC = () => {
  const { setIsContactModalOpen, playStoreConfig, isContactModalOpen } = useApp();
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  // If the contact modal is already open, hide the floating button
  if (isContactModalOpen) return null;

  const whatsappNumber = playStoreConfig.whatsappNumber || '+213 550 12 34 56';
  const phone = playStoreConfig.supportPhone || '+213 23 45 67 89';
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  return (
    <div 
      className="fixed z-40 rtl:left-4 ltr:right-4 bottom-20 md:bottom-6 flex flex-col items-center gap-2 select-none"
      dir="rtl"
    >
      {/* Speed Dial Menu */}
      {isOpenMenu && (
        <div className="flex flex-col items-stretch gap-2 mb-1 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl animate-fade-in w-48 text-xs font-bold">
          <div className="text-[10px] text-slate-400 px-2 py-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>علبة التواصل السريع</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* 1. Live Chat Modal */}
          <button
            onClick={() => {
              setIsOpenMenu(false);
              setIsContactModalOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-800 dark:text-slate-100 hover:bg-[#EEF6F1] hover:text-[#0F6B3F] transition-colors cursor-pointer text-start"
          >
            <Headphones className="w-4 h-4 text-[#0F6B3F] shrink-0" />
            <span>محادثة الدعم الفني</span>
          </button>

          {/* 2. Direct WhatsApp */}
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('السلام عليكم، أحتاج مساعدة أو استفسار عبر تطبيق خـدّام.')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpenMenu(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer text-start"
          >
            <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>واتساب المباشر</span>
          </a>

          {/* 3. Direct Phone Call */}
          <a
            href={`tel:${cleanPhone}`}
            onClick={() => setIsOpenMenu(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer text-start"
          >
            <Phone className="w-4 h-4 text-amber-500 shrink-0" />
            <span>اتصال هاتفي</span>
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpenMenu(prev => !prev)}
        className="group relative h-12 px-3.5 sm:px-4 rounded-full bg-[#0F6B3F] hover:bg-[#0A4D2E] text-white font-bold text-xs flex items-center gap-2 shadow-[0_4px_16px_rgba(15,107,63,0.35)] hover:shadow-[0_6px_20px_rgba(15,107,63,0.5)] transition-all active:scale-95 cursor-pointer border-2 border-white/40"
        title="علبة التواصل والدعم الفني"
        aria-label="علبة التواصل"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
        </span>

        {isOpenMenu ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Headphones className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        )}

        <span className="hidden sm:inline font-bold">علبة التواصل</span>
      </button>
    </div>
  );
};
