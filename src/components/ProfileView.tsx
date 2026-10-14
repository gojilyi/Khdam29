import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Globe, 
  Briefcase, 
  UserCheck, 
  HelpCircle, 
  Phone, 
  FileCheck, 
  CheckCircle2, 
  Lock,
  Key,
  ChevronRight,
  ChevronLeft,
  Award,
  Upload,
  FileText,
  Star,
  Heart,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  AlertCircle,
  Eye,
  Check,
  Zap,
  Mail,
  Trash2
} from 'lucide-react';
import { Language, VerificationLevel } from '../types';

export const ProfileView: React.FC = () => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    isDarkMode, 
    toggleDarkMode, 
    t, 
    currentUser,
    updateUserProfile,
    setIsProfessionalCardOpen,
    setSelectedArtisanForCard,
    workPosts,
    addWorkPost,
    togglePostLike,
    addPostComment,
    submitLevel1,
    submitLevel2,
    verificationRequests,
    setIsAuthModalOpen,
    artisans,
    favoriteArtisanIds,
    toggleFavoriteArtisan,
    setBookingModalService,
    startCall,
    setActiveTab,
    setIsContactModalOpen,
    setIsLegalModalOpen,
    setLegalModalTab
  } = useApp();

  const isRtl = language === 'ar';
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  // Active user level (defaults to Level 2 for Master Kamal, Level 1 for verified user)
  const userArtisan = artisans.find(a => a.name === currentUser.name) || artisans[0];
  const userLevel: VerificationLevel = role === 'artisan' ? (userArtisan?.verification.level ?? 2) : 1;
  const userTrade = role === 'artisan' ? (userArtisan?.bio || 'سباك وترصيص صحي') : 'طالب خدمات معتمد';

  // Level 1 form state (National ID + Selfie)
  const [isL1Open, setIsL1Open] = useState(false);
  const [l1IdPreview, setL1IdPreview] = useState('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80');
  const [l1SelfiePreview, setL1SelfiePreview] = useState(currentUser.avatar);
  const [l1Submitted, setL1Submitted] = useState(false);

  // Level 2 form state (Vocational Diploma)
  const [isL2Open, setIsL2Open] = useState(false);
  const [l2DiplomaTitle, setL2DiplomaTitle] = useState('شهادة الكفاءة المهنية (CAP) - ترصيص صحي وشبكات تدفئة');
  const [l2DiplomaPreview, setL2DiplomaPreview] = useState('https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80');
  const [l2Submitted, setL2Submitted] = useState(false);

  // Quick inline new work post state
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postImage, setPostImage] = useState('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80');
  const [postSuccess, setPostSuccess] = useState(false);
  const [activeCommentsMap, setActiveCommentsMap] = useState<{ [key: string]: string }>({});

  // Personal Info & Phone Number state (إمكانية وضع رقمه ومعلوماته الشخصية)
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [editName, setEditName] = useState(currentUser.name || 'هشام بن علي');
  const [editPhone, setEditPhone] = useState(currentUser.phone || '+213 550 12 34 56');
  const [editEmail, setEditEmail] = useState(currentUser.email || 'hichem.b@example.dz');
  const [editAddress, setEditAddress] = useState(currentUser.address || 'حي البساتين، عمارة 14، الشقة 5');
  const [editCity, setEditCity] = useState(currentUser.city || 'الجزائر العاصمة');
  const [editNeighborhood, setEditNeighborhood] = useState(currentUser.neighborhood || 'حيدرة / الأبيار');
  const [editSharePhone, setEditSharePhone] = useState(currentUser.sharePhoneWithArtisans ?? true);
  const [personalSaveSuccess, setPersonalSaveSuccess] = useState(false);

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      address: editAddress.trim(),
      city: editCity.trim(),
      neighborhood: editNeighborhood.trim(),
      sharePhoneWithArtisans: editSharePhone
    });
    setPersonalSaveSuccess(true);
    setTimeout(() => {
      setPersonalSaveSuccess(false);
      setIsEditingPersonalInfo(false);
    }, 1800);
  };

  const handleL1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLevel1(l1IdPreview, l1SelfiePreview);
    setL1Submitted(true);
    setTimeout(() => {
      setL1Submitted(false);
      setIsL1Open(false);
    }, 2000);
  };

  const handleL2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLevel2(l2DiplomaPreview, l2DiplomaTitle);
    setL2Submitted(true);
    setTimeout(() => {
      setL2Submitted(false);
      setIsL2Open(false);
    }, 2000);
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postDescription.trim()) return;

    addWorkPost({
      title: postTitle.trim(),
      description: postDescription.trim(),
      image: postImage,
      location: 'الجزائر العاصمة',
      trade: userTrade
    });

    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setIsCreatingPost(false);
      setPostTitle('');
      setPostDescription('');
    }, 1500);
  };

  const myPosts = workPosts.filter(p => p.authorName === currentUser.name || p.authorId === 'art_1');

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* 1. Profile Identity Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 text-amber-400 border border-amber-400 shadow-xs">
              {userLevel === 2 ? <Award className="w-4 h-4 text-emerald-400" /> : <ShieldCheck className="w-4 h-4 text-blue-400" />}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {currentUser.name}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                userLevel === 2 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
              }`}>
                {userLevel === 2 ? <Award className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>{userLevel === 2 ? 'موثق المستوى 2 (دبلوم معتمد)' : 'موثق المستوى 1 (هوية وطنية)'}</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {role === 'artisan' ? userTrade : (language === 'ar' ? 'حساب عميل موثق · الجزائر العاصمة' : 'Verified Client Account')}
            </p>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
              <span>طريقة الدخول: <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">{currentUser.method}</span></span>
              <span>·</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">KD-DZ-2026-8842</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Persona Switch & Auth */}
        <div className="flex flex-wrap sm:flex-col gap-2">
          <button
            onClick={() => setRole(role === 'client' ? 'artisan' : 'client')}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800/80 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            {role === 'client' ? <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400" /> : <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
            <span>{t.switchRole}</span>
          </button>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold text-center transition-colors"
          >
            تبديل وسيلة الدخول
          </button>
        </div>
      </div>

      {/* 2. Personal Information & Contact Details Card (إمكانية وضع رقمه ومعلوماته الشخصية) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>المعلومات الشخصية وبيانات الاتصال ورقم الهاتف</span>
                {personalSaveSuccess && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    تم الحفظ بنجاح!
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                يمكنك تحديث رقم هاتفك وعنوانك السكني وتفضيلات مشاركة الرقم مع الحرفيين
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingPersonalInfo(!isEditingPersonalInfo)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              isEditingPersonalInfo
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
            }`}
          >
            {isEditingPersonalInfo ? 'إلغاء التعديل' : 'تعديل بياناتي ورقم الهاتف'}
          </button>
        </div>

        {isEditingPersonalInfo ? (
          <form onSubmit={handleSavePersonalInfo} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم واللقب:
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الهاتف المباشر:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute rtl:right-3.5 ltr:left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={editPhone}
                    onChange={(e) => {
                      const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
                      const val = e.target.value.replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d).toString());
                      setEditPhone(val);
                    }}
                    placeholder="+213 550 12 34 56"
                    className="w-full rtl:pr-10 ltr:pl-10 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500 text-left"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني:
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="your.email@example.dz"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* City / Wilaya */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الولاية والمدينة:
                </label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Detailed Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  العنوان السكني التفصيلي والحي:
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="الشارع، رقم العمارة، رقم الشقة، الحي..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Phone Visibility Setting */}
            <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="profileSharePhone"
                  checked={editSharePhone}
                  onChange={(e) => setEditSharePhone(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                />
                <label htmlFor="profileSharePhone" className="cursor-pointer text-xs font-medium text-amber-950 dark:text-amber-200">
                  إظهار رقم هاتفي للحرفيين تلقائياً عند نشر الطلبات لتسهيل التواصل والاتصال السريع
                </label>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                editSharePhone
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {editSharePhone ? 'مفعل ومباشر' : 'مشفر عبر التطبيق'}
              </span>
            </div>

            {/* Save CTA */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingPersonalInfo(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>حفظ التعديلات والمعلومات</span>
              </button>
            </div>
          </form>
        ) : (
          /* Read-only view of current personal info */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">الاسم واللقب:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {currentUser.name}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">رقم الهاتف المباشر:</span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 dir-ltr inline-block">
                {currentUser.phone || '+213 550 12 34 56'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">البريد الإلكتروني:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {currentUser.email || 'hichem.b@example.dz'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 sm:col-span-2">
              <span className="text-[11px] text-slate-400 block mb-0.5">العنوان السكني والحي:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currentUser.address || 'حي البساتين، عمارة 14، الشقة 5'} — {currentUser.neighborhood || 'الأبيار'} ({currentUser.city || 'الجزائر العاصمة'})
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">مشاركة الهاتف مع الحرفيين:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {currentUser.sharePhoneWithArtisans ? '✓ متاح ومشارك تلقائياً' : '🔒 مشفر عبر التطبيق'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2.5. Favorite Artisans List (ميزة حرفي مفضل) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                قائمة الحرفيين المفضلين لديك ({artisans.filter(a => favoriteArtisanIds.includes(a.id)).length})
              </h3>
              <p className="text-xs text-slate-500">
                الحرفيون الذين تعاملت معهم ونالوا رضاك، لطلبهم مباشرة دون الحاجة للبحث مجدداً.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('artisans')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>استعراض جميع الحرفيين</span>
            <ChevronIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {artisans.filter(a => favoriteArtisanIds.includes(a.id)).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {artisans.filter(a => favoriteArtisanIds.includes(a.id)).map((artisan) => (
              <div 
                key={artisan.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3 hover:border-amber-400 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={artisan.avatar} 
                      alt={artisan.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-amber-500/30 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate">{artisan.name}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      </div>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-bold block mt-0.5 truncate">
                        {artisan.trade || 'حرفي معتمد'}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                          {artisan.rating}
                        </span>
                        <span>·</span>
                        <span>{artisan.city}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFavoriteArtisan(artisan.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors shrink-0"
                    title="إزالة من المفضلة"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <button
                    onClick={() => {
                      setBookingModalService({
                        categoryId: artisan.categoryId,
                        subServiceId: artisan.subCategoryIds[0]
                      });
                    }}
                    className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>طلب مباشر</span>
                  </button>

                  <button
                    onClick={() => startCall(artisan.name, artisan.trade || 'حرفي معتمد', artisan.avatar)}
                    className="py-2 px-3 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-600"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>اتصال</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
            <Heart className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500">
              لم تقم بإضافة أي حرفي إلى قائمة المفضلات حتى الآن. اضغط على رمز القلب ❤️ بجانب أي حرفي لحفظه هنا والطلب منه مباشرة في أي وقت.
            </p>
          </div>
        )}
      </div>

      {/* 3. Professional Digital Card Showcase Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 text-white border-2 border-amber-500/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-bold text-amber-300">
              <Award className="w-3.5 h-3.5" />
              <span>البطاقة المهنية الرقمية الرسمية (Carte Professionnelle)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              بطاقة إثبات الكفاءة ورقم القيد المهني
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              تحمل اسمك، مهنتك، شارة ومستوى التوثيق (المستوى 1 أو 2)، ورمز QR للتحقق السريع في الميدان لبناء أقصى ثقة مع الزبائن.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedArtisanForCard(userArtisan || null);
              setIsProfessionalCardOpen(true);
            }}
            className="h-12 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-transform active:scale-95 shrink-0"
          >
            <Award className="w-4 h-4 text-white" />
            <span>عرض وتحميل بطاقتي المهنية</span>
            <ChevronIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Verification Workflow Hub (Level 1 & Level 2) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>نظام شارات التوثيق المعتمد (2 مستويات)</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
            إدارة وتحديث مستويات التوثيق المهني
          </h3>
          <p className="text-xs text-slate-500">
            المستوى الأول يوثق بالهوية الوطنية والصورة الشخصية، والمستوى الثاني يفعل بالدبلوم التخصصي بالحرفة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Level 1 Box */}
          <div className={`p-5 rounded-2xl border transition-all ${
            userLevel >= 1 
              ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800' 
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    المستوى الأول: الهوية والصورة
                  </h4>
                  <span className="text-[10px] text-slate-500 block">بطاقة التعريف البيومترية + صورة سيلفي</span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                userLevel >= 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {userLevel >= 1 ? 'مفعل ومعتمد ✓' : 'غير مكتمل'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              يضمن تطابق الشخصية القانونية وصاحب الحساب لمنع انتحال الشخصية وضمان أمان المنازل.
            </p>

            <button
              onClick={() => setIsL1Open(!isL1Open)}
              className="mt-4 w-full py-2 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{userLevel >= 1 ? 'تحديث وثائق الهوية' : 'رفع الهوية والصورة الآن'}</span>
            </button>
          </div>

          {/* Level 2 Box */}
          <div className={`p-5 rounded-2xl border transition-all ${
            userLevel === 2 
              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' 
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    المستوى الثاني: دبلوم الحرفة
                  </h4>
                  <span className="text-[10px] text-slate-500 block">شهادة الكفاءة أو الدبلوم المهني التخصصي</span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                userLevel === 2 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {userLevel === 2 ? 'مفعل (ذهبي) ✓' : 'بانتظار الدبلوم'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              يرقي حسابك إلى الدرجة العليا "حرفي معتمد بالدبلوم" ويمنحك أولوية الظهور وعلامة التوثيق الذهبية.
            </p>

            <button
              onClick={() => setIsL2Open(!isL2Open)}
              className="mt-4 w-full py-2 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{userLevel === 2 ? 'تحديث أو إضافة دبلوم آخر' : 'تفعيل المستوى 2 بالدبلوم'}</span>
            </button>
          </div>
        </div>

        {/* Level 1 Submission Drawer */}
        {isL1Open && (
          <form onSubmit={handleL1Submit} className="p-5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-500" />
                <span>إرسال وثائق التوثيق المستوى الأول:</span>
              </h4>
              <button type="button" onClick={() => setIsL1Open(false)} className="text-xs text-slate-400 hover:text-slate-600">
                إلغاء
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  1. بطاقة التعريف الوطنية (الواجهتان):
                </label>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <img src={l1IdPreview} alt="ID" className="w-14 h-10 object-cover rounded-lg border" />
                  <span className="text-[10px] text-slate-500 truncate">carte_identite_biometrique.jpg</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  2. الصورة الشخصية الحية (سيلفي):
                </label>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <img src={l1SelfiePreview} alt="Selfie" className="w-10 h-10 rounded-full object-cover border" />
                  <span className="text-[10px] text-slate-500 truncate">photo_selfie_verif.jpg</span>
                </div>
              </div>
            </div>

            {l1Submitted ? (
              <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>تم إرسال طلب التوثيق المستوى 1 بنجاح إلى إدارة خدام للتدقيق!</span>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>إرسال وثائق المستوى الأول للمطابقة</span>
              </button>
            )}
          </form>
        )}

        {/* Level 2 Submission Drawer */}
        {isL2Open && (
          <form onSubmit={handleL2Submit} className="p-5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-500" />
                <span>إرسال دبلوم وشهادة الكفاءة المهنية المستوى الثاني:</span>
              </h4>
              <button type="button" onClick={() => setIsL2Open(false)} className="text-xs text-slate-400 hover:text-slate-600">
                إلغاء
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                اسم الدبلوم أو شهادة الكفاءة والمعهد المانح:
              </label>
              <input
                type="text"
                required
                value={l2DiplomaTitle}
                onChange={(e) => setL2DiplomaTitle(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                نسخة الدبلوم أو الشهادة المهنية:
              </label>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <img src={l2DiplomaPreview} alt="Diploma" className="w-16 h-12 object-cover rounded-lg border" />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">diplome_qualification_artisanat.jpg</span>
                  <span className="text-[10px] text-slate-400">صادرة من مركز تكوين مهني معتمد</span>
                </div>
              </div>
            </div>

            {l2Submitted ? (
              <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>تم إرسال الدبلوم بنجاح! سيتم تفعيل المستوى 2 فور اعتماد الإدارة.</span>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Award className="w-4 h-4" />
                <span>إرسال الدبلوم المهني لتفعيل المستوى 2</span>
              </button>
            )}
          </form>
        )}
      </div>

      {/* 4. User's Published Works Portfolio with Hearts & Comments */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>معرض أعمالي ومشاريعي الميدانية</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
              الأعمال المنشورة وتفاعل العملاء
            </h3>
            <p className="text-xs text-slate-500">
              انشر صور إنجازاتك، وتلقَّ القلوب والإعجابات والتعليقات المباشرة من الزبائن.
            </p>
          </div>

          <button
            onClick={() => setIsCreatingPost(!isCreatingPost)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>نشر عمل جديد</span>
          </button>
        </div>

        {/* Quick inline post creator */}
        {isCreatingPost && (
          <form onSubmit={handlePublishPost} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
              إضافة مشروع جديد إلى ملفك الشخصي:
            </h4>
            <input
              type="text"
              required
              placeholder="عنوان المشروع (مثال: تركيب نظام تدفئة مركزية بشقة)..."
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
            <textarea
              required
              rows={2}
              placeholder="وصف تفصيلي للعمل، المواد المستخدمة، والضمان..."
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
            {postSuccess ? (
              <div className="text-xs font-bold text-emerald-600 py-1 text-center">
                تم نشر العمل بنجاح في بروفايلك والمعرض العام ✓
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>نشر العمل في المعرض</span>
              </button>
            )}
          </form>
        )}

        {/* List of user works with hearts and comments */}
        <div className="space-y-4 pt-2">
          {myPosts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-amber-500 opacity-60" />
              <p className="text-xs font-medium">لم تنشر أي عمل بعد. اضغط على "نشر عمل جديد" لعرض مهاراتك!</p>
            </div>
          ) : (
            myPosts.map((post) => {
              const currentComment = activeCommentsMap[post.id] || '';

              return (
                <div key={post.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {post.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">{post.createdAt} · {post.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {post.description}
                  </p>

                  <div className="rounded-xl overflow-hidden max-h-56">
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  </div>

                  {/* Likes and Comments Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePostLike(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all active:scale-90 ${
                          post.hasLiked
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${post.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{post.likesCount} قلوب</span>
                      </button>

                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                        <span>{post.comments.length} تعليقات</span>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  {post.comments.length > 0 && (
                    <div className="space-y-2 pt-2">
                      {post.comments.map((c) => (
                        <div key={c.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{c.authorName}</span>
                            <span className="text-[10px] text-slate-400">{c.date}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add comment inline */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="أضف رداً أو تعليقاً..."
                      value={currentComment}
                      onChange={(e) => setActiveCommentsMap(prev => ({ ...prev, [post.id]: e.target.value }))}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (!currentComment.trim()) return;
                        addPostComment(post.id, currentComment.trim());
                        setActiveCommentsMap(prev => ({ ...prev, [post.id]: '' }));
                      }}
                      className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors"
                      title="إرسال"
                    >
                      <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 5. Platform Preferences (Language, Dark Mode) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          {language === 'ar' ? 'إعدادات المنصة والواجهة' : 'App Preferences'}
        </h3>

        {/* Language Selection */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {t.language}
              </span>
              <span className="text-[11px] text-slate-400">
                {language === 'ar' ? 'العربية (RTL)' : language === 'fr' ? 'Français' : 'English'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {(['ar', 'fr', 'en'] as Language[]).map((lng) => (
              <button
                key={lng}
                onClick={() => setLanguage(lng)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  language === lng
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <div className="flex items-center gap-3">
            {isDarkMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {isDarkMode ? t.darkMode : t.lightMode}
              </span>
              <span className="text-[11px] text-slate-400">
                {isDarkMode ? 'الوضع الداكن مفعّل لراحة العينين' : 'الوضع النهاري مفعّل'}
              </span>
            </div>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              isDarkMode ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* WORK PARTNER QUICK CARD (البحث عن شريك للعمل) */}
        <div 
          onClick={() => setActiveTab('partners')}
          className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-slate-50 to-amber-500/5 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:border-amber-500 transition-colors group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>البحث عن شريك للعمل والورشات 🤝</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                  جديد
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                انشر عروض الشراكة بالصور، تواصل مع الحرفيين وتفاعل بالقلوب والتعليقات المفتوحة
              </p>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-amber-500 text-slate-950 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform shrink-0">
            {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>

        {/* 7. GOOGLE PLAY STORE COMPLIANCE & LEGAL SECTION (سياسات المتجر وتواصل معنا وحذف البيانات) */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? 'الأمان، الدعم وسياسات Google Play' : 'Security, Support & Play Policies'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'معايير أمان معتمدة وفق متطلبات متجر قوقل بلاي وحماية بيانات المستخدم' : 'Compliant with Google Play Data Safety & user privacy standards'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200 dark:border-slate-700/80 hover:border-amber-500/40 rounded-xl text-start transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'خدمة العملاء والدعم الفني المباشر' : 'Customer service & technical support'}
              </p>
            </button>

            <button
              onClick={() => {
                setLegalModalTab('privacy');
                setIsLegalModalOpen(true);
              }}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/40 rounded-xl text-start transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'حماية البيانات وأذونات التطبيق' : 'Data protection & permissions'}
              </p>
            </button>

            <button
              onClick={() => {
                setLegalModalTab('deletion');
                setIsLegalModalOpen(true);
              }}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700/80 hover:border-rose-500/40 rounded-xl text-start transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1">
                <Trash2 className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === 'ar' ? 'حذف الحساب والبيانات' : 'Data & Account Deletion'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'إجراء حذف الحساب (Google Play)' : 'Play Store account deletion flow'}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
