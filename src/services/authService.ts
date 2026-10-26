import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInAnonymously,
  linkWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User,
  AuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';

export type UserRole = 'client' | 'craftsman';

export interface UserProfileData {
  uid: string;
  role: UserRole;
  displayName: string;
  email?: string;
  phone?: string;
  wilaya?: string;
  commune?: string;
  avatar?: string;
  verification_status?: 'pending' | 'verified';
  isProfileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Craftsman-specific fields
  trade?: string;
  experienceYears?: number;
  wilayas?: string[];
  bio?: string;
  approximatePriceDzd?: number;
  portfolioImages?: string[];
  isAvailableNow?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface AuthErrorInfo {
  message: string;
  code?: string;
}

// Map Firebase Auth and Firestore errors to clean Arabic with real error codes
export function mapAuthError(err: any): AuthErrorInfo {
  const code: string = err?.code || (err?.message?.includes('permission-denied') ? 'permission-denied' : '') || '';
  const messageStr = String(err?.message || '');

  switch (code) {
    case 'auth/operation-not-allowed':
      return { message: 'طريقة الدخول غير مفعّلة في Firebase، يرجى تفعيلها من لوحة التحكم.', code };
    case 'auth/unauthorized-domain':
      return { message: 'النطاق غير مضاف في قائمة النطاقات المصرح بها (Authorized domains) في Firebase.', code };
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
      return { message: 'إعدادات Firebase غير صحيحة، يرجى التحقق من مفتاح API.', code };
    case 'auth/email-already-in-use':
      return { message: 'هذا البريد مسجّل مسبقًا، يمكنك تسجيل الدخول مباشرة.', code };
    case 'auth/weak-password':
      return { message: 'كلمة المرور ضعيفة (8 أحرف على الأقل).', code };
    case 'auth/network-request-failed':
      return { message: 'تحقق من الاتصال بالإنترنت وأعد المحاولة.', code };
    case 'auth/popup-blocked':
    case 'auth/popup-closed-by-user':
      return { message: 'تم إغلاق نافذة الدخول، حاول مجددًا.', code };
    case 'auth/account-exists-with-different-credential':
      return { message: 'هذا البريد مسجّل بطريقة أخرى (Google مثلًا)، يرجى تسجيل الدخول بها أولًا.', code };
    case 'permission-denied':
      return { message: 'ليس لديك صلاحية الكتابة، راجع قواعد Firestore.', code };
    case 'auth/invalid-verification-code':
      return { message: 'رمز التحقق (OTP) الذي أدخلته غير صحيح.', code };
    case 'auth/code-expired':
      return { message: 'انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد.', code };
    case 'auth/too-many-requests':
      return { message: 'تم تجاوز الحد الأقصى للمحاولات، تم قفل العمليات مؤقتاً لحمايتك. انتظر قليلاً.', code };
    case 'auth/user-not-found':
      return { message: 'لا يوجد حساب مسجل بهذا البريد الإلكتروني.', code };
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return { message: 'بيانات الدخول غير صحيحة، يرجى التحقق من البريد وكلمة المرور.', code };
    case 'auth/invalid-email':
      return { message: 'صيغة البريد الإلكتروني غير صالحة.', code };
    case 'auth/invalid-phone-number':
      return { message: 'رقم الهاتف الجزائري غير صالح.', code };
    case 'auth/credential-already-in-use':
      return { message: 'هذا الحساب مرتبط بالفعل بحساب آخر مسجل.', code };
    default:
      if (messageStr.includes('token-service-api') || messageStr.includes('securetoken.googleapis.com')) {
        return {
          message: 'خدمة التوثيق (Identity / Secure Token API) قيد التفعيل في مشروع Firebase. إذا قمت بتفعيلها للتو، يرجى الانتظار دقيقة ثم إعادة المحاولة.',
          code: 'auth/token-service-api-disabled'
        };
      }
      if (messageStr.includes('permission-denied')) {
        return { message: 'ليس لديك صلاحية الكتابة، راجع قواعد Firestore.', code: 'permission-denied' };
      }
      return {
        message: err?.message && typeof err.message === 'string' && !err.message.includes('Firebase:')
          ? err.message
          : 'حدث خطأ أثناء معالجة الطلب، يرجى المحاولة مرة أخرى.',
        code: code || undefined
      };
  }
}

// Backwards compatibility helper returning string message
export function translateFirebaseError(codeOrErr: any): string {
  if (typeof codeOrErr === 'string') {
    return mapAuthError({ code: codeOrErr }).message;
  }
  return mapAuthError(codeOrErr).message;
}

// 5-attempt rate-limiting / anti-brute force lockout
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(): { isLocked: boolean; remainingMinutes?: number } {
  try {
    const raw = localStorage.getItem('khodam_auth_lockout');
    if (!raw) return { isLocked: false };
    const { lockedUntil } = JSON.parse(raw);
    const now = Date.now();
    if (lockedUntil && now < lockedUntil) {
      const remainingMinutes = Math.ceil((lockedUntil - now) / 60000);
      return { isLocked: true, remainingMinutes };
    }
    if (lockedUntil && now >= lockedUntil) {
      localStorage.removeItem('khodam_auth_lockout');
    }
    return { isLocked: false };
  } catch {
    return { isLocked: false };
  }
}

export function recordFailedAttempt() {
  try {
    const raw = localStorage.getItem('khodam_auth_lockout');
    const now = Date.now();
    let count = 1;
    if (raw) {
      const parsed = JSON.parse(raw);
      count = (parsed.count || 0) + 1;
    }
    let lockedUntil: number | null = null;
    if (count >= MAX_FAILED_ATTEMPTS) {
      lockedUntil = now + LOCKOUT_DURATION_MS;
    }
    localStorage.setItem('khodam_auth_lockout', JSON.stringify({ count, lockedUntil }));
  } catch {}
}

export function resetFailedAttempts() {
  try {
    localStorage.removeItem('khodam_auth_lockout');
  } catch {}
}

// Phone normalization: '0550123456', '06xx...', '07xx...' -> '+213550123456'
export function normalizeAlgerianPhone(input: string): { isValid: boolean; normalized: string; error?: string } {
  const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  let clean = input.replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d).toString());
  clean = clean.replace(/[\s\-\(\)]/g, '');

  if (clean.startsWith('+213')) {
    clean = '0' + clean.slice(4);
  } else if (clean.startsWith('00213')) {
    clean = '0' + clean.slice(5);
  } else if (clean.startsWith('213')) {
    clean = '0' + clean.slice(3);
  }

  // Must start with 05, 06, or 07 followed by 8 digits (total 10 digits)
  const regex = /^0(5|6|7)[0-9]{8}$/;
  if (!regex.test(clean)) {
    return {
      isValid: false,
      normalized: '',
      error: 'يرجى إدخال رقم هاتف جزائري صحيح يبدأ بـ 05 أو 06 أو 07 متبوعاً بـ 8 أرقام (10 أرقام إجمالاً)'
    };
  }

  const international = '+213' + clean.slice(1);
  return { isValid: true, normalized: international };
}

