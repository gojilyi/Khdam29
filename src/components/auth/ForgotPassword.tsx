import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { translateFirebaseError } from '../../services/authService';

interface ForgotPasswordProps {
  onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err: any) {
      setError(translateFirebaseError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h4 className="text-[16px] font-bold text-[#1C2421]">استعادة كلمة المرور</h4>
        <p className="text-[12px] text-[#5B6660]">
          أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-[#C62828] text-[12px] rounded-[8px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="p-4 bg-[#EEF6F1] border border-[#DDE3DF] rounded-[12px] text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#0F6B3F] text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div className="space-y-1">
            <h5 className="text-[14px] font-bold text-[#0A4D2E]">تم إرسال رابط الاستعادة!</h5>
            <p className="text-[12px] text-[#5B6660]">
              يرجى التحقق من صندوق الوارد في بريدك <span dir="ltr" className="font-bold text-[#1C2421]">{email}</span> واتباع التعليمات.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="w-full h-10 bg-[#0F6B3F] hover:bg-[#0A4D2E] text-white font-bold rounded-[8px] text-[13px] transition-colors cursor-pointer"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[12px] font-bold text-[#1C2421] mb-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="name@example.dz"
                className="w-full h-11 bg-white border border-[#DDE3DF] rounded-[8px] px-3 pr-10 text-[13px] text-[#1C2421] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F]"
              />
              <Mail className="w-4 h-4 text-[#5B6660] absolute right-3 top-1/2 -translate-y-1/2" strokeWidth={1.75} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#0F6B3F] hover:bg-[#0A4D2E] disabled:opacity-50 text-white font-bold rounded-[8px] text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>{loading ? 'جاري الإرسال...' : 'إرسال رابط استعادة كلمة المرور'}</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-center text-[12px] text-[#5B6660] hover:text-[#1C2421] inline-flex items-center justify-center gap-1 cursor-pointer pt-1"
          >
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>الرجوع لشاشة الدخول</span>
          </button>
        </form>
      )}
    </div>
  );
};
