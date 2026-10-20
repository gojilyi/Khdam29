import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, 
  Mic, 
  Image as ImageIcon, 
  ShieldCheck, 
  PhoneCall, 
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
  ArrowUp
} from 'lucide-react';
import { ChatMessage } from '../types';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { AudioRecordingSession } from '../utils/audioRecorder';

interface ConversationMeta {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantTrade: string;
  orderSummary: string;
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
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [showScrollTopBtn, setShowScrollTopBtn] = useState(false);

  // Messages container reference for reliable, bug-free scrolling
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);
  const recordingSessionRef = useRef<AudioRecordingSession | null>(null);

  // Predefined Conversations Thread List
  const conversations: ConversationMeta[] = useMemo(() => [
    {
      id: 'conv_art_1',
      participantId: 'art_1',
      participantName: 'المعلم كمال بلقاسم',
      participantAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
      participantTrade: 'سباكة وترصيص صحي وشوفاج',
      orderSummary: 'إصلاح تسريب مائي مفاجئ في أنبوب المطبخ',
      isOnline: true,
      verificationLevel: 2,
      lastActive: 'متصل الآن',
      unreadCount: 0
    },
    {
      id: 'conv_art_2',
      participantId: 'art_2',
      participantName: 'حميد بن عمار',
      participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      participantTrade: 'كهرباء معمارية وإنارة LED',
      orderSummary: 'تجديد لوحة القواطع الرئيسية للمنزل',
      isOnline: false,
      verificationLevel: 2,
      lastActive: 'منذ 15 دقيقة',
      unreadCount: 1
    },
    {
      id: 'conv_art_3',
      participantId: 'art_3',
      participantName: 'رشيد حداد',
      participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      participantTrade: 'نجارة وأقفال أبواب مصفحة',
      orderSummary: 'تغيير كالون وقفل إيطالي لباب المدخل',
      isOnline: true,
      verificationLevel: 2,
      lastActive: 'متصل الآن',
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

  // Bug-free container-level scrolling to bottom & top
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior
    });
  };

  const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: 0,
      behavior
    });
  };

  // Scroll to bottom when conversation changes or initially rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom('auto');
    }, 40);
    return () => clearTimeout(timer);
  }, [activeConversationId, showMobileChat]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom('smooth');
    }, 60);
    return () => clearTimeout(timer);
  }, [displayedMessages.length]);

  // Handle scroll events to show/hide "Scroll to bottom" and "Scroll to top" buttons
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollBottomBtn(distanceToBottom > 80);
    setShowScrollTopBtn(container.scrollTop > 80);
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
  };

  // Quick replies list
  const quickReplies = [
    'أنا في انتظارك أمام الباب',
    'هل أحتاج لشراء قطع غيار إضافية؟',
    'مكان العمل مفرغ وجاهز تماماً',
    'وصلت إلى الموقع وسأبدأ الفحص',
    'شكراً جزيلاً، العمل متقن وممتاز'
  ];

  return (
    <div className="space-y-3 max-w-6xl mx-auto pb-6">
      {/* Sleek Top Banner & Dual-Role Switcher */}
      <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                صندوق الرسائل والمحادثات المباشرة
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Lock className="w-2.5 h-2.5" />
                <span>مشفر وآمن</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1">
              محادثات مباشرة مشفرة بين العميل والحرفي مع المكالمات ومشاركة الصور والتسجيلات
            </p>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/80 shrink-0 self-start sm:self-auto text-xs">
          <span className="text-[10px] text-slate-400">الطرف:</span>
          <span className="font-bold text-amber-300">
            {role === 'client' ? 'العميل' : 'الحرفي'}
          </span>
          <button
            onClick={() => setRole(role === 'client' ? 'artisan' : 'client')}
            className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
            title="تبديل الطرف لتجربة الرسائل من منظور العميل أو الحرفي"
          >
            تبديل
          </button>
        </div>
      </div>

      {/* Main Messaging Window */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px] h-[calc(100vh-210px)] max-h-[720px]">
        
        {/* ============================================================== */}
        {/* Left Column / Sidebar: Conversations List (Cols 1-4)            */}
        {/* ============================================================== */}
        <div className={`md:col-span-4 border-b md:border-b-0 ltr:md:border-r rtl:md:border-l border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-slate-950/40 h-full ${
          showMobileChat ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Sidebar Header & Search */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>المحادثات النشطة</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold font-mono">
                  {conversations.length}
                </span>
              </span>

              {/* Filter chips */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px]">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                    filterMode === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-500'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setFilterMode('unread')}
                  className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                    filterMode === 'unread' ? 'bg-amber-500 text-slate-950' : 'text-slate-500'
                  }`}
                >
                  غير مقروء
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute rtl:right-2.5 ltr:left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="بحث في أسماء الحرفيين..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl rtl:pr-8 ltr:pl-8 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute rtl:left-2.5 ltr:right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Conversations Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1.5 space-y-1">
            {conversations
              .filter(c => filterMode === 'all' || (c.unreadCount && c.unreadCount > 0))
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
                    className={`w-full p-2.5 rounded-xl text-start transition-all flex items-start gap-2.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-2xs'
                        : 'bg-white dark:bg-slate-900/60 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.participantAvatar}
                        alt={conv.participantName}
                        className="w-10 h-10 rounded-xl object-cover border border-amber-500/30"
                      />
                      {conv.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {conv.participantName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {lastMsg ? lastMsg.timestamp : '14:20'}
                        </span>
                      </div>

                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block truncate">
                        {conv.participantTrade}
                      </span>

                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-snug">
                          {lastMsg ? lastMsg.text : conv.orderSummary}
                        </p>
                        {conv.unreadCount && conv.unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black rounded-full text-[9px] shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* Right Column / Chat Area: (Cols 5-12)                          */}
        {/* ============================================================== */}
        <div className={`md:col-span-8 flex flex-col bg-white dark:bg-slate-900 h-full relative ${
          !showMobileChat ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Active Chat Header */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-900 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                title="رجوع للقائمة"
              >
                <BackIcon className="w-4 h-4" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={currentConv.participantAvatar}
                  alt={currentConv.participantName}
                  className="w-9 h-9 rounded-xl object-cover border border-amber-500/40"
                />
                {currentConv.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {currentConv.participantName}
                  </h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
                    معتمد
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 truncate">
                  <span className="truncate">{currentConv.participantTrade}</span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    {currentConv.lastActive}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Quick Jump Buttons */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => scrollToTop('smooth')}
                  className="px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-0.5 transition-colors cursor-pointer"
                  title="صعود لأعلى المحادثة"
                >
                  <ArrowUp className="w-3 h-3" />
                  <span>الأعلى</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToBottom('smooth')}
                  className="px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-0.5 transition-colors cursor-pointer"
                  title="النزول لآخر رسالة"
                >
                  <ArrowDown className="w-3 h-3" />
                  <span>الأسفل</span>
                </button>
              </div>

              <button
                onClick={() => {
                  const targetArtisan = artisans.find(a => a.id === currentConv.participantId) || artisans[0];
                  setSelectedArtisanForAppointment(targetArtisan);
                  setIsBookingAppointmentModalOpen(true);
                }}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="حجز موعد في الروزنامة"
              >
                <Calendar className="w-3 h-3 text-amber-600" />
                <span className="hidden sm:inline">حجز موعد</span>
              </button>

              <button
                onClick={() => startCall(currentConv.participantName, currentConv.participantTrade, currentConv.participantAvatar)}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                title="بدء اتصال مشفر"
              >
                <PhoneCall className="w-3 h-3" />
                <span className="hidden sm:inline">اتصال مشفر</span>
              </button>
            </div>
          </div>

          {/* Context strip: Active task summary */}
          <div className="px-3 py-1.5 bg-amber-50/70 dark:bg-amber-950/20 border-b border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between text-[11px] shrink-0">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 min-w-0">
              <Clock className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="font-bold text-amber-900 dark:text-amber-200 truncate">
                {currentConv.orderSummary}
              </span>
            </div>
            <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-xs shrink-0">
              3,500 دج
            </span>
          </div>

          {/* Messages Scroll Area: Reliable & Isolated from Parent Page */}
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/60 dark:bg-slate-950/40 overscroll-contain"
            style={{ overscrollBehavior: 'contain' }}
          >
            {/* Encryption notice pill */}
            <div className="text-center my-1">
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200/70 dark:border-slate-700/70 shadow-2xs">
                <Lock className="w-2.5 h-2.5 text-amber-500" />
                <span>محادثة مشفرة وآمنة لحماية خصوصيتك ورقم هاتفك</span>
              </span>
            </div>

            {/* Date divider */}
            <div className="flex items-center justify-center my-1.5">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 dark:bg-slate-800/60 px-2 py-0.5 rounded-full">
                اليوم
              </span>
            </div>

            {/* Empty state */}
            {displayedMessages.length === 0 && (
              <div className="text-center py-10 space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  لا توجد رسائل سابقة
                </h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  اكتب رسالتك أو شارك صورة العطل أو أرسل تسجيلاً صوتياً للبدء.
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
                        className="w-6 h-6 rounded-lg object-cover mb-1 border shrink-0"
                      />
                    )}

                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed space-y-1 shadow-2xs relative ${
                        isMe
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-ee-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700/80 rounded-es-sm'
                      }`}
                    >
                      {/* Sender label and delete action */}
                      <div className="text-[10px] font-bold opacity-75 flex items-center justify-between gap-3">
                        <span>{isMe ? 'أنت' : msg.senderName}</span>
                        <button
                          onClick={() => deleteChatMessage(msg.id)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 transition-opacity cursor-pointer"
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
                            alt="صورة العطل"
                            onClick={() => setLightboxImage(msg.imageUrl || null)}
                            className="w-full max-h-52 rounded-xl object-cover border border-black/10 dark:border-white/10 cursor-pointer hover:opacity-95 shadow-2xs transition-opacity"
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
                      <div className="flex items-center justify-end gap-1 text-[9px] font-mono opacity-70 pt-0.5">
                        <span>{msg.timestamp}</span>
                        {isMe && (
                          <CheckCheck className="w-3 h-3 text-blue-700 dark:text-blue-400 inline" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Quick Scroll Controls (Top & Bottom) */}
          <div className="absolute bottom-20 left-6 z-20 flex flex-col gap-1.5 pointer-events-auto">
            {showScrollTopBtn && (
              <button
                type="button"
                onClick={() => scrollToTop('smooth')}
                className="px-3 py-1.5 bg-slate-900/95 hover:bg-slate-800 text-amber-400 font-bold rounded-xl shadow-lg border border-amber-500/30 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 text-[11px] backdrop-blur-xs"
                title="الصعود لأول المحادثة"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>أعلى المحادثة</span>
              </button>
            )}

            {showScrollBottomBtn && (
              <button
                type="button"
                onClick={() => scrollToBottom('smooth')}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg border border-amber-300 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 text-[11px]"
                title="النزول لآخر رسالة"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>أحدث الرسائل</span>
              </button>
            )}
          </div>

          {/* Quick Replies Carousel */}
          {showQuickReplies && (
            <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700/80 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0">
              <span className="text-[10px] font-bold text-amber-600 shrink-0 flex items-center gap-0.5">
                <Zap className="w-3 h-3" />
                <span>رد سريع:</span>
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
                  }}
                  className="px-2 py-0.5 text-[10px] font-medium bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-md hover:border-amber-400 whitespace-nowrap transition-colors shrink-0 cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          )}

          {/* Attached image preview */}
          {attachedImage && (
            <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <img
                  src={attachedImage}
                  alt="معاينة"
                  className="w-8 h-8 object-cover rounded-lg border border-amber-500"
                />
                <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200">
                  صورة جاهزة للإرسال
                </span>
              </div>
              <button
                onClick={() => setAttachedImage(null)}
                className="p-1 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                title="إلغاء الصورة"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Bar or Live Recording Bar */}
          {isRecording ? (
            <div className="p-2.5 bg-red-500/10 dark:bg-red-950/30 border-t border-red-500/30 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
                <span className="text-xs font-bold text-red-700 dark:text-red-400">
                  تسجيل صوتي جاري... 🎙️
                </span>
                <span className="font-mono text-xs font-black text-red-600 dark:text-red-300">
                  0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleFinishAndSendRecording}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3 rtl:rotate-180" />
                  <span>إرسال</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowQuickReplies(prev => !prev)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  showQuickReplies 
                    ? 'bg-amber-500/20 text-amber-600' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="ردود سريعة"
              >
                <Zap className="w-4 h-4" />
              </button>

              <label
                className="p-1.5 text-slate-500 hover:text-amber-500 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="إرفاق صورة"
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

              <button
                type="button"
                onClick={handleStartRecording}
                className="p-1.5 text-slate-500 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                title="تسجيل صوتي"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={attachedImage ? 'أضف تعليقاً على الصورة...' : 'اكتب رسالتك هنا...'}
                className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              <button
                onClick={handleSend}
                disabled={!inputVal.trim() && !attachedImage}
                className="w-8 h-8 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Full View Images */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh]">
            <img
              src={lightboxImage}
              alt="عرض كبير"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 left-3 p-2 bg-slate-900/80 text-white rounded-full hover:bg-slate-950"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
