import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ImageIcon, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Plus,
  Wrench, 
  Droplets, 
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
  GripHorizontal, 
  Flame, 
  Radio, 
  Cpu, 
  Star,
  Upload
} from 'lucide-react';

export const AdminLiveEditorBar: React.FC = () => {
  const { 
    isAdminAuthenticated, 
    setIsAdminAuthenticated, 
    isAdminLiveEditMode, 
    setIsMediaManagerModalOpen,
    setIsChatDiagnosticsOpen,
    isAddCraftModalOpen,
    setIsAddCraftModalOpen,
    setActiveTab,
    setAdminEditModalTarget,
    updateSubServiceImage,
    updateCategoryHeroImage,
    updateCategoryIcon,
    adminCustomTexts,
    categories
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showIconDrawer, setShowIconDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Draggable icons for rapid drag-to-convert
  const draggableIcons = [
    { name: 'Wrench', label: 'سباكة', icon: Wrench },
    { name: 'Zap', label: 'كهرباء', icon: Zap },
    { name: 'Hammer', label: 'نجارة', icon: Hammer },
    { name: 'Scissors', label: 'خياطة', icon: Scissors },
    { name: 'Cake', label: 'حلويات', icon: Cake },
    { name: 'Soup', label: 'طبخ', icon: Soup },
    { name: 'Paintbrush', label: 'دهان', icon: Paintbrush },
    { name: 'BrickWall', label: 'بناء', icon: BrickWall },
    { name: 'Car', label: 'سيارات', icon: Car },
    { name: 'Truck', label: 'نقل', icon: Truck },
    { name: 'Key', label: 'أقفال', icon: Key },
    { name: 'Droplets', label: 'تسريب', icon: Droplets },
    { name: 'Flame', label: 'حدادة', icon: Flame },
    { name: 'Cpu', label: 'إلكترونيات', icon: Cpu },
    { name: 'Radio', label: 'بارابول', icon: Radio },
    { name: 'Heart', label: 'رعاية', icon: Heart },
    { name: 'Star', label: 'تميز', icon: Star }
  ];

  // 1. Live Text Replacer Effect using MutationObserver
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const applyTextOverrides = () => {
      const keys = Object.keys(adminCustomTexts || {});
      if (keys.length === 0) return;

      // Match elements with data-admin-text-id
      keys.forEach(key => {
        const val = adminCustomTexts[key];
        const elements = document.querySelectorAll(`[data-admin-text-id="${key}"]`);
        elements.forEach(el => {
          if (el.textContent !== val) {
            el.textContent = val;
          }
        });
      });

      // Also replace exact text node occurrences for elements without specific id
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (!parent || parent.closest('input, textarea, script, style, .admin-ignore, .fixed.z-50')) continue;
        const currentText = node.nodeValue?.trim();
        if (currentText && adminCustomTexts[currentText] && node.nodeValue !== adminCustomTexts[currentText]) {
          node.nodeValue = adminCustomTexts[currentText];
        }
      }
    };

    applyTextOverrides();
    const observer = new MutationObserver(() => {
      applyTextOverrides();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, [isAdminAuthenticated, adminCustomTexts]);

  // 2. Global Double Click & Drag/Drop Interceptor for Admin
  useEffect(() => {
    if (!isAdminAuthenticated || !isAdminLiveEditMode) return;

    // A. Double Click Handler (Edit any text, icon, or image)
    const handleGlobalDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Don't intercept inside input fields, textareas, or admin modals
      if (
        target.closest('input') || 
        target.closest('textarea') || 
        target.closest('.fixed.z-50') ||
        target.closest('.admin-ignore')
      ) {
        return;
      }

      // Check if double clicked an image
      const imgElem = target.closest('img') as HTMLImageElement | null;
      if (imgElem) {
        e.preventDefault();
        e.stopPropagation();
        const src = imgElem.src;
        const alt = imgElem.alt || 'صورة من المنصة';

        const catMatch = categories.find(c => c.image === src);
        if (catMatch) {
          setAdminEditModalTarget({
            type: 'image',
            id: catMatch.id,
            title: `صورة فئة: ${catMatch.name}`,
            currentValue: src,
            categoryId: catMatch.id
          });
          return;
        }

        for (const c of categories) {
          const subMatch = c.subServices.find(s => s.image === src);
          if (subMatch) {
            setAdminEditModalTarget({
              type: 'image',
              id: subMatch.id,
              title: `صورة خدمة: ${subMatch.name}`,
              currentValue: src,
              categoryId: c.id,
              subServiceId: subMatch.id
            });
            return;
          }
        }

        setAdminEditModalTarget({
          type: 'image',
          id: `img_${Date.now()}`,
          title: alt,
          currentValue: src
        });
        return;
      }

      // Check if double clicked an SVG or uploaded Icon
      const isIconElem = target.closest('svg') || (target.tagName === 'IMG' && (target.getAttribute('alt')?.includes('icon') || target.className.includes('w-5') || target.className.includes('w-6')));
      if (isIconElem) {
        e.preventDefault();
        e.stopPropagation();
        const catCard = target.closest('[data-category-id]') as HTMLElement | null;
        const catId = catCard?.getAttribute('data-category-id') || categories[0]?.id;
        const matchedCat = categories.find(c => c.id === catId);
        setAdminEditModalTarget({
          type: 'icon',
          id: `icon_${catId}`,
          title: `تعديل أو رفع أيقونة: ${matchedCat?.name || 'الحرفة'}`,
          currentValue: matchedCat?.icon || 'Wrench',
          categoryId: catId
        });
        return;
      }

      // Check if double clicked a text/heading/label/button
      const textCandidate = target.closest('h1, h2, h3, h4, h5, p, span, button, a, label, li, dt, dd');
      const textContent = textCandidate?.textContent?.trim() || target.textContent?.trim() || '';

      if (textContent.length >= 2 && textContent.length <= 250) {
        e.preventDefault();
        e.stopPropagation();
        (window as any).__lastDoubleClickedElement = textCandidate || target;

        const dataId = (textCandidate || target).getAttribute('data-admin-text-id') || textContent;
        setAdminEditModalTarget({
          type: 'text',
          id: dataId,
          title: `تعديل النص: "${textContent.slice(0, 30)}..."`,
          currentValue: textContent
        });
      }
    };

    // B. Global Drag Over Handler
    const handleGlobalDragOver = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest('img') || target?.closest('[data-category-id]')) {
        e.preventDefault();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'copy';
        }
      }
    };

    // C. Global Drop Handler (for dropping icons or dropping images)
    const handleGlobalDrop = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // 1. Check if an icon was dragged from the palette onto a category card
      try {
        const rawJson = e.dataTransfer?.getData('application/json');
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          if (parsed.type === 'admin_icon') {
            const catCard = target.closest('[data-category-id]') as HTMLElement | null;
            if (catCard) {
              e.preventDefault();
              e.stopPropagation();
              const catId = catCard.getAttribute('data-category-id');
              if (catId) {
                updateCategoryIcon(catId, parsed.iconName);
                setToastMessage(`تم تحويل أيقونة الفئة إلى: ${parsed.label || parsed.iconName} بالسحب بنجاح!`);
                setTimeout(() => setToastMessage(''), 3000);
                return;
              }
            }
          } else if (parsed.type === 'admin_image_swap') {
            const img = target.closest('img') as HTMLImageElement | null;
            if (img) {
              e.preventDefault();
              e.stopPropagation();
              const targetSrc = img.src;
              const sourceSrc = parsed.src;

              // Swap categories or subservices
              const catTarget = categories.find(c => c.image === targetSrc);
              if (catTarget) {
                updateCategoryHeroImage(catTarget.id, sourceSrc);
              }
              img.src = sourceSrc;
              setToastMessage('تم تحويل وتبديل الصورة بالسحب بنجاح!');
              setTimeout(() => setToastMessage(''), 3000);
              return;
            }
          }
        }
      } catch {
        // Fallback to file drop
      }

      // 2. Check if a local image file was dropped from the computer
      const img = target.closest('img') as HTMLImageElement | null;
      if (img && e.dataTransfer?.files?.[0]) {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          if (typeof loadEvt.target?.result === 'string') {
            const newUrl = loadEvt.target.result;
            const src = img.src;
            const cat = categories.find(c => c.image === src);
            if (cat) {
              updateCategoryHeroImage(cat.id, newUrl);
            } else {
              for (const c of categories) {
                const sub = c.subServices.find(s => s.image === src);
                if (sub) {
                  updateSubServiceImage(c.id, sub.id, newUrl);
                  break;
                }
              }
            }
            img.src = newUrl;
            setToastMessage('تم استبدال الصورة بنجاح عبر السحب والإفلات!');
            setTimeout(() => setToastMessage(''), 3000);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    // D. Global Drag Start Handler (Allow dragging images on page to swap)
    const handleGlobalDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        e.dataTransfer?.setData('application/json', JSON.stringify({
          type: 'admin_image_swap',
          src: img.src
        }));
      }
    };

    window.addEventListener('dblclick', handleGlobalDoubleClick, true);
    window.addEventListener('dragover', handleGlobalDragOver, true);
    window.addEventListener('drop', handleGlobalDrop, true);
    window.addEventListener('dragstart', handleGlobalDragStart, true);

    return () => {
      window.removeEventListener('dblclick', handleGlobalDoubleClick, true);
      window.removeEventListener('dragover', handleGlobalDragOver, true);
      window.removeEventListener('drop', handleGlobalDrop, true);
      window.removeEventListener('dragstart', handleGlobalDragStart, true);
    };
  }, [isAdminAuthenticated, isAdminLiveEditMode, categories]);

  if (!isAdminAuthenticated) return null;

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:right-6 sm:left-auto z-40 max-w-xl admin-ignore animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white border-2 border-amber-500 rounded-3xl shadow-2xl p-3 sm:p-4 backdrop-blur-md space-y-2.5">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500 text-slate-950 font-black animate-pulse">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-400">
                  وضع التعديل البصري للمشرف
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold">
                  مفعل (نقر مزدوج + سحب)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
              title={isCollapsed ? 'توسيع' : 'تصغير'}
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setIsAdminAuthenticated(false);
                sessionStorage.removeItem('khodam_admin_auth');
              }}
              className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
              title="خروج من وضع الأدمن"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Expanded Controls */}
        {!isCollapsed && (
          <div className="space-y-2.5 pt-1 border-t border-slate-800 text-xs">
            <p className="text-[11px] text-slate-300 leading-relaxed">
              💡 <strong>تعديل وسحب فوري:</strong> انقر مرتين (Double-Click) على أي نص أو أيقونة أو صورة لتعديلها، أو اسحب أي أيقونة أو صورة من الأسفل وأفلتها فوق أي قسم لتحويله فوراً!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {/* Add Craft with Photos Button */}
              <button
                onClick={() => setIsAddCraftModalOpen(true)}
                className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-[11px] flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95 col-span-2 sm:col-span-1"
                title="إضافة حرفة جديدة مع صورها وصور الخدمات الفرعية"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ إضافة حرفة وصورها</span>
              </button>

              {/* Swap All Images Button */}
              <button
                onClick={() => setIsMediaManagerModalOpen(true)}
                className="p-2 bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/50 rounded-xl text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>تبديل جميع الصور</span>
              </button>

              {/* Chat & Call Inspector Button */}
              <button
                onClick={() => setIsChatDiagnosticsOpen(true)}
                className="p-2 bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>مراقب وفاحص الدردشة</span>
              </button>

              {/* Upload New Icon Button */}
              <button
                onClick={() => {
                  setAdminEditModalTarget({
                    type: 'icon',
                    id: `icon_${categories[0]?.id || 'general'}`,
                    title: `رفع أو تعديل أيقونة جديدة`,
                    currentValue: categories[0]?.icon || 'Wrench',
                    categoryId: categories[0]?.id
                  });
                }}
                className="p-2 bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/50 rounded-xl text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="فتح محرر ورافع الأيقونات الشامل"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>+ رفع أيقونة جديدة</span>
              </button>

              {/* Toggle Draggable Icons Tray */}
              <button
                onClick={() => setShowIconDrawer(!showIconDrawer)}
                className={`p-2 border rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors ${
                  showIconDrawer 
                    ? 'bg-amber-500 text-slate-950 border-amber-400' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <GripHorizontal className="w-3.5 h-3.5" />
                <span>سحب الأيقونات</span>
              </button>

              {/* Open Full Admin Panel Button */}
              <button
                onClick={() => setActiveTab('admin')}
                className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-[11px] flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-sm col-span-2 sm:col-span-1 cursor-pointer"
                title="العودة إلى لوحة تحكم المشرف الشاملة"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>العودة للوحة الأدمن ⚙️</span>
              </button>

              {/* Quick Jump to Partner Finder */}
              <button
                onClick={() => setActiveTab('partners')}
                className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors col-span-2 sm:col-span-1 cursor-pointer"
              >
                <span>شريك عمل 🤝</span>
              </button>
            </div>

            {/* Draggable Icon Shelf (Tray) */}
            {showIconDrawer && (
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold">
                  <span>✋ اسحب أي أيقونة من هنا وأفلتها فوق أي فئة لتغيير أيقونتها مباشرة:</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {draggableIcons.map(item => {
                    const IconCmp = item.icon;
                    return (
                      <div
                        key={item.name}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/json', JSON.stringify({
                            type: 'admin_icon',
                            iconName: item.name,
                            label: item.label
                          }));
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 hover:border-amber-400 rounded-xl flex items-center gap-1.5 cursor-grab active:cursor-grabbing text-slate-300 text-[11px] font-bold shrink-0 transition-transform hover:scale-105"
                        title={`اسحب أيقونة ${item.label} وأفلتها فوق أي فئة`}
                      >
                        <IconCmp className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
