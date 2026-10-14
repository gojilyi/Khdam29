import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  Star, 
  PhoneCall, 
  MessageSquare, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Award, 
  X, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Car, 
  Wrench, 
  Sparkles, 
  Check, 
  Scissors, 
  ExternalLink,
  Users,
  AlertCircle
} from 'lucide-react';
import { JobSeekerProfile, JobSeekerCertificate, Artisan } from '../types';

export const WorkerJobMarketplace: React.FC = () => {
  const { 
    artisans, 
    jobSeekers, 
    addJobSeekerPost, 
    deleteJobSeekerPost, 
    updateJobSeekerStatus,
    startCall, 
    setIsChatOpen, 
    setSelectedArtisanForCard, 
    setIsProfessionalCardOpen,
    language 
  } = useApp();

  // Active Mode: 'find_worker' (البحث عن عامل) vs 'seek_work' (البحث عن عمل)
  const [activeMode, setActiveMode] = useState<'find_worker' | 'seek_work'>('find_worker');

  // -------------------------------------------------------------------
  // 1. FILTER STATE FOR "البحث عن عامل" (Find a Worker)
  // -------------------------------------------------------------------
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [selectedMinExperience, setSelectedMinExperience] = useState<number>(0);
  const [selectedMinRating, setSelectedMinRating] = useState<number>(0);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [requireCertificate, setRequireCertificate] = useState<boolean>(false);
  const [requireGuarantee, setRequireGuarantee] = useState<boolean>(false);
  const [requireTransportTools, setRequireTransportTools] = useState<boolean>(false);
  const [requirePortfolio, setRequirePortfolio] = useState<boolean>(false);
  const [onlyWomenCrafts, setOnlyWomenCrafts] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // -------------------------------------------------------------------
  // 2. FORM STATE FOR "البحث عن عمل" (Publish Work Seeking Profile)
  // -------------------------------------------------------------------
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [wilaya, setWilaya] = useState<string>('الجزائر العاصمة');
  const [city, setCity] = useState<string>('');
  const [trade, setTrade] = useState<string>(''); // ماذا تتقن
  const [category, setCategory] = useState<string>('home_repair');
  const [description, setDescription] = useState<string>(''); // ماذا تقدم
  const [skillsInput, setSkillsInput] = useState<string>('');
  const [experienceYears, setExperienceYears] = useState<number>(3);
  const [expectedWage, setExpectedWage] = useState<string>('3500 دج / يوم');
  const [availabilityType, setAvailabilityType] = useState<JobSeekerProfile['availabilityType']>('immediate');
  const [hasOwnTools, setHasOwnTools] = useState<boolean>(true);
  const [hasOwnTransport, setHasOwnTransport] = useState<boolean>(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [avatarUrl, setAvatarUrl] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  
  // Uploaded Certificates & Work Photos
  const [uploadedCertificates, setUploadedCertificates] = useState<JobSeekerCertificate[]>([]);
  const [newCertTitle, setNewCertTitle] = useState<string>('');
  const [newCertIssuer, setNewCertIssuer] = useState<string>('');
  const [newCertImage, setNewCertImage] = useState<string>('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80');

  const [uploadedPortfolio, setUploadedPortfolio] = useState<string[]>([]);
  const [newPortfolioImage, setNewPortfolioImage] = useState<string>('');

  const [formSuccessMessage, setFormSuccessMessage] = useState<string>('');

  // Lightbox / Image Preview Modal
  const [previewModalImage, setPreviewModalImage] = useState<{ url: string; title: string } | null>(null);

  // Algerian Wilayas list
  const wilayas = [
    'الجزائر العاصمة',
    'وهران',
    'قسنطينة',
    'سطيف',
    'البليدة',
    'عنابة',
    'تلمسان',
    'بجاية',
    'تيزي وزو',
    'باتنة',
    'الشلف',
    'مستغانم',
    'برج بوعريريج',
    'بسكرة',
    'الجلفة',
    'المدية',
    'تيبازة',
    'بومرداس'
  ];

  // Available Fields / Categories
  const fieldCategories = [
    { id: 'all', label: 'جميع المجالات والتخصصات', icon: 'All' },
    { id: 'women_crafts', label: 'أعمال النساء (خياطة، طبخ، حلويات، تطريز)', icon: 'Scissors', isFemale: true },
    { id: 'home_repair', label: 'صيانة المنازل (سباكة، كهرباء، دهان، نجارة، بناء)', icon: 'Wrench' },
    { id: 'automotive_roadside', label: 'السيارات والمساعدة (ميكانيك، ديباناج، كهرباء)', icon: 'Car' },
    { id: 'tech_smart_home', label: 'التقنية والتكييف (كهرومنزلي، تبريد، كاميرات)', icon: 'Laptop' },
    { id: 'cleaning_facility', label: 'النظافة والمناولة (تنظيف، نقل، ترحيل، عمال يدويين)', icon: 'Sparkles' },
    { id: 'health_personal', label: 'الرعاية والتمريض (تمريض منزلي، رعاية كبار السن)', icon: 'Heart' },
    { id: 'agriculture_env', label: 'البستنة والمساحات الخضراء', icon: 'Tree' }
  ];

  // Combined Worker Pool for Search (Artisans + Registered Job Seekers)
  const combinedWorkers = useMemo(() => {
    // Convert Job Seekers into Worker Representation
    const jobSeekerConverted = jobSeekers.map(js => ({
      id: js.id,
      name: js.name,
      avatar: js.avatar,
      categoryId: js.category,
      trade: js.trade,
      experienceYears: js.experienceYears,
      rating: 4.9, // Default verified rating for validated job seekers
      reviewCount: 12,
      city: js.wilaya,
      neighborhood: js.city,
      bio: js.description,
      skills: js.skills,
      hourlyRate: 0,
      expectedWage: js.expectedWage,
      phone: js.phone,
      verification: {
        idVerified: true,
        certVerified: js.certificates.length > 0,
        khodamGuaranteed: true,
        topRated: js.experienceYears >= 5,
        level: js.certificates.length > 0 ? 2 : 1,
        yearsExperience: js.experienceYears,
        completedJobsCount: 45
      },
      portfolioImages: js.portfolioImages,
      certificates: js.certificates,
      qualificationTitle: js.certificates[0]?.title || 'كفاءة مهنية معتمدة',
      isJobSeeker: true,
      availabilityType: js.availabilityType,
      hasOwnTools: js.hasOwnTools,
      hasOwnTransport: js.hasOwnTransport,
      gender: js.gender,
      status: js.status
    }));

    // Convert Artisans
    const artisansConverted = artisans.map(art => ({
      id: art.id,
      name: art.name,
      avatar: art.avatar,
      categoryId: art.categoryId,
      trade: art.trade || 'حرفي ميداني معتمد',
      experienceYears: art.experienceYears || art.verification.yearsExperience || 5,
      rating: art.rating,
      reviewCount: art.reviewCount,
      city: art.city,
      neighborhood: art.neighborhood,
      bio: art.bio,
      skills: art.skills || [],
      hourlyRate: art.hourlyRate,
      expectedWage: `${art.hourlyRate} دج / ساعة`,
      phone: art.phoneMasked,
      verification: art.verification,
      portfolioImages: art.portfolioImages || [],
      certificates: (art.diplomaImages || []).map((img, idx) => ({
        id: `art_cert_${idx}`,
        title: art.qualificationTitle || 'شهادة كفاءة مهنية معتمدة',
        imageUrl: img
      })),
      qualificationTitle: art.qualificationTitle || 'حرفي معتمد من المنصة',
      isJobSeeker: false,
      availabilityType: 'immediate',
      hasOwnTools: true,
      hasOwnTransport: true,
      gender: art.gender || 'male',
      status: 'available'
    }));

    return [...jobSeekerConverted, ...artisansConverted];
  }, [artisans, jobSeekers]);

  // Filter the workers based on user requirements
  const filteredWorkers = useMemo(() => {
    return combinedWorkers.filter(w => {
      // 1. Field / Domain match
      if (selectedField !== 'all') {
        if (selectedField === 'women_crafts') {
          if (w.categoryId !== 'women_crafts' && w.gender !== 'female') return false;
        } else if (w.categoryId !== selectedField) {
          return false;
        }
      }

      // 2. Only Women Crafts toggle
      if (onlyWomenCrafts && w.categoryId !== 'women_crafts' && w.gender !== 'female') {
        return false;
      }

      // 3. Wilaya match
      if (selectedWilaya !== 'all') {
        const matchesWilaya = (w.city + ' ' + w.neighborhood).includes(selectedWilaya);
        if (!matchesWilaya) return false;
      }

      // 4. Experience Years
      if (selectedMinExperience > 0 && (w.experienceYears || 0) < selectedMinExperience) {
        return false;
      }

      // 5. Rating
      if (selectedMinRating > 0 && w.rating < selectedMinRating) {
        return false;
      }

      // 6. Availability
      if (selectedAvailability !== 'all') {
        if (selectedAvailability === 'immediate' && w.availabilityType !== 'immediate') return false;
        if (selectedAvailability === 'daily' && w.availabilityType !== 'daily' && w.availabilityType !== 'immediate') return false;
        if (selectedAvailability === 'full_time' && w.availabilityType !== 'full_time' && w.availabilityType !== 'immediate') return false;
      }

      // 7. Conditions Checkboxes
      if (requireCertificate && (!w.certificates || w.certificates.length === 0) && w.verification.level < 2) {
        return false;
      }

      if (requireGuarantee && !w.verification.khodamGuaranteed) {
        return false;
      }

      if (requireTransportTools && (!w.hasOwnTools || !w.hasOwnTransport)) {
        return false;
      }

      if (requirePortfolio && (!w.portfolioImages || w.portfolioImages.length === 0)) {
        return false;
      }

      // 8. Keyword search
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const text = `${w.name} ${w.trade} ${w.bio} ${w.skills.join(' ')} ${w.city} ${w.neighborhood}`.toLowerCase();
        if (!text.includes(query)) return false;
      }

      return true;
    });
  }, [
    combinedWorkers,
    selectedField,
    onlyWomenCrafts,
    selectedWilaya,
    selectedMinExperience,
    selectedMinRating,
    selectedAvailability,
    requireCertificate,
    requireGuarantee,
    requireTransportTools,
    requirePortfolio,
    searchKeyword
  ]);

  // Handle Adding a Certificate to Form
  const handleAddCertificate = () => {
    if (!newCertTitle.trim()) return;
    const cert: JobSeekerCertificate = {
      id: `cert_${Date.now()}`,
      title: newCertTitle,
      issuer: newCertIssuer || 'معهد التكوين المهني / الغرفة الحرفية',
      imageUrl: newCertImage || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
    };
    setUploadedCertificates(prev => [...prev, cert]);
    setNewCertTitle('');
    setNewCertIssuer('');
  };

  // Quick preset certificate
  const handleAddPresetCertificate = (presetType: 'diploma' | 'vocational' | 'artisan_card') => {
    let title = 'شهادة الكفاءة المهنية المعتمدة (CAP)';
    let issuer = 'مركز التكوين المهني والتمهين';
    if (presetType === 'diploma') {
      title = 'دبلوم تقني سامي (TS) معتمد';
      issuer = 'المعهد الوطني المتخصص في التكوين المهني';
    } else if (presetType === 'artisan_card') {
      title = 'بطاقة حرفي مؤهل معتمدة';
      issuer = 'غرفة الصناعة التقليدية والحرف (CAM)';
    }
    const cert: JobSeekerCertificate = {
      id: `cert_${Date.now()}`,
      title,
      issuer,
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
    };
    setUploadedCertificates(prev => [...prev, cert]);
  };

  // Handle Adding Work Image to Form
  const handleAddPortfolioImage = (url: string) => {
    if (!url.trim()) return;
    setUploadedPortfolio(prev => [...prev, url]);
    setNewPortfolioImage('');
  };

  // Quick Preset Sample Work Images
  const handleAddPresetWorkPhotos = () => {
    const samples = [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528458876861-544fd1761a91?w=600&auto=format&fit=crop&q=80'
    ];
    setUploadedPortfolio(prev => [...prev, ...samples]);
  };

  // Submit Job Seeker Post
  const handlePublishJobSeeker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !trade.trim()) {
      alert('يرجى ملء الاسم الكامل، رقم الهاتف، وماذا تتقن!');
      return;
    }

    const skillsArray = skillsInput
      ? skillsInput.split(',').map(s => s.trim()).filter(Boolean)
      : [trade];

    addJobSeekerPost({
      name: fullName,
      phone,
      wilaya,
      city: city || 'وسط المدينة',
      trade,
      category,
      description: description || `أتقن مهنة ${trade} بخبرة ${experienceYears} سنوات، وجاهز للعمل وإنجاز مختلف الأعمال المطلوبة بجودة عالية.`,
      skills: skillsArray,
      experienceYears: Number(experienceYears),
      expectedWage: expectedWage || 'حسب الاتفاق',
      availabilityType,
      hasOwnTools,
      hasOwnTransport,
      avatar: avatarUrl,
      certificates: uploadedCertificates,
      portfolioImages: uploadedPortfolio,
      gender
    });

    setFormSuccessMessage('تم نشر ملفك المهني بنجاح! يمكنك الآن تلقي عروض العمل والاتصالات من أصحاب الخدمات.');
    setTimeout(() => {
      setFormSuccessMessage('');
      setIsFormOpen(false);
    }, 2500);

    // Reset fields
    setFullName('');
    setPhone('');
    setCity('');
    setTrade('');
    setDescription('');
    setSkillsInput('');
    setUploadedCertificates([]);
    setUploadedPortfolio([]);
  };

  const handleResetFilters = () => {
    setSelectedField('all');
    setSelectedWilaya('all');
    setSelectedMinExperience(0);
    setSelectedMinRating(0);
    setSelectedAvailability('all');
    setRequireCertificate(false);
    setRequireGuarantee(false);
    setRequireTransportTools(false);
    setRequirePortfolio(false);
    setOnlyWomenCrafts(false);
    setSearchKeyword('');
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER & TWO-WAY MODE SWITCHER                         */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-bold text-amber-300 backdrop-blur-md">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>سوق العمل والتشغيل الميداني المعتمد</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            منصة التوظيف والبحث عن عمل أو عامل في أي مجال
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            سواء كنت صاحب منزل أو مشروع وتبحث عن حرفي بشروط ومؤهلات محددة، أو كنت عاملاً أو حرفياً أو صانعة محتوى منزلي تبحثين عن عمل وتودين رفع شهاداتك ونماذج أعمالك — هذه بوابتك المباشرة بدون وسيط.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveMode('find_worker')}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-md ${
                activeMode === 'find_worker'
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-amber-500/20'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>1. البحث عن عامل وتحديد الشروط</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900/40 text-[11px] font-bold">
                {filteredWorkers.length} متاح
              </span>
            </button>

            <button
              onClick={() => setActiveMode('seek_work')}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-md ${
                activeMode === 'seek_work'
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-amber-500/20'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>2. البحث عن عمل ونشر ملفي ومؤهلاتي</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900/40 text-[11px] font-bold">
                {jobSeekers.length} باحث مسجل
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MODE 1: البحث عن عامل (FIND A WORKER & FILTER CONDITIONS)  */}
      {/* ------------------------------------------------------------- */}
      {activeMode === 'find_worker' && (
        <div className="space-y-6">
          {/* Filter Panel Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-amber-500" />
                  <span>تحديد المجال والشروط المطلوبة في العامل</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  حدد التخصص الدقيق والشروط التي تشترط توفرها (الخبرة، الشهادة، التوفر، الضمان...)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200"
                >
                  {showAdvancedFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>{showAdvancedFilters ? 'إخفاء الشروط المتقدمة' : 'المزيد من الشروط (+)'}</span>
                </button>

                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  إعادة ضبط
                </button>
              </div>
            </div>

            {/* Keyword Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-4 rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="ابحث بالاسم أو التخصص (مثل: سباك صحي، خياطة قفطان، حلويات أعراس، كهربائي، دهان BA13...)"
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl rtl:pr-11 rtl:pl-4 ltr:pl-11 ltr:pr-4 py-3 text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500"
              />
              {searchKeyword && (
                <button 
                  onClick={() => setSearchKeyword('')}
                  className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  مسح
                </button>
              )}
            </div>

            {/* 1. Field / Domain Selection (في أي مجال) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>1. اختر المجال والتخصص:</span>
                <span className="text-[11px] text-amber-600 font-bold">
                  {fieldCategories.find(c => c.id === selectedField)?.label}
                </span>
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {fieldCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedField(cat.id);
                      if (cat.id === 'women_crafts') {
                        setOnlyWomenCrafts(true);
                      }
                    }}
                    className={`p-2.5 rounded-2xl text-xs font-bold text-right transition-all border flex flex-col justify-between ${
                      selectedField === cat.id
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{cat.label}</span>
                    {cat.isFemale && (
                      <span className="text-[10px] mt-1 px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 w-fit">
                        أعمال نسائية
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Core Filters: Wilaya & Experience & Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Wilaya Filter */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>الولاية:</span>
                </label>
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-medium"
                >
                  <option value="all">جميع الولايات (الجزائر كاملة)</option>
                  {wilayas.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>سنوات الخبرة المشترطة:</span>
                </label>
                <select
                  value={selectedMinExperience}
                  onChange={(e) => setSelectedMinExperience(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-medium"
                >
                  <option value={0}>أي خبرة (الكل)</option>
                  <option value={1}>سنة فأكثر (+1 سنة)</option>
                  <option value={3}>3 سنوات فأكثر (+3 سنوات)</option>
                  <option value={5}>5 سنوات فأكثر (خبير متمكن)</option>
                  <option value={10}>10 سنوات فأكثر (معلم قديم)</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>نوع التوفر المطلوب:</span>
                </label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-medium"
                >
                  <option value="all">أي توفر (الكل)</option>
                  <option value="immediate">متوفر فوراً الآن</option>
                  <option value="daily">جاهز للعمل باليومية</option>
                  <option value="full_time">دوام كامل ومشاريع طويلة</option>
                </select>
              </div>
            </div>

            {/* 3. Conditions & Checkboxes (الشروط التي تتوفر فيه) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                الشروط والضمانات المشترطة في العامل:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-amber-50/50">
                  <input
                    type="checkbox"
                    checked={requireCertificate}
                    onChange={(e) => setRequireCertificate(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>يحمل دبلوم أو شهادة كفاءة معتمدة</span>
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-amber-50/50">
                  <input
                    type="checkbox"
                    checked={requireGuarantee}
                    onChange={(e) => setRequireGuarantee(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>يوفر ضمان مالي معتمد على الخدمة</span>
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-amber-50/50">
                  <input
                    type="checkbox"
                    checked={requireTransportTools}
                    onChange={(e) => setRequireTransportTools(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-blue-500" />
                    <span>يمتلك عتاده وسيارته الخاصة للتنقل</span>
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-amber-50/50">
                  <input
                    type="checkbox"
                    checked={requirePortfolio}
                    onChange={(e) => setRequirePortfolio(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                    <span>يتوفر على معرض صور لأعماله السابقة</span>
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-rose-50/50">
                  <input
                    type="checkbox"
                    checked={onlyWomenCrafts}
                    onChange={(e) => setOnlyWomenCrafts(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-rose-500" />
                    <span>أعمال نسائية فقط (خياطات، حلويات، طبخ)</span>
                  </span>
                </label>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-300">التقييم الأدنى:</span>
                  <div className="flex items-center gap-1">
                    {[0, 4.5, 4.8].map(r => (
                      <button
                        key={r}
                        onClick={() => setSelectedMinRating(r)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          selectedMinRating === r
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {r === 0 ? 'الكل' : `${r}★`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Counter Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-400">
                النتائج المطابقة للشروط: <span className="text-amber-600 dark:text-amber-400 font-black">{filteredWorkers.length}</span> عامل وحرفي
              </span>

              {(requireCertificate || requireGuarantee || requireTransportTools || requirePortfolio || selectedField !== 'all' || selectedWilaya !== 'all') && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>تطبيق شروط التصفية الصارمة</span>
                </span>
              )}
            </div>
          </div>

          {/* Worker Results List */}
          {filteredWorkers.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                لا توجد نتائج تطابق جميع الشروط المحددة
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                جرب تخفيف بعض الشروط (مثل تقليل سنوات الخبرة أو إزالة شرط السيارة الخاصة) لعرض عمال متاحين في هذه المنطقة.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl"
              >
                إعادة ضبط جميع الشروط
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredWorkers.map(worker => (
                <div
                  key={worker.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-amber-400 dark:hover:border-amber-600 transition-all flex flex-col justify-between space-y-4"
                >
                  {/* Top Header: Avatar, Name, Trade, Badges */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/30"
                      />
                      {worker.verification.level >= 2 && (
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow" title="مستوى 2: دبلوم موثق">
                          <Award className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                          {worker.name}
                        </h3>

                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800 text-xs font-bold shrink-0">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{worker.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                        {worker.trade}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{worker.city} • {worker.neighborhood}</span>
                        </span>

                        <span>•</span>

                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          خبرة {worker.experienceYears} سنوات
                        </span>

                        {worker.isJobSeeker && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                            باحث عن عمل متاح
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Conditions & Capabilities Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {worker.verification.khodamGuaranteed && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>ضمان خدام المالي</span>
                      </span>
                    )}

                    {worker.certificates && worker.certificates.length > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>شهادة كفاءة / دبلوم معتمد</span>
                      </span>
                    )}

                    {worker.hasOwnTransport && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        <span>سيارة نقل متوفرة</span>
                      </span>
                    )}

                    {worker.hasOwnTools && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-bold flex items-center gap-1">
                        <Wrench className="w-3 h-3" />
                        <span>عتاد احترافي كامل</span>
                      </span>
                    )}

                    {worker.expectedWage && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold">
                        الأجر: {worker.expectedWage}
                      </span>
                    )}
                  </div>

                  {/* Description: What do they offer & master */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <p className="line-clamp-3">{worker.bio}</p>
                    
                    {worker.skills && worker.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {worker.skills.slice(0, 4).map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white dark:bg-slate-800 rounded-md text-[10px] font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Uploaded Certificates & Work Photos Preview */}
                  {((worker.certificates && worker.certificates.length > 0) || (worker.portfolioImages && worker.portfolioImages.length > 0)) && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>المؤهلات ونماذج الأعمال المرفوعة:</span>
                        <span className="text-amber-600 text-[10px]">انقر لتكبير أي صورة</span>
                      </div>

                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {/* Certificates */}
                        {worker.certificates?.map((cert, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => setPreviewModalImage({ url: cert.imageUrl, title: cert.title })}
                            className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 group shadow-sm hover:opacity-90"
                            title={`شهادة: ${cert.title}`}
                          >
                            <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-amber-300">
                              <Award className="w-4 h-4" />
                            </div>
                            <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-slate-950 text-[8px] font-black text-center">
                              شهادة
                            </span>
                          </button>
                        ))}

                        {/* Portfolio Images */}
                        {worker.portfolioImages?.map((imgUrl, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => setPreviewModalImage({ url: imgUrl, title: `نموذج عمل: ${worker.name}` })}
                            className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 shadow-sm hover:opacity-90"
                            title="نموذج عمل منفذ"
                          >
                            <img src={imgUrl} alt="عمل سابق" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 flex items-center justify-center">
                              <Eye className="w-3.5 h-3.5 text-white opacity-80" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => startCall(worker.name, worker.trade, worker.avatar)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>اتصال فوري</span>
                    </button>

                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>محادثة شات</span>
                    </button>

                    <button
                      onClick={() => {
                        const artMatch = artisans.find(a => a.id === worker.id) || artisans[0];
                        setSelectedArtisanForCard(artMatch);
                        setIsProfessionalCardOpen(true);
                      }}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1"
                      title="عرض البطاقة المهنية الرسمية"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>البطاقة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. MODE 2: البحث عن عمل (SEEK WORK - FORM & COMMUNITY BOARD)   */}
      {/* ------------------------------------------------------------- */}
      {activeMode === 'seek_work' && (
        <div className="space-y-6">
          {/* Hero Prompt & Add Profile Button */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                  <Briefcase className="w-4 h-4" />
                  <span>انضم كباحث عن عمل أو اعرض خدماتك المهنية</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  سجل نفسك واعرض مهاراتك وشهاداتك ونماذج أعمالك
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  فرصة لكل صاحب حرفة، مهني، خريج تكوين مهني، أو سيدة في الخياطة والحلويات للوصول إلى آلاف الزبائن والمقاولين.
                </p>
              </div>

              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 transition-all"
              >
                {isFormOpen ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isFormOpen ? 'إغلاق نموذج التسجيل' : 'نشر ملف باحث عن عمل جديد (+)'}</span>
              </button>
            </div>

            {formSuccessMessage && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{formSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* Form to Publish Profile */}
          {isFormOpen && (
            <form onSubmit={handlePublishJobSeeker} className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-400 dark:border-amber-600 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-500" />
                  <span>استمارة تسجيل باحث عن عمل / صاحب مهارة</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  املأ بياناتك بدقة وماذا تتقن وماذا تقدم، وارفع شهاداتك وصور أعمالك ليثق بك الزبائن ويتم التواصل معك فوراً.
                </p>
              </div>

              {/* 1. Personal & Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الاسم واللقب *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: محمد العمري / الأستاذة مريم"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الهاتف للتواصل *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      dir="ltr"
                      required
                      value={phone}
                      onChange={(e) => {
                        const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
                        const val = e.target.value.replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d).toString());
                        setPhone(val);
                      }}
                      placeholder="0550 12 34 56"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white font-mono text-left"
                    />
                    <span className="absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 pointer-events-none">
                      🇩🇿 +213
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الجنس / الفئة</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        gender === 'male'
                          ? 'bg-amber-500 text-slate-950 border-amber-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      حرفي / رجل
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        gender === 'female'
                          ? 'bg-rose-500 text-white border-rose-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      حرفية / امرأة
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Wilaya & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الولاية *</label>
                  <select
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                  >
                    {wilayas.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">البلدية أو الحي</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="مثال: باب الزوار / الأبيار / عين البنيان"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* 3. Trade & Category & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ماذا تتقن؟ (المهنة أو التخصص الأساسي) *</label>
                  <input
                    type="text"
                    required
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                    placeholder="مثال: خياطة وتفصيل قفطان، سباك صحي، دهان، حلويات أعراس"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المجال الرئيسي</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                  >
                    <option value="women_crafts">أعمال وحرف النساء (خياطة، طبخ، حلويات، تطريز)</option>
                    <option value="home_repair">صيانة وإصلاحات المنازل (سباكة، كهرباء، دهان...)</option>
                    <option value="automotive_roadside">السيارات والمساعدة (ميكانيك، ديباناج)</option>
                    <option value="tech_smart_home">التقنية والتكييف والأجهزة</option>
                    <option value="cleaning_facility">النظافة والنقل والمناولة</option>
                    <option value="agriculture_env">الزراعة والبستنة</option>
                    <option value="health_personal">الرعاية الصحية والشخصية</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">سنوات الخبرة</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* 4. Detailed Description: What do you offer */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ماذا تقدم بالتفصيل؟ (تفاصيل الخدمات والقدرات التي تتقنها) *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="مثلاً: أتقن تفصيل وخياطة الكراكو والقفطان من الصفر، وتعديل فساتين السهرة... أو: أتقن تأسيس شبكات السباكة بالملتيكوش والنحاس، وكشف التسريبات، وصيانة الشوفاج سنترال..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-800 dark:text-white"
                />
              </div>

              {/* 5. Additional Skills & Wage & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المهارات والتقنيات (مفصولة بفاصلة)</label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="مثال: قص وتفصيل، ماكينة سورجي، تطريز يدوي"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الأجر أو التسعيرة المقترحة</label>
                  <input
                    type="text"
                    value={expectedWage}
                    onChange={(e) => setExpectedWage(e.target.value)}
                    placeholder="مثال: 3500 دج / يوم أو بالقطعة"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نوع التوفر للعمل</label>
                  <select
                    value={availabilityType}
                    onChange={(e) => setAvailabilityType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white"
                  >
                    <option value="immediate">جاهز للعمل فوراً</option>
                    <option value="daily">باليومية (جورنيات)</option>
                    <option value="full_time">دوام كامل (ورشة / مؤسسة)</option>
                    <option value="part_time">دوام جزئي / مسائي</option>
                    <option value="project">حسب المشروع أو الورشة</option>
                  </select>
                </div>
              </div>

              {/* 6. Tools & Transport Toggles */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={hasOwnTools}
                    onChange={(e) => setHasOwnTools(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>أمتلك عتادي ومعداتي الخاصة للعمل</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={hasOwnTransport}
                    onChange={(e) => setHasOwnTransport(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>أمتلك سيارة خاصة للتنقل ونقل العتاد</span>
                </label>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 7. UPLOAD QUALIFICATIONS & CERTIFICATES (رفع المؤهلات والشهادات) */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl p-4 sm:p-5 border border-amber-200 dark:border-amber-800/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>رفع المؤهلات والشهادات (دبلوم، كفاءة، شهادة خبرة)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      رفع شهاداتك يزيد فرصة توظيفك بنسبة 85% ويمنحك علامة "حرفي معتمد".
                    </p>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500">إضافة سريعة:</span>
                    <button
                      type="button"
                      onClick={() => handleAddPresetCertificate('diploma')}
                      className="px-2 py-1 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[10px] font-bold"
                    >
                      + دبلوم تقني سامي
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPresetCertificate('vocational')}
                      className="px-2 py-1 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[10px] font-bold"
                    >
                      + شهادة CAP
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPresetCertificate('artisan_card')}
                      className="px-2 py-1 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[10px] font-bold"
                    >
                      + بطاقة حرفي
                    </button>
                  </div>
                </div>

                {/* Manual certificate add input */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newCertTitle}
                    onChange={(e) => setNewCertTitle(e.target.value)}
                    placeholder="عنوان الشهادة (مثل: دبلوم خياطة، شهادة سباكة)"
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    value={newCertIssuer}
                    onChange={(e) => setNewCertIssuer(e.target.value)}
                    placeholder="الجهة المانحة (مثل: معهد التكوين المهني)"
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCertificate}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إرفاق الشهادة</span>
                  </button>
                </div>

                {/* Uploaded Certificate Items */}
                {uploadedCertificates.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {uploadedCertificates.map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 shadow-sm">
                        <div className="flex items-center gap-2">
                          <img src={c.imageUrl} alt={c.title} className="w-9 h-9 rounded-lg object-cover border border-amber-400" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{c.title}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{c.issuer || 'معتمدة'}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedCertificates(prev => prev.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 8. UPLOAD WORK PHOTOS / PORTFOLIO (رفع صور نماذج الأعمال)      */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-500" />
                      <span>رفع صور نماذج أعمالك ومشاريعك السابقة</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      أرفق صوراً واضحة لأشغال أنجزتها (فساتين، صواني حلويات، حمامات، لوحات كهرباء، جدران مدهونة...)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddPresetWorkPhotos}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold self-start"
                  >
                    + إضافة صور نموذجية تجريبية
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPortfolioImage}
                    onChange={(e) => setNewPortfolioImage(e.target.value)}
                    placeholder="أدخل رابط صورة العمل (أو استخدم الزر أعلاه لإضافة نماذج)"
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddPortfolioImage(newPortfolioImage)}
                    className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>إضافة</span>
                  </button>
                </div>

                {/* Uploaded Portfolio Thumbnails */}
                {uploadedPortfolio.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {uploadedPortfolio.map((url, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 group shadow-sm">
                        <img src={url} alt="عمل سابق" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedPortfolio(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 left-1 bg-rose-600 text-white p-1 rounded-full shadow hover:bg-rose-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>نشر ملفي والبدء في تلقي عروض العمل</span>
                </button>
              </div>
            </form>
          )}

          {/* Community List of Job Seekers (سجل الباحثين عن عمل) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  سجل الباحثين عن عمل والمهنيين المتاحين للتوظيف
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  تصفح ملفات أصحاب المهن والنساء المبدعات، وشاهد مؤهلاتهم وصور أعمالهم وتواصل معهم مباشرة.
                </p>
              </div>

              <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold">
                إجمالي الملفات: {jobSeekers.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobSeekers.map(js => (
                <div
                  key={js.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={js.avatar}
                          alt={js.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/30"
                        />
                        <div>
                          <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                            {js.name}
                          </h4>
                          <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            {js.trade}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{js.wilaya} • {js.city}</span>
                            <span>•</span>
                            <span>خبرة {js.experienceYears} سنوات</span>
                          </p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold shrink-0">
                        متاح للعمل
                      </span>
                    </div>

                    {/* Description: What do they offer */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                      <p>{js.description}</p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {js.skills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white dark:bg-slate-800 rounded-md text-[10px] font-medium border border-slate-200 dark:border-slate-700">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Expected Wage & Transport badges */}
                    <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold border border-amber-200 dark:border-amber-800">
                        الأجر المطلوب: {js.expectedWage}
                      </span>

                      {js.hasOwnTools && (
                        <span className="px-2 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                          <Wrench className="w-3 h-3" />
                          <span>العتاد متوفر</span>
                        </span>
                      )}

                      {js.hasOwnTransport && (
                        <span className="px-2 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                          <Car className="w-3 h-3" />
                          <span>سيارة متوفرة</span>
                        </span>
                      )}
                    </div>

                    {/* Certificates & Work photos */}
                    {((js.certificates && js.certificates.length > 0) || (js.portfolioImages && js.portfolioImages.length > 0)) && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                          <span>الشهادات ونماذج الأعمال:</span>
                          <span className="text-amber-600">اضغط للمعاينة</span>
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {js.certificates?.map((cert, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => setPreviewModalImage({ url: cert.imageUrl, title: cert.title })}
                              className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-500 shrink-0 shadow-sm"
                              title={cert.title}
                            >
                              <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-amber-300">
                                <Award className="w-3.5 h-3.5" />
                              </div>
                            </button>
                          ))}

                          {js.portfolioImages?.map((pImg, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => setPreviewModalImage({ url: pImg, title: `عمل سابق: ${js.name}` })}
                              className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 shrink-0 shadow-sm"
                            >
                              <img src={pImg} alt="عمل" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions: Call & Chat & Delete */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => startCall(js.name, js.trade, js.avatar)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>اتصال ({js.phone})</span>
                    </button>

                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>محادثة شات</span>
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteJobSeekerPost(js.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="حذف هذا الإعلان"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. LIGHTBOX MODAL: FULL IMAGE & CERTIFICATE PREVIEW           */}
      {/* ------------------------------------------------------------- */}
      {previewModalImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewModalImage(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{previewModalImage.title}</span>
              </h3>
              <button
                onClick={() => setPreviewModalImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-hidden rounded-2xl bg-black/5 dark:bg-black/40 flex items-center justify-center">
              <img
                src={previewModalImage.url}
                alt={previewModalImage.title}
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>شهادة ومؤهلات موثقة عبر منصة خدام</span>
              <button
                onClick={() => setPreviewModalImage(null)}
                className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
