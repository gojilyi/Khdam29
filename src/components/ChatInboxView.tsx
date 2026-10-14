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
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Zap,
  Info,
  CheckCircle2,
  Filter
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
    activeOrder,
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversationId]);

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
  };

  // Filter messages for active conversation
  const conversationMessages = useMemo(() => {
    return messages.filter(m => {
      // If conversationId is set, match exactly
      if (m.conversationId) {
        return m.conversationId === activeConversationId;
      }
      // Fallback for legacy messages: match default conversation
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

  // Quick replies list
  const quickReplies = [
    'أنا في انتظارك أمام الباب',
    'هل أحتاج لشراء قطع غيار إضافية؟',
    'وصلت إلى موقع التدخل وبدأت الفحص',
    'مكان العمل جاهز ومفرغ بالكامل',
    'شكراً جزيلاً، العمل ممتاز ومتقن'
  ];

  return (
    <div className="space-y-3 max-w-6xl mx-auto pb-6">
      {/* Sleek Top Banner & Dual-Role Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white px-5 py-3.5 rounded-2xl border border-slate-700/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                صندوق الرسائل والمحادثات المباشرة
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Lock className="w-2.5 h-2.5" />
                <span>تشفير تام E2E</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-1">
              تواصل آمن ومحمي بين العميل والحرفي مع الصور والتسجيلات الصوتية والمكالمات
            </p>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="flex items-center gap-2 bg-white/10 dark:bg-slate-900/40 p-1.5 rounded-xl border border-white/15 shrink-0 self-start sm:self-auto">
          <div className="text-[11px] px-2">
            <span className="text-slate-400 block text-[9px]">أنت تراسل بصفتك:</span>
            <span className="font-bold text-amber-300">
              {role === 'client' ? 'العميل' : 'الحرفي'}
            </span>
          </div>
          <button
            onClick={() => setRole(role === 'client' ? 'artisan' : 'client')}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
            title="تبديل الطرف لتجربة الرسائل من وجهة نظر العميل أو الحرفي"
          >
            تبديل الدور
          </button>
        </div>
      </div>

      {/* Main Messaging Window */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] h-[calc(100vh-220px)] max-h-[750px]">
        {/* ============================================================== */}
        {/* Left Column / Sidebar: Conversations List (Cols 1-4)            */}
        {/* ============================================================== */}
        <div className={`md:col-span-4 border-b md:border-b-0 ltr:md:border-r rtl:md:border-l border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/70 dark:bg-slate-950/40 h-full ${
          showMobileChat ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Sidebar Header & Search */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>المحادثات النشطة</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold font-mono">
                  {conversations.length}
                </span>
              </span>

              {/* Filter chips */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setFilterMode('unread')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                    filterMode === 'unread'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
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
                placeholder="بحث في أسماء الحرفيين أو الرسائل..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl rtl:pr-8 ltr:pl-8 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute rtl:left-2.5 ltr:right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Conversations Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
            {conversations
              .filter(c => filterMode === 'all' || (c.unreadCount && c.unreadCount > 0))
              .map((conv) => {
                const isSelected = conv.id === activeConversationId;
                // Get last message in this conversation
                const convMsgs = messages.filter(m => m.conversationId === conv.id);
                const lastMsg = convMsgs.length > 0 ? convMsgs[convMsgs.length - 1] : null;

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConversationId(conv.id);
                      setShowMobileChat(true);
                    }}
                    className={`w-full p-3 text-start transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-500/10 dark:bg-amber-500/15 rtl:border-r-3 ltr:border-l-3 border-amber-500 shadow-xs' 
                        : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Avatar with status indicator */}
                    <div className="relative shrink-0">
                      <img
                        src={conv.participantAvatar}
                        alt={conv.participantName}
                        className="w-11 h-11 rounded-xl object-cover border border-amber-500/20"
                        referrerPolicy="no-referrer"
                      />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                        conv.isOnline ? 'bg-emerald-500 ring-1 ring-emerald-500/40' : 'bg-slate-400'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1 font-bold text-xs text-slate-900 dark:text-white truncate">
                          <span>{conv.participantName}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {lastMsg ? lastMsg.timestamp : conv.lastActive}
                        </span>
                      </div>

                      <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 truncate">
                        {conv.participantTrade}
                      </div>

                      <div className="flex items-center justify-between gap-1 mt-1">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {lastMsg ? (
                            lastMsg.isAudio ? '🎙️ تسجيل صوتي' : lastMsg.imageUrl ? '📷 صورة مرفقة' : lastMsg.text
                          ) : (
                            conv.orderSummary
                          )}
                        </p>
                        {conv.unreadCount && conv.unreadCount > 0 ? (
                          <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black flex items-center justify-center shrink-0">
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
        {/* Right Column: Active Conversation (Cols 5-12)                   */}
        {/* ============================================================== */}
        <div className={`md:col-span-8 flex flex-col h-full bg-slate-50/30 dark:bg-slate-900 ${
          showMobileChat ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Chat Header */}
          <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Mobile Back Button */}
              <button
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="رجوع للمحادثات"
              >
                <BackIcon className="w-5 h-5" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={currentConv.participantAvatar}
                  alt={currentConv.participantName}
                  className="w-10 h-10 rounded-xl object-cover border border-amber-500/25"
                  referrerPolicy="no-referrer"
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                  currentConv.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                }`} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-slate-900 dark:text-white truncate">
                    {currentConv.participantName}
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    معتمد CAP
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                  <span className="truncate">{currentConv.participantTrade}</span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{currentConv.lastActive}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Book Appointment Button */}
              <button
                onClick={() => {
                  const targetArtisan = artisans.find(a => a.id === currentConv.participantId) || artisans[0];
                  setSelectedArtisanForAppointment(targetArtisan);
                  setIsBookingAppointmentModalOpen(true);
                }}
                className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/25 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="تحديد موعد معاينة ميدانية في الروزنامة"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">حجز موعد 📅</span>
              </button>

              {/* Encrypted Call Button */}
              <button
                onClick={() => startCall(currentConv.participantName, currentConv.participantTrade, currentConv.participantAvatar)}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                title="بدء اتصال مشفر"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">اتصال مشفر</span>
              </button>
            </div>
          </div>

          {/* Active Order Context Strip */}
          <div className="px-3.5 py-2 bg-amber-50/80 dark:bg-amber-950/20 border-b border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 min-w-0">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-bold text-amber-900 dark:text-amber-200 truncate">
                {currentConv.orderSummary}
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline shrink-0">· جاري التنفيذ</span>
            </div>
            <span className="font-black font-mono text-emerald-600 dark:text-emerald-400 text-xs shrink-0">
              3,500 دج
            </span>
          </div>

          {/* Messages Thread Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/30">
            {/* End-to-end encryption pill badge */}
            <div className="text-center my-1">
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200/70 dark:border-slate-700/70 shadow-2xs">
                <Lock className="w-3 h-3 text-amber-500" />
                <span>محادثة مشفرة برمجياً لحماية خصوصية العميل والحرفي</span>
              </span>
            </div>

            {/* Date divider pill */}
            <div className="flex items-center justify-center my-2">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 dark:bg-slate-800/60 px-2.5 py-0.5 rounded-full">
                اليوم
              </span>
            </div>

            {/* Empty state if no messages */}
            {displayedMessages.length === 0 && (
              <div className="text-center py-12 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  لا توجد رسائل سابقة
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  ابدأ المحادثة مع المعلم لطرح استفساراتك أو إرسال صور العطل وتسجيل ملاحظاتك الصوتية.
                </p>
              </div>
            )}

            {/* Message items */}
            {displayedMessages.map((msg) => {
              const isAdmin = msg.senderRole === 'admin';
              const isMe = msg.senderRole === role;

              if (isAdmin) {
                return (
                  <div key={msg.id} className="flex flex-col items-center my-2 w-full animate-fade-in">
                    <div className="max-w-[85%] bg-amber-500/10 border border-amber-500/30 rounded-2xl p-2.5 text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
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
                  <div
                    className={`max-w-[82%] sm:max-w-[70%] rounded-2xl p-3 text-xs leading-relaxed space-y-1.5 relative shadow-xs transition-shadow ${
                      isMe
                        ? 'bg-amber-500 text-slate-950 rtl:rounded-br-xs ltr:rounded-bl-xs font-medium'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rtl:rounded-bl-xs ltr:rounded-br-xs'
                    }`}
                  >
                    {/* Header sender indicator */}
                    <div className="text-[10px] font-bold opacity-80 flex items-center justify-between gap-3">
                      <span>{isMe ? 'أنت' : msg.senderName}</span>
                      <button
                        onClick={() => deleteChatMessage(msg.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 transition-opacity"
                        title="حذف الرسالة"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Image Attachment in message */}
                    {msg.imageUrl && (
                      <div className="pt-0.5">
                        <img
                          src={msg.imageUrl}
                          alt="صورة العطل"
                          onClick={() => setLightboxImage(msg.imageUrl || null)}
                          className="w-full max-h-56 rounded-xl object-cover border border-black/10 dark:border-white/10 cursor-pointer hover:opacity-95 shadow-xs transition-opacity"
                        />
                      </div>
                    )}

                    {/* Audio Note in message */}
                    {msg.isAudio ? (
                      <div className="py-0.5">
                        <VoiceNotePlayer 
                          audioUrl={msg.audioUrl} 
                          duration={msg.audioDuration || '0:16'} 
                          isMe={isMe} 
                        />
                      </div>
                    ) : msg.text ? (
                      <p className="whitespace-pre-wrap leading-relaxed text-[13px]">{msg.text}</p>
                    ) : null}

                    {/* Bottom Metadata: Timestamp & Status ticks */}
                    <div className="flex items-center justify-end gap-1 text-[9px] font-mono opacity-70 pt-0.5">
                      <span>{msg.timestamp}</span>
                      {isMe && (
                        <CheckCheck className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 inline" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Collapsible Quick Replies Bar */}
          {showQuickReplies && (
            <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar animate-fade-in">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 shrink-0 flex items-center gap-1">
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
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-300 whitespace-nowrap transition-colors shrink-0 cursor-pointer shadow-2xs"
                >
                  {preset}
                </button>
              ))}
            </div>
          )}

          {/* Attached image preview bar */}
          {attachedImage && (
            <div className="px-3.5 py-2 bg-amber-500/10 border-t border-amber-500/25 flex items-center justify-between animate-fade-in shrink-0">
              <div className="flex items-center gap-2.5">
                <img
                  src={attachedImage}
                  alt="مرفق صورة العطل"
                  className="w-10 h-10 object-cover rounded-xl border border-amber-500 shadow-2xs"
                />
                <div>
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                    صورة العطل مرفقة وجاهزة للإرسال
                  </span>
                  <span className="text-[10px] text-slate-500">اضغط إرسال أو اكتب تعليقاً توضيحياً</span>
                </div>
              </div>
              <button
                onClick={() => setAttachedImage(null)}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                title="إلغاء المرفق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Composer Bar OR Live Audio Recording Bar */}
          {isRecording ? (
            <div className="p-3 bg-red-500/10 dark:bg-red-950/30 border-t border-red-500/30 flex items-center justify-between gap-3 animate-fade-in shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-red-600 animate-ping inline-block" />
                <div>
                  <span className="text-xs font-bold text-red-700 dark:text-red-400 block">
                    جاري تسجيل صوتك الآن... 🎙️
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs font-black text-red-600 dark:text-red-300">
                      0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                    </span>
                    {/* Dynamic wave bars */}
                    <div className="flex items-center gap-0.5 h-3">
                      {[30, 70, 100, 50, 85, 40, 95, 60, 80].map((h, idx) => (
                        <div
                          key={idx}
                          className="w-1 bg-red-500 rounded-full animate-pulse"
                          style={{
                            height: `${Math.min(100, Math.max(20, (h * ((recordingSeconds % 3) + 1)) / 3))}%`,
                            animationDuration: `${0.4 + (idx % 3) * 0.2}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-slate-700 dark:text-slate-200 hover:text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="إلغاء التسجيل"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>إلغاء</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinishAndSendRecording}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                  title="إرسال التسجيل الصوتي"
                >
                  <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>إرسال</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Quick Replies Toggle */}
              <button
                type="button"
                onClick={() => setShowQuickReplies(prev => !prev)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  showQuickReplies 
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="الردود السريعة الجاهزة"
              >
                <Zap className="w-4 h-4" />
              </button>

              {/* Image upload button */}
              <label
                className="p-2 text-slate-500 hover:text-amber-500 dark:text-slate-400 cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="إرفاق صورة للعطل"
              >
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              {/* Voice record button */}
              <button
                type="button"
                onClick={handleStartRecording}
                className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                title="بدء تسجيل رسالة صوتية للحرفي"
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Text input */}
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={attachedImage ? 'أضف شرحاً للصورة (اختياري)...' : 'اكتب رسالتك للحرفي هنا...'}
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!inputVal.trim() && !attachedImage}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 rounded-xl flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
                title="إرسال"
              >
                <Send className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Full Image View */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImage}
              alt="عرض صورة العطل"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/10"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 left-3 p-2 bg-slate-900/80 text-white rounded-full hover:bg-slate-950 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