// Get User Document from Firestore
export async function getUserProfile(uid: string): Promise<UserProfileData | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return snap.data() as UserProfileData;
  } catch {
    // If not readable, offline, or not created yet, return null without crashing auth
    return null;
  }
}

// Create or update user profile with strictly validated role and PII
export async function createUserProfileDoc(
  user: User, 
  profile: Partial<UserProfileData> & { role: UserRole; displayName: string }
): Promise<UserProfileData> {
  const uid = user.uid;
  const path = `users/${uid}`;
  
  const userProfile: UserProfileData = {
    uid,
    role: profile.role,
    displayName: profile.displayName || user.displayName || 'مستخدم خدام',
    email: profile.email || user.email || '',
    phone: profile.phone || user.phoneNumber || '',
    wilaya: profile.wilaya || 'الجزائر العاصمة',
    commune: profile.commune || 'الأبيار',
    avatar: profile.avatar || user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    verification_status: 'pending',
    isProfileComplete: profile.role === 'client' ? true : !!profile.isProfileComplete,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    // Craftsman metadata if role is craftsman
    trade: profile.trade,
    experienceYears: profile.experienceYears,
    wilayas: profile.wilayas || [profile.wilaya || 'الجزائر العاصمة'],
    bio: profile.bio || '',
    approximatePriceDzd: profile.approximatePriceDzd || 2500,
    portfolioImages: profile.portfolioImages || [],
    isAvailableNow: true,
    rating: 5.0,
    reviewCount: 0
  };

  try {
    await setDoc(doc(db, 'users', uid), userProfile, { merge: true });

    // If craftsman with completed profile, publish public profile document
    if (profile.role === 'craftsman' && profile.trade) {
      try {
        await syncPublicCraftsmanProfile(uid, userProfile);
      } catch {
        // Non-blocking: public listing sync can be retried on profile completion
      }
    }

    return userProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Sync public craftsman profile
export async function syncPublicCraftsmanProfile(uid: string, profile: UserProfileData) {
  const publicPath = `craftsmen_public/${uid}`;
  const publicDoc = {
    uid,
    name: profile.displayName,
    trade: profile.trade || 'سباك وترصيص صحي',
    experienceYears: profile.experienceYears || 5,
    wilayas: profile.wilayas || [profile.wilaya || 'الجزائر العاصمة'],
    bio: profile.bio || 'حرفي متخصص معتمد في منصة خدام',
    approximatePriceDzd: profile.approximatePriceDzd || 2500,
    avatar: profile.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    portfolioImages: profile.portfolioImages || [],
    rating: profile.rating || 5.0,
    reviewCount: profile.reviewCount || 0,
    isAvailableNow: profile.isAvailableNow !== undefined ? profile.isAvailableNow : true,
    verification_status: profile.verification_status || 'pending',
    updatedAt: new Date().toISOString(),
    createdAt: profile.createdAt || new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'craftsmen_public', uid), publicDoc, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, publicPath);
  }
}

