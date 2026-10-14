import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Trash2, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Camera, 
  Mic, 
  Bell, 
  Lock
} from 'lucide-react';

export const PlayStoreLegalModal: React.FC = () => {
  const { 
    isLegalModalOpen, 
    setIsLegalModalOpen, 
    legalModalTab, 
    setLegalModalTab,
    playStoreConfig,
    language,
    requestAccountDeletion
  } = useApp();

  const [confirmDeletion, setConfirmDeletion] = useState(false);

  if (!isLegalModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'السياسات والامتثال لمتجر Google Play' : 'Google Play Compliance & Legal'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'منصة خدّام — حماية البيانات، الخصوصية وحقوق المستخدم' : 'Khodam Platform — Data Safety & User Rights'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsLegalModalOpen(false);
              setConfirmDeletion(false);
            }}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
            title={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 overflow-x-auto shrink-0 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setLegalModalTab('privacy')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              legalModalTab === 'privacy'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
          </button>

          <button
            onClick={() => setLegalModalTab('terms')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              legalModalTab === 'terms'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}</span>
          </button>

          <button
            onClick={() => setLegalModalTab('deletion')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              legalModalTab === 'deletion'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'أمان وحذف البيانات' : 'Data & Account Deletion'}</span>
          </button>

          <button
            onClick={() => setLegalModalTab('permissions')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              legalModalTab === 'permissions'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{language === 'ar' ? 'أذونات التطبيق' : 'App Permissions'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          
          {/* TAB 1: PRIVACY POLICY */}
          {legalModalTab === 'privacy' && (
            <div className="space-y-4 animate-fade-in">
              {playStoreConfig.privacyPolicyExternalUrl && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    {language === 'ar' ? 'النسخة الرسمية المنشورة على الويب لمتجر Google Play:' : 'Official web version for Google Play:'}
                  </span>
                  <a
                    href={playStoreConfig.privacyPolicyExternalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>{language === 'ar' ? 'فتح الرابط' : 'Open Link'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {playStoreConfig.customPrivacyPolicy ? (
                <div className="whitespace-pre-line p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 font-sans">
                  {playStoreConfig.customPrivacyPolicy}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                    <h4 className="font-black text-slate-900 dark:text-white mb-1">
                      {language === 'ar' ? '١. مقدمة والتزام المنصة بالخصوصية' : '1. Introduction & Privacy Commitment'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {language === 'ar' 
                        ? 'تلتزم منصة "خدّام" (Khodam) بأعلى معايير حماية البيانات الشخصية المعتمدة وفق سياسات مطوري متجر Google Play (Google Play Developer Program Policies). توضح هذه السياسة كيفية جمع البيانات، وتخزينها، واستخدامها وحمايتها عند استخدامك للتطبيق.'
                        : 'Khodam platform is strictly committed to protecting user personal data according to Google Play Developer Policies. This policy outlines how information is collected, processed, and safeguarded.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {language === 'ar' ? '٢. البيانات التي يتم جمعها والغرض منها:' : '2. Collected Data & Purpose:'}
                    </h4>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <li><strong>بيانات الحساب الشخصي:</strong> الاسم، رقم الهاتف، والولاية/البلدية لإنشاء الطلبات والتواصل مع الحرفيين.</li>
                      <li><strong>الموقع الجغرافي (Location Data):</strong> يُطلب فقط بموافقة صريحة أثناء استخدام ميزة الرادار والبحث عن أقرب الحرفيين المؤهلين. لا يتم تتبع الموقع بالخلفية عند إغلاق التطبيق.</li>
                      <li><strong>الصور والوسائط (Camera & Media):</strong> لرفع صور العطل أو العمل المطلوب، أو وثائق اعتماد الحرفي المهنية.</li>
                      <li><strong>الصوت والميكروفون (Audio/Mic):</strong> يُستخدم حصرياً لإجراء المكالمات الصوتية المشفرة VoIP عبر التطبيق دون إظهار رقم الهاتف الشخصي.</li>
                      <li><strong>بيانات الجهاز والتشخيص:</strong> إحصائيات الأداء لمنع التوقف ومعالجة الأخطاء.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {language === 'ar' ? '٣. الأمان والتشفير (Security & Encryption):' : '3. Security & Cryptographic Standards:'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {language === 'ar'
                        ? 'تستخدم المنصة بروتوكولات التشفير TLS 1.3 وتشفير AES-256 للمحادثات، بالإضافة إلى تشفير كلمات سر المشرف بخوارزمية SHA-256 أحادية الاتجاه لمنع أي اختراق أو تسريب.'
                        : 'We utilize TLS 1.3 and AES-256 encryption for chats and VoIP sessions, and SHA-256 one-way hashing for administrative security.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {language === 'ar' ? '٤. خدمات ومكتبات الطرف الثالث (Third-Party SDKs):' : '4. Third-Party Services & SDKs:'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {language === 'ar'
                        ? 'قد يعتمد التطبيق على خدمات Google Play Services، وخرائط الموقع الجغرافي، وشبكات الإعلانات المتوافقة مع سياسة العائلة في Google Play. لا نقوم ببيع أو تأجير بياناتك لأي جهة تجارية.'
                        : 'The app uses Google Play Services, geolocation mapping, and Play-compliant ad networks. We never sell your personal information.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {legalModalTab === 'terms' && (
            <div className="space-y-4 animate-fade-in">
              {playStoreConfig.customTermsOfService ? (
                <div className="whitespace-pre-line p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 font-sans">
                  {playStoreConfig.customTermsOfService}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                    <h4 className="font-black text-slate-900 dark:text-white mb-1">
                      {language === 'ar' ? 'شروط وأحكام استخدام منصة خدّام' : 'Terms & Conditions of Service'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {language === 'ar' 
                        ? 'باستخدامك لتطبيق "خدّام"، فإنك تقر وتوافق على الالتزام بالشروط والقواعد المنظمة للعلاقة بين العملاء والحرفيين الميدانيين.'
                        : 'By using Khodam, you agree to adhere to platform guidelines regulating clients and professional artisans.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {language === 'ar' ? 'التزامات طالب الخدمة (العميل):' : 'Client Obligations:'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {language === 'ar'
                        ? 'تقديم وصف دقيق للعطل أو العمل المطلوب، والالتزام بالاتفاق المالي والوقتي المحدد مع الحرفي، والتعامل باحترام وأمانة.'
                        : 'Provide accurate service requirements, respect mutually agreed quotes and schedule, and maintain professional conduct.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {language === 'ar' ? 'التزامات الحرفي ومقدم الخدمة:' : 'Artisan Responsibilities:'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {language === 'ar'
                        ? 'تنفيذ العمل وفق المعايير المهنية، احترام الأسعار المحددة في دليل الأسعار، وعدم المبالغة في التكاليف، والالتزام بإرشادات السلامة.'
                        : 'Execute jobs following trade standards, adhere to pricing fairness, and respect occupational safety.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {language === 'ar' ? 'النزاعات وإخلاء المسؤولية:' : 'Dispute Resolution & Liability:'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {language === 'ar'
                        ? 'تعمل المنصة كوسيط تقني وموثق رقمي يربط بين الطرفين، وتوفر قنوات وساطة لحل أي نزاع بودّية عبر الدعم الفني وتوثيق الطلبات.'
                        : 'The platform serves as a digital coordinator providing verified matching and dispute resolution mediation.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DATA SAFETY & ACCOUNT DELETION (Google Play Mandate) */}
          {legalModalTab === 'deletion' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white mb-1">
                      {language === 'ar' ? 'حق المستخدم في حذف الحساب والبيانات (Google Play Data Safety)' : 'User Right to Account & Data Deletion'}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {language === 'ar'
                        ? 'وفقاً لإرشادات أمان البيانات في Google Play، يحق لكل مستخدم حذف حسابه وكافة بياناته الشخصية وسجل طلباته ورسائله نهائياً في أي وقت.'
                        : 'Under Google Play Data Safety policies, all users hold the unconditional right to delete their account and associated data.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {language === 'ar' ? 'ما البيانات التي يتم حذفها عند تنفيذ الطلب؟' : 'What data is removed upon deletion?'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>الملف الشخصي والاسم ورقم الهاتف</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>سجل المحادثات والمكالمات المشفرة</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>الطلبات النشطة والسابقة والصور المرفوعة</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>بيانات الجلسة وملفات التخزين المؤقت</span>
                  </div>
                </div>
              </div>

              {playStoreConfig.accountDeletionInstructions && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-500/30 text-xs">
                  <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">تعليمات إضافية من الإدارة:</span>
                  <p>{playStoreConfig.accountDeletionInstructions}</p>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                {!confirmDeletion ? (
                  <button
                    onClick={() => setConfirmDeletion(true)}
                    className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 border border-rose-300 dark:border-rose-800/60 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{language === 'ar' ? 'طلب حذف الحساب وجميع البيانات نهائياً' : 'Request Permanent Account & Data Deletion'}</span>
                  </button>
                ) : (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-3">
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 text-center">
                      {language === 'ar' ? 'هل أنت متأكد من رغبتك في حذف الحساب والبيانات؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure? This action is permanent and irreversible.'}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={requestAccountDeletion}
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        {language === 'ar' ? 'تأكيد الحذف الفوري' : 'Confirm Delete Now'}
                      </button>
                      <button
                        onClick={() => setConfirmDeletion(false)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: APP PERMISSIONS */}
          {legalModalTab === 'permissions' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {language === 'ar'
                  ? 'شفافية كاملة حول الأذونات التي يطلبها التطبيق على نظام أندرويد لمتجر Google Play:'
                  : 'Full transparency regarding permissions requested by the Android app on Google Play:'}
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      ACCESS_FINE_LOCATION & ACCESS_COARSE_LOCATION
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      تحديد أقرب الحرفيين المؤهلين لموقع العميل وإظهار دائرة الرادار الحي. لا يتم استخدام الموقع بالخلفية.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      CAMERA & READ_EXTERNAL_STORAGE
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      تصوير العطل المنزلي، إرفاق صور التشخيص المبدئي بالذكاء الاصطناعي، أو رفع وثائق اعتماد الحرفي.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      RECORD_AUDIO / VoIP Calling
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      إجراء مكالمات صوتية مشفرة بين العميل والحرفي داخل التطبيق دون الحاجة لكشف رقم الهاتف الحقيقي.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      POST_NOTIFICATIONS (Firebase Cloud Messaging)
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      إشعارك بوصول الحرفي، استلام عروض الأسعار، والرسائل الجديدة في المحادثة الفورية.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            {language === 'ar' ? 'منصة خدّام © 2026 — متوافقة مع متطلبات متجر Google Play' : 'Khodam © 2026 — Google Play Compliant'}
          </span>
          <button
            onClick={() => {
              setIsLegalModalOpen(false);
              setConfirmDeletion(false);
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
