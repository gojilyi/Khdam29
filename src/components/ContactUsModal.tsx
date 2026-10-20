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
  Info,
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
  CornerDownLeft,
  Smartphone,
  ArrowUp,
  ArrowDown
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

  // Active Tab
  const [activeTab, setActiveTab] = useState<'form' | 'live_chat' | 'channels' | 'my_tickets' | 'faq'>('form');

  // Form State
  const [name, setName] = useState('');
  const [contactMethod, setContactMethod] = useState<'phone' | 'whatsapp' | 'email'>('phone');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState<'general' | 'complaint' | 'financial' | 'partnership' | 'suggestion' | 'technical' | 'account_deletion'>('general');
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
      text: 'مرحباً بك في منصة خـدّام! 👋 أنا هنا لمساعدتك والإجابة على أي استفسار أو التنسيق الفوري.',
      time: 'الآن'
    }
  ]);
  const [liveChatInput, setLiveChatInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const liveChatContainerRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const [showModalScrollTop, setShowModalScrollTop] = useState(false);
  const [showLiveChatScrollTop, setShowLiveChatScrollTop] = useState(false);
  const [showLiveChatScrollBottom, setShowLiveChatScrollBottom] = useState(false);

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

  // Safe isolated live chat scroll without affecting parent modal
  useEffect(() => {
    if (activeTab === 'live_chat') {
      scrollLiveChatToBottom('smooth');
    }
  }, [liveChatMessages.length, activeTab, isAgentTyping]);

  const handleLiveChatScroll = () => {
    const c = liveChatContainerRef.current;
    if (!c) return;
    const distanceToBottom = c.scrollHeight - c.scrollTop - c.clientHeight;
    setShowLiveChatScrollBottom(distanceToBottom > 60);
    setShowLiveChatScrollTop(c.scrollTop > 60);
  };

  const handleModalBodyScroll = () => {
    const b = modalBodyRef.current;
    if (!b) return;
    setShowModalScrollTop(b.scrollTop > 100);
  };

  if (!isContactModalOpen) return null;

  // Contact details with professional Algerian fallbacks
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
        contactMethod,
        category,
        priority,
        subject: subject.trim() || (
          category === 'complaint' ? 'شكوى أو نزاع حول خدمة' :
          category === 'financial' ? 'نزاع مالي أو استفسار ضمان' :
          category === 'partnership' ? 'طلب انضمام حرفي أو شراكة' :
          category === 'technical' ? 'إبلاغ عن عطل تقني' :
          category === 'suggestion' ? 'اقتراح تطوير' :
          category === 'account_deletion' ? 'طلب حذف الحساب' :
          'استفسار عام حول خدمات خـدّام'
        ),
        message: message.trim(),
        attachmentUrl: attachmentImage || undefined
      });

      setIsSubmitting(false);
      setSubmittedTicket({ id: `ticket_${Date.now()}`, ticketNumber: generatedTicketNumber });
    }, 400);
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
      let reply = 'شكراً لتواصلك! تم استلام رسالتك وسنقدم لك المساعدة فوراً. لحالات الطوارئ، يمكنك الاتصال مباشرة بخط الدعم 24/7.';
      const lower = userMsg.toLowerCase();
      if (lower.includes('حرفي') || lower.includes('طلب') || lower.includes('خدمة')) {
        reply = 'يمكنك طلب الحرفي المعتمد عبر الصفحة الرئيسية أو الرادار الحي، مع الاطلاع المسبق على تقييماته وشهاداته الموثقة.';
      } else if (lower.includes('سعر') || lower.includes('تكلفة') || lower.includes('دج') || lower.includes('دينار')) {
        reply = 'أسعار الخدمات محددة بشفافية مسبقاً قبل وصول الحرفي وبدون أي مصاريف إضافية خفية.';
      } else if (lower.includes('ضمان') || lower.includes('شكوى') || lower.includes('نزاع')) {
        reply = 'تضمن خـدّام حماية حقوقك بالكامل! يمكنك فتح تذكرة نزاع وسيتدخل خبير معتمد للمعاينة الفورية.';
      } else if (lower.includes('طوارئ') || lower.includes('غاز') || lower.includes('ماء')) {
        reply = '🚨 لحالات الطوارئ الخطرة، يرجى الاتصال الفوري عبر زر الطوارئ في تبويب "القنوات المباشرة".';
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
    }, 1100);
  };

  const quickSubjects = [
    'توثيق شارة الحرفي 🎖️',
    'فحص جودة وضمان الخدمة 🛡️',
    'أسعار الفحص والتدخل 💰',
    'تأخر وصول الحرفي ⏱️',
    'انضمام حرفي للمنصة 👷‍♂️'
  ];

  const categories = [
    { id: 'general', label: 'استفسار عام', icon: MessageSquare, desc: 'معلومات عامة حول التطبيق' },
    { id: 'complaint', label: 'شكوى ونزاع', icon: AlertCircle, desc: 'خلاف حول عمل أو جودة' },
    { id: 'financial', label: 'ضمان واسترجاع', icon: ShieldCheck, desc: 'فواتير وضمان الخدمة' },
    { id: 'technical', label: 'مشكلة تقنية', icon: Info, desc: 'خطأ في الحساب أو الموقع' },
    { id: 'suggestion', label: 'اقتراح وتطوير', icon: Sparkles, desc: 'أفكار لمزايا جديدة' },
    { id: 'account_deletion', label: 'حذف الحساب', icon: Trash2, desc: 'مسح البيانات نهائياً' }
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
    f.a.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
    f.cat.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl max-h-[86vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ============================================================== */}
        {/* Header: Compact & Elegant                                      */}
        {/* ============================================================== */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  علبة التواصل والدعم الفني
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>متاح الآن</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                متابعة البلاغات، حل النزاعات، والاستفسارات المباشرة
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsContactModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="إغلاق علبة التواصل"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* Navigation Tabs Bar: Compact & Clean                           */}
        {/* ============================================================== */}
        <div className="px-3 sm:px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0">
          {/* Tab 1: Form */}
          <button
            onClick={() => {
              setActiveTab('form');
              setSubmittedTicket(null);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              activeTab === 'form'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Send className="w-3 h-3 rtl:rotate-180" />
            <span>تذكرة جديدة</span>
          </button>

          {/* Tab 2: Live Support Chat */}
          <button
            onClick={() => setActiveTab('live_chat')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              activeTab === 'live_chat'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <div className="relative">
              <MessageCircle className="w-3 h-3" />
              <span className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-emerald-500" />
            </div>
            <span>شات الدعم</span>
          </button>

          {/* Tab 3: Direct Channels */}
          <button
            onClick={() => setActiveTab('channels')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              activeTab === 'channels'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Phone className="w-3 h-3" />
            <span>اتصال مباشر</span>
          </button>

          {/* Tab 4: My Tickets */}
          <button
            onClick={() => setActiveTab('my_tickets')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer relative ${
              activeTab === 'my_tickets'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>تذاكري</span>
            {supportTickets.length > 0 && (
              <span className={`px-1 rounded-full text-[9px] font-black ${
                activeTab === 'my_tickets' ? 'bg-slate-950 text-white' : 'bg-amber-500 text-slate-950'
              }`}>
                {supportTickets.length}
              </span>
            )}
          </button>

          {/* Tab 5: FAQ */}
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            <span>الأسئلة الشائعة</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* Content Body: Organized & Proportionate                        */}
        {/* ============================================================== */}
        <div 
          ref={modalBodyRef}
          onScroll={handleModalBodyScroll}
          className="p-3.5 sm:p-4 overflow-y-auto space-y-3.5 flex-1 text-xs overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          
          {/* ============================================================ */}
          {/* TAB 1: FORM (إرسال تذكرة أو بلاغ)                            */}
          {/* ============================================================ */}
          {activeTab === 'form' && (
            <div>
              {submittedTicket ? (
                /* Success Confirmation View */
                <div className="py-6 px-4 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 rounded-2xl text-center space-y-3 animate-fade-in">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                      تم استلام تذكرتك بنجاح
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      شكراً لتواصلك مع إدارة خـدّام!
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      تم تسجيل استفسارك وسيقوم فريق الدعم بالرد وإشعارك فوراً.
                    </p>
                  </div>

                  {/* Ticket Number Card */}
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-emerald-200 dark:border-emerald-800/60 max-w-xs mx-auto shadow-2xs space-y-1.5">
                    <span className="text-[10px] text-slate-500 block">
                      الرقم المرجعي لمتابعة تذكرتك:
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        #{submittedTicket.ticketNumber}
                      </span>
                      <button
                        onClick={() => copyToClipboard(submittedTicket.ticketNumber, 'ticket')}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-600 transition-colors cursor-pointer"
                        title="نسخ رقم التذكرة"
                      >
                        {copiedTicketNum === submittedTicket.ticketNumber ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => setActiveTab('my_tickets')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>عرض التذكرة في سجلي</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('live_chat')}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>شات الدعم المباشر</span>
                    </button>
                    <button
                      onClick={() => {
                        setSubmittedTicket(null);
                        setMessage('');
                        setSubject('');
                        setAttachmentImage(null);
                      }}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                    >
                      تذكرة أخرى
                    </button>
                  </div>
                </div>
              ) : (
                /* The Contact Form */
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Category Selection: Compact 3-col Grid */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      طبيعة الطلب أو التصنيف:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.id;
                        return (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => setCategory(cat.id as any)}
                            className={`p-2 rounded-xl border text-start transition-all cursor-pointer relative ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white ring-1 ring-amber-500/30'
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-amber-300'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                              }`}>
                                <Icon className="w-3 h-3" />
                              </div>
                              <span className="text-[11px] font-bold truncate">{cat.label}</span>
                            </div>
                            <span className="text-[9px] text-slate-400 block mt-0.5 line-clamp-1">
                              {cat.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Contact Method: 2 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        الاسم الكامل *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="اسمك الكامل"
                          className="w-full pl-2.5 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        />
                        <User className="w-3.5 h-3.5 text-slate-400 absolute top-2.5 right-2.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          وسيلة الرد *
                        </label>
                        <div className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => setContactMethod('phone')}
                            className={`px-1.5 py-0.5 rounded cursor-pointer ${
                              contactMethod === 'phone' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-500'
                            }`}
                          >
                            هاتف
                          </button>
                          <button
                            type="button"
                            onClick={() => setContactMethod('whatsapp')}
                            className={`px-1.5 py-0.5 rounded cursor-pointer ${
                              contactMethod === 'whatsapp' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-500'
                            }`}
                          >
                            واتساب
                          </button>
                          <button
                            type="button"
                            onClick={() => setContactMethod('email')}
                            className={`px-1.5 py-0.5 rounded cursor-pointer ${
                              contactMethod === 'email' ? 'bg-sky-500 text-white font-bold' : 'text-slate-500'
                            }`}
                          >
                            إيميل
                          </button>
                        </div>
                      </div>

                      {contactMethod === 'email' ? (
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="user@domain.com"
                            className="w-full pl-2.5 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none dir-ltr text-left"
                          />
                          <Mail className="w-3.5 h-3.5 text-slate-400 absolute top-2.5 right-2.5 pointer-events-none" />
                        </div>
                      ) : (
                        <div className="flex items-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-1 focus-within:ring-amber-500">
                          <span className="px-2 py-2 bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-[11px] font-mono font-bold flex items-center gap-0.5 shrink-0 select-none">
                            <span>🇩🇿</span>
                            <span>+213</span>
                          </span>
                          <input
                            type="tel"
                            required
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="0550 12 34 56"
                            className="w-full px-2.5 py-2 bg-transparent text-xs focus:outline-none dir-ltr text-left font-mono"
                          />
                          <Smartphone className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 pointer-events-none shrink-0" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Priority & Urgency: Compact Pill Row */}
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      درجة الأهمية:
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPriority('normal')}
                        className={`px-2 py-1 rounded-lg font-bold text-[10px] cursor-pointer ${
                          priority === 'normal'
                            ? 'bg-slate-800 text-white dark:bg-slate-700'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        عادي
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriority('urgent')}
                        className={`px-2 py-1 rounded-lg font-bold text-[10px] cursor-pointer ${
                          priority === 'urgent'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        مهم ⚠️
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriority('emergency')}
                        className={`px-2 py-1 rounded-lg font-bold text-[10px] cursor-pointer ${
                          priority === 'emergency'
                            ? 'bg-rose-600 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        طارئ 🚨
                      </button>
                    </div>
                  </div>

                  {/* Subject input + Quick Suggested Chips */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      موضوع التذكرة / الاستفسار
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="عنوان مختصر لطلبك..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />

                    {/* Quick suggested chips */}
                    <div className="flex gap-1 overflow-x-auto pt-1.5 scrollbar-none">
                      {quickSubjects.map((qs, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSubject(qs)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 whitespace-nowrap transition-colors cursor-pointer"
                        >
                          {qs}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Details Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        التفاصيل أو البلاغ *
                      </label>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {message.length} حرف
                      </span>
                    </div>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتب التفاصيل ورقم الطلب إن وجد..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Image Attachment Row */}
                  <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px]">
                    <label className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer hover:border-amber-400">
                      <Paperclip className="w-3 h-3 text-amber-500" />
                      <span>إرفاق صورة أو إثبات</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageAttachment}
                        className="hidden"
                      />
                    </label>

                    {attachmentImage ? (
                      <div className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">
                        <img
                          src={attachmentImage}
                          alt="مرفق"
                          className="w-6 h-6 rounded object-cover border border-amber-500/50"
                        />
                        <span className="text-[10px] text-amber-800 dark:text-amber-200 font-bold">صورة جاهزة</span>
                        <button
                          type="button"
                          onClick={() => setAttachmentImage(null)}
                          className="p-0.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">(اختياري)</span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                    <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال التذكرة لفريق الدعم'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: LIVE CHAT (محادثة فورية مع خدمة العملاء)             */}
          {/* ============================================================ */}
          {activeTab === 'live_chat' && (
            <div className="space-y-2.5">
              {/* Agent Top Bar with Quick Jump Controls */}
              <div className="p-2.5 bg-slate-900 text-white rounded-xl flex items-center justify-between border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-slate-900" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block">أنيسة - خدمة العملاء والتنسيق</span>
                    <span className="text-[9px] text-emerald-400">متصلة للرد الفوري</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Jump Buttons */}
                  <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                    <button
                      type="button"
                      onClick={() => scrollLiveChatToTop('smooth')}
                      className="px-2 py-0.5 text-[10px] font-bold text-slate-300 hover:text-amber-400 flex items-center gap-0.5 transition-colors cursor-pointer"
                      title="صعود لأعلى الرسائل"
                    >
                      <ArrowUp className="w-3 h-3" />
                      <span>الأعلى</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollLiveChatToBottom('smooth')}
                      className="px-2 py-0.5 text-[10px] font-bold text-slate-300 hover:text-amber-400 flex items-center gap-0.5 transition-colors cursor-pointer"
                      title="النزول لآخر رسالة"
                    >
                      <ArrowDown className="w-3 h-3" />
                      <span>الأسفل</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Thread */}
              <div 
                ref={liveChatContainerRef}
                onScroll={handleLiveChatScroll}
                className="h-64 sm:h-72 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 relative overscroll-contain"
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
                        className={`max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed space-y-0.5 shadow-2xs ${
                          isMe
                            ? 'bg-amber-500 text-slate-950 rounded-br-none font-medium'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="text-[9px] font-mono opacity-60 block text-end">
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isAgentTyping && (
                  <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-800 rounded-xl max-w-[150px] border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500">
                    <span>أنيسة تكتب...</span>
                    <span className="w-1 h-1 rounded-full bg-amber-500 animate-ping" />
                  </div>
                )}
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex gap-1 overflow-x-auto scrollbar-none">
                {[
                  'كيف أضمن حقي عند طلب حرفي؟',
                  'استفسار عن أسعار الصيانة والتدخل',
                  'التبليغ عن عطل طارئ',
                  'كيف أصبح حرفياً معتمداً؟'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLiveChatInput(prompt)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="flex items-center gap-1.5 pt-0.5">
                <input
                  type="text"
                  value={liveChatInput}
                  onChange={(e) => setLiveChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendLiveChatMessage()}
                  placeholder="اكتب استفسارك للدعم المباشر..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendLiveChatMessage}
                  disabled={!liveChatInput.trim()}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Send className="w-3 h-3 rtl:rotate-180" />
                  <span>إرسال</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: DIRECT CHANNELS (القنوات المباشرة)                     */}
          {/* ============================================================ */}
          {activeTab === 'channels' && (
            <div className="space-y-2.5">
              {/* Emergency Banner */}
              <div className="p-3 bg-gradient-to-r from-rose-600 to-amber-700 rounded-2xl text-white shadow-sm flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-200 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-amber-200 block">طوارئ 24/7 (غاز / ماء / كهرباء)</span>
                    <span className="text-xs font-bold">تدخل ميداني سريع للحالات الحرجة</span>
                  </div>
                </div>
                <a
                  href={`tel:${contactDetails.phone}`}
                  className="px-3 py-1.5 bg-white text-rose-950 font-black rounded-lg text-xs flex items-center gap-1 shrink-0 shadow-xs"
                >
                  <Phone className="w-3 h-3 text-rose-600" />
                  <span>اتصال</span>
                </a>
              </div>

              {/* Grid of Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* WhatsApp */}
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 block">واتساب فوري</span>
                      <a
                        href={`https://wa.me/${contactDetails.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold text-slate-900 dark:text-white dir-ltr block truncate hover:underline"
                      >
                        {contactDetails.whatsapp}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(contactDetails.whatsapp, 'channel')}
                    className="p-1 text-slate-400 hover:text-emerald-600 cursor-pointer"
                    title="نسخ"
                  >
                    {copiedChannelText === contactDetails.whatsapp ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Phone */}
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 block">الهاتف المباشر</span>
                      <a
                        href={`tel:${contactDetails.phone}`}
                        className="text-xs font-mono font-bold text-slate-900 dark:text-white dir-ltr block truncate hover:underline"
                      >
                        {contactDetails.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(contactDetails.phone, 'channel')}
                    className="p-1 text-slate-400 hover:text-amber-600 cursor-pointer"
                    title="نسخ"
                  >
                    {copiedChannelText === contactDetails.phone ? <Check className="w-3.5 h-3.5 text-amber-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Email */}
                <div className="p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 block">البريد الرسمي</span>
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
                    className="p-1 text-slate-400 hover:text-sky-600 cursor-pointer"
                    title="نسخ"
                  >
                    {copiedChannelText === contactDetails.email ? <Check className="w-3.5 h-3.5 text-sky-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Working Hours */}
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500 text-white flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 block">أوقات العمل</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {contactDetails.workingHours}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between gap-2 sm:col-span-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 block">المقر الرئيسي</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                        {contactDetails.address}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(contactDetails.address, 'channel')}
                    className="p-1 text-slate-400 hover:text-amber-500 cursor-pointer"
                    title="نسخ"
                  >
                    {copiedChannelText === contactDetails.address ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: MY TICKETS (تذاكري ومتابعة الردود والحلول)             */}
          {/* ============================================================ */}
          {activeTab === 'my_tickets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  تذاكري السابقة ({supportTickets.length})
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
                <div className="py-8 px-4 text-center space-y-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <FileText className="w-8 h-8 text-amber-500/50 mx-auto" />
                  <p className="text-xs text-slate-500">لا توجد تذاكر مسجلة حالياً.</p>
                  <button
                    onClick={() => setActiveTab('form')}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    فتح تذكرة جديدة
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
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
                          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-2xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold border border-amber-200 dark:border-amber-800">
                                #{t.ticketNumber || t.id.slice(-6)}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                isResolved
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                  : isInProgress
                                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              }`}>
                                {isResolved ? 'تم الرد ✓' : isInProgress ? 'قيد المتابعة ⏳' : 'جديدة'}
                              </span>
                            </div>

                            <button
                              onClick={() => deleteSupportTicket(t.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 rounded cursor-pointer"
                              title="حذف"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                            {t.subject}
                          </h5>

                          <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                            {t.message}
                          </div>

                          {/* Admin Reply */}
                          {t.reply && (
                            <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 rounded-lg space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-bold text-blue-700 dark:text-blue-300">
                                <span className="flex items-center gap-1">
                                  <Headphones className="w-3 h-3" />
                                  <span>رد إدارة خـدّام:</span>
                                </span>
                                <span className="font-mono text-slate-400">{t.repliedAt || 'الآن'}</span>
                              </div>
                              <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed">{t.reply}</p>
                            </div>
                          )}

                          {/* Replies Thread */}
                          {t.replies && t.replies.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              {t.replies.map((rep) => (
                                <div
                                  key={rep.id}
                                  className={`p-2 rounded-lg text-[11px] leading-relaxed ${
                                    rep.sender === 'user'
                                      ? 'bg-amber-500/10 border border-amber-500/30'
                                      : 'bg-blue-500/10 border border-blue-500/30'
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

                          {/* Reply Box */}
                          <div className="pt-0.5">
                            {isReplyingThis ? (
                              <div className="space-y-1.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-amber-500/30 animate-fade-in">
                                <textarea
                                  rows={2}
                                  value={replyInputText}
                                  onChange={(e) => setReplyInputText(e.target.value)}
                                  placeholder="اكتب تعقيبك أو استفسارك الإضافي..."
                                  className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] focus:outline-none"
                                />
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveReplyTicketId(null);
                                      setReplyInputText('');
                                    }}
                                    className="px-2 py-1 text-slate-500 text-[10px]"
                                  >
                                    إلغاء
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSendTicketReply(t.id)}
                                    disabled={!replyInputText.trim()}
                                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold rounded-md text-[10px] flex items-center gap-1"
                                  >
                                    <CornerDownLeft className="w-3 h-3" />
                                    <span>إرسال التعقيب</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                                <span>{t.createdAt}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveReplyTicketId(t.id);
                                    setReplyInputText('');
                                  }}
                                  className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  <CornerDownLeft className="w-3 h-3" />
                                  <span>تعقيب / رد</span>
                                </button>
                              </div>
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
          {/* TAB 5: FAQ (الأسئلة الشائعة والأجوبة الفورية)                  */}
          {/* ============================================================ */}
          {activeTab === 'faq' && (
            <div className="space-y-2.5">
              {/* Instant Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  placeholder="ابحث في الأسئلة الشائعة..."
                  className="w-full pl-3 pr-7 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute top-2 right-2 pointer-events-none" />
              </div>

              <div className="space-y-1.5">
                {filteredFaqs.map((faq, i) => {
                  const isOpen = openFaqIndex === i;
                  return (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                        className="w-full p-2.5 text-start flex items-center justify-between gap-2 text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-500 font-mono text-[11px]">0{i + 1}.</span>
                          <span>{faq.q}</span>
                        </div>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-amber-500 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                      </button>

                      {isOpen && (
                        <div className="px-3 pb-3 pt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5">
                          <p>{faq.a}</p>
                          <div className="flex justify-end">
                            <button
                              onClick={() => copyToClipboard(faq.a, 'faq', i)}
                              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 hover:text-amber-600 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedFaqIndex === i ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              <span>نسخ</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Floating Scroll to Top button for Contact Us Modal */}
        {showModalScrollTop && (
          <button
            type="button"
            onClick={() => scrollModalToTop('smooth')}
            className="absolute bottom-14 left-5 z-20 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg border border-amber-300 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 text-[11px]"
            title="الصعود لأعلى النافذة"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>صعود للأعلى</span>
          </button>
        )}

        {/* ============================================================== */}
        {/* Footer: Compact & Clean                                        */}
        {/* ============================================================== */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>نظام علبة تواصل آمن ومعتمد</span>
          </div>

          <button
            onClick={() => setIsContactModalOpen(false)}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-lg transition-colors cursor-pointer text-xs"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
