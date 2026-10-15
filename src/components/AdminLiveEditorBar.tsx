import React, { useState, useEffect, useRef } from 'react';
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
  Upload,
  Edit3,
  X,
  Maximize2,
  RotateCcw
} from 'lucide-react';

interface InlineTextEditorState {
  element: HTMLElement;
  textId: string;
  originalText: string;
  currentValue: string;
  top: number;
  left: number;
  width: number;
}

export const AdminLiveEditorBar: React.FC = () => {
  const { 
    isAdminAuthenticated, 
    setIsAdminAuthenticated, 
    isAdminLiveEditMode, 
    setIsAdminLiveEditMode,
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
    setAdminCustomText,
    resetAdminCustomTexts,
    categories,
    role,
    currentUser
  } = useApp();

  const isEffectiveAdmin = isAdminAuthenticated || role === 'admin' || currentUser?.role === 'admin';

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showIconDrawer, setShowIconDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Inline Floating Text Editor state for double-clicked text
  const [inlineEditor, setInlineEditor] = useState<InlineTextEditorState | null>(null);
  const inlineInputRef = useRef<HTMLTextAreaElement | null>(null);

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

  // 1. Live Text Replacer Effect using MutationObserver (RUNS FOR ALL VISITORS)
  useEffect(() => {
    const applyTextOverrides = () => {
      const keys = Object.keys(adminCustomTexts || {});
      if (keys.length === 0) return;

      // A. Match elements with data-admin-text-id
      keys.forEach(key => {
        const val = adminCustomTexts[key];
        if (!val) return;
        const elements = document.querySelectorAll(`[data-admin-text-id="${key}"]`);
        elements.forEach(el => {
          if (el.textContent !== val) {
            el.textContent = val;
          }
        });
      });

      // B. Also replace exact text node occurrences for elements without specific id
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
  }, [adminCustomTexts]);

  // 2. Global Double Click & Drag/Drop Interceptor for Admin
  useEffect(() => {
    if (!isEffectiveAdmin) return;

    // A. Double Click Handler (Edit any text, icon, or image)
    const handleGlobalDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Don't intercept inside input fields, textareas, or admin modals
      if (
        target.closest('input') || 
        target.closest('textarea') || 
        target.closest('.admin-ignore') ||
        target.closest('.admin-modal') ||
        target.closest('[role="dialog"]')
      ) {
        return;
      }

      // Check if double clicked an image
      const imgElem = target.closest('img') as HTMLImageElement | null;
      if (imgElem && !imgElem.closest('.admin-ignore')) {
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
      if (isIconElem && !target.closest('.admin-ignore')) {
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

      // Check if double clicked a text/heading/label/button/p/span
      let textElement: HTMLElement | null = target;
      
      // If clicked on an element with a direct child text span or label, pick the most specific text node
      if (target.childNodes.length === 1 && target.childNodes[0].nodeType === Node.TEXT_NODE) {
        textElement = target;
      } else {
        const leafText = target.querySelector('span, p, b, strong, h1, h2, h3, h4, h5, h6, label');
        if (leafText && (leafText as HTMLElement).textContent?.trim()) {
          textElement = leafText as HTMLElement;
        } else {
          textElement = target.closest('h1, h2, h3, h4, h5, h6, p, span, label, b, strong, em, button, a, li, dt, dd, div') as HTMLElement | null;
        }
      }

      if (!textElement) textElement = target;

      const rawText = textElement.textContent?.trim() || '';

      if (rawText.length >= 1 && rawText.length <= 400) {
        e.preventDefault();
        e.stopPropagation();
        window.getSelection()?.removeAllRanges();

        // Calculate position for Inline Floating Editor
        const rect = textElement.getBoundingClientRect();
        const popupWidth = Math.min(360, window.innerWidth - 32);
        
        // Position below the element if space allows, otherwise above
        let top = rect.bottom + window.scrollY + 8;
        if (rect.bottom + 180 > window.innerHeight) {
          top = Math.max(10, rect.top + window.scrollY - 150);
        }

        // Align left/right respecting window boundaries
        let left = rect.left + window.scrollX;
        if (left + popupWidth > window.innerWidth - 16) {
          left = window.innerWidth - popupWidth - 16;
        }
        if (left < 16) left = 16;

        // Apply visual outline on the active element
        textElement.style.outline = '2px dashed #f59e0b';
        textElement.style.outlineOffset = '3px';
        textElement.style.borderRadius = '6px';
        textElement.style.transition = 'outline 0.2s ease';

        (window as any).__lastDoubleClickedElement = textElement;

        const dataId = textElement.getAttribute('data-admin-text-id') || rawText;

        setInlineEditor({
          element: textElement,
          textId: dataId,
          originalText: rawText,
          currentValue: rawText,
          top,
          left,
          width: popupWidth
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

      // Check if a local image file was dropped from the computer
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
  }, [isEffectiveAdmin, categories]);

  // Focus textarea when inline editor opens
  useEffect(() => {
    if (inlineEditor && inlineInputRef.current) {
      inlineInputRef.current.focus();
      inlineInputRef.current.select();
    }
  }, [inlineEditor]);

  // Save inline text edit
  const handleSaveInlineText = () => {
    if (!inlineEditor) return;
    const { element, textId, originalText, currentValue } = inlineEditor;
    const finalVal = currentValue.trim();

    if (finalVal) {
      setAdminCustomText(textId, finalVal);
      if (originalText && originalText !== textId) {
        setAdminCustomText(originalText, finalVal);
      }

      // Immediate DOM update
      try {
        element.textContent = finalVal;
      } catch (e) {
        console.error('DOM update error', e);
      }

      setToastMessage(`✨ تم حفظ النص المعدل بنجاح: "${finalVal.slice(0, 24)}..."`);
      setTimeout(() => setToastMessage(''), 3500);
    }

    // Clean outline
    element.style.outline = '';
    element.style.outlineOffset = '';
    setInlineEditor(null);
  };

  // Cancel inline text edit
  const handleCancelInlineText = () => {
    if (inlineEditor) {
      inlineEditor.element.style.outline = '';
      inlineEditor.element.style.outlineOffset = '';
      setInlineEditor(null);
    }
  };

  // Switch to full modal editor
  const handleExpandToFullModal = () => {
    if (!inlineEditor) return;
    const { textId, originalText, currentValue } = inlineEditor;
    handleCancelInlineText();
    setAdminEditModalTarget({
      type: 'text',
      id: textId,
      title: `تعديل النص: "${originalText.slice(0, 30)}..."`,
      currentValue: currentValue
    });
  };

  if (!isEffectiveAdmin) return null;

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* INLINE FLOATING TEXT EDITOR (ظهر فوراً عند الضغط مرتين على أي نص) */}
      {/* ------------------------------------------------------------- */}
      {inlineEditor && (
        <div 
          className="admin-ignore fixed z-50 animate-in fade-in zoom-in-95 duration-150"
          style={{
            top: `${inlineEditor.top}px`,
            left: `${inlineEditor.left}px`,
            width: `${inlineEditor.width}px`
          }}
        >
          <div className="bg-slate-900 text-white border-2 border-amber-500 rounded-2xl shadow-2xl p-3 backdrop-blur-md space-y-2.5">
            {/* Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
                <Edit3 className="w-3.5 h-3.5" />
                <span>تعديل النص بالضغط مرتين (الأدمن)</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleExpandToFullModal}
                  className="p-1 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                  title="توسيع للخيارات المتقدمة"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelInlineText}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="إلغاء (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Editable Textarea */}
            <div className="space-y-1">
              <textarea
                ref={inlineInputRef}
                value={inlineEditor.currentValue}
                onChange={(e) => setInlineEditor(prev => prev ? { ...prev, currentValue: e.target.value } : null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSaveInlineText();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    handleCancelInlineText();
                  }
                }}
                rows={Math.min(5, Math.max(2, Math.ceil(inlineEditor.currentValue.length / 32)))}
                className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-2.5 text-xs text-white resize-y font-sans leading-relaxed"
                placeholder="اكتب النص البديل هنا..."
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>اضغط Enter للحفظ · Esc للإلغاء</span>
                <button
                  type="button"
                  onClick={() => setInlineEditor(prev => prev ? { ...prev, currentValue: prev.originalText } : null)}
                  className="text-amber-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>استعادة النص الأصلي</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleCancelInlineText}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                إلغاء (Esc)
              </button>
              <button
                type="button"
                onClick={handleSaveInlineText}
                className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>حفظ النص الآن ✓</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FLOATING ADMIN LIVE TOOLBAR (شريط تحكم وضع المشرف والتعديل البصري) */}
      {/* ------------------------------------------------------------- */}
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
                    وضع المشرف — تعديل النصوص بالضغط مرتين
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                    نشط (انقر مرتين ✍️)
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
              <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-[11px] leading-relaxed flex items-center gap-2">
                <span className="text-base shrink-0">💡</span>
                <span>
                  <strong>ميزة التعديل السريع:</strong> اضغط مرتين (Double Click) على أي نص أو عنوان أو زر في التطبيق لفتحه وتعديله فوراً في مكانه وحفظه!
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {/* Add Craft with Photos Button */}
                <button
                  onClick={() => setIsAddCraftModalOpen(true)}
                  className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-[11px] flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95 col-span-2 sm:col-span-1 cursor-pointer"
                  title="إضافة حرفة جديدة مع صورها وصور الخدمات الفرعية"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ حرفة وصورها</span>
                </button>

                {/* Swap All Images Button */}
                <button
                  onClick={() => setIsMediaManagerModalOpen(true)}
                  className="p-2 bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/50 rounded-xl text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>تبديل الصور</span>
                </button>

                {/* Chat & Call Inspector Button */}
                <button
                  onClick={() => setIsChatDiagnosticsOpen(true)}
                  className="p-2 bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/50 rounded-xl text-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>فاحص الدردشة</span>
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
                  <span>+ رفع أيقونة</span>
                </button>

                {/* Toggle Draggable Icons Tray */}
                <button
                  onClick={() => setShowIconDrawer(!showIconDrawer)}
                  className={`p-2 border rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
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
                  <span>لوحة الأدمن ⚙️</span>
                </button>

                {/* Reset Custom Texts if any */}
                {Object.keys(adminCustomTexts || {}).length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('هل تريد استعادة جميع النصوص الأصلية؟')) {
                        resetAdminCustomTexts();
                        setToastMessage('تمت استعادة كافة النصوص الأصلية بنجاح!');
                        setTimeout(() => setToastMessage(''), 3000);
                      }
                    }}
                    className="p-2 bg-rose-950/40 hover:bg-rose-900 border border-rose-800/60 rounded-xl text-rose-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors col-span-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>استعادة النصوص الأصلية ({Object.keys(adminCustomTexts).length} نصوص معدلة)</span>
                  </button>
                )}
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
    </>
  );
};
