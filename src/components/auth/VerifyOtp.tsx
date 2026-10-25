import React, { useState, useEffect } from 'react';
import { ConfirmationResult } from 'firebase/auth';
import { CheckCircle2, RotateCcw, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { translateFirebaseError } from '../../services/authService';

interface VerifyOtpProps {
  confirmationResult: ConfirmationResult | null;
  phoneNumber: string;
  onSuccess: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
}

export const VerifyOtp: React.FC<VerifyOtpProps> = ({
  phoneNumber,
  onSuccess,
  onResend,
  onBack
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index: number, val: string) => {
    const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    const clean = val.replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d).toString()).slice(-1);
    const next = [...code];
    next[index] = clean;
    setCode(next);

    // Auto-advance
    if (clean && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSuccess(fullCode);
    } catch (err: any) {
      setError(translateFirebaseError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError(null);
    try {
      await onResend();
      setCountdown(60);
      setCode(['', '', '', '', '', '']);
    } catch (err: any) {
      setError(translateFirebaseError(err.code || err.message));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-4 text-center">
      <div className="w-10 h-10 rounded-full bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center mx-auto">
        <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
      </div>

      <div className="space-y-1">
        <h4 className="text-[16px] font-bold text-[#1C2421]">تأكيد رقم الهاتف</h4>
        <p className="text-[12px] text-[#5B6660]">
          تم إرسال رسالة SMS برمز التحقق إلى الرقم <span dir="ltr" className="font-bold text-[#1C2421]">{phoneNumber}</span>
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-[#C62828] text-[12px] rounded-[8px] flex items-center gap-2 text-right">
          <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span>{error}</span>
        </div>
      )}

      {/* 6 Digit OTP Input */}
      <div className="flex justify-center gap-2 my-4" dir="ltr">
        {[0, 1, 2, 3, 4, 5].map((idx) => (
          <input
            key={idx}
            id={`otp-input-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[idx]}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-10 h-12 text-center text-[18px] font-bold font-mono border border-[#DDE3DF] rounded-[8px] focus:outline-none focus:border-[#0F6B3F] focus:ring-1 focus:ring-[#0F6B3F] bg-white text-[#1C2421]"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => handleVerify()}
        disabled={loading || code.join('').length < 6}
        className="w-full h-11 bg-[#0F6B3F] hover:bg-[#0A4D2E] disabled:opacity-50 text-white font-bold rounded-[8px] text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
        <span>{loading ? 'جاري التحقق...' : 'تأكيد الرمز والدخول'}</span>
      </button>

      {/* Resend 60s countdown */}
      <div className="pt-2">
        {countdown > 0 ? (
          <p className="text-[12px] text-[#5B6660]">
            يمكنك إعادة إرسال الرمز بعد <span className="font-bold text-[#0F6B3F]">{countdown} ثانية</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-[12px] font-bold text-[#0F6B3F] hover:text-[#0A4D2E] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>{resending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز الآن'}</span>
          </button>
        )}
      </div>

      <div className="pt-2 border-t border-[#DDE3DF]">
        <button
          type="button"
          onClick={onBack}
          className="text-[12px] text-[#5B6660] hover:text-[#1C2421] inline-flex items-center gap-1 cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>تغيير رقم الهاتف أو وسيلة الدخول</span>
        </button>
      </div>
    </div>
  );
};
