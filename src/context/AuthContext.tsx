import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User, ConfirmationResult } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  UserProfileData,
  UserRole,
  getUserProfile,
  createUserProfileDoc,
  updateUserProfileDoc,
  signInWithGoogle as authSignInWithGoogle,
  loginWithEmail as authLoginWithEmail,
  registerWithEmail as authRegisterWithEmail,
  sendResetPassword as authSendResetPassword,
  signOutUser,
  setupRecaptcha,
  sendPhoneOtp as authSendPhoneOtp,
  normalizeAlgerianPhone,
  toggleCraftsmanAvailability
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  role: UserRole | null;
  loading: boolean;
  isLoggedIn: boolean;
  isProfileComplete: boolean;

  // Actions
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    pass: string,
    profileData: Partial<UserProfileData> & { role: UserRole; displayName: string }
  ) => Promise<void>;
  loginWithGoogle: (intendedRole?: UserRole) => Promise<{ isNewUser: boolean }>;
  requestPhoneOtp: (phoneRaw: string, containerId: string) => Promise<ConfirmationResult>;
  confirmPhoneOtp: (
    confirmationResult: ConfirmationResult,
    otpCode: string,
    intendedRole?: UserRole,
    displayName?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfileData>) => Promise<void>;
  toggleAvailability: (available: boolean) => Promise<void>;
  refreshProfile: () => Promise<void>;

  // Pending redirect destination for guest route guards
  postLoginRedirect: string | null;
  setPostLoginRedirect: (tab: string | null) => void;
  openAuthModalWithRedirect: (targetTab?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [postLoginRedirect, setPostLoginRedirect] = useState<string | null>(null);

  const refreshProfile = async () => {
    if (!auth.currentUser) {
      setProfile(null);
      return;
    }
    const prof = await getUserProfile(auth.currentUser.uid);
    setProfile(prof);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userProfile = await getUserProfile(currentUser.uid);
          setProfile(userProfile);
        } catch {
          // Handled
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const credUser = await authLoginWithEmail(email, pass);
    setUser(credUser);
    const prof = await getUserProfile(credUser.uid);
    setProfile(prof);
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    profileData: Partial<UserProfileData> & { role: UserRole; displayName: string }
  ) => {
    const newProfile = await authRegisterWithEmail(email, pass, profileData);
    setUser(auth.currentUser);
    setProfile(newProfile);
  };

  const loginWithGoogle = async (intendedRole: UserRole = 'client') => {
    const { user: gUser, profile: gProfile, isNewUser } = await authSignInWithGoogle(intendedRole);
    setUser(gUser);
    setProfile(gProfile);
    return { isNewUser };
  };

  const requestPhoneOtp = async (phoneRaw: string, containerId: string): Promise<ConfirmationResult> => {
    const check = normalizeAlgerianPhone(phoneRaw);
    if (!check.isValid) {
      throw new Error(check.error || 'رقم هاتف غير صالح');
    }
    const verifier = setupRecaptcha(containerId);
    return await authSendPhoneOtp(check.normalized, verifier);
  };

  const confirmPhoneOtp = async (
    confirmationResult: ConfirmationResult,
    otpCode: string,
    intendedRole: UserRole = 'client',
    displayName?: string
  ) => {
    const result = await confirmationResult.confirm(otpCode);
    const phoneUser = result.user;
    setUser(phoneUser);

    let existingProfile = await getUserProfile(phoneUser.uid);
    if (!existingProfile) {
      existingProfile = await createUserProfileDoc(phoneUser, {
        role: intendedRole,
        displayName: displayName || (intendedRole === 'craftsman' ? 'حرفي جديد' : 'طالب خدمة'),
        phone: phoneUser.phoneNumber || ''
      });
    }
    setProfile(existingProfile);
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    await authSendResetPassword(email);
  };

  const updateProfile = async (data: Partial<UserProfileData>) => {
    if (!user) return;
    await updateUserProfileDoc(user.uid, data);
    await refreshProfile();
  };

  const toggleAvailability = async (available: boolean) => {
    if (!user) return;
    await toggleCraftsmanAvailability(user.uid, available);
    setProfile(prev => prev ? { ...prev, isAvailableNow: available } : null);
  };

  const openAuthModalWithRedirect = (targetTab?: string) => {
    if (targetTab) {
      setPostLoginRedirect(targetTab);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role || null,
        loading,
        isLoggedIn: !!user,
        isProfileComplete: profile?.role === 'client' ? true : !!profile?.isProfileComplete,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        requestPhoneOtp,
        confirmPhoneOtp,
        logout,
        resetPassword,
        updateProfile,
        toggleAvailability,
        refreshProfile,
        postLoginRedirect,
        setPostLoginRedirect,
        openAuthModalWithRedirect
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
