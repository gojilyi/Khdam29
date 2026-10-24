import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, Send } from 'lucide-react';
import { Modal, Button, Avatar } from './ui';

export const ReviewModal: React.FC = () => {
  const { 
    isReviewModalOpen, 
    setIsReviewModalOpen, 
    activeOrder, 
    completeCurrentOrder 
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
      comment: comment.trim() || 'خدمة ممتازة وعمل متقن، نوصي بالتعامل معه.'
    });
    setIsReviewModalOpen(false);
  };

  const renderStarSelector = (score: number, onChange: (val: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
            aria-label={`${star} نجوم`}
          >
            <Star
              strokeWidth={1.75}
              className={`w-6 h-6 ${
                star <= score
                  ? 'text-[#E8A317] fill-[#E8A317]'
                  : 'text-[#DDE3DF] fill-transparent'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const artisanName = activeOrder?.artisanName || 'الحرفي المعين';
  const artisanAvatar = activeOrder?.artisanAvatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80';

  return (
    <Modal
      isOpen={isReviewModalOpen}
      onClose={() => setIsReviewModalOpen(false)}
      maxWidth="sm"
    >
      <div className="space-y-5">
        <div className="text-center space-y-2">
          <Avatar
            src={artisanAvatar}
            alt={artisanName}
            size="lg"
            className="mx-auto"
          />

          <h3 className="text-[18px] font-bold text-[#0A4D2E]">
            تقييم أداء الحرفي
          </h3>
          <p className="text-[13px] text-[#5B6660]">
            {artisanName} · {activeOrder?.subServiceName || 'خدمة منزلية'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Rating */}
          <div className="flex flex-col items-center justify-center p-3.5 bg-[#EEF6F1] rounded-[8px] border border-[#DDE3DF]">
            <span className="text-[13px] font-bold text-[#0A4D2E] mb-2">
              التقييم العام للخدمة
            </span>
            {renderStarSelector(rating, setRating)}
          </div>

          {/* Sub Criteria */}
          <div className="space-y-2 text-[13px] text-[#5B6660]">
            <div className="flex items-center justify-between">
              <span>الالتزام بالوقت والموعد:</span>
              {renderStarSelector(punctuality, setPunctuality)}
            </div>
            <div className="flex items-center justify-between">
              <span>إتقان وجودة العمل:</span>
              {renderStarSelector(quality, setQuality)}
            </div>
            <div className="flex items-center justify-between">
              <span>حسن المعاملة والأمانة:</span>
              {renderStarSelector(behavior, setBehavior)}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[13px] font-semibold text-[#1C2421]">
              تعليقك أو نصيحتك للزبائن الآخرين (اختياري)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب كلمة حق حول دقة الموعد، جودة الصنعة، وسعر الخدمة..."
              className="w-full p-3 bg-white border border-[#DDE3DF] rounded-[8px] text-[13px] text-[#1C2421] placeholder:text-[#5B6660]/60 focus:outline-none focus:ring-1 focus:ring-[#1E9B5C] focus:border-[#1E9B5C]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            leftIcon={<Send className="w-4 h-4" strokeWidth={1.75} />}
          >
            إرسال التقييم
          </Button>
        </form>
      </div>
    </Modal>
  );
};
