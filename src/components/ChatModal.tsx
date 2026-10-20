import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Send, 
  Mic, 
  Image, 
  ShieldCheck, 
  PhoneCall, 
  Lock,
  Trash2,
  Calendar,
  CheckCheck,
  Zap,
  ShieldAlert,
  CheckCircle2,
  ArrowDown,
  ArrowUp,
  ChevronUp
} from 'lucide-react';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { AudioRecordingSession } from '../utils/audioRecorder';

export const ChatModal: React.FC = () => {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    messages, 
    sendMessage, 
    deleteChatMessage,
    activeOrder, 
    startCall, 
    role, 
    t, 
    setIsBookingAppointmentModalOpen,
    setSelectedArtisanForAppointment,
    artisans,
    language,
    reportArtisan
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportSentSuccess, setReportSentSuccess] = useState(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [showScrollTopBtn, setShowScrollTopBtn] = useState(false);

  // Messages container reference for reliable, bug-free scrolling
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);
  const recordingSessionRef = useRef<AudioRecordingSession | null>(null);

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

  // Scroll to bottom on initial open
  useEffect(() => {
    if (isChatOpen) {
      const timer = setTimeout(() => {
        scrollToBottom('auto');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen]);

  // Scroll to bottom only on new messages arrival
  useEffect(() => {
    if (isChatOpen) {
      const timer = setTimeout(() => {
        scrollToBottom('smooth');
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [messages.length, isChatOpen]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollBottomBtn(distanceToBottom > 80);
    setShowScrollTopBtn(container.scrollTop > 80);
  };

  if (!isChatOpen) return null;

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
  };

  const handleSend = () => {
    if (!inputVal.trim() && !attachedImage) return;
    sendMessage(inputVal.trim(), false, undefined, attachedImage || undefined);
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
        language === 'ar' ? 'تسجيل صوتي استفساري 🎙️' : 'Voice note inquiry 🎙️',
        true,
        result.durationStr,
        undefined,
        result.audioUrl
      );
    }
    setIsRecording(false);
    setRecordingSeconds(0);
    recordingSessionRef.current = null;
    setTimeout(() => scrollToBottom('smooth'), 50);
  };

  const quickReplies = language === 'ar' ? [
    'أنا في انتظارك أمام الباب',
    'هل تحتاج إلى شراء قطع غيار إضافية؟',
    'مكان العمل جاهز ومفرغ بالكامل',
    'وصلت إلى موقع التدخل'
  ] : [
    'Waiting at the entrance',
    'Do you need extra materials?',
    'Workplace is ready',
    'Arrived on site'
  ];

  const participantName = activeOrder?.artisanName || (role === 'client' ? 'المعلم كمال بلقاسم' : 'هشام بن علي (العميل)');
  const participantAvatar = activeOrder?.artisanAvatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col h-[580px] max-h-[88vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-3.5 py-3 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img 
                src={participantAvatar} 
                alt={participantName} 
                className="w-9 h-9 rounded-xl object-cover border border-amber-500/30"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {participantName}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                <Lock className="w-2.5 h-2.5" />
                <span>{language === 'ar' ? 'محادثة مشفرة وآمنة' : 'Encrypted Chat'}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowReportDialog(true)}
              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              title="إبلاغ عن مخالفة"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const targetArtisan = artisans[0];
                setSelectedArtisanForAppointment(targetArtisan);
                setIsBookingAppointmentModalOpen(true);
              }}
              className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/25 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="حجز موعد في الروزنامة"
            >
              <Calendar className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">حجز موعد</span>
            </button>
            <button
              onClick={() => startCall(participantName, 'مقدم خدمة معتمد', participantAvatar)}
              className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors cursor-pointer"
              title={t.callArtisan}
            >
              <PhoneCall className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Context Banner */}
        <div className="px-3.5 py-1.5 bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/20 flex items-center justify-between text-[11px] shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-bold text-amber-700 dark:text-amber-300 truncate">
              {activeOrder ? activeOrder.subServiceName : 'مهمة تدخل صيانة منزلية مباشرة'}
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline shrink-0">· حي البساتين</span>
          </div>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
            {activeOrder?.actualCost || 3500} دج
          </span>
        </div>

        {/* Report Artisan Confirmation Dialog Banner */}
        {showReportDialog && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border-b border-rose-200 dark:border-rose-800 animate-slide-down flex items-start gap-2.5 shrink-0">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200 block">
                تأكيد التبليغ عن الحرفي للإدارة:
              </span>
              <p className="text-[10px] text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
                هل لاحظت أي سلوك غير مهني أو طلب أسعار غير متفق عليها؟ سيقوم المشرف بالتحقيق في المحادثة فوراً.
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    reportArtisan(activeOrder?.artisanId || 'unknown', 'inappropriate');
                    setShowReportDialog(false);
                    setReportSentSuccess(true);
                    setTimeout(() => setReportSentSuccess(false), 4000);
                  }}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold shadow-xs cursor-pointer"
                >
                  نعم، إرسال البلاغ
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportDialog(false)}
                  className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-bold cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Sent Success Banner */}
        {reportSentSuccess && (
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5 animate-fade-in shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>تم استلام بلاغك وسيقوم المشرف بفحص الحالة ومراجعتها خلال 15 دقيقة.</span>
          </div>
        )}

        {/* Message Thread: Bug-free Container-level Scrolling */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-slate-50/50 dark:bg-slate-950/30 overscroll-contain"
          style={{ overscrollBehavior: 'contain' }}
        >
          {/* Security Notice Pill */}
          <div className="text-center my-1">
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
              <Lock className="w-2.5 h-2.5 text-amber-500" />
              <span>{t.secureCommunicationNotice}</span>
            </span>
          </div>

          {/* Date pill */}
          <div className="flex items-center justify-center my-1">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 dark:bg-slate-800/60 px-2 py-0.5 rounded-full">
              {language === 'ar' ? 'اليوم' : 'Today'}
            </span>
          </div>

          {messages.map((msg) => {
            const isAdmin = msg.senderRole === 'admin';
            const isMe = msg.senderRole === role;

            if (isAdmin) {
              return (
                <div key={msg.id} className="flex flex-col items-center my-2 w-full animate-fade-in">
                  <div className="max-w-[88%] bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-center space-y-0.5">
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
                <div className={`flex items-end gap-1.5 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && (
                    <img
                      src={participantAvatar}
                      alt={msg.senderName}
                      className="w-5 h-5 rounded-md object-cover mb-0.5 border shrink-0"
                    />
                  )}

                  <div
                    className={`p-2.5 rounded-2xl text-xs leading-relaxed space-y-1 shadow-2xs ${
                      isMe
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-ee-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-es-sm'
                    }`}
                  >
                    <div className="text-[10px] font-bold opacity-75 flex items-center justify-between gap-2.5">
                      <span>{isMe ? (language === 'ar' ? 'أنت' : 'You') : msg.senderName}</span>
                      <button
                        onClick={() => deleteChatMessage(msg.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 transition-opacity cursor-pointer"
                        title="حذف الرسالة"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Image attachment in chat */}
                    {msg.imageUrl && (
                      <div className="pt-0.5">
                        <img
                          src={msg.imageUrl}
                          alt="مرفق صورة العطل"
                          onClick={() => setLightboxImage(msg.imageUrl || null)}
                          className="w-full max-h-48 rounded-xl object-cover border border-black/10 dark:border-white/10 cursor-pointer hover:opacity-95 shadow-2xs"
                        />
                      </div>
                    )}

                    {/* Audio message card */}
                    {msg.isAudio ? (
                      <div className="py-0.5">
                        <VoiceNotePlayer
                          audioUrl={msg.audioUrl}
                          duration={msg.audioDuration || '0:14'}
                          isMe={isMe}
                        />
                      </div>
                    ) : msg.text ? (
                      <p className="whitespace-pre-wrap leading-relaxed text-[12.5px]">{msg.text}</p>
                    ) : null}

                    {/* Bottom metadata */}
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
        <div className="absolute bottom-16 left-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
          {showScrollTopBtn && (
            <button
              onClick={() => scrollToTop('smooth')}
              className="px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-amber-400 font-bold rounded-xl shadow-lg border border-amber-500/30 transition-all active:scale-95 cursor-pointer flex items-center gap-1 text-[11px] backdrop-blur-xs"
              title="الصعود لأعلى الرسائل"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>أعلى المحادثة</span>
            </button>
          )}

          {showScrollBottomBtn && (
            <button
              onClick={() => scrollToBottom('smooth')}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg border border-amber-300 transition-all active:scale-95 cursor-pointer flex items-center gap-1 text-[11px]"
              title="النزول لآخر رسالة"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>أحدث الرسائل</span>
            </button>
          )}
        </div>

        {/* Collapsible Quick replies carousel */}
        {showQuickReplies && (
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0 animate-fade-in">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => {
                  sendMessage(reply);
                  setShowQuickReplies(false);
                  setTimeout(() => scrollToBottom('smooth'), 50);
                }}
                className="px-2 py-0.5 text-[10px] font-medium bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-md hover:border-amber-400 whitespace-nowrap transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Attached image preview bar */}
        {attachedImage && (
          <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-800 flex items-center justify-between shrink-0 animate-fade-in">
            <div className="flex items-center gap-2">
              <img
                src={attachedImage}
                alt="معاينة"
                className="w-8 h-8 object-cover rounded-lg border border-amber-500"
              />
              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200">
                صورة توضيحية جاهزة
              </span>
            </div>
            <button
              onClick={() => setAttachedImage(null)}
              className="p-1 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
              title="إلغاء المرفق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input Bar or Live Audio Recording Bar */}
        {isRecording ? (
          <div className="p-2.5 bg-red-500/10 dark:bg-red-950/30 border-t border-red-500/30 flex items-center justify-between gap-2 shrink-0 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
              <span className="text-xs font-bold text-red-700 dark:text-red-400">
                تسجيل صوتي... 🎙️
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
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="الردود السريعة"
            >
              <Zap className="w-4 h-4" />
            </button>

            <label
              className="p-1.5 text-slate-500 hover:text-amber-500 dark:text-slate-400 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="إرفاق صورة"
            >
              <Image className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleStartRecording}
              className="p-1.5 text-slate-500 hover:text-red-500 dark:text-slate-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              title={t.voiceNote}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={attachedImage ? 'أضف تعليقاً...' : t.typeMessage}
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

        {/* Lightbox Modal */}
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
    </div>
  );
};
