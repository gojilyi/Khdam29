import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Check, 
  Upload, 
  Image as ImageIcon, 
  RotateCcw, 
  Sparkles, 
  Search, 
  Layers, 
  Wrench, 
  Droplets, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Key, 
  Flame, 
  Truck, 
  Scissors, 
  Cpu, 
  Car, 
  TreePine, 
  Heart, 
  UtensilsCrossed, 
  Camera, 
  Star, 
  ShieldCheck, 
  Smile, 
  Briefcase, 
  Users, 
  Smartphone, 
  Radio, 
  Tv, 
  Disc, 
  BatteryCharging, 
  Stethoscope, 
  BrickWall, 
  Cake, 
  Soup,
  Code,
  FileCode,
  ExternalLink,
  Folder,
  Palette
} from 'lucide-react';
import { AppIconRenderer } from './AppIconRenderer';

export const AdminQuickSwapModal: React.FC = () => {
  const { 
    isAdminAuthenticated, 
    adminEditModalTarget, 
    setAdminEditModalTarget,
    isMediaManagerModalOpen,
    setIsMediaManagerModalOpen,
    categories,
    updateCategory,
    updateCategoryIcon,
    updateSubServiceImage,
    updateCategoryHeroImage,
    updateArtisanAvatar,
    billboardConfig,
    setBillboardConfig,
    squareSpotlightConfig,
    setSquareSpotlightConfig,
    setAdminCustomText,
    resetAdminCustomTexts,
    adminCustomIcons,
    setAdminCustomIcon,
    resetAdminCustomIcons,
    artisans
  } = useApp();

  // Local state for text edit
  const [textVal, setTextVal] = useState('');
  
  // Local state for image swap
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

  // Icon Source Tab & Upload State
  const [iconSourceTab, setIconSourceTab] = useState<'library' | 'upload' | 'url_svg' | 'emojis'>('library');
  const [uploadedIconData, setUploadedIconData] = useState<string>('');
  const [iconUrlOrSvg, setIconUrlOrSvg] = useState<string>('');
  const [iconFilterCat, setIconFilterCat] = useState<string>('all');
  const [isIconDraggingOver, setIsIconDraggingOver] = useState(false);

  // Bulk media manager tab filter
  const [bulkFilter, setBulkFilter] = useState<'all' | 'categories' | 'subServices' | 'hero' | 'artisans'>('all');

  // Sync initial values when modal opens
  React.useEffect(() => {
    if (adminEditModalTarget) {
      if (adminEditModalTarget.type === 'text') {
        setTextVal(adminEditModalTarget.currentValue || '');
      } else if (adminEditModalTarget.type === 'image') {
        setCustomImageUrl(adminEditModalTarget.currentValue || '');
      }
    }
  }, [adminEditModalTarget]);

  if (!isAdminAuthenticated) return null;
  if (!adminEditModalTarget && !isMediaManagerModalOpen) return null;

  // Available Icon catalog
  const availableIcons = [
    { name: 'Wrench', label: 'سباكة ومفتاح', component: Wrench },
    { name: 'Droplets', label: 'تسريب ومياه', component: Droplets },
    { name: 'Zap', label: 'كهرباء وطاقة', component: Zap },
    { name: 'Hammer', label: 'نجارة ومطرقة', component: Hammer },
    { name: 'BrickWall', label: 'بناء وسيراميك', component: BrickWall },
    { name: 'Paintbrush', label: 'دهان وديكور', component: Paintbrush },
    { name: 'Key', label: 'أقفال ومفاتيح', component: Key },
    { name: 'Flame', label: 'حدادة ولحام', component: Flame },
    { name: 'Truck', label: 'نقل وترحيل', component: Truck },
    { name: 'Scissors', label: 'خياطة وتفصيل', component: Scissors },
    { name: 'Cake', label: 'حلويات ومخبوزات', component: Cake },
    { name: 'Soup', label: 'طبخ وولائم', component: Soup },
    { name: 'Car', label: 'ميكانيك وسيارات', component: Car },
    { name: 'Cpu', label: 'تقنية وأجهزة', component: Cpu },
    { name: 'Tv', label: 'شاشات وكهرومنزلي', component: Tv },
    { name: 'Radio', label: 'أطباق وبارابول', component: Radio },
    { name: 'Sparkles', label: 'نظافة ولمعان', component: Sparkles },
    { name: 'TreePine', label: 'بستنة وحدائق', component: TreePine },
    { name: 'Heart', label: 'رعاية وتمريض', component: Heart },
    { name: 'Stethoscope', label: 'صحة وإسعاف', component: Stethoscope },
    { name: 'Briefcase', label: 'عمل وتوظيف', component: Briefcase },
    { name: 'Users', label: 'حرفيين وفريق', component: Users },
    { name: 'ShieldCheck', label: 'ضمان وأمان', component: ShieldCheck },
    { name: 'Star', label: 'تقييم وتميز', component: Star },
    { name: 'Smartphone', label: 'هواتف ذكية', component: Smartphone },
    { name: 'BatteryCharging', label: 'بطاريات شحن', component: BatteryCharging },
    { name: 'Disc', label: 'عجلات وإطارات', component: Disc }
  ];

  // High quality curated presets for instant swap
  const presetImages = [
    { title: 'سباكة وأنابيب حديثة', url: '/src/assets/images/home_plumbing_service_1791156501756.jpg' },
    { title: 'كهرباء ولوحات توزيع', url: '/src/assets/images/electrical_modern_service_1791156512564.jpg' },
    { title: 'حرفي خبير معتمد', url: '/src/assets/images/khodam_hero_craftsman_1791156490478.jpg' },
    { title: 'نجارة خشب وأثاث', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80' },
    { title: 'بناء وسيراميك وترميم', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=80' },
    { title: 'دهان وجبس بورد BA13', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80' },
    { title: 'خياطة وتفصيل قفطان وكراكو', url: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?w=600&auto=format&fit=crop&q=80' },
    { title: 'حلويات تقليدية للأعراس', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80' },
    { title: 'طبخ ولائم ومأكولات جزائرية', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80' },
    { title: 'ميكانيك وسحب سيارات', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80' },
    { title: 'تنظيف عميق وترحيل', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80' },
    { title: 'بستنة ومساحات خضراء', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80' },
    { title: 'تمريض ورعاية صحية', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80' },
    { title: 'تقنية ومنازل ذكية', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80' }
  ];

  // Handle file drop or selection
  const handleImageFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        const dataUrl = e.target.result;
        setCustomImageUrl(dataUrl);
        applyImageReplacement(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const applyImageReplacement = (newUrl: string) => {
    if (!adminEditModalTarget || adminEditModalTarget.type !== 'image') return;
    const { id, categoryId, subServiceId } = adminEditModalTarget;

    if (id === 'billboard') {
      setBillboardConfig(prev => ({ ...prev, mediaUrl: newUrl }));
    } else if (id === 'square5x5') {
      setSquareSpotlightConfig(prev => ({ ...prev, mediaUrl: newUrl }));
    } else if (subServiceId && categoryId) {
      updateSubServiceImage(categoryId, subServiceId, newUrl);
    } else if (categoryId) {
      updateCategoryHeroImage(categoryId, newUrl);
    } else if (id.startsWith('art_')) {
      updateArtisanAvatar(id, newUrl);
    }

    setAdminEditModalTarget(null);
  };

  const handleSaveText = () => {
    if (!adminEditModalTarget || adminEditModalTarget.type !== 'text') return;
    setAdminCustomText(adminEditModalTarget.id, textVal);
    if (adminEditModalTarget.currentValue && adminEditModalTarget.currentValue !== adminEditModalTarget.id) {
      setAdminCustomText(adminEditModalTarget.currentValue, textVal);
    }
    if ((window as any).__lastDoubleClickedElement) {
      try {
        (window as any).__lastDoubleClickedElement.textContent = textVal;
      } catch (e) {
        console.log('Direct DOM update', e);
      }
    }
    setAdminEditModalTarget(null);
  };

  const handleIconFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        const dataUrl = e.target.result;
        setUploadedIconData(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectIcon = (iconValue: string) => {
    if (!adminEditModalTarget || adminEditModalTarget.type !== 'icon') return;
    if (adminEditModalTarget.categoryId) {
      updateCategoryIcon(adminEditModalTarget.categoryId, iconValue);
    }
    if (adminEditModalTarget.id) {
      setAdminCustomIcon(adminEditModalTarget.id, iconValue);
    }
    setAdminEditModalTarget(null);
  };

  // -------------------------------------------------------------------
  // RENDER BULK IMAGE MANAGER MODAL ("تبديل جميع الصور")
  // -------------------------------------------------------------------
  if (isMediaManagerModalOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  مركز تحكم وتبديل جميع صور المنصة
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  يمكنك استبدال أي صورة، أو رفع صورة من جهازك، أو اختيار صور جاهزة بنقرة واحدة.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMediaManagerModalOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 bg-slate-50/50 dark:bg-slate-850">
            {[
              { id: 'all', label: 'جميع الصور' },
              { id: 'categories', label: `صور الفئات الرئيسية (${categories.length})` },
              { id: 'subServices', label: 'صور الخدمات الفرعية' },
              { id: 'hero', label: 'اللافتة الكبرى (Billboard)' },
              { id: 'artisans', label: `صور الحرفيين (${artisans.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setBulkFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  bulkFilter === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid of Images to replace */}
          <div className="p-5 overflow-y-auto flex-1 space-y-6">
            {/* Category Images */}
            {(bulkFilter === 'all' || bulkFilter === 'categories') && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  صور الفئات الرئيسية (Categories)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map(cat => (
                    <div key={cat.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5">
                      <div className="relative aspect-video rounded-xl overflow-hidden group">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => {
                              setAdminEditModalTarget({
                                type: 'image',
                                id: cat.id,
                                title: `صورة فئة: ${cat.name}`,
                                currentValue: cat.image,
                                categoryId: cat.id
                              });
                            }}
                            className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow-md"
                          >
                            استبدال الصورة
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{cat.name}</span>
                        <button
                          onClick={() => {
                            setAdminEditModalTarget({
                              type: 'image',
                              id: cat.id,
                              title: `صورة فئة: ${cat.name}`,
                              currentValue: cat.image,
                              categoryId: cat.id
                            });
                          }}
                          className="text-[11px] font-bold text-amber-600 hover:underline"
                        >
                          تعديل
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SubServices Images */}
            {(bulkFilter === 'all' || bulkFilter === 'subServices') && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  صور الخدمات الفرعية (Sub-Services)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {categories.flatMap(c => c.subServices.map(s => ({ ...s, catId: c.id }))).slice(0, 16).map(sub => (
                    <div key={sub.id} className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="relative aspect-square rounded-xl overflow-hidden group">
                        <img src={sub.image || categories[0].image} alt={sub.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => {
                              setAdminEditModalTarget({
                                type: 'image',
                                id: sub.id,
                                title: `خدمة: ${sub.name}`,
                                currentValue: sub.image || '',
                                categoryId: sub.catId,
                                subServiceId: sub.id
                              });
                            }}
                            className="px-2 py-1 bg-amber-500 text-slate-950 rounded-lg text-[10px] font-bold"
                          >
                            استبدال
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{sub.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Billboard Hero */}
            {(bulkFilter === 'all' || bulkFilter === 'hero') && (
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 space-y-3">
                <h4 className="text-xs font-black text-amber-800 dark:text-amber-300">
                  صورة لافتة الهيرو الترويجية (Billboard Hero)
                </h4>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img src={billboardConfig.mediaUrl} alt="Billboard" className="w-48 h-28 object-cover rounded-xl border border-amber-400 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{billboardConfig.title}</p>
                    <button
                      onClick={() => {
                        setAdminEditModalTarget({
                          type: 'image',
                          id: 'billboard',
                          title: 'صورة اللافتة الكبرى (Billboard)',
                          currentValue: billboardConfig.mediaUrl
                        });
                      }}
                      className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow-sm"
                    >
                      استبدال صورة الهيرو
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // RENDER TARGETED EDIT MODAL (Text, Icon, or Single Image Swap)
  // -------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                تعديل مباشر من المشرف ({adminEditModalTarget?.type === 'text' ? 'نص' : adminEditModalTarget?.type === 'icon' ? 'أيقونة' : 'صورة'})
              </h3>
              <p className="text-[11px] text-slate-500">{adminEditModalTarget?.title}</p>
            </div>
          </div>
          <button
            onClick={() => setAdminEditModalTarget(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. TEXT EDIT MODE */}
        {adminEditModalTarget?.type === 'text' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                أدخل النص الجديد:
              </label>
              <textarea
                rows={4}
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                placeholder="اكتب النص البديل هنا..."
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setTextVal(adminEditModalTarget.currentValue);
                  setAdminCustomText(adminEditModalTarget.id, adminEditModalTarget.currentValue);
                }}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة الأصلي</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdminEditModalTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSaveText}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ النص الآن</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. ICON EDIT MODE */}
        {adminEditModalTarget?.type === 'icon' && (
          <div className="space-y-4">
            {/* Current Active Icon Header Banner */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center p-2 shadow-sm shrink-0">
                  <AppIconRenderer icon={adminEditModalTarget.currentValue} className="w-6 h-6 text-slate-950 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block">الأيقونة الحالية:</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                    {adminEditModalTarget.currentValue || 'Wrench'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectIcon('Wrench')}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors"
                title="استعادة الأيقونة الافتراضية"
              >
                <RotateCcw className="w-3 h-3" />
                <span>الافتراضية</span>
              </button>
            </div>

            {/* Source Selection Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setIconSourceTab('library')}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  iconSourceTab === 'library'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span className="truncate">المكتبة</span>
              </button>

              <button
                type="button"
                onClick={() => setIconSourceTab('upload')}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  iconSourceTab === 'upload'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="truncate">رفع أيقونة</span>
              </button>

              <button
                type="button"
                onClick={() => setIconSourceTab('url_svg')}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  iconSourceTab === 'url_svg'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span className="truncate">SVG / رابط</span>
              </button>

              <button
                type="button"
                onClick={() => setIconSourceTab('emojis')}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
                  iconSourceTab === 'emojis'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="truncate">رموز تعبيرية</span>
              </button>
            </div>

            {/* TAB 1: LIBRARY OF ICONS */}
            {iconSourceTab === 'library' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ابحث عن أيقونة (سباكة، كهرباء، خياطة، بناء...)"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl rtl:pr-9 rtl:pl-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-56 overflow-y-auto p-1 scrollbar-thin">
                  {availableIcons
                    .filter(ic => !iconSearch || ic.label.includes(iconSearch) || ic.name.toLowerCase().includes(iconSearch.toLowerCase()))
                    .map(ic => {
                      const IconComp = ic.component;
                      const isSelected = adminEditModalTarget.currentValue === ic.name;
                      return (
                        <button
                          key={ic.name}
                          type="button"
                          onClick={() => handleSelectIcon(ic.name)}
                          className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 group text-center cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-400'
                              : 'bg-slate-50 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 border-slate-200 dark:border-slate-700'
                          }`}
                          title={ic.label}
                        >
                          <IconComp className={`w-6 h-6 transition-transform group-hover:scale-110 ${isSelected ? 'text-slate-950' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-950'}`} />
                          <span className="text-[10px] font-bold truncate max-w-full">{ic.label.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* TAB 2: UPLOAD CUSTOM ICON FILE (SVG, PNG, WEBP, ICO) */}
            {iconSourceTab === 'upload' && (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsIconDraggingOver(true);
                  }}
                  onDragLeave={() => setIsIconDraggingOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsIconDraggingOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleIconFile(file);
                  }}
                  onClick={() => document.getElementById('admin-icon-uploader-input')?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                    isIconDraggingOver
                      ? 'border-amber-500 bg-amber-500/10 scale-[1.02]'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-amber-400'
                  }`}
                >
                  <input
                    id="admin-icon-uploader-input"
                    type="file"
                    accept=".svg,.png,.webp,.ico,.jpg,.jpeg,image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleIconFile(file);
                    }}
                  />
                  <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800 dark:text-white">
                    اضغط هنا لرفع ملف الأيقونة من جهازك، أو اسحبه وأفلته
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    يدعم ملفات الفيكتور SVG وصور PNG الشفافة و WebP و ICO
                  </p>
                </div>

                {/* Upload Preview & Apply */}
                {uploadedIconData ? (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      معاينة الأيقونة المرفوعة:
                    </span>
                    <div className="flex items-center justify-center gap-6 p-3 bg-slate-100 dark:bg-slate-900 rounded-xl">
                      {/* Light background preview */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-300 shadow-sm flex items-center justify-center p-2.5">
                          <AppIconRenderer icon={uploadedIconData} className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] text-slate-500">خلفية فاتحة</span>
                      </div>

                      {/* Dark background preview */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-700 shadow-sm flex items-center justify-center p-2.5">
                          <AppIconRenderer icon={uploadedIconData} className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] text-slate-500">خلفية داكنة</span>
                      </div>

                      {/* Badge preview */}
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 shadow-sm flex items-center justify-center p-2.5">
                          <AppIconRenderer icon={uploadedIconData} className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] text-slate-500">شارة الحرفة</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setUploadedIconData('')}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-rose-500"
                      >
                        إلغاء الملف
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectIcon(uploadedIconData)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md hover:from-amber-600 hover:to-amber-700 transition-transform active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        <span>تطبيق وحفظ هذه الأيقونة المرفوعة</span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* TAB 3: URL OR RAW SVG CODE */}
            {iconSourceTab === 'url_svg' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-amber-500" />
                    <span>ألصق كود SVG فيكتور، أو رابط صورة أيقونة (URL):</span>
                  </label>
                  <textarea
                    rows={4}
                    value={iconUrlOrSvg}
                    onChange={(e) => setIconUrlOrSvg(e.target.value)}
                    placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ...> أو https://example.com/icon.svg'
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-800 dark:text-white"
                  />
                </div>

                {iconUrlOrSvg.trim() && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center p-2">
                        <AppIconRenderer icon={iconUrlOrSvg} className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">معاينة الكود المكتوب</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectIcon(iconUrlOrSvg)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>تطبيق كود SVG</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TRADE EMOJIS */}
            {iconSourceTab === 'emojis' && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  اختر رمزاً تعبيرياً معبراً عن الحرفة بنقرة واحدة:
                </span>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-56 overflow-y-auto p-1">
                  {[
                    '🛠️', '⚡', '🪚', '🪛', '🧱', '🎨', '🚿', '🚗', 
                    '🛞', '🚚', '🔑', '🍰', '🍲', '🧵', '🧹', '🪴', 
                    '🩺', '💻', '📱', '📡', '📺', '📦', '🏗️', '⭐',
                    '🛡️', '🔨', '🪓', '🔧', '⚙️', '💎', '💡', '🚪'
                  ].map((emojiChar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectIcon(emojiChar)}
                      className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-amber-500 border border-slate-200 dark:border-slate-700 hover:border-amber-600 transition-all flex items-center justify-center text-2xl cursor-pointer group active:scale-95"
                    >
                      <span className="group-hover:scale-125 transition-transform">{emojiChar}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. IMAGE SWAP MODE (Drag & Drop or Preset Selection) */}
        {adminEditModalTarget?.type === 'image' && (
          <div className="space-y-4">
            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleImageFile(file);
              }}
              className={`p-5 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                isDraggingOver
                  ? 'border-amber-500 bg-amber-500/10 scale-[1.02]'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-amber-400'
              }`}
              onClick={() => document.getElementById('admin-file-picker')?.click()}
            >
              <input
                id="admin-file-picker"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file);
                }}
              />
              <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                اسحب صورة جديدة وأفلتها هنا، أو اضغط لاختيار ملف من جهازك
              </p>
              <p className="text-[10px] text-slate-400 mt-1">يدعم JPG و PNG و WebP بدقة عالية</p>
            </div>

            {/* Custom URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">أو أدخل رابط الصورة (URL):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => applyImageReplacement(customImageUrl)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl"
                >
                  تطبيق
                </button>
              </div>
            </div>

            {/* Preset Library for 1-Click Swap */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                أو اختر صورة جاهزة بنقرة واحدة:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {presetImages.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyImageReplacement(p.url)}
                    className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 group shadow-sm transition-transform active:scale-95"
                    title={p.title}
                  >
                    <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
