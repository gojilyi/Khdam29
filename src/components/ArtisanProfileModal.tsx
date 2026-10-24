import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Briefcase, 
  CheckCircle2, 
  Calendar,
  MessageSquare,
  Award,
  Plus
} from 'lucide-react';
import { formatDZD } from '../data/algeriaData';
import { Modal, Button, Badge, Rating, Avatar } from './ui';

export const ArtisanProfileModal: React.FC = () => {
  const { 
    selectedArtisan, 
    setSelectedArtisan, 
    startCall, 
    setIsChatOpen,
    setBookingModalService,
    reviews 
  } = useApp();

  if (!selectedArtisan) return null;

  const artisanReviews = reviews.slice(0, 3);

  // Realistic sample work images
  const workImages = [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80',
  ];

  return (
    <Modal
      isOpen={!!selectedArtisan}
      onClose={() => setSelectedArtisan(null)}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* 1. Header Profile Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-[#DDE3DF]">
          <Avatar
            src={selectedArtisan.avatar}
            alt={selectedArtisan.name}
            size="xl"
          />

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[20px] font-bold text-[#1C2421]">
                {selectedArtisan.name}
              </h2>
              <Badge variant="green">
                {selectedArtisan.trade}
              </Badge>
              {selectedArtisan.verification?.idVerified && (
                <span className="inline-flex items-center gap-1 text-[12px] text-[#0A4D2E] bg-[#EEF6F1] px-2 py-0.5 rounded-[8px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F6B3F]" strokeWidth={1.75} />
                  <span>هوية موثقة</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Rating 
                rating={selectedArtisan.rating} 
                reviewCount={selectedArtisan.reviewCount} 
              />
              <span className="text-[#DDE3DF]">·</span>
              <span className="text-[13px] text-[#5B6660]">
                {selectedArtisan.completedJobsCount} عمل منجز
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[13px] text-[#5B6660]">
              <MapPin className="w-3.5 h-3.5 text-[#0F6B3F] shrink-0" strokeWidth={1.75} />
              <span>{selectedArtisan.city} · {selectedArtisan.neighborhood || 'وسط المدينة'}</span>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[12px] text-[#5B6660] block">تسعيرة المعاينة والعمل</span>
            <span className="text-[20px] font-bold text-[#0A4D2E] tabular-nums">
              {formatDZD(selectedArtisan.hourlyRate)}/ساعة
            </span>
          </div>
        </div>

        {/* 2. Action Buttons: Direct Call & Request Service (Min 44px) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" strokeWidth={1.75} />}
            onClick={() => {
              setBookingModalService({
                categoryId: selectedArtisan.categoryId,
                subServiceId: selectedArtisan.subCategoryIds[0] || 'plumbing',
                artisanId: selectedArtisan.id
              });
              setSelectedArtisan(null);
            }}
          >
            اطلب الخدمة
          </Button>

          <Button
            variant="outline"
            leftIcon={<Phone className="w-4 h-4 text-[#0F6B3F]" strokeWidth={1.75} />}
            onClick={() => startCall(selectedArtisan.id, selectedArtisan.name, selectedArtisan.phoneMasked)}
          >
            اتصل ({selectedArtisan.phoneMasked || '0550 12 34 56'})
          </Button>

          <Button
            variant="secondary"
            leftIcon={<MessageSquare className="w-4 h-4 text-[#0F6B3F]" strokeWidth={1.75} />}
            onClick={() => {
              setIsChatOpen(true);
              setSelectedArtisan(null);
            }}
          >
            مراسلة فورية
          </Button>
        </div>

        {/* 3. Bio & Availability Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#EEF6F1] border border-[#DDE3DF] rounded-[8px] space-y-2">
            <h4 className="text-[14px] font-bold text-[#0A4D2E] flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-[#0F6B3F]" strokeWidth={1.75} />
              <span>نبذة عن الخبرة والكفاءة</span>
            </h4>
            <p className="text-[13px] text-[#5B6660] leading-relaxed">
              {selectedArtisan.bio}
            </p>
            {selectedArtisan.skills && selectedArtisan.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedArtisan.skills.map((skill, idx) => (
                  <span key={idx} className="text-[11px] bg-white border border-[#DDE3DF] text-[#1C2421] px-2 py-0.5 rounded-[6px]">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-[#EEF6F1] border border-[#DDE3DF] rounded-[8px] space-y-2">
            <h4 className="text-[14px] font-bold text-[#0A4D2E] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#0F6B3F]" strokeWidth={1.75} />
              <span>أوقات التوفر والعمل الميداني</span>
            </h4>
            <div className="text-[13px] text-[#5B6660] space-y-1">
              <div className="flex justify-between">
                <span>السبت — الخميس:</span>
                <span className="font-semibold text-[#1C2421]">08:00 صباحاً - 18:00 مساءً</span>
              </div>
              <div className="flex justify-between">
                <span>يوم الجمعة:</span>
                <span className="text-[#0F6B3F] font-semibold">حالات الطوارئ والتسربات فقط</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#DDE3DF]/60">
                <span>سرعة الوصول التقديرية:</span>
                <span className="font-semibold text-[#1C2421]">خلال 30 إلى 45 دقيقة</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. صور الأعمال (Work Showcase) */}
        <div className="space-y-2">
          <h4 className="text-[14px] font-bold text-[#0A4D2E]">
            صور الأعمال المنجزة حديثاً
          </h4>
          <div className="grid grid-cols-3 gap-2.5">
            {workImages.map((img, i) => (
              <div key={i} className="aspect-4/3 rounded-[8px] overflow-hidden border border-[#DDE3DF] bg-[#EEF6F1]">
                <img
                  src={img}
                  alt={`عمل منجز ${i + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 5. تقييمات الزبائن (Customer Reviews) */}
        <div className="space-y-3 pt-2 border-t border-[#DDE3DF]">
          <h4 className="text-[14px] font-bold text-[#0A4D2E] flex items-center justify-between">
            <span>تقييمات الزبائن وتجاربهم</span>
            <span className="text-[12px] font-normal text-[#5B6660]">
              متوسط {selectedArtisan.rating} من 5 نجوم
            </span>
          </h4>

          <div className="space-y-2.5">
            {artisanReviews.map((rev) => (
              <div key={rev.id} className="p-3 bg-white border border-[#DDE3DF] rounded-[8px] space-y-1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-[#1C2421]">{rev.clientName}</span>
                  <Rating rating={rev.rating} size="sm" showNumber={false} />
                </div>
                <p className="text-[12px] text-[#5B6660]">
                  {rev.comment}
                </p>
                <span className="text-[10px] text-[#5B6660]/70 block">{rev.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Modal>
  );
};
