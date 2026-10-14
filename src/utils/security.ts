/**
 * Khodam Platform Security & Admin Authentication
 * Provides cryptographic SHA-256 hashing for administrative credentials.
 * Ensures the plaintext password is never stored or exposed in code or UI.
 */

// Stored SHA-256 hash for default admin credentials
// Generated from cryptographic SHA-256 digest
const DEFAULT_ADMIN_HASH = 'fcadc1c2027e54a1171bda4959f36a76476bd0be91530942c6f5b5ada875ea6b';
const STORAGE_HASH_KEY = 'khodam_admin_pw_hash';

/**
 * Computes the SHA-256 hash of a string using the native Web Crypto API.
 */
export async function computeSHA256(plainText: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Basic fallback if crypto.subtle is unavailable
  let hash = 0;
  for (let i = 0; i < plainText.length; i++) {
    const char = plainText.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(16);
}

/**
 * Gets the current active admin password hash.
 */
export function getActiveAdminHash(): string {
  try {
    const saved = localStorage.getItem(STORAGE_HASH_KEY);
    if (saved && saved.length === 64) {
      return saved;
    }
  } catch {
    // ignore storage error
  }
  return DEFAULT_ADMIN_HASH;
}

/**
 * Verifies if the provided plaintext password matches the stored SHA-256 hash.
 */
export async function verifyAdminPassword(input: string): Promise<boolean> {
  if (!input) return false;
  try {
    const computedHash = await computeSHA256(input.trim());
    const expectedHash = getActiveAdminHash();
    return computedHash === expectedHash;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Updates the administrative password by storing its SHA-256 hash.
 */
export async function updateAdminPassword(newPassword: string): Promise<boolean> {
  if (!newPassword || newPassword.length < 6) return false;
  try {
    const newHash = await computeSHA256(newPassword.trim());
    localStorage.setItem(STORAGE_HASH_KEY, newHash);
    return true;
  } catch (error) {
    console.error('Error updating admin password:', error);
    return false;
  }
}

/**
 * Resets the admin password back to the default factory hash.
 */
export function resetAdminPassword(): void {
  try {
    localStorage.removeItem(STORAGE_HASH_KEY);
  } catch (error) {
    console.error('Error resetting admin password:', error);
  }
}

/**
 * Image file validation against oversized files and untrusted MIME types.
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'نوع الملف غير مدعوم. يرجى رفع صورة بصيغة JPG أو PNG أو WEBP.'
    };
  }

  // Max 10MB
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 10 ميجابايت.'
    };
  }

  return { isValid: true };
}

/**
 * Sanitizes input text against XSS and control characters.
 */
export function sanitizeInputText(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Sanitizes diagnostic prompt text.
 */
export function sanitizeDiagnosticPrompt(prompt: string): string {
  if (!prompt) return '';
  return sanitizeInputText(prompt).slice(0, 1000);
}

/**
 * Generates an integrity token for diagnostic verification.
 */
export function generateIntegrityToken(payload: string): string {
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `khodam_int_${hex}_${Date.now().toString(36)}`;
}
