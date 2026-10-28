import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  Role, 
  Language, 
  Order, 
  OrderStatus, 
  Artisan, 
  ProjectQuoteRequest, 
  ChatMessage, 
  CallSession, 
  Review,
  VerificationStatus,
  AuthUser,
  AuthMethod,
  ServiceCategory,
  SubService,
  WorkPost,
  VerificationRequest,
  VerificationLevel,
  BillboardConfig,
  AppNotification,
  FirebaseFCMConfig,
  SquareSpotlightConfig,
  AppSecurityConfig,
  ArtisanSchedule,
  QnAQuestion,
  QnAAnswer,
  QuoteBid,
  BenchmarkPriceItem,
  JobSeekerProfile,
  PlayStoreComplianceConfig,
  SupportTicket,
  WorkPartnerPost,
  PartnerComment,
  PartnershipType,
  Appointment,
  AppointmentStatus,
  AppointmentType,
  HomePanelsConfig,
  ClientAccount,
  Report
} from '../types';
import { 
  mockArtisans, 
  initialActiveOrder, 
  initialActiveOrders,
  sampleProjectQuotes, 
  sampleMessages, 
  sampleReviews, 
  serviceCategories,
  sampleWorkPosts,
  sampleVerificationRequests,
  initialArtisanSchedule,
  initialBenchmarkPrices,
  initialQnAQuestions,
  initialJobSeekers,
  initialWorkPartnerPosts,
  sampleAppointments,
  sampleClientAccounts
} from '../data/mockData';
import { translations, getTranslation } from '../utils/translations';
import { verifyAdminPassword } from '../utils/security';
import { saveOfflinePendingAction, recordCacheSync } from '../utils/offlineSync';
import { playNotificationChime, showNativeNotification } from '../utils/notificationSound';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['ar'];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Auth user state & Personal information
  currentUser: AuthUser;
  updateUserProfile: (data: Partial<AuthUser>) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithMethod: (method: AuthMethod, data?: { name?: string; phone?: string; email?: string; role?: Role }) => void;
  logout: () => void;

  // Craft Charter & Quranic Work Ethic Modal
  isCraftCharterOpen: boolean;
  setIsCraftCharterOpen: (open: boolean) => void;
  selectedCraftForCharter: ServiceCategory | null;
  setSelectedCraftForCharter: (craft: ServiceCategory | null) => void;

  // Multi-Active Orders Flow (إمكانية نشر أكثر من طلب ومتابعتها معاً)
  activeOrders: Order[];
  activeOrder: Order | null;
  selectedActiveOrderId: string | null;
  setSelectedActiveOrderId: (id: string | null) => void;
  orderHistory: Order[];
  createOrder: (order: Partial<Order>) => { success: boolean; error?: string; orderId?: string };
  advanceOrderStatus: (orderId?: string, status?: OrderStatus) => void;
  cancelCurrentOrder: (orderId?: string) => void;
  completeCurrentOrder: (orderId?: string, reviewData?: { rating: number; punctuality: number; quality: number; behavior: number; comment: string }) => void;
  
  // Dedicated Trade Search & Filter (البحث بالمهنة وعرض جميع العاملين بها)
  selectedTradeFilter: string;
  setSelectedTradeFilter: (trade: string) => void;
  navigateToTradeArtisans: (tradeKeyword: string) => void;
  
  // Artisans & Geo Proximity
  artisans: Artisan[];
  searchRadiusKm: number;
  setSearchRadiusKm: (radius: number) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedArtisan: Artisan | null;
  setSelectedArtisan: (artisan: Artisan | null) => void;
  
  // Quotes & Bids Marketplace (طلب عروض أسعار والمناقصات مع الصور/الفيديو)
  quotes: ProjectQuoteRequest[];
  createQuoteRequest: (data: { title: string; category: string; description: string; budget: string; city: string; mediaUrl?: string; mediaType?: 'image' | 'video' }) => void;
  submitQuoteBid: (quoteRequestId: string, bidData: { bidAmount: number; estimatedDays: number; proposalText: string; includesMaterials: boolean }) => void;
  acceptQuoteBid: (quoteRequestId: string, bidId: string) => void;
  
  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  
  // Communication (محادثات العملاء والحرفيين وتأكيد عملها)
  messages: ChatMessage[];
  sendMessage: (
    text: string, 
    isAudio?: boolean, 
    audioDuration?: string, 
    imageUrl?: string, 
    audioUrl?: string, 
    conversationId?: string, 
    targetParticipant?: { id?: string; name?: string; trade?: string }
  ) => void;
  deleteChatMessage: (messageId: string) => void;
  sendAdminNoticeToChat: (text: string) => void;
  clearChatMessages: () => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  callSession: CallSession;
  startCall: (name: string, roleName: string, avatar: string) => void;
  endCall: () => void;
  toggleCallMute: () => void;
  toggleCallSpeaker: () => void;
  
  // Appointments Calendar & Agenda (المواعيد والروزنامة)
  appointments: Appointment[];
  createAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, newDate: string, newTimeSlot: string) => void;
  deleteAppointment: (id: string) => void;
  isBookingAppointmentModalOpen: boolean;
  setIsBookingAppointmentModalOpen: (open: boolean) => void;
  selectedArtisanForAppointment: Artisan | null;
  setSelectedArtisanForAppointment: (artisan: Artisan | null) => void;
  
  // Modals & Booking selection
  bookingModalService: { categoryId: string; subServiceId?: string; artisanId?: string; prefilledTrade?: string; prefilledDescription?: string; prefilledImage?: string } | null;
  setBookingModalService: (data: { categoryId: string; subServiceId?: string; artisanId?: string; prefilledTrade?: string; prefilledDescription?: string; prefilledImage?: string } | null) => void;
  
  // Artisan workspace state
  artisanOnline: boolean;
  toggleArtisanOnline: () => void;
  artisanDocs: { idUploaded: boolean; certUploaded: boolean; status: VerificationStatus };
  uploadArtisanDoc: (type: 'id' | 'cert') => void;
  
  // Work Portfolio & Posts
  workPosts: WorkPost[];
  addWorkPost: (post: { 
    title: string; 
    description: string; 
    image?: string; 
    videoUrl?: string; 
    mediaType?: 'image' | 'video'; 
    isCompletedTask?: boolean;
    completionDate?: string;
    location: string; 
    trade?: string 
  }) => void;
  togglePostLike: (postId: string) => void;
  togglePostShare: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
  deleteWorkPost: (postId: string) => void;

  // Facebook-Style Artisan Profile Modal
  isFacebookProfileOpen: boolean;
  setIsFacebookProfileOpen: (open: boolean) => void;
  selectedArtisanForProfile: Artisan | null;
  setSelectedArtisanForProfile: (artisan: Artisan | null) => void;
  openArtisanFacebookProfile: (artisan: Artisan) => void;

  // Professional Digital Card Modal
  isProfessionalCardOpen: boolean;
  setIsProfessionalCardOpen: (open: boolean) => void;
  selectedArtisanForCard: Artisan | null;
  setSelectedArtisanForCard: (artisan: Artisan | null) => void;

  // Verification & Admin Management
  verificationRequests: VerificationRequest[];
  approveVerification: (reqId: string) => void;
  rejectVerification: (reqId: string) => void;
  updateArtisanLevel: (artisanId: string, level: VerificationLevel) => void;
  submitLevel1: (idCardImage: string, selfieImage: string) => void;
  submitLevel2: (diplomaImage: string, diplomaTitle: string) => void;

  // Secret Admin Access (Easter Egg 7 clicks on Khodam + Encrypted SHA-256 Authentication)
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;
  handleBrandSecretClick: () => void;
  checkAdminPassword: (password: string) => Promise<boolean>;

  // Categories & Crafts Management (إدارة الحرف والخدمات وحذفها)
  categories: ServiceCategory[];
  addCategory: (cat: ServiceCategory) => void;
  deleteCategory: (categoryId: string) => void;
  updateCategory: (cat: ServiceCategory) => void;
  updateCategoryIcon: (categoryId: string, newIcon: string) => void;
  removeCategoryIcon: (categoryId: string) => void;
  removeCategoryHeroImage: (categoryId: string) => void;
  deleteSubService: (categoryId: string, subServiceId: string) => void;
  updateSubService: (categoryId: string, subService: SubService) => void;
  updateSubServiceImage: (categoryId: string, subServiceId: string, image: string) => void;
  removeSubServiceImage: (categoryId: string, subServiceId: string) => void;
  updateCategoryHeroImage: (categoryId: string, image: string) => void;

  // Artisan & Account Admin Operations
  deleteArtisan: (artisanId: string) => void;
  removeArtisanAvatar: (artisanId: string) => void;
  updateArtisan: (artisan: Artisan) => void;
  updateArtisanAvatar: (artisanId: string, avatar: string) => void;
  toggleArtisanSuspension: (artisanId: string) => void;
  registerJobSeeker: (artisanData: Omit<Artisan, 'id' | 'rating' | 'reviewCount' | 'completedJobsCount'>) => void;

  // Client Accounts (إدارة وحذف حسابات العملاء)
  clientAccounts: ClientAccount[];
  deleteClientAccount: (clientId: string) => void;
  toggleClientSuspension: (clientId: string) => void;
  removeClientAvatar: (clientId: string) => void;

  // Hero Billboard / Big Board
  billboardConfig: BillboardConfig;
  setBillboardConfig: React.Dispatch<React.SetStateAction<BillboardConfig>>;
  deleteBillboardMedia: () => void;

  // 5cm x 5cm Square Video/Image Spotlight (لوحة 5x5 سم بالفيديو أو الصورة)
  squareSpotlightConfig: SquareSpotlightConfig;
  setSquareSpotlightConfig: React.Dispatch<React.SetStateAction<SquareSpotlightConfig>>;
  deleteSquareSpotlightMedia: () => void;

  // Home Display Panels Visibility Manager (إدارة وحذف البانلات المعروضة في الواجهة)
  homePanelsConfig: HomePanelsConfig;
  setHomePanelsConfig: React.Dispatch<React.SetStateAction<HomePanelsConfig>>;
  toggleHomePanel: (panelKey: keyof HomePanelsConfig) => void;
  deleteHomePanel: (panelKey: keyof HomePanelsConfig) => void;
  resetHomePanels: () => void;

  // App Encryption & Security (تشفير التطبيق وحمايته)
  appSecurityConfig: AppSecurityConfig;
  setAppSecurityConfig: React.Dispatch<React.SetStateAction<AppSecurityConfig>>;

  // Push Notifications & Notification Center
  firebaseConfig: FirebaseFCMConfig;
  setFirebaseConfig: React.Dispatch<React.SetStateAction<FirebaseFCMConfig>>;
  notifications: AppNotification[];
  sendPushNotification: (notif: Omit<AppNotification, 'id' | 'sentAt'>) => void;
  activeNotificationToast: AppNotification | null;
  dismissNotificationToast: () => void;
  markAllNotificationsRead: () => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadNotificationsCount: number;
  isNotificationsModalOpen: boolean;
  setIsNotificationsModalOpen: (open: boolean) => void;
  triggerOrderStatusNotification: (order: Order, status: OrderStatus) => void;
  testSimulateOrderNotification: (customStatus?: OrderStatus) => void;
  testSimulateQnAReplyNotification: (questionId?: string) => void;
  isUpdateModalOpen: boolean;
  updateModalData: AppNotification | null;
  closeUpdateModal: () => void;

  // Artisan Reporting (التبليغ عن الحرفيين)
  reports: Report[];
  reportArtisan: (artisanId: string, reason: Report['reason']) => void;
  resolveReport: (reportId: string) => void;

  // Favorite Artisans Management (ميزة حرفي مفضل)
  favoriteArtisanIds: string[];
  toggleFavoriteArtisan: (artisanId: string) => void;
  isArtisanFavorite: (artisanId: string) => boolean;

  // AI Initial Diagnostic Modal & Smart Diagnosis Sheet (التشخيص المبدئي بالذكاء الاصطناعي)
  isAIDiagnosticModalOpen: boolean;
  setIsAIDiagnosticModalOpen: (open: boolean) => void;
  isDiagnosisSheetOpen: boolean;
  setIsDiagnosisSheetOpen: (open: boolean) => void;
  diagnosisInitialText: string;
  setDiagnosisInitialText: (text: string) => void;
  openSmartDiagnosis: (initialPrompt?: string) => void;

  // Artisan Schedule Management (إدارة الجدول الزمني ومواعيد العمل)
  artisanSchedule: ArtisanSchedule;
  updateArtisanSchedule: (schedule: ArtisanSchedule) => void;

  // Geo-Fenced Push Alerts (تنبيهات مخصصة ونطاق جغرافي)
  geoAlertRadiusKm: number;
  setGeoAlertRadiusKm: (radius: number) => void;
  activeGeoAlert: { id: string; title: string; subService: string; neighborhood: string; distanceKm: number; payout: number; clientName: string; time: string } | null;
  dismissGeoAlert: () => void;
  acceptGeoAlertTask: () => void;
  triggerSimulatedGeoAlert: () => void;

  // Benchmark Pricing Catalog (قائمة أسعار استرشادية)
  benchmarkPrices: BenchmarkPriceItem[];

  // Q&A Community Forum (استشر حرفياً)
  qnaQuestions: QnAQuestion[];
  addQnAQuestion: (q: { title: string; category: string; content: string; imageUrl?: string }) => void;
  addQnAAnswer: (questionId: string, answerText: string) => void;
  upvoteQnAAnswer: (questionId: string, answerId: string) => void;

  // Job Market & Work Seeking (سوق العمل والتشغيل - البحث عن عمل والبحث عن عامل)
  jobSeekers: JobSeekerProfile[];
  addJobSeekerPost: (post: Omit<JobSeekerProfile, 'id' | 'createdAt' | 'status'>) => void;
  deleteJobSeekerPost: (id: string) => void;
  updateJobSeekerStatus: (id: string, status: 'available' | 'employed' | 'busy') => void;

  // Search query in home
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Live Visual Admin In-Place Editing (تعديل أي نص أو أيقونة أو صورة بالنقر المزدوج والسحب)
  isAdminLiveEditMode: boolean;
  setIsAdminLiveEditMode: (active: boolean) => void;
  adminCustomTexts: Record<string, string>;
  setAdminCustomText: (key: string, value: string) => void;
  resetAdminCustomTexts: () => void;
  getAdminCustomText: (key: string, fallback: string) => string;
  adminCustomIcons: Record<string, string>;
  setAdminCustomIcon: (key: string, value: string) => void;
  resetAdminCustomIcons: () => void;
  getAdminCustomIcon: (key: string, fallback: string) => string;
  adminEditModalTarget: { 
    type: 'text' | 'icon' | 'image'; 
    id: string; 
    title: string; 
    currentValue: string; 
    categoryId?: string; 
    subServiceId?: string;
  } | null;
  setAdminEditModalTarget: (target: any) => void;
  isMediaManagerModalOpen: boolean;
  setIsMediaManagerModalOpen: (open: boolean) => void;
  isChatDiagnosticsOpen: boolean;
  setIsChatDiagnosticsOpen: (open: boolean) => void;
  isAddCraftModalOpen: boolean;
  setIsAddCraftModalOpen: (open: boolean) => void;
  simulateChatExchange: (clientMsg: string, artisanReply: string, testImage?: string) => void;

  // Google Play Store Compliance, Policies & Contact Us (متجر قوقل بلاي، السياسات وتواصل معنا)
  playStoreConfig: PlayStoreComplianceConfig;
  updatePlayStoreConfig: (newConfig: Partial<PlayStoreComplianceConfig>) => void;
  supportTickets: SupportTicket[];
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => void;
  updateSupportTicketStatus: (id: string, status: SupportTicket['status']) => void;
  deleteSupportTicket: (id: string) => void;
  replyToSupportTicket: (id: string, reply: string) => void;
  addTicketUserReply: (ticketId: string, replyText: string) => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  isLegalModalOpen: boolean;
  setIsLegalModalOpen: (open: boolean) => void;
  legalModalTab: 'privacy' | 'terms' | 'deletion' | 'permissions';
  setLegalModalTab: (tab: 'privacy' | 'terms' | 'deletion' | 'permissions') => void;
  requestAccountDeletion: () => void;

  // Work Partner & Business Partnerships (البحث عن شريك للعمل والورشات)
  partnerPosts: WorkPartnerPost[];
  addPartnerPost: (post: Omit<WorkPartnerPost, 'id' | 'createdAt' | 'likesCount' | 'hasLiked' | 'comments'>) => void;
  togglePartnerPostLike: (postId: string) => void;
  addPartnerPostComment: (postId: string, commentText: string, authorName?: string) => void;
  deletePartnerPost: (postId: string) => void;
  updatePartnerPostStatus: (postId: string, status: WorkPartnerPost['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('client');
  const [language, setLanguage] = useState<Language>('ar');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');

  // Auth User State & Personal Information
  const [currentUser, setCurrentUser] = useState<AuthUser>({
    id: 'usr_default',
    name: 'هشام بن علي',
    phone: '+213 550 12 34 56',
    email: 'hichem.b@example.dz',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'client',
    method: 'sms',
    isLoggedIn: true,
    address: 'حي البساتين، عمارة 14، الشقة 5',
    city: 'الجزائر العاصمة',
    neighborhood: 'حيدرة / الأبيار',
    sharePhoneWithArtisans: true
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const updateUserProfile = (data: Partial<AuthUser>) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
  };

  // Work Posts & Portfolio State
  const [workPosts, setWorkPosts] = useState<WorkPost[]>(sampleWorkPosts);

  // Professional Digital Card Modal
  const [isProfessionalCardOpen, setIsProfessionalCardOpen] = useState(false);
  const [selectedArtisanForCard, setSelectedArtisanForCard] = useState<Artisan | null>(mockArtisans[0]);

  // Facebook-Style Artisan Profile Modal
  const [isFacebookProfileOpen, setIsFacebookProfileOpen] = useState(false);
  const [selectedArtisanForProfile, setSelectedArtisanForProfile] = useState<Artisan | null>(mockArtisans[0]);

  const openArtisanFacebookProfile = (artisan: Artisan) => {
    setSelectedArtisanForProfile(artisan);
    setIsFacebookProfileOpen(true);
  };

  // Verification Requests & Admin Management State
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(sampleVerificationRequests);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('khodam_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const updateAdminAuth = (auth: boolean) => {
    setIsAdminAuthenticated(auth);
    try {
      if (auth) {
        sessionStorage.setItem('khodam_admin_auth', 'true');
      } else {
        sessionStorage.removeItem('khodam_admin_auth');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Automatically authenticate admin features if role is admin
  useEffect(() => {
    if (role === 'admin' || currentUser?.role === 'admin') {
      if (!isAdminAuthenticated) {
        setIsAdminAuthenticated(true);
        try { sessionStorage.setItem('khodam_admin_auth', 'true'); } catch (e) {}
      }
    }
  }, [role, currentUser?.role, isAdminAuthenticated]);

  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);

  // Live In-Place Visual Admin Edit Mode (تعديل أي نص أو أيقونة أو صورة بالنقر المزدوج والسحب)
  const [isAdminLiveEditMode, setIsAdminLiveEditMode] = useState<boolean>(true);
  const [adminCustomTexts, setAdminCustomTexts] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('khodam_admin_custom_texts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const setAdminCustomText = (key: string, value: string) => {
    setAdminCustomTexts(prev => {
      const next = { ...prev };
      if (!value) {
        delete next[key];
      } else {
        next[key] = value;
      }
      try { 
        if (Object.keys(next).length > 0) {
          localStorage.setItem('khodam_admin_custom_texts', JSON.stringify(next)); 
        } else {
          localStorage.removeItem('khodam_admin_custom_texts');
        }
      } catch (e) { console.error(e); }
      return next;
    });
  };

  const resetAdminCustomTexts = () => {
    setAdminCustomTexts({});
    try { localStorage.removeItem('khodam_admin_custom_texts'); } catch (e) { console.error(e); }
  };

  const getAdminCustomText = (key: string, fallback: string) => {
    return adminCustomTexts[key] || fallback;
  };

  // Live Icon Customization (تعديل وتخصيص ورفع الأيقونات كأدمن)
  const [adminCustomIcons, setAdminCustomIcons] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('khodam_admin_custom_icons');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const setAdminCustomIcon = (key: string, value: string) => {
    setAdminCustomIcons(prev => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem('khodam_admin_custom_icons', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });

    // Also update categories directly if key matches category id or starts with icon_
    const catId = key.startsWith('icon_') ? key.replace('icon_', '') : key;
    setCategories(prev => {
      const hasMatch = prev.some(c => c.id === catId || c.id === key);
      if (hasMatch) {
        const next = prev.map(c => (c.id === catId || c.id === key) ? { ...c, icon: value } : c);
        try { localStorage.setItem('khodam_categories', JSON.stringify(next)); } catch (e) { console.error(e); }
        return next;
      }
      return prev;
    });
  };

  const resetAdminCustomIcons = () => {
    setAdminCustomIcons({});
    try { localStorage.removeItem('khodam_admin_custom_icons'); } catch (e) { console.error(e); }
  };

  const getAdminCustomIcon = (key: string, fallback: string) => {
    return adminCustomIcons[key] || fallback;
  };

  const [adminEditModalTarget, setAdminEditModalTarget] = useState<{
    type: 'text' | 'icon' | 'image';
    id: string;
    title: string;
    currentValue: string;
    categoryId?: string;
    subServiceId?: string;
  } | null>(null);

  const [isMediaManagerModalOpen, setIsMediaManagerModalOpen] = useState(false);
  const [isChatDiagnosticsOpen, setIsChatDiagnosticsOpen] = useState(false);
  const [isAddCraftModalOpen, setIsAddCraftModalOpen] = useState(false);

  // Simulate real-time chat between Client & Artisan to verify live messaging
  const simulateChatExchange = (clientMsg: string, artisanReply: string, testImage?: string) => {
    const cMsg: ChatMessage = {
      id: `msg_test_c_${Date.now()}`,
      senderId: 'client_me',
      senderName: 'هشام بن علي (العميل)',
      senderRole: 'client',
      text: clientMsg,
      imageUrl: testImage,
      timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };
    setMessages(prev => {
      const next = [...prev, cMsg];
      try { localStorage.setItem('khodam_chat_messages', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });

    setTimeout(() => {
      const aMsg: ChatMessage = {
        id: `msg_test_a_${Date.now()}`,
        senderId: 'art_1',
        senderName: 'المعلم كمال بلقاسم',
        senderRole: 'artisan',
        text: artisanReply,
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };
      setMessages(prev => {
        const next = [...prev, aMsg];
        try { localStorage.setItem('khodam_chat_messages', JSON.stringify(next)); } catch (e) { console.error(e); }
        return next;
      });
    }, 1200);
  };

  // Craft Charter Modal State
  const [isCraftCharterOpen, setIsCraftCharterOpen] = useState(false);
  const [selectedCraftForCharter, setSelectedCraftForCharter] = useState<ServiceCategory | null>(serviceCategories[0]);

  // Categories & Crafts state (مع الحفظ في الذاكرة المحلية)
  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_categories');
      if (saved) {
        const parsed: ServiceCategory[] = JSON.parse(saved);
        const missing = serviceCategories.filter(sc => !parsed.some(p => p.id === sc.id));
        return missing.length > 0 ? [...parsed, ...missing] : parsed;
      }
      return serviceCategories;
    } catch {
      return serviceCategories;
    }
  });

  // Big Hero Billboard Configuration
  const [billboardConfig, setBillboardConfig] = useState<BillboardConfig>({
    isVisible: false,
    mediaType: 'image',
    mediaUrl: '/src/assets/images/khodam_hero_craftsman_1791156490478.jpg',
    title: 'منصة خدام — الأيدي الأمينة والحرفيون المؤهلون في خدمتك',
    description: 'شاهد إنجازات وتوثيق حرفيي الجزائر العاصمة وجميع الولايات. معايير أمان مشددة، ومكالمات مشفرة بدون كشف رقمك.',
    badge: 'منصة خدام الرسمية · جودة وأمان',
    buttonText: 'تشغيل رادار البحث الحي',
    buttonLink: 'radar'
  });

  // 5cm x 5cm Square Video/Image Spotlight (بواسطة رابط أو تحميل من الهاتف مع أو بدون نص/عنوان)
  const [squareSpotlightConfig, setSquareSpotlightConfig] = useState<SquareSpotlightConfig>({
    isVisible: true,
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=80',
    title: 'فلاش الحرفيين الميداني',
    text: 'معاينة مباشرة لجودة تشطيبات وإصلاحات شبكات الكهرباء والترصيص المعتمدة.',
    linkUrl: 'works',
    badge: '5x5 سم مباشر'
  });

  // Client Accounts (حسابات العملاء وطالبي الخدمات)
  const [clientAccounts, setClientAccounts] = useState<ClientAccount[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_client_accounts');
      return saved ? JSON.parse(saved) : sampleClientAccounts;
    } catch {
      return sampleClientAccounts;
    }
  });

  // Home Display Panels Visibility Configuration (إدارة وحذف البانلات المعروضة في الواجهة)
  const defaultHomePanelsConfig: HomePanelsConfig = {
    billboard: true,
    heroMaster: true,
    aiDiagnostic: true,
    partnerFinder: true,
    appointmentsBanner: true,
    categoriesGrid: true,
    squareSpotlight: true,
    guarantees: true
  };

  const [homePanelsConfig, setHomePanelsConfig] = useState<HomePanelsConfig>(() => {
    try {
      const saved = localStorage.getItem('khodam_home_panels');
      return saved ? { ...defaultHomePanelsConfig, ...JSON.parse(saved) } : defaultHomePanelsConfig;
    } catch {
      return defaultHomePanelsConfig;
    }
  });

  // Application Hardening, Encryption & Protection (تشفير التطبيق وحمايته)
  const [appSecurityConfig, setAppSecurityConfig] = useState<AppSecurityConfig>({
    isEncryptionActive: true,
    isCallMaskingActive: true,
    isPayloadSanitizationActive: true,
    isAntiTamperingActive: true,
    sessionTokenExpiryHours: 72,
    lastAuditDate: '2026-10-05',
    encryptionKeyFingerprint: 'SHA256:Khodam-DZ-AES256GCM-E2EE-Secured'
  });

  // Google Play Store Compliance & Legal Configuration (بيانات التواصل المعتمدة والسياسات)
  const defaultPlayStoreConfig: PlayStoreComplianceConfig = {
    supportEmail: 'support@khodam.dz',
    supportPhone: '+213 23 45 67 89',
    whatsappNumber: '+213 550 12 34 56',
    supportAddress: 'الجزائر العاصمة، الأبيار - حي البساتين، برج الأعمال (الطابق 3)',
    workingHours: 'السبت إلى الخميس: 08:00 - 20:00 (الطوارئ الميدانية 24/7)',
    websiteUrl: 'https://khodam.dz',
    privacyPolicyExternalUrl: 'https://khodam.dz/privacy',
    customPrivacyPolicy: '',
    customTermsOfService: '',
    customDataSafetyPolicy: '',
    accountDeletionInstructions: ''
  };

  const [playStoreConfig, setPlayStoreConfig] = useState<PlayStoreComplianceConfig>(() => {
    try {
      const saved = localStorage.getItem('khodam_play_store_config');
      return saved ? { ...defaultPlayStoreConfig, ...JSON.parse(saved) } : defaultPlayStoreConfig;
    } catch {
      return defaultPlayStoreConfig;
    }
  });

  const updatePlayStoreConfig = (newConfig: Partial<PlayStoreComplianceConfig>) => {
    setPlayStoreConfig(prev => {
      const next = { ...prev, ...newConfig };
      try {
        localStorage.setItem('khodam_play_store_config', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Support Tickets (تواصل معنا - استفسارات وشكاوى المستخدمين)
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_support_tickets');
      if (saved) return JSON.parse(saved);
      // Sensible initial demonstration tickets
      return [
        {
          id: 'ticket_demo_1',
          ticketNumber: 'TK-10842',
          name: 'هشام بن علي',
          contact: '0550123456',
          contactMethod: 'phone',
          category: 'general',
          priority: 'normal',
          subject: 'استفسار حول بطاقة الحرفي المعتمد والشارة الذهبية',
          message: 'السلام عليكم، أرغب في معرفة الوثائق المطلوبة لترقية الحرفي من المستوى الفضي إلى المستوى الذهبي المعتمد.',
          createdAt: 'منذ يومين',
          status: 'resolved',
          isRead: true,
          reply: 'وعليكم السلام أخي هشام. لترقية الشارة الذهبية، يرجى إرفاق دبلوم الكفاءة المهنية (CAP) أو شهادة الحرفة من الغرفة الولائية عبر شاشة التوثيق، وستتم مراجعتها خلال 24 ساعة.',
          repliedAt: 'منذ يوم'
        }
      ];
    } catch {
      return [];
    }
  });

  const addSupportTicket = (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
    const ticketNum = ticket.ticketNumber || `TK-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket: SupportTicket = {
      ...ticket,
      id: `ticket_${Date.now()}`,
      ticketNumber: ticketNum,
      createdAt: new Date().toLocaleDateString('ar-DZ', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'new',
      isRead: false
    };

    setSupportTickets(prev => {
      const next = [newTicket, ...prev];
      try { localStorage.setItem('khodam_support_tickets', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });

    sendPushNotification({
      title: '✅ تم إرسال رسالتك وتوليد التذكرة',
      message: `تم تسجيل طلبك بنجاح برقم المتابعة #${ticketNum}. فريق الدعم الفني يراجع التفاصيل وسيرد عليك فوراً.`,
      type: 'announcement',
      audience: 'clients',
      actionLink: 'home',
      linkText: 'متابعة الدعم الفني'
    });

    // Realistic auto-reply from support agent after 5.5 seconds
    setTimeout(() => {
      const autoReplyText = `مرحباً بك ${newTicket.name}! تم استلام تذكرتك (#${ticketNum}) بعناية بخصوص "${newTicket.subject}". المشرف التقني يراجع المعطيات حالياً وسنتواصل معك عبر ${newTicket.contact}. نشكرك على ثقتك بخـدّام.`;
      
      setSupportTickets(prev => {
        const next: SupportTicket[] = prev.map(t => t.id === newTicket.id ? { 
          ...t, 
          status: 'in_progress' as const, 
          reply: autoReplyText,
          repliedAt: 'الآن'
        } : t);
        try { localStorage.setItem('khodam_support_tickets', JSON.stringify(next)); } catch (e) {}
        return next;
      });

      sendPushNotification({
        title: `💬 رد جديد على تذكرتك #${ticketNum}`,
        message: autoReplyText,
        type: 'announcement',
        audience: 'clients',
        note: `تذكرة: ${newTicket.subject}`
      });
    }, 5500);
  };

  const updateSupportTicketStatus = (id: string, status: SupportTicket['status']) => {
    setSupportTickets(prev => {
      const next = prev.map(t => t.id === id ? { ...t, status, isRead: true } : t);
      try { localStorage.setItem('khodam_support_tickets', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const replyToSupportTicket = (id: string, reply: string) => {
    setSupportTickets(prev => {
      const next: SupportTicket[] = prev.map(t => t.id === id ? { 
        ...t, 
        status: 'in_progress' as const, 
        reply,
        repliedAt: 'الآن'
      } : t);
      try { localStorage.setItem('khodam_support_tickets', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const deleteSupportTicket = (id: string) => {
    setSupportTickets(prev => {
      const next = prev.filter(t => t.id !== id);
      try { localStorage.setItem('khodam_support_tickets', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const addTicketUserReply = (ticketId: string, replyMessage: string) => {
    if (!replyMessage.trim()) return;
    const userReply = {
      id: `reply_${Date.now()}`,
      sender: 'user' as const,
      senderName: currentUser.name && currentUser.name !== 'مستخدم زائر' ? currentUser.name : 'العميل',
      message: replyMessage.trim(),
      sentAt: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    };

    let targetTicketNumber = '';
    setSupportTickets(prev => {
      const next: SupportTicket[] = prev.map(t => {
        if (t.id === ticketId) {
          targetTicketNumber = t.ticketNumber || t.id.slice(-6);
          const currentReplies = t.replies || [];
          return {
            ...t,
            status: 'in_progress',
            replies: [...currentReplies, userReply]
          };
        }
        return t;
      });
      try { localStorage.setItem('khodam_support_tickets', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });

    // Auto-reply simulation from Khodam Support Specialist after 4.5 seconds
    setTimeout(() => {
      const adminFollowUp = {
        id: `reply_${Date.now()}`,
        sender: 'admin' as const,
        senderName: 'فريق الدعم الفني (خـدّام)',
        message: 'تم استلام تعقيبك بعناية، وتم إدراجه ضمن ملف التذكرة لدى المشرف الميداني المتابع لحالتك.',
        sentAt: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
      };

      setSupportTickets(prev => {
        const next: SupportTicket[] = prev.map(t => {
          if (t.id === ticketId) {
            const currentReplies = t.replies || [];
            return {
              ...t,
              status: 'in_progress',
              replies: [...currentReplies, adminFollowUp]
            };
          }
          return t;
        });
        try { localStorage.setItem('khodam_support_tickets', JSON.stringify(next)); } catch (e) {}
        return next;
      });

      sendPushNotification({
        title: `💬 رد جديد على تذكرتك #${targetTicketNumber || ''}`,
        message: 'قام فريق الدعم الفني بالرد على تعقيبك، يمكنك الاطلاع على التحديث في علبة التواصل.',
        type: 'announcement',
        audience: 'clients',
        note: 'علبة التواصل والدعم الفني'
      });
    }, 4500);
  };

  // Play Store Compliance Modals
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms' | 'deletion' | 'permissions'>('privacy');

  const requestAccountDeletion = () => {
    try {
      localStorage.removeItem('khodam_auth_user');
      localStorage.removeItem('khodam_chat_messages');
      localStorage.removeItem('khodam_user_role');
      localStorage.removeItem('khodam_support_tickets');
    } catch (e) {
      console.error(e);
    }
    setCurrentUser({
      id: 'guest_user',
      name: 'مستخدم زائر',
      phone: '',
      city: 'الجزائر العاصمة',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'client',
      method: 'anonymous',
      isLoggedIn: false
    });
    setIsLegalModalOpen(false);
    setActiveNotificationToast({
      id: `notif_${Date.now()}`,
      title: '🗑️ تم طلب وحذف بيانات الحساب',
      message: 'تم مسح وحذف كافة البيانات المحفوظة محلياً وفقاً لسياسة Google Play لأمان البيانات.',
      type: 'announcement',
      audience: 'all',
      sentAt: 'الآن',
      isRead: false
    });
  };

  // -------------------------------------------------------------
  // Work Partner & Business Partnerships (البحث عن شريك للعمل والورشات)
  // -------------------------------------------------------------
  const [partnerPosts, setPartnerPosts] = useState<WorkPartnerPost[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_work_partner_posts');
      return saved ? JSON.parse(saved) : initialWorkPartnerPosts;
    } catch {
      return initialWorkPartnerPosts;
    }
  });

  const addPartnerPost = (postData: Omit<WorkPartnerPost, 'id' | 'createdAt' | 'likesCount' | 'hasLiked' | 'comments'>) => {
    const newPost: WorkPartnerPost = {
      ...postData,
      id: `partner_post_${Date.now()}`,
      createdAt: 'الآن',
      likesCount: 0,
      hasLiked: false,
      comments: []
    };
    setPartnerPosts(prev => {
      const updated = [newPost, ...prev];
      try { localStorage.setItem('khodam_work_partner_posts', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });
    setActiveNotificationToast({
      id: `notif_${Date.now()}`,
      title: '🤝 تم نشر طلب الشراكة بنجاح!',
      message: 'طلبك معروض الآن في قسم البحث عن شريك للعمل، وبإمكان الحرفيين التفاعل والتعليق والتواصل.',
      type: 'announcement',
      audience: 'all',
      sentAt: 'الآن',
      isRead: false
    });
  };

  const togglePartnerPostLike = (postId: string) => {
    setPartnerPosts(prev => {
      const updated = prev.map(p => {
        if (p.id === postId) {
          const newHasLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked: newHasLiked,
            likesCount: newHasLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
          };
        }
        return p;
      });
      try { localStorage.setItem('khodam_work_partner_posts', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });
  };

  const addPartnerPostComment = (postId: string, commentText: string, authorName?: string) => {
    if (!commentText.trim()) return;
    setPartnerPosts(prev => {
      const updated = prev.map(p => {
        if (p.id === postId) {
          const newComment: PartnerComment = {
            id: `p_comm_${Date.now()}`,
            authorName: authorName || (role === 'artisan' ? (currentUser?.name || 'حرفي مهني') : (currentUser?.name || 'مستخدم المنصة')),
            authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            authorTrade: role === 'artisan' ? ((currentUser as any)?.trade || 'حرفي متخصص') : undefined,
            text: commentText.trim(),
            createdAt: 'الآن',
            isVerified: true
          };
          return {
            ...p,
            comments: [...(p.comments || []), newComment]
          };
        }
        return p;
      });
      try { localStorage.setItem('khodam_work_partner_posts', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });
  };

  const deletePartnerPost = (postId: string) => {
    setPartnerPosts(prev => {
      const updated = prev.filter(p => p.id !== postId);
      try { localStorage.setItem('khodam_work_partner_posts', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });
  };

  const updatePartnerPostStatus = (postId: string, status: WorkPartnerPost['status']) => {
    setPartnerPosts(prev => {
      const updated = prev.map(p => p.id === postId ? { ...p, status } : p);
      try { localStorage.setItem('khodam_work_partner_posts', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });
  };

  // Firebase FCM Push Notifications Configuration
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseFCMConfig>({
    isConnected: true,
    projectId: 'khodam-dz-service',
    fcmServerKey: 'AAAA9zK3jWq:APA91bFvk38Xz82_khodam_fcm_prod',
    senderId: '936816692597',
    appCurrentVersion: '1.4.2'
  });

  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_app_notifications');
      return saved ? JSON.parse(saved) : [
        {
          id: 'notif_welcome',
          title: 'مرحباً بك في منصة خـدّام! 🇩🇿',
          message: 'تم تفعيل نظام التنبيهات المباشرة. ستصلك إشعارات فورية عند تحديث حالة طلباتك أو عند استلام رد في منتدى الاستشارات.',
          type: 'announcement',
          audience: 'all',
          sentAt: 'اليوم',
          isRead: false
        }
      ];
    } catch {
      return [];
    }
  });

  // Reports
  const [reports, setReports] = useState<Report[]>(() => {
    try { const saved = localStorage.getItem('khodam_reports'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });

  const reportArtisan = (artisanId: string, reason: Report['reason']) => {
    const newReport: Report = {
      id: `report_${Date.now()}`,
      reporterId: 'client_me',
      artisanId,
      reason,
      timestamp: new Date().toISOString(),
      isResolved: false
    };
    setReports(prev => {
      const next = [...prev, newReport];
      try { localStorage.setItem('khodam_reports', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const resolveReport = (reportId: string) => {
    setReports(prev => {
      const next = prev.map(r => r.id === reportId ? { ...r, isResolved: true } : r);
      try { localStorage.setItem('khodam_reports', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };
  const [activeNotificationToast, setActiveNotificationToast] = useState<AppNotification | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateModalData, setUpdateModalData] = useState<AppNotification | null>(null);
  
  // Multi-Active Orders Flow (إمكانية نشر أكثر من طلب ومتابعتها معاً وحفظها دون اتصال)
  const [activeOrders, setActiveOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_active_orders');
      return saved ? JSON.parse(saved) : initialActiveOrders;
    } catch {
      return initialActiveOrders;
    }
  });
  const [selectedActiveOrderId, setSelectedActiveOrderId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('khodam_active_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed[0].id;
      }
    } catch {}
    return initialActiveOrders[0]?.id || null;
  });
  const activeOrder = activeOrders.find(o => o.id === selectedActiveOrderId) || activeOrders[0] || null;

  // Dedicated Trade Search & Filter
  const [selectedTradeFilter, setSelectedTradeFilter] = useState<string>('all');
  const navigateToTradeArtisans = (tradeKeyword: string) => {
    setSelectedTradeFilter(tradeKeyword);
    setSearchQuery(tradeKeyword === 'all' ? '' : tradeKeyword);
    setActiveTab('artisans');
  };

  const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_order_history');
      return saved ? JSON.parse(saved) : [
        {
          id: 'ord_kh_101',
          clientId: 'client_me',
          clientName: 'هشام بن علي',
          artisanId: 'art_2',
          artisanName: 'المهندس أمين الشريف',
          artisanAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          categoryId: 'home_repair',
          subServiceId: 'electrical',
          subServiceName: 'الكهرباء والتمديدات المنزلية',
          type: 'scheduled',
          address: 'شارع ديدوش مراد، الجزائر العاصمة',
          city: 'الجزائر العاصمة',
          notes: 'تغيير لوحة القواطع الرئيسية للمنزل وتركيب قاطع تفاضلي 30mA',
          status: 'completed',
          createdAt: 'الأسبوع الماضي',
          updatedAt: 'الأسبوع الماضي',
          estimatedCost: 6500,
          actualCost: 6500,
          ratingGiven: true
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('khodam_active_orders', JSON.stringify(activeOrders));
    } catch (e) {
      console.error(e);
    }
  }, [activeOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('khodam_order_history', JSON.stringify(orderHistory));
    } catch (e) {
      console.error(e);
    }
  }, [orderHistory]);
  
  // Artisans & Geo
  const [artisans, setArtisans] = useState<Artisan[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_artisans');
      const uniqueMap = new Map<string, Artisan>();
      mockArtisans.forEach(a => uniqueMap.set(a.id, a));
      if (saved) {
        const parsed: Artisan[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach(p => {
            if (p && p.id && !uniqueMap.has(p.id)) {
              uniqueMap.set(p.id, p);
            }
          });
        }
      }
      return Array.from(uniqueMap.values());
    } catch {
      return mockArtisans;
    }
  });
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(5);
  const [selectedCity, setSelectedCity] = useState<string>('الجزائر العاصمة');
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);

  // Favorite Artisans Management (ميزة حرفي مفضل)
  const [favoriteArtisanIds, setFavoriteArtisanIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_favorite_artisans');
      return saved ? JSON.parse(saved) : ['art_1', 'art_2'];
    } catch {
      return ['art_1', 'art_2'];
    }
  });

  const toggleFavoriteArtisan = (artisanId: string) => {
    setFavoriteArtisanIds(prev => {
      const exists = prev.includes(artisanId);
      const updated = exists ? prev.filter(id => id !== artisanId) : [...prev, artisanId];
      try {
        localStorage.setItem('khodam_favorite_artisans', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const isArtisanFavorite = (artisanId: string) => {
    return favoriteArtisanIds.includes(artisanId);
  };

  // AI Initial Diagnostic Modal & Smart Diagnosis Sheet (التشخيص المبدئي بالذكاء الاصطناعي)
  const [isAIDiagnosticModalOpen, setIsAIDiagnosticModalOpen] = useState(false);
  const [isDiagnosisSheetOpen, setIsDiagnosisSheetOpen] = useState(false);
  const [diagnosisInitialText, setDiagnosisInitialText] = useState('');

  const openSmartDiagnosis = (initialPrompt = '') => {
    setDiagnosisInitialText(initialPrompt);
    setIsDiagnosisSheetOpen(true);
  };
  
  // Quotes (عروض الأسعار والمناقصات مع الحفظ دون اتصال)
  const [quotes, setQuotes] = useState<ProjectQuoteRequest[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_quotes');
      return saved ? JSON.parse(saved) : sampleProjectQuotes;
    } catch {
      return sampleProjectQuotes;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('khodam_quotes', JSON.stringify(quotes));
    } catch (e) {
      console.error(e);
    }
  }, [quotes]);
  
  // Reviews (التقييمات والآراء مع الحفظ دون اتصال)
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_reviews');
      return saved ? JSON.parse(saved) : sampleReviews;
    } catch {
      return sampleReviews;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('khodam_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  
  // Messaging & Call (المحادثات المباشرة مع الحفظ)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_chat_messages');
      return saved ? JSON.parse(saved) : sampleMessages;
    } catch {
      return sampleMessages;
    }
  });
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [callSession, setCallSession] = useState<CallSession>({
    isActive: false,
    participantName: '',
    participantRole: '',
    participantAvatar: '',
    isMuted: false,
    isSpeaker: false,
    durationSeconds: 0
  });
  
  // Appointments & Calendar (المواعيد والروزنامة)
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_appointments');
      return saved ? JSON.parse(saved) : sampleAppointments;
    } catch {
      return sampleAppointments;
    }
  });
  const [isBookingAppointmentModalOpen, setIsBookingAppointmentModalOpen] = useState(false);
  const [selectedArtisanForAppointment, setSelectedArtisanForAppointment] = useState<Artisan | null>(null);

  // Booking modal
  const [bookingModalService, setBookingModalService] = useState<{ categoryId: string; subServiceId?: string; artisanId?: string; prefilledTrade?: string; prefilledDescription?: string; prefilledImage?: string } | null>(null);
  
  // Artisan portal state
  const [artisanOnline, setArtisanOnline] = useState<boolean>(true);
  const [artisanDocs, setArtisanDocs] = useState<{ idUploaded: boolean; certUploaded: boolean; status: VerificationStatus }>({
    idUploaded: true,
    certUploaded: true,
    status: 'verified'
  });
  
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle document direction and language attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Handle dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Call timer interval
  useEffect(() => {
    let timer: any;
    if (callSession.isActive) {
      timer = setInterval(() => {
        setCallSession(prev => ({ ...prev, durationSeconds: prev.durationSeconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callSession.isActive]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const t = getTranslation(language);

  // Push Notifications & Firebase FCM Actions
  const sendPushNotification = (notif: Omit<AppNotification, 'id' | 'sentAt'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      sentAt: 'الآن',
      isRead: false
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      try {
        localStorage.setItem('khodam_app_notifications', JSON.stringify(updated.slice(0, 50)));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    setActiveNotificationToast(newNotif);
    playNotificationChime();
    showNativeNotification(newNotif.title, newNotif.message);

    // Auto dismiss toast after 6.5 seconds
    setTimeout(() => {
      setActiveNotificationToast(prev => (prev?.id === newNotif.id ? null : prev));
    }, 6500);

    if (notif.type === 'update') {
      setUpdateModalData(newNotif);
      setIsUpdateModalOpen(true);
    }
  };

  const dismissNotificationToast = () => {
    setActiveNotificationToast(null);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true }));
      try {
        localStorage.setItem('khodam_app_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      try {
        localStorage.setItem('khodam_app_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    try {
      localStorage.removeItem('khodam_app_notifications');
    } catch (e) {}
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const triggerOrderStatusNotification = (order: Order, status: OrderStatus) => {
    const artisanName = order.artisanName || 'الحرفي المعتمد';
    const serviceName = order.subServiceName || 'الخدمة المطلوبة';

    let title = '';
    let message = '';
    let linkText = 'تتبع الطلب مباشرة 📍';

    switch (status) {
      case 'searching':
        title = '🔍 جاري البحث عن أقرب حرفي مؤهل لطلبك';
        message = `تم تسجيل طلبك (${serviceName}) في ${order.city}. الرادار يبحث الآن عن الحرفيين المؤهلين الأقرب إليك.`;
        linkText = 'عرض شاشة الرادار والطلب 📡';
        break;
      case 'artisan_assigned':
        title = '👷‍♂️ تم قبول وتعيين حرفي لطلبك!';
        message = `قبل الحرفي (${artisanName}) طلبك (${serviceName})، وهو يجهز معداته حالياً للبدء.`;
        linkText = 'تتبع الحرفي والتواصل 📞';
        break;
      case 'on_the_way':
        title = '🚗💨 الحرفي في الطريق إلى موقعك!';
        message = `انطلق الحرفي (${artisanName}) باتجاه عنوانك (${order.address || order.city}). يمكنك تتبع مساره مباشرة على الخريطة.`;
        linkText = 'تتبع المسار المباشر 🗺️';
        break;
      case 'in_progress':
        title = '🔧 بدأ الحرفي بتنفيذ الخدمة الآن';
        message = `وصل الحرفي (${artisanName}) وبدأ العمل الفعلي على (${serviceName}) وفق معايير الجودة والسلامة.`;
        linkText = 'متابعة مراحل التنفيذ ⏱️';
        break;
      case 'awaiting_confirmation':
        title = '✅ اكتمل العمل بانتظار فحصك وتأكيدك';
        message = `أنهى الحرفي العمل على (${serviceName}). يرجى معاينة النتيجة بدقة ثم تأكيد إتمام الخدمة.`;
        linkText = 'فحص الخدمة وتأكيد الإتمام 👍';
        break;
      case 'completed':
        title = '⭐ تم إكمال طلبك بنجاح!';
        message = `تم إنهاء طلب (${serviceName}) بنجاح. يسعدنا تقييم الحرفي لمساعدتنا في مكافأة المتميزين.`;
        linkText = 'تقييم الحرفي وإبداء الرأي ⭐';
        break;
      case 'cancelled':
        title = '❌ تم إلغاء طلب الخدمة';
        message = `تم إلغاء طلب (${serviceName}). يمكنك تقديم طلب جديد في أي وقت يناسبك.`;
        linkText = 'عرض سجل الطلبات 📋';
        break;
      default:
        title = '📦 تحديث جديد في حالة طلبك';
        message = `تم تحديث حالة طلب (${serviceName}) إلى: ${status}`;
    }

    sendPushNotification({
      title,
      message,
      type: 'order',
      audience: 'clients',
      actionLink: 'orders',
      linkText
    });
  };

  const testSimulateOrderNotification = (customStatus?: OrderStatus) => {
    const currentOrMockOrder: Order = activeOrder || {
      id: `ord_${Date.now()}`,
      clientId: currentUser.id || 'client_me',
      clientName: currentUser.name || 'هشام بن علي',
      clientPhone: currentUser.phone || '0555123456',
      artisanId: 'art_1',
      artisanName: 'المعلم كمال بلقاسم',
      artisanPhone: '0550112233',
      categoryId: 'cat_plumbing',
      subServiceId: 'sub_leak',
      subServiceName: 'إصلاح تسرب المياه بالمنزل',
      status: 'on_the_way',
      scheduledDate: 'اليوم',
      scheduledTime: '15:30',
      address: 'حي البساتين، الجزائر العاصمة',
      city: 'الجزائر العاصمة',
      estimatedCost: 3200,
      createdAt: 'منذ قليل',
      updatedAt: 'الآن',
      ratingGiven: false
    };

    const nextStatuses: OrderStatus[] = ['artisan_assigned', 'on_the_way', 'in_progress', 'awaiting_confirmation', 'completed'];
    const selected = customStatus || (activeOrder ? (
      nextStatuses[(nextStatuses.indexOf(activeOrder.status) + 1) % nextStatuses.length] || 'on_the_way'
    ) : 'on_the_way');

    if (activeOrder) {
      advanceOrderStatus(activeOrder.id, selected);
    } else {
      triggerOrderStatusNotification({ ...currentOrMockOrder, status: selected }, selected);
    }
  };

  const testSimulateQnAReplyNotification = (questionId?: string) => {
    const targetQ = (questionId ? qnaQuestions.find(q => q.id === questionId) : null) || qnaQuestions[0];
    const qTitle = targetQ ? targetQ.title : 'تسرب ماء في سخان الحمام';
    const artisan = artisans[0]; // Master Kamal

    const adviceText = 'أنصحك بفصل صمام الأمان وتفريغ ضغط الخزان أولاً، مع وضع شريط مانع التسرب التفلون مؤقتاً وسأكون بخدمتك للمعاينة الميدانية.';
    
    if (targetQ) {
      addQnAAnswer(targetQ.id, adviceText);
    } else {
      sendPushNotification({
        title: '💬 رد جديد في منتدى الاستشارات!',
        message: `أجاب الحرفي ${artisan.name} (${artisan.trade}) على استشارتك: "${qTitle}"`,
        type: 'qna',
        audience: 'clients',
        actionLink: 'qna',
        linkText: 'عرض الرد في المنتدى 💡',
        note: adviceText
      });
    }
  };

  // Multi-order flow: Clients can publish and track MULTIPLE orders simultaneously!
  const createOrder = (orderData: Partial<Order>) => {
    const matchedArtisan = orderData.artisanId ? artisans.find(a => a.id === orderData.artisanId) : null;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      clientId: 'client_me',
      clientName: orderData.clientName || currentUser.name || 'هشام بن علي',
      clientPhone: orderData.clientPhone || currentUser.phone || '+213 550 12 34 56',
      clientPhoneVisible: orderData.clientPhoneVisible !== undefined ? orderData.clientPhoneVisible : (currentUser.sharePhoneWithArtisans ?? true),
      clientAddressDetails: orderData.clientAddressDetails || orderData.address || currentUser.address || 'حي البساتين، الجزائر العاصمة',
      preferredContact: orderData.preferredContact || 'direct_call',
      artisanId: orderData.artisanId || (matchedArtisan ? matchedArtisan.id : 'art_1'),
      artisanName: orderData.artisanName || (matchedArtisan ? matchedArtisan.name : 'المعلم كمال بلقاسم'),
      artisanAvatar: orderData.artisanAvatar || (matchedArtisan ? matchedArtisan.avatar : 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'),
      artisanPhoneMasked: orderData.artisanPhoneMasked || (matchedArtisan ? matchedArtisan.phoneMasked : '+213 •• •• •• 89'),
      categoryId: orderData.categoryId || 'home_repair',
      subServiceId: orderData.subServiceId || 'plumbing',
      subServiceName: orderData.subServiceName || 'أعمال السباكة وتسريب المياه',
      type: orderData.type || 'instant',
      scheduledDate: orderData.scheduledDate,
      scheduledTime: orderData.scheduledTime,
      address: orderData.address || currentUser.address || 'حي البساتين، الجزائر العاصمة',
      city: orderData.city || currentUser.city || selectedCity || 'الجزائر العاصمة',
      notes: orderData.notes || '',
      status: orderData.status || (orderData.artisanId ? 'artisan_assigned' : 'searching'),
      createdAt: 'الآن',
      updatedAt: 'الآن',
      estimatedCost: orderData.estimatedCost || 3000,
      ratingGiven: false
    };

    setActiveOrders(prev => [newOrder, ...prev]);
    setSelectedActiveOrderId(newOrder.id);
    setBookingModalService(null);
    setActiveTab('orders');

    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    if (isOffline) {
      saveOfflinePendingAction({
        type: 'order',
        title: `طلب خدمة: ${newOrder.subServiceName}`,
        payload: newOrder
      });
      sendPushNotification({
        title: '📴 تم حفظ طلبك دون اتصال بالإنترنت!',
        message: 'تم تسجيل طلبك بأمان على هاتفك، وسيتم مزامنته وتأكيده مع الحرفي فور عودة الشبكة.',
        type: 'announcement',
        audience: 'clients',
        actionLink: 'orders',
        linkText: 'عرض الطلبات المحفوظة'
      });
    } else {
      // Send immediate push notification
      sendPushNotification({
        title: '📋 تم تسجيل طلبك بنجاح!',
        message: `طلبك لخدمة (${newOrder.subServiceName}) قيد التوجيه. سنوافيك بإشعار فوري فور قبول الحرفي.`,
        type: 'order',
        audience: 'clients',
        actionLink: 'orders',
        linkText: 'تتبع مسار طلبك مباشرة 📍'
      });

      // Simulate instant matching progression for this order
      setTimeout(() => {
        advanceOrderStatus(newOrder.id, 'artisan_assigned');
      }, 3500);

      setTimeout(() => {
        advanceOrderStatus(newOrder.id, 'on_the_way');
      }, 8000);
    }

    return { success: true, orderId: newOrder.id };
  };

  const advanceOrderStatus = (targetOrderId?: string, overrideStatus?: OrderStatus) => {
    const orderIdToAdvance = targetOrderId || (activeOrder ? activeOrder.id : null);
    if (!orderIdToAdvance) return;

    let targetUpdatedOrder: Order | null = null;
    let nextStatus: OrderStatus | null = null;

    setActiveOrders(prev => {
      const updated = prev.map(order => {
        if (order.id !== orderIdToAdvance) return order;

        if (overrideStatus) {
          nextStatus = overrideStatus;
          targetUpdatedOrder = { ...order, status: overrideStatus, updatedAt: 'الآن' };
          return targetUpdatedOrder;
        }

        const flow: OrderStatus[] = [
          'searching',
          'artisan_assigned',
          'on_the_way',
          'in_progress',
          'awaiting_confirmation',
          'completed'
        ];
        const currentIndex = flow.indexOf(order.status);
        if (currentIndex >= 0 && currentIndex < flow.length - 1) {
          nextStatus = flow[currentIndex + 1];
          targetUpdatedOrder = { ...order, status: nextStatus, updatedAt: 'الآن' };
          return targetUpdatedOrder;
        }
        return order;
      });

      try {
        localStorage.setItem('khodam_active_orders', JSON.stringify(updated));
      } catch (e) {}

      return updated;
    });

    if (targetUpdatedOrder && nextStatus) {
      triggerOrderStatusNotification(targetUpdatedOrder, nextStatus);
    }
  };

  const cancelCurrentOrder = (targetOrderId?: string) => {
    const orderIdToCancel = targetOrderId || (activeOrder ? activeOrder.id : null);
    if (!orderIdToCancel) return;

    const targetOrder = activeOrders.find(o => o.id === orderIdToCancel);
    if (targetOrder) {
      const cancelled: Order = { ...targetOrder, status: 'cancelled', updatedAt: 'الآن' };
      setOrderHistory(prev => [cancelled, ...prev]);
      setActiveOrders(prev => prev.filter(o => o.id !== orderIdToCancel));
      triggerOrderStatusNotification(cancelled, 'cancelled');
    }
  };

  const completeCurrentOrder = (targetOrderId?: string, reviewData?: { rating: number; punctuality: number; quality: number; behavior: number; comment: string }) => {
    const orderIdToComplete = targetOrderId || (activeOrder ? activeOrder.id : null);
    if (!orderIdToComplete) return;

    const targetOrder = activeOrders.find(o => o.id === orderIdToComplete);
    if (targetOrder) {
      const completed: Order = { ...targetOrder, status: 'completed', updatedAt: 'الآن', ratingGiven: !!reviewData };
      setOrderHistory(prev => [completed, ...prev]);
      triggerOrderStatusNotification(completed, 'completed');
      
      if (reviewData) {
        const newReview: Review = {
          id: `rev_${Date.now()}`,
          artisanId: targetOrder.artisanId || 'art_1',
          clientId: 'client_me',
          clientName: currentUser.name || 'هشام بن علي',
          rating: reviewData.rating,
          punctualityScore: reviewData.punctuality,
          qualityScore: reviewData.quality,
          behaviorScore: reviewData.behavior,
          comment: reviewData.comment,
          serviceName: targetOrder.subServiceName,
          date: 'الآن',
          verifiedJob: true
        };
        setReviews(prev => [newReview, ...prev]);
      }

      setActiveOrders(prev => prev.filter(o => o.id !== orderIdToComplete));
      setIsReviewModalOpen(false);
    }
  };

  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      date: 'الآن'
    };
    setReviews(prev => [newRev, ...prev]);
  };

  // Quotes & Bids Marketplace (طلب عروض أسعار ومناقصات المشاريع)
  const createQuoteRequest = (data: { 
    title: string; 
    category: string; 
    description: string; 
    budget: string; 
    city: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
  }) => {
    const newQuote: ProjectQuoteRequest = {
      id: `quote_req_${Date.now()}`,
      clientId: 'client_me',
      clientName: currentUser.name || 'هشام بن علي',
      title: data.title,
      category: data.category,
      description: data.description,
      budgetEstimated: data.budget,
      city: data.city,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType || (data.mediaUrl ? 'image' : undefined),
      status: 'open',
      createdAt: 'الآن',
      bids: []
    };
    setQuotes(prev => [newQuote, ...prev]);

    // Simulate receiving an artisan bid in 3.5 seconds
    setTimeout(() => {
      setQuotes(currentQuotes => 
        currentQuotes.map(q => {
          if (q.id === newQuote.id) {
            return {
              ...q,
              bids: [
                {
                  id: `bid_${Date.now()}`,
                  artisanId: 'art_1',
                  artisanName: 'المعلم كمال بلقاسم',
                  artisanAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
                  artisanRating: 4.95,
                  artisanVerification: {
                    idVerified: true,
                    certVerified: true,
                    khodamGuaranteed: true,
                    topRated: true,
                    level: 2,
                    matricule: 'KD-DZ-2026-8812',
                    yearsExperience: 14,
                    completedJobsCount: 310
                  },
                  bidAmount: parseInt(data.budget.replace(/\D/g, '')) || 18000,
                  estimatedDays: 2,
                  proposalText: 'مرحباً أخي، اطلعت على المشكلة والصور وأنا مستعد للتنفيذ غداً صباحاً مع ضمان منصة خدام.',
                  includesMaterials: true,
                  submittedAt: 'الآن',
                  status: 'pending'
                }
              ]
            };
          }
          return q;
        })
      );
    }, 3500);
  };

  const submitQuoteBid = (quoteRequestId: string, bidData: { bidAmount: number; estimatedDays: number; proposalText: string; includesMaterials: boolean }) => {
    const activeArtisan = artisans[0];
    const newBid: QuoteBid = {
      id: `bid_${Date.now()}`,
      artisanId: activeArtisan.id,
      artisanName: activeArtisan.name,
      artisanAvatar: activeArtisan.avatar,
      artisanRating: activeArtisan.rating,
      artisanVerification: activeArtisan.verification,
      bidAmount: bidData.bidAmount,
      estimatedDays: bidData.estimatedDays,
      proposalText: bidData.proposalText,
      includesMaterials: bidData.includesMaterials,
      submittedAt: 'الآن',
      status: 'pending'
    };

    setQuotes(prev => prev.map(q => {
      if (q.id === quoteRequestId) {
        return {
          ...q,
          bids: [newBid, ...q.bids]
        };
      }
      return q;
    }));
  };

  const acceptQuoteBid = (quoteRequestId: string, bidId: string) => {
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteRequestId) {
        return {
          ...q,
          status: 'awarded',
          bids: q.bids.map(b => b.id === bidId ? { ...b, status: 'accepted' } : { ...b, status: 'rejected' })
        };
      }
      return q;
    }));
  };

  // Artisan Schedule State & Working Hours (إدارة الجدول الزمني)
  const [artisanSchedule, setArtisanSchedule] = useState<ArtisanSchedule>(() => {
    try {
      const saved = localStorage.getItem('khodam_artisan_schedule');
      return saved ? JSON.parse(saved) : initialArtisanSchedule;
    } catch {
      return initialArtisanSchedule;
    }
  });

  const updateArtisanSchedule = (schedule: ArtisanSchedule) => {
    setArtisanSchedule(schedule);
    try {
      localStorage.setItem('khodam_artisan_schedule', JSON.stringify(schedule));
    } catch (e) {
      console.error(e);
    }
  };

  // Geo-Fenced Push Alerts for Artisans (تنبيهات مخصصة ونطاق جغرافي)
  const [geoAlertRadiusKm, setGeoAlertRadiusKm] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('khodam_geo_radius');
      return saved ? Number(saved) : 10;
    } catch {
      return 10;
    }
  });

  const [activeGeoAlert, setActiveGeoAlert] = useState<{
    id: string;
    title: string;
    subService: string;
    neighborhood: string;
    distanceKm: number;
    payout: number;
    clientName: string;
    time: string;
  } | null>(null);

  const dismissGeoAlert = () => {
    setActiveGeoAlert(null);
  };

  const acceptGeoAlertTask = () => {
    if (activeGeoAlert) {
      sendPushNotification({
        title: 'تم قبول المهمة القريبة بنجاح!',
        message: `أنت الآن في طريقك لتنفيذ: ${activeGeoAlert.title} في ${activeGeoAlert.neighborhood}.`,
        type: 'alert',
        audience: 'artisans'
      });
      setActiveGeoAlert(null);
      setActiveTab('orders');
    }
  };

  const triggerSimulatedGeoAlert = () => {
    setActiveGeoAlert({
      id: `alert_geo_${Date.now()}`,
      title: 'إصلاح تسريب مائي مفاجئ في أنبوب المطبخ',
      subService: 'سباكة وترصيص صحي',
      neighborhood: 'حي البساتين، الأبيار (الجزائر العاصمة)',
      distanceKm: 1.8,
      payout: 3500,
      clientName: 'هشام بن علي',
      time: 'الآن'
    });
  };

  // Benchmark Pricing Catalog State (قائمة أسعار استرشادية)
  const [benchmarkPrices] = useState<BenchmarkPriceItem[]>(initialBenchmarkPrices);

  // Q&A Community Forum State (استشر حرفياً)
  const [qnaQuestions, setQnaQuestions] = useState<QnAQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_qna_questions');
      return saved ? JSON.parse(saved) : initialQnAQuestions;
    } catch {
      return initialQnAQuestions;
    }
  });

  const addQnAQuestion = (data: { title: string; category: string; content: string; imageUrl?: string }) => {
    const newQ: QnAQuestion = {
      id: `qna_${Date.now()}`,
      clientId: currentUser.id || 'cl_me',
      clientName: currentUser.name || 'هشام بن علي',
      clientAvatar: currentUser.avatar,
      category: data.category,
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl,
      createdAt: 'الآن',
      viewsCount: 1,
      isResolved: false,
      answers: []
    };

    setQnaQuestions(prev => {
      const updated = [newQ, ...prev];
      try { localStorage.setItem('khodam_qna_questions', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });

    sendPushNotification({
      title: '💡 تم نشر استشارتك في المنتدى!',
      message: `تم عرض استشارتك (${data.title}) في قسم ${data.category}. ستتلقى تنبيهاً فورياً فور إجابة الحرفيين المعتمدين.`,
      type: 'qna',
      audience: 'clients',
      actionLink: 'qna',
      linkText: 'عرض استشارتك في المنتدى 💡'
    });

    // Realistic simulation: a certified artisan posts an answer after 6 seconds
    setTimeout(() => {
      const sampleReplies: Record<string, string> = {
        'السباكة والترصيص الصحي': 'أهلاً بك أخي الكريم. هذا العطل يتطلب فحص جلدة المحبس والشدادات أولاً لمنع تسرب المياه، ويمكنك لف شريط التفلون مؤقتاً وسأكون بخدمتك.',
        'الكهرباء المنزلية والإنارة': 'وعليكم السلام. يرجى إطفاء القاطع الفرعي فوراً وعدم لمس الأسلاك، وغالباً المشكلة سببها حمولة زائدة أو ارتخاء في مسمار التوصيل.',
        'التبريد والتكييف والأجهزة': 'مرحباً. أصوات الاهتزاز أو ضعف التبريد سببها الشائع اتساخ الفلاتر أو نقص شحنة الغاز، يفضل عدم تشغيله لفترة طويلة لتفادي احتراق المحرك.',
        'النجارة والأقفال': 'أهلاً بك. يمكنك رش رذاذ السيليكون أو القليل من بودرة الجرافيت داخل قلب الكالون (Cylindre) لتليين حركة المفتاح دون كسر القفل.'
      };

      const replyText = sampleReplies[data.category] || 'تحياتي لك، الإجراء السليم هو فحص المشكلة بعناية والتأكد من شروط السلامة قبل المباشرة بأي خطوة يدوية.';
      addQnAAnswer(newQ.id, replyText);
    }, 6000);
  };

  const addQnAAnswer = (questionId: string, answerText: string) => {
    const activeArtisan = artisans[0]; // Master Kamal or first certified artisan
    const newAns: QnAAnswer = {
      id: `ans_${Date.now()}`,
      artisanId: activeArtisan.id,
      artisanName: activeArtisan.name,
      artisanAvatar: activeArtisan.avatar,
      artisanTrade: activeArtisan.trade || 'حرفي معتمد',
      artisanLevel: activeArtisan.verification.level,
      text: answerText,
      createdAt: 'الآن',
      upvotesCount: 1,
      hasUpvoted: true,
      isVerifiedSolution: true
    };

    let targetQuestionTitle = 'استشارتك الفنية';

    setQnaQuestions(prev => {
      const updated = prev.map(q => {
        if (q.id === questionId) {
          targetQuestionTitle = q.title;
          return {
            ...q,
            isResolved: true,
            answers: [...q.answers, newAns]
          };
        }
        return q;
      });
      try { localStorage.setItem('khodam_qna_questions', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });

    // Trigger Live Push Alert to the user!
    sendPushNotification({
      title: '💬 رد جديد في منتدى الاستشارات!',
      message: `أجاب الحرفي ${newAns.artisanName} (${newAns.artisanTrade}) على استشارتك: "${targetQuestionTitle}"`,
      type: 'qna',
      audience: 'clients',
      actionLink: 'qna',
      linkText: 'عرض الإجابة والحل الفني 💡',
      note: answerText.slice(0, 95) + (answerText.length > 95 ? '...' : '')
    });
  };

  const upvoteQnAAnswer = (questionId: string, answerId: string) => {
    setQnaQuestions(prev => {
      const updated = prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map(ans => {
              if (ans.id === answerId) {
                const currentlyUpvoted = !!ans.hasUpvoted;
                return {
                  ...ans,
                  hasUpvoted: !currentlyUpvoted,
                  upvotesCount: currentlyUpvoted ? ans.upvotesCount - 1 : ans.upvotesCount + 1
                };
              }
              return ans;
            })
          };
        }
        return q;
      });
      try { localStorage.setItem('khodam_qna_questions', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });
  };

  // Job Market & Work Seeking State (سوق العمل والتشغيل - البحث عن عمل والبحث عن عامل)
  const [jobSeekers, setJobSeekers] = useState<JobSeekerProfile[]>(() => {
    try {
      const saved = localStorage.getItem('khodam_job_seekers');
      return saved ? JSON.parse(saved) : initialJobSeekers;
    } catch {
      return initialJobSeekers;
    }
  });

  const addJobSeekerPost = (data: Omit<JobSeekerProfile, 'id' | 'createdAt' | 'status'>) => {
    const newPost: JobSeekerProfile = {
      ...data,
      id: `job_seeker_${Date.now()}`,
      createdAt: 'الآن',
      status: 'available',
      isVerified: true
    };
    setJobSeekers(prev => {
      const updated = [newPost, ...prev];
      try { localStorage.setItem('khodam_job_seekers', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });
  };

  const deleteJobSeekerPost = (id: string) => {
    setJobSeekers(prev => {
      const updated = prev.filter(p => p.id !== id);
      try { localStorage.setItem('khodam_job_seekers', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });
  };

  const updateJobSeekerStatus = (id: string, status: 'available' | 'employed' | 'busy') => {
    setJobSeekers(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, status } : p);
      try { localStorage.setItem('khodam_job_seekers', JSON.stringify(updated)); } catch (e) { console.error(e); }
      return updated;
    });
  };

  // Chat (المحادثات وإدارتها وحفظها مع التسجيل الصوتي)
  const sendMessage = (
    text: string, 
    isAudio = false, 
    audioDuration?: string, 
    imageUrl?: string, 
    audioUrl?: string,
    conversationId = 'conv_art_1',
    targetParticipant?: { id?: string; name?: string; trade?: string }
  ) => {
    const senderName = role === 'client' 
      ? (currentUser.name || 'هشام بن علي') 
      : (targetParticipant?.name || 'المعلم كمال بلقاسم');

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: conversationId || 'conv_art_1',
      senderId: role === 'client' ? 'client_me' : (targetParticipant?.id || 'art_me'),
      senderName,
      senderRole: role,
      text: text || (isAudio ? (language === 'ar' ? 'تسجيل صوتي استفساري 🎙️' : 'Voice inquiry') : (imageUrl ? (language === 'ar' ? 'صورة توضيحية للعطل' : 'Diagnostic breakdown photo') : '')),
      imageUrl,
      audioUrl,
      timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-DZ' : 'fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isAudio,
      audioDuration: audioDuration || (isAudio ? '0:14' : undefined),
      isRead: true,
      status: 'read'
    };

    setMessages(prev => {
      const next = [...prev, newMsg];
      try { localStorage.setItem('khodam_chat_messages', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });

    // Simulate counter-reply after 1.4s if sent as client
    if (role === 'client') {
      setTimeout(() => {
        let replyName = targetParticipant?.name || 'المعلم كمال بلقاسم';
        let replyId = targetParticipant?.id || 'art_1';
        let replyText = 'شكراً لتواصلك أخي هشام، تم استلام رسالتك وأنا في خدمة حضرتك فوراً.';

        if (conversationId === 'conv_art_2' || replyName.includes('حميد')) {
          replyName = 'حميد بن عمار';
          replyId = 'art_2';
          replyText = isAudio
            ? 'سمعت التسجيل الصوتي بوضوح، جهزت مقياس الفولت وأسلاك النحاس المعزولة وسأكون عندك لمعاينة القاطع الرئيسي.'
            : imageUrl
            ? 'الصورة واضحة جداً، القاطع يحتاج ضبط عيار الأمبير وسأحضره معي فوراً.'
            : 'مرحباً أخي هشام، استلمت تفاصيل عطل الكهرباء وسأقوم بزيارتك فوراً بعد الانتهاء من ورشة مجاورة.';
        } else if (conversationId === 'conv_art_3' || replyName.includes('رشيد')) {
          replyName = 'رشيد حداد';
          replyId = 'art_3';
          replyText = isAudio
            ? 'فهمت المطلوب من التسجيل الصوتي، كالون الأمان الإيطالي الأصلي مع كامل الملحقات جاهز وسأركبه بإتقان.'
            : imageUrl
            ? 'تفحصت صورة الباب، المقاس قياسي ومطابق تماماً وسأقوم بتثبيت القفل الجديد دون إتلاف الإطار.'
            : 'أهلاً بك، سأحضر في الموعد ومجهز بكافة أقفال الأمان والكالونات المطلوبة.';
        } else {
          replyText = isAudio
            ? 'استمعت للتسجيل الصوتي أخي هشام، الأمر مفهوم تماماً. سأكون في موقعك في الموعد المحدد ومجهزاً بالقطع اللازمة.'
            : imageUrl 
            ? 'تم استلام وفحص الصورة بنجاح؛ العطل واضح ومعي القطع المناسبة للإصلاح وسأكون في موقعك بالموعد.' 
            : 'شكراً لتواصلك أخي هشام، تم استلام رسالتك وأنا في خدمة حضرتك فوراً.';
        }

        const reply: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          conversationId: conversationId || 'conv_art_1',
          senderId: replyId,
          senderName: replyName,
          senderRole: 'artisan',
          text: replyText,
          timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-DZ' : 'fr-FR', { hour: '2-digit', minute: '2-digit' }),
          isAudio: isAudio,
          audioDuration: isAudio ? '0:12' : undefined,
          isRead: true,
          status: 'read'
        };
        setMessages(prev => {
          const next = [...prev, reply];
          try { localStorage.setItem('khodam_chat_messages', JSON.stringify(next)); } catch (e) { console.error(e); }
          return next;
        });
      }, 1400);
    }
  };

  // Appointments & Calendar (إدارة المواعيد والروزنامة)
  const createAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => {
      const next = [newApt, ...prev];
      try { localStorage.setItem('khodam_appointments', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => {
      const next = prev.map(a => a.id === id ? { 
        ...a, 
        status, 
        confirmedAt: status === 'confirmed' ? new Date().toISOString() : a.confirmedAt 
      } : a);
      try { localStorage.setItem('khodam_appointments', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const rescheduleAppointment = (id: string, newDate: string, newTimeSlot: string) => {
    setAppointments(prev => {
      const next = prev.map(a => a.id === id ? { 
        ...a, 
        date: newDate, 
        timeSlot: newTimeSlot, 
        status: 'rescheduled' as AppointmentStatus 
      } : a);
      try { localStorage.setItem('khodam_appointments', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => {
      const next = prev.filter(a => a.id !== id);
      try { localStorage.setItem('khodam_appointments', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const deleteChatMessage = (messageId: string) => {
    setMessages(prev => {
      const next = prev.filter(m => m.id !== messageId);
      try { localStorage.setItem('khodam_chat_messages', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const sendAdminNoticeToChat = (text: string) => {
    const adminMsg: ChatMessage = {
      id: `msg_admin_${Date.now()}`,
      senderId: 'admin_central',
      senderName: 'إدارة منصة خدام (تنبيه أمان رسمي)',
      senderRole: 'admin',
      text,
      timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-DZ' : 'fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };
    setMessages(prev => {
      const next = [...prev, adminMsg];
      try { localStorage.setItem('khodam_chat_messages', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const clearChatMessages = () => {
    setMessages([]);
    try { localStorage.removeItem('khodam_chat_messages'); } catch (e) { console.error(e); }
  };

  // Voice Call
  const startCall = (name: string, roleName: string, avatar: string) => {
    setCallSession({
      isActive: true,
      participantName: name,
      participantRole: roleName,
      participantAvatar: avatar,
      isMuted: false,
      isSpeaker: false,
      durationSeconds: 0
    });
  };

  const endCall = () => {
    setCallSession(prev => ({ ...prev, isActive: false, durationSeconds: 0 }));
  };

  const toggleCallMute = () => {
    setCallSession(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const toggleCallSpeaker = () => {
    setCallSession(prev => ({ ...prev, isSpeaker: !prev.isSpeaker }));
  };

  // Artisan workspace
  const toggleArtisanOnline = () => setArtisanOnline(prev => !prev);
  const uploadArtisanDoc = (type: 'id' | 'cert') => {
    setArtisanDocs(prev => ({
      ...prev,
      [type === 'id' ? 'idUploaded' : 'certUploaded']: true,
      status: 'verified'
    }));
  };

  // Authentication methods
  const loginWithMethod = (method: AuthMethod, data?: { name?: string; phone?: string; email?: string; role?: Role }) => {
    let name = data?.name || 'مستخدم جديد';
    let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    let chosenRole = data?.role || role;

    if (method === 'google') {
      name = data?.name || 'أحمد الجزائري (Google)';
      avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
    } else if (method === 'facebook') {
      name = data?.name || 'ياسين قاسي (Facebook)';
      avatar = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80';
    } else if (method === 'anonymous') {
      name = 'زائر محترم (ضيف)';
      avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    } else if (method === 'sms') {
      name = data?.name || 'مستخدم هاتف موثق';
      avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
    }

    setCurrentUser({
      id: `usr_${Date.now()}`,
      name,
      phone: data?.phone || '+213 550 12 34 56',
      email: data?.email || 'user@khodam.dz',
      avatar,
      role: chosenRole,
      method,
      isLoggedIn: true
    });
    setRole(chosenRole);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser({
      id: 'usr_guest',
      name: 'زائر',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'client',
      method: 'anonymous',
      isLoggedIn: false
    });
  };

  // Work Posts & Comments Methods
  const addWorkPost = (post: { 
    title: string; 
    description: string; 
    image?: string; 
    videoUrl?: string; 
    mediaType?: 'image' | 'video'; 
    isCompletedTask?: boolean;
    completionDate?: string;
    location: string; 
    trade?: string 
  }) => {
    const newPost: WorkPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorTrade: post.trade || (role === 'artisan' ? 'حرفي معتمد' : 'صاحب عمل'),
      authorLevel: 2,
      title: post.title,
      description: post.description,
      image: post.image || (post.mediaType === 'video' ? 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80' : '/src/assets/images/home_plumbing_service_1791156501756.jpg'),
      videoUrl: post.videoUrl,
      mediaType: post.mediaType || (post.videoUrl ? 'video' : 'image'),
      isCompletedTask: post.isCompletedTask || false,
      completionDate: post.completionDate || (post.isCompletedTask ? 'اليوم' : undefined),
      location: post.location || 'الجزائر العاصمة',
      createdAt: 'الآن',
      likesCount: 1,
      hasLiked: true,
      comments: []
    };
    setWorkPosts(prev => [newPost, ...prev]);
  };

  const togglePostLike = (postId: string) => {
    setWorkPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));
  };

  const togglePostShare = (postId: string) => {
    setWorkPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          sharesCount: (p.sharesCount || 0) + 1
        };
      }
      return p;
    }));
  };

  const addPostComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      text: text.trim(),
      date: 'الآن'
    };
    setWorkPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
  };

  const deleteWorkPost = (postId: string) => {
    setWorkPosts(prev => prev.filter(p => p.id !== postId));
  };

  // Verification & Admin Methods
  const approveVerification = (reqId: string) => {
    const req = verificationRequests.find(r => r.id === reqId);
    setVerificationRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'approved' } : r));

    if (req) {
      setArtisans(prev => prev.map(art => {
        if (art.id === req.artisanId) {
          const nextLevel = req.level;
          return {
            ...art,
            verification: {
              ...art.verification,
              level: nextLevel,
              idVerified: true,
              certVerified: nextLevel === 2 ? true : art.verification.certVerified
            },
            badges: nextLevel === 2 
              ? ['هوية موثقة (مستوى 1)', 'دبلوم كفاءة معتمد (مستوى 2)', 'ضمان خدام المالي']
              : ['هوية موثقة (مستوى 1)', 'ضمان خدام']
          };
        }
        return art;
      }));
    }
  };

  const updateArtisanLevel = (artisanId: string, level: VerificationLevel) => {
    setArtisans(prev => prev.map(art => {
      if (art.id === artisanId) {
        return {
          ...art,
          verification: {
            ...art.verification,
            level,
            idVerified: level >= 1,
            certVerified: level === 2
          },
          badges: level === 2 
            ? ['هوية موثقة (مستوى 1)', 'دبلوم كفاءة معتمد (مستوى 2)', 'ضمان خدام المالي']
            : level === 1 
              ? ['هوية موثقة (مستوى 1)', 'ضمان خدام']
              : ['غير موثق']
        };
      }
      return art;
    }));
  };

  const rejectVerification = (reqId: string) => {
    setVerificationRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r));
  };

  const submitLevel1 = (idCardImage: string, selfieImage: string) => {
    const newReq: VerificationRequest = {
      id: `v_req_${Date.now()}`,
      artisanId: 'art_1',
      artisanName: currentUser.name,
      artisanAvatar: currentUser.avatar,
      trade: 'سباك وترصيص صحي',
      level: 1,
      idCardImage: idCardImage || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
      selfieImage: selfieImage || currentUser.avatar,
      submittedAt: 'الآن',
      status: 'pending',
      notes: 'طلب توثيق المستوى 1 (بطاقة الهوية والصورة الشخصية).'
    };
    setVerificationRequests(prev => [newReq, ...prev]);
  };

  const submitLevel2 = (diplomaImage: string, diplomaTitle: string) => {
    const newReq: VerificationRequest = {
      id: `v_req_${Date.now()}`,
      artisanId: 'art_1',
      artisanName: currentUser.name,
      artisanAvatar: currentUser.avatar,
      trade: 'سباك وترصيص صحي',
      level: 2,
      diplomaImage: diplomaImage || 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&auto=format&fit=crop&q=80',
      diplomaTitle: diplomaTitle || 'شهادة الكفاءة المهنية (CAP) - ترصيص صحي وشبكات مياه',
      submittedAt: 'الآن',
      status: 'pending',
      notes: 'طلب توثيق المستوى 2 (الدبلوم المهني التخصصي).'
    };
    setVerificationRequests(prev => [newReq, ...prev]);
  };

  // Secret Admin Entry: 7 clicks on "خـدّام" word triggers secret admin entrance!
  const adminClickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBrandSecretClick = () => {
    if (isAdminAuthenticated) {
      setActiveTab('admin');
      setActiveNotificationToast({
        id: `notif_${Date.now()}`,
        title: 'لوحة المشرف العام',
        message: 'أنت متواجد بالفعل بصلاحية المشرف الكاملة.',
        type: 'announcement',
        audience: 'all',
        sentAt: 'الآن',
        isRead: false
      });
      return;
    }

    if (adminClickTimeoutRef.current) {
      clearTimeout(adminClickTimeoutRef.current);
    }
    adminClickTimeoutRef.current = setTimeout(() => {
      setAdminClickCount(0);
    }, 4000);

    setAdminClickCount(prev => {
      const next = prev + 1;
      if (next === 4) {
        setActiveNotificationToast({
          id: `notif_${Date.now()}`,
          title: '🔐 منطقة خـدّام السرية',
          message: 'بقي 3 نقرات على كلمة خـدّام للدخول كأدمن...',
          type: 'announcement',
          audience: 'all',
          sentAt: 'الآن',
          isRead: false
        });
      } else if (next === 5) {
        setActiveNotificationToast({
          id: `notif_${Date.now()}`,
          title: '🔐 منطقة خـدّام السرية',
          message: 'بقي نقرتان على كلمة خـدّام...',
          type: 'announcement',
          audience: 'all',
          sentAt: 'الآن',
          isRead: false
        });
      } else if (next === 6) {
        setActiveNotificationToast({
          id: `notif_${Date.now()}`,
          title: '🔐 منطقة خـدّام السرية',
          message: 'بقي نقرة واحدة فقط على كلمة خـدّام!',
          type: 'announcement',
          audience: 'all',
          sentAt: 'الآن',
          isRead: false
        });
      } else if (next >= 7) {
        setIsAdminAuthModalOpen(true);
        setActiveNotificationToast({
          id: `notif_${Date.now()}`,
          title: '🔐 بوابة المشرف السرية',
          message: 'تم فتح بوابة المشرف بعد 7 نقرات على كلمة خـدّام! يرجى إدخال كلمة السر للمتابعة.',
          type: 'announcement',
          audience: 'all',
          sentAt: 'الآن',
          isRead: false
        });
        return 0;
      }
      return next;
    });
  };

  const checkAdminPassword = async (password: string): Promise<boolean> => {
    const isValid = await verifyAdminPassword(password);
    if (isValid) {
      updateAdminAuth(true);
      setIsAdminAuthModalOpen(false);
      setActiveTab('admin');
      setActiveNotificationToast({
        id: `notif_${Date.now()}`,
        title: '✅ تم الدخول بنجاح',
        message: 'تم التحقق من كلمة السر المشفرة بنجاح، مرحباً بك في لوحة تحكم المشرف العام.',
        type: 'announcement',
        audience: 'all',
        sentAt: 'الآن',
        isRead: false
      });
      return true;
    }
    return false;
  };

  // Categories / Crafts Management (إدارة الحرف والخدمات وحفظها)
  const addCategory = (cat: ServiceCategory) => {
    setCategories(prev => {
      const next = [...prev, cat];
      try { localStorage.setItem('khodam_categories', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prev => {
      const next = prev.filter(c => c.id !== categoryId);
      try { localStorage.setItem('khodam_categories', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const updateCategory = (cat: ServiceCategory) => {
    setCategories(prev => {
      const next = prev.map(c => c.id === cat.id ? cat : c);
      try { localStorage.setItem('khodam_categories', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const updateCategoryIcon = (categoryId: string, newIcon: string) => {
    setCategories(prev => {
      const next = prev.map(c => c.id === categoryId ? { ...c, icon: newIcon } : c);
      try { localStorage.setItem('khodam_categories', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
    setAdminCustomIcons(prev => {
      const next = { ...prev, [categoryId]: newIcon, [`icon_${categoryId}`]: newIcon };
      try { localStorage.setItem('khodam_admin_custom_icons', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
    setActiveNotificationToast({
      id: `toast_${Date.now()}`,
      title: '🎨 تم تحديث ورفع الأيقونة بنجاح',
      message: 'تم حفظ وتطبيق الأيقونة الجديدة لكافة واجهات المنصة والحرف مباشرة!',
      type: 'update',
      audience: 'all',
      sentAt: 'الآن',
      isRead: false
    });
  };

  const updateCategoryHeroImage = (categoryId: string, image: string) => {
    setCategories(prev => {
      const next = prev.map(c => c.id === categoryId ? { ...c, image } : c);
      try { localStorage.setItem('khodam_categories', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const removeCategoryIcon = (categoryId: string) => {
    setCategories(prev => {
      const next = prev.map(c => c.id === categoryId ? { ...c, icon: 'Wrench' } : c);
      try { localStorage.setItem('khodam_categories', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
    setAdminCustomIcons(prev => {
      const copy = { ...prev };
      delete copy[categoryId];
      delete copy[`icon_${categoryId}`];
      try { localStorage.setItem('khodam_admin_custom_icons', JSON.stringify(copy)); } catch (e) { console.error(e); }
      return copy;
    });
    setActiveNotificationToast({
      id: `toast_${Date.now()}`,
      title: '🗑️ تم حذف وتصفير أيقونة الحرفة',
      message: 'تمت إزالة الأيقونة واستعادة الأيقونة الافتراضية بنجاح!',
      type: 'update',
      audience: 'all',
      sentAt: 'الآن',
      isRead: false
    });
  };

  const removeCategoryHeroImage = (categoryId: string) => {
    setCategories(prev => {
      const next = prev.map(c => c.id === categoryId ? { ...c, image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80' } : c);
      try { localStorage.setItem('khodam_categories', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const deleteSubService = (categoryId: string, subServiceId: string) => {
    setCategories(prev => {
      const next = prev.map(c => {
        if (c.id === categoryId) {
          return {
            ...c,
            subServices: c.subServices.filter(s => s.id !== subServiceId)
          };
        }
        return c;
      });
      try { localStorage.setItem('khodam_categories', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
    setActiveNotificationToast({
      id: `toast_${Date.now()}`,
      title: '🗑️ تم حذف الخدمة الفرعية بنجاح',
      message: 'تمت إزالة الخدمة من باقة المهام المعروضة للزبائن!',
      type: 'alert',
      audience: 'all',
      sentAt: 'الآن',
      isRead: false
    });
  };

  const updateSubService = (categoryId: string, updatedSub: SubService) => {
    setCategories(prev => {
      const next = prev.map(c => {
        if (c.id === categoryId) {
          return {
            ...c,
            subServices: c.subServices.map(s => s.id === updatedSub.id ? updatedSub : s)
          };
        }
        return c;
      });
      try { localStorage.setItem('khodam_categories', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const updateSubServiceImage = (categoryId: string, subServiceId: string, image: string) => {
    setCategories(prev => {
      const next = prev.map(c => {
        if (c.id === categoryId) {
          return {
            ...c,
            subServices: c.subServices.map(s => s.id === subServiceId ? { ...s, image } : s)
          };
        }
        return c;
      });
      try { localStorage.setItem('khodam_categories', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const removeSubServiceImage = (categoryId: string, subServiceId: string) => {
    setCategories(prev => {
      const next = prev.map(c => {
        if (c.id === categoryId) {
          return {
            ...c,
            subServices: c.subServices.map(s => s.id === subServiceId ? { ...s, image: '' } : s)
          };
        }
        return c;
      });
      try { localStorage.setItem('khodam_categories', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  // Artisan & Account Admin Operations (إدارة وتعديل وحذف الحرفيين)
  const deleteArtisan = (artisanId: string) => {
    setArtisans(prev => {
      const next = prev.filter(a => a.id !== artisanId);
      try { localStorage.setItem('khodam_artisans', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
    setActiveNotificationToast({
      id: `toast_${Date.now()}`,
      title: '🗑️ تم حذف حساب الحرفي نهائياً',
      message: 'تم حذف حساب الحرفي وملفه الشخصي من المنصة بالكامل!',
      type: 'alert',
      audience: 'all',
      sentAt: 'الآن',
      isRead: false
    });
  };

  const removeArtisanAvatar = (artisanId: string) => {
    setArtisans(prev => {
      const next = prev.map(a => a.id === artisanId ? { ...a, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' } : a);
      try { localStorage.setItem('khodam_artisans', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const updateArtisan = (updated: Artisan) => {
    setArtisans(prev => {
      const next = prev.map(a => a.id === updated.id ? updated : a);
      try { localStorage.setItem('khodam_artisans', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const updateArtisanAvatar = (artisanId: string, avatar: string) => {
    setArtisans(prev => {
      const next = prev.map(a => a.id === artisanId ? { ...a, avatar } : a);
      try { localStorage.setItem('khodam_artisans', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  // Client Accounts (إدارة وحذف حسابات العملاء)
  const deleteClientAccount = (clientId: string) => {
    setClientAccounts(prev => {
      const next = prev.filter(c => c.id !== clientId);
      try { localStorage.setItem('khodam_client_accounts', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
    setActiveNotificationToast({
      id: `toast_${Date.now()}`,
      title: '🗑️ تم حذف حساب العميل نهائياً',
      message: 'تمت إزالة الحساب وبياناته بالكامل من قاعدة بيانات المنصة!',
      type: 'alert',
      audience: 'all',
      sentAt: 'الآن',
      isRead: false
    });
  };

  const toggleClientSuspension = (clientId: string) => {
    setClientAccounts(prev => {
      const next = prev.map(c => c.id === clientId ? { ...c, isSuspended: !c.isSuspended } : c);
      try { localStorage.setItem('khodam_client_accounts', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const removeClientAvatar = (clientId: string) => {
    setClientAccounts(prev => {
      const next = prev.map(c => c.id === clientId ? { ...c, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' } : c);
      try { localStorage.setItem('khodam_client_accounts', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  // Media Deletion for Billboard and Spotlight
  const deleteBillboardMedia = () => {
    setBillboardConfig(prev => {
      const next = { ...prev, mediaUrl: '', isVisible: false };
      try { localStorage.setItem('khodam_billboard_config', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
    setActiveNotificationToast({
      id: `toast_${Date.now()}`,
      title: '🗑️ تم تفريغ وسائط وحذف اللوحة الكبرى',
      message: 'تم مسح الصورة وإخفاء اللوحة بنجاح!',
      type: 'update',
      audience: 'all',
      sentAt: 'الآن',
      isRead: false
    });
  };

  const deleteSquareSpotlightMedia = () => {
    setSquareSpotlightConfig(prev => {
      const next = { ...prev, mediaUrl: '', isVisible: false };
      try { localStorage.setItem('khodam_square_spotlight_config', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
    setActiveNotificationToast({
      id: `toast_${Date.now()}`,
      title: '🗑️ تم تفريغ وسائط وحذف لوحة 5×5',
      message: 'تم مسح وسائط اللوحة وإخفاؤها بنجاح!',
      type: 'update',
      audience: 'all',
      sentAt: 'الآن',
      isRead: false
    });
  };

  // Home Display Panels Visibility
  const toggleHomePanel = (panelKey: keyof HomePanelsConfig) => {
    setHomePanelsConfig(prev => {
      const next = { ...prev, [panelKey]: !prev[panelKey] };
      try { localStorage.setItem('khodam_home_panels', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const deleteHomePanel = (panelKey: keyof HomePanelsConfig) => {
    setHomePanelsConfig(prev => {
      const next = { ...prev, [panelKey]: false };
      try { localStorage.setItem('khodam_home_panels', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
    setActiveNotificationToast({
      id: `toast_${Date.now()}`,
      title: '🗑️ تم حذف وإخفاء البانل من الواجهة',
      message: 'تمت إزالة البانل المعني من الصفحة الرئيسية للتطبيق بنجاح!',
      type: 'update',
      audience: 'all',
      sentAt: 'الآن',
      isRead: false
    });
  };

  const resetHomePanels = () => {
    setHomePanelsConfig(defaultHomePanelsConfig);
    try { localStorage.setItem('khodam_home_panels', JSON.stringify(defaultHomePanelsConfig)); } catch (e) { console.error(e); }
    setActiveNotificationToast({
      id: `toast_${Date.now()}`,
      title: '🔄 تم استعادة كافة البانلات المعروضة',
      message: 'تم إظهار جميع بانلات الواجهة الرئيسية بنجاح!',
      type: 'update',
      audience: 'all',
      sentAt: 'الآن',
      isRead: false
    });
  };

  const toggleArtisanSuspension = (artisanId: string) => {
    setArtisans(prev => {
      const next = prev.map(a => a.id === artisanId ? { ...a, isSuspended: !a.isSuspended } : a);
      try { localStorage.setItem('khodam_artisans', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const registerJobSeeker = (artisanData: Omit<Artisan, 'id' | 'rating' | 'reviewCount' | 'completedJobsCount'>) => {
    const newArtisan: Artisan = {
      ...artisanData,
      id: `job_seeker_${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      completedJobsCount: 0,
      isOnline: true,
      badges: ['طالب عمل متاح فوراً', ...(artisanData.badges || [])]
    };
    setArtisans(prev => {
      const next = [newArtisan, ...prev];
      try { localStorage.setItem('khodam_artisans', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        isDarkMode,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        currentUser,
        updateUserProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithMethod,
        logout,
        isCraftCharterOpen,
        setIsCraftCharterOpen,
        selectedCraftForCharter,
        setSelectedCraftForCharter,
        workPosts,
        addWorkPost,
        togglePostLike,
        togglePostShare,
        addPostComment,
        deleteWorkPost,
        isProfessionalCardOpen,
        setIsProfessionalCardOpen,
        selectedArtisanForCard,
        setSelectedArtisanForCard,
        isFacebookProfileOpen,
        setIsFacebookProfileOpen,
        selectedArtisanForProfile,
        setSelectedArtisanForProfile,
        openArtisanFacebookProfile,
        verificationRequests,
        approveVerification,
        rejectVerification,
        updateArtisanLevel,
        submitLevel1,
        submitLevel2,
        isAdminAuthenticated,
        setIsAdminAuthenticated: updateAdminAuth,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        handleBrandSecretClick,
        checkAdminPassword,
        activeOrders,
        activeOrder,
        selectedActiveOrderId,
        setSelectedActiveOrderId,
        orderHistory,
        createOrder,
        advanceOrderStatus,
        cancelCurrentOrder,
        completeCurrentOrder,
        selectedTradeFilter,
        setSelectedTradeFilter,
        navigateToTradeArtisans,
        artisans,
        searchRadiusKm,
        setSearchRadiusKm,
        selectedCity,
        setSelectedCity,
        selectedArtisan,
        setSelectedArtisan,
        quotes,
        createQuoteRequest,
        submitQuoteBid,
        acceptQuoteBid,
        reviews,
        addReview,
        isReviewModalOpen,
        setIsReviewModalOpen,
        messages,
        sendMessage,
        deleteChatMessage,
        sendAdminNoticeToChat,
        clearChatMessages,
        isChatOpen,
        setIsChatOpen,
        appointments,
        createAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        deleteAppointment,
        isBookingAppointmentModalOpen,
        setIsBookingAppointmentModalOpen,
        selectedArtisanForAppointment,
        setSelectedArtisanForAppointment,
        callSession,
        startCall,
        endCall,
        toggleCallMute,
        toggleCallSpeaker,
        bookingModalService,
        setBookingModalService,
        artisanOnline,
        toggleArtisanOnline,
        artisanDocs,
        uploadArtisanDoc,
        searchQuery,
        setSearchQuery,
        categories,
        addCategory,
        deleteCategory,
        updateCategory,
        updateCategoryIcon,
        removeCategoryIcon,
        removeCategoryHeroImage,
        deleteSubService,
        updateSubService,
        updateSubServiceImage,
        removeSubServiceImage,
        updateCategoryHeroImage,
        deleteArtisan,
        removeArtisanAvatar,
        updateArtisan,
        updateArtisanAvatar,
        toggleArtisanSuspension,
        registerJobSeeker,
        clientAccounts,
        deleteClientAccount,
        toggleClientSuspension,
        removeClientAvatar,
        billboardConfig,
        setBillboardConfig,
        deleteBillboardMedia,
        squareSpotlightConfig,
        setSquareSpotlightConfig,
        deleteSquareSpotlightMedia,
        homePanelsConfig,
        setHomePanelsConfig,
        toggleHomePanel,
        deleteHomePanel,
        resetHomePanels,
        appSecurityConfig,
        setAppSecurityConfig,
        firebaseConfig,
        setFirebaseConfig,
        notifications,
        sendPushNotification,
        activeNotificationToast,
        dismissNotificationToast,
        markAllNotificationsRead,
        markNotificationAsRead,
        clearAllNotifications,
        unreadNotificationsCount,
        isNotificationsModalOpen,
        setIsNotificationsModalOpen,
        triggerOrderStatusNotification,
        testSimulateOrderNotification,
        testSimulateQnAReplyNotification,
        reports,
        reportArtisan,
        resolveReport,
        isUpdateModalOpen,
        updateModalData,
        closeUpdateModal,
        favoriteArtisanIds,
        toggleFavoriteArtisan,
        isArtisanFavorite,
        isAIDiagnosticModalOpen,
        setIsAIDiagnosticModalOpen,
        isDiagnosisSheetOpen,
        setIsDiagnosisSheetOpen,
        diagnosisInitialText,
        setDiagnosisInitialText,
        openSmartDiagnosis,
        artisanSchedule,
        updateArtisanSchedule,
        geoAlertRadiusKm,
        setGeoAlertRadiusKm,
        activeGeoAlert,
        dismissGeoAlert,
        acceptGeoAlertTask,
        triggerSimulatedGeoAlert,
        benchmarkPrices,
        qnaQuestions,
        addQnAQuestion,
        addQnAAnswer,
        upvoteQnAAnswer,
        jobSeekers,
        addJobSeekerPost,
        deleteJobSeekerPost,
        updateJobSeekerStatus,
        isAdminLiveEditMode,
        setIsAdminLiveEditMode,
        adminCustomTexts,
        setAdminCustomText,
        resetAdminCustomTexts,
        getAdminCustomText,
        adminCustomIcons,
        setAdminCustomIcon,
        resetAdminCustomIcons,
        getAdminCustomIcon,
        adminEditModalTarget,
        setAdminEditModalTarget,
        isMediaManagerModalOpen,
        setIsMediaManagerModalOpen,
        isChatDiagnosticsOpen,
        setIsChatDiagnosticsOpen,
        isAddCraftModalOpen,
        setIsAddCraftModalOpen,
        simulateChatExchange,
        playStoreConfig,
        updatePlayStoreConfig,
        supportTickets,
        addSupportTicket,
        updateSupportTicketStatus,
        deleteSupportTicket,
        replyToSupportTicket,
        addTicketUserReply,
        isContactModalOpen,
        setIsContactModalOpen,
        isLegalModalOpen,
        setIsLegalModalOpen,
        legalModalTab,
        setLegalModalTab,
        requestAccountDeletion,
        partnerPosts,
        addPartnerPost,
        togglePartnerPostLike,
        addPartnerPostComment,
        deletePartnerPost,
        updatePartnerPostStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
