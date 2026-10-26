import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User, ConfirmationResult, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  UserProfileData,
  UserRole,
  getUserProfile,
  createUserProfileDoc,
  updateUserProfileDoc,
  signInWithGoogle as authSignInWithGoogle,
  signInWithFacebook as authSignInWithFacebook,
  signInAsGuest as authSignInAsGuest,
  upgradeGuestAccount as authUpgradeGuestAccount,
  checkRedirectResult,
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
  isAnonymous: boolean;
  isProfileComplete: boolean;

  // Actions
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    pass: string,
    profileData: Partial<UserProfileData> & { role: UserRole; displayName: string }
  ) => Promise<void>;
  loginWithGoogle: () => Promise<{ user: User; profile: UserProfileData | null; isNewUser: boolean }>;
  loginWithFacebook: () => Promise<{ user: User; profile: UserProfileData | null; isNewUser: boolean }>;
  loginAsGuest: () => Promise<User>;
  upgradeGuest: (provider: 'google' | 'facebook') => Promise<{ isNewUser: boolean }>;
  completeInitialProfile: (role: UserRole, displayName?: string) => Promise<UserProfileData>;
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

  // Pending redirect destination & guard messaging
  postLoginRedirect: string | null;
  authModalPrompt: string | null;
  setPostLoginRedirect: (tab: string | null) => void;
  setAuthModalPrompt: (msg: string | null) => void;
  openAuthModalWithRedirect: (targetTab?: string, message?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [postLoginRedirect, setPostLoginRedirect] = useState<string | null>(null);
  const [authModalPrompt, setAuthModalPrompt] = useState<string | null>(null);

  const refreshProfile = async () => {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
      setProfile(null);
      return;
    }
    const prof = await getUserProfile(auth.currentUser.uid);
    setProfile(prof);
  };

  useEffect(() => {
    // Check if returning from redirect sign-in
    checkRedirectResult().then((res) => {
      if (res && res.user) {
        setUser(res.user);
        if (res.profile) {
          setProfile(res.profile);
        }
      }
    }).catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && !currentUser.isAnonymous) {
        try {
          const userProfile = await getUserProfile(currentUser.uid);
          setProfile(userProfile);
        } catch {
          // Handled gracefully
        }
      } else {
        // Guest user or signed out
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const credUser = await authLoginWithEmail(email, pass);
    setUser(credUser);
    let prof = await getUserProfile(credUser.uid);
    if (!prof) {
      try {
        prof = await createUserProfileDoc(credUser, {
          role: 'client',
          displayName: credUser.displayName || email.split('@')[0] || 'مستخدم خدام',
          email: credUser.email || email,
          phone: credUser.phoneNumber || ''
        });
      } catch {
        prof = {
          uid: credUser.uid,
          role: 'client',
          displayName: credUser.displayName || email.split('@')[0] || 'مستخدم خدام',
          email: credUser.email || email,
          phone: credUser.phoneNumber || '',
          verification_status: 'pending',
          isProfileComplete: true
        };
      }
    }
    setProfile(prof);
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    profileData: Partial<UserProfileData> & { role: UserRole; displayName: string }
  ) => {
    const { user: newUser, profile: newProfile } = await authRegisterWithEmail(email, pass, profileData);
    setUser(newUser);
    setProfile(newProfile);
  };

  const loginWithGoogle = async () => {
    const result = await authSignInWithGoogle();
    setUser(result.user);
    if (result.profile) {
      setProfile(result.profile);
    }
    return result;
  };

  const loginWithFacebook = async () => {
    const result = await authSignInWithFacebook();
    setUser(result.user);
    if (result.profile) {
      setProfile(result.profile);
    }
    return result;
  };

  const loginAsGuest = async () => {
    const guestUser = await authSignInAsGuest();
    setUser(guestUser);
    setProfile(null);
    return guestUser;
  };

  const upgradeGuest = async (providerName: 'google' | 'facebook') => {
    const provider = providerName === 'google' 
      ? new GoogleAuthProvider() 
      : new FacebookAuthProvider();
    const result = await authUpgradeGuestAccount(provider);
    setUser(result.user);
    if (result.profile) {
      setProfile(result.profile);
    }
    return { isNewUser: result.isNewUser };
  };

  const completeInitialProfile = async (role: UserRole, displayName?: string) => {
    if (!auth.currentUser) throw new Error('لا يوجد مستخدم مسجل');
    try {
      const newProf = await createUserProfileDoc(auth.currentUser, {
        role,
        displayName: displayName || auth.currentUser.displayName || (role === 'craftsman' ? 'حرفي جديد' : 'طالب خدمة'),
        email: auth.currentUser.email || '',
        phone: auth.currentUser.phoneNumber || '',
        avatar: auth.currentUser.photoURL || undefined
      });
      setProfile(newProf);
      return newProf;
    } catch {
      const fallbackProf: UserProfileData = {
        uid: auth.currentUser.uid,
        role,
        displayName: displayName || auth.currentUser.displayName || (role === 'craftsman' ? 'حرفي جديد' : 'طالب خدمة'),
        email: auth.currentUser.email || '',
        phone: auth.currentUser.phoneNumber || '',
        avatar: auth.currentUser.photoURL || undefined,
        verification_status: 'pending',
        isProfileComplete: true
      };
      setProfile(fallbackProf);
      return fallbackProf;
    }
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
      try {
        existingProfile = await createUserProfileDoc(phoneUser, {
          role: intendedRole,
          displayName: displayName || (intendedRole === 'craftsman' ? 'حرفي جديد' : 'طالب خدمة'),
          phone: phoneUser.phoneNumber || ''
        });
      } catch {
        existingProfile = {
          uid: phoneUser.uid,
          role: intendedRole,
          displayName: displayName || (intendedRole === 'craftsman' ? 'حرفي جديد' : 'طالب خدمة'),
          phone: phoneUser.phoneNumber || '',
          verification_status: 'pending',
          isProfileComplete: true
        };
      }
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

  const openAuthModalWithRedirect = (targetTab?: string, message?: string) => {
    if (targetTab) {
      setPostLoginRedirect(targetTab);
    }
    if (message) {
      setAuthModalPrompt(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role || null,
        loading,
        isLoggedIn: !!user && !user.isAnonymous,
        isAnonymous: !!user?.isAnonymous,
        isProfileComplete: profile?.role === 'client' ? true : !!profile?.isProfileComplete,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithFacebook,
        loginAsGuest,
        upgradeGuest,
        completeInitialProfile,
        requestPhoneOtp,
        confirmPhoneOtp,
        logout,
        resetPassword,
        updateProfile,
        toggleAvailability,
        refreshProfile,
        postLoginRedirect,
        authModalPrompt,
        setPostLoginRedirect,
        setAuthModalPrompt,
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
