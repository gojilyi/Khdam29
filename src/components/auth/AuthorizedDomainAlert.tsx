import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ShieldAlert, Sparkles, Mail } from 'lucide-react';
import firebaseConfig from '../../../firebase-applet-config.json';

interface AuthorizedDomainAlertProps {
  onSwitchToEmailForm?: () => void;
  code?: string;
  customMessage?: string;
}

export const AuthorizedDomainAlert: React.FC<AuthorizedDomainAlertProps> = ({ 
  onSwitchToEmailForm, 
  code = 'auth/unauthorized-domain',
  customMessage 
}) => {
  const [copied, setCopied] = useState(false);
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const projectId = firebaseConfig.projectId || 'favorable-terminus-63kqt';
  const messagingSenderId = firebaseConfig.messagingSenderId || '563678292032';

  const isTokenApiError = code === 'auth/token-service-api-disabled' || code?.includes('token-service');
  const consoleUrl = isTokenApiError
    ? `https://console.developers.google.com/apis/api/securetoken.googleapis.com/overview?project=${messagingSenderId}`
    : `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  const handleCopy = () => {
    if (navigator?.clipboard && currentDomain) {
      navigator.clipboard.writeText(currentDomain);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (isTokenApiError) {
    return (
      <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-[10px] space-y-3 text-[12px] shadow-xs" dir="rtl">
        <div className="flex items-start gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" strokeWidth={1.75} />
          <div className="space-y-1">
            <h5 className="font-bold text-[13px] text-amber-900">
              تفعيل خدمة المصادقة (Secure Token API) في مشروع Google Cloud
            </h5>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              {customMessage || 'خدمة التوثيق والرموز الآمنة لمشروع Google Cloud تحتاج إلى لحظات للانتشار بعد تهيئة Firebase، أو تتطلب ضغطة زر لتفعيلها.'}
            </p>
          </div>
        </div>

        <div className="p-2.5 bg-white/90 border border-amber-300 rounded-[8px] space-y-1.5 text-[11px] text-amber-900">
          <div className="font-bold text-amber-950">كيفية إتمام التفعيل:</div>
          <ol className="list-decimal list-inside space-y-1 leading-relaxed">
            <li>تمت تهيئة Firebase بنجاح من خلال الخادم.</li>
            <li>إذا قمت بتهيئة المشروع للتو، قد يستغرق انتشار واجهة API دقيقة واحدة ثم سيعمل تلقائياً.</li>
            <li>يمكنك أيضاً فتح رابط الواجهة البرمجية في Google Cloud والضغط على <strong>Enable</strong> للتأكيد.</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <a
            href={consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 h-9 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-[8px] text-[12px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>فتح صفحة Secure Token API في Cloud Console</span>
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
          </a>

          {onSwitchToEmailForm && (
            <button
              type="button"
              onClick={onSwitchToEmailForm}
              className="w-full sm:w-auto h-9 px-3 bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 font-bold rounded-[8px] text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Mail className="w-3.5 h-3.5 text-[#0F6B3F]" strokeWidth={1.75} />
              <span>إعادة المحاولة بالبريد</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-[10px] space-y-3 text-[12px] shadow-xs" dir="rtl">
      <div className="flex items-start gap-2">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" strokeWidth={1.75} />
        <div className="space-y-1">
          <h5 className="font-bold text-[13px] text-amber-900">
            تنبيه أمان Firebase: النطاق يحتاج إلى تصريح للدخول بـ Google / Facebook
          </h5>
          <p className="text-amber-800 leading-relaxed text-[11px]">
            لحماية تطبيقك، يطلب Firebase إضافة رابط النطاق الحالي إلى قائمة <strong>النطاقات المصرح بها (Authorized domains)</strong> قبل السماح بتسجيل الدخول السريع عبر Google أو Facebook.
          </p>
        </div>
      </div>

      {/* Copy domain bar */}
      <div className="p-2 bg-white/90 border border-amber-300 rounded-[8px] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] text-slate-500 shrink-0 font-medium">النطاق المطلوب إضافته:</span>
          <code className="text-[11px] font-mono text-[#0A4D2E] font-bold truncate select-all" dir="ltr">
            {currentDomain}
          </code>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="h-7 px-2.5 bg-[#EEF6F1] hover:bg-[#DDE3DF] active:bg-[#C9D6CE] text-[#0A4D2E] text-[11px] font-bold rounded-[6px] shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'تم النسخ ✓' : 'نسخ النطاق'}</span>
        </button>
      </div>

      {/* Steps to resolve */}
      <div className="space-y-1 text-[11px] text-amber-900 pr-1">
        <div className="font-bold text-amber-950">خطوات الحل في دقيقة واحدة:</div>
        <ol className="list-decimal list-inside space-y-1 leading-relaxed text-[11px]">
          <li>
            افتح لوحة إعدادات Firebase مباشرة بالضغط على الزر أدناه.
          </li>
          <li>
            انزل إلى قسم <strong>"Authorized domains"</strong> واضغط <strong>"Add domain"</strong>.
          </li>
          <li>
            الصق النطاق الذي نسخته <code className="font-mono font-bold" dir="ltr">{currentDomain}</code> ثم اضغط <strong>Save</strong>.
          </li>
        </ol>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
        <a
          href={consoleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:flex-1 h-9 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-[8px] text-[12px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>فتح إعدادات Firebase Console</span>
          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
        </a>

        {onSwitchToEmailForm && (
          <button
            type="button"
            onClick={onSwitchToEmailForm}
            className="w-full sm:w-auto h-9 px-3 bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 font-bold rounded-[8px] text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Mail className="w-3.5 h-3.5 text-[#0F6B3F]" strokeWidth={1.75} />
            <span>التسجيل بالبريد فوراً (بدون إعداد)</span>
          </button>
        )}
      </div>

      <p className="text-[10px] text-amber-700/90 text-center pt-0.5">
        💡 <strong>معلومة:</strong> التسجيل بالبريد الإلكتروني وكلمة المرور أدناه يعمل مباشرة وفوراً دون الحاجة لإضافة النطاق.
      </p>
    </div>
  );
};
