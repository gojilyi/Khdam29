import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackPrompt?: string;
  targetTabName?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPrompt = 'هذه الميزة تتطلب تسجيل الدخول لمتابعة طلبك أو مراسلة الحرفيين بأمان.',
  targetTabName
}) => {
  const { isLoggedIn, role, loading, setPostLoginRedirect } = useAuth();
  const { setIsAuthModalOpen } = useApp();

  if (loading) {
    return (
      <div className="p-8 text-center text-[#5B6660] text-[13px] flex items-center justify-center gap-2">
        <span className="w-4 h-4 border-2 border-[#0F6B3F] border-t-transparent rounded-full animate-spin" />
        <span>جاري التحقق من الحساب...</span>
      </div>
    );
  }

  // Not logged in: Show elegant prompt
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-8 p-6 bg-white border border-[#DDE3DF] rounded-[12px] shadow-[0_1px_2px_rgba(28,36,33,0.05)] text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" strokeWidth={1.75} />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[18px] font-bold text-[#1C2421]">تسجيل الدخول مطلوب</h3>
          <p className="text-[13px] text-[#5B6660] leading-relaxed">
            {fallbackPrompt}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (targetTabName) {
              setPostLoginRedirect(targetTabName);
            }
            setIsAuthModalOpen(true);
          }}
          className="w-full h-11 bg-[#0F6B3F] hover:bg-[#0A4D2E] text-white font-bold rounded-[8px] text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>تسجيل الدخول أو فتح حساب جديد</span>
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-[#5B6660] pt-2 border-t border-[#DDE3DF]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0F6B3F]" strokeWidth={1.75} />
          <span>حماية مشددة لخصوصية بياناتك ورقم هاتفك في الجزائر</span>
        </div>
      </div>
    );
  }

  // If specific role is required (e.g., craftsman-only screen)
  if (requiredRole && role !== requiredRole) {
    return (
      <div className="max-w-md mx-auto my-8 p-6 bg-white border border-[#DDE3DF] rounded-[12px] text-center space-y-3">
        <h3 className="text-[16px] font-bold text-[#1C2421]">هذه الواجهة مخصصة لحسابات {requiredRole === 'craftsman' ? 'الحرفيين' : 'الزبائن'}</h3>
        <p className="text-[12px] text-[#5B6660]">
          أنت مسجل حالياً بحساب {role === 'craftsman' ? 'حرفي' : 'طالب خدمة'}. لا يمكن تغيير دور الحساب تلقائياً.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
