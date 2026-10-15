/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { OfflineIndicator } from './components/OfflineIndicator';
import { BottomNav } from './components/BottomNav';
import { RadarMap } from './components/RadarMap';
import { ServicesGrid } from './components/ServicesGrid';
import { ActiveOrderTracker } from './components/ActiveOrderTracker';
import { QuotesManager } from './components/QuotesManager';
import { ArtisanDirectory } from './components/ArtisanDirectory';
import { ArtisanDashboard } from './components/ArtisanDashboard';
import { ProfileView } from './components/ProfileView';
import { VoiceCallModal } from './components/VoiceCallModal';
import { ChatModal } from './components/ChatModal';
import { OrderFlowModal } from './components/OrderFlowModal';
import { ReviewModal } from './components/ReviewModal';
import { AuthModal } from './components/AuthModal';
import { CraftCharterCard } from './components/CraftCharterCard';
import { ProfessionalCardModal } from './components/ProfessionalCardModal';
import { ArtisanFacebookProfile } from './components/ArtisanFacebookProfile';
import { WorksPortfolio } from './components/WorksPortfolio';
import { AdminPanel } from './components/AdminPanel';

import { BillboardHero } from './components/BillboardHero';
import { SquareSpotlight } from './components/SquareSpotlight';
import { AdBanner } from './components/AdBanner';
import { AdsterraScriptManager } from './components/AdsterraScriptManager';
import { AdsterraAdBanner } from './components/AdsterraAdBanner';
import { InterstitialAdModal } from './components/InterstitialAdModal';
import { NotificationToast } from './components/NotificationToast';
import { AIDiagnosticModal } from './components/AIDiagnosticModal';
import { BenchmarkPricingGuide } from './components/BenchmarkPricingGuide';
import { ArtisanQnAForum } from './components/ArtisanQnAForum';
import { ChatInboxView } from './components/ChatInboxView';
import { WorkerJobMarketplace } from './components/WorkerJobMarketplace';
import { AdminLiveEditorBar } from './components/AdminLiveEditorBar';
import { AdminQuickSwapModal } from './components/AdminQuickSwapModal';
import { AdminChatCallDiagnosticsModal } from './components/AdminChatCallDiagnosticsModal';
import { AdminAddCraftModal } from './components/AdminAddCraftModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ContactUsModal } from './components/ContactUsModal';
import { PlayStoreLegalModal } from './components/PlayStoreLegalModal';
import { WorkPartnerFinder } from './components/WorkPartnerFinder';
import { AppointmentsCalendarView } from './components/AppointmentsCalendarView';
import { BookingAppointmentModal } from './components/BookingAppointmentModal';
import { serviceCategories } from './data/mockData';
import { 
  Calendar,
  Compass, 
  ShieldCheck, 
  Clock, 
  PhoneCall, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Users, 
  Briefcase,
  Star,
  BookOpen,
  Sparkles,
  MessageSquarePlus,
  DollarSign,
  HelpCircle
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    role, 
    activeTab, 
    setActiveTab, 
    activeOrders,
    activeOrder, 
    t, 
    language,
    setIsReviewModalOpen,
    setIsCraftCharterOpen,
    setSelectedCraftForCharter,
    isFacebookProfileOpen,
    setIsFacebookProfileOpen,
    selectedArtisanForProfile,
    setIsAIDiagnosticModalOpen,
    setIsContactModalOpen,
    setIsLegalModalOpen,
    setLegalModalTab,
    setIsBookingAppointmentModalOpen,
    homePanelsConfig,
    isAdminAuthenticated,
    setIsAdminAuthenticated
  } = useApp();

  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Offline Status & Connectivity Banner */}
      <OfflineIndicator />

      <Header />

      {/* Sticky Admin Floating Status Banner when browsing the application as Admin */}
      {isAdminAuthenticated && activeTab !== 'admin' && (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white border-b-2 border-amber-500 px-4 py-2.5 z-30 shadow-lg sticky top-16 transition-all">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div className="flex items-center gap-1.5">
                <span className="font-black text-amber-400">
                  وضع المشرف مفعّل:
                </span>
                <span className="text-slate-300 hidden sm:inline">
                  أنت تتصفح المنصة بصلاحيات الأدمن الكاملة — انقر مرتين على أي نص أو كارت لتعديله فوراً!
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('admin')}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <span>العودة للوحة الإدارة ⚙️</span>
              </button>

              <button
                onClick={() => setActiveTab('partners')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                  activeTab === 'partners' 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <span>شريك عمل 🤝</span>
              </button>

              <button
                onClick={() => {
                  setIsAdminAuthenticated(false);
                  sessionStorage.removeItem('khodam_admin_auth');
                }}
                className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                title="تسجيل الخروج من الأدمن"
              >
                <span>خروج 🔒</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {/* If Admin view is active */}
        {activeTab === 'admin' ? (
          <AdminPanel />
        ) : activeTab === 'partners' ? (
          <WorkPartnerFinder />
        ) : activeTab === 'chat' ? (
          <ChatInboxView />
        ) : activeTab === 'jobs' ? (
          <WorkerJobMarketplace />
        ) : activeTab === 'pricing' ? (
          <BenchmarkPricingGuide />
        ) : activeTab === 'qna' ? (
          <ArtisanQnAForum />
        ) : activeTab === 'works' ? (
          <WorksPortfolio />
        ) : activeTab === 'quotes' ? (
          <QuotesManager />
        ) : (activeTab === 'appointments' || activeTab === 'calendar') ? (
          <AppointmentsCalendarView />
        ) : role === 'artisan' && activeTab === 'home' ? (
          <div className="space-y-6">
            <ArtisanDashboard />
          </div>
        ) : role === 'artisan' && activeTab === 'artisans' ? (
          <ArtisanDirectory />
        ) : (
          /* Client Mode Tabs */
          <div>
            {activeTab === 'home' && (
              <div className="space-y-8">
                {/* Hero Billboard (Controlled by Admin: Images / Video / Custom Text) */}
                <BillboardHero />

                {/* Sponsored Ad Banner (Start.io & AdMob) */}
                <AdBanner position="top" />

                {/* Adsterra Publishers Top Banner */}
                <AdsterraAdBanner format="top" />

                {/* Hero Section with Warm Master Craftsman Visual */}
                <div className="relative rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white p-6 sm:p-9 overflow-hidden shadow-xl border border-amber-900/40">
                  {/* Background craftsman photography with ambient blend */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none"
                    style={{ backgroundImage: `url('/src/assets/images/khodam_hero_craftsman_1791156490478.jpg')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

                  <div className="relative z-10 max-w-2xl space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-bold text-amber-300 backdrop-blur-md">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>{t.appTagline}</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                      {language === 'ar' 
                        ? 'حرفيون معتمدون وأيادٍ أمينة تصل إلى بابك في دقائق' 
                        : 'Certified artisans and trusted hands at your door in minutes'}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                      {language === 'ar'
                        ? 'منصة خدمية تجمع بين إتقان العمل وأمانة التعامل، بربط جغرافي فوري، ومكالمات مشفرة بدون كشف رقم هاتفك، وبطاقة ميثاق إسلامي وأخلاقي لكل مهنة.'
                        : 'A platform combining true craftsmanship, instant proximity matching, and encrypted private calls.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('radar')}
                        className="h-11 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
                      >
                        <Compass className="w-4 h-4 text-white" />
                        <span>{language === 'ar' ? 'تشغيل رادار البحث الجغرافي الحي' : 'Live Proximity Radar'}</span>
                        <ArrowIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setIsAIDiagnosticModalOpen(true)}
                        className="h-11 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>تشخيص العطل بالصورة (AI)</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCraftForCharter(serviceCategories[0]);
                          setIsCraftCharterOpen(true);
                        }}
                        className="h-11 px-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-amber-200 border border-amber-400/30 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span>{language === 'ar' ? 'ميثاق الحرفة والآية القرآنية' : 'Craft Charter & Ethic'}</span>
                      </button>

                      <button
                        onClick={() => setIsReviewModalOpen(true)}
                        className="h-11 px-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                      >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{language === 'ar' ? 'تقييم وتعليق' : 'Write Review'}</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('works')}
                        className="h-11 px-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-amber-200 border border-amber-400/30 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>{language === 'ar' ? 'معرض الأعمال والمشاريع' : 'Works Showcase'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Breakdown Diagnostics Banner Card (التشخيص المبدئي بالذكاء الاصطناعي مع التشفير) */}
                <div className="relative rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white p-5 sm:p-7 shadow-xl overflow-hidden border border-amber-400/40">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-start gap-4 max-w-2xl">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                        <Sparkles className="w-7 h-7 text-white animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30 backdrop-blur-xs flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>تشفير 256-bit وحماية ضد الاختراق</span>
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-2xl font-black mt-1">
                          التشخيص المبدئي بالذكاء الاصطناعي للأعطال المنزلية
                        </h2>
                        <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed mt-1">
                          ارفع صورة العطل (ماسورة مكسورة، جهاز كهربائي مفتوح، تسريب مياه، قاطع كهربائي متضرر) وسيقوم التطبيق بتحليل العطل فوراً واقتراح نوع الحرفي المطلوب تلقائياً مع إرشادات السلامة العاجلة.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setIsAIDiagnosticModalOpen(true)}
                        className="px-5 py-3.5 bg-white text-slate-950 hover:bg-amber-50 font-black rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-black/15 transition-transform active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>تشخيص العطل بالصورة الآن</span>
                        <ArrowIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Work Partner & Business Partnerships Finder Banner Card */}
                <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-5 sm:p-7 shadow-xl overflow-hidden border border-amber-500/30">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-start gap-4 max-w-2xl">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 font-black">
                        <Users className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                            <span>جديد • شبكة الشراكات المهنية</span>
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-2xl font-black mt-1">
                          البحث عن شريك للعمل والورشات والمشاريع 🤝
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                          هل تبحث عن شريك لفتح ورشة، تقاسم تكاليف الإيجار والمعدات، أو تنفيذ مقاولة كبرى؟ 
                          تصفح عروض الشراكة في ولايتك، انشر طلبك بالصور، وتفاعل بالقلوب والتعليقات المفتوحة!
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setActiveTab('partners')}
                        className="px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-transform active:scale-95 cursor-pointer"
                      >
                        <Users className="w-4 h-4" />
                        <span>دخول قسم الشراكات الآن</span>
                        <ArrowIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calendar & Appointment Booking Banner Card (نظام حجز وتأكيد المواعيد عبر الروزنامة) */}
                <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-5 sm:p-7 shadow-xl overflow-hidden border border-emerald-500/30">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-start gap-4 max-w-2xl">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25 font-black">
                        <Calendar className="w-7 h-7 text-slate-950" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            <span>جديد • حجز مؤكد وموثق</span>
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-2xl font-black mt-1">
                          نظام حجز وتأكيد المواعيد عبر الروزنامة 📅
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                          احجز موعداً محدداً (باليوم والساعة) لمعاينة العطل أو تنفيذ الأشغال في منزلك. يستلم الحرفي إشعاراً فورياً لتأكيد الزيارة وتثبيتها في الأجندة بدون تأخير أو انتظار.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => setIsBookingAppointmentModalOpen(true)}
                        className="px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>حجز موعد جديد الآن</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('appointments')}
                        className="px-4 py-3.5 bg-white/10 hover:bg-white/20 text-emerald-200 border border-emerald-400/30 font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>عرض جدول الروزنامة</span>
                        <ArrowIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Noble Quranic Work Ethic Banner Card */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 dark:from-amber-950/30 dark:via-slate-900 dark:to-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                        <span>ميثاق شرف العمل وإتقان الصنعة في خدام</span>
                      </div>
                      <p className="text-base sm:text-lg font-serif font-bold text-slate-900 dark:text-white mt-1">
                        ﴿ وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ وَرَسُولُهُ وَالْمُؤْمِنُونَ ﴾
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        «إِنَّ اللَّهَ تَعَالَى يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ» — نلزم كافة الحرفيين بالأمانة وحرمة المنازل وإتقان العمل.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedCraftForCharter(serviceCategories[0]);
                        setIsCraftCharterOpen(true);
                      }}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                    >
                      <span>عرض بطاقة الميثاق الكاملة</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Active Orders Banner alert */}
                {activeOrders.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-transparent border border-amber-300 dark:border-amber-700/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 animate-spin-slow" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide flex items-center gap-2">
                          <span>طلباتك النشطة ({activeOrders.length})</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block" />
                        </div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {activeOrder ? `${activeOrder.subServiceName} — ${activeOrder.artisanName || 'جاري التعيين'}` : 'لديك طلبات قيد المتابعة والتنفيذ'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('orders')}
                      className="self-start sm:self-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                    >
                      <span>{language === 'ar' ? `متابعة الطلبات (${activeOrders.length})` : 'Track Active Jobs'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* 5cm x 5cm Video or Image Spotlight (Controlled by Admin) */}
                <SquareSpotlight />

                {/* Services Catalog with Real Photography */}
                <ServicesGrid />

                {/* Adsterra Native Banner Widget */}
                <AdsterraAdBanner format="native" />

                {/* 2-Column Discovery: Benchmark Pricing & Q&A Forum */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Benchmark Pricing Catalog (قائمة أسعار استرشادية) */}
                  <div className="p-6 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300 dark:border-amber-700/60 rounded-3xl space-y-3 relative overflow-hidden group">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md shadow-amber-500/20">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                          شفافية الأسعار ومنع المساومة
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          قائمة أسعار استرشادية للخدمات الشائعة
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      تسعيرة تقريبية وثابتة مدروسة للخدمات البسيطة والشائعة (تركيب وصيانة مكيف، تغيير قفل باب، تسليك بالوعات، تركيب سخان) لتجنب المبالغة وضمان حق الطرفين.
                    </p>
                    <button
                      onClick={() => setActiveTab('pricing')}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>تصفح دليل الأسعار المعتمدة</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 2: Ask an Artisan Q&A Forum (قسم استشر حرفياً) */}
                  <div className="p-6 bg-gradient-to-br from-blue-500/10 via-indigo-400/5 to-transparent border border-blue-200 dark:border-blue-800/60 rounded-3xl space-y-3 relative overflow-hidden group">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shrink-0 shadow-md shadow-blue-500/20">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
                          استشارات مهنية مجانية وموثوقة
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          منتدى "استشر حرفياً" (Q&A)
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      اطرح مشكلتك واستفسارك البسيط (مثلاً: كيف أتعامل مع تسرب مؤقت؟ ما سبب صدور صوت من المكيف؟) ويجيبك الحرفيون المتخصصون مجاناً لبناء الثقة وتسهيل توظيفهم.
                    </p>
                    <button
                      onClick={() => setActiveTab('qna')}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                    >
                      <MessageSquarePlus className="w-4 h-4" />
                      <span>دخول منتدى الاستشارات وطرح سؤال</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Platform Guarantees Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {language === 'ar' ? 'شارات توثيق معتمدة' : 'Verified Credentials'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {language === 'ar' ? 'فحص بطاقات الهوية والشهادات المهنية لجميع الحرفيين' : 'ID and vocational certificate verification'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {language === 'ar' ? 'اتصال آمن بدون كشف الرقم' : 'Private Masked Calls'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {language === 'ar' ? 'تواصل صوتي ومراسلة فورية مشفرة لحماية خصوصيتك' : 'VoIP in-app audio calls with private numbers'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {t.singleOrderPolicyTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {language === 'ar' ? 'التركيز على إتمام كل خدمة بأعلى جودة ورضا' : 'Quality-first single task flow'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'radar' && <RadarMap />}
            {activeTab === 'orders' && <ActiveOrderTracker />}
            {activeTab === 'quotes' && <QuotesManager />}
            {activeTab === 'artisans' && <ArtisanDirectory />}
            {activeTab === 'works' && <WorksPortfolio />}
            {activeTab === 'chat' && <ChatInboxView />}
            {activeTab === 'jobs' && <WorkerJobMarketplace />}
            {activeTab === 'profile' && <ProfileView />}
            {activeTab === 'pricing' && <BenchmarkPricingGuide />}
            {activeTab === 'qna' && <ArtisanQnAForum />}
            {(activeTab === 'appointments' || activeTab === 'calendar') && <AppointmentsCalendarView />}
          </div>
        )}
      </main>

      {/* Google Play Store Compliance Footer (روابط سياسة الخصوصية والدعم المعتمدة لمتجر قوقل بلاي) */}
      <footer className="mt-8 mb-20 md:mb-6 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {language === 'ar' ? 'منصة خدّام © 2026 — متوافق مع معايير متجر Google Play وأمان البيانات' : 'Khodam © 2026 — Google Play Data Safety Compliant'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            <button
              onClick={() => {
                setLegalModalTab('privacy');
                setIsLegalModalOpen(true);
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => {
                setLegalModalTab('terms');
                setIsLegalModalOpen(true);
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="hover:text-amber-600 dark:hover:text-amber-400 font-bold text-amber-600 dark:text-amber-400 transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => {
                setLegalModalTab('deletion');
                setIsLegalModalOpen(true);
              }}
              className="hover:text-rose-500 text-slate-400 dark:text-slate-500 transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'حذف الحساب' : 'Account Deletion'}
            </button>
          </div>
        </div>
      </footer>

      {/* Bottom Ad Banner (Start.io & AdMob) */}
      <AdBanner position="bottom" />

      {/* Adsterra Publishers Bottom Banner */}
      <AdsterraAdBanner format="bottom" />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Adsterra Global Script Manager (Social Bar & Popunder) */}
      <AdsterraScriptManager />


      {/* Global Interactive Modals */}
      <AuthModal />
      <CraftCharterCard />
      <VoiceCallModal />
      <ChatModal />
      <OrderFlowModal />
      <ReviewModal />
      <ProfessionalCardModal />
      <ArtisanFacebookProfile 
        isOpen={isFacebookProfileOpen}
        onClose={() => setIsFacebookProfileOpen(false)}
        artisan={selectedArtisanForProfile || undefined}
      />
      <InterstitialAdModal />
      <NotificationToast />
      <AIDiagnosticModal />
      <ContactUsModal />
      <PlayStoreLegalModal />
      <BookingAppointmentModal />

      {/* Admin Visual Live Editing & Diagnostics System */}
      <AdminLiveEditorBar />
      <AdminQuickSwapModal />
      <AdminChatCallDiagnosticsModal />
      <AdminAddCraftModal />
      <AdminAuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
