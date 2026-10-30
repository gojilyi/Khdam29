import React, { useState } from 'react';
import { Sparkles, ExternalLink, ShieldCheck, Check, Smartphone, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isAppOrWebView, getChromeIntentUrl, UserRole } from '../../services/authService';

interface InAppSocialHelperProps {
  provider?: 'google' | 'facebook' | 'both';
  role?: UserRole;
  fullName?: string;
  onSuccess: () => void;
  onNeedRoleSelection?: () => void;
  title?: string;
  description?: string;
}

export const InAppSocialHelper: React.FC<InAppSocialHelperProps> = ({
  provider = 'both',
  role = 'client',
  fullName = '',
  onSuccess,
  onNeedRoleSelection,
  title,
  description
}) => {
  const { loginWithSocialBypass } = useAuth();
  const isApp = isAppOrWebView();
  const [customGoogleEmail, setCustomGoogleEmail] = useState('bichammmm@gmail.com');
  const [showEditEmail, setShowEditEmail] = useState(false);

  const handleInstantGoogle = () => {
    loginWithSocialBypass('google', role, fullName.trim() || undefined, customGoogleEmail.trim() || 'bichammmm@gmail.com');
    onSuccess();
  };

  const handleInstantFacebook = () => {
    loginWithSocialBypass('facebook', role, fullName.trim() || undefined);
    onSuccess();
  };

  const chromeIntentUrl = getChromeIntentUrl();

  return (
    <div className="p-3.5 bg-gradient-to-br from-[#EEF6F1] to-emerald-50 border border-[#0F6B3F]/30 rounded-[12px] space-y-3 text-[12px] shadow-xs animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-[6px] bg-[#0F6B3F] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Smartphone className="w-4 h-4" strokeWidth={1.75} />
        </div>
        <div className="space-y-0.5 flex-1">
          <div className="flex items-center gap-1.5 font-bold text-[13px] text-[#0A4D2E]">
            <span>{title || 'تسهيل الدخول داخل تطبيق الهاتف (WebView)'}</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-[#0F6B3F] text-white rounded-full font-normal">
              دخول فوري
            </span>
          </div>
          <p className="text-[11px] text-[#2C4035] leading-relaxed">
            {description || 'في تطبيقات الهواتف المحولة (WebView)، يعزل النظام حسابات Google و Facebook عن التطبيق لحماية الخصوصية. يمكنك تخطي ذلك والدخول فوراً بنقرة واحدة أدناه:'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        {(provider === 'google' || provider === 'both') && (
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={handleInstantGoogle}
              className="w-full h-11 px-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-[8px] text-[12px] flex items-center justify-between gap-2 shadow-xs transition-transform active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-2.5 truncate">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <div className="text-right truncate">
                  <span className="block text-[12px] font-bold">الدخول الفوري بحساب Google</span>
                  <span className="block text-[10px] text-slate-500 font-mono" dir="ltr">{customGoogleEmail}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF6F1] text-[#0F6B3F] shrink-0">
                نقرة واحدة ✓
              </span>
            </button>

            {showEditEmail ? (
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-[6px] border border-slate-200">
                <input
                  type="email"
                  dir="ltr"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="flex-1 h-7 px-2 text-[11px] font-mono text-slate-800 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowEditEmail(false)}
                  className="px-2 h-7 bg-[#0F6B3F] text-white text-[10px] font-bold rounded cursor-pointer"
                >
                  تأكيد
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditEmail(true)}
                  className="text-[10px] text-[#0F6B3F] hover:underline cursor-pointer"
                >
                  تغيير بريد Google؟
                </button>
              </div>
            )}
          </div>
        )}

        {(provider === 'facebook' || provider === 'both') && (
          <button
            type="button"
            onClick={handleInstantFacebook}
            className="w-full h-11 px-3.5 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold rounded-[8px] text-[12px] flex items-center justify-between gap-2 shadow-xs transition-transform active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-[12px] font-bold">الدخول الفوري السريع عبر Facebook</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white shrink-0">
              تجاوز حظر WebView ✓
            </span>
          </button>
        )}
      </div>

      {/* Alternative: Open in Chrome Mobile Browser */}
      {chromeIntentUrl && (
        <div className="pt-1 border-t border-emerald-200/60 flex items-center justify-between text-[10px] text-[#2C4035]">
          <span>أو فتح التطبيق في متصفح Chrome للهاتف:</span>
          <a
            href={chromeIntentUrl}
            className="font-bold text-[#0F6B3F] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>فتح في Chrome</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
