import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  Star, 
  MessageSquare, 
  Layers, 
  X,
  Send,
  Building,
  Check,
  Upload,
  Image as ImageIcon,
  Video,
  Play,
  Trash2,
  Sparkles
} from 'lucide-react';
import { ProjectQuoteRequest, QuoteBid } from '../types';

export const QuotesManager: React.FC = () => {
  const { 
    quotes, 
    createQuoteRequest, 
    acceptQuoteBid, 
    setIsChatOpen, 
    t, 
    language 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    description: string;
    budget: string;
    city: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
  }>({
    title: '',
    category: 'صيانة وإصلاحات المنازل',
    description: '',
    budget: '50000 دج',
    city: 'الجزائر العاصمة',
    mediaUrl: '',
    mediaType: 'image'
  });

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData(prev => ({
          ...prev,
          mediaUrl: event.target?.result as string,
          mediaType: isVideo ? 'video' : 'image'
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    createQuoteRequest({
      title: formData.title,
      category: formData.category,
      description: formData.description,
      budget: formData.budget,
      city: formData.city,
      mediaUrl: formData.mediaUrl || undefined,
      mediaType: formData.mediaType || 'image'
    });
    setIsModalOpen(false);
    setFormData({
      title: '',
      category: 'صيانة وإصلاحات المنازل',
      description: '',
      budget: '50000 دج',
      city: 'الجزائر العاصمة',
      mediaUrl: '',
      mediaType: 'image'
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>{t.quotesSystemTitle}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {language === 'ar' ? 'مناقصات ومشاريع عروض الأسعار' : 'Project Quotation & Bids'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t.quotesSystemDesc}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{t.requestQuotesBtn}</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {quotes.map((project) => (
          <div 
            key={project.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
          >
            {/* Project Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{project.category}</span>
                  <span>·</span>
                  <span>{project.city}</span>
                  <span>·</span>
                  <span>{project.createdAt}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {project.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  project.status === 'awarded' 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' 
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                }`}>
                  {project.status === 'awarded' 
                    ? (language === 'ar' ? 'تمت الترسية والاتفاق' : 'Awarded') 
                    : (language === 'ar' ? 'مفتوح لاستقبال العروض' : 'Open for Bids')}
                </span>
              </div>
            </div>

            {/* Project Description */}
            <div className="p-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-b border-slate-100 dark:border-slate-800">
              <p>{project.description}</p>
              <div className="mt-2.5 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'ar' ? 'الميزانية التقديرية المرصودة:' : 'Target Budget:'} {project.budgetEstimated}</span>
              </div>
            </div>

            {/* Attached Photo or Video (إرفاق صورة أو فيديو) */}
            {project.mediaUrl && (
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    {project.mediaType === 'video' ? (
                      <Video className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>
                      {project.mediaType === 'video' 
                        ? 'مقطع فيديو توضيحي للعطل تم إرفاقه من العميل:' 
                        : 'صورة توضيحية للعطل تم إرفاقها من العميل:'}
                    </span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                    {project.mediaType === 'video' ? 'فيديو معاينة' : 'صورة عطل'}
                  </span>
                </div>

                {project.mediaType === 'video' ? (
                  <video 
                    controls 
                    src={project.mediaUrl} 
                    className="w-full max-h-72 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs" 
                  />
                ) : (
                  <img 
                    src={project.mediaUrl} 
                    alt={project.title} 
                    className="w-full max-h-72 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs" 
                  />
                )}
              </div>
            )}

            {/* Received Bids Section */}
            <div className="p-5 bg-slate-50/50 dark:bg-slate-950/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>{t.submittedBids} ({project.bids.length})</span>
                </h4>
              </div>

              {project.bids.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  {language === 'ar' ? 'جاري نشر المشروع للمهنيين المؤهلين في منطقتك، ستصلك العروض قريباً...' : 'Awaiting bids from local artisans...'}
                </div>
              ) : (
                <div className="space-y-3">
                  {project.bids.map((bid) => {
                    const isAccepted = bid.status === 'accepted';

                    return (
                      <div
                        key={bid.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isAccepted
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-700'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                          {/* Artisan row */}
                          <div className="flex items-center gap-3">
                            <img
                              src={bid.artisanAvatar}
                              alt={bid.artisanName}
                              className="w-11 h-11 rounded-xl object-cover border border-amber-500/20"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-sm text-slate-900 dark:text-white">
                                  {bid.artisanName}
                                </span>
                                <ShieldCheck className="w-4 h-4 text-amber-500" />
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                <span className="flex items-center text-amber-500 font-bold">
                                  <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                                  {bid.artisanRating}
                                </span>
                                <span>·</span>
                                <span>{bid.artisanVerification.completedJobsCount} {language === 'ar' ? 'مهمة منجزة' : 'jobs'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Bid summary metrics */}
                          <div className="flex items-center gap-4 text-start sm:text-end">
                            <div>
                              <span className="text-[10px] text-slate-400 block">{t.estimatedDuration}</span>
                              <span className="font-bold text-xs text-slate-800 dark:text-slate-200 tabular-nums">
                                {bid.estimatedDays} {t.days}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'قيمة العرض' : 'Bid Price'}</span>
                              <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400 tabular-nums">
                                {bid.bidAmount} {t.currency}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Proposal note */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                          {bid.proposalText}
                        </p>

                        {/* Badges & Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            {bid.includesMaterials && (
                              <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                                {t.includesMaterials}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">
                              {bid.submittedAt}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setIsChatOpen(true)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{t.negotiateBid}</span>
                            </button>

                            {project.status === 'open' && (
                              <button
                                onClick={() => acceptQuoteBid(project.id, bid.id)}
                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{t.acceptBid}</span>
                              </button>
                            )}

                            {isAccepted && (
                              <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{language === 'ar' ? 'تم اعتماد هذا العرض' : 'Proposal Accepted'}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Project Quote Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute rtl:left-4 ltr:right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.requestQuotesBtn}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'ar' ? 'حدد تفاصيل مشروعك بدقة لتلقي أفضل العروض والمواصفات من الحرفيين المعتمدين.' : 'Post your big project details'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ar' ? 'عنوان المشروع:' : 'Project Title:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تجديد كامل لشبكة الكهرباء والإنارة لشقة دوبلكس"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'ar' ? 'التصنيف الرئيسي:' : 'Category:'}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="صيانة وإصلاحات المنازل">صيانة وإصلاحات المنازل</option>
                    <option value="التقنية والتركيبات الذكية">التقنية والتركيبات الذكية</option>
                    <option value="النظافة والعناية بالمرافق">النظافة والعناية بالمرافق</option>
                    <option value="الزراعة والبيئة">الزراعة والبيئة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'ar' ? 'الميزانية المتوقعة:' : 'Estimated Budget:'}
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ar' ? 'وصف المشروع والمواصفات المطلوبة:' : 'Detailed Description:'}
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="المساحة، المواد المطلوبة، الموعد الأنسب للبدء..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Media Attachment: Photo or Video (إرفاق صورة أو فيديو للعطل) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    {formData.mediaType === 'video' ? <Video className="w-4 h-4 text-amber-500" /> : <ImageIcon className="w-4 h-4 text-amber-500" />}
                    <span>إرفاق صورة أو فيديو توضيحي للعطل (يرفع دقة العروض 3x):</span>
                  </label>

                  {/* Media Type Toggle */}
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mediaType: 'image' }))}
                      className={`px-2 py-0.5 rounded-lg transition-colors ${
                        formData.mediaType === 'image'
                          ? 'bg-amber-500 text-white'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      صورة
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mediaType: 'video' }))}
                      className={`px-2 py-0.5 rounded-lg transition-colors ${
                        formData.mediaType === 'video'
                          ? 'bg-amber-500 text-white'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      فيديو
                    </button>
                  </div>
                </div>

                {/* Upload or URL */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <label className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.mediaType === 'video' ? 'رفع فيديو من الهاتف' : 'رفع صورة من المعرض'}</span>
                      <input
                        type="file"
                        accept={formData.mediaType === 'video' ? 'video/*' : 'image/*'}
                        onChange={handleMediaUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      placeholder={formData.mediaType === 'video' ? 'أو ضع رابط فيديو (MP4/WebM)...' : 'أو ضع رابط صورة مباشر...'}
                      value={formData.mediaUrl || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, mediaUrl: e.target.value }))}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Sample presets for fast testing */}
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">أو اختر نموذجاً جاهزاً للتجربة:</span>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          mediaType: 'image',
                          mediaUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80'
                        }))}
                        className="px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:border-amber-500"
                      >
                        🚰 صورة تسريب ماسورة
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          mediaType: 'image',
                          mediaUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
                        }))}
                        className="px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:border-amber-500"
                      >
                        ⚡ صورة لوحة كهربائية
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          mediaType: 'video',
                          mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-carpenter-measuring-a-piece-of-wood-42994-large.mp4'
                        }))}
                        className="px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:border-amber-500"
                      >
                        🎥 فيديو توضيحي للعطل
                      </button>
                    </div>
                  </div>

                  {/* Media Preview */}
                  {formData.mediaUrl && (
                    <div className="relative mt-2 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                      {formData.mediaType === 'video' ? (
                        <video controls src={formData.mediaUrl} className="w-full h-36 rounded-lg object-cover" />
                      ) : (
                        <img src={formData.mediaUrl} alt="Preview" className="w-full h-36 rounded-lg object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, mediaUrl: '' }))}
                        className="absolute top-4 left-4 p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-md transition-colors"
                        title="إلغاء المرفق"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-transform active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4 rtl:rotate-180" />
                  <span>{language === 'ar' ? 'نشر طلب عرض السعر الآن' : 'Publish Project Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
