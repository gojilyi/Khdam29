import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Mail, 
  Phone, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Globe, 
  Send, 
  Headphones, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ContactUsModal: React.FC = () => {
  const { 
    isContactModalOpen, 
    setIsContactModalOpen, 
    playStoreConfig, 
    language,
    currentUser,
    addSupportTicket
  } = useApp();

  const [name, setName] = useState(currentUser.name && currentUser.name !== 'مستخدم زائر' ? currentUser.name : '');
  const [contact, setContact] = useState(currentUser.phone || '');
  const [category, setCategory] = useState<'general' | 'complaint' | 'suggestion' | 'technical' | 'account_deletion'>('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isContactModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;

    addSupportTicket({
      name: name.trim(),
      contact: contact.trim(),
      category,
      subject: subject.trim() || (language === 'ar' ? 'رسالة تواصل مع المنصة' : 'Contact Message'),
      message: message.trim()
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setMessage('');
      setSubject('');
      setIsContactModalOpen(false);
    }, 2200);
  };

  const hasAnyContactInfo = Boolean(
    playStoreConfig.supportEmail ||
    playStoreConfig.supportPhone ||
    playStoreConfig.whatsappNumber ||
    playStoreConfig.supportAddress ||
    playStoreConfig.workingHours ||
    playStoreConfig.websiteUrl
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'تواصل معنا — خدمة العملاء والدعم' : 'Contact Us & Support'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'فريق منصة خدّام جاهز لمساعدتك وحل أي استفسار' : 'Khodam support team is here to assist you'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsContactModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
            title={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {/* 1. Contact Methods Grid (Editable from Admin Panel, empty by default) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {language === 'ar' ? 'قنوات التواصل المعتمدة' : 'Official Channels'}
            </h4>

            {hasAnyContactInfo ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {playStoreConfig.supportPhone && (
                  <a
                    href={`tel:${playStoreConfig.supportPhone}`}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'الهاتف المباشر' : 'Direct Phone'}</span>
                      <span className="text-xs font-bold font-mono text-slate-800 dark:text-white truncate dir-ltr block">
                        {playStoreConfig.supportPhone}
                      </span>
                    </div>
                  </a>
                )}

                {playStoreConfig.whatsappNumber && (
                  <a
                    href={`https://wa.me/${playStoreConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'واتساب الدعم' : 'WhatsApp Support'}</span>
                      <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate dir-ltr block">
                        {playStoreConfig.whatsappNumber}
                      </span>
                    </div>
                  </a>
                )}

                {playStoreConfig.supportEmail && (
                  <a
                    href={`mailto:${playStoreConfig.supportEmail}`}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 hover:border-sky-500/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'البريد الإلكتروني' : 'Support Email'}</span>
                      <span className="text-xs font-bold font-mono text-slate-800 dark:text-white truncate block">
                        {playStoreConfig.supportEmail}
                      </span>
                    </div>
                  </a>
                )}

                {playStoreConfig.workingHours && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'ساعات العمل' : 'Working Hours'}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white truncate block">
                        {playStoreConfig.workingHours}
                      </span>
                    </div>
                  </div>
                )}

                {playStoreConfig.supportAddress && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 sm:col-span-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'العنوان والمقر' : 'Headquarters'}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white truncate block">
                        {playStoreConfig.supportAddress}
                      </span>
                    </div>
                  </div>
                )}

                {playStoreConfig.websiteUrl && (
                  <a
                    href={playStoreConfig.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 sm:col-span-2 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'الموقع الإلكتروني' : 'Official Website'}</span>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 truncate block">
                        {playStoreConfig.websiteUrl}
                      </span>
                    </div>
                  </a>
                )}
              </div>
            ) : (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {language === 'ar' 
                    ? 'يمكنك إرسال رسالتك أو استفسارك مباشرة عبر النموذج أدناه وسيصل إشعارك فوراً إلى لوحة تحكم إدارة منصة خدّام للمتابعة.'
                    : 'Submit your message below and it will be delivered directly to the platform management dashboard.'}
                </p>
              </div>
            )}
          </div>

          {/* 2. Direct Ticket/Message Form */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'ar' ? 'إرسال رسالة مباشرة إلى الإدارة' : 'Send Direct Message to Support'}</span>
            </h4>

            {submittedSuccess ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-center space-y-2 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                  {language === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Message sent successfully!'}
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'ar' ? 'شكراً لك، سيتم الرد عليك في أقرب وقت عبر رقم الهاتف أو البريد المرفق.' : 'Thank you, our team will review and reply shortly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'ar' ? 'أدخل اسمك' : 'Your name'}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      {language === 'ar' ? 'رقم الهاتف أو البريد الإلكتروني *' : 'Phone or Email *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="05 / 06 / 07... أو email@example.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 dir-ltr text-end"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      {language === 'ar' ? 'نوع الطلب / التصنيف' : 'Category'}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="general">{language === 'ar' ? 'استفسار عام' : 'General Inquiry'}</option>
                      <option value="complaint">{language === 'ar' ? 'شكوى أو نزاع حول خدمة' : 'Complaint / Dispute'}</option>
                      <option value="suggestion">{language === 'ar' ? 'اقتراح لتطوير التطبيق' : 'Suggestion'}</option>
                      <option value="technical">{language === 'ar' ? 'مشكلة تقنية في الحساب' : 'Technical Issue'}</option>
                      <option value="account_deletion">{language === 'ar' ? 'طلب حذف حساب وبيانات' : 'Account Deletion Request'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      {language === 'ar' ? 'عنوان الموضوع' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: استفسار حول توثيق الحرفي' : 'e.g., Artisan verification question'}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    {language === 'ar' ? 'تفاصيل الرسالة *' : 'Message Details *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={language === 'ar' ? 'اكتب استفسارك أو مشكلتك بالتفصيل هنا...' : 'Write your inquiry or feedback here...'}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs shadow-amber-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إرسال الرسالة إلى الدعم الفني' : 'Submit Support Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            {language === 'ar' ? 'يتم الرد عادة خلال 24 ساعة من فريق الإدارة' : 'Support typically responds within 24 hours'}
          </span>
          <button
            onClick={() => setIsContactModalOpen(false)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
