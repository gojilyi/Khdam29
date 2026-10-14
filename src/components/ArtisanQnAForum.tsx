import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HelpCircle, 
  MessageSquare, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  ThumbsUp, 
  Zap, 
  X, 
  Send, 
  Award, 
  Eye, 
  UserCheck, 
  Filter, 
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Briefcase
} from 'lucide-react';
import { QnAQuestion } from '../types';

export const ArtisanQnAForum: React.FC = () => {
  const { 
    qnaQuestions, 
    addQnAQuestion, 
    addQnAAnswer, 
    upvoteQnAAnswer, 
    setBookingModalService, 
    artisans, 
    currentUser, 
    language,
    role
  } = useApp();

  const isRtl = language === 'ar';

  const [searchWord, setSearchWord] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [activeReplyingQId, setActiveReplyingQId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Ask question form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('السباكة والترصيص الصحي');
  const [newContent, setNewContent] = useState('');

  const categories = [
    'السباكة والترصيص الصحي',
    'الكهرباء المنزلية والإنارة',
    'التبريد والتكييف والأجهزة',
    'النجارة والأقفال',
    'الدهان والتشطيبات والديكور',
    'البناء والترميم والتشطيب',
    'ميكانيك وسحب السيارات'
  ];

  const filteredQuestions = qnaQuestions.filter((q) => {
    const matchesCat = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesSearch = !searchWord.trim() || 
      q.title.toLowerCase().includes(searchWord.toLowerCase()) ||
      q.content.toLowerCase().includes(searchWord.toLowerCase()) ||
      q.answers.some(a => a.text.toLowerCase().includes(searchWord.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addQnAQuestion({
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim()
    });

    setNewTitle('');
    setNewContent('');
    setIsAskModalOpen(false);
  };

  const handleSendAnswer = (questionId: string) => {
    if (!replyText.trim()) return;
    addQnAAnswer(questionId, replyText.trim());
    setReplyText('');
    setActiveReplyingQId(null);
  };

  const handleHireArtisan = (artisanId: string) => {
    const matched = artisans.find(a => a.id === artisanId) || artisans[0];
    if (matched) {
      setBookingModalService({
        categoryId: matched.categoryId,
        subServiceId: matched.subCategoryIds[0]
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-black backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>استشارات تقنية مجانية لبناء الثقة والتوظيف المباشر</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black tracking-tight">
              منتدى "استشر حرفياً" المباشر
            </h2>

            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              اطرح أسئلتك حول الأعطال المنزلية والحلول المؤقتة مجاناً، ويجيبك عليها نخبة من الحرفيين المعتمدين لتعزيز سمعتهم وبناء الثقة المتبادلة لتوظيفهم لاحقاً.
            </p>
          </div>

          <button
            onClick={() => setIsAskModalOpen(true)}
            className="self-start md:self-auto px-5 py-3.5 bg-white text-slate-950 hover:bg-amber-50 font-black rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-black/10 transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span>اطرح سؤالاً على الحرفيين مجاناً</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="ابحث في الأسئلة والإجابات التقنية (مثل: تسريب ماء، قاطع كهربائي، رطوبة جدران...)"
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rtl:pr-11 rtl:pl-11 ltr:pl-11 ltr:pr-11 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            جميع الأسئلة ({qnaQuestions.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Feed */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4 hover:border-amber-300 transition-colors"
          >
            {/* Question Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={q.clientAvatar}
                  alt={q.clientName}
                  className="w-10 h-10 rounded-xl object-cover border border-amber-500/20"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{q.clientName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                      {q.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {q.createdAt} · {q.viewsCount} مشاهدة
                  </span>
                </div>
              </div>

              {q.isResolved && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تمت الإجابة والحل ✓</span>
                </span>
              )}
            </div>

            {/* Question Body */}
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {q.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {q.content}
              </p>
            </div>

            {/* Answers Section */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                  <span>إجابات الحرفيين المعتمدين ({q.answers.length}):</span>
                </span>

                <button
                  onClick={() => setActiveReplyingQId(activeReplyingQId === q.id ? null : q.id)}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>إضافة إجابة فنية كحرفي</span>
                </button>
              </div>

              {/* Reply Input if active */}
              {activeReplyingQId === q.id && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 animate-fade-in">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="اكتب إجابتك واستشارتك التقنية بدقة ووضوح لمساعدة العميل..."
                    className="w-full bg-white dark:bg-slate-900 border rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendAnswer(q.id)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>نشر الإجابة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveReplyingQId(null)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

              {/* List of answers */}
              {q.answers.map((ans) => (
                <div
                  key={ans.id}
                  className="p-4 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 rounded-2xl space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={ans.artisanAvatar}
                        alt={ans.artisanName}
                        className="w-9 h-9 rounded-xl object-cover border border-amber-500/30"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {ans.artisanName}
                          </span>
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded">
                            {ans.artisanTrade}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {ans.createdAt} · شارة مستشار فني موثوق
                        </span>
                      </div>
                    </div>

                    {/* Upvote & Hire Buttons */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => upvoteQnAAnswer(q.id, ans.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                          ans.hasUpvoted
                            ? 'bg-amber-500 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border'
                        }`}
                        title="إجابة مفيدة"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>مفيد ({ans.upvotesCount})</span>
                      </button>

                      {/* Hire this artisan button */}
                      <button
                        onClick={() => handleHireArtisan(ans.artisanId)}
                        className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-transform active:scale-95"
                        title="توظيف هذا الحرفي مباشرة للقيام بالإصلاح"
                      >
                        <Zap className="w-3 h-3 fill-white" />
                        <span>توظيف هذا الحرفي</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-white/80 dark:bg-slate-900/70 p-3 rounded-xl border border-amber-100 dark:border-amber-900/40">
                    {ans.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsAskModalOpen(false)}
              className="absolute rtl:left-4 ltr:right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <span>اطرح سؤالاً تقنياً على الحرفيين مجاناً</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                صِف العطل وسيقوم الحرفيون بالرد عليك بحلول أولية وإرشادات أمان.
              </p>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تخصص أو نوع المشكلة:
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عنوان السؤال باختصار:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: كيف أوقف تسرب السخان مؤقتاً؟"
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تفاصيل المشكلة والعلامات الظاهرة:
                </label>
                <textarea
                  rows={3}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="صِف ما تراه وما حدث بالتحديد حتى يتمكن الحرفيون من إفادتك بدقة..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>نشر السؤال الآن</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
