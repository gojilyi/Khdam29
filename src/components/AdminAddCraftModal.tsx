import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory, SubService } from '../types';
import { 
  X, 
  Upload, 
  ImageIcon, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  Wrench, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Scissors, 
  Cake, 
  Soup, 
  Car, 
  Key, 
  Truck, 
  BrickWall, 
  Heart, 
  Flame, 
  Radio, 
  Cpu, 
  TreePine, 
  ShieldCheck, 
  Star,
  Eye,
  Layers,
  Search
} from 'lucide-react';

export const AdminAddCraftModal: React.FC = () => {
  const { 
    isAdminAuthenticated, 
    isAddCraftModalOpen, 
    setIsAddCraftModalOpen, 
    addCategory 
  } = useApp();

  // Craft main details
  const [name, setName] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Wrench');
  const [accentColor, setAccentColor] = useState('amber');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80');
  
  // Icon search & selection
  const [iconSearch, setIconSearch] = useState('');

  // Sub-services state
  const [subServices, setSubServices] = useState<Array<{
    id: string;
    name: string;
    nameFr: string;
    nameEn: string;
    description: string;
    estimatedPrice: string;
    iconName: string;
    image: string;
  }>>([
    {
      id: `sub_${Date.now()}_1`,
      name: '',
      nameFr: '',
      nameEn: '',
      description: '',
      estimatedPrice: '3000 - 8000 دج',
      iconName: 'Wrench',
      image: ''
    }
  ]);

  // Success notification
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Curated Preset Craft Photos Gallery for rapid selection
  const presetCraftPhotos = [
    {
      title: 'خياطة وتفصيل أزياء',
      category: 'خياطة',
      url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'حلويات تقليدية وعصرية',
      category: 'حلويات',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'طبخ وولائم ومناسبات',
      category: 'طبخ',
      url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'سباكة وتصليح تسريبات',
      category: 'سباكة',
      url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'كهرباء وتمديدات ذكية',
      category: 'كهرباء',
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'دهان وديكورات وجبس',
      category: 'دهان',
      url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'حدادة ولحام وأبواب ألمنيوم',
      category: 'حدادة',
      url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'نجارة وأثاث خشبي راقٍ',
      category: 'نجارة',
      url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'تبريد وتصليح مكيفات',
      category: 'تبريد',
      url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'ميكانيك وصيانة سيارات',
      category: 'سيارات',
      url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'بناء وسيراميك وترميم',
      category: 'بناء',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'نظافة وتطهير شامل',
      category: 'نظافة',
      url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'نقل أثاث وترحيل',
      category: 'نقل',
      url: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'أقفال وأبواب أمان',
      category: 'أقفال',
      url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80'
    },
    {
      title: 'بستنة وحدائق منزلية',
      category: 'حدائق',
      url: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=800&auto=format&fit=crop&q=80'
    }
  ];

  // Available icon list
  const availableIcons = [
    { name: 'Wrench', label: 'سباكة', component: Wrench },
    { name: 'Zap', label: 'كهرباء', component: Zap },
    { name: 'Hammer', label: 'نجارة', component: Hammer },
    { name: 'Scissors', label: 'خياطة', component: Scissors },
    { name: 'Cake', label: 'حلويات', component: Cake },
    { name: 'Soup', label: 'طبخ', component: Soup },
    { name: 'Paintbrush', label: 'دهان', component: Paintbrush },
    { name: 'Flame', label: 'حدادة', component: Flame },
    { name: 'BrickWall', label: 'بناء', component: BrickWall },
    { name: 'Car', label: 'سيارات', component: Car },
    { name: 'Truck', label: 'نقل', component: Truck },
    { name: 'Key', label: 'أقفال', component: Key },
    { name: 'Sparkles', label: 'نظافة', component: Sparkles },
    { name: 'TreePine', label: 'حدائق', component: TreePine },
    { name: 'Cpu', label: 'إلكترونيات', component: Cpu },
    { name: 'Radio', label: 'بارابول', component: Radio },
    { name: 'Heart', label: 'رعاية', component: Heart },
    { name: 'ShieldCheck', label: 'حماية', component: ShieldCheck },
    { name: 'Star', label: 'خدمات خاصة', component: Star }
  ];

  if (!isAdminAuthenticated || !isAddCraftModalOpen) return null;

  // Handle local image file upload for main craft
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (typeof loadEvt.target?.result === 'string') {
          setImage(loadEvt.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local image file upload for a sub-service
  const handleSubServiceImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (typeof loadEvt.target?.result === 'string') {
          const updated = [...subServices];
          updated[index].image = loadEvt.target.result;
          setSubServices(updated);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new sub-service row
  const handleAddSubService = () => {
    setSubServices(prev => [
      ...prev,
      {
        id: `sub_${Date.now()}_${prev.length + 1}`,
        name: '',
        nameFr: '',
        nameEn: '',
        description: '',
        estimatedPrice: '2500 - 6000 دج',
        iconName: icon,
        image: image
      }
    ]);
  };

  // Remove a sub-service row
  const handleRemoveSubService = (index: number) => {
    if (subServices.length <= 1) return;
    setSubServices(prev => prev.filter((_, i) => i !== index));
  };

  // Update a sub-service field
  const handleUpdateSubService = (index: number, field: string, value: string) => {
    const updated = [...subServices];
    (updated[index] as any)[field] = value;
    setSubServices(updated);
  };

  // Submit and create new craft
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const craftId = `craft_${Date.now()}`;

    // Prepare sub-services (fallback to main craft image if empty)
    const formattedSubServices: SubService[] = subServices.map((sub, idx) => ({
      id: sub.id || `sub_${Date.now()}_${idx}`,
      name: sub.name.trim() || name.trim(),
      nameFr: sub.nameFr.trim() || nameFr.trim() || name.trim(),
      nameEn: sub.nameEn.trim() || nameEn.trim() || name.trim(),
      description: sub.description.trim() || description.trim() || 'خدمة احترافية معتمدة',
      estimatedPrice: sub.estimatedPrice.trim() || '2500 - 6000 دج',
      iconName: icon,
      image: sub.image || image
    }));

    const newCraft: ServiceCategory = {
      id: craftId,
      name: name.trim(),
      nameFr: nameFr.trim() || name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      description: description.trim() || 'خدمات وحرف مهنية متخصصة ومضمونة',
      icon: icon,
      image: image,
      accentColor: accentColor,
      subServices: formattedSubServices
    };

    addCategory(newCraft);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsAddCraftModalOpen(false);
      // Reset form
      setName('');
      setNameFr('');
      setNameEn('');
      setDescription('');
      setIcon('Wrench');
      setSubServices([
        {
          id: `sub_${Date.now()}_1`,
          name: '',
          nameFr: '',
          nameEn: '',
          description: '',
          estimatedPrice: '3000 - 8000 دج',
          iconName: 'Wrench',
          image: ''
        }
      ]);
    }, 1200);
  };

  // Get current selected icon component
  const CurrentIconComponent = availableIcons.find(i => i.name === icon)?.component || Wrench;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150 my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-slate-50 to-amber-500/10 dark:from-amber-950/20 dark:via-slate-850 dark:to-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  إضافة حرفة / خدمة جديدة مع صورها
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  لوحة المشرف
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                أدخل تفاصيل الحرفة، اختر أيقونتها، وارفع صورتها وصور الخدمات الفرعية التابعة لها لتظهر فوراً لجميع الزبائن.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddCraftModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {savedSuccess && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
              <Check className="w-5 h-5 text-emerald-500" />
              <span>تمت إضافة الحرفة وصورها بنجاح! تظهر الآن في الصفحة الرئيسية وسوق العمل.</span>
            </div>
          )}

          {/* SECTION 1: Craft Main Names & Description */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>1. البيانات الأساسية للحرفة</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  اسم الحرفة بالعربية <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: خياطة وقفاطين، صيانة مصاعد..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  الاسم بالفرنسية (Nom):
                </label>
                <input
                  type="text"
                  value={nameFr}
                  onChange={(e) => setNameFr(e.target.value)}
                  placeholder="Couture & Caftans..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  الاسم بالإنجليزية (Name):
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Tailoring & Caftans..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                وصف الحرفة ومجال خدماتها:
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اشرح باختصار ما يقدمه الحرفيون في هذا المجال (مثال: تفصيل وتعديل القفطان الجزائري، كاراكو، بدعيات، تصليح ملابس بجودة واحترافية عالية)..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* SECTION 2: Craft Icon Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>2. أيقونة الحرفة ولونها المميز</span>
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">الأيقونة المختارة:</span>
                <span className="px-2 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1">
                  <CurrentIconComponent className="w-3.5 h-3.5" />
                  <span>{availableIcons.find(i => i.name === icon)?.label || icon}</span>
                </span>
              </div>
            </div>

            {/* Icon filter search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="ابحث عن أيقونة (خياطة، حلويات، طبخ، سباكة، سيارات، كهرباء...)"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl rtl:pr-8 rtl:pl-3 py-1.5 text-xs text-slate-900 dark:text-white"
              />
            </div>

            {/* Icon buttons grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
              {availableIcons
                .filter(ic => !iconSearch || ic.label.includes(iconSearch) || ic.name.toLowerCase().includes(iconSearch.toLowerCase()))
                .map(ic => {
                  const IconComp = ic.component;
                  const isSelected = icon === ic.name;
                  return (
                    <button
                      key={ic.name}
                      type="button"
                      onClick={() => setIcon(ic.name)}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span className="text-[10px] truncate max-w-full">{ic.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* SECTION 3: Craft Main Cover Photo (صورة الحرفة الرئيسية) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span>3. صورة الحرفة الرئيسية (الصورة المعروضة للزبائن)</span>
            </h4>

            {/* Photo Choice Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {/* 1. Upload from Device */}
                <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-amber-500" />
                      <span>رفع صورة من هاتفك أو جهازك:</span>
                    </span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, WebP</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="w-full text-xs text-slate-500 file:mr-0 file:ml-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-600 cursor-pointer"
                  />
                </div>

                {/* 2. Direct Image URL */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    أو كتابة رابط صورة مباشر (URL):
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Photo Live Preview Box */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                  <span>معاينة صورة الحرفة:</span>
                </span>
                <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-md group">
                  <img
                    src={image}
                    alt={name || 'معاينة صورة الحرفة'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                    <div className="text-white space-y-0.5">
                      <p className="font-bold text-xs flex items-center gap-1.5">
                        <CurrentIconComponent className="w-3.5 h-3.5 text-amber-400" />
                        <span>{name || 'اسم الحرفة الجديدة'}</span>
                      </p>
                      <p className="text-[10px] text-slate-300 line-clamp-1">{description || 'وصف الحرفة والتخصصات'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Preset Photos Gallery (اختيار سريع بنقرة واحدة) */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                🖼️ أو اختر صورة جاهزة عالية الدقة من معرض الحرف المقترحة:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1">
                {presetCraftPhotos.map((preset, pIdx) => {
                  const isSelected = image === preset.url;
                  return (
                    <div
                      key={pIdx}
                      onClick={() => setImage(preset.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                        isSelected 
                          ? 'border-amber-500 ring-2 ring-amber-400 shadow-md scale-102' 
                          : 'border-transparent opacity-75 hover:opacity-100 hover:border-amber-300'
                      }`}
                    >
                      <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center p-1 text-center">
                        <span className="text-[10px] text-white font-bold leading-tight">
                          {preset.title}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 left-1 bg-amber-500 text-slate-950 rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 4: Sub-Services & Their Photos (الخدمات الفرعية وصورها) */}
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>4. الخدمات الفرعية وصور كل خدمة ({subServices.length})</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  يمكنك إضافة خدمات دقيقة تابعة للحرفة مع تحديد أسعارها وصورها الخاصة.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSubService}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة خدمة فرعية</span>
              </button>
            </div>

            <div className="space-y-3">
              {subServices.map((sub, sIdx) => (
                <div
                  key={sub.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                        {sIdx + 1}
                      </span>
                      <span>الخدمة الفرعية رقم {sIdx + 1}</span>
                    </span>

                    {subServices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubService(sIdx)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="حذف هذه الخدمة الفرعية"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        اسم الخدمة الفرعية:
                      </label>
                      <input
                        type="text"
                        required
                        value={sub.name}
                        onChange={(e) => handleUpdateSubService(sIdx, 'name', e.target.value)}
                        placeholder="مثال: تفصيل قفطان، تركيب مفاتيح، تصليح محرك..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        السعر التقديري (دج):
                      </label>
                      <input
                        type="text"
                        value={sub.estimatedPrice}
                        onChange={(e) => handleUpdateSubService(sIdx, 'estimatedPrice', e.target.value)}
                        placeholder="مثال: 3000 - 7000 دج"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Sub-Service Photo Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                        <span>صورة الخدمة الفرعية (رفع من جهازك أو كتابة رابط):</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSubServiceImageUpload(sIdx, e)}
                          className="text-[11px] text-slate-500 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-amber-500 file:text-slate-950 cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateSubService(sIdx, 'image', image)}
                          className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold shrink-0 hover:bg-slate-300"
                          title="استخدام نفس صورة الحرفة الرئيسية"
                        >
                          نفس صورة الحرفة
                        </button>
                      </div>
                    </div>

                    {/* Preview of subservice image */}
                    <div className="sm:col-span-1 flex items-center justify-end">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900 shrink-0">
                        <img
                          src={sub.image || image}
                          alt={sub.name || 'خدمة'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsAddCraftModalOpen(false)}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>إضافة الحرفة وحفظها في المنصة فوراً</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
