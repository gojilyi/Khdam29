import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  MapPin, 
  ChevronDown, 
  Bell, 
  User, 
  Plus, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { ALGERIA_WILAYAS } from '../data/algeriaData';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeOrders,
    currentUser,
    setIsAuthModalOpen,
    selectedCity,
    setSelectedCity,
    setBookingModalService,
    setIsNotificationsModalOpen,
    unreadNotificationsCount,
    isAdminAuthenticated,
    setIsAdminAuthModalOpen
  } = useApp();

  const { isLoggedIn, profile, role: authRole, logout, openAuthModalWithRedirect } = useAuth();
  const [isWilayaDropdownOpen, setIsWilayaDropdownOpen] = useState(false);

  const mainNavItems = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'artisans', label: 'دليل الحرفيين' },
    { id: 'orders', label: 'طلباتي', badge: activeOrders.length },
    { id: 'chat', label: 'الرسائل' },
    { id: 'pricing', label: 'دليل الأسعار' },
  ];

  const handleOrderServiceClick = () => {
    if (!isLoggedIn) {
      openAuthModalWithRedirect('orders');
      setIsAuthModalOpen(true);
    } else {
      setBookingModalService({ categoryId: 'home_repair', subServiceId: 'plumbing' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A4D2E] text-white border-b border-[#0A4D2E] shadow-sm select-none header-safe-padding w-full max-w-full">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 min-w-0 w-full">
        
        {/* Zone 1: Clean Brand Wordmark & Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            onDoubleClick={() => {
              if (!isAdminAuthenticated) {
                setIsAdminAuthModalOpen(true);
              } else {
                setActiveTab('admin');
              }
            }}
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[8px] p-1 cursor-pointer"
            title="خدام - حرفيك قريب منك"
          >
            {/* SVG Mark */}
            <svg 
              width="30" 
              height="30" 
              viewBox="0 0 44 44" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
              aria-hidden="true"
            >
              <path 
                d="M6 2H30L40 12V38C40 40.2 38.2 42 36 42H6C3.8 42 2 40.2 2 38V6C2 3.8 3.8 2 6 2Z" 
                fill="#0F6B3F" 
                stroke="#1E9B5C" 
                strokeWidth="2"
              />
              <path 
                d="M11 22L18 29L33 14L36 17L18 35L8 25L11 22Z" 
                fill="#FFFFFF" 
              />
              <circle cx="31" cy="16" r="2" fill="#0F6B3F" />
            </svg>

            <div className="flex flex-col text-right leading-none">
              <span className="text-[18px] sm:text-[22px] font-bold tracking-tight text-white">
                خـدّام
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#EEF6F1] opacity-80 hidden md:inline">
                حرفيك قريب منك
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links on Tablet/Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-[14px] font-medium" aria-label="التنقل الرئيسي">
          {mainNavItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if ((item.id === 'orders' || item.id === 'chat') && !isLoggedIn) {
                    openAuthModalWithRedirect(item.id, item.id === 'orders' ? 'أنشئ حساب لإكمال ومتابعة طلباتك' : 'أنشئ حساب لمراسلة الحرفيين');
                    setIsAuthModalOpen(true);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`
                  relative py-2 transition-colors duration-150 whitespace-nowrap cursor-pointer flex items-center gap-1.5
                  ${isActive ? 'text-white font-bold' : 'text-[#EEF6F1]/80 hover:text-white'}
                `}
              >
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="h-5 px-1.5 text-[11px] font-bold rounded-[8px] bg-[#1E9B5C] text-white flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
                {isActive && (
                  <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#1E9B5C]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Wilaya Dropdown + Auth status + Primary Action */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
          
          {/* Quick Wilaya Selector (All 58 Wilayas) */}
          <div className="relative">
            <button
              onClick={() => setIsWilayaDropdownOpen(!isWilayaDropdownOpen)}
              className="h-9 sm:h-10 px-2 sm:px-3 rounded-[8px] bg-[#0F6B3F] hover:bg-[#1E9B5C]/30 text-white text-[11px] sm:text-[13px] font-medium flex items-center gap-1 sm:gap-1.5 border border-[#1E9B5C]/40 transition-colors cursor-pointer"
              aria-label="اختيار الولاية"
              aria-expanded={isWilayaDropdownOpen}
            >
              <MapPin className="w-3.5 h-3.5 text-[#1E9B5C] shrink-0" strokeWidth={1.75} />
              <span className="max-w-[60px] sm:max-w-[110px] truncate">
                {selectedCity || 'الجزائر العاصمة'}
              </span>
              <ChevronDown className="w-3 h-3 text-[#EEF6F1]/70 shrink-0 hidden sm:inline" strokeWidth={1.75} />
            </button>

            {isWilayaDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsWilayaDropdownOpen(false)} 
                />
                <div className="absolute left-0 mt-2 w-56 max-h-72 overflow-y-auto bg-white text-[#1C2421] border border-[#DDE3DF] rounded-[12px] shadow-[0_4px_12px_rgba(28,36,33,0.12)] z-50 p-1.5">
                  <div className="px-3 py-2 text-[12px] font-bold text-[#0A4D2E] border-b border-[#DDE3DF]">
                    اختر الولاية (58 ولاية)
                  </div>
                  {ALGERIA_WILAYAS.map(w => (
                    <button
                      key={w.code}
                      onClick={() => {
                        setSelectedCity(w.name);
                        setIsWilayaDropdownOpen(false);
                      }}
                      className={`
                        w-full text-right px-3 py-2 text-[13px] rounded-[8px] transition-colors flex items-center justify-between
                        ${selectedCity === w.name 
                          ? 'bg-[#EEF6F1] text-[#0A4D2E] font-bold' 
                          : 'hover:bg-[#EEF6F1] text-[#1C2421]'}
                      `}
                    >
                      <span>{w.name}</span>
                      <span className="text-[11px] text-[#5B6660] font-mono">{w.code}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationsModalOpen(true)}
            className="hidden sm:flex w-9 sm:w-10 h-9 sm:h-10 rounded-[8px] items-center justify-center text-white hover:bg-[#0F6B3F] transition-colors relative cursor-pointer"
            aria-label="التنبيهات"
          >
            <Bell className="w-4 h-4" strokeWidth={1.75} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E8A317]" />
            )}
          </button>

          {/* User Auth Profile Trigger */}
          {isLoggedIn ? (
            <button
              onClick={() => setActiveTab('profile')}
              className="hidden md:flex h-10 px-3 rounded-[8px] items-center gap-1.5 text-white hover:bg-[#0F6B3F] text-[13px] font-medium transition-colors cursor-pointer border border-white/20"
              aria-label="الحساب الشخصي"
            >
              <User className="w-4 h-4 text-[#1E9B5C]" strokeWidth={1.75} />
              <span className="max-w-[120px] truncate">
                {profile?.displayName ? profile.displayName.split(' ')[0] : currentUser.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden md:flex h-10 px-3 rounded-[8px] items-center gap-1.5 text-white hover:bg-[#0F6B3F] text-[13px] font-medium transition-colors cursor-pointer border border-[#1E9B5C]/60"
              aria-label="تسجيل الدخول"
            >
              <User className="w-4 h-4" strokeWidth={1.75} />
              <span>دخول / تسجيل</span>
            </button>
          )}

          {/* Primary CTA: طلب خدمة */}
          <button
            onClick={handleOrderServiceClick}
            className="h-9 sm:h-10 px-2.5 sm:px-4 rounded-[8px] bg-[#1E9B5C] hover:bg-[#0F6B3F] text-white text-[12px] sm:text-[14px] font-bold flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            <span>اطلب خدمة</span>
          </button>
        </div>

      </div>
    </header>
  );
};
