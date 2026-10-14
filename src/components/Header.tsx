import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Moon, 
  Sun, 
  Globe, 
  UserCheck, 
  Briefcase, 
  Compass, 
  FileText, 
  MessageSquare, 
  Users,
  Star,
  Sparkles,
  Key,
  Lock,
  Headphones,
  Calendar
} from 'lucide-react';
import { serviceCategories } from '../data/mockData';
import { PWAInstallButton } from './PWAInstallButton';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    t, 
    isDarkMode, 
    toggleDarkMode, 
    activeTab, 
    setActiveTab, 
    activeOrders,
    activeOrder,
    appointments,
    currentUser,
    setIsAuthModalOpen,
    setIsReviewModalOpen,
    setIsCraftCharterOpen,
    setSelectedCraftForCharter,
    handleBrandSecretClick,
    isAdminAuthenticated,
    setIsAdminAuthModalOpen,
    setIsChatDiagnosticsOpen,
    setIsMediaManagerModalOpen,
    setIsAIDiagnosticModalOpen,
    setIsContactModalOpen
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with Secret 7-tap trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleBrandSecretClick();
              }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-sm shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer"
              title={isAdminAuthenticated ? "لوحة المشرف العام" : "الرئيسية (خدّام)"}
            >
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </button>
            <div className="flex flex-col relative select-none">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrandSecretClick();
                  }}
                  className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                  title="خـدّام"
                >
                  {t.appName}
                </button>

                {isAdminAuthenticated && (
                  <div className="flex items-center gap-1.5">
                    {activeTab === 'admin' ? (
                      <button
                        onClick={() => setActiveTab('home')}
                        className="px-2.5 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black tracking-wider flex items-center gap-1 cursor-pointer shadow-sm"
                        title="الخروج لتصفح التطبيق مع بقاء صلاحيات المشرف"
                      >
                        <span>تصفح التطبيق 🌐</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('admin')}
                        className="px-2.5 py-0.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider animate-pulse cursor-pointer shadow-sm"
                        title="فتح لوحة المشرف الشاملة"
                      >
                        لوحة الأدمن ⚙️
                      </button>
                    )}
                    <button
                      onClick={() => setIsChatDiagnosticsOpen(true)}
                      className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 text-[10px] font-bold hover:bg-slate-700 flex items-center gap-1 cursor-pointer border border-slate-700"
                      title="فاحص ومراقب الدردشة والاتصال"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span className="hidden sm:inline">فاحص الدردشة</span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold tracking-wide hidden sm:inline">
                {language === 'ar' ? 'منصة الحرفيين والخدمات' : 'Smart Artisans Platform'}
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors relative py-1 text-sm ${
              activeTab === 'home'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.navHome}
            {activeTab === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-1.5 transition-colors relative py-1 text-sm ${
              activeTab === 'radar'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{language === 'ar' ? 'الرادار والربط الحي' : 'Live Radar'}</span>
            {activeTab === 'radar' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 transition-colors relative py-1 text-sm ${
              activeTab === 'orders'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{t.navOrders}</span>
            {activeOrders.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {activeOrders.length}
              </span>
            )}
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center gap-1.5 transition-colors relative py-1 text-sm ${
              activeTab === 'quotes'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.navQuotes}</span>
            {activeTab === 'quotes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 transition-colors relative py-1 text-sm ${
              activeTab === 'chat'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.navMessages}</span>
            {activeTab === 'chat' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-1.5 transition-colors relative py-1 text-sm ${
              activeTab === 'appointments' || activeTab === 'calendar'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="جدول المواعيد والروزنامة"
          >
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>{language === 'ar' ? 'المواعيد' : 'Calendar'}</span>
            {appointments.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                {appointments.length}
              </span>
            )}
            {(activeTab === 'appointments' || activeTab === 'calendar') && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('artisans')}
            className={`flex items-center gap-1.5 transition-colors relative py-1 text-sm ${
              activeTab === 'artisans'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.navArtisans}</span>
            {activeTab === 'artisans' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-1.5 transition-colors relative py-1 text-sm ${
              activeTab === 'jobs'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="سوق العمل والتشغيل - البحث عن عمل والبحث عن عامل"
          >
            <Briefcase className="w-4 h-4 text-amber-500" />
            <span>{language === 'ar' ? 'سوق العمل' : 'Job Market'}</span>
            {activeTab === 'jobs' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`flex items-center gap-1.5 transition-colors relative py-1 text-sm ${
              activeTab === 'partners'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="البحث عن شريك للعمل والورشات والمشاريع"
          >
            <Users className="w-4 h-4 text-amber-500" />
            <span>{language === 'ar' ? 'شريك عمل 🤝' : 'Work Partner'}</span>
            {activeTab === 'partners' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('works')}
            className={`flex items-center gap-1.5 transition-colors relative py-1 text-sm ${
              activeTab === 'works'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t.navWorks}</span>
            {activeTab === 'works' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-1.5 transition-colors relative py-1 text-sm ${
              activeTab === 'pricing'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="قائمة أسعار استرشادية للخدمات الشائعة"
          >
            <span>{language === 'ar' ? 'دليل الأسعار' : 'Price Guide'}</span>
            {activeTab === 'pricing' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('qna')}
            className={`flex items-center gap-1.5 transition-colors relative py-1 text-sm ${
              activeTab === 'qna'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="منتدى استشر حرفياً"
          >
            <span>{language === 'ar' ? 'استشر حرفياً' : 'Artisan Q&A'}</span>
            {activeTab === 'qna' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          {/* Noble Craft Charter Nav Link */}
          <button
            onClick={() => {
              setSelectedCraftForCharter(serviceCategories[0]);
              setIsCraftCharterOpen(true);
            }}
            className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 text-sm font-semibold transition-colors py-1"
            title="ميثاق شرف الحرفة وأخلاقيات العمل"
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>{language === 'ar' ? 'ميثاق الحرفة' : 'Craft Charter'}</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Rate & Review, Auth Login, Role Switcher, Language, Theme) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* AI Initial Diagnostics Quick CTA */}
          <button
            onClick={() => setIsAIDiagnosticModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-sm transition-transform active:scale-95"
            title="تشخيص العطل المبدئي بالذكاء الاصطناعي مع التشفير"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden sm:inline">تشخيص AI للأعطال</span>
            <span className="sm:hidden">تشخيص AI</span>
          </button>

          {/* Contact Us Support Button */}
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="تواصل معنا والدعم الفني"
          >
            <Headphones className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden xl:inline">{language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</span>
          </button>

          {/* Direct Rating & Comment CTA Button */}
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 transition-colors"
            title="تقييم الحرفي وإضافة تعليق"
          >
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{language === 'ar' ? 'تقييم وتعليق' : 'Leave Review'}</span>
          </button>

          {/* Auth State Button */}
          {currentUser && currentUser.isLoggedIn ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
              title="إدارة الحساب"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-amber-500/50"
                referrerPolicy="no-referrer"
              />
              <span className="hidden sm:inline max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-xs"
            >
              {language === 'ar' ? 'دخول / تسجيل' : 'Sign In'}
            </button>
          )}

          {/* In-App PWA Install Prompt for Android/iOS/Desktop */}
          <PWAInstallButton variant="header" />

          {/* Persona / Role Switcher */}
          <button
            onClick={() => setRole(role === 'client' ? 'artisan' : 'client')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 whitespace-nowrap bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800/60"
            title={t.switchRole}
          >
            {role === 'client' ? (
              <>
                <Briefcase className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">{language === 'ar' ? 'حساب الحرفي' : 'Artisan'}</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">{language === 'ar' ? 'حساب العميل' : 'Client'}</span>
              </>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <button
              onClick={() => {
                const nextLang = language === 'ar' ? 'fr' : language === 'fr' ? 'en' : 'ar';
                setLanguage(nextLang);
              }}
              className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase text-[11px] font-mono">{language}</span>
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? t.lightMode : t.darkMode}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
