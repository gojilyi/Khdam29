import React, { useState } from 'react';
import { X, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { RoleSelect } from './auth/RoleSelect';
import { Login } from './auth/Login';
import { Register } from './auth/Register';
import { VerifyOtp } from './auth/VerifyOtp';
import { ForgotPassword } from './auth/ForgotPassword';
import { ConfirmationResult } from 'firebase/auth';
import { UserRole } from '../services/authService';

type AuthTab = 'login' | 'register';
type SubScreen = 'main' | 'role_select' | 'post_social_role' | 'otp' | 'forgot_password';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setActiveTab, setRole: setAppRole, updateUserProfile } = useApp();
  const { 
    confirmPhoneOtp, 
    requestPhoneOtp, 
    profile, 
    postLoginRedirect, 
    setPostLoginRedirect,
    authModalPrompt,
    setAuthModalPrompt,
    completeInitialProfile
  } = useAuth();

  const [activeTab, setModalTab] = useState<AuthTab>('login');
  const [subScreen, setSubScreen] = useState<SubScreen>('main');
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');
  const [completingProfile, setCompletingProfile] = useState(false);

  // Phone OTP state
  const [activePhoneNumber, setActivePhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setSubScreen('main');
    setAuthModalPrompt(null);
  };

  const handleAuthSuccess = () => {
    if (profile) {
      setAppRole(profile.role === 'craftsman' ? 'artisan' : 'client');
      updateUserProfile({
        name: profile.displayName,
        email: profile.email,
        phone: profile.phone,
        avatar: profile.avatar,
        role: profile.role === 'craftsman' ? 'artisan' : 'client',
        isLoggedIn: true
      });
    }

    setIsAuthModalOpen(false);
    setSubScreen('main');
    setAuthModalPrompt(null);

    // Handle post-login redirection if user was guarded from a specific tab
    if (postLoginRedirect) {
      setActiveTab(postLoginRedirect);
      setPostLoginRedirect(null);
    }
  };

  const handleStartOtp = (phone: string, result: ConfirmationResult) => {
    setActivePhoneNumber(phone);
    setConfirmationResult(result);
    setSubScreen('otp');
  };

  const handleOtpConfirm = async (code: string) => {
    if (!confirmationResult) return;
    await confirmPhoneOtp(confirmationResult, code, selectedRole);
    handleAuthSuccess();
  };

  const handleOtpResend = async () => {
    const res = await requestPhoneOtp(activePhoneNumber, 'recaptcha-container');
    setConfirmationResult(res);
  };

  const handleCompleteSocialRole = async () => {
    setCompletingProfile(true);
    try {
      const prof = await completeInitialProfile(selectedRole);
      setAppRole(prof.role === 'craftsman' ? 'artisan' : 'client');
      updateUserProfile({
        name: prof.displayName,
        email: prof.email,
        phone: prof.phone,
        avatar: prof.avatar,
        role: prof.role === 'craftsman' ? 'artisan' : 'client',
        isLoggedIn: true
      });
      setIsAuthModalOpen(false);
      setSubScreen('main');
      if (postLoginRedirect) {
        setActiveTab(postLoginRedirect);
        setPostLoginRedirect(null);
      }
    } catch {
      // Handled
    } finally {
      setCompletingProfile(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto" dir="rtl">
      {/* Invisible container for Firebase Phone Recaptcha */}
      <div id="recaptcha-container" />

      <div className="w-full max-w-md bg-white border border-[#DDE3DF] rounded-[16px] p-5 sm:p-6 shadow-2xl relative my-auto max-h-[92dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute left-4 top-4 p-2 text-[#5B6660] hover:text-[#1C2421] rounded-[8px] transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pb-4 border-b border-[#DDE3DF]">
          <div className="w-10 h-10 rounded-[8px] bg-[#EEF6F1] text-[#0F6B3F] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <h3 className="text-[18px] font-bold text-[#1C2421]">
            {subScreen === 'forgot_password' 
              ? 'استعادة كلمة المرور' 
              : subScreen === 'otp'
              ? 'تأكيد رمز التحقق (OTP)'
              : subScreen === 'post_social_role'
              ? 'إكمال تحديد نوع الحساب'
              : activeTab === 'login'
              ? 'تسجيل الدخول إلى خـدّام'
              : 'إنشاء حساب جديد في خـدّام'}
          </h3>
          <p className="text-[12px] text-[#5B6660]">
            {authModalPrompt || 'منصة الحرفيين والخدمات المنزلية الأولى في الجزائر'}
          </p>
        </div>

        {/* Top Tabs (Only on main screen) */}
        {subScreen === 'main' && (
          <div className="mt-4 p-1 bg-[#EEF6F1] rounded-[8px] grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => { setModalTab('login'); setSubScreen('main'); }}
              className={`h-10 text-[13px] font-bold rounded-[6px] transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-[#0A4D2E] shadow-xs'
                  : 'text-[#5B6660] hover:text-[#1C2421]'
              }`}
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              onClick={() => { setModalTab('register'); setSubScreen('role_select'); }}
              className={`h-10 text-[13px] font-bold rounded-[6px] transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white text-[#0A4D2E] shadow-xs'
                  : 'text-[#5B6660] hover:text-[#1C2421]'
              }`}
            >
              إنشاء حساب جديد
            </button>
          </div>
        )}

        <div className="mt-4">
          {/* SubScreen: Forgot Password */}
          {subScreen === 'forgot_password' && (
            <ForgotPassword onBack={() => setSubScreen('main')} />
          )}

          {/* SubScreen: OTP Verification */}
          {subScreen === 'otp' && (
            <VerifyOtp
              confirmationResult={confirmationResult}
              phoneNumber={activePhoneNumber}
              onSuccess={handleOtpConfirm}
              onResend={handleOtpResend}
              onBack={() => setSubScreen('main')}
            />
          )}

          {/* SubScreen: Role Select before Register */}
          {subScreen === 'role_select' && (
            <div className="space-y-4">
              <RoleSelect
                selectedRole={selectedRole}
                onSelect={(r) => {
                  setSelectedRole(r);
                  setSubScreen('main');
                  setModalTab('register');
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setSubScreen('main');
                  setModalTab('register');
                }}
                className="w-full h-11 min-h-[44px] bg-[#0F6B3F] hover:bg-[#0A4D2E] text-white font-bold rounded-[8px] text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>متابعة التسجيل كـ {selectedRole === 'craftsman' ? 'حرفي' : 'طالب خدمة'}</span>
                <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          )}

          {/* SubScreen: Post Social Login Role Select */}
          {subScreen === 'post_social_role' && (
            <div className="space-y-4">
              <div className="text-center p-2 bg-[#EEF6F1] rounded-[8px] text-[12px] text-[#0A4D2E] font-medium">
                تم تسجيل دخولك بنجاح! يرجى اختيار دورك لإتمام حسابك في المنصة.
              </div>
              <RoleSelect
                selectedRole={selectedRole}
                onSelect={(r) => setSelectedRole(r)}
              />
              <button
                type="button"
                onClick={handleCompleteSocialRole}
                disabled={completingProfile}
                className="w-full h-11 min-h-[44px] bg-[#0F6B3F] hover:bg-[#0A4D2E] disabled:opacity-50 text-white font-bold rounded-[8px] text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {completingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />}
                <span>{completingProfile ? 'جاري الحفظ...' : 'تأكيد والدخول إلى التطبيق'}</span>
              </button>
            </div>
          )}

          {/* SubScreen: Main screen (Login or Register) */}
          {subScreen === 'main' && activeTab === 'login' && (
            <Login
              onSwitchToRegister={() => {
                setModalTab('register');
                setSubScreen('role_select');
              }}
              onForgotPassword={() => setSubScreen('forgot_password')}
              onStartOtp={handleStartOtp}
              onSuccess={handleAuthSuccess}
              onNeedRoleSelection={() => setSubScreen('post_social_role')}
            />
          )}

          {subScreen === 'main' && activeTab === 'register' && (
            <Register
              role={selectedRole}
              onSwitchToLogin={() => {
                setModalTab('login');
                setSubScreen('main');
              }}
              onSuccess={handleAuthSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};
