import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Send, 
  Clock, 
  CheckCircle2, 
  Heart
} from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { 
    isReviewModalOpen, 
    setIsReviewModalOpen, 
    activeOrder, 
    completeCurrentOrder, 
    t, 
    language 
  } = useApp();

  const [rating, setRating] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [quality, setQuality] = useState(5);
  const [behavior, setBehavior] = useState(5);
  const [comment, setComment] = useState('');

  if (!isReviewModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeCurrentOrder(activeOrder?.id, {
      rating,
      punctuality,
      quality,
      behavior,
      comment: comment.trim() || (language === 'ar' ? 'عمل ممتاز ومتقن بارك الله فيه، أنصح بالتعامل معه.' : 'Great workmanship, highly recommended.')
    });
  };

  const renderStarSelector = (score: number, onChange: (val: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            className="p-1 focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 ${
                star <= score
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const artisanName = activeOrder?.artisanName || 'المعلم كمال بلقاسم';
  const artisanAvatar = activeOrder?.artisanAvatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={() => setIsReviewModalOpen(false)}
          className="absolute rtl:left-4 ltr:right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl border-2 border-amber-500 overflow-hidden mx-auto shadow-md shadow-amber-500/10">
            <img 
              src={artisanAvatar} 
              alt={artisanName} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.leaveReview}
          </h3>
          <p className="text-xs text-slate-500">
            {artisanName} · {activeOrder?.subServiceName || (language === 'ar' ? 'خدمة منزلية' : 'Service')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Main 5-star Rating */}
          <div className="flex flex-col items-center justify-center p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200/60 dark:border-amber-900/30">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-2">
              {language === 'ar' ? 'التقييم العام للخدمة' : 'Overall Service Rating'}
            </span>
            {renderStarSelector(rating, setRating)}
          </div>

          {/* Sub metrics */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.punctuality}</span>
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setPunctuality(s)}
                    className={`w-6 h-6 rounded-md font-bold text-[11px] ${
                      s <= punctuality ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.quality}</span>
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setQuality(s)}
                    className={`w-6 h-6 rounded-md font-bold text-[11px] ${
                      s <= quality ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.behavior}</span>
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setBehavior(s)}
                    className={`w-6 h-6 rounded-md font-bold text-[11px] ${
                      s <= behavior ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'ar' ? 'رأيك الشخصي وتجربتك:' : 'Your Feedback:'}
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={language === 'ar' ? 'اكتب رأيك بأمانة حول التزام الحرفي وجودة العمل...' : 'Write your honest review...'}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
            <span>{t.submitReview}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
