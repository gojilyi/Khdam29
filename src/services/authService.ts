import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
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

// 5-attempt rate-limiting / anti-brute force lockout
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(): { isLocked: boolean; remainingMinutes?: number } {
  try {
    const raw = localStorage.getItem('khodam_auth_lockout');
    if (!raw) return { isLocked: false };
    const { count, lockedUntil } = JSON.parse(raw);
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

  // Convert to international +213 format
  const international = '+213' + clean.slice(1);
  return { isValid: true, normalized: international };
}

// Arabic translation for Firebase error codes
export function translateFirebaseError(errCode: string): string {
  switch (errCode) {
    case 'auth/user-not-found':
      return 'لا يوجد حساب مسجل بهذا البريد الإلكتروني.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'بيانات الدخول غير صحيحة، يرجى التحقق من البريد وكلمة المرور.';
    case 'auth/email-already-in-use':
      return 'البريد الإلكتروني مسجل مسبقاً، يمكنك تسجيل الدخول أو استعادة كلمة المرور.';
    case 'auth/weak-password':
      return 'كلمة المرور ضعيفة، يجب أن تحتوي على 6 أحرف أو أرقام على الأقل.';
    case 'auth/invalid-email':
      return 'صيغة البريد الإلكتروني غير صالحة.';
    case 'auth/invalid-phone-number':
      return 'رقم الهاتف غير صالح للدولة المحددة.';
    case 'auth/code-expired':
      return 'انتهت صلاحية رمز التحقق، يرجى طلب رمز جديد.';
    case 'auth/invalid-verification-code':
      return 'رمز التحقق (OTP) الذي أدخلته غير صحيح.';
    case 'auth/too-many-requests':
      return 'تم تجاوز الحد الأقصى للمحاولات، تم قفل العمليات مؤقتاً لحمايتك. حاول لاحقاً.';
    case 'auth/popup-closed-by-user':
      return 'تم إغلاق نافذة تسجيل الدخول قبل اكتمال العملية.';
    case 'auth/network-request-failed':
      return 'تعذر الاتصال بالشبكة، يرجى التأكد من اتصالك بالإنترنت.';
    case 'auth/account-exists-with-different-credential':
      return 'يوجد حساب مسجل بالفعل بنفس البريد الإلكتروني عبر وسيلة دخول أخرى.';
    default:
      return 'حدث خطأ أثناء معالجة الطلب، يرجى المحاولة مرة أخرى.';
  }
}

// User Document in Firestore
export async function getUserProfile(uid: string): Promise<UserProfileData | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return snap.data() as UserProfileData;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
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
      await syncPublicCraftsmanProfile(uid, userProfile);
    }

    return userProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Sync public craftsman profile (without private phone or direct personal PII)
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
  // Prevent role tampering from client
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

// Auth operations
export async function registerWithEmail(
  email: string,
  pass: string,
  profile: Partial<UserProfileData> & { role: UserRole; displayName: string }
): Promise<UserProfileData> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  // Send email verification
  try {
    await sendEmailVerification(cred.user);
  } catch {}
  return await createUserProfileDoc(cred.user, profile);
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

// Google Sign In with 1-click
export async function signInWithGoogle(
  intendedRole: UserRole = 'client'
): Promise<{ user: User; profile: UserProfileData; isNewUser: boolean }> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Check if profile exists
  let profile = await getUserProfile(user.uid);
  let isNewUser = false;

  if (!profile) {
    isNewUser = true;
    profile = await createUserProfileDoc(user, {
      role: intendedRole,
      displayName: user.displayName || 'مستخدم جديد',
      email: user.email || '',
      avatar: user.photoURL || undefined
    });
  }

  return { user, profile, isNewUser };
}

// Phone Auth with RecaptchaVerifier
export function setupRecaptcha(containerId: string): RecaptchaVerifier {
  // Clear any existing verifier
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
