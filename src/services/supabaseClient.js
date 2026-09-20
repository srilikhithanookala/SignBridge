import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const STORAGE_KEYS = {
  USER: 'signbridge_user',
  OTP_SESSION: 'signbridge_otp_session',
  CONVERSATIONS: 'signbridge_conversations',
  MESSAGES: 'signbridge_messages',
  FEEDBACK: 'signbridge_feedback'
};

function getStoredItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStoredItem(key, value) {
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export async function getCurrentUser() {
  if (isSupabaseConfigured) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return user;
  }
  return getStoredItem(STORAGE_KEYS.USER, null);
}

export async function sendOtpToEmail(email) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpSession = {
    email: email.trim().toLowerCase(),
    code: generatedOtp,
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000
  };

  setStoredItem(STORAGE_KEYS.OTP_SESSION, otpSession);

  return {
    success: true,
    otpCode: generatedOtp,
    message: `Verification OTP sent to ${email}. (Demo OTP Code: ${generatedOtp} or 123456)`
  };
}

export async function verifyOtpCode(email, enteredCode, extraInfo = {}) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = enteredCode.trim();

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanCode,
      type: 'magiclink'
    });
    if (!error && data.user) return data.user;
  }

  const storedOtpSession = getStoredItem(STORAGE_KEYS.OTP_SESSION, null);
  const isValidCode = cleanCode === '123456' || (storedOtpSession && storedOtpSession.email === cleanEmail && storedOtpSession.code === cleanCode);

  if (!isValidCode) {
    throw new Error('Invalid or expired OTP verification code. Try code 123456 or resend code.');
  }

  setStoredItem(STORAGE_KEYS.OTP_SESSION, null);

  const newUser = {
    id: `usr_${Date.now()}`,
    name: extraInfo.name || cleanEmail.split('@')[0] || 'SignBridge Advocate',
    email: cleanEmail,
    preferredLanguage: 'en-US',
    speechSpeed: 1.0,
    highContrast: false,
    isGuest: false,
    verifiedAt: new Date().toISOString()
  };

  setStoredItem(STORAGE_KEYS.USER, newUser);
  return newUser;
}

export async function loginAsGuest() {
  const guestUser = {
    id: `guest_${Date.now()}`,
    name: 'Guest Advocate',
    email: 'guest@signbridge.ai',
    preferredLanguage: 'en-US',
    speechSpeed: 1.0,
    highContrast: false,
    isGuest: true,
    verifiedAt: new Date().toISOString()
  };
  setStoredItem(STORAGE_KEYS.USER, guestUser);
  return guestUser;
}

export async function logoutUser() {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(STORAGE_KEYS.USER);
  return true;
}
