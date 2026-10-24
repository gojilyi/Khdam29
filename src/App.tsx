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
import { ArtisanProfileModal } from './components/ArtisanProfileModal';

import { BillboardHero } from './components/BillboardHero';
import { SquareSpotlight } from './components/SquareSpotlight';
import { NotificationToast } from './components/NotificationToast';
import { NotificationsModal } from './components/NotificationsModal';
import { AIDiagnosticModal } from './components/AIDiagnosticModal';
import { DiagnosisSheet } from './components/DiagnosisSheet';
import { SmartHomeSearchBar } from './components/SmartHomeSearchBar';
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
    setIsAdminAuthenticated,
    isDiagnosisSheetOpen,
    setIsDiagnosisSheetOpen,
    diagnosisInitialText
  } = useApp();

  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Offline Status & Connectivity Banner */}
      <OfflineIndicator />

      <Header />

      {/* Sticky Admin Floating Status Banner when browsing the application as Admin */}
      {isAdminAuthenticated && activeTab !== 'admin' && (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white border-b-2 border-amber-500 px-3 sm:px-4 py-2.5 z-30 shadow-lg sticky top-16 transition-all w-full max-w-full overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-black text-amber-400 shrink-0">
                  وضع المشرف مفعّل:
                </span>
                <span className="text-slate-300 hidden sm:inline truncate">
                  أنت تتصفح المنصة بصلاحيات الأدمن الكاملة — انقر مرتين على أي نص أو كارت لتعديله فوراً!
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px)+16px)] md:pb-12 min-w-0">
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
                {/* Active Orders Banner alert (Clean, subtle styling) */}
                {activeOrders.length > 0 && (
                  <div className="p-4 bg-[#EEF6F1] border border-[#DDE3DF] rounded-[12px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_1px_2px_rgba(28,36,33,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[8px] bg-[#0F6B3F] text-white flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-[#0F6B3F] flex items-center gap-2">
                          <span>لديك طلبات قيد المتابعة ({activeOrders.length})</span>
                          <span className="w-2 h-2 rounded-full bg-[#1E9B5C]" />
                        </div>
                        <div className="text-[14px] font-semibold text-[#1C2421]">
                          {activeOrder ? `${activeOrder.subServiceName} — ${activeOrder.artisanName || 'جاري التعيين'}` : 'يمكنك متابعة حالة الحرفي الآن'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('orders')}
                      className="self-start sm:self-auto h-10 px-4 bg-[#0F6B3F] hover:bg-[#0A4D2E] text-white rounded-[8px] text-[13px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>متابعة الطلب</span>
                      <ArrowIcon className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                  </div>
                )}

                {/* Main Services, Trades and Nearby Artisans */}
                <ServicesGrid />

                {/* 2-Column Discovery: Benchmark Pricing & Q&A Forum */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Benchmark Pricing Catalog */}
                  <div className="p-5 bg-white border border-[#DDE3DF] rounded-[12px] space-y-3 shadow-[0_1px_2px_rgba(28,36,33,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[8px] bg-[#EEF6F1] text-[#0A4D2E] flex items-center justify-center shrink-0">
                        <DollarSign className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-[#0F6B3F] block">
                          شفافية الأسعار
                        </span>
                        <h3 className="text-[16px] font-bold text-[#1C2421]">
                          دليل الأسعار الاسترشادية
                        </h3>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#5B6660] leading-relaxed">
                      تسعيرة واضحة بالدينار الجزائري (دج) لأشهر المهام والأعطال (تسربات المياه، المكيفات، الأبواب، الكهرباء) لضمان حقك وحق الحرفي.
                    </p>
                    <button
                      onClick={() => setActiveTab('pricing')}
                      className="h-10 px-4 bg-[#EEF6F1] hover:bg-[#DDE3DF] text-[#0A4D2E] font-semibold rounded-[8px] text-[13px] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>تصفح دليل الأسعار المعتمدة</span>
                      <ArrowIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>
                  </div>

                  {/* Card 2: Ask an Artisan Q&A Forum */}
                  <div className="p-5 bg-white border border-[#DDE3DF] rounded-[12px] space-y-3 shadow-[0_1px_2px_rgba(28,36,33,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[8px] bg-[#EEF6F1] text-[#0A4D2E] flex items-center justify-center shrink-0">
                        <HelpCircle className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-[#0F6B3F] block">
                          استشارات مجانية
                        </span>
                        <h3 className="text-[16px] font-bold text-[#1C2421]">
                          استشر حرفياً
                        </h3>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#5B6660] leading-relaxed">
                      اطرح سؤالك أو مشكلتك المنزلية وسيجيبك حرفيون متخصصون في ولايتك بإرشادات فورية ونصائح موثوقة.
                    </p>
                    <button
                      onClick={() => setActiveTab('qna')}
                      className="h-10 px-4 bg-[#EEF6F1] hover:bg-[#DDE3DF] text-[#0A4D2E] font-semibold rounded-[8px] text-[13px] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>طرح استشارة مجانية</span>
                      <ArrowIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>

                {/* Platform Guarantees Section: 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-white rounded-[12px] border border-[#DDE3DF] flex items-start gap-3">
                    <div className="w-9 h-9 rounded-[8px] bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#1C2421]">
                        هويات معتمدة
                      </h4>
                      <p className="text-[12px] text-[#5B6660] mt-0.5">
                        فحص بطاقات الهوية الوطنية والشهادات المهنية لجميع الحرفيين
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-[12px] border border-[#DDE3DF] flex items-start gap-3">
                    <div className="w-9 h-9 rounded-[8px] bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#1C2421]">
                        اتصال ومراسلة آمنة
                      </h4>
                      <p className="text-[12px] text-[#5B6660] mt-0.5">
                        تواصل صوتي ومراسلة فورية لحماية خصوصيتك ومعلوماتك
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-[12px] border border-[#DDE3DF] flex items-start gap-3">
                    <div className="w-9 h-9 rounded-[8px] bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#1C2421]">
                        تقييمات حقيقية
                      </h4>
                      <p className="text-[12px] text-[#5B6660] mt-0.5">
                        تقييمات موثقة من زبائن حقيقيين بعد كل عملية إنجاز
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'radar' && <RadarMap />}
            {activeTab === 'orders' && <ActiveOrderTracker />}
            {activeTab === 'artisans' && <ArtisanDirectory />}
            {activeTab === 'profile' && <ProfileView />}
          </div>
        )}
      </main>

      {/* Google Play Store Compliance Footer (روابط سياسة الخصوصية والدعم المعتمدة لمتجر قوقل بلاي) */}
      <footer className="mt-8 mb-[calc(4.5rem+env(safe-area-inset-bottom,0px)+16px)] md:mb-6 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs py-5 px-4 w-full max-w-full">
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

      {/* Floating Smart Search Bar above BottomNav on Home */}
      <SmartHomeSearchBar />

      {/* Mobile Bottom Navigation with center diagnosis button */}
      <BottomNav />

      {/* Smart AI Diagnosis Bottom Sheet */}
      <DiagnosisSheet 
        isOpen={isDiagnosisSheetOpen} 
        onClose={() => setIsDiagnosisSheetOpen(false)} 
        initialText={diagnosisInitialText} 
      />

      {/* Global Interactive Modals */}
      <AuthModal />
      <CraftCharterCard />
      <VoiceCallModal />
      <ChatModal />
      <OrderFlowModal />
      <ReviewModal />
      <ArtisanProfileModal />
      <ProfessionalCardModal />
      <ArtisanFacebookProfile 
        isOpen={isFacebookProfileOpen}
        onClose={() => setIsFacebookProfileOpen(false)}
        artisan={selectedArtisanForProfile || undefined}
      />
      <NotificationToast />
      <NotificationsModal />
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
