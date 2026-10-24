import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Camera, 
  Mic, 
  MicOff, 
  UploadCloud, 
  RotateCcw, 
  AlertCircle, 
  ChevronLeft,
  Wrench,
  Droplets,
  Zap,
  Hammer,
  Paintbrush,
  Wind,
  BrickWall,
  Flame,
  LayoutGrid,
  Box
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui';
import { 
  AIDiagnosisResponse, 
  compressImage, 
  requestAIDiagnosis, 
  getLocalHeuristicDiagnosis 
} from '../services/aiDiagnosis';
import { DiagnosisResult } from './DiagnosisResult';
import { ALGERIAN_TRADES } from '../data/algeriaData';

interface DiagnosisSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
}

export const DiagnosisSheet: React.FC<DiagnosisSheetProps> = ({
  isOpen,
  onClose,
  initialText = ''
}) => {
  const { setBookingModalService } = useApp();

  const [description, setDescription] = useState(initialText);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'result' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<AIDiagnosisResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync initialText when opened
  useEffect(() => {
    if (initialText) {
      setDescription(initialText);
    }
  }, [initialText]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Setup Web Speech API for Arabic voice input
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'ar-DZ'; // Algerian Arabic with fallback to standard Arabic

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript).slice(0, 500));
        }
        setIsRecording(false);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        // Fallback to standard Arabic if Algerian dialect locale fails
        if (recognition.lang === 'ar-DZ') {
          recognition.lang = 'ar';
          try {
            recognition.start();
            return;
          } catch {}
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  if (!isOpen) return null;

  const toggleRecording = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert('ميزة الإملاء الصوتي غير مدعومة في متصفحك حالياً.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 1200, 0.8);
      setSelectedImage(`data:${compressed.mimeType};base64,${compressed.base64}`);
      setImageMimeType(compressed.mimeType);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err?.message || 'تعذر معالجة الصورة المرفوعة.');
    }
  };

  const handleStartAnalysis = async () => {
    const trimmed = description.trim();
    if (!trimmed && !selectedImage) {
      setErrorMessage('يرجى وصف المشكلة أو إرفاق صورة لها قبل بدء التشخيص.');
      return;
    }

    setStatus('analyzing');
    setErrorMessage(null);

    try {
      const cleanBase64 = selectedImage 
        ? selectedImage.includes('base64,') 
          ? selectedImage.split('base64,')[1] 
          : selectedImage 
        : undefined;

      const result = await requestAIDiagnosis({
        description: trimmed,
        image: cleanBase64,
        mimeType: imageMimeType
      });

      setDiagnosisResult(result);
      setStatus('result');
    } catch (err: any) {
      console.error('Diagnosis failed:', err);
      setStatus('error');
      setErrorMessage(err?.message || 'تعذر إتمام التشخيص حالياً. يمكنك إعادة المحاولة أو اختيار الحرفة يدوياً.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setDiagnosisResult(null);
    setErrorMessage(null);
  };

  const handleManualTradeSelect = (tradeName: string) => {
    setBookingModalService({
      categoryId: 'home_repair',
      subServiceId: 'plumbing',
      prefilledTrade: tradeName,
      prefilledDescription: description,
      prefilledImage: selectedImage || undefined
    });
    onClose();
  };

  const quickExamples = [
    'الما يسيل من تحت الحوض',
    'الضو راح من نصف الدار',
    'الكليماتيزور ما يبردش',
    'الكهرباء تنقطع كثيرًا عند تشغيل السخان',
    'الباب لا يُغلق جيدًا وعالق',
    'الكارلاج تفكك وطار من الأرضية'
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1C2421]/60 transition-opacity"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Bottom Sheet Container */}
      <div 
        className="w-full sm:max-w-2xl bg-white border-t sm:border border-[#DDE3DF] rounded-t-[20px] sm:rounded-[16px] shadow-[0_-4px_24px_rgba(28,36,33,0.15)] max-h-[90dvh] flex flex-col relative pb-[calc(1rem+env(safe-area-inset-bottom,0px))] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pull Indicator on Mobile */}
        <div className="w-12 h-1.5 bg-[#DDE3DF] rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Sheet Header */}
        <div className="px-5 py-4 border-b border-[#DDE3DF] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5 text-right">
            <div className="w-10 h-10 rounded-[8px] bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#0A4D2E] leading-tight">
                مساعد التشخيص الذكي
              </h2>
              <p className="text-[12px] text-[#5B6660] mt-0.5">
                حلّل مشكلتك بالذكاء الاصطناعي وحدد الحرفي المناسب في ثوانٍ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[#5B6660] hover:text-[#1C2421] hover:bg-[#EEF6F1] transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Sheet Content Area (Scrollable) */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* Status: ERROR */}
          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-[12px] space-y-3 text-right">
              <div className="flex items-start gap-2.5 text-[#C62828]">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <h4 className="text-[14px] font-bold">تعذر إكمال الفحص التلقائي</h4>
                  <p className="text-[13px] text-[#5B6660] mt-1">{errorMessage}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={handleStartAnalysis}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  إعادة المحاولة
                </Button>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                >
                  تعديل الوصف
                </Button>
              </div>

              {/* Manual Craft Selection Alternative */}
              <div className="pt-3 border-t border-red-200/60">
                <span className="text-[12px] font-bold text-[#1C2421] block mb-2">
                  أو اختر نوع الحرفة يدوياً للمتابعة فوراً:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALGERIAN_TRADES.slice(0, 6).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleManualTradeSelect(t.name)}
                      className="px-2.5 py-2 bg-white hover:bg-[#EEF6F1] border border-[#DDE3DF] rounded-[8px] text-[12px] font-semibold text-[#0A4D2E] text-right truncate transition-colors cursor-pointer"
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Status: ANALYZING (Skeleton Loader) */}
          {status === 'analyzing' && (
            <div className="py-10 text-center space-y-5 animate-pulse text-right">
              <div className="w-16 h-16 rounded-full bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center mx-auto border-2 border-[#1E9B5C]/30 animate-spin">
                <Sparkles className="w-8 h-8" strokeWidth={1.75} />
              </div>

              <div className="space-y-2 text-center">
                <h3 className="text-[18px] font-bold text-[#0A4D2E]">
                  نحلّل مشكلتك...
                </h3>
                <p className="text-[13px] text-[#5B6660] max-w-sm mx-auto">
                  جاري فحص العطل ومطابقته مع المهن المعتمدة وتقدير التكلفة بالدينار الجزائري.
                </p>
              </div>

              {/* Skeleton Bars */}
              <div className="max-w-md mx-auto space-y-3 pt-2">
                <div className="h-6 bg-[#EEF6F1] rounded-[8px] w-3/4 mx-auto" />
                <div className="h-4 bg-[#EEF6F1] rounded-[8px] w-5/6 mx-auto" />
                <div className="h-4 bg-[#EEF6F1] rounded-[8px] w-2/3 mx-auto" />
              </div>
            </div>
          )}

          {/* Status: RESULT */}
          {status === 'result' && diagnosisResult && (
            <DiagnosisResult
              result={diagnosisResult}
              userDescription={description}
              userImage={selectedImage}
              onReset={handleReset}
              onCloseSheet={onClose}
            />
          )}

          {/* Status: IDLE (Input Form) */}
          {status === 'idle' && (
            <div className="space-y-4">
              
              {/* Text Input with Character Counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <label htmlFor="problem-desc" className="font-semibold text-[#1C2421]">
                    اوصف المشكلة أو العطل بالتفصيل:
                  </label>
                  <span className={`text-[11px] tabular-nums font-mono ${description.length >= 480 ? 'text-[#C62828] font-bold' : 'text-[#5B6660]'}`}>
                    {description.length}/500 حرف
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    id="problem-desc"
                    rows={4}
                    value={description}
                    maxLength={500}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اوصف مشكلتك بالدارجة أو العربية... مثال: الما يسيل من تحت حوض المطبخ، أو الضو راه مقطوع في نصف الدار..."
                    className="w-full p-3.5 bg-white border border-[#DDE3DF] rounded-[10px] text-[14px] text-[#1C2421] placeholder:text-[#5B6660]/70 focus:outline-none focus:ring-1 focus:ring-[#1E9B5C] focus:border-[#1E9B5C] resize-none leading-relaxed"
                  />

                  {/* Voice Dictation Button inside Textarea */}
                  <button
                    type="button"
                    onClick={toggleRecording}
                    title={isRecording ? 'إيقاف التسجيل الصوتي' : 'تسجيل المشكلة صوتياً (بالدارجة أو العربية)'}
                    className={`
                      absolute left-3 bottom-3 h-9 px-2.5 rounded-[8px] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer
                      ${isRecording 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-[#EEF6F1] text-[#0F6B3F] hover:bg-[#DDE3DF]'}
                    `}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-4 h-4" strokeWidth={1.75} />
                        <span>جاري الاستماع...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" strokeWidth={1.75} />
                        <span>تحدث بصوتك</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Image Preview & Upload Controls */}
              <div className="space-y-2">
                <span className="text-[13px] font-semibold text-[#1C2421] block">
                  إرفاق صورة للعطل (اختياري، يرفع دقة التشخيص):
                </span>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <input
                  type="file"
                  ref={cameraInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {selectedImage ? (
                  <div className="relative rounded-[10px] overflow-hidden border border-[#1E9B5C] p-1 bg-[#EEF6F1]">
                    <img 
                      src={selectedImage} 
                      alt="صورة العطل" 
                      className="w-full h-40 object-cover rounded-[8px]" 
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-3 left-3 bg-[#1C2421]/80 hover:bg-[#1C2421] text-white p-1.5 rounded-full transition-colors cursor-pointer"
                      title="حذف الصورة"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="block text-[11px] text-[#0A4D2E] font-medium p-1 text-center">
                      تم ضغط وتجهيز الصورة بنجاح (أقل من 1MB) ✓
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-11 px-3 bg-white hover:bg-[#EEF6F1] border border-[#DDE3DF] rounded-[8px] text-[13px] font-medium text-[#1C2421] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-[#0F6B3F]" strokeWidth={1.75} />
                      <span>رفع من الاستوديو</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="h-11 px-3 bg-white hover:bg-[#EEF6F1] border border-[#DDE3DF] rounded-[8px] text-[13px] font-medium text-[#1C2421] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-[#0F6B3F]" strokeWidth={1.75} />
                      <span>تصوير بالكاميرا</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Clickable Algerian Examples */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[12px] font-semibold text-[#5B6660] block">
                  أمثلة شائعة بنقرة واحدة:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickExamples.map((ex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setDescription(ex)}
                      className="text-[12px] px-2.5 py-1.5 bg-[#EEF6F1] hover:bg-[#DDE3DF] text-[#0A4D2E] rounded-[8px] transition-colors cursor-pointer font-medium text-right"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button: 44px min height */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartAnalysis}
                  disabled={!description.trim() && !selectedImage}
                  leftIcon={<Sparkles className="w-4 h-4" strokeWidth={1.75} />}
                  className="w-full text-[14px] font-bold"
                >
                  تشخيص المشكلة الآن
                </Button>
              </div>

              {/* AI Disclaimer */}
              <p className="text-[11px] text-[#5B6660] text-center">
                التشخيص بواسطة الذكاء الاصطناعي وهو استرشادي، والحرفي يؤكد المشكلة بعد المعاينة.
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
