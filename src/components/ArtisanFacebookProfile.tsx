import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Heart, 
  MessageSquare, 
  Share2, 
  PhoneCall, 
  MapPin, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Image as ImageIcon, 
  Video, 
  Send, 
  Camera, 
  MoreHorizontal, 
  Globe, 
  Clock, 
  Star, 
  Briefcase, 
  Check, 
  Upload, 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  MessageCircle,
  ThumbsUp,
  UserCheck
} from 'lucide-react';
import { Artisan, WorkPost } from '../types';

interface ArtisanFacebookProfileProps {
  artisan?: Artisan;
  isOpen: boolean;
  onClose: () => void;
}

export const ArtisanFacebookProfile: React.FC<ArtisanFacebookProfileProps> = ({
  artisan: propArtisan,
  isOpen,
  onClose
}) => {
  const { 
    selectedArtisanForProfile, 
    artisans, 
    workPosts, 
    addWorkPost, 
    togglePostLike, 
    togglePostShare, 
    addPostComment, 
    currentUser, 
    role, 
    startCall, 
    setIsChatOpen, 
    setBookingModalService, 
    setSelectedArtisanForCard, 
    setIsProfessionalCardOpen,
    language 
  } = useApp();

  const artisan = propArtisan || selectedArtisanForProfile || artisans[0];

  const artisanTrade = artisan ? (artisan.trade || artisan.bio || 'حرفي معتمد ومؤهل') : 'حرفي معتمد ومؤهل';
  const experienceYears = artisan ? (artisan.experienceYears || 8) : 8;
  const completedJobsCount = artisan ? (artisan.completedJobsCount || (artisan.reviewCount * 2 + 15)) : 50;
  const reviewsCount = artisan ? (artisan.reviewCount || 42) : 42;
  const etaMinutes = artisan ? (artisan.etaMinutes || 25) : 25;
  const skillsList: string[] = artisan && artisan.skills ? artisan.skills : ['صيانة شاملة', 'إتقان فني وسرعة', 'قطع أصلية وضمان', 'استجابة فورية'];

  // Profile Tab state
  type ProfileTab = 'feed' | 'completed' | 'media' | 'reviews' | 'about';
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTab>('feed');

  // New post creation state
  const [isPublisherOpen, setIsPublisherOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isCompletedTask, setIsCompletedTask] = useState(false);
  const [taskLocation, setTaskLocation] = useState(artisan ? artisan.city : 'الجزائر العاصمة');
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);

  // Expanded comments state per post
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Video playing state per post
  const [playingVideos, setPlayingVideos] = useState<{ [postId: string]: boolean }>({});
  const [mutedVideos, setMutedVideos] = useState<{ [postId: string]: boolean }>({});

  if (!isOpen || !artisan) return null;

  // Filter posts related to this artisan (or show all if artisan authored, plus general sample posts)
  const artisanPosts = workPosts.filter(p => 
    p.authorId === artisan.id || p.authorName === artisan.name || p.authorTrade === artisanTrade
  );

  const displayPosts = artisanPosts.length > 0 ? artisanPosts : workPosts;
  const completedTaskPosts = displayPosts.filter(p => p.isCompletedTask);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result;
        if (typeof res === 'string') {
          if (isVideo) {
            setMediaType('video');
            setVideoUrl(res);
            setMediaUrl('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80');
          } else {
            setMediaType('image');
            setMediaUrl(res);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim() && !postTitle.trim()) return;

    addWorkPost({
      title: postTitle.trim() || (isCompletedTask ? `إنجاز مهمة: ${artisanTrade}` : postText.slice(0, 40) + '...'),
      description: postText.trim(),
      image: mediaType === 'image' ? (mediaUrl || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80') : (mediaUrl || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80'),
      videoUrl: mediaType === 'video' ? (videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4') : undefined,
      mediaType: mediaType,
      isCompletedTask: isCompletedTask,
      completionDate: isCompletedTask ? 'اليوم' : undefined,
      location: taskLocation,
      trade: artisanTrade
    });

    setUploadSuccessToast(true);
    setTimeout(() => {
      setUploadSuccessToast(false);
      setIsPublisherOpen(false);
      setPostText('');
      setPostTitle('');
      setMediaUrl('');
      setVideoUrl('');
      setIsCompletedTask(false);
    }, 1200);
  };

  const handleToggleLike = (postId: string) => {
    togglePostLike(postId);
  };

  const handleToggleShare = (post: WorkPost) => {
    togglePostShare(post.id);
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `${post.title} — إنجازات المعلم ${artisan.name} عبر منصة خـدّام`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      setShareToast(`تم نسخ رابط منشور "${post.title}" لمشاركته بنجاح!`);
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  const handleAddCommentSubmit = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    addPostComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  const toggleVideoPlayback = (postId: string) => {
    setPlayingVideos(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleVideoMute = (postId: string) => {
    setMutedVideos(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fade-in flex items-start justify-center p-0 sm:p-4">
      <div className="w-full max-w-4xl bg-slate-100 dark:bg-slate-950 min-h-screen sm:min-h-0 sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative pb-16">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed sm:absolute top-4 rtl:left-4 ltr:right-4 z-40 p-2.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full shadow-lg backdrop-blur-md transition-transform active:scale-95"
          title="إغلاق البروفايل"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. FACEBOOK COVER PHOTO */}
        <div className="relative h-48 sm:h-72 w-full bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&auto=format&fit=crop&q=80"
            alt="Cover"
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Cover Action Badge */}
          <div className="absolute bottom-3 rtl:left-4 ltr:right-4 flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/10">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>غلاف ورشة العمل الميدانية</span>
            </span>
          </div>
        </div>

        {/* 2. FACEBOOK PROFILE HEADER & AVATAR */}
        <div className="bg-white dark:bg-slate-900 px-4 sm:px-8 pb-4 pt-0 border-b border-slate-200 dark:border-slate-800 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            {/* Avatar & Online status */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-start">
              <div className="relative">
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-3 rtl:right-3 ltr:left-3 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" />
                <div className="absolute top-1 rtl:left-1 ltr:right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {artisan.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                    ✓ معتمد
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {artisanTrade} · {artisan.city} · {experienceYears} سنوات خبرة
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                  {artisan.bio}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs pt-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ⭐ {artisan.rating} <span className="text-slate-400">({completedJobsCount} مهمة ناجحة)</span>
                  </span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {artisan.hourlyRate} دج/ساعة
                  </span>
                </div>
              </div>
            </div>

            {/* Profile CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => {
                  setBookingModalService({ categoryId: 'home_repair' });
                  onClose();
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <Briefcase className="w-4 h-4" />
                <span>طلب خدمة وحجز</span>
              </button>

              <button
                onClick={() => {
                  startCall(artisan.name, artisanTrade, artisan.avatar);
                }}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="مكالمة هاتفية مشفرة"
              >
                <PhoneCall className="w-4 h-4 text-emerald-500" />
                <span className="hidden sm:inline">اتصال مشفر</span>
              </button>

              <button
                onClick={() => {
                  setIsChatOpen(true);
                  onClose();
                }}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="محادثة فورية"
              >
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span className="hidden sm:inline">رسالة</span>
              </button>

              <button
                onClick={() => {
                  setSelectedArtisanForCard(artisan);
                  setIsProfessionalCardOpen(true);
                }}
                className="p-2.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="البطاقة المهنية الرقمية"
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">البطاقة المهنية</span>
              </button>
            </div>
          </div>

          {/* 3. FACEBOOK TABS NAVIGATION */}
          <div className="flex items-center gap-1 sm:gap-2 border-t border-slate-100 dark:border-slate-800 pt-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveProfileTab('feed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeProfileTab === 'feed'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              المنشورات والأعمال ({displayPosts.length})
            </button>

            <button
              onClick={() => setActiveProfileTab('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeProfileTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>المهام المنجزة ({completedJobsCount})</span>
            </button>

            <button
              onClick={() => setActiveProfileTab('media')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeProfileTab === 'media'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>الصور والفيديوهات</span>
            </button>

            <button
              onClick={() => setActiveProfileTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeProfileTab === 'reviews'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>تقييمات الزبائن ({reviewsCount})</span>
            </button>

            <button
              onClick={() => setActiveProfileTab('about')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeProfileTab === 'about'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              حول المعلم
            </button>
          </div>
        </div>

        {/* Share Toast */}
        {shareToast && (
          <div className="mx-4 sm:mx-8 mt-3 p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{shareToast}</span>
            </div>
            <button onClick={() => setShareToast(null)} className="p-1 hover:text-emerald-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* MAIN BODY CONTENT */}
        <div className="px-4 sm:px-8 mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Bio & Intro Card) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                نبذة تعريفية ومؤهلات
              </h3>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>يعمل في مجال: <strong className="text-slate-900 dark:text-white">{artisanTrade}</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>يقيم ويعمل في: <strong className="text-slate-900 dark:text-white">{artisan.city} وضواحيها</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>متوسط وقت الوصول: <strong className="text-slate-900 dark:text-white">{etaMinutes} دقيقة</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>مستوى التوثيق: <strong className="text-emerald-600 dark:text-emerald-400">المستوى {artisan.verification.level} (هوية ودبلوم فني)</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>عضو معتمد في خـدّام منذ: <strong className="text-slate-900 dark:text-white">2024</strong></span>
                </div>
              </div>

              {/* Skills tags */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block mb-2">التخصصات والمهارات:</span>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Photos Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  معرض الصور الميدانية
                </h4>
                <button 
                  onClick={() => setActiveProfileTab('media')}
                  className="text-[11px] text-amber-500 font-bold"
                >
                  عرض الكل
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {displayPosts.slice(0, 6).map((post, idx) => (
                  <img
                    key={idx}
                    src={post.image}
                    alt={post.title}
                    className="w-full h-18 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Facebook Post Publisher & Feed) */}
          <div className="lg:col-span-2 space-y-4">

            {/* 4. FACEBOOK POST PUBLISHER BOX */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-400"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setIsPublisherOpen(true)}
                  className="flex-1 text-start py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-2xl text-xs text-slate-500 dark:text-slate-400 transition-colors"
                >
                  بماذا تفكر يا {artisan.name}؟ انشر إنجازاً أو مهمة مكتملة...
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs font-bold text-slate-600 dark:text-slate-400">
                <button
                  onClick={() => {
                    setMediaType('image');
                    setIsPublisherOpen(true);
                  }}
                  className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-500" />
                  <span>صور من الهاتف</span>
                </button>

                <button
                  onClick={() => {
                    setMediaType('video');
                    setIsPublisherOpen(true);
                  }}
                  className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Video className="w-4 h-4 text-rose-500" />
                  <span>فيديو حي</span>
                </button>

                <button
                  onClick={() => {
                    setIsCompletedTask(true);
                    setIsPublisherOpen(true);
                  }}
                  className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>مهمة منجزة</span>
                </button>
              </div>
            </div>

            {/* PUBLISHER MODAL */}
            {isPublisherOpen && (
              <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-500 shadow-xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        إنشاء منشور بروفايل جديد
                      </h4>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>عام (يظهر لجميع الزوار والزبائن)</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPublisherOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handlePublishPost} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="عنوان المنشور أو المشروع (اختياري)..."
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <textarea
                      required
                      rows={3}
                      placeholder="اكتب تفاصيل الإنجاز، المواد المستخدمة، والضمان..."
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Toggle Completed Task */}
                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-emerald-950 dark:text-emerald-300">
                        تصنيف هذا المنشور كـ "مهمة منجزة رسمياً"
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isCompletedTask}
                      onChange={(e) => setIsCompletedTask(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                  </div>

                  {/* Media Type & Device Upload */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        إرفاق وسائط (صورة أو فيديو من الهاتف):
                      </span>
                      <div className="flex gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border">
                        <button
                          type="button"
                          onClick={() => setMediaType('image')}
                          className={`px-2 py-1 text-[11px] font-bold rounded-md ${
                            mediaType === 'image' ? 'bg-amber-500 text-white' : 'text-slate-500'
                          }`}
                        >
                          صورة
                        </button>
                        <button
                          type="button"
                          onClick={() => setMediaType('video')}
                          className={`px-2 py-1 text-[11px] font-bold rounded-md ${
                            mediaType === 'video' ? 'bg-amber-500 text-white' : 'text-slate-500'
                          }`}
                        >
                          فيديو
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>تحميل {mediaType === 'video' ? 'فيديو' : 'صورة'} من الهاتف</span>
                        <input
                          type="file"
                          accept={mediaType === 'video' ? 'video/*' : 'image/*'}
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>

                      <input
                        type="url"
                        placeholder="أو رابط خارجي..."
                        value={mediaType === 'video' ? videoUrl : mediaUrl}
                        onChange={(e) => {
                          if (mediaType === 'video') setVideoUrl(e.target.value);
                          else setMediaUrl(e.target.value);
                        }}
                        className="flex-1 bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>

                    {(mediaUrl || videoUrl) && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                        ✓ تم اختيار وتجهيز ملف الميديا بنجاح
                      </span>
                    )}
                  </div>

                  {uploadSuccessToast ? (
                    <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center">
                      تم نشر المنشور على بروفايلك بنجاح!
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                    >
                      <Send className="w-4 h-4 rtl:rotate-180" />
                      <span>نشر على البروفايل</span>
                    </button>
                  )}
                </form>
              </div>
            )}

            {/* 5. FACEBOOK POSTS FEED */}
            <div className="space-y-4">
              {(activeProfileTab === 'completed' ? completedTaskPosts : displayPosts).map((post) => {
                const isExpanded = expandedComments[post.id];
                const isPlaying = playingVideos[post.id];
                const isMuted = mutedVideos[post.id] ?? true;

                return (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                  >
                    {/* Post Header */}
                    <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.authorAvatar || artisan.avatar}
                          alt={post.authorName}
                          className="w-10 h-10 rounded-full object-cover border border-amber-400"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {post.authorName || artisan.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                              {post.authorTrade || artisanTrade}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span>{post.createdAt}</span>
                            <span>·</span>
                            <span>{post.location}</span>
                            <span>·</span>
                            <Globe className="w-3 h-3" />
                          </div>
                        </div>
                      </div>

                      {post.isCompletedTask && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>مهمة مكتملة</span>
                        </span>
                      )}
                    </div>

                    {/* Post Content & Title */}
                    <div className="p-4 space-y-1.5">
                      {post.title && (
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {post.title}
                        </h4>
                      )}
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {post.description}
                      </p>
                    </div>

                    {/* Post Media (Image OR Video) */}
                    {post.mediaType === 'video' && post.videoUrl ? (
                      <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
                        <video
                          src={post.videoUrl}
                          playsInline
                          loop
                          muted={isMuted}
                          autoPlay={isPlaying}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => toggleVideoPlayback(post.id)}
                        />

                        {/* Video Controls Overlay */}
                        <div className="absolute bottom-2 inset-x-2 flex items-center justify-between p-2 rounded-xl bg-slate-950/70 text-white backdrop-blur-xs">
                          <button
                            onClick={() => toggleVideoPlayback(post.id)}
                            className="p-1 hover:text-amber-400"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                          </button>

                          <button
                            onClick={() => toggleVideoMute(post.id)}
                            className="p-1 hover:text-amber-400"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ) : post.image ? (
                      <div className="bg-slate-950 overflow-hidden max-h-[460px] flex items-center justify-center">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-auto object-cover max-h-[460px]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : null}

                    {/* Facebook Reactions Stats Bar */}
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center">
                          <Heart className="w-2.5 h-2.5 fill-current" />
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                          {post.likesCount}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span>{post.comments.length} تعليقات</span>
                        <span>·</span>
                        <span>{post.sharesCount || 0} مشاركات</span>
                      </div>
                    </div>

                    {/* Facebook Interaction Action Buttons */}
                    <div className="px-2 py-1.5 flex items-center justify-around text-xs font-bold text-slate-600 dark:text-slate-400">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all active:scale-95 ${
                          post.hasLiked
                            ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                        <span>أعجبني</span>
                      </button>

                      <button
                        onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-amber-500" />
                        <span>تعليق</span>
                      </button>

                      <button
                        onClick={() => handleToggleShare(post)}
                        className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-blue-500" />
                        <span>مشاركة</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    {isExpanded && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fade-in">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2 text-xs">
                            <img
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {comment.authorName}
                                </span>
                                <span className="text-[10px] text-slate-400">{comment.date}</span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Add Comment Input */}
                        <div className="flex items-center gap-2 pt-1">
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <input
                            type="text"
                            placeholder="اكتب تعليقاً على هذا الإنجاز..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddCommentSubmit(post.id);
                            }}
                            className="flex-1 bg-white dark:bg-slate-900 border rounded-2xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddCommentSubmit(post.id)}
                            className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
                          >
                            <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
