import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  MessageSquare, 
  PhoneCall, 
  Send, 
  Image as ImageIcon, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Share2, 
  Trash2, 
  Building2, 
  Wrench, 
  Coins, 
  Briefcase, 
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Eye,
  Check
} from 'lucide-react';
import { WorkPartnerPost, PartnershipType, PartnerComment } from '../types';

export const WorkPartnerFinder: React.FC = () => {
  const { 
    partnerPosts, 
    addPartnerPost, 
    togglePartnerPostLike, 
    addPartnerPostComment, 
    deletePartnerPost, 
    startCall, 
    currentUser, 
    role, 
    isAdminAuthenticated,
    language 
  } = useApp();

  // -------------------------------------------------------------
  // Filter & Search States
  // -------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // -------------------------------------------------------------
  // Create Partner Post Modal States
  // -------------------------------------------------------------
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [partnershipType, setPartnershipType] = useState<PartnershipType>('workshop_sharing');
  const [wilaya, setWilaya] = useState('الجزائر العاصمة');
  const [city, setCity] = useState('');
  const [trade, setTrade] = useState('');
  const [description, setDescription] = useState('');
  const [whatIOffer, setWhatIOffer] = useState('');
  const [whatISeek, setWhatISeek] = useState('');
  const [authorPhone, setAuthorPhone] = useState(currentUser?.phone || '0550 00 00 00');
  const [selectedImages, setSelectedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80'
  ]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Preset craft images for quick selection
  const imagePresets = [
    { label: 'ورشة نجارة وأثاث', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80' },
    { label: 'ورشة ميكانيك وسيارات', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80' },
    { label: 'موقع بناء وعمارة', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80' },
    { label: 'دهان وديكور BA13', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80' },
    { label: 'كهرباء وإنارة صناعية', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80' },
    { label: 'ورشة حدادة ولحام', url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80' },
    { label: 'سباكة ومضخات', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80' },
  ];

  const partnershipTypesList: { id: PartnershipType; label: string; icon: any; color: string; desc: string }[] = [
    { 
      id: 'workshop_sharing', 
      label: 'تقاسم ورشة / محل', 
      icon: Building2, 
      color: 'from-amber-500 to-amber-600',
      desc: 'مشاركة مساحة المحل، تكلفة الإيجار، وفواتير الكهرباء' 
    },
    { 
      id: 'project_partner', 
      label: 'شراكة مشروع أو مقاولة', 
      icon: Briefcase, 
      color: 'from-blue-600 to-indigo-600',
      desc: 'تنفيذ صفقة أو مشروع بناء/تشطيب بنظام النسبة والتعاون' 
    },
    { 
      id: 'capital_equipment', 
      label: 'شراكة رأس مال أو عتاد', 
      icon: Coins, 
      color: 'from-emerald-600 to-teal-600',
      desc: 'طرف يوفر الأجهزة والمعدات أو التمويل وطرف يقدم العمل والخبرة' 
    },
    { 
      id: 'skill_complementary', 
      label: 'تكامل خبرات ومهارات', 
      icon: Wrench, 
      color: 'from-purple-600 to-violet-600',
      desc: 'مهنتان متكاملتان (مثلاً: كهربائي + ميكانيكي، أو نجار + دهان)' 
    },
    { 
      id: 'subcontract_team', 
      label: 'تكوين فريق عمل متكامل', 
      icon: Users, 
      color: 'from-rose-600 to-pink-600',
      desc: 'تأسيس مجموعة حرفيين للتعاقد على تشطيب مشاريع كبرى' 
    }
  ];

  const algerianWilayas = [
    'الجزائر العاصمة', 'وهران', 'قسنطينة', 'سطيف', 'البليدة', 'باتنة', 'عنابة', 'تلمسان', 
    'بجاية', 'تيزي وزو', 'الشلف', 'بسكرة', 'سكيكدة', 'جيجل', 'مستغانم', 'المسيلة', 'برج بوعريريج',
    'المدية', 'عين الدفلى', 'تيبازة', 'بومرداس', 'البويرة', 'ورقلة', 'غرداية', 'أدرار'
  ];

  const popularTrades = [
    'نجارة خشب وأثاث', 'بناء وسيراميك', 'سباكة وترصيص', 'كهرباء معمارية وصناعية', 
    'دهان وديكور BA13', 'ميكانيك وكهرباء سيارات', 'نجارة ألمنيوم وPVC', 'حدادة ولحام', 
    'تبريد وتكييف', 'طبخ وحلويات تقليدية'
  ];

  // -------------------------------------------------------------
  // Filtered Posts Logic
  // -------------------------------------------------------------
  const filteredPosts = useMemo(() => {
    return partnerPosts.filter(post => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(q);
        const matchDesc = post.description.toLowerCase().includes(q);
        const matchTrade = post.authorTrade.toLowerCase().includes(q);
        const matchAuthor = post.authorName.toLowerCase().includes(q);
        const matchWilaya = post.wilaya.toLowerCase().includes(q);
        const matchOffer = post.whatIOffer.toLowerCase().includes(q);
        const matchSeek = post.whatISeek.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchTrade && !matchAuthor && !matchWilaya && !matchOffer && !matchSeek) {
          return false;
        }
      }

      // 2. Type Filter
      if (selectedType !== 'all' && post.partnershipType !== selectedType) {
        return false;
      }

      // 3. Wilaya Filter
      if (selectedWilaya !== 'all' && post.wilaya !== selectedWilaya) {
        return false;
      }

      // 4. Trade Filter
      if (selectedTrade !== 'all' && !post.authorTrade.includes(selectedTrade)) {
        return false;
      }

      return true;
    });
  }, [partnerPosts, searchQuery, selectedType, selectedWilaya, selectedTrade]);

  // -------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------
  const handleToggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    addPartnerPostComment(postId, text);
    setCommentInputs(prev => ({
      ...prev,
      [postId]: ''
    }));

    // Ensure comments section is expanded
    setExpandedComments(prev => ({
      ...prev,
      [postId]: true
    }));
  };

  const handleShare = (post: WorkPartnerPost) => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `🤝 عرض شراكة عمل: ${post.title} في ${post.wilaya}`,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(url);
      setShareToast(`تم نسخ رابط إعلان الشراكة "${post.title.slice(0, 25)}..." لمشاركته!`);
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  const handleSubmitNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !trade.trim()) {
      alert('يرجى كتابة عنوان الشراكة، التخصص المهني، والتفاصيل المطلوبة.');
      return;
    }

    const postImages = selectedImages.length > 0 
      ? selectedImages 
      : ['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80'];

    addPartnerPost({
      title: title.trim(),
      authorId: currentUser?.id || `user_${Date.now()}`,
      authorName: currentUser?.name || 'حرفي مبادر',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      authorTrade: trade.trim(),
      authorPhone: authorPhone.trim(),
      authorVerificationLevel: 2,
      partnershipType,
      wilaya,
      city: city.trim() || undefined,
      description: description.trim(),
      whatIOffer: whatIOffer.trim() || 'خبرة مهنية وجدية والتزام تام بأخلاقيات المهنة',
      whatISeek: whatISeek.trim() || 'شريك جاد أمين ومتفرغ للعمل',
      images: postImages,
      status: 'active',
      contactPreference: 'both'
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setTrade('');
    setWhatIOffer('');
    setWhatISeek('');
    setCity('');
    setIsCreateModalOpen(false);
  };

  const handleAddPresetImage = (url: string) => {
    if (selectedImages.includes(url)) {
      setSelectedImages(prev => prev.filter(img => img !== url));
    } else {
      setSelectedImages(prev => [...prev, url]);
    }
  };

  const handleAddCustomImage = () => {
    if (!customImageUrl.trim()) return;
    setSelectedImages(prev => [...prev, customImageUrl.trim()]);
    setCustomImageUrl('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* Toast Alert */}
      {shareToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white border border-amber-500 shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* 1. HERO HEADER SECTION */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-9 shadow-xl border border-amber-900/40">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <Users className="w-4 h-4 text-amber-400" />
              <span>شبكة التعاون والشراكات المهنية في الجزائر</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              البحث عن شريك للعمل والورشات والمشاريع 🤝
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              اعثر على شريك لفتح ورشة جديدة، تقاسم تكاليف الإيجار والمعدات، أو تنفيذ مقاولات ومشاريع كبرى. 
              انشر طلبك، ارفع الصور، وتفاعل بالقلوب والتعليقات المفتوحة مع إمكانية التواصل الهاتفي الفوري.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>قلوب وإعجابات تفاعلية</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>تعليقات ومناقشات مفتوحة</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>نشر تفاصيل وصور الورشة والعتاد</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>نشر إعلان شراكة عمل ✍️</span>
            </button>
            <span className="text-[11px] text-slate-400 text-center">
              متاح مجاناً لكافة الحرفيين والمهنيين
            </span>
          </div>
        </div>
      </div>

      {/* 2. PARTNERSHIP TYPE CARDS (QUICK FILTER) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {partnershipTypesList.map(item => {
          const Icon = item.icon;
          const isActive = selectedType === item.id;
          const count = partnerPosts.filter(p => p.partnershipType === item.id).length;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedType(isActive ? 'all' : item.id)}
              className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.color} text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {count}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight line-clamp-1">{item.label}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH & ADVANCED FILTERS BAR */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن شراكة (مثلاً: ورشة نجار، مقاول بناء، ميكانيك سيارات، شراكة بالعتاد)..."
              className="w-full h-11 pr-10 pl-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Wilaya Filter */}
          <div className="sm:w-56 relative">
            <select
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">📍 جميع الولايات ({algerianWilayas.length})</option>
              {algerianWilayas.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* Trade Filter */}
          <div className="sm:w-56 relative">
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">🛠️ جميع التخصصات الحرفية</option>
              {popularTrades.map(tr => (
                <option key={tr} value={tr}>{tr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filter Reset */}
        {(selectedType !== 'all' || selectedWilaya !== 'all' || selectedTrade !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">
              تم العثور على <strong className="text-amber-600 dark:text-amber-400">{filteredPosts.length}</strong> إعلان شراكة مطابق للبحث
            </span>
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedWilaya('all');
                setSelectedTrade('all');
                setSearchQuery('');
              }}
              className="text-amber-600 hover:text-amber-700 font-bold hover:underline"
            >
              إلغاء التصفية وإظهار الكل
            </button>
          </div>
        )}
      </div>

      {/* 4. POSTS FEED LIST */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                لم يتم العثور على إعلانات شراكة مطابقة للبحث
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                جرب تغيير خيارات التصفية أو كن أول من ينشر عرض شراكة عمل في هذا المجال!
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors"
            >
              نشر إعلان شراكة الآن 🤝
            </button>
          </div>
        ) : (
          filteredPosts.map(post => {
            const isCommentsOpen = !!expandedComments[post.id];
            const currentComments = post.comments || [];
            const typeInfo = partnershipTypesList.find(t => t.id === post.partnershipType) || partnershipTypesList[0];

            return (
              <article
                key={post.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Post Author Bar */}
                <div className="p-4 sm:p-5 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.authorName} 
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {post.authorName}
                        </h3>
                        {post.authorVerificationLevel >= 1 && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            <span>موثق</span>
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-medium text-amber-600 dark:text-amber-400">{post.authorTrade}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{post.wilaya} {post.city ? `(${post.city})` : ''}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{post.createdAt}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {typeInfo.label}
                    </span>

                    {(isAdminAuthenticated || currentUser?.id === post.authorId) && (
                      <button
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
                            deletePartnerPost(post.id);
                          }
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                        title="حذف الإعلان"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Main Content */}
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Title */}
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {post.description}
                  </p>

                  {/* Two Highlight Boxes: What I Offer & What I Seek */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* What I offer */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>ما أوفره أنا في هذه الشراكة:</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {post.whatIOffer}
                      </p>
                    </div>

                    {/* What I seek */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-500/30 space-y-1.5">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        <span>المطلوب والمواصفات في الشريك:</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {post.whatISeek}
                      </p>
                    </div>
                  </div>

                  {/* Attached Images Gallery */}
                  {post.images && post.images.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-slate-400 block">
                        صور توضيحية للورشة / العمل ({post.images.length})
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {post.images.map((imgUrl, idx) => (
                          <div 
                            key={idx}
                            onClick={() => setLightboxImage(imgUrl)}
                            className="group relative aspect-video sm:aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 cursor-pointer"
                          >
                            <img 
                              src={imgUrl} 
                              alt={`مرفق ${idx + 1}`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Post Footer Action Bar: HEARTS, COMMENTS & CONTACT */}
                <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  {/* Hearts (Likes) & Comments Toggles */}
                  <div className="flex items-center gap-2">
                    {/* HEARTS BUTTON (Open for everyone) */}
                    <button
                      onClick={() => togglePartnerPostLike(post.id)}
                      className={`h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-transform active:scale-90 cursor-pointer border ${
                        post.hasLiked
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500/40 text-rose-600 dark:text-rose-400 shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-400 hover:text-rose-500'
                      }`}
                      title={post.hasLiked ? 'إلغاء الإعجاب' : 'إعجاب بالمنشور (قلب)'}
                    >
                      <Heart 
                        className={`w-4 h-4 transition-transform ${
                          post.hasLiked 
                            ? 'text-rose-500 fill-rose-500 scale-110 animate-pulse' 
                            : 'text-slate-400 group-hover:text-rose-500'
                        }`} 
                      />
                      <span>{post.likesCount}</span>
                      <span className="hidden sm:inline font-normal text-[11px]">قلب</span>
                    </button>

                    {/* COMMENTS BUTTON (Open comments) */}
                    <button
                      onClick={() => handleToggleComments(post.id)}
                      className={`h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2 border cursor-pointer ${
                        isCommentsOpen
                          ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                      }`}
                      title="عرض أو كتابة تعليق"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-500" />
                      <span>{currentComments.length}</span>
                      <span className="hidden sm:inline font-normal text-[11px]">تعليق</span>
                      {isCommentsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* SHARE BUTTON */}
                    <button
                      onClick={() => handleShare(post)}
                      className="h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
                      title="مشاركة إعلان الشراكة"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        startCall(post.authorName, 'artisan', post.authorAvatar);
                      }}
                      className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
                      title="اتصال فوري بالشريك"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>اتصال ({post.authorPhone})</span>
                    </button>
                  </div>
                </div>

                {/* 5. OPEN COMMENTS THREAD ACCORDION */}
                {isCommentsOpen && (
                  <div className="p-4 sm:p-5 bg-slate-100/70 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                        <span>التعليقات والمناقشات المفتوحة حول هذا العرض ({currentComments.length})</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        التعليق متاح للجميع لطرح الأسئلة ومناقشة الشراكة
                      </span>
                    </div>

                    {/* Comment Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(post.id);
                          }
                        }}
                        placeholder="اكتب تعليقك أو استفسارك لصاحب الإعلان..."
                        className="flex-1 h-10 px-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="h-10 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>إرسال</span>
                      </button>
                    </div>

                    {/* Quick Suggestions Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="text-slate-400">اقتراحات سريعة:</span>
                      {[
                        'مهتم بالشراكة، كيف نتواصل؟',
                        'أملك ورشة ومعدات، سأتصل بك هاتفياً',
                        'بالتوفيق أخي، فكرة ممتازة ما شاء الله',
                        'هل الشراكة تتطلب رأس مال أولي؟'
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCommentInputs(prev => ({ ...prev, [post.id]: preset }))}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-500 transition-colors"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    {/* Comments List */}
                    {currentComments.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">
                        لا توجد تعليقات بعد. كن أول من يعلق أو يطرح استفساراً على صاحب الشراكة!
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {currentComments.map((comment: PartnerComment) => (
                          <div 
                            key={comment.id}
                            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 shadow-2xs"
                          >
                            <img 
                              src={comment.authorAvatar} 
                              alt={comment.authorName}
                              className="w-8 h-8 rounded-xl object-cover shrink-0 mt-0.5"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    {comment.authorName}
                                  </span>
                                  {comment.authorTrade && (
                                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                      ({comment.authorTrade})
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  {comment.createdAt}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* 6. MODAL: PUBLISH PARTNERSHIP POST */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    نشر إعلان شراكة عمل جديد 🤝
                  </h3>
                  <p className="text-xs text-slate-500">
                    أدخل تفاصيل الشراكة والمطلوب ليتفاعل معها الحرفيون والشركاء
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitNewPost} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  عنوان الإعلان الرئيسي *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: مطلوب شريك نجار لفتح ورشة نجارة وأثاث بالرويبة"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Partnership Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  نوع الشراكة المقترحة *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {partnershipTypesList.map(type => (
                    <label
                      key={type.id}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                        partnershipType === type.id
                          ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="partnershipType"
                        value={type.id}
                        checked={partnershipType === type.id}
                        onChange={() => setPartnershipType(type.id)}
                        className="text-amber-500 focus:ring-amber-500"
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Wilaya, City & Trade */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    الولاية *
                  </label>
                  <select
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {algerianWilayas.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    البلدية أو الحي (اختياري)
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="مثال: باب الزوار"
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    مهنتك / التخصص *
                  </label>
                  <input
                    type="text"
                    required
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                    placeholder="مثال: نجار، مقاول، سباك..."
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  شرح وتفاصيل الشراكة *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اشرح طبيعة المشروع، مساحة الورشة، طبيعة العمل، ونظام تقاسم الأرباح أو التكاليف..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              {/* What I offer & What I seek */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-amber-600 dark:text-amber-400 block">
                    ما أوفره أنا (المعدات، المحل، الخبرة...) *
                  </label>
                  <textarea
                    rows={2}
                    value={whatIOffer}
                    onChange={(e) => setWhatIOffer(e.target.value)}
                    placeholder="مثال: محل مجهز 100م²، كهرباء 380V، سيارة نقل وطلبيات زبائن سابقة"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-blue-600 dark:text-blue-400 block">
                    ما أبحث عنه في الشريك (الشروط والمواصفات) *
                  </label>
                  <textarea
                    rows={2}
                    value={whatISeek}
                    onChange={(e) => setWhatISeek(e.target.value)}
                    placeholder="مثال: خبرة 5 سنوات، إتقان التصميم 3D، التفرغ التام، والجدية والأمانة"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Author Phone */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  رقم الهاتف للتواصل المباشر *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={authorPhone}
                    onChange={(e) => {
                      const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
                      const val = e.target.value.replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d).toString());
                      setAuthorPhone(val);
                    }}
                    placeholder="0550 00 00 00"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                  />
                  <span className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                    🇩🇿 +213
                  </span>
                </div>
              </div>

              {/* Images Presets & Custom URL */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  إرفاق صور للورشة أو العتاد أو نماذج العمل
                </label>
                <div className="flex flex-wrap gap-2">
                  {imagePresets.map((preset, idx) => {
                    const isSelected = selectedImages.includes(preset.url);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleAddPresetImage(preset.url)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="أو ألصق رابط صورة خارجية..."
                    className="flex-1 h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomImage}
                    className="h-9 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
                  >
                    إضافة صورة
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>نشر الإعلان الآن</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. LIGHTBOX IMAGE PREVIEW MODAL */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={lightboxImage} 
              alt="معاينة الصورة" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border border-white/20"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-3 -right-3 p-2 bg-slate-900 text-white rounded-full border border-white/20 hover:bg-rose-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
