import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Key, 
  X, 
  Check, 
  FileText, 
  UserCheck, 
  Award, 
  Users, 
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Sparkles,
  Lock,
  Trash2,
  Heart,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Plus,
  Radio,
  Tv,
  Bell,
  Send,
  Video,
  Image as ImageIcon,
  DollarSign,
  Ban,
  Edit3,
  Download,
  Settings,
  Flame,
  Wrench,
  Upload,
  Link,
  Shield,
  Zap,
  Paintbrush,
  Hammer,
  Truck,
  Scissors,
  Home,
  Smartphone,
  Camera,
  Droplet,
  Briefcase,
  Mail,
  Phone,
  Clock,
  MapPin,
  Globe,
  Headphones
} from 'lucide-react';
import { VerificationLevel, ServiceCategory, Artisan, PlayStoreComplianceConfig, SupportTicket, Report } from '../types';
import { updateAdminPassword, resetAdminPassword } from '../utils/security';
import { AppIconRenderer } from './AppIconRenderer';

export const AdminPanel: React.FC = () => {
  const { 
    isAdminAuthenticated, 
    setIsAdminAuthenticated, 
    isAdminAuthModalOpen, 
    setIsAdminAuthModalOpen, 
    checkAdminPassword,
    verificationRequests,
    approveVerification,
    rejectVerification,
    updateArtisanLevel,
    artisans,
    deleteArtisan,
    updateArtisan,
    toggleArtisanSuspension,
    clientAccounts,
    deleteClientAccount,
    toggleClientSuspension,
    removeClientAvatar,
    categories,
    addCategory,
    deleteCategory,
    updateCategory,
    updateCategoryIcon,
    billboardConfig,
    setBillboardConfig,
    squareSpotlightConfig,
    setSquareSpotlightConfig,
    appSecurityConfig,
    setAppSecurityConfig,
    firebaseConfig,
    setFirebaseConfig,
    notifications,
    sendPushNotification,
    workPosts,
    deleteWorkPost,
    setSelectedArtisanForCard,
    setIsProfessionalCardOpen,
    activeTab,
    setActiveTab,
    messages,
    deleteChatMessage,
    sendAdminNoticeToChat,
    clearChatMessages,
    jobSeekers,
    deleteJobSeekerPost,
    updateJobSeekerStatus,
    setIsChatDiagnosticsOpen,
    setIsMediaManagerModalOpen,
    setIsAddCraftModalOpen,
    simulateChatExchange,
    startCall,
    language,
    playStoreConfig,
    updatePlayStoreConfig,
    supportTickets,
    updateSupportTicketStatus,
    deleteSupportTicket,
    partnerPosts,
    deletePartnerPost,
    adminCustomTexts,
    setAdminCustomText,
    resetAdminCustomTexts,
    adminCustomIcons,
    setAdminCustomIcon,
    resetAdminCustomIcons,
    getAdminCustomIcon,
    homePanelsConfig,
    toggleHomePanel,
    deleteHomePanel,
    setAdminEditModalTarget,
    setIsAdminLiveEditMode,
    reports,
    resolveReport
  } = useApp();

  const [passwordInput, setPasswordInput] = useState('');
  const [showInPagePassword, setShowInPagePassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Admin Master Password Management (Encrypted SHA-256)
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  // Google Play Store & Legal & Contact Us Form State
  const [playStoreForm, setPlayStoreForm] = useState<PlayStoreComplianceConfig>(playStoreConfig);
  const [playStoreSavedSuccess, setPlayStoreSavedSuccess] = useState(false);
  const [ticketFilter, setTicketFilter] = useState<'all' | 'new' | 'resolved'>('all');

  // Sub-tabs
  type AdminTab = 
    | 'requests' 
    | 'users' 
    | 'crafts' 
    | 'billboard' 
    | 'square5x5' 
    | 'notifications' 
    | 'security' 
    | 'posts' 
    | 'chats' 
    | 'mediaManager' 
    | 'jobMarket' 
    | 'playStoreLegal'
    | 'siteTexts'
    | 'appIcon'
    | 'partnerPosts'
    | 'homePanels'
    | 'reports';
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<AdminTab>('requests');

  // App Icon & Logo Studio State
  const [appIconSuccessMessage, setAppIconSuccessMessage] = useState<string | null>(null);
  const [customAppIconInput, setCustomAppIconInput] = useState('');
  const [isAppIconDragging, setIsAppIconDragging] = useState(false);

  // Confirmation states without window.confirm
  const [confirmDeleteArtisanId, setConfirmDeleteArtisanId] = useState<string | null>(null);
  const [confirmDeleteClientId, setConfirmDeleteClientId] = useState<string | null>(null);
  const [confirmDeleteCatId, setConfirmDeleteCatId] = useState<string | null>(null);
  const [confirmClearChat, setConfirmClearChat] = useState(false);

  // Live Chat Oversight state
  const [adminNoticeText, setAdminNoticeText] = useState('');
  const [adminNoticeSent, setAdminNoticeSent] = useState(false);
  const [chatSearchFilter, setChatSearchFilter] = useState('');
  const [selectedChatParticipant, setSelectedChatParticipant] = useState<string>('all');

  // Media & Images Manager State (التحكم في جميع الصور وحذف الخدمات)
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<'all' | 'categories' | 'billboard' | 'square' | 'posts'>('all');
  const [imageQuickEditItem, setImageQuickEditItem] = useState<{ id: string; type: string; title: string; currentUrl: string } | null>(null);
  const [newMediaUrlInput, setNewMediaUrlInput] = useState('');

  // New Craft Form State & Icon Picker
  const [isAddCraftOpen, setIsAddCraftOpen] = useState(false);
  const [newCraftName, setNewCraftName] = useState('');
  const [newCraftDesc, setNewCraftDesc] = useState('');
  const [newCraftImage, setNewCraftImage] = useState('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80');
  const [iconPickerCatId, setIconPickerCatId] = useState<string | null>(null);

  // Push Notification Dispatcher State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'update' | 'announcement' | 'alert' | 'note'>('announcement');
  const [notifAudience, setNotifAudience] = useState<'all' | 'artisans' | 'clients'>('all');
  const [notifVersion, setNotifVersion] = useState('v2.5.0');
  const [notifUpdateUrl, setNotifUpdateUrl] = useState('https://play.google.com/store/apps');
  const [notifActionLink, setNotifActionLink] = useState('');
  const [notifLinkText, setNotifLinkText] = useState('فتح الرابط');
  const [notifNote, setNotifNote] = useState('');
  const [notifSentSuccess, setNotifSentSuccess] = useState(false);

  // Security audit state
  const [securityRefreshedSuccess, setSecurityRefreshedSuccess] = useState(false);

  // Edit Artisan Modal
  const [editingArtisan, setEditingArtisan] = useState<Artisan | null>(null);

  // Edit Craft & Image/Description State (إمكانية تغيير الصور وأسماء الحرف والوصف)
  const [editingCraft, setEditingCraft] = useState<ServiceCategory | null>(null);
  const [craftSaveSuccess, setCraftSaveSuccess] = useState(false);
  const [newSubServiceName, setNewSubServiceName] = useState('');
  const [newSubServicePrice, setNewSubServicePrice] = useState('2000 - 5000 دج');
  const applyAppIcon = (iconValue: string) => {
    setAdminCustomIcon('app_logo', iconValue);
    try {
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (favicon && !iconValue.startsWith('<svg')) {
        favicon.href = iconValue;
      }
    } catch (e) {
      console.log('Favicon update error', e);
    }
    setAppIconSuccessMessage('تم تحديث وتطبيق أيقونة وشعار التطبيق بنجاح في كافة أرجاء المنصة! ✨');
    setTimeout(() => setAppIconSuccessMessage(null), 4000);
  };

  const handleSaveEditCraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCraft) return;
    updateCategory(editingCraft);
    setCraftSaveSuccess(true);
    setTimeout(() => {
      setCraftSaveSuccess(false);
      setEditingCraft(null);
    }, 1200);
  };

  const handleCraftImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCraft) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingCraft({ ...editingCraft, image: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveQuickImage = (newUrl: string) => {
    if (!imageQuickEditItem || !newUrl.trim()) return;
    if (imageQuickEditItem.type === 'category') {
      const cat = categories.find(c => c.id === imageQuickEditItem.id);
      if (cat) {
        updateCategory({ ...cat, image: newUrl.trim() });
      }
    } else if (imageQuickEditItem.type === 'billboard') {
      setBillboardConfig(prev => ({ ...prev, mediaUrl: newUrl.trim(), mediaType: 'image' }));
    } else if (imageQuickEditItem.type === 'square') {
      setSquareSpotlightConfig(prev => ({ ...prev, mediaUrl: newUrl.trim(), mediaType: 'image' }));
    }
    setImageQuickEditItem(null);
    setNewMediaUrlInput('');
  };

  const handleQuickImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        handleSaveQuickImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendAdminNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNoticeText.trim()) return;
    sendAdminNoticeToChat(adminNoticeText.trim());
    setAdminNoticeText('');
    setAdminNoticeSent(true);
    setTimeout(() => setAdminNoticeSent(false), 3000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || isVerifying) return;
    setIsVerifying(true);
    setAuthError(false);
    try {
      const success = await checkAdminPassword(passwordInput);
      if (!success) {
        setAuthError(true);
      } else {
        setAuthError(false);
        setPasswordInput('');
      }
    } catch {
      setAuthError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    setPasswordChangeSuccess(false);

    if (newAdminPassword.length < 6) {
      setPasswordChangeError('كلمة السر يجب أن لا تقل عن 6 خانات.');
      return;
    }
    if (newAdminPassword !== confirmAdminPassword) {
      setPasswordChangeError('كلمتا السر غير متطابقتين.');
      return;
    }

    const ok = await updateAdminPassword(newAdminPassword);
    if (ok) {
      setPasswordChangeSuccess(true);
      setNewAdminPassword('');
      setConfirmAdminPassword('');
      setTimeout(() => setPasswordChangeSuccess(false), 4000);
    } else {
      setPasswordChangeError('حدث خطأ أثناء تشفير وحفظ كلمة السر.');
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setActiveTab('home');
  };

  const handleOpenArtisanCard = (artisan: Artisan) => {
    setSelectedArtisanForCard(artisan);
    setIsProfessionalCardOpen(true);
  };

  const handleCreateCraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCraftName.trim()) return;

    const newCat: ServiceCategory = {
      id: `craft_${Date.now()}`,
      name: newCraftName.trim(),
      nameEn: newCraftName.trim(),
      nameFr: newCraftName.trim(),
      description: newCraftDesc.trim() || 'خدمات وحرف مهنية متخصصة',
      icon: 'Wrench',
      image: newCraftImage,
      accentColor: 'amber',
      subServices: [
        {
          id: `sub_${Date.now()}`,
          name: newCraftName.trim(),
          nameEn: newCraftName.trim(),
          nameFr: newCraftName.trim(),
          description: newCraftDesc.trim(),
          estimatedPrice: '2500 - 8000 دج',
          iconName: 'Wrench',
          image: newCraftImage
        }
      ]
    };

    addCategory(newCat);
    setNewCraftName('');
    setNewCraftDesc('');
    setIsAddCraftOpen(false);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    sendPushNotification({
      title: notifTitle.trim(),
      message: notifMessage.trim(),
      type: notifType,
      audience: notifAudience,
      version: notifType === 'update' ? notifVersion : undefined,
      updateUrl: notifType === 'update' ? notifUpdateUrl : undefined,
      actionLink: notifActionLink.trim() || undefined,
      linkText: notifLinkText.trim() || undefined,
      note: notifNote.trim() || undefined
    });

    setNotifSentSuccess(true);
    setTimeout(() => {
      setNotifSentSuccess(false);
      setNotifTitle('');
      setNotifMessage('');
      setNotifActionLink('');
      setNotifNote('');
    }, 2000);
  };

  const handleSpotlightFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setSquareSpotlightConfig(prev => ({
            ...prev,
            mediaType: isVideo ? 'video' : 'image',
            mediaUrl: result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefreshSecurityKeys = () => {
    const randomHex = Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setAppSecurityConfig(prev => ({
      ...prev,
      lastAuditDate: new Date().toISOString().split('T')[0],
      encryptionKeyFingerprint: `SHA256:Khodam-DZ-E2EE-${randomHex.toUpperCase()}`
    }));
    setSecurityRefreshedSuccess(true);
    setTimeout(() => setSecurityRefreshedSuccess(false), 2500);
  };

  const handleSaveEditArtisan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtisan) return;
    updateArtisan(editingArtisan);
    setEditingArtisan(null);
  };

  return (
    <>
      {/* 1. IN-PAGE ADMIN LOGIN (When activeTab is 'admin' and not authenticated) */}
      {!isAdminAuthenticated && activeTab === 'admin' && (
        <div className="py-12 flex items-center justify-center animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {language === 'ar' ? 'تسجيل دخول لوحة الإدارة' : 'Admin Restricted Portal'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ar' 
                ? 'أدخل كلمة سر المشرف المركزية المشفرة للتحكم بكافة أقسام المنصة.' 
                : 'Enter encrypted management password to access the platform administration.'}
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-5">
              <div className="relative">
                <input
                  type={showInPagePassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  className={`w-full text-center px-10 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-mono tracking-widest text-slate-900 dark:text-white focus:outline-none transition-all ${
                    authError 
                      ? 'border-rose-500 ring-2 ring-rose-500/20' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowInPagePassword(!showInPagePassword)}
                  className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer"
                  title={showInPagePassword ? 'إخفاء كلمة السر' : 'إظهار كلمة السر'}
                >
                  {showInPagePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <div className="text-xs text-rose-500 font-semibold flex items-center justify-center gap-1.5 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{language === 'ar' ? 'كلمة السر غير صحيحة، حاول مجدداً.' : 'Invalid password, try again.'}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || !passwordInput.trim()}
                className="w-full h-11 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer shadow-amber-500/20"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'ar' ? 'جارٍ التحقق المشفر...' : 'Verifying hash...'}</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>{language === 'ar' ? 'دخول لوحة التحكم' : 'Authenticate & Enter'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. FULL ADMIN DASHBOARD VIEW */}
      {isAdminAuthenticated && (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
          {/* Admin Header */}
          <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black">
                    {language === 'ar' ? 'لوحة الإدارة الشاملة لمنصة خـدّام' : 'Khodam Central Management Hub'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40">
                    Admin Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  إدارة وحذف الحسابات والحرف، اللوحة الكبرى، توثيق الحرفيين، وإشعارات Firebase.
                </p>
              </div>
            </div>


          </div>

          {/* Quick Page Jump Bar for Admin */}
          <div className="p-3 bg-slate-900/90 text-white rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold">تصفح صفحات التطبيق مباشرة بصلاحيات المشرف:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'home', label: 'الرئيسية 🏠' },
                { id: 'partners', label: 'شريك عمل 🤝' },
                { id: 'jobs', label: 'سوق العمل 💼' },
                { id: 'works', label: 'المعرض 🖼️' },
                { id: 'pricing', label: 'دليل الأسعار ⚖️' },
                { id: 'qna', label: 'المنتدى 💡' },
                { id: 'quotes', label: 'المناقصات 📋' },
                { id: 'chat', label: 'المحادثات 💬' },
                { id: 'radar', label: 'الرادار 📡' }
              ].map(page => (
                <button
                  key={page.id}
                  onClick={() => {
                    setIsAdminLiveEditMode(true);
                    setActiveTab(page.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  {page.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">طلبات التوثيق</span>
              <span className="text-xl font-black text-amber-500 tabular-nums">
                {verificationRequests.filter(r => r.status === 'pending').length}
              </span>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">الحرفيون بالمستوى 2</span>
              <span className="text-xl font-black text-emerald-500 tabular-nums">
                {artisans.filter(a => a.verification.level === 2).length}
              </span>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">إجمالي الحسابات</span>
              <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                {artisans.length}
              </span>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">الحرف والخدمات</span>
              <span className="text-xl font-black text-blue-500 tabular-nums">
                {categories.length}
              </span>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">سوق العمل والوظائف</span>
              <span className="text-xl font-black text-amber-500 tabular-nums">
                {jobSeekers.length}
              </span>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">منشورات الشراكة</span>
              <span className="text-xl font-black text-emerald-500 tabular-nums">
                {partnerPosts.length}
              </span>
            </div>
          </div>

          {/* Admin Navigation Sub-Tabs */}
          <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-2 pb-1">
            <button
              onClick={() => setActiveAdminSubTab('requests')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                activeAdminSubTab === 'requests'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              طلبات التوثيق ({verificationRequests.filter(r => r.status === 'pending').length})
            </button>

            <button
              onClick={() => setActiveAdminSubTab('users')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                activeAdminSubTab === 'users'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              إدارة الحسابات والتوقيف ({artisans.length})
            </button>

            <button
              onClick={() => setActiveAdminSubTab('crafts')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                activeAdminSubTab === 'crafts'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              إدارة الحرف والخدمات ({categories.length})
            </button>

            <button
              onClick={() => setActiveAdminSubTab('billboard')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                activeAdminSubTab === 'billboard'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              اللوحة الكبرى (صور / فيديو)
            </button>

            <button
              onClick={() => setActiveAdminSubTab('square5x5')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                activeAdminSubTab === 'square5x5'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              لوحة 5×5 سم ميديا
            </button>

            <button
              onClick={() => setActiveAdminSubTab('notifications')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                activeAdminSubTab === 'notifications'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              إشعارات Firebase والروابط
            </button>

            <button
              onClick={() => setActiveAdminSubTab('security')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                activeAdminSubTab === 'security'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              تشفير التطبيق وحمايته
            </button>

            <button
              onClick={() => setActiveAdminSubTab('posts')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                activeAdminSubTab === 'posts'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              منشورات المعرض ({workPosts.length})
            </button>

            <button
              onClick={() => setActiveAdminSubTab('chats')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeAdminSubTab === 'chats'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>مراقبة محادثات الحرفيين والعملاء ({messages.length})</span>
            </button>

            <button
              onClick={() => setActiveAdminSubTab('mediaManager')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeAdminSubTab === 'mediaManager'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>التحكم في جميع الصور وحذف الخدمات</span>
            </button>

            <button
              onClick={() => setActiveAdminSubTab('jobMarket')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeAdminSubTab === 'jobMarket'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>إعلانات سوق العمل والباحثين عن عمل ({jobSeekers.length})</span>
            </button>

            <button
              onClick={() => setActiveAdminSubTab('playStoreLegal')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeAdminSubTab === 'playStoreLegal'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-500/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>متجر Google Play والسياسات وتواصل معنا</span>
              {supportTickets.filter(t => !t.isRead).length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                  {supportTickets.filter(t => !t.isRead).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveAdminSubTab('siteTexts')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeAdminSubTab === 'siteTexts'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-500/30'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>تعديل النصوص والأيقونات 📝🎨</span>
            </button>

            <button
              onClick={() => setActiveAdminSubTab('appIcon')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeAdminSubTab === 'appIcon'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>أيقونة وشعار التطبيق (PWA & Logo) 📱✨</span>
            </button>

            <button
              onClick={() => setActiveAdminSubTab('partnerPosts')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeAdminSubTab === 'partnerPosts'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>إعلانات شريك عمل ({partnerPosts.length}) 🤝</span>
            </button>

            <button
              onClick={() => setActiveAdminSubTab('homePanels')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeAdminSubTab === 'homePanels'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>إدارة بانلات الواجهة الرئيسية</span>
            </button>

            <button
              onClick={() => setActiveAdminSubTab('reports')}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                activeAdminSubTab === 'reports'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>البلاغات ({reports.filter(r => !r.isResolved).length})</span>
            </button>
          </div>

          {/* TAB 1: Verification Requests */}
          {activeAdminSubTab === 'requests' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  طلبات التحقق والتوثيق الواردة
                </h3>
                <p className="text-xs text-slate-500">
                  المستوى الأول: مطابقة بطاقة الهوية البيومترية مع الصورة الشخصية · المستوى الثاني: فحص صحة الدبلوم المهني
                </p>
              </div>

              <div className="space-y-4">
                {verificationRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      req.status === 'approved'
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : req.status === 'rejected'
                          ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={req.artisanAvatar}
                          alt={req.artisanName}
                          className="w-12 h-12 rounded-xl object-cover border border-amber-500/30"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {req.artisanName}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              req.level === 2 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' 
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}>
                              {req.level === 2 ? 'طلب توثيق المستوى 2 (دبلوم)' : 'طلب توثيق المستوى 1 (هوية)'}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            {req.trade} · {req.submittedAt}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          req.status === 'approved'
                            ? 'bg-emerald-600 text-white'
                            : req.status === 'rejected'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-500 text-white'
                        }`}>
                          {req.status === 'approved' ? 'تم الاعتماد بنجاح ✓' : req.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة والتدقيق'}
                        </span>
                      </div>
                    </div>

                    {/* Previews */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      {req.level === 1 && (
                        <>
                          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              بطاقة الهوية الوطنية البيومترية
                            </span>
                            <button
                              onClick={() => setPreviewImage(req.idCardImage || null)}
                              className="px-2.5 py-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 rounded-lg flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>معاينة الوثيقة</span>
                            </button>
                          </div>

                          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              الصورة الشخصية الحية (سيلفي)
                            </span>
                            <button
                              onClick={() => setPreviewImage(req.selfieImage || null)}
                              className="px-2.5 py-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 rounded-lg flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>معاينة الصورة</span>
                            </button>
                          </div>
                        </>
                      )}

                      {req.level === 2 && (
                        <div className="sm:col-span-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                              {req.diplomaTitle || 'الدبلوم أو الشهادة المهنية التخصصية'}
                            </span>
                            <span className="text-[11px] text-slate-400">وثيقة صادرة من مركز تكوين مهني معتمد.</span>
                          </div>
                          <button
                            onClick={() => setPreviewImage(req.diplomaImage || null)}
                            className="px-3 py-1.5 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 rounded-xl flex items-center gap-1 shrink-0"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>فحص الشهادة بوضوح</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => approveVerification(req.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-4 h-4" />
                          <span>اعتماد التوثيق وترقية البطاقة المهنية</span>
                        </button>

                        <button
                          onClick={() => rejectVerification(req.id)}
                          className="px-4 py-2 bg-slate-200 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 rounded-xl text-xs font-semibold"
                        >
                          طلب إعادة رفع الوثائق
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Full User & Artisan Account Management (Edit, Delete, Suspend, Upgrade) */}
          {activeAdminSubTab === 'users' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  إدارة الحسابات الكاملة (تعديل، حذف نهائي، توقيف وترقية)
                </h3>
                <p className="text-xs text-slate-500">
                  يمكن للأدمن حذف أي حساب نهائياً، توقيف الحساب مؤقتاً، تعديل بيانات المهنة والأسعار، وترقية المستوى.
                </p>
              </div>

              <div className="space-y-3">
                {artisans.map((artisan) => (
                  <div
                    key={artisan.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                      artisan.isSuspended 
                        ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900 opacity-80' 
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={artisan.avatar}
                          alt={artisan.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400"
                          referrerPolicy="no-referrer"
                        />
                        {artisan.isSuspended && (
                          <div className="absolute inset-0 bg-rose-950/70 rounded-2xl flex items-center justify-center text-rose-300 font-bold text-[10px]">
                            موقوف
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {artisan.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {artisan.verification.matricule}
                          </span>
                          {artisan.isSuspended && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold">
                              حساب موقوف
                            </span>
                          )}
                        </div>

                        <span className="text-xs text-slate-500 block">
                          {artisan.bio} · {artisan.city} · {artisan.hourlyRate} دج/ساعة
                        </span>

                        <div className="flex items-center gap-2 pt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            artisan.verification.level === 2
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : artisan.verification.level === 1
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            المستوى {artisan.verification.level}
                          </span>
                          <span className="text-[10px] text-slate-400">⭐ {artisan.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Action Controls */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Level switcher buttons */}
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => updateArtisanLevel(artisan.id, 0)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            artisan.verification.level === 0 ? 'bg-slate-800 text-white' : 'text-slate-500'
                          }`}
                        >
                          مستوى 0
                        </button>
                        <button
                          onClick={() => updateArtisanLevel(artisan.id, 1)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            artisan.verification.level === 1 ? 'bg-blue-600 text-white' : 'text-blue-600'
                          }`}
                        >
                          مستوى 1
                        </button>
                        <button
                          onClick={() => updateArtisanLevel(artisan.id, 2)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            artisan.verification.level === 2 ? 'bg-emerald-600 text-white' : 'text-emerald-600'
                          }`}
                        >
                          مستوى 2
                        </button>
                      </div>

                      {/* Card Preview */}
                      <button
                        onClick={() => handleOpenArtisanCard(artisan)}
                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-xl text-xs font-bold flex items-center gap-1"
                        title="معاينة البطاقة المهنية"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>البطاقة</span>
                      </button>

                      {/* Edit Info */}
                      <button
                        onClick={() => setEditingArtisan(artisan)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1"
                        title="تعديل الحساب"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>

                      {/* Suspend / Reactivate */}
                      <button
                        onClick={() => toggleArtisanSuspension(artisan.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                          artisan.isSuspended
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        }`}
                        title={artisan.isSuspended ? 'إلغاء التوقيف' : 'توقيف مؤقت'}
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{artisan.isSuspended ? 'إلغاء التوقيف' : 'توقيف'}</span>
                      </button>

                      {/* Delete Account Completely */}
                      {confirmDeleteArtisanId === artisan.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 p-1 rounded-xl border border-rose-300 dark:border-rose-800">
                          <span className="text-[10px] text-rose-600 font-bold px-1">تأكيد؟</span>
                          <button
                            onClick={() => {
                              deleteArtisan(artisan.id);
                              setConfirmDeleteArtisanId(null);
                            }}
                            className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700"
                          >
                            نعم
                          </button>
                          <button
                            onClick={() => setConfirmDeleteArtisanId(null)}
                            className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px]"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteArtisanId(artisan.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                          title="حذف الحساب نهائياً"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Client Management Section */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">إدارة حسابات العملاء</h3>
                <div className="space-y-3">
                  {clientAccounts.map((client) => (
                    <div key={client.id} className="p-4 rounded-2xl border bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full" />
                        <div><span className="font-bold text-sm text-slate-900 dark:text-white block">{client.name}</span><span className="text-xs text-slate-500">{client.phone}</span></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleClientSuspension(client.id)} className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-[10px] font-bold">توقيف</button>
                        {confirmDeleteClientId === client.id ? (
                          <button onClick={() => { deleteClientAccount(client.id); setConfirmDeleteClientId(null); }} className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold">تأكيد</button>
                        ) : (
                          <button onClick={() => setConfirmDeleteClientId(client.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EDIT ARTISAN MODAL */}
          {editingArtisan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-4">
                <button
                  onClick={() => setEditingArtisan(null)}
                  className="absolute rtl:left-4 ltr:right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  تعديل بيانات الحساب: {editingArtisan.name}
                </h3>

                <form onSubmit={handleSaveEditArtisan} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      required
                      value={editingArtisan.name}
                      onChange={(e) => setEditingArtisan({ ...editingArtisan, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      المهنة والتخصص
                    </label>
                    <input
                      type="text"
                      required
                      value={editingArtisan.bio}
                      onChange={(e) => setEditingArtisan({ ...editingArtisan, bio: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        المدينة / الولاية
                      </label>
                      <input
                        type="text"
                        value={editingArtisan.city}
                        onChange={(e) => setEditingArtisan({ ...editingArtisan, city: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        التكلفة بالساعة (دج)
                      </label>
                      <input
                        type="number"
                        value={editingArtisan.hourlyRate}
                        onChange={(e) => setEditingArtisan({ ...editingArtisan, hourlyRate: Number(e.target.value) })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs"
                    >
                      حفظ التعديلات
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingArtisan(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* EDIT CRAFT & IMAGE MODAL (تغيير الصور وأسماء الحرف والوصف للأدمن) */}
          {editingCraft && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-4 my-6">
                <button
                  onClick={() => setEditingCraft(null)}
                  className="absolute rtl:left-4 ltr:right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-amber-500" />
                    <span>تعديل الحرفة: {editingCraft.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    تغيير اسم الحرفة، الوصف، الصورة الحالية المعروضة للزبائن، أو الخدمات الفرعية.
                  </p>
                </div>

                {craftSaveSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>تم حفظ تعديلات الحرفة والصورة بنجاح في التطبيق! ✓</span>
                  </div>
                )}

                <form onSubmit={handleSaveEditCraft} className="space-y-4">
                  {/* Craft Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      اسم الحرفة / المهنة:
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCraft.name}
                      onChange={(e) => setEditingCraft({ ...editingCraft, name: e.target.value, nameEn: e.target.value, nameFr: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Craft Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      وصف الحرفة والتخصصات:
                    </label>
                    <textarea
                      rows={2}
                      value={editingCraft.description}
                      onChange={(e) => setEditingCraft({ ...editingCraft, description: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Craft Image URL & Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      صورة الحرفة المعتمدة (رابط أو رفع من الجهاز):
                    </label>
                    
                    {/* Preview */}
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 mb-2">
                      <img
                        src={editingCraft.image}
                        alt={editingCraft.name}
                        className="w-16 h-16 rounded-xl object-cover border border-amber-500/40 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <input
                          type="url"
                          value={editingCraft.image}
                          onChange={(e) => setEditingCraft({ ...editingCraft, image: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-1.5 text-[11px] font-mono text-slate-900 dark:text-white"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <label className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1">
                            <Upload className="w-3 h-3" />
                            <span>رفع صورة جديدة من جهازك</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCraftImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Quick Image Presets */}
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">أو اختر صورة احترافية جاهزة:</span>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {[
                          'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=600&auto=format&fit=crop&q=80',
                          'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=80'
                        ].map((presetUrl, pIdx) => (
                          <img
                            key={pIdx}
                            src={presetUrl}
                            alt="نموذج"
                            onClick={() => setEditingCraft({ ...editingCraft, image: presetUrl })}
                            className={`w-10 h-10 rounded-lg object-cover cursor-pointer border-2 transition-all ${
                              editingCraft.image === presetUrl ? 'border-amber-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sub-services overview & management */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      الخدمات الفرعية والتسعيرة التقديرية ({editingCraft.subServices.length}):
                    </label>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto p-1 border rounded-xl bg-slate-50 dark:bg-slate-800/40">
                      {editingCraft.subServices.map((sub, sIdx) => (
                        <div key={sub.id || sIdx} className="p-2 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-between text-xs border border-slate-200 dark:border-slate-700">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{sub.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono font-bold">{sub.estimatedPrice}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCraft({
                                  ...editingCraft,
                                  subServices: editingCraft.subServices.filter((_, idx) => idx !== sIdx)
                                });
                              }}
                              className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="حذف الخدمة الفرعية"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add new sub-service row */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="اسم الخدمة الفرعية..."
                        value={newSubServiceName}
                        onChange={(e) => setNewSubServiceName(e.target.value)}
                        className="flex-1 bg-white dark:bg-slate-900 border rounded-xl px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="السعر (مثال: 3000 دج)"
                        value={newSubServicePrice}
                        onChange={(e) => setNewSubServicePrice(e.target.value)}
                        className="w-28 bg-white dark:bg-slate-900 border rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newSubServiceName.trim()) return;
                          setEditingCraft({
                            ...editingCraft,
                            subServices: [
                              ...editingCraft.subServices,
                              {
                                id: `sub_${Date.now()}`,
                                name: newSubServiceName.trim(),
                                nameEn: newSubServiceName.trim(),
                                nameFr: newSubServiceName.trim(),
                                description: newSubServiceName.trim(),
                                estimatedPrice: newSubServicePrice || '2000 - 5000 دج',
                                iconName: editingCraft.icon || 'Wrench',
                                image: editingCraft.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80'
                              }
                            ]
                          });
                          setNewSubServiceName('');
                        }}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة</span>
                      </button>
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>حفظ التعديلات في التطبيق</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCraft(null)}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: Crafts & Services Management */}
          {activeAdminSubTab === 'crafts' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    إدارة منظومة الحرف والخدمات
                  </h3>
                  <p className="text-xs text-slate-500">
                    إضافة حرف جديدة، حذف الحرف، أو تعديل باقات الخدمات المعروضة للزبائن.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddCraftModalOpen(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-sm transition-transform active:scale-95"
                  title="إضافة حرفة جديدة مع رفع صورها وصور الخدمات الفرعية"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة حرفة جديدة مع صورها</span>
                </button>
              </div>

              {/* Add Craft Form */}
              {isAddCraftOpen && (
                <form onSubmit={handleCreateCraft} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    إضافة تصنيف حرفي جديد:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="اسم الحرفة (مثال: صيانة المصاعد والسلالم الكهربائية)..."
                      value={newCraftName}
                      onChange={(e) => setNewCraftName(e.target.value)}
                      className="bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                    <input
                      type="url"
                      placeholder="رابط صورة الخدمة..."
                      value={newCraftImage}
                      onChange={(e) => setNewCraftImage(e.target.value)}
                      className="bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none font-mono"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="وصف الحرفة والتخصصات التابعة لها..."
                    value={newCraftDesc}
                    onChange={(e) => setNewCraftDesc(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs"
                    >
                      إضافة الحرفة إلى المنصة
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddCraftOpen(false)}
                      className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}

              {/* Crafts List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <React.Fragment key={cat.id}>
                  <div
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {cat.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <button
                            onClick={() => setEditingCraft(cat)}
                            className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                            title="تعديل اسم الحرفة، الوصف، والصورة"
                          >
                            <Edit3 className="w-2.5 h-2.5" />
                            <span>تعديل الحرفة والصورة</span>
                          </button>
                          <button
                            onClick={() => {
                              setAdminEditModalTarget({
                                type: 'icon',
                                id: `icon_${cat.id}`,
                                title: `أيقونة حرفة: ${cat.name}`,
                                currentValue: cat.icon,
                                categoryId: cat.id
                              });
                            }}
                            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 rounded-lg text-[10px] font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs border border-amber-300 dark:border-amber-800"
                            title="تعديل أو رفع أيقونة جديدة لهذه الحرفة"
                          >
                            <span className="w-4 h-4 flex items-center justify-center shrink-0">
                              <AppIconRenderer icon={cat.icon} className="w-3.5 h-3.5" />
                            </span>
                            <span>تغيير / رفع أيقونة 🎨</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {confirmDeleteCatId === cat.id ? (
                      <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 p-1 rounded-xl border border-rose-300 dark:border-rose-800 shrink-0">
                        <span className="text-[10px] text-rose-600 font-bold px-1">حذف؟</span>
                        <button
                          onClick={() => {
                            deleteCategory(cat.id);
                            setConfirmDeleteCatId(null);
                          }}
                          className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700"
                        >
                          نعم
                        </button>
                        <button
                          onClick={() => setConfirmDeleteCatId(null)}
                          className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px]"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteCatId(cat.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                        title="حذف الحرفة نهائياً من المنصة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Hero Billboard Management (Images / Videos / Custom Text & Toggle) */}
          {activeAdminSubTab === 'billboard' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  التحكم في اللوحة الإعلانية الكبرى (صور / فيديو / نص إعلاني)
                </h3>
                <p className="text-xs text-slate-500">
                  لوحة تفاعلية بارزة في واجهة التطبيق الرئيسية، يمكنك إخفاؤها أو إظهارها، وتعيين صورة أو فيديو وكتابة ما تريد.
                </p>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visibility Toggle */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      حالة اللوحة الكبرى في الواجهة:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {billboardConfig.isVisible ? 'اللوحة معروضة حالياً لجميع الزوار' : 'اللوحة مخفية حالياً'}
                    </span>
                  </div>

                  <button
                    onClick={() => setBillboardConfig(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                      billboardConfig.isVisible
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {billboardConfig.isVisible ? 'ظاهرة (مفعلة) ✓' : 'مخفية'}
                  </button>
                </div>

                {/* Media Type Selection */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      نوع الوسائط (ميديا):
                    </span>
                    <span className="text-[11px] text-slate-500">
                      صورة فوتوغرافية أو فيديو متحرك
                    </span>
                  </div>

                  <div className="flex gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setBillboardConfig(prev => ({ ...prev, mediaType: 'image' }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        billboardConfig.mediaType === 'image' ? 'bg-amber-500 text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>صورة</span>
                    </button>
                    <button
                      onClick={() => setBillboardConfig(prev => ({ ...prev, mediaType: 'video' }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        billboardConfig.mediaType === 'video' ? 'bg-amber-500 text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>فيديو</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رابط ملف الوسائط (رابط الصورة أو رابط فيديو mp4):
                  </label>
                  <input
                    type="text"
                    value={billboardConfig.mediaUrl}
                    onChange={(e) => setBillboardConfig(prev => ({ ...prev, mediaUrl: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                    placeholder="https://.../video.mp4 أو رابط صورة"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    العنوان البارز في اللوحة:
                  </label>
                  <input
                    type="text"
                    value={billboardConfig.title}
                    onChange={(e) => setBillboardConfig(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    النص الوصفي والشرح (كتابة شيء ما):
                  </label>
                  <textarea
                    rows={2}
                    value={billboardConfig.description}
                    onChange={(e) => setBillboardConfig(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      الشعار المصاحب (Badge):
                    </label>
                    <input
                      type="text"
                      value={billboardConfig.badge}
                      onChange={(e) => setBillboardConfig(prev => ({ ...prev, badge: e.target.value }))}
                      className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      نص زر الإجراء (Button Text):
                    </label>
                    <input
                      type="text"
                      value={billboardConfig.buttonText}
                      onChange={(e) => setBillboardConfig(prev => ({ ...prev, buttonText: e.target.value }))}
                      className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: 5cm x 5cm Square Video/Image Spotlight (منطقة 5 سم طول و 5 سم عرض) */}
          {activeAdminSubTab === 'square5x5' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  إدارة منطقة العرض المربعة (5 سم × 5 سم) بالفيديو أو الصورة
                </h3>
                <p className="text-xs text-slate-500">
                  نشر مقطع فيديو أو صورة بحجم 5 سم بالطول و 5 سم بالعرض، محملة مباشرة من الهاتف أو برابط، مع عنوان أو نص أو بدونهما.
                </p>
              </div>

              {/* Visibility and Media Type Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      ظهور منطقة 5×5 سم في التطبيق:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {squareSpotlightConfig.isVisible ? 'المنطقة ظاهرة ومعروضة للزوار' : 'المنطقة مخفية حالياً'}
                    </span>
                  </div>

                  <button
                    onClick={() => setSquareSpotlightConfig(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                      squareSpotlightConfig.isVisible
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {squareSpotlightConfig.isVisible ? 'مفعلة وظاهرة ✓' : 'مخفية'}
                  </button>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      نوع الوسائط (ميديا):
                    </span>
                    <span className="text-[11px] text-slate-500">
                      مقطع فيديو متحرك أو صورة فوتوغرافية
                    </span>
                  </div>

                  <div className="flex gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setSquareSpotlightConfig(prev => ({ ...prev, mediaType: 'image' }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        squareSpotlightConfig.mediaType === 'image' ? 'bg-amber-500 text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>صورة</span>
                    </button>
                    <button
                      onClick={() => setSquareSpotlightConfig(prev => ({ ...prev, mediaType: 'video' }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        squareSpotlightConfig.mediaType === 'video' ? 'bg-amber-500 text-white' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>فيديو</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload from Phone OR Link input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Phone upload */}
                <div className="p-4 bg-amber-50/70 dark:bg-amber-950/20 border-2 border-dashed border-amber-400 dark:border-amber-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        إرسال فيديو أو صورة محملة من الهاتف مباشرة
                      </span>
                      <span className="text-[10px] text-slate-500">
                        اختر ملف فيديو mp4 أو صورة من ملفات هاتفك
                      </span>
                    </div>
                  </div>

                  <label className="block w-full text-center py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs">
                    <span>تحميل ملف الميديا من الجهاز</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleSpotlightFileUpload}
                    />
                  </label>
                </div>

                {/* 2. Direct Link */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    أو بواسطة رابط الميديا (URL):
                  </span>
                  <input
                    type="text"
                    value={squareSpotlightConfig.mediaUrl}
                    onChange={(e) => setSquareSpotlightConfig(prev => ({ ...prev, mediaUrl: e.target.value }))}
                    placeholder="https://.../video.mp4 أو رابط صورة"
                    className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    يدعم روابط الفيديو المباشرة ومصادر الصور عالية الوضوح.
                  </span>
                </div>
              </div>

              {/* Optional Title, Text, and Link */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      عنوان المنطقة (اختياري - يمكن تركه فارغاً وبدونه):
                    </label>
                    <input
                      type="text"
                      value={squareSpotlightConfig.title || ''}
                      onChange={(e) => setSquareSpotlightConfig(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="اتركه فارغاً لنشر الفيديو/الصورة بدون عنوان..."
                      className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      شارة الشاشة (Badge):
                    </label>
                    <input
                      type="text"
                      value={squareSpotlightConfig.badge || ''}
                      onChange={(e) => setSquareSpotlightConfig(prev => ({ ...prev, badge: e.target.value }))}
                      placeholder="5×5 cm"
                      className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نص وشرح إضافي (اختياري - يمكن تركه فارغاً وبدونه):
                  </label>
                  <textarea
                    rows={2}
                    value={squareSpotlightConfig.text || ''}
                    onChange={(e) => setSquareSpotlightConfig(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="اتركه فارغاً إذا كنت تريد عرض الوسائط فقط بدون نص..."
                    className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رابط التحويل عند النقر (Link URL - اختياري):
                  </label>
                  <input
                    type="text"
                    value={squareSpotlightConfig.linkUrl || ''}
                    onChange={(e) => setSquareSpotlightConfig(prev => ({ ...prev, linkUrl: e.target.value }))}
                    placeholder="works أو radar أو رابط خارجي https://..."
                    className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Live Preview Box with exact 5cm x 5cm dimensions */}
              <div className="p-4 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  معاينة حية للمنطقة بالأبعاد الحقيقية (5 سم طول × 5 سم عرض):
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div
                    style={{ width: '5cm', height: '5cm' }}
                    className="rounded-2xl overflow-hidden bg-black border-2 border-amber-500 shadow-md relative aspect-square shrink-0 flex items-center justify-center"
                  >
                    {squareSpotlightConfig.mediaType === 'video' ? (
                      <video
                        src={squareSpotlightConfig.mediaUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={squareSpotlightConfig.mediaUrl}
                        alt="5x5 Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[9px]">
                      5×5 cm
                    </span>
                  </div>

                  <div className="space-y-1 text-start">
                    {squareSpotlightConfig.title && (
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {squareSpotlightConfig.title}
                      </h4>
                    )}
                    {squareSpotlightConfig.text && (
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {squareSpotlightConfig.text}
                      </p>
                    )}
                    {!squareSpotlightConfig.title && !squareSpotlightConfig.text && (
                      <p className="text-xs text-slate-400 italic">
                        (يتم عرض الوسائط بحجم 5×5 سم بدون عنوان أو نص وفق اختيارك)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Push Notifications & Firebase FCM */}
          {activeAdminSubTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  إرسال الإشعارات الفورية والربط بـ Firebase Cloud Messaging (FCM)
                </h3>
                <p className="text-xs text-slate-500">
                  إرسال إشعارات فورية لجميع الأجهزة لتحديث التطبيق، أو نشر إعلان عام، أو تنبيهات أمنية.
                </p>
              </div>

              {/* Firebase Status Card */}
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    FCM
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                      خادم Firebase Cloud Messaging متصل وجاهز للإرسال
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      Project: {firebaseConfig.projectId} · Version: {firebaseConfig.appCurrentVersion}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold self-start sm:self-auto">
                  خدمة الإشعارات متصلة
                </span>
              </div>

              {/* Dispatcher Form */}
              <form onSubmit={handleSendNotification} className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      نوع الإشعار:
                    </label>
                    <select
                      value={notifType}
                      onChange={(e: any) => setNotifType(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="announcement">📢 نشر إعلان أو تنبيه عام</option>
                      <option value="update">🚀 إشعار تحديث التطبيق (App Update Required)</option>
                      <option value="alert">⚠️ تنبيه أمني أو إداري عاجل</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      الجمهور المستهدف:
                    </label>
                    <select
                      value={notifAudience}
                      onChange={(e: any) => setNotifAudience(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="all">الجميع (كافة العملاء والحرفيين)</option>
                      <option value="artisans">الحرفيون والمهنيون فقط</option>
                      <option value="clients">طالبو الخدمات (العملاء) فقط</option>
                    </select>
                  </div>
                </div>

                {/* Update fields if notifType === 'update' */}
                {notifType === 'update' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-300 dark:border-amber-800">
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                        رقم الإصدار الجديد (Version):
                      </label>
                      <input
                        type="text"
                        value={notifVersion}
                        onChange={(e) => setNotifVersion(e.target.value)}
                        placeholder="v2.5.0"
                        className="w-full bg-white dark:bg-slate-900 border rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1">
                        رابط تحميل التحديث (Play Store / App Store):
                      </label>
                      <input
                        type="url"
                        value={notifUpdateUrl}
                        onChange={(e) => setNotifUpdateUrl(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    عنوان الإشعار *
                  </label>
                  <input
                    type="text"
                    required
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="مثال: تحديث عاجل لمنصة خدام / إطلاق ميزة جديدة"
                    className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نص الإشعار والتفاصيل *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    placeholder="اكتب نص الإشعار الذي سيظهر لجميع المستخدمين في أجهزتهم..."
                    className="w-full bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                {/* Additional Links & Notes (الروابط والملاحظات والتنويهات) */}
                <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl space-y-3 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5 text-amber-500" />
                    <span>إرسال الروابط والملاحظات التنويهية (اختياري):</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        رابط التوجيه (Action Link - خارجي أو شاشة داخلية):
                      </label>
                      <input
                        type="text"
                        value={notifActionLink}
                        onChange={(e) => setNotifActionLink(e.target.value)}
                        placeholder="https://... أو radar أو works أو quotes"
                        className="w-full bg-white dark:bg-slate-900 border rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        نص زر الرابط:
                      </label>
                      <input
                        type="text"
                        value={notifLinkText}
                        onChange={(e) => setNotifLinkText(e.target.value)}
                        placeholder="مثال: فتح الرابط / الانتقال الآن"
                        className="w-full bg-white dark:bg-slate-900 border rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      ملاحظة أو تنويه هام (Note / Disclaimer):
                    </label>
                    <input
                      type="text"
                      value={notifNote}
                      onChange={(e) => setNotifNote(e.target.value)}
                      placeholder="تنويه: يرجى تحديث التطبيق قبل نهاية الأسبوع للاستفادة من مزايا الأمان..."
                      className="w-full bg-white dark:bg-slate-900 border rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {notifSentSuccess ? (
                  <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>تم إرسال الإشعار الفوري بنجاح عبر Firebase لجميع الأجهزة المستهدفة!</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                  >
                    <Send className="w-4 h-4 rtl:rotate-180" />
                    <span>إرسال الإشعار الفوري عبر Firebase الآن</span>
                  </button>
                )}
              </form>

              {/* Sent Notifications History */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  سجل الإشعارات المرسلة:
                </h4>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-200 dark:bg-slate-700">
                          {n.type === 'update' ? 'تحديث تطبيق' : n.type === 'alert' ? 'تنبيه أمني' : n.type === 'note' ? 'ملاحظة وتنويه' : 'إعلان'}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">{n.message}</p>
                      {n.note && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">
                          تنويه: {n.note}
                        </span>
                      )}
                      {n.actionLink && (
                        <span className="text-[10px] text-blue-500 font-mono block">
                          رابط: {n.actionLink}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.sentAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: Security, Cryptography & App Hardening (تشفير التطبيق وحمايته) */}
          {activeAdminSubTab === 'security' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>تشفير التطبيق وحمايته المركزية (End-to-End Cryptography & Hardening)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  إدارة بروتوكولات الأمان المشددة، تشفير المحادثات والمكالمات الصوتية، وحجب أرقام هواتف العملاء والحرفيين.
                </p>
              </div>

              {/* Security Status Card */}
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/20 border-2 border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-emerald-950 dark:text-emerald-300 block">
                      نظام التشفير والحماية يعمل بكامل الكفاءة (AES-256-GCM)
                    </span>
                    <span className="text-xs text-slate-500 font-mono block mt-0.5">
                      بصمة المفتاح المشفر: {appSecurityConfig.encryptionKeyFingerprint}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleRefreshSecurityKeys}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{securityRefreshedSuccess ? 'تم توليد مفاتيح جديدة بنجاح ✓' : 'توليد مفاتيح تشفير جديدة'}</span>
                </button>
              </div>

              {/* Security Modules Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. AES-256 Encryption */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      التشفير التام للبيانات (AES-256-GCM):
                    </span>
                    <span className="text-[11px] text-slate-500">
                      تشفير الرسائل والمستندات وعروض الأسعار بين الطرفين.
                    </span>
                  </div>

                  <button
                    onClick={() => setAppSecurityConfig(prev => ({ ...prev, isEncryptionActive: !prev.isEncryptionActive }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      appSecurityConfig.isEncryptionActive ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {appSecurityConfig.isEncryptionActive ? 'مفعل ✓' : 'معطل'}
                  </button>
                </div>

                {/* 2. Phone Call & Number Masking */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      حجب الأرقام والمكالمات المشفرة:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      إجراء المكالمات الصوتية الآمنة بدون كشف رقم هاتف الطرفين.
                    </span>
                  </div>

                  <button
                    onClick={() => setAppSecurityConfig(prev => ({ ...prev, isCallMaskingActive: !prev.isCallMaskingActive }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      appSecurityConfig.isCallMaskingActive ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {appSecurityConfig.isCallMaskingActive ? 'مفعل ✓' : 'معطل'}
                  </button>
                </div>

                {/* 3. Payload Sanitization & Anti-XSS */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      فلترة المدخلات والحماية من الحقن (Anti-XSS):
                    </span>
                    <span className="text-[11px] text-slate-500">
                      تنقية المحادثات والتعليقات من أي أكواد ضارة أو روابط غير آمنة.
                    </span>
                  </div>

                  <button
                    onClick={() => setAppSecurityConfig(prev => ({ ...prev, isPayloadSanitizationActive: !prev.isPayloadSanitizationActive }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      appSecurityConfig.isPayloadSanitizationActive ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {appSecurityConfig.isPayloadSanitizationActive ? 'مفعل ✓' : 'معطل'}
                  </button>
                </div>

                {/* 4. Anti-Tampering Signatures */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      ختم التوقيع الرقمي لمنع التلاعب:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      التأكد من سلامة ملفات التطبيق والبطاقات المهنية الرقمية.
                    </span>
                  </div>

                  <button
                    onClick={() => setAppSecurityConfig(prev => ({ ...prev, isAntiTamperingActive: !prev.isAntiTamperingActive }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      appSecurityConfig.isAntiTamperingActive ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {appSecurityConfig.isAntiTamperingActive ? 'مفعل ✓' : 'معطل'}
                  </button>
                </div>
              </div>

              {/* Security Audit Details */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  سجل وتفاصيل التدقيق الأمني الدوري:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">تاريخ آخر تدقيق أمني</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {appSecurityConfig.lastAuditDate}
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">صلاحية جلسة الدخول المشفرة</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {appSecurityConfig.sessionTokenExpiryHours} ساعة
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block">معيار التشفير المعتمد</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      TLS 1.3 / AES-256
                    </span>
                  </div>
                </div>
              </div>

                {/* Admin Master Password Cryptographic Management */}
                <div className="mt-4 p-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          إدارة وتشفير كلمة سر المشرف (SHA-256 Cryptographic Hash)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          كلمة السر مشفرة وغير ظاهرة نهائياً؛ المقارنة تتم حصراً عبر البصمة الرياضية SHA-256.
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20 self-start sm:self-auto">
                      ✓ مشفرة وغير قابلة للعكس
                    </span>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          كلمة السر المشفرة الجديدة:
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••••••"
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          تأكيد كلمة السر:
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••••••"
                          value={confirmAdminPassword}
                          onChange={(e) => setConfirmAdminPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {passwordChangeError && (
                      <div className="p-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{passwordChangeError}</span>
                      </div>
                    )}

                    {passwordChangeSuccess && (
                      <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>تم تشفير وتحديث كلمة سر المشرف بنجاح عبر SHA-256!</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>تشفير وحفظ كلمة السر الجديدة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          resetAdminPassword();
                          setPasswordChangeSuccess(true);
                          setPasswordChangeError(null);
                          setTimeout(() => setPasswordChangeSuccess(false), 3000);
                        }}
                        className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        استعادة البصمة الافتراضية
                      </button>
                    </div>
                  </form>
                </div>
              </div>
          )}

          {/* TAB 7: Community Posts Moderation */}
          {activeAdminSubTab === 'posts' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  مراقبة وإشراف على منشورات ومشاريع المعرض
                </h3>
                <p className="text-xs text-slate-500">
                  مراجعة تفاعل المستخدمين (القلوب والتعليقات)، وحذف أي منشور مخالف لمعايير المجتمع.
                </p>
              </div>

              <div className="space-y-4">
                {workPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                          {post.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 block">
                          الناشر: <span className="font-semibold text-slate-700 dark:text-slate-300">{post.authorName}</span> · {post.location}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1 text-rose-500 font-bold">
                            <Heart className="w-3 h-3 fill-rose-500" />
                            <span>{post.likesCount} قلوب</span>
                          </span>
                          <span className="flex items-center gap-1 text-amber-500 font-bold">
                            <MessageSquare className="w-3 h-3" />
                            <span>{post.comments.length} تعليقات</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteWorkPost(post.id)}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف المنشور المخالف</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: Live Chat Supervision (مراقبة محادثات الحرفيين والعملاء وتأكد من عملها) */}
          {activeAdminSubTab === 'chats' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px] border border-amber-500/20">
                      غرفة المراقبة والتحكيم المباشر
                    </span>
                    <span className="text-xs font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                      AES-256 مشفرة
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    مراقبة وإشراف على محادثات العملاء والحرفيين (Live Oversight)
                  </h3>
                  <p className="text-xs text-slate-500">
                    يمكن للمشرف الإداري الاطلاع على كامل الرسائل المتبادلة، الصور المرفقة، التدخل بتنبيه أمان رسمي، أو حذف الرسائل المخالفة فوراً.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {confirmClearChat ? (
                    <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded-xl border border-rose-300 dark:border-rose-800">
                      <span className="text-[11px] text-rose-600 font-bold">تأكيد مسح كافة المحادثات؟</span>
                      <button
                        onClick={() => {
                          clearChatMessages();
                          setConfirmClearChat(false);
                        }}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                      >
                        نعم مسح الكل
                      </button>
                      <button
                        onClick={() => setConfirmClearChat(false)}
                        className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsChatDiagnosticsOpen(true)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        title="فتح فاحص واختبار الدردشة والاتصال المباشر"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تشغيل فاحص واختبار الدردشة والاتصال</span>
                      </button>

                      <button
                        onClick={() => setConfirmClearChat(true)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title="مسح سجل المحادثات بالكامل"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>تفريغ السجل</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Channels & Filter Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all', label: 'جميع المحادثات', count: messages.length },
                    { id: 'art_1', label: 'المعلم كمال ↔ هشام بن علي', badge: 'سباكة' },
                    { id: 'art_2', label: 'حميد بن عمار ↔ سمير قدور', badge: 'كهرباء' },
                    { id: 'art_3', label: 'رشيد حداد ↔ فاطمة الزهراء', badge: 'نجارة' }
                  ].map((chan) => (
                    <button
                      key={chan.id}
                      onClick={() => setSelectedChatParticipant(chan.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        selectedChatParticipant === chan.id
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{chan.label}</span>
                      {chan.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20">
                          {chan.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="بحث في محتوى الرسائل..."
                    value={chatSearchFilter}
                    onChange={(e) => setChatSearchFilter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Official Admin Intervention Box */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300 dark:border-amber-700/60 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-800 dark:text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>إرسال تنبيه أو توجيه رسمي من الإدارة إلى المحادثة المباشرة</span>
                  </div>
                  {adminNoticeSent && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
                      <Check className="w-3.5 h-3.5" />
                      <span>تم بث التنبيه في المحادثة بنجاح!</span>
                    </span>
                  )}
                </div>

                <form onSubmit={handleSendAdminNotice} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="اكتب التنبيه الرسمي (مثال: نذكر الطرفين بوجوب الالتزام بالأمانة وتوثيق كافة التكاليف)..."
                    value={adminNoticeText}
                    onChange={(e) => setAdminNoticeText(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                    <span>إرسال التنبيه</span>
                  </button>
                </form>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="text-slate-400">قوالب سريعة:</span>
                  {[
                    'تنبيه: يُمنع تداول أرقام الهواتف أو التعامل خارج التطبيق لضمان حقوقكم.',
                    'تذكير رسمي: نلزم كافة الحرفيين باحترام حرمة المنازل وإتقان العمل.',
                    'إشعار إداري: تم توثيق تفاصيل الطلب بنجاح لدى مركز خدمة العملاء.'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAdminNoticeText(preset)}
                      className="px-2 py-0.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-600 rounded-md border border-slate-200 dark:border-slate-700 text-[10px] transition-colors"
                    >
                      {preset.slice(0, 35)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages Feed */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto p-3 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                {messages
                  .filter(m => {
                    if (chatSearchFilter.trim()) {
                      const q = chatSearchFilter.toLowerCase();
                      return m.text.toLowerCase().includes(q) || m.senderName.toLowerCase().includes(q);
                    }
                    return true;
                  })
                  .map((msg) => {
                    const isAdmin = msg.senderRole === 'admin';
                    const isClient = msg.senderRole === 'client';
                    return (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                          isAdmin
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200'
                            : isClient
                              ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60'
                              : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {msg.senderName}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isAdmin
                                ? 'bg-amber-500 text-slate-950'
                                : isClient
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-emerald-600 text-white'
                            }`}>
                              {isAdmin ? 'إدارة المنصة' : isClient ? 'طالب خدمة (عميل)' : 'حرفي معتمد (المعلم)'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {msg.timestamp}
                            </span>
                          </div>

                          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                            {msg.text}
                          </p>

                          {/* Image Attachment Preview */}
                          {msg.imageUrl && (
                            <div className="pt-1.5 flex items-center gap-2">
                              <img
                                src={msg.imageUrl}
                                alt="مرفق محادثة"
                                onClick={() => setPreviewImage(msg.imageUrl || null)}
                                className="w-20 h-20 object-cover rounded-xl border-2 border-amber-400 cursor-pointer hover:opacity-90 shadow-xs"
                              />
                              <span className="text-[11px] text-slate-500">
                                اضغط للتكبير والفحص الإداري
                              </span>
                            </div>
                          )}

                          {/* Audio note */}
                          {msg.isAudio && (
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
                              <span>تسجيل صوتي استفساري</span>
                              <span className="font-mono text-amber-600 font-bold">{msg.audioDuration || '0:16'}</span>
                            </div>
                          )}
                        </div>

                        {/* Admin Action: Delete message */}
                        <div className="shrink-0 flex items-center gap-1.5 self-end sm:self-start">
                          <button
                            onClick={() => deleteChatMessage(msg.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="حذف هذه الرسالة إدارياً"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 9: Media & Images Manager (تحكم الأدمن في جميع الصور وتعديلها وحذف الخدمات) */}
          {activeAdminSubTab === 'mediaManager' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[11px] border border-amber-500/20">
                      إدارة الوسائط والصور الميدانية
                    </span>
                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-300">
                      {categories.length} خدمات معتمدة
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    مركز التحكم الشامل في جميع صور المنصة وحذف وتعديل الخدمات
                  </h3>
                  <p className="text-xs text-slate-500">
                    يمكن للمشرف تغيير صور جميع الخدمات والحرف، صور اللوحة الكبرى، لوحة 5×5، إضافة أو حذف أي خدمة، وتعديل الأسعار والخدمات الفرعية فورياً.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddCraftOpen(true)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة حرفة / خدمة جديدة</span>
                  </button>
                </div>
              </div>

              {/* Filter pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'كل الصور والخدمات' },
                  { id: 'categories', label: `صور الحرف والخدمات (${categories.length})` },
                  { id: 'billboard', label: 'اللوحة الكبرى (Billboard Hero)' },
                  { id: 'square', label: 'لوحة 5×5 سم ميديا' },
                  { id: 'posts', label: `صور المعرض والمشاريع (${workPosts.length})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setMediaCategoryFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      mediaCategoryFilter === f.id
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Quick Image Edit Modal if active */}
              {imageQuickEditItem && (
                <div className="p-5 bg-amber-500/10 border-2 border-amber-500 rounded-3xl space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        تعديل صورة: {imageQuickEditItem.title}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        الصق رابط صورة جديد أو ارفع ملف صورة من جهازك
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setImageQuickEditItem(null);
                        setNewMediaUrlInput('');
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={newMediaUrlInput || imageQuickEditItem.currentUrl}
                      alt="معاينة"
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400 shrink-0 shadow-sm"
                    />

                    <div className="flex-1 w-full space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          رابط الصورة المباشر (URL):
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={newMediaUrlInput}
                          onChange={(e) => setNewMediaUrlInput(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <label className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold cursor-pointer hover:border-amber-400 flex items-center gap-1.5 transition-colors">
                          <Upload className="w-3.5 h-3.5 text-amber-500" />
                          <span>رفع صورة من الجهاز</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleQuickImageFileUpload}
                            className="hidden"
                          />
                        </label>

                        <button
                          onClick={() => handleSaveQuickImage(newMediaUrlInput)}
                          disabled={!newMediaUrlInput.trim()}
                          className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>حفظ الصورة الجديدة</span>
                        </button>
                      </div>

                      {/* Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400">نماذج جاهزة:</span>
                        {[
                          { label: 'سباكة وترصيص', url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80' },
                          { label: 'كهرباء معمارية', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80' },
                          { label: 'نجارة وأقفال', url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80' },
                          { label: 'دهان وديكور', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80' },
                          { label: 'بناء وترميم', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80' },
                          { label: 'تكييف وتبريد', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80' }
                        ].map((p, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setNewMediaUrlInput(p.url)}
                            className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-[10px] text-slate-600 dark:text-slate-300 hover:text-amber-600 transition-colors"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 1. Services & Crafts Image Grid with Deletion */}
              {(mediaCategoryFilter === 'all' || mediaCategoryFilter === 'categories') && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-between">
                    <span>صور الحرف والخدمات الأساسية ({categories.length})</span>
                    <span className="text-xs text-slate-400 font-normal">
                      يمكنك استبدال أي صورة، تعديل الاسم والوصف، أو حذف الخدمة كلياً
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative group shrink-0">
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-20 h-20 rounded-xl object-cover border border-amber-500/30"
                            />
                            <button
                              onClick={() => {
                                setImageQuickEditItem({ id: cat.id, type: 'category', title: cat.name, currentUrl: cat.image });
                                setNewMediaUrlInput(cat.image);
                              }}
                              className="absolute inset-0 bg-black/60 rounded-xl text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                              title="تغيير الصورة"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {cat.name}
                              </h5>
                              <span className="text-[10px] text-slate-400">
                                {cat.subServices.length} خدمات فرعية
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                              {cat.description}
                            </p>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setImageQuickEditItem({ id: cat.id, type: 'category', title: cat.name, currentUrl: cat.image });
                                setNewMediaUrlInput(cat.image);
                              }}
                              className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold rounded-lg text-[11px] hover:bg-amber-100 transition-colors flex items-center gap-1"
                            >
                              <ImageIcon className="w-3 h-3" />
                              <span>تغيير الصورة</span>
                            </button>
                            <button
                              onClick={() => setEditingCraft(cat)}
                              className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-[11px] hover:bg-slate-300 transition-colors flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>تعديل</span>
                            </button>
                          </div>

                          {/* Delete Service */}
                          {confirmDeleteCatId === cat.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  deleteCategory(cat.id);
                                  setConfirmDeleteCatId(null);
                                }}
                                className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold"
                              >
                                تأكيد الحذف
                              </button>
                              <button
                                onClick={() => setConfirmDeleteCatId(null)}
                                className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px]"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteCatId(cat.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                              title="حذف هذه الخدمة بالكامل من المنصة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Billboard Hero Media */}
              {(mediaCategoryFilter === 'all' || mediaCategoryFilter === 'billboard') && (
                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        وسائط اللوحة الكبرى الرئيسية (Billboard Hero Media)
                      </h4>
                      <p className="text-xs text-slate-500">
                        الصورة والخلفية ومقطع الفيديو المعروضة أعلى الصفحة الرئيسية للمنصة
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveAdminSubTab('billboard')}
                      className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold"
                    >
                      فتح لوحة التحكم باللوحة الكبرى
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        صورة خلفية الـ Hero الحالية:
                      </span>
                      <img
                        src={billboardConfig.mediaUrl}
                        alt="Hero Billboard"
                        className="w-full h-44 object-cover rounded-xl border border-amber-500/30"
                      />
                    </div>
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">العنوان المعروض:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{billboardConfig.title}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">الوصف:</span>
                        <span className="text-slate-600 dark:text-slate-300">{billboardConfig.description}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">نوع الوسائط والرابط:</span>
                        <span className="font-mono text-slate-400">{billboardConfig.mediaType} · {billboardConfig.mediaUrl.slice(0, 45)}...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. 5x5 Spotlight Media */}
              {(mediaCategoryFilter === 'all' || mediaCategoryFilter === 'square') && (
                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        وسائط لوحة 5×5 سم ميديا (Square Spotlight)
                      </h4>
                      <p className="text-xs text-slate-500">
                        لوحة الفيديو أو الصورة المربعة المخصصة للترويج لحرفة معينة أو إشعار خاص
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveAdminSubTab('square5x5')}
                      className="px-3 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-bold"
                    >
                      إدارة لوحة 5×5 سم
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={squareSpotlightConfig.mediaUrl}
                      alt="5x5 Square Spotlight"
                      className="w-24 h-24 object-cover rounded-2xl border-2 border-amber-500 shadow-sm"
                    />
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {squareSpotlightConfig.title || 'لوحة ترويجية 5×5'}
                      </span>
                      <span className="text-slate-500 block">
                        {squareSpotlightConfig.text || 'مقطع أو صورة دعائية'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Portfolio Works Posts Media with Delete */}
              {(mediaCategoryFilter === 'all' || mediaCategoryFilter === 'posts') && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    صور منشورات ومشاريع المعرض ({workPosts.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workPosts.map((post) => (
                      <div
                        key={post.id}
                        className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3"
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-36 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                        />
                        <div className="space-y-1 text-xs">
                          <h5 className="font-bold text-slate-900 dark:text-white line-clamp-1">{post.title}</h5>
                          <span className="text-slate-500 block">الناشر: {post.authorName} · {post.location}</span>
                        </div>
                        <button
                          onClick={() => deleteWorkPost(post.id)}
                          className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف الصورة والمنشور</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 12: Job Market & Work Seekers Management */}
          {activeAdminSubTab === 'jobMarket' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-amber-500" />
                    <span>إدارة سوق العمل والباحثين عن عمل ({jobSeekers.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    مراقبة ملفات الباحثين عن عمل، وفحص الشهادات والمؤهلات وصور الأعمال المرفوعة، مع إمكانية التعديل والحذف.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-200 dark:border-amber-800">
                    مفعل ومتاح في التطبيق
                  </span>
                </div>
              </div>

              {jobSeekers.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs font-bold">
                  لا توجد طلبات باحثين عن عمل مسجلة حالياً.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobSeekers.map(js => (
                    <div
                      key={js.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={js.avatar}
                            alt={js.name}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/30"
                          />
                          <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">
                              {js.name}
                            </h4>
                            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                              {js.trade}
                            </p>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {js.wilaya} • {js.city} • هاتف: <strong className="text-slate-800 dark:text-slate-200">{js.phone}</strong>
                            </span>
                          </div>
                        </div>

                        <select
                          value={js.status}
                          onChange={(e) => updateJobSeekerStatus(js.id, e.target.value as any)}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg border bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                        >
                          <option value="available">متاح للعمل</option>
                          <option value="employed">تم توظيفه</option>
                          <option value="busy">مشغول مؤقتاً</option>
                        </select>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                        <p className="line-clamp-2">{js.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 font-bold">
                          <span>الخبرة: {js.experienceYears} سنوات</span>
                          <span>•</span>
                          <span>الأجر: {js.expectedWage}</span>
                        </div>
                      </div>

                      {/* Certificates Preview */}
                      {js.certificates && js.certificates.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                            الشهادات المرفوعة ({js.certificates.length}):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {js.certificates.map((cert, cIdx) => (
                              <button
                                key={cIdx}
                                onClick={() => setPreviewImage(cert.imageUrl)}
                                className="flex items-center gap-1.5 p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs hover:opacity-90"
                              >
                                <img src={cert.imageUrl} alt={cert.title} className="w-6 h-6 rounded-md object-cover" />
                                <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 max-w-[120px] truncate">{cert.title}</span>
                                <Eye className="w-3 h-3 text-amber-600" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Work Photos Preview */}
                      {js.portfolioImages && js.portfolioImages.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                            صور الأعمال المنفذة ({js.portfolioImages.length}):
                          </span>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {js.portfolioImages.map((imgUrl, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={() => setPreviewImage(imgUrl)}
                                className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-300 shrink-0 hover:opacity-90"
                              >
                                <img src={imgUrl} alt="عمل" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">تاريخ النشر: {js.createdAt}</span>
                        <button
                          onClick={() => deleteJobSeekerPost(js.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف الإعلان</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Google Play Store Compliance, Policies & Contact Us Management */}
          {activeAdminSubTab === 'playStoreLegal' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 animate-fade-in">
              
              {/* Top Banner */}
              <div className="p-5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      متجر Google Play — إدارة السياسات وبيانات "تواصل معنا"
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      التحكم في متطلبات قبول التطبيق في قوقل بلاي، سياسة الخصوصية، أمان البيانات، وتعديل خانات الاتصال وصندوق رسائل الدعم.
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">ملاحظة مطابقة طلبك:</span>
                  تم ترك خانات التواصل فارغة افتراضياً لتقوم بتعبئتها وتعديلها من هنا متى شئت. بمجرد إدخال أي رقم أو بريد وحفظه، سيظهر تلقائياً للمستخدمين في شاشة "تواصل معنا".
                </div>
              </div>

              {/* Success Notification */}
              {playStoreSavedSuccess && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>تم حفظ وتحديث كافة بيانات متجر Google Play وسياسات الدعم بنجاح!</span>
                </div>
              )}

              {/* PART 1: Contact Us Channels Management (خانات تواصل معنا) */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-amber-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      ١. بيانات وقنوات "تواصل معنا" (Contact Us)
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      setPlayStoreForm(prev => ({
                        ...prev,
                        supportEmail: '',
                        supportPhone: '',
                        whatsappNumber: '',
                        supportAddress: '',
                        workingHours: '',
                        websiteUrl: '',
                        privacyPolicyExternalUrl: ''
                      }));
                    }}
                    className="text-[11px] text-slate-500 hover:text-rose-500 underline cursor-pointer"
                  >
                    تفريغ جميع خانات التواصل
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      البريد الإلكتروني للدعم الفني (Support Email):
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      <input
                        type="email"
                        value={playStoreForm.supportEmail}
                        onChange={(e) => setPlayStoreForm(prev => ({ ...prev, supportEmail: e.target.value }))}
                        placeholder="اتركها فارغة أو اكتب: support@khodam.dz"
                        className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      رقم هاتف الدعم المباشر / الخط الساخن:
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        dir="ltr"
                        value={playStoreForm.supportPhone}
                        onChange={(e) => {
                          const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
                          const val = e.target.value.replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d).toString());
                          setPlayStoreForm(prev => ({ ...prev, supportPhone: val }));
                        }}
                        placeholder="021 00 00 00"
                        className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-left"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      رقم واتساب الدعم الفني وخدمة العملاء:
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-emerald-500 absolute right-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={playStoreForm.whatsappNumber}
                        onChange={(e) => setPlayStoreForm(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                        placeholder="اتركه فارغاً أو اكتب: +213550000000"
                        className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      ساعات ومواعيد العمل والاستجابة:
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={playStoreForm.workingHours}
                        onChange={(e) => setPlayStoreForm(prev => ({ ...prev, workingHours: e.target.value }))}
                        placeholder="اتركها فارغة أو اكتب: السبت - الخميس: 8:00 صباحاً - 8:00 مساءً"
                        className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      عنوان المقر الرئيسي والشركة:
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={playStoreForm.supportAddress}
                        onChange={(e) => setPlayStoreForm(prev => ({ ...prev, supportAddress: e.target.value }))}
                        placeholder="اتركه فارغاً أو اكتب: الجزائر العاصمة، الجزائر"
                        className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      رابط الموقع الإلكتروني أو صفحة التطبيق:
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={playStoreForm.websiteUrl}
                        onChange={(e) => setPlayStoreForm(prev => ({ ...prev, websiteUrl: e.target.value }))}
                        placeholder="اتركه فارغاً أو اكتب: https://khodam.dz"
                        className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      رابط خارجي مخصص لسياسة الخصوصية (Google Play Console URL):
                    </label>
                    <div className="relative">
                      <ExternalLink className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={playStoreForm.privacyPolicyExternalUrl}
                        onChange={(e) => setPlayStoreForm(prev => ({ ...prev, privacyPolicyExternalUrl: e.target.value }))}
                        placeholder="https://example.com/privacy-policy (يستخدم للربط في صفحة متجر قوقل بلاي كونسول)"
                        className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PART 2: Custom Play Store Legal Content */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    ٢. نصوص سياسة الخصوصية وشروط الخدمة وحذف الحساب
                  </h4>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      نص سياسة الخصوصية المخصصة (اتركه فارغاً لاعتماد النص القانوني الافتراضي لمتجر Google Play):
                    </label>
                    <textarea
                      rows={5}
                      value={playStoreForm.customPrivacyPolicy}
                      onChange={(e) => setPlayStoreForm(prev => ({ ...prev, customPrivacyPolicy: e.target.value }))}
                      placeholder="اتركه فارغاً لاعتماد النص القانوني المتكامل لمتجر بلاي أو الصق نص سياسة الخصوصية الخاص بشركتك هنا..."
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      نص شروط الخدمة والاستخدام المخصصة (Terms of Service):
                    </label>
                    <textarea
                      rows={4}
                      value={playStoreForm.customTermsOfService}
                      onChange={(e) => setPlayStoreForm(prev => ({ ...prev, customTermsOfService: e.target.value }))}
                      placeholder="اتركه فارغاً لاعتماد شروط الخدمة المدمجة، أو اكتب الشروط الإضافية هنا..."
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      إرشادات إضافية لحذف الحساب والبيانات (Google Play Data Safety):
                    </label>
                    <input
                      type="text"
                      value={playStoreForm.accountDeletionInstructions}
                      onChange={(e) => setPlayStoreForm(prev => ({ ...prev, accountDeletionInstructions: e.target.value }))}
                      placeholder="مثال: يمكن للمستخدمين أيضاً مراسلة الإدارة عبر البريد لطلب الحذف السحابي الكامل."
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Save Changes Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      updatePlayStoreConfig(playStoreForm);
                      setPlayStoreSavedSuccess(true);
                      setTimeout(() => setPlayStoreSavedSuccess(false), 3000);
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>حفظ كافة تعديلات سياسات Google Play وبيانات تواصل معنا</span>
                  </button>
                </div>
              </div>

              {/* PART 3: Support Inbox (صندوق تذاكر ورسائل المستخدمين) */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-sky-500" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        ٣. صندوق رسائل وتذاكر "تواصل معنا" الواردة ({supportTickets.length})
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        الرسائل والشكاوى والاستفسارات التي أرسلها المستخدمون عبر التطبيق.
                      </p>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px]">
                    <button
                      onClick={() => setTicketFilter('all')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        ticketFilter === 'all' ? 'bg-amber-500 text-white font-bold' : 'text-slate-500'
                      }`}
                    >
                      الكل ({supportTickets.length})
                    </button>
                    <button
                      onClick={() => setTicketFilter('new')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        ticketFilter === 'new' ? 'bg-amber-500 text-white font-bold' : 'text-slate-500'
                      }`}
                    >
                      جديدة ({supportTickets.filter(t => t.status === 'new').length})
                    </button>
                    <button
                      onClick={() => setTicketFilter('resolved')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        ticketFilter === 'resolved' ? 'bg-amber-500 text-white font-bold' : 'text-slate-500'
                      }`}
                    >
                      تمت معالجتها ({supportTickets.filter(t => t.status === 'resolved').length})
                    </button>
                  </div>
                </div>

                {/* Ticket Cards */}
                {supportTickets.length === 0 ? (
                  <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-6 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-500">لا توجد رسائل دعم واردة حالياً.</p>
                    <p className="text-[11px] text-slate-400">عندما يرسل المستخدمون رسائل عبر نافذة "تواصل معنا"، ستظهر هنا مباشرة.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {supportTickets
                      .filter(t => {
                        if (ticketFilter === 'new') return t.status === 'new';
                        if (ticketFilter === 'resolved') return t.status === 'resolved';
                        return true;
                      })
                      .map((ticket) => (
                        <div
                          key={ticket.id}
                          className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border transition-all ${
                            ticket.status === 'new'
                              ? 'border-amber-500/40 shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 opacity-90'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-900 dark:text-white">
                                {ticket.name}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ticket.category === 'account_deletion'
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                                  : ticket.category === 'complaint'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                  : 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400'
                              }`}>
                                {ticket.category === 'account_deletion' && 'طلب حذف حساب'}
                                {ticket.category === 'complaint' && 'شكوى / نزاع'}
                                {ticket.category === 'suggestion' && 'اقتراح تطوير'}
                                {ticket.category === 'technical' && 'مشكلة تقنية'}
                                {ticket.category === 'general' && 'استفسار عام'}
                              </span>

                              {ticket.status === 'new' && (
                                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-black">
                                  جديدة
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] text-slate-400 tabular-nums">
                              {ticket.createdAt}
                            </span>
                          </div>

                          <div className="space-y-1 mb-3">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {ticket.subject}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                              {ticket.message}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 text-[11px]">وسيلة التواصل:</span>
                              <span className="font-mono font-bold text-slate-900 dark:text-white dir-ltr">
                                {ticket.contact}
                              </span>
                              {ticket.contact.match(/^[0-9+]/) && (
                                <>
                                  <a
                                    href={`tel:${ticket.contact}`}
                                    className="p-1 text-sky-600 hover:bg-sky-50 rounded-md"
                                    title="اتصال هاتفي"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                  <a
                                    href={`https://wa.me/${ticket.contact.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                                    title="مراسلة عبر واتساب"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </a>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {ticket.status === 'new' ? (
                                <button
                                  onClick={() => updateSupportTicketStatus(ticket.id, 'resolved')}
                                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                                >
                                  تعليم كمعالجة
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateSupportTicketStatus(ticket.id, 'new')}
                                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[11px] transition-colors cursor-pointer"
                                >
                                  إعادة لجديدة
                                </button>
                              )}

                              <button
                                onClick={() => deleteSupportTicket(ticket.id)}
                                className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                                title="حذف الرسالة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: Site Texts & Content Customization (تعديل وتخصيص نصوص المنصة) */}
          {activeAdminSubTab === 'siteTexts' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" />
                    <span>تعديل وتخصيص نصوص المنصة والعناوين الرئيسية</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    يمكنك تعديل أي نص هنا مباشرة وحفظه، أو الخروج وتصفح التطبيق مع النقر المزدوج على أي نص لتعديله فوراً.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsAdminLiveEditMode(true);
                      setActiveTab('home');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:from-amber-600 hover:to-amber-700 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>تصفح وتعديل بالنقر الحي 🌐</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('هل تريد إعادة تعيين كافة النصوص المخصصة إلى النصوص الأصلية؟')) {
                        resetAdminCustomTexts();
                      }
                    }}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-500 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    استعادة النصوص الأصلية
                  </button>
                </div>
              </div>

              {/* Major App Core Texts Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    اسم التطبيق (Wordmark Title)
                  </label>
                  <input
                    type="text"
                    defaultValue={adminCustomTexts['خـدّام'] || 'خـدّام'}
                    onBlur={(e) => setAdminCustomText('خـدّام', e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />
                  <span className="text-[10px] text-slate-400 block">يظهر في الشعار العلوي وبطاقات المنصة</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    الشعار التعريفي (Tagline Badge)
                  </label>
                  <input
                    type="text"
                    defaultValue={adminCustomTexts['منصة الحرفيين والمهنيين المعتمدة في الجزائر'] || 'منصة الحرفيين والمهنيين المعتمدة في الجزائر'}
                    onBlur={(e) => setAdminCustomText('منصة الحرفيين والمهنيين المعتمدة في الجزائر', e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />
                  <span className="text-[10px] text-slate-400 block">الشعار في أعلى الواجهة الرئيسية</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    العنوان الرئيسي في واجهة الترحيب
                  </label>
                  <input
                    type="text"
                    defaultValue={adminCustomTexts['حرفيون معتمدون وأيادٍ أمينة تصل إلى بابك في دقائق'] || 'حرفيون معتمدون وأيادٍ أمينة تصل إلى بابك في دقائق'}
                    onBlur={(e) => setAdminCustomText('حرفيون معتمدون وأيادٍ أمينة تصل إلى بابك في دقائق', e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    الوصف الترحيبي العام
                  </label>
                  <textarea
                    rows={2}
                    defaultValue={adminCustomTexts['منصة خدمية تجمع بين إتقان العمل وأمانة التعامل، بربط جغرافي فوري، ومكالمات مشفرة بدون كشف رقم هاتفك، وبطاقة ميثاق إسلامي وأخلاقي لكل مهنة.'] || 'منصة خدمية تجمع بين إتقان العمل وأمانة التعامل، بربط جغرافي فوري، ومكالمات مشفرة بدون كشف رقم هاتفك، وبطاقة ميثاق إسلامي وأخلاقي لكل مهنة.'}
                    onBlur={(e) => setAdminCustomText('منصة خدمية تجمع بين إتقان العمل وأمانة التعامل، بربط جغرافي فوري، ومكالمات مشفرة بدون كشف رقم هاتفك، وبطاقة ميثاق إسلامي وأخلاقي لكل مهنة.', e.target.value)}
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Live Text Overrides Registry */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    قائمة النصوص المعدلة حالياً ({Object.keys(adminCustomTexts || {}).length})
                  </h4>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ يتم الحفظ الفوري والتطبيق المباشر
                  </span>
                </div>

                {Object.keys(adminCustomTexts || {}).length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl">
                    لم يتم تسجيل نصوص معدلة بعد. يمكنك تعديل الحقول أعلاه أو النقر المزدوج على أي نص أثناء تصفح التطبيق!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {Object.entries(adminCustomTexts).map(([orig, replacement], idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
                        <div className="flex-1 truncate">
                          <span className="text-slate-400 block text-[10px] truncate">الأصل: {orig}</span>
                          <span className="font-bold text-slate-900 dark:text-white truncate block">الجديد: {replacement}</span>
                        </div>
                        <button
                          onClick={() => {
                            const copy = { ...adminCustomTexts };
                            delete copy[orig];
                            try { localStorage.setItem('khodam_admin_custom_texts', JSON.stringify(copy)); } catch (e) {}
                            window.location.reload();
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg shrink-0"
                          title="حذف هذا التعديل"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: Icon Management & Custom Uploader (إدارة وتعديل ورفع الأيقونات) */}
              <div className="space-y-4 pt-6 border-t-2 border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>إدارة وتعديل ورفع أيقونات الحرف والمنصة ({categories.length} حرفة)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      اختر أيقونة من المكتبة الجاهزة، أو ارفع ملف أيقونة فيكتور (SVG) أو صورة (PNG) مخصصة من جهازك وتطبيقها مباشرة.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('هل أنت متأكد من رغبتك في استعادة كافة الأيقونات الافتراضية؟')) {
                          resetAdminCustomIcons();
                          window.location.reload();
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:text-rose-500 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      استعادة الأيقونات الأصلية
                    </button>
                  </div>
                </div>

                {/* Crafts Icon Tiles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:border-amber-400 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Visual Icon Badge Preview */}
                        <div 
                          onClick={() => {
                            setAdminEditModalTarget({
                              type: 'icon',
                              id: `icon_${cat.id}`,
                              title: `أيقونة حرفة: ${cat.name}`,
                              currentValue: cat.icon,
                              categoryId: cat.id
                            });
                          }}
                          className="w-11 h-11 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center p-2 shadow-sm shrink-0 cursor-pointer transition-transform active:scale-95"
                          title="اضغط لاختيار أو رفع أيقونة جديدة"
                        >
                          <AppIconRenderer icon={cat.icon} className="w-6 h-6 text-slate-950" />
                        </div>

                        <div className="min-w-0">
                          <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {cat.name}
                          </h5>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {cat.icon?.startsWith('data:') ? 'أيقونة مخصصة مرفوعة ✨' : cat.icon || 'Wrench'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons for this Craft's Icon */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Direct File Upload Button */}
                        <label
                          className="px-2 py-1 bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1"
                          title="رفع ملف أيقونة مباشرة من جهازك (SVG / PNG)"
                        >
                          <Upload className="w-3 h-3 text-amber-500" />
                          <span className="hidden sm:inline">رفع ملف</span>
                          <input
                            type="file"
                            accept=".svg,.png,.webp,.ico,.jpg,image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (re) => {
                                  if (typeof re.target?.result === 'string') {
                                    updateCategoryIcon(cat.id, re.target.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        {/* Open Complete Icon Editor Modal */}
                        <button
                          type="button"
                          onClick={() => {
                            setAdminEditModalTarget({
                              type: 'icon',
                              id: `icon_${cat.id}`,
                              title: `أيقونة حرفة: ${cat.name}`,
                              currentValue: cat.icon,
                              categoryId: cat.id
                            });
                          }}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg text-[10px] flex items-center gap-1 transition-transform active:scale-95 shadow-xs cursor-pointer"
                          title="تعديل الأيقونة من المكتبة أو الرموز"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>تعديل</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: App Icon & Branding Studio (استوديو أيقونة وشعار تطبيق خدّام) */}
          {activeAdminSubTab === 'appIcon' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              {/* Studio Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>استوديو أيقونة وشعار تطبيق خدّام (App Icon & Branding Studio)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    تحكم فوري في أيقونة التطبيق، شعار الهيدر، أيقونة شاشة الهاتف (PWA Launcher Icon)، وأيقونة التبويب (Favicon). ارفع أيقونتك مباشرة أو اختر تصميماً جاهزاً.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>معاينة في التطبيق 🌐</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('هل تريد استعادة أيقونة وشعار خدّام الافتراضية؟')) {
                        applyAppIcon('/icon.svg');
                      }
                    }}
                    className="px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    استعادة الشعار الأصلي
                  </button>
                </div>
              </div>

              {/* Success Notification Alert */}
              {appIconSuccessMessage && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2.5 animate-fade-in shadow-xs">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{appIconSuccessMessage}</span>
                </div>
              )}

              {/* SECTION 1: Real-time Multi-Device Live Mockup Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-500" />
                  <span>المعاينة المباشرة للأيقونة في شتى الواجهات (Live Multi-Context Preview):</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Context 1: Mobile Android Home Screen */}
                  <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 flex flex-col items-center justify-between text-center min-h-[220px] relative overflow-hidden group shadow-lg">
                    <div className="w-full flex justify-between items-center text-[10px] text-slate-400 font-mono px-1">
                      <span>09:41</span>
                      <span className="flex items-center gap-1">5G 🔋</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 my-auto">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 p-2 shadow-xl shadow-amber-500/30 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <AppIconRenderer
                          icon={getAdminCustomIcon('app_logo', '/icon.svg')}
                          className="w-12 h-12 object-contain"
                          fallbackIcon="ShieldCheck"
                        />
                      </div>
                      <span className="text-xs font-black tracking-wide text-slate-100">خـدّام</span>
                    </div>

                    <span className="text-[10px] text-amber-400/80 font-bold bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
                      شاشة الهاتف (PWA App Icon)
                    </span>
                  </div>

                  {/* Context 2: Header Navigation Wordmark */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col items-center justify-between text-center min-h-[220px]">
                    <span className="text-[10px] font-bold text-slate-400">شريط الهيدر العلوي للموقع</span>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 p-1 flex items-center justify-center text-white shadow-xs">
                        <AppIconRenderer
                          icon={getAdminCustomIcon('app_logo', '/icon.svg')}
                          className="w-8 h-8 object-contain"
                          fallbackIcon="ShieldCheck"
                        />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-slate-900 dark:text-white">خـدّام</div>
                        <div className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold">منصة الحرفيين والخدمات</div>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-500 font-bold">
                      شعار الهيدر (Header Logo)
                    </span>
                  </div>

                  {/* Context 3: Browser Tab Favicon */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col items-center justify-between text-center min-h-[220px]">
                    <span className="text-[10px] font-bold text-slate-400">تبويب المتصفح (Browser Tab)</span>

                    <div className="w-full bg-slate-200 dark:bg-slate-700/80 p-2 rounded-xl">
                      <div className="bg-white dark:bg-slate-900 rounded-lg p-2 flex items-center gap-2 shadow-xs text-right">
                        <div className="w-5 h-5 rounded-md bg-amber-500 flex items-center justify-center shrink-0 p-0.5">
                          <AppIconRenderer
                            icon={getAdminCustomIcon('app_logo', '/icon.svg')}
                            className="w-4 h-4 object-contain"
                            fallbackIcon="ShieldCheck"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate flex-1">
                          خدام | منصة الخدمات...
                        </span>
                        <X className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-500 font-bold">
                      أيقونة التبويب (Favicon)
                    </span>
                  </div>

                  {/* Context 4: PWA Install Banner */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col items-center justify-between text-center min-h-[220px]">
                    <span className="text-[10px] font-bold text-slate-400">بطاقة التثبيت (Install Prompt)</span>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2.5 shadow-xs w-full">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 p-1 flex items-center justify-center shrink-0">
                        <AppIconRenderer
                          icon={getAdminCustomIcon('app_logo', '/icon.svg')}
                          className="w-7 h-7 object-contain"
                          fallbackIcon="ShieldCheck"
                        />
                      </div>
                      <div className="text-right flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">تثبيت خـدّام</div>
                        <div className="text-[9px] text-slate-400 truncate">يعمل بدون إنترنت</div>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-500 font-bold">
                      نافذة متجر التطبيقات والـ PWA
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Direct Image Upload from Device */}
              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border-2 border-dashed border-amber-400 dark:border-amber-600/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-amber-500" />
                      <span>رفع صورة أيقونة جديدة مباشرة من جهازك (PNG / SVG / JPG / WebP)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      اسحب وأفلت ملف الأيقونة هنا، أو اضغط للاختيار من الكمبيوتر أو الهاتف. سيتم تطبيق الأيقونة فوراً في كل أرجاء الموقع!
                    </p>
                  </div>

                  <label className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md hover:from-amber-600 hover:to-amber-700 transition-transform active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto">
                    <Upload className="w-4 h-4" />
                    <span>اختيار ملف من جهازك 📁</span>
                    <input
                      type="file"
                      accept=".png,.svg,.jpg,.jpeg,.webp,.ico,image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            if (typeof re.target?.result === 'string') {
                              applyAppIcon(re.target.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsAppIconDragging(true);
                  }}
                  onDragLeave={() => setIsAppIconDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsAppIconDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (re) => {
                        if (typeof re.target?.result === 'string') {
                          applyAppIcon(re.target.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all ${
                    isAppIconDragging
                      ? 'border-amber-500 bg-amber-500/20 scale-[1.01]'
                      : 'border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60'
                  }`}
                >
                  <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    أفلت ملف الأيقونة هنا للرفع الفوري المباشر
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    الأبعاد المثالية: 512×512 أو 192×192 بكسل بخلفية شفافة أو ملونة
                  </p>
                </div>
              </div>

              {/* SECTION 3: URL or Direct SVG Code Input */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Link className="w-4 h-4 text-amber-500" />
                  <span>أو أدخل رابط صورة أيقونة (URL) أو كود فيكتور SVG مباشر:</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customAppIconInput}
                    onChange={(e) => setCustomAppIconInput(e.target.value)}
                    placeholder="https://example.com/logo.png أو <svg ...> أو /icon.svg"
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customAppIconInput.trim()) {
                        applyAppIcon(customAppIconInput.trim());
                        setCustomAppIconInput('');
                      }
                    }}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition-colors shrink-0 shadow-sm cursor-pointer"
                  >
                    تطبيق وحفظ 💾
                  </button>
                </div>
              </div>

              {/* SECTION 4: Professional Preset Logos (1-Click Apply) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>نماذج وتصميمات أيقونات احترافية جاهزة (تطبيق بنقرة واحدة):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Preset 1: Default Golden Shield & Tools */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-3 hover:border-amber-500 transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500 p-2 shadow-md flex items-center justify-center">
                      <AppIconRenderer icon="/icon.svg" className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">الدرع والأدوات الذهبي</div>
                      <div className="text-[10px] text-slate-400">النموذج الرسمي لمنصة خدّام</div>
                    </div>
                    <button
                      onClick={() => applyAppIcon('/icon.svg')}
                      className="w-full mt-auto py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] cursor-pointer"
                    >
                      تطبيق هذا النموذج
                    </button>
                  </div>

                  {/* Preset 2: Royal Craft Crown */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-3 hover:border-amber-500 transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 p-2 shadow-md flex items-center justify-center">
                      <Award className="w-9 h-9 text-slate-950 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">تاج الحرفي الملكي</div>
                      <div className="text-[10px] text-slate-400">شعار التميز والجودة الذهبية</div>
                    </div>
                    <button
                      onClick={() => applyAppIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="bg_cr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#b45309"/></linearGradient></defs><rect width="512" height="512" rx="108" fill="url(#bg_cr)"/><circle cx="256" cy="256" r="190" fill="#ffffff" fill-opacity="0.15"/><path d="M120 340 L120 180 L200 250 L256 150 L312 250 L392 180 L392 340 Z" fill="#0f172a"/><circle cx="256" cy="300" r="24" fill="#fbbf24"/><text x="256" y="440" font-family="sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle">خـدّام</text></svg>')}
                      className="w-full mt-auto py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] cursor-pointer"
                    >
                      تطبيق هذا النموذج
                    </button>
                  </div>

                  {/* Preset 3: Gear & Pro Wrench */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-3 hover:border-amber-500 transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 p-2 shadow-md flex items-center justify-center">
                      <Wrench className="w-9 h-9 text-slate-950 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">ترس الصيانة الميكانيكية</div>
                      <div className="text-[10px] text-slate-400">للصيانة والتركيب الاحترافي</div>
                    </div>
                    <button
                      onClick={() => applyAppIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="bg_gw" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#78350f"/></linearGradient></defs><rect width="512" height="512" rx="108" fill="url(#bg_gw)"/><circle cx="256" cy="240" r="130" fill="#0f172a"/><path d="M210 180 L240 210 L300 150 L330 180 L270 240 L300 270 L280 290 L250 260 L200 310 C195 315 185 315 180 310 L170 300 C165 295 165 285 170 280 L220 230 L190 200 Z" fill="#fbbf24"/><text x="256" y="440" font-family="sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle">خـدّام</text></svg>')}
                      className="w-full mt-auto py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] cursor-pointer"
                    >
                      تطبيق هذا النموذج
                    </button>
                  </div>

                  {/* Preset 4: Electric & Tech Shield */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-3 hover:border-amber-500 transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 p-2 shadow-md flex items-center justify-center">
                      <Zap className="w-9 h-9 text-slate-950 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">درع الكهرباء والتقنية</div>
                      <div className="text-[10px] text-slate-400">للخدمات الرقمية والكهربائية</div>
                    </div>
                    <button
                      onClick={() => applyAppIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="bg_sp" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0369a1"/></linearGradient></defs><rect width="512" height="512" rx="108" fill="url(#bg_sp)"/><path d="M256 90 L370 140 L370 270 C370 350 256 410 256 410 C256 410 142 350 142 270 L142 140 Z" fill="#0f172a"/><path d="M270 160 L190 270 L250 270 L230 350 L320 230 L260 230 Z" fill="#38bdf8"/><text x="256" y="460" font-family="sans-serif" font-weight="900" font-size="44" fill="#ffffff" text-anchor="middle">خـدّام PRO</text></svg>')}
                      className="w-full mt-auto py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] cursor-pointer"
                    >
                      تطبيق هذا النموذج
                    </button>
                  </div>

                  {/* Preset 5: Modern Home & Architecture */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center gap-3 hover:border-amber-500 transition-colors">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-2 shadow-md flex items-center justify-center">
                      <Home className="w-9 h-9 text-slate-950 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">البيت والمعمار السكني</div>
                      <div className="text-[10px] text-slate-400">للبناء والتشطيب والتصميم</div>
                    </div>
                    <button
                      onClick={() => applyAppIcon('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="bg_hm" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#059669"/><stop offset="100%" stop-color="#047857"/></linearGradient></defs><rect width="512" height="512" rx="108" fill="url(#bg_hm)"/><circle cx="256" cy="256" r="190" fill="#ffffff" fill-opacity="0.15"/><path d="M256 120 L380 220 L350 220 L350 340 L162 340 L162 220 L132 220 Z" fill="#0f172a"/><rect x="226" y="240" width="60" height="100" rx="6" fill="#10b981"/><text x="256" y="440" font-family="sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle">خـدّام</text></svg>')}
                      className="w-full mt-auto py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] cursor-pointer"
                    >
                      تطبيق هذا النموذج
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Export & Android / PWA Specs */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    <span>ملفات الأيقونة الجاهزة للنشر في متجر Google Play ومتصفحات الويب:</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    ملفات النظام الحالية: <code>/public/icon.svg</code> (فيكتور عالي الدقة)، <code>/public/pwa-192x192.png</code>، <code>/public/pwa-512x512.png</code>، و<code>/manifest.json</code>.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={getAdminCustomIcon('app_logo', '/icon.svg')}
                    download="khodam-app-icon"
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل ملف الأيقونة 📥</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Work Partner Posts Management (إعلانات البحث عن شريك عمل) */}
          {activeAdminSubTab === 'partnerPosts' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-500" />
                    <span>إدارة إعلانات البحث عن شريك عمل ({partnerPosts.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    متابعة عروض الشراكة والورشات المنشورة، حذف المنشورات المخالفة، والاطلاع على التفاعل والقلوب.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('partners')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  <Eye className="w-4 h-4" />
                  <span>فتح صفحة شريك العمل 🌐</span>
                </button>
              </div>

              {partnerPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  لا توجد إعلانات شراكة منشورة حالياً.
                </div>
              ) : (
                <div className="space-y-3">
                  {partnerPosts.map(post => (
                    <div 
                      key={post.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {post.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                            {post.wilaya}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {post.description}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>الناشر: <strong className="text-slate-600 dark:text-slate-300">{post.authorName}</strong> ({post.authorPhone})</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-rose-500">
                            <Heart className="w-3 h-3 fill-rose-500" />
                            <span>{post.likesCount} قلب</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-500">
                            <MessageSquare className="w-3 h-3" />
                            <span>{post.comments?.length || 0} تعليق</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف إعلان الشراكة "${post.title}"؟`)) {
                              deletePartnerPost(post.id);
                            }
                          }}
                          className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeAdminSubTab === 'homePanels' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">إدارة بانلات الواجهة الرئيسية</h3>
              <div className="space-y-3">
                {Object.entries(homePanelsConfig).map(([key, isVisible]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{key}</span>
                    <div className="flex gap-2">
                      <button onClick={() => toggleHomePanel(key as any)} className={`px-3 py-1 rounded-lg text-xs font-bold ${isVisible ? 'bg-emerald-600 text-white' : 'bg-slate-300 dark:bg-slate-700'}`}>
                        {isVisible ? 'ظاهر' : 'مخفي'}
                      </button>
                      <button onClick={() => deleteHomePanel(key as any)} className="p-2 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeAdminSubTab === 'reports' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">البلاغات الواردة</h3>
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className={`p-4 rounded-2xl border ${report.isResolved ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">السبب: {report.reason}</span>
                      {!report.isResolved && <button onClick={() => resolveReport(report.id)} className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold">تم الحل</button>}
                    </div>
                    <span className="text-xs text-slate-500 block">الحرفي ID: {report.artisanId}</span>
                    <span className="text-[10px] text-slate-400 block">{new Date(report.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Document Image Zoom Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-3xl overflow-hidden p-2 border border-slate-800">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-950/80 text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="وثيقة التوثيق"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </>
  );
};
