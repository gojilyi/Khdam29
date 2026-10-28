import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, 
  Mic, 
  Image as ImageIcon, 
  ShieldCheck, 
  PhoneCall, 
  Phone,
  Lock, 
  Search,
  CheckCheck,
  Check,
  Clock,
  Trash2,
  X,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Zap,
  ChevronDown,
  ArrowDown,
  ArrowUp,
  Paperclip,
  BadgeCheck,
  Plus,
  Info,
  MapPin,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { ChatMessage, Artisan } from '../types';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { AudioRecordingSession } from '../utils/audioRecorder';

interface ConversationMeta {
  id: string;
  participantId: string;
  participantName: string;
  participantPhone: string;
  participantAvatar: string;
  participantTrade: string;
  city: string;
  orderSummary: string;
  orderPrice: string;
  isOnline: boolean;
  verificationLevel: number;
  lastActive: string;
  unreadCount?: number;
}

export const ChatInboxView: React.FC = () => {
  const { 
    messages, 
    sendMessage, 
    deleteChatMessage,
    startCall, 
    role, 
    setRole,
    currentUser,
    artisans,
    setIsBookingAppointmentModalOpen,
    setSelectedArtisanForAppointment,
    language 
  } = useApp();

  const isRtl = language === 'ar';
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const [inputVal, setInputVal] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<string>('conv_art_1');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'artisans'>('all');
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Messages container reference
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);
  const recordingSessionRef = useRef<AudioRecordingSession | null>(null);

  // Predefined Conversations Thread List with Algerian Context
  const conversations: ConversationMeta[] = useMemo(() => [
    {
      id: 'conv_art_1',
      participantId: 'art_1',
      participantName: 'المعلم كمال بلقاسم',
      participantPhone: '0550123456',
      participantAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
      participantTrade: 'سباكة وترصيص صحي وشوفاج',
      city: 'الجزائر العاصمة - الأبيار',
      orderSummary: 'إصلاح تسريب مائي مفاجئ في أنبوب المطبخ الرئيسي',
      orderPrice: '3,500 دج',
      isOnline: true,
      verificationLevel: 2,
      lastActive: 'متصل الآن',
      unreadCount: 0
    },
    {
      id: 'conv_art_2',
      participantId: 'art_2',
      participantName: 'حميد بن عمار',
      participantPhone: '0661234567',
      participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      participantTrade: 'كهرباء معمارية وإنارة LED',
      city: 'البليدة - أولاد يعيش',
      orderSummary: 'تجديد لوحة القواطع الكهربائية والتأريض',
      orderPrice: '4,800 دج',
      isOnline: false,
      verificationLevel: 2,
      lastActive: 'منذ 15 دقيقة',
      unreadCount: 1
    },
    {
      id: 'conv_art_3',
      participantId: 'art_3',
      participantName: 'رشيد حداد',
      participantPhone: '0770987654',
      participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      participantTrade: 'نجارة وأقفال أبواب مصفحة',
      city: 'الجزائر العاصمة - باب الزوار',
      orderSummary: 'تغيير كالون أمان وقفل إيطالي ثلاثي لباب المدخل',
      orderPrice: '5,000 دج',
      isOnline: true,
      verificationLevel: 2,
      lastActive: 'متصل الآن',
      unreadCount: 0
    },
    {
      id: 'conv_support',
      participantId: 'art_support',
      participantName: 'خدمة عملاء منصة خـدّام',
      participantPhone: '023101010',
      participantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      participantTrade: 'الدعم الفني وضمان المعاملات',
      city: 'الجزائر - الدعم المركزي',
      orderSummary: 'تتبع الطلبات، الضمان، وفحص الوثائق المهنية',
      orderPrice: 'خدمة مجانية',
      isOnline: true,
      verificationLevel: 2,
      lastActive: 'متصل 24/7',
      unreadCount: 0
    }
  ], []);

  const currentConv = conversations.find(c => c.id === activeConversationId) || conversations[0];

  // Filter messages for active conversation
  const conversationMessages = useMemo(() => {
    return messages.filter(m => {
      if (m.conversationId) {
        return m.conversationId === activeConversationId;
      }
      return activeConversationId === 'conv_art_1';
    });
  }, [messages, activeConversationId]);

  // Apply search query
  const displayedMessages = useMemo(() => {
    if (!searchFilter.trim()) return conversationMessages;
    const query = searchFilter.toLowerCase();
    return conversationMessages.filter(m => 
      m.text.toLowerCase().includes(query) ||
      m.senderName.toLowerCase().includes(query)
    );
  }, [conversationMessages, searchFilter]);

  // Container scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior
    });
  };

  // Scroll to bottom when conversation changes or initially rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom('auto');
    }, 50);
    return () => clearTimeout(timer);
  }, [activeConversationId, showMobileChat]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom('smooth');
    }, 60);
    return () => clearTimeout(timer);
  }, [displayedMessages.length]);

  // Handle scroll events
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollBottomBtn(distanceToBottom > 80);
  };

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (recordingSessionRef.current) recordingSessionRef.current.cancel();
    };
  }, []);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAttachedImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = () => {
    if (!inputVal.trim() && !attachedImage) return;

    sendMessage(
      inputVal.trim(), 
      false, 
      undefined, 
      attachedImage || undefined,
      undefined,
      activeConversationId,
      {
        id: currentConv.participantId,
        name: currentConv.participantName,
        trade: currentConv.participantTrade
      }
    );

    setInputVal('');
    setAttachedImage(null);
    setTimeout(() => scrollToBottom('smooth'), 50);

    // Simulate typing indicator from artisan
    if (role === 'client') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 1600);
    }
  };

  const handleStartRecording = async () => {
    try {
      const session = new AudioRecordingSession();
      const started = await session.start();
      if (started) {
        recordingSessionRef.current = session;
        setIsRecording(true);
        setRecordingSeconds(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);
      }
    } catch (err) {
      console.warn('Error starting audio recorder:', err);
    }
  };

  const handleCancelRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (recordingSessionRef.current) recordingSessionRef.current.cancel();
    setIsRecording(false);
    setRecordingSeconds(0);
    recordingSessionRef.current = null;
  };

  const handleFinishAndSendRecording = async () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (recordingSessionRef.current) {
      const result = await recordingSessionRef.current.stop();
      sendMessage(
        language === 'ar' ? 'تسجيل صوتي استفساري 🎙️' : 'Voice message inquiry 🎙️',
        true,
        result.durationStr,
        undefined,
        result.audioUrl,
        activeConversationId,
        {
          id: currentConv.participantId,
          name: currentConv.participantName,
          trade: currentConv.participantTrade
        }
      );
    }
    setIsRecording(false);
    setRecordingSeconds(0);
    recordingSessionRef.current = null;
    setTimeout(() => scrollToBottom('smooth'), 50);

    if (role === 'client') {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1700);
    }
  };

  // Quick replies list adapted for Algerian home repair workflow
  const quickReplies = [
    'أنا في انتظارك في العنوان المحدد',
    'هل أحتاج لشراء قطع غيار إضافية قبل وصولك؟',
    'أرسل لي موقعك عبر GPS لو سمحت',
    'مكان العمل مفرغ وجاهز للفحص فوراً',
    'متى يمكنك الوصول إلى المنزل تقريباً؟',
    'شكراً جزيلاً، العمل متقن وممتاز'
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-3 pb-8" dir="rtl">
      {/* Sleek Top Banner & Role Switcher */}
      <div className="bg-[#0A4D2E] text-white px-4 py-3 rounded-2xl shadow-sm border border-[#0F6B3F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 border border-white/15 shadow-xs">
            <MessageSquare className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                لوحة المحادثات والرسائل المباشرة
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                <Lock className="w-2.5 h-2.5" />
                <span>مشفر وآمن</span>
              </span>
            </div>
            <p className="text-[11px] text-emerald-100/80 line-clamp-1">
              تواصل كتابي وصوتي مباشر بين العميل والحرفي مع مشاركة الصور وتفاصيل الورشة
            </p>
          </div>
        </div>

        {/* Dual-Role & Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsNewChatModalOpen(true)}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-500/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>محادثة جديدة</span>
          </button>

          <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-xl border border-white/10 text-xs">
            <span className="text-[10px] text-emerald-200">الطرف:</span>
            <span className="font-bold text-amber-300">
              {role === 'client' ? 'العميل' : 'الحرفي'}
            </span>
            <button
              onClick={() => setRole(role === 'client' ? 'artisan' : 'client')}
              className="px-2 py-0.5 bg-amber-400 hover:bg-amber-300 text-[#0A4D2E] font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
              title="تبديل الطرف لتجربة الرسائل من منظور العميل أو الحرفي"
            >
              تبديل
            </button>
          </div>
        </div>
      </div>

      {/* Main Messaging Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] h-[calc(100vh-190px)] max-h-[760px]">
        
        {/* ============================================================== */}
        {/* Sidebar / Conversations Thread List (Cols 1-4)                */}
        {/* ============================================================== */}
        <div className={`md:col-span-4 border-l border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-slate-950/40 h-full ${
          showMobileChat ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2.5 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>المحادثات النشطة</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#EEF6F1] text-[#0F6B3F] text-[10px] font-bold font-mono">
                  {conversations.length}
                </span>
              </span>

              {/* Filters */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px]">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                    filterMode === 'all' ? 'bg-[#0F6B3F] text-white' : 'text-slate-500'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setFilterMode('unread')}
                  className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                    filterMode === 'unread' ? 'bg-[#0F6B3F] text-white' : 'text-slate-500'
                  }`}
                >
                  غير مقروءة
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="بحث في المحادثات أو الحرفيين..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl pr-8 pl-8 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F6B3F]"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute left-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Conversations Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2 space-y-1.5">
            {conversations
              .filter(c => {
                if (filterMode === 'unread') return (c.unreadCount || 0) > 0;
                if (!searchFilter.trim()) return true;
                const q = searchFilter.toLowerCase();
                return c.participantName.toLowerCase().includes(q) || c.participantTrade.toLowerCase().includes(q);
              })
              .map((conv) => {
                const isSelected = conv.id === activeConversationId;
                const lastMsg = messages
                  .filter(m => (m.conversationId === conv.id) || (!m.conversationId && conv.id === 'conv_art_1'))
                  .slice(-1)[0];

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConversationId(conv.id);
                      setShowMobileChat(true);
                    }}
                    className={`w-full p-2.5 rounded-xl text-right transition-all flex items-start gap-2.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#EEF6F1] dark:bg-emerald-950/30 border-[#0F6B3F]/40 shadow-xs'
                        : 'bg-white dark:bg-slate-900/60 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.participantAvatar}
                        alt={conv.participantName}
                        className="w-11 h-11 rounded-xl object-cover border border-[#0F6B3F]/30"
                      />
                      {conv.isOnline && (
                        <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {conv.participantName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {lastMsg ? lastMsg.timestamp : '14:20'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-[#0F6B3F] dark:text-emerald-400 font-medium truncate mt-0.5">
                        <BadgeCheck className="w-3 h-3 shrink-0" />
                        <span className="truncate">{conv.participantTrade}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-snug">
                          {lastMsg ? lastMsg.text : conv.orderSummary}
                        </p>
                        {conv.unreadCount && conv.unreadCount > 0 ? (
                          <span className="px-1.5 py-0.2 bg-[#0F6B3F] text-white font-black rounded-full text-[9px] shrink-0">
                            {conv.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* Chat Area: Messages + Input (Cols 5-12)                        */}
        {/* ============================================================== */}
        <div className={`md:col-span-8 flex flex-col bg-white dark:bg-slate-900 h-full relative ${
          !showMobileChat ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Active Chat Top Header */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/70 dark:bg-slate-900 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                title="رجوع لقائمة المحادثات"
              >
                <BackIcon className="w-4 h-4" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={currentConv.participantAvatar}
                  alt={currentConv.participantName}
                  className="w-10 h-10 rounded-xl object-cover border border-[#0F6B3F]/40"
                />
                {currentConv.isOnline && (
                  <span className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {currentConv.participantName}
                  </h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F6B3F] shrink-0" />
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold">
                    موثق {currentConv.verificationLevel === 2 ? 'بالدبلوم' : 'بالهوية'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 truncate mt-0.5">
                  <span className="truncate">{currentConv.participantTrade}</span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    {currentConv.lastActive}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Appointment Booking */}
              <button
                type="button"
                onClick={() => {
                  const targetArtisan = artisans.find(a => a.id === currentConv.participantId) || artisans[0];
                  setSelectedArtisanForAppointment(targetArtisan);
                  setIsBookingAppointmentModalOpen(true);
                }}
                className="px-2.5 py-1.5 bg-[#EEF6F1] hover:bg-[#DDE3DF] text-[#0F6B3F] dark:bg-emerald-950/40 dark:text-emerald-300 border border-[#0F6B3F]/30 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="حجز موعد في الروزنامة"
              >
                <Calendar className="w-3.5 h-3.5 text-[#0F6B3F]" />
                <span className="hidden sm:inline">حجز موعد</span>
              </button>

              {/* Direct Cellular Call */}
              <a
                href={`tel:${currentConv.participantPhone}`}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-[11px] font-bold flex items-center gap-1 border border-slate-200 dark:border-slate-700 transition-colors"
                title="اتصال هاتفي مباشر عبر الشريحة"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">اتصال GSM</span>
              </a>

              {/* Encrypted In-App Audio Call */}
              <button
                type="button"
                onClick={() => startCall(currentConv.participantName, currentConv.participantTrade, currentConv.participantAvatar)}
                className="px-2.5 py-1.5 bg-[#0F6B3F] hover:bg-[#0A4D2E] text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                title="بدء اتصال مشفر عبر التطبيق"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">اتصال مشفر</span>
              </button>
            </div>
          </div>

          {/* Context Strip: Active Task & Wilaya */}
          <div className="px-3.5 py-1.5 bg-amber-50/80 dark:bg-amber-950/20 border-b border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-[11px] shrink-0">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 min-w-0">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-bold text-amber-950 dark:text-amber-200 truncate">
                {currentConv.orderSummary}
              </span>
              <span className="text-slate-400 hidden sm:inline">·</span>
              <span className="text-[10px] text-slate-500 hidden sm:flex items-center gap-0.5 truncate">
                <MapPin className="w-2.5 h-2.5" />
                <span>{currentConv.city}</span>
              </span>
            </div>
            <span className="font-bold font-mono text-[#0F6B3F] dark:text-emerald-400 text-xs shrink-0">
              {currentConv.orderPrice}
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 dark:bg-slate-950/40 overscroll-contain"
          >
            {/* Encryption notice pill */}
            <div className="text-center my-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs">
                <Lock className="w-3 h-3 text-[#0F6B3F]" />
                <span>محادثة مشفرة وآمنة وفق معايير الخصوصية لحماية بياناتك ورقم هاتفك</span>
              </span>
            </div>

            {/* Date divider */}
            <div className="flex items-center justify-center my-2">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                اليوم
              </span>
            </div>

            {/* Empty state */}
            {displayedMessages.length === 0 && (
              <div className="text-center py-12 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  لا توجد رسائل سابقة
                </h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  اكتب رسالتك أو شارك صورة العطل أو أرسل تسجيلاً صوتياً للبدء فوراً.
                </p>
              </div>
            )}

            {/* Render Messages in Order */}
            {displayedMessages.map((msg) => {
              const isAdmin = msg.senderRole === 'admin';
              const isMe = msg.senderRole === role;

              if (isAdmin) {
                return (
                  <div key={msg.id} className="flex flex-col items-center my-2 w-full animate-fade-in">
                    <div className="max-w-[85%] bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-center space-y-0.5">
                      <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                        <span>{msg.senderName}</span>
                      </div>
                      <p className="text-xs text-slate-800 dark:text-slate-200">{msg.text}</p>
                      <span className="text-[9px] text-slate-400 font-mono block">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex items-end gap-1.5 max-w-[85%] sm:max-w-[72%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Participant Avatar beside artisan message */}
                    {!isMe && (
                      <img
                        src={currentConv.participantAvatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-lg object-cover mb-1 border border-slate-200 shrink-0"
                      />
                    )}

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed space-y-1.5 shadow-2xs relative ${
                        isMe
                          ? 'bg-[#0F6B3F] text-white font-medium rounded-ee-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-es-sm'
                      }`}
                    >
                      {/* Sender label and delete action */}
                      <div className="text-[10px] font-bold opacity-80 flex items-center justify-between gap-3">
                        <span>{isMe ? 'أنت' : msg.senderName}</span>
                        <button
                          type="button"
                          onClick={() => deleteChatMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-300 hover:text-rose-400 transition-opacity cursor-pointer"
                          title="حذف الرسالة"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Image Attachment */}
                      {msg.imageUrl && (
                        <div className="pt-0.5">
                          <img
                            src={msg.imageUrl}
                            alt="صورة العطل أو الورشة"
                            onClick={() => setLightboxImage(msg.imageUrl || null)}
                            className="w-full max-h-56 rounded-xl object-cover border border-black/10 dark:border-white/10 cursor-pointer hover:opacity-95 shadow-2xs transition-opacity"
                          />
                        </div>
                      )}

                      {/* Audio Note Player */}
                      {msg.isAudio ? (
                        <div className="py-0.5">
                          <VoiceNotePlayer 
                            audioUrl={msg.audioUrl} 
                            duration={msg.audioDuration || '0:16'} 
                            isMe={isMe} 
                          />
                        </div>
                      ) : msg.text ? (
                        <p className="whitespace-pre-wrap leading-relaxed text-[12.5px]">{msg.text}</p>
                      ) : null}

                      {/* Timestamp & Status ticks */}
                      <div className="flex items-center justify-end gap-1 text-[9px] font-mono opacity-80 pt-0.5">
                        <span>{msg.timestamp}</span>
                        {isMe && (
                          <CheckCheck className="w-3 h-3 text-emerald-200 inline" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 animate-fade-in">
                <img
                  src={currentConv.participantAvatar}
                  alt={currentConv.participantName}
                  className="w-6 h-6 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-es-sm text-xs flex items-center gap-1.5 shadow-2xs">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {currentConv.participantName} يكتب الآن...
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Floating Scroll to Bottom Button */}
          {showScrollBottomBtn && (
            <button
              type="button"
              onClick={() => scrollToBottom('smooth')}
              className="absolute bottom-20 left-6 z-20 px-3 py-1.5 bg-[#0F6B3F] hover:bg-[#0A4D2E] text-white font-bold rounded-xl shadow-lg border border-emerald-400 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 text-[11px]"
              title="النزول لآخر رسالة"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>أحدث الرسائل</span>
            </button>
          )}

          {/* Quick Replies Carousel */}
          {showQuickReplies && (
            <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              <span className="text-[10px] font-bold text-[#0F6B3F] shrink-0 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>ردود جاهزة:</span>
              </span>
              {quickReplies.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => {
                    sendMessage(
                      preset,
                      false,
                      undefined,
                      undefined,
                      undefined,
                      activeConversationId,
                      {
                        id: currentConv.participantId,
                        name: currentConv.participantName,
                        trade: currentConv.participantTrade
                      }
                    );
                    setShowQuickReplies(false);
                    setTimeout(() => scrollToBottom('smooth'), 50);
                    if (role === 'client') {
                      setIsTyping(true);
                      setTimeout(() => setIsTyping(false), 1500);
                    }
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-[#0F6B3F] whitespace-nowrap transition-colors shrink-0 cursor-pointer shadow-2xs"
                >
                  {preset}
                </button>
              ))}
            </div>
          )}

          {/* Attached Image Preview Bar */}
          {attachedImage && (
            <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <img
                  src={attachedImage}
                  alt="معاينة الصورة"
                  className="w-10 h-10 object-cover rounded-lg border border-[#0F6B3F]"
                />
                <div>
                  <span className="text-[11px] font-bold text-emerald-950 dark:text-emerald-200 block">
                    صورة جاهزة للإرسال
                  </span>
                  <span className="text-[9px] text-slate-500">
                    اضغط إرسال لمشاركتها مع الحرفي
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                title="إلغاء الصورة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Bar or Live Recording Bar */}
          {isRecording ? (
            <div className="p-3 bg-red-500/10 dark:bg-red-950/30 border-t border-red-500/30 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping inline-block" />
                <span className="text-xs font-bold text-red-700 dark:text-red-400">
                  تسجيل صوتي جاري... 🎙️
                </span>
                <span className="font-mono text-xs font-black text-red-600 dark:text-red-300">
                  0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleFinishAndSendRecording}
                  className="px-3.5 py-1.5 bg-[#0F6B3F] hover:bg-[#0A4D2E] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3 h-3 rotate-180" />
                  <span>إرسال التسجيل</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 shrink-0">
              {/* Quick Replies Toggle */}
              <button
                type="button"
                onClick={() => setShowQuickReplies(prev => !prev)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  showQuickReplies 
                    ? 'bg-[#EEF6F1] text-[#0F6B3F]' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="ردود سريعة جاهزة"
              >
                <Zap className="w-4 h-4" />
              </button>

              {/* Attach Image */}
              <label
                className="p-2 text-slate-500 hover:text-[#0F6B3F] cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="إرفاق صورة العطل أو الورشة"
              >
                <ImageIcon className="w-4 h-4" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              {/* Mic / Audio Record */}
              <button
                type="button"
                onClick={handleStartRecording}
                className="p-2 text-slate-500 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                title="تسجيل رسالة صوتية"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={attachedImage ? 'أضف تعليقاً على الصورة المرفقة...' : 'اكتب رسالتك للحرفي هنا...'}
                className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F6B3F]"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputVal.trim() && !attachedImage}
                className="w-9 h-9 bg-[#0F6B3F] hover:bg-[#0A4D2E] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs"
                title="إرسال"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Full View Images */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh]">
            <img
              src={lightboxImage}
              alt="عرض الصورة بالحجم الكامل"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 left-3 p-2 bg-black/60 text-white rounded-full hover:bg-black/90 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* New Chat Launcher Modal */}
      {isNewChatModalOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsNewChatModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  بدء محادثة جديدة مع حرفي
                </h3>
              </div>
              <button 
                onClick={() => setIsNewChatModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              اختر أحد الحرفيين المعتمدين لبدء استفسار جديد أو مناقشة تكلفة الصيانة:
            </p>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {artisans.slice(0, 5).map((art) => (
                <button
                  key={art.id}
                  onClick={() => {
                    const existingConv = conversations.find(c => c.participantId === art.id);
                    if (existingConv) {
                      setActiveConversationId(existingConv.id);
                    } else {
                      setActiveConversationId('conv_art_1');
                    }
                    setIsNewChatModalOpen(false);
                    setShowMobileChat(true);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0F6B3F] hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-right flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <img 
                    src={art.avatar} 
                    alt={art.name} 
                    className="w-10 h-10 rounded-xl object-cover border border-[#0F6B3F]/30 shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">{art.name}</span>
                      <ShieldCheck className="w-3 h-3 text-[#0F6B3F]" />
                    </div>
                    <span className="text-[10px] text-[#0F6B3F] block truncate">{art.trade}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{art.city}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
