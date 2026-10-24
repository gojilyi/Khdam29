import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, ClipboardList, User, Sparkles } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeOrders, 
    setIsAuthModalOpen,
    openSmartDiagnosis 
  } = useApp();

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DDE3DF] shadow-[0_-1px_3px_rgba(28,36,33,0.06)] bottom-nav-safe-padding w-full max-w-full"
      aria-label="شريط التنقل السفلي"
    >
      <div className="grid grid-cols-5 items-center h-16 w-full max-w-md mx-auto px-1">
        
        {/* 1. الرئيسية */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 select-none transition-colors duration-150 cursor-pointer"
          aria-label="الرئيسية"
          aria-current={activeTab === 'home' ? 'page' : undefined}
        >
          <Home
            strokeWidth={1.75}
            className={`w-5 h-5 transition-colors ${
              activeTab === 'home' ? 'text-[#0F6B3F]' : 'text-[#5B6660]'
            }`}
          />
          <span
            className={`text-[11px] tracking-tight mt-1 transition-colors ${
              activeTab === 'home' ? 'text-[#0F6B3F] font-bold' : 'text-[#5B6660] font-normal'
            }`}
          >
            الرئيسية
          </span>
        </button>

        {/* 2. البحث ودليل الحرفيين */}
        <button
          onClick={() => setActiveTab('artisans')}
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 select-none transition-colors duration-150 cursor-pointer"
          aria-label="دليل الحرفيين"
          aria-current={activeTab === 'artisans' ? 'page' : undefined}
        >
          <Search
            strokeWidth={1.75}
            className={`w-5 h-5 transition-colors ${
              activeTab === 'artisans' ? 'text-[#0F6B3F]' : 'text-[#5B6660]'
            }`}
          />
          <span
            className={`text-[11px] tracking-tight mt-1 transition-colors ${
              activeTab === 'artisans' ? 'text-[#0F6B3F] font-bold' : 'text-[#5B6660] font-normal'
            }`}
          >
            البحث
          </span>
        </button>

        {/* 3. الزر البارز في المنتصف: "شخّص مشكلتك" (بحجم أكبر، أخضر #0F6B3F، أيقونة Sparkles) */}
        <button
          onClick={() => openSmartDiagnosis()}
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 select-none group cursor-pointer relative"
          aria-label="شخّص مشكلتك بالذكاء الاصطناعي"
        >
          <div className="w-12 h-12 -mt-5 bg-[#0F6B3F] hover:bg-[#0A4D2E] active:scale-95 text-white rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(15,107,63,0.35)] border-3 border-white transition-all">
            <Sparkles className="w-6 h-6 text-white animate-pulse" strokeWidth={1.75} />
          </div>
          <span className="text-[10px] font-bold text-[#0F6B3F] whitespace-nowrap mt-1 leading-none">
            شخّص مشكلتك
          </span>
        </button>

        {/* 4. طلباتي مع إشعار الطلبات النشطة */}
        <button
          onClick={() => setActiveTab('orders')}
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 select-none transition-colors duration-150 cursor-pointer"
          aria-label="طلباتي"
          aria-current={activeTab === 'orders' ? 'page' : undefined}
        >
          <div className="relative">
            <ClipboardList
              strokeWidth={1.75}
              className={`w-5 h-5 transition-colors ${
                activeTab === 'orders' ? 'text-[#0F6B3F]' : 'text-[#5B6660]'
              }`}
            />
            {activeOrders.length > 0 && (
              <span className="absolute -top-1 -right-2 px-1 min-w-[16px] h-4 bg-[#1E9B5C] rounded-full text-[10px] font-bold text-white flex items-center justify-center tabular-nums">
                {activeOrders.length}
              </span>
            )}
          </div>
          <span
            className={`text-[11px] tracking-tight mt-1 transition-colors ${
              activeTab === 'orders' ? 'text-[#0F6B3F] font-bold' : 'text-[#5B6660] font-normal'
            }`}
          >
            طلباتي
          </span>
        </button>

        {/* 5. حسابي */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 select-none transition-colors duration-150 cursor-pointer"
          aria-label="حسابي"
        >
          <User
            strokeWidth={1.75}
            className="w-5 h-5 text-[#5B6660] hover:text-[#0F6B3F] transition-colors"
          />
          <span className="text-[11px] tracking-tight mt-1 text-[#5B6660] font-normal">
            حسابي
          </span>
        </button>

      </div>
    </nav>
  );
};
