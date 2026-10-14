import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Send, 
  Mic, 
  Image, 
  Play, 
  Pause, 
  ShieldCheck, 
  PhoneCall, 
  Lock,
  Trash2,
  Calendar,
  CheckCheck,
  Zap,
  ShieldAlert
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);
  const recordingSessionRef = useRef<AudioRecordingSession | null>(null);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

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
  };

  const quickReplies = language === 'ar' ? [
    'أنا في انتظارك أمام الباب',
    'هل تحتاج إلى شراء قطع غيار إضافية؟',
    'تم تجهيز مكان العمل بالكامل',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[600px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={participantAvatar} 
                alt={participantName} 
                className="w-10 h-10 rounded-xl object-cover border border-amber-500/30"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {participantName}
                </span>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>{language === 'ar' ? 'محادثة مشفرة وآمنة' : 'Encrypted Chat'}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('هل أنت متأكد أنك تريد التبليغ عن هذا الحرفي؟')) {
                  reportArtisan(activeOrder?.artisanId || 'unknown', 'inappropriate');
                  alert('تم إرسال البلاغ للإدارة بنجاح.');
                }
              }}
              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
              title="إبلاغ عن حرفي"
            >
              <ShieldAlert className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const targetArtisan = artisans[0];
                setSelectedArtisanForAppointment(targetArtisan);
                setIsBookingAppointmentModalOpen(true);
              }}
              className="px-2.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="تحديد موعد في الروزنامة"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">حجز موعد</span>
            </button>
            <button
              onClick={() => startCall(participantName, 'مقدم خدمة معتمد', participantAvatar)}
              className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl transition-colors cursor-pointer"
              title={t.callArtisan}
            >
              <PhoneCall className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Order Context Banner */}
        <div className="px-4 py-2 bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-amber-700 dark:text-amber-300">
              {activeOrder ? activeOrder.subServiceName : 'مهمة تدخل صيانة منزلية مباشرة'}
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">· حي البساتين (0.8 كم)</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {activeOrder?.actualCost || 3500} دج
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Security Notice Pill */}
          <div className="text-center my-1">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full">
              <Lock className="w-3 h-3 text-amber-500" />
              <span>{t.secureCommunicationNotice}</span>
            </span>
          </div>

          {/* Date pill */}
          <div className="flex items-center justify-center my-1.5">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 dark:bg-slate-800/60 px-2.5 py-0.5 rounded-full">
              {language === 'ar' ? 'اليوم' : 'Today'}
            </span>
          </div>

          {messages.map((msg) => {
            const isAdmin = msg.senderRole === 'admin';
            const isMe = msg.senderRole === role;

            if (isAdmin) {
              return (
                <div key={msg.id} className="flex flex-col items-center my-2 w-full animate-fade-in">
                  <div className="max-w-[90%] bg-amber-500/10 border border-amber-500/30 rounded-2xl p-2.5 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-300">
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
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-1.5 shadow-2xs ${
                    isMe
                      ? 'bg-amber-500 text-slate-950 rtl:rounded-br-xs ltr:rounded-bl-xs font-medium'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rtl:rounded-bl-xs ltr:rounded-br-xs'
                  }`}
                >
                  <div className="text-[10px] font-bold opacity-80 flex items-center justify-between gap-3">
                    <span>{isMe ? (language === 'ar' ? 'أنت' : 'You') : msg.senderName}</span>
                    <button
                      onClick={() => deleteChatMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 transition-opacity"
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
                        className="w-full max-h-52 rounded-xl object-cover border border-black/10 dark:border-white/10 cursor-pointer hover:opacity-95 transition-opacity shadow-xs"
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
                    <p className="whitespace-pre-wrap leading-relaxed text-[13px]">{msg.text}</p>
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
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Collapsible Quick replies carousel */}
        {showQuickReplies && (
          <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1.5 overflow-x-auto no-scrollbar animate-fade-in">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => {
                  sendMessage(reply);
                  setShowQuickReplies(false);
                }}
                className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-lg hover:border-amber-400 hover:text-amber-600 whitespace-nowrap transition-colors shrink-0 shadow-2xs"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Attached image preview bar */}
        {attachedImage && (
          <div className="px-3 py-2 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-800 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <img
                src={attachedImage}
                alt="معاينة"
                className="w-10 h-10 object-cover rounded-lg border border-amber-500"
              />
              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200">
                صورة توضيحية للعطل جاهزة للإرسال
              </span>
            </div>
            <button
              onClick={() => setAttachedImage(null)}
              className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
              title="إلغاء المرفق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar or Live Audio Recording Bar */}
        {isRecording ? (
          <div className="p-3 bg-red-500/10 dark:bg-red-950/30 border-t border-red-500/30 flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping inline-block" />
              <div>
                <span className="text-xs font-bold text-red-700 dark:text-red-400 block">
                  تسجيل صوتي جاري... 🎙️
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs font-black text-red-600 dark:text-red-300">
                    0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                  </span>
                  <div className="flex items-center gap-0.5 h-2.5">
                    {[30, 75, 100, 50, 85, 40, 95].map((h, idx) => (
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
                className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 text-slate-700 dark:text-slate-200 hover:text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="إلغاء"
              >
                <Trash2 className="w-3 h-3" />
                <span>إلغاء</span>
              </button>

              <button
                type="button"
                onClick={handleFinishAndSendRecording}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                title="إرسال التسجيل"
              >
                <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>إرسال</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 sm:gap-2">
            {/* Quick replies trigger */}
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

            {/* Image attach button */}
            <label
              className="p-2 text-slate-500 hover:text-amber-500 dark:text-slate-400 cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="إرفاق صورة للعطل"
            >
              <Image className="w-4 h-4 sm:w-5 sm:h-5" />
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
              className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              title={t.voiceNote}
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={attachedImage ? 'أضف تعليقاً على الصورة (اختياري)...' : t.typeMessage}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />

            <button
              onClick={handleSend}
              disabled={!inputVal.trim() && !attachedImage}
              className="w-9 h-9 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
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
