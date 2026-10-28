import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Mail, 
  Phone, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Send, 
  Headphones, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Paperclip, 
  Trash2, 
  HelpCircle, 
  ShieldAlert, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Search, 
  User, 
  ShieldCheck, 
  MessageCircle, 
  Smartphone,
  ArrowUp,
  ArrowDown,
  Wrench,
  Scale,
  Lightbulb,
  ExternalLink
} from 'lucide-react';

interface LiveChatMessage {
  id: string;
  sender: 'user' | 'agent';
  senderName: string;
  text: string;
  time: string;
}

export const ContactUsModal: React.FC = () => {
  const { 
    isContactModalOpen, 
    setIsContactModalOpen, 
    playStoreConfig, 
    currentUser,
    supportTickets,
    addSupportTicket,
    deleteSupportTicket,
    addTicketUserReply
  } = useApp();

  // Active Tab: Live Chat by default for easiest, instant assistance
  const [activeTab, setActiveTab] = useState<'live_chat' | 'form' | 'my_tickets' | 'channels' | 'faq'>('live_chat');

  // Form State
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState<'general' | 'complaint' | 'financial' | 'partnership' | 'suggestion' | 'technical' | 'account_deletion' | 'emergency'>('general');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'emergency'>('normal');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachmentImage, setAttachmentImage] = useState<string | null>(null);

  // Submission Feedback State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; ticketNumber: string } | null>(null);
  const [copiedTicketNum, setCopiedTicketNum] = useState<string | null>(null);
  const [copiedChannelText, setCopiedChannelText] = useState<string | null>(null);

  // Ticket Filter & Follow-up Reply State in 'my_tickets'
  const [ticketFilter, setTicketFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');
  const [activeReplyTicketId, setActiveReplyTicketId] = useState<string | null>(null);
  const [replyInputText, setReplyInputText] = useState('');

  // FAQ State
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedFaqIndex, setCopiedFaqIndex] = useState<number | null>(null);

  // Live Chat State
  const [liveChatMessages, setLiveChatMessages] = useState<LiveChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'agent',
      senderName: 'أنيسة (خدمة العملاء)',
      text: 'مرحباً بك في منصة خـدّام! 👋 أنا أنيسة من فريق التنسيق والدعم الفني. كيف يمكنني مساعدتك اليوم؟',
      time: 'الآن'
    }
  ]);
  const [liveChatInput, setLiveChatInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // Refs for isolated, smooth scrolling without touching outer page
  const liveChatContainerRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const [showModalScrollTop, setShowModalScrollTop] = useState(false);

  const scrollLiveChatToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const c = liveChatContainerRef.current;
    if (c) c.scrollTo({ top: c.scrollHeight, behavior });
  };

  const scrollLiveChatToTop = (behavior: ScrollBehavior = 'smooth') => {
    const c = liveChatContainerRef.current;
    if (c) c.scrollTo({ top: 0, behavior });
  };

  const scrollModalToTop = (behavior: ScrollBehavior = 'smooth') => {
    const b = modalBodyRef.current;
    if (b) b.scrollTo({ top: 0, behavior });
  };

  // Sync user info on open
  useEffect(() => {
    if (isContactModalOpen) {
      if (currentUser?.name && currentUser.name !== 'مستخدم زائر') {
        setName(currentUser.name);
      }
      if (currentUser?.phone) {
        setContact(currentUser.phone);
      }
    }
  }, [isContactModalOpen, currentUser]);

  // Reset modal scroll on tab change
  useEffect(() => {
    modalBodyRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeTab]);

  // Safe isolated live chat scroll
  useEffect(() => {
    if (activeTab === 'live_chat') {
      const timer = setTimeout(() => {
        scrollLiveChatToBottom('smooth');
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [liveChatMessages.length, activeTab, isAgentTyping]);

  const handleModalBodyScroll = () => {
    const b = modalBodyRef.current;
    if (!b) return;
    setShowModalScrollTop(b.scrollTop > 120);
  };

  if (!isContactModalOpen) return null;

  // Contact details
  const contactDetails = {
    phone: playStoreConfig.supportPhone || '+213 23 45 67 89',
    whatsapp: playStoreConfig.whatsappNumber || '+213 550 12 34 56',
    email: playStoreConfig.supportEmail || 'support@khodam.dz',
    address: playStoreConfig.supportAddress || 'الجزائر العاصمة، الأبيار - حي البساتين (برج الأعمال)',
    workingHours: playStoreConfig.workingHours || 'السبت - الخميس: 08:00 - 20:00 (الطوارئ 24/7)',
    website: playStoreConfig.websiteUrl || 'https://khodam.dz'
  };

  const handleImageAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAttachmentImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const generatedTicketNumber = `TK-${Math.floor(10000 + Math.random() * 90000)}`;

    setTimeout(() => {
      addSupportTicket({
        ticketNumber: generatedTicketNumber,
        name: name.trim(),
        contact: contact.trim(),
        contactMethod: 'phone',
        category,
        priority,
        subject: subject.trim() || (
          category === 'complaint' ? 'شكوى أو نزاع حول خدمة' :
          category === 'financial' ? 'نزاع مالي أو استفسار ضمان' :
          category === 'suggestion' ? 'اقتراح وتطوير' :
          category === 'emergency' ? 'بلاغ طارئ وتدخل عاجل' :
          'طلب مساعدة واستفسار عام'
        ),
        message: message.trim(),
        attachmentUrl: attachmentImage || undefined
      });

      setIsSubmitting(false);
      setSubmittedTicket({ id: `ticket_${Date.now()}`, ticketNumber: generatedTicketNumber });
    }, 350);
  };

  const copyToClipboard = (text: string, type: 'ticket' | 'channel' | 'faq', faqIdx?: number) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'ticket') {
        setCopiedTicketNum(text);
        setTimeout(() => setCopiedTicketNum(null), 2500);
      } else if (type === 'channel') {
        setCopiedChannelText(text);
        setTimeout(() => setCopiedChannelText(null), 2500);
      } else if (type === 'faq' && faqIdx !== undefined) {
        setCopiedFaqIndex(faqIdx);
        setTimeout(() => setCopiedFaqIndex(null), 2500);
      }
    }
  };

  const handleSendTicketReply = (ticketId: string) => {
    if (!replyInputText.trim()) return;
    addTicketUserReply(ticketId, replyInputText.trim());
    setReplyInputText('');
    setActiveReplyTicketId(null);
  };

  const handleSendLiveChatMessage = () => {
    if (!liveChatInput.trim()) return;
    const userMsg = liveChatInput.trim();
    const nowTime = new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' });

    setLiveChatMessages(prev => [
      ...prev,
      {
        id: `user_${Date.now()}`,
        sender: 'user',
        senderName: name || 'أنت',
        text: userMsg,
        time: nowTime
      }
    ]);
    setLiveChatInput('');
    setIsAgentTyping(true);

    setTimeout(() => {
      let reply = 'شكراً لتواصلك! استلمت استفسارك وسأساعدك فوراً. إذا كان طلبك طارئاً يمكنك الاتصال المباشر على الرقم 24/7.';
      const lower = userMsg.toLowerCase();
      if (lower.includes('حرفي') || lower.includes('طلب') || lower.includes('خدمة') || lower.includes('سباك') || lower.includes('كهربائي')) {
        reply = 'يمكنك طلب أي حرفي معتمد عبر القائمة الرئيسية أو زر الرادار، مع رؤية تقييماته وبطاقته المهنية المعتمدة قبل تأكيد الطلب.';
      } else if (lower.includes('سعر') || lower.includes('تكلفة') || lower.includes('دج') || lower.includes('دينار') || lower.includes('كم')) {
        reply = 'أسعار الخدمات الاسترشادية محددة بدقة في قسم "دليل الأسعار المعتمدة" لمنع المزايدة وضمان العدالة بين الطرفين.';
      } else if (lower.includes('ضمان') || lower.includes('شكوى') || lower.includes('نزاع') || lower.includes('حق')) {
        reply = 'حقك مضمون 100%! في حال أي خلاف أو عدم اكتمال العمل، افتح تذكرة نزاع من هنا وسيقوم خبير المنصة بالتحقيق فوراً.';
      } else if (lower.includes('طوارئ') || lower.includes('غاز') || lower.includes('ماء') || lower.includes('تسرب')) {
        reply = '🚨 لحالات الطوارئ الميدانية العاجلة، اضغط على تبويب "اتصال مباشر" للاتصال بخط الطوارئ المجاني.';
      }

      setLiveChatMessages(prev => [
        ...prev,
        {
          id: `agent_${Date.now()}`,
          sender: 'agent',
          senderName: 'أنيسة (خدمة العملاء)',
          text: reply,
          time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsAgentTyping(false);
    }, 900);
  };

  const simpleCategories = [
    { id: 'general', label: 'صيانة ومساعدة عامة', icon: Wrench, color: 'text-amber-600 bg-amber-500/10 border-amber-500/30' },
    { id: 'complaint', label: 'شكوى أو نزاع مالي', icon: Scale, color: 'text-rose-600 bg-rose-500/10 border-rose-500/30' },
    { id: 'suggestion', label: 'اقتراح أو استفسار', icon: Lightbulb, color: 'text-blue-600 bg-blue-500/10 border-blue-500/30' },
    { id: 'emergency', label: 'بلاغ طارئ وتدخل عاجل', icon: ShieldAlert, color: 'text-red-600 bg-red-500/10 border-red-500/30' }
  ];

  const faqs = [
    {
      cat: 'الضمان',
      q: 'كيف يضمن تطبيق خـدّام حقي في حال وجود خلاف مع الحرفي؟',
      a: 'تلتزم المنصة بفحص هوية الحرفيين وسجلهم. في حال حدوث خلاف، تفتح تذكرة نزاع عبر علبة التواصل ويتدخل خبير لمعاينة العمل أو استرداد حقوقك.'
    },
    {
      cat: 'التوثيق',
      q: 'كيف يتم توثيق الحرفي واعتماد شهاداته المهنية؟',
      a: 'يمر الحرفي بـ 3 مستويات: التحقق من بطاقة التعريف وسجل السوابق، دبلوم التكوين المهني أو الغرفة الولائية، واختبار عملي مع تقييمات موثقة.'
    },
    {
      cat: 'الخصوصية',
      q: 'هل الاتصال الهاتفي والمراسلة داخل التطبيق محمية ومشفرة؟',
      a: 'نعم، يعتمد التطبيق على خاصية إخفاء الرقم (Private Masked VoIP) وتشفير المحادثات، فلا يظهر رقمك الشخصي للطرف الآخر.'
    },
    {
      cat: 'المواعيد',
      q: 'ما هي مواعيد الدعم الفني وسرعة الرد على التذاكر؟',
      a: 'فريق الدعم متاح من السبت إلى الخميس بين 08:00 و 20:00 بمتوسط استجابة أقل من 30 دقيقة، مع خط طوارئ 24/7 للحالات الحرجة.'
    },
    {
      cat: 'الحساب',
      q: 'كيف يمكنني حذف بياناتي وحسابي نهائياً من التطبيق؟',
      a: 'يمكنك اختيار تصنيف "حذف الحساب" من هنا أو عبر الملف الشخصي، ويتم مسح بياناتك نهائياً من خوادمنا خلال 24 ساعة وفق معايير Google Play.'
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    !faqSearchQuery.trim() || 
    f.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg max-h-[88vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ============================================================== */}
        {/* Header: Clean, Trustworthy & Professional                      */}
        {/* ============================================================== */}
        <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  مركز التواصل والدعم الفني
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  متاح الآن
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                فريق خدمة العملاء جاهز لمساعدتك وحل أي استفسار
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsContactModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* Navigation Tabs Bar: Segmented, Spacious & Easy to Tap         */}
        {/* ============================================================== */}
        <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/50 shrink-0">
          <div className="grid grid-cols-5 gap-1 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            {/* Tab 1: Live Chat */}
            <button
              onClick={() => setActiveTab('live_chat')}
              className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'live_chat'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">محادثة</span>
            </button>

            {/* Tab 2: New Ticket */}
            <button
              onClick={() => {
                setActiveTab('form');
                setSubmittedTicket(null);
              }}
              className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
              <span className="truncate">تذكرة</span>
            </button>

            {/* Tab 3: My Tickets */}
            <button
              onClick={() => setActiveTab('my_tickets')}
              className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer relative ${
                activeTab === 'my_tickets'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">تذاكري</span>
              {supportTickets.length > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                  activeTab === 'my_tickets' ? 'bg-slate-950 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  {supportTickets.length}
                </span>
              )}
            </button>

            {/* Tab 4: Direct Channels */}
            <button
              onClick={() => setActiveTab('channels')}
              className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'channels'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">اتصال</span>
            </button>

            {/* Tab 5: FAQ */}
            <button
              onClick={() => setActiveTab('faq')}
              className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">الأسئلة</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Content Body: Clean, High Readability & Smooth Touch Scrolling */}
        {/* ============================================================== */}
        <div 
          ref={modalBodyRef}
          onScroll={handleModalBodyScroll}
          className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >

          {/* ============================================================ */}
          {/* TAB 1: LIVE CHAT (محادثة مباشرة فورية مع الدعم)             */}
          {/* ============================================================ */}
          {activeTab === 'live_chat' && (
            <div className="space-y-3 flex flex-col h-full min-h-[360px]">
              {/* Agent Status Strip with Jump Buttons */}
              <div className="p-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl flex items-center justify-between border border-slate-700/60 shadow-xs shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    أن
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs">أنيسة بوزيان</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      <span>متصلة للرد الفوري المباشر</span>
                    </span>
                  </div>
                </div>

                {/* Quick Scroll Jump Buttons */}
                <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => scrollLiveChatToTop('smooth')}
                    className="px-2 py-1 text-[10px] font-bold text-slate-300 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                    title="الصعود لأعلى المحادثة"
                  >
                    <ArrowUp className="w-3 h-3" />
                    <span className="hidden sm:inline">الأعلى</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollLiveChatToBottom('smooth')}
                    className="px-2 py-1 text-[10px] font-bold text-slate-300 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                    title="النزول لآخر رسالة"
                  >
                    <ArrowDown className="w-3 h-3" />
                    <span className="hidden sm:inline">الأسفل</span>
                  </button>
                </div>
              </div>

              {/* Chat Thread Container: Isolated & Smooth */}
              <div 
                ref={liveChatContainerRef}
                className="h-64 sm:h-72 overflow-y-auto p-3.5 bg-slate-50/80 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 relative overscroll-contain"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {liveChatMessages.map((msg) => {
                  const isMe = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed space-y-1 shadow-2xs ${
                          isMe
                            ? 'bg-amber-500 text-slate-950 rounded-ee-sm font-medium'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-es-sm'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="text-[9px] font-mono opacity-60 block text-end pt-0.5">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isAgentTyping && (
                  <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-xl max-w-[140px] border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                    <span>أنيسة تكتب...</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  </div>
                )}
              </div>

              {/* Quick Questions Suggestions */}
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
                {[
                  'كيف أضمن حقي عند طلب حرفي؟',
                  'أسعار الصيانة والتدخل المقترحة',
                  'التبليغ عن نزاع أو شكوى طارئة',
                  'كيف يتم توثيق شارة الحرفي؟'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLiveChatInput(prompt)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer shrink-0 border border-slate-200/60 dark:border-slate-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="flex items-center gap-2 pt-1 shrink-0">
                <input
                  type="text"
                  value={liveChatInput}
                  onChange={(e) => setLiveChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendLiveChatMessage()}
                  placeholder="اكتب استفسارك هنا..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendLiveChatMessage}
                  disabled={!liveChatInput.trim()}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-transform active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>إرسال</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: NEW TICKET (تذكرة جديدة سهلة ومباشرة)                 */}
          {/* ============================================================ */}
          {activeTab === 'form' && (
            <div>
              {submittedTicket ? (
                /* Success View */
                <div className="py-8 px-4 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl text-center space-y-3.5 animate-fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      تم تسجيل تذكرتك بنجاح!
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                      سيقوم فريق خدمة العملاء بمراجعة تذكرتك والتواصل معك في أقرب وقت.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-emerald-800 max-w-xs mx-auto shadow-sm space-y-1">
                    <span className="text-[11px] text-slate-500 block">
                      رقم التذكرة للمتابعة:
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                        #{submittedTicket.ticketNumber}
                      </span>
                      <button
                        onClick={() => copyToClipboard(submittedTicket.ticketNumber, 'ticket')}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
                        title="نسخ رقم التذكرة"
                      >
                        {copiedTicketNum === submittedTicket.ticketNumber ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => setActiveTab('my_tickets')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>متابعة التذكرة في سجلي</span>
                    </button>
                    <button
                      onClick={() => {
                        setSubmittedTicket(null);
                        setMessage('');
                        setSubject('');
                        setAttachmentImage(null);
                      }}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer"
                    >
                      فتح تذكرة أخرى
                    </button>
                  </div>
                </div>
              ) : (
                /* The Easy 3-Step Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Step 1: Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                      1. اختر نوع الطلب أو المشكلة:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {simpleCategories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.id;
                        return (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => setCategory(cat.id as any)}
                            className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex items-center gap-2.5 ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white ring-2 ring-amber-500/20'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-amber-300'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold leading-snug">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Contact Phone & Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        الاسم الكامل *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="مثال: هشام بن علي"
                          className="w-full pl-3 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute top-3 right-3 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        رقم الهاتف للتواصل *
                      </label>
                      <div className="flex items-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
                        <span className="px-2.5 py-2.5 bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold select-none shrink-0">
                          🇩🇿 +213
                        </span>
                        <input
                          type="tel"
                          required
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          placeholder="0550 12 34 56"
                          className="w-full px-3 py-2.5 bg-transparent text-xs focus:outline-none dir-ltr text-left font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Message Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        2. اشرح المشكلة أو الاستفسار *
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {message.length} حرف
                      </span>
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتب تفاصيل طلبك هنا بوضوح، ورقم الطلب إن وُجد..."
                      className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Image Attachment & Submit Button */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                      <Paperclip className="w-3.5 h-3.5 text-amber-500" />
                      <span>{attachmentImage ? 'تم إرفاق صورة ✓' : 'إرفاق صورة'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageAttachment}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting || !name.trim() || !contact.trim() || !message.trim()}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20 transition-transform active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                      <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال التذكرة الآن'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: MY TICKETS (تذاكري وسجل المتابعة مع الرد المباشر)      */}
          {/* ============================================================ */}
          {activeTab === 'my_tickets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  قائمة التذاكر المسجلة ({supportTickets.length})
                </span>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
                  {(['all', 'new', 'in_progress', 'resolved'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setTicketFilter(st)}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        ticketFilter === st ? 'bg-amber-500 text-slate-950' : 'text-slate-500'
                      }`}
                    >
                      {st === 'all' ? 'الكل' : st === 'new' ? 'جديدة' : st === 'in_progress' ? 'قيد المتابعة' : 'محلولة'}
                    </button>
                  ))}
                </div>
              </div>

              {supportTickets.length === 0 ? (
                <div className="py-10 px-4 text-center space-y-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <FileText className="w-10 h-10 text-amber-500/40 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    لا توجد لديك أي تذاكر مفتوحة حالياً.
                  </p>
                  <button
                    onClick={() => setActiveTab('form')}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-sm"
                  >
                    فتح تذكرة جديدة الآن
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {supportTickets
                    .filter(t => {
                      if (ticketFilter === 'new') return t.status === 'new';
                      if (ticketFilter === 'in_progress') return t.status === 'in_progress';
                      if (ticketFilter === 'resolved') return t.status === 'resolved';
                      return true;
                    })
                    .map((t) => {
                      const isResolved = t.status === 'resolved';
                      const isInProgress = t.status === 'in_progress';
                      const isReplyingThis = activeReplyTicketId === t.id;

                      return (
                        <div
                          key={t.id}
                          className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5 shadow-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold border border-amber-200 dark:border-amber-800">
                                #{t.ticketNumber || t.id.slice(-6)}
                              </span>
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                                isResolved
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                  : isInProgress
                                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              }`}>
                                {isResolved ? 'تم الرد والحل ✓' : isInProgress ? 'قيد المتابعة ⏳' : 'جديدة'}
                              </span>
                            </div>

                            <button
                              onClick={() => deleteSupportTicket(t.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                              title="حذف التذكرة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                            {t.subject}
                          </h5>

                          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                            {t.message}
                          </div>

                          {/* Admin Reply */}
                          {t.reply && (
                            <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-bold text-blue-700 dark:text-blue-300">
                                <span className="flex items-center gap-1">
                                  <Headphones className="w-3.5 h-3.5" />
                                  <span>رد فريق الدعم:</span>
                                </span>
                                <span className="font-mono text-slate-400">{t.repliedAt || 'الآن'}</span>
                              </div>
                              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                                {t.reply}
                              </p>
                            </div>
                          )}

                          {/* Thread replies */}
                          {t.replies && t.replies.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              {t.replies.map((rep) => (
                                <div
                                  key={rep.id}
                                  className={`p-2 rounded-xl text-xs leading-relaxed ${
                                    rep.sender === 'user'
                                      ? 'bg-amber-500/10 border border-amber-500/20'
                                      : 'bg-blue-500/10 border border-blue-500/20'
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 mb-0.5">
                                    <span>{rep.senderName}</span>
                                    <span className="font-mono">{rep.sentAt}</span>
                                  </div>
                                  <p>{rep.message}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Form */}
                          <div className="pt-1">
                            {isReplyingThis ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={replyInputText}
                                  onChange={(e) => setReplyInputText(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSendTicketReply(t.id)}
                                  placeholder="اكتب ردك ومتابعتك..."
                                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSendTicketReply(t.id)}
                                  className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
                                >
                                  إرسال
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setActiveReplyTicketId(null)}
                                  className="px-2 py-1.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                                >
                                  إلغاء
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setActiveReplyTicketId(t.id)}
                                className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <span>+ كتابة رد أو متابعة</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: DIRECT CHANNELS (الاتصال المباشر والواتساب)            */}
          {/* ============================================================ */}
          {activeTab === 'channels' && (
            <div className="space-y-3">
              {/* Emergency Hotline Banner */}
              <div className="p-3.5 bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl text-white shadow-md flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200 block">
                      خط الطوارئ الميداني 24/7
                    </span>
                    <span className="text-xs font-bold">
                      تسرب غاز أو ماء أو التماس كهربائي حاد
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${contactDetails.phone}`}
                  className="px-4 py-2 bg-white text-rose-900 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm shrink-0 transition-transform active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  <span>اتصال فوري</span>
                </a>
              </div>

              {/* Direct Channels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* WhatsApp */}
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 block">
                        محادثة واتساب سريعة
                      </span>
                      <a
                        href={`https://wa.me/${contactDetails.whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '213')}?text=${encodeURIComponent('السلام عليكم، أحتاج مساعدة أو استفسار عبر تطبيق خـدّام.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold text-slate-900 dark:text-white dir-ltr block truncate hover:underline"
                      >
                        {contactDetails.whatsapp}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`https://wa.me/${contactDetails.whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '213')}?text=${encodeURIComponent('السلام عليكم، أحتاج مساعدة أو استفسار عبر تطبيق خـدّام.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                    >
                      <span>فتح</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => copyToClipboard(contactDetails.whatsapp, 'channel')}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg cursor-pointer"
                      title="نسخ الرقم"
                    >
                      {copiedChannelText === contactDetails.whatsapp ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Direct Phone */}
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 block">
                        الهاتف المباشر الموحد
                      </span>
                      <a
                        href={`tel:${contactDetails.phone.replace(/[^0-9+]/g, '')}`}
                        className="text-xs font-mono font-bold text-slate-900 dark:text-white dir-ltr block truncate hover:underline"
                      >
                        {contactDetails.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`tel:${contactDetails.phone.replace(/[^0-9+]/g, '')}`}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-xs"
                    >
                      <Phone className="w-3 h-3" />
                      <span>اتصال</span>
                    </a>
                    <button
                      onClick={() => copyToClipboard(contactDetails.phone, 'channel')}
                      className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg cursor-pointer"
                      title="نسخ الرقم"
                    >
                      {copiedChannelText === contactDetails.phone ? <Check className="w-4 h-4 text-amber-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="p-3.5 bg-blue-500/10 border border-blue-500/25 rounded-2xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 block">
                        البريد الرسمي
                      </span>
                      <a
                        href={`mailto:${contactDetails.email}`}
                        className="text-xs font-mono font-bold text-slate-900 dark:text-white block truncate hover:underline"
                      >
                        {contactDetails.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(contactDetails.email, 'channel')}
                    className="p-2 text-slate-400 hover:text-blue-600 rounded-lg cursor-pointer"
                    title="نسخ البريد"
                  >
                    {copiedChannelText === contactDetails.email ? <Check className="w-4 h-4 text-blue-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Working Hours */}
                <div className="p-3.5 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 block">
                      ساعات العمل الرسمية
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {contactDetails.workingHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Headquarter */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{contactDetails.address}</span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: FAQ (الأسئلة الشائعة مع البحث الفوري)                  */}
          {/* ============================================================ */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  placeholder="ابحث في الأسئلة الشائعة..."
                  className="w-full pl-3 pr-9 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute top-3 right-3 pointer-events-none" />
              </div>

              {/* FAQ Accordion Items */}
              <div className="space-y-2">
                {filteredFaqs.map((faq, i) => {
                  const isOpen = openFaqIndex === i;
                  return (
                    <div
                      key={i}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                        className="w-full p-3.5 text-start flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {faq.q}
                          </span>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 space-y-2 animate-fade-in">
                          <p>{faq.a}</p>
                          <div className="flex items-center justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(faq.a, 'faq', i)}
                              className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              {copiedFaqIndex === i ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedFaqIndex === i ? 'تم النسخ' : 'نسخ الإجابة'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('live_chat')}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  لم تجد إجابة لسؤالك؟ تحدث مع الدعم المباشر الآن ←
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Floating Scroll to Top button for Modal */}
        {showModalScrollTop && (
          <button
            type="button"
            onClick={() => scrollModalToTop('smooth')}
            className="absolute bottom-16 left-5 z-20 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl shadow-lg border border-amber-300 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs"
            title="الصعود لأعلى النافذة"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>صعود للأعلى</span>
          </button>
        )}

        {/* ============================================================== */}
        {/* Footer: Compact, Trust & Close                                 */}
        {/* ============================================================== */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              دعم فني معتمد وحماية كاملة للمستخدم
            </span>
          </div>

          <button
            onClick={() => setIsContactModalOpen(false)}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl transition-colors cursor-pointer text-xs"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