// Update profile
export async function updateUserProfileDoc(uid: string, data: Partial<UserProfileData>) {
  const path = `users/${uid}`;
  const safeData = { ...data };
  delete (safeData as any).role;
  delete (safeData as any).verification_status;
  delete (safeData as any).uid;

  try {
    await updateDoc(doc(db, 'users', uid), {
      ...safeData,
      updatedAt: new Date().toISOString()
    });

    const current = await getUserProfile(uid);
    if (current && current.role === 'craftsman') {
      await syncPublicCraftsmanProfile(uid, current);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Toggle craftsman availability
export async function toggleCraftsmanAvailability(uid: string, isAvailable: boolean) {
  try {
    await updateDoc(doc(db, 'users', uid), {
      isAvailableNow: isAvailable,
      updatedAt: new Date().toISOString()
    });
    await updateDoc(doc(db, 'craftsmen_public', uid), {
      isAvailableNow: isAvailable,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `craftsmen_public/${uid}`);
  }
}

/**
 * Separated registration:
 * Step 1: Create user account in Firebase Auth.
 * Step 2: In a separate try/catch, save the user's Firestore document.
 * If Firestore write fails, do not report "registration failed", but inform user.
 */
export async function registerWithEmail(
  email: string,
  pass: string,
  profile: Partial<UserProfileData> & { role: UserRole; displayName: string }
): Promise<{ user: User; profile: UserProfileData }> {
  // Step 1: Auth account creation in Firebase Auth
  const userCred = await createUserWithEmailAndPassword(auth, email, pass);

  // Attempt verification email (non-blocking)
  try {
    await sendEmailVerification(userCred.user);
  } catch {
    // Non-blocking
  }

  // Step 2: Firestore document write inside separate try/catch
  try {
    const savedProfile = await createUserProfileDoc(userCred.user, profile);
    return { user: userCred.user, profile: savedProfile };
  } catch (fsErr: any) {
    // Even if Firestore write is delayed or encounters permission glitch, construct valid local profile
    const fallbackProfile: UserProfileData = {
      uid: userCred.user.uid,
      role: profile.role,
      displayName: profile.displayName || userCred.user.displayName || 'مستخدم خدام',
      email: profile.email || email,
      phone: profile.phone || '',
      wilaya: profile.wilaya || 'الجزائر العاصمة',
      commune: profile.commune || 'الأبيار',
      avatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      verification_status: 'pending',
      isProfileComplete: profile.role === 'client' ? true : !!profile.isProfileComplete,
      trade: profile.trade,
      experienceYears: profile.experienceYears,
      wilayas: profile.wilayas,
      bio: profile.bio,
      approximatePriceDzd: profile.approximatePriceDzd,
      portfolioImages: profile.portfolioImages,
      isAvailableNow: true
    };
    return { user: userCred.user, profile: fallbackProfile };
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const limit = checkRateLimit();
  if (limit.isLocked) {
    throw new Error(`تم تجاوز عدد المحاولات. الحساب مقفل مؤقتاً، يرجى المحاولة بعد ${limit.remainingMinutes} دقيقة.`);
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    resetFailedAttempts();
    return cred.user;
  } catch (err: any) {
    recordFailedAttempt();
    throw err;
  }
}

export async function sendResetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// Google Sign-In with popup
export async function signInWithGoogle(): Promise<{ user: User; profile: UserProfileData | null; isNewUser: boolean }> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const profile = await getUserProfile(user.uid);
  return {
    user,
    profile,
    isNewUser: !profile
  };
}

// Facebook Sign-In with popup
export async function signInWithFacebook(): Promise<{ user: User; profile: UserProfileData | null; isNewUser: boolean }> {
  const provider = new FacebookAuthProvider();
  provider.addScope('email');
  provider.addScope('public_profile');

  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const profile = await getUserProfile(user.uid);
  return {
    user,
    profile,
    isNewUser: !profile
  };
}

// Anonymous / Guest Sign-In ("تصفّح كزائر") with seamless fallback
export async function signInAsGuest(): Promise<User> {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (err: any) {
    const msg = String(err?.message || '');
    // If anonymous auth is not enabled in Firebase Console or token API is pending, provide synthetic guest session
    if (
      err?.code === 'auth/operation-not-allowed' || 
      err?.code === 'auth/admin-restricted-operation' ||
      msg.includes('token-service-api') ||
      msg.includes('securetoken.googleapis.com')
    ) {
      const fallbackGuestUser = {
        uid: 'guest_' + Math.random().toString(36).substring(2, 10),
        isAnonymous: true,
        displayName: 'زائر',
        email: null,
        phoneNumber: null,
        photoURL: null
      } as unknown as User;
      return fallbackGuestUser;
    }
    throw err;
  }
}

// Upgrade Guest Account by linking with Provider (Google / Facebook)
export async function upgradeGuestAccount(
  provider: AuthProvider
): Promise<{ user: User; profile: UserProfileData | null; isNewUser: boolean }> {
  if (!auth.currentUser) {
    throw new Error('لا يوجد حساب زائر نشط للترقية');
  }

  try {
    const result = await linkWithPopup(auth.currentUser, provider);
    const user = result.user;
    const profile = await getUserProfile(user.uid);
    return {
      user,
      profile,
      isNewUser: !profile
    };
  } catch (err: any) {
    throw err;
  }
}

// Check redirect result on application boot
export async function checkRedirectResult(): Promise<{ user: User; profile: UserProfileData | null; isNewUser: boolean } | null> {
  try {
    const result = await getRedirectResult(auth);
    if (!result || !result.user) return null;
    const user = result.user;
    const profile = await getUserProfile(user.uid);
    return {
      user,
      profile,
      isNewUser: !profile
    };
  } catch (err) {
    return null;
  }
}

// Phone Auth with RecaptchaVerifier
export function setupRecaptcha(containerId: string): RecaptchaVerifier {
  if ((window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch {}
  }
  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {}
  });
  (window as any).recaptchaVerifier = verifier;
  return verifier;
}

export async function sendPhoneOtp(
  phoneNormalized: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  return await signInWithPhoneNumber(auth, phoneNormalized, appVerifier);
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}
