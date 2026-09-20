/**
 * SignBridge AI - Supabase & Local Storage Service
 * Clean history & dashboard state: No pre-seeded dummy history.
 * History entries appear ONLY when the user actively uses the translator or conversation mode.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Local Storage Keys
const STORAGE_KEYS = {
  USER: 'signbridge_user',
  OTP_SESSION: 'signbridge_otp_session',
  CONVERSATIONS: 'signbridge_conversations',
  MESSAGES: 'signbridge_messages',
  FEEDBACK: 'signbridge_feedback'
};

// Clear initial defaults (No dummy data!)
const DEFAULT_CONVERSATIONS = [];
const DEFAULT_MESSAGES = [];
const DEFAULT_FEEDBACK = [];

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

/* ==========================================================================
   AUTHENTICATION & OTP API
   ========================================================================== */

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

export async function updateUserProfile(updates) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  const updatedUser = { ...currentUser, ...updates };
  setStoredItem(STORAGE_KEYS.USER, updatedUser);

  if (isSupabaseConfigured && !updatedUser.isGuest) {
    await supabase.from('users').upsert(updatedUser);
  }
  return updatedUser;
}

/* ==========================================================================
   CONVERSATIONS, MESSAGES & FEEDBACK API
   ========================================================================== */

export async function getConversations() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('conversations').select('*').order('created_at', { ascending: false });
    if (!error && data) return data;
  }
  return getStoredItem(STORAGE_KEYS.CONVERSATIONS, DEFAULT_CONVERSATIONS);
}

export async function saveConversation(title, messages) {
  const convId = `conv_${Date.now()}`;
  const currentUser = await getCurrentUser();

  const newConv = {
    id: convId,
    user_id: currentUser?.id || 'usr_guest',
    title: title || `Conversation ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const currentConvs = getStoredItem(STORAGE_KEYS.CONVERSATIONS, DEFAULT_CONVERSATIONS);
  const updatedConvs = [newConv, ...currentConvs];
  setStoredItem(STORAGE_KEYS.CONVERSATIONS, updatedConvs);

  const formattedMessages = messages.map((m, idx) => ({
    id: `m_${convId}_${idx}`,
    conversation_id: convId,
    sender: m.sender,
    message: m.message,
    input_type: m.input_type || 'sign',
    timestamp: m.timestamp || new Date().toISOString()
  }));

  const currentMsgs = getStoredItem(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  setStoredItem(STORAGE_KEYS.MESSAGES, [...formattedMessages, ...currentMsgs]);

  return newConv;
}

export async function recordLiveTranslation(signName, sentenceText) {
  const messages = getStoredItem(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  const newMsg = {
    id: `m_live_${Date.now()}`,
    conversation_id: 'live_session',
    sender: 'SignBridge User',
    message: sentenceText || signName,
    input_type: 'sign',
    timestamp: new Date().toISOString()
  };
  setStoredItem(STORAGE_KEYS.MESSAGES, [newMsg, ...messages]);
}

export async function getConversationMessages(conversationId) {
  const allMsgs = getStoredItem(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  return allMsgs.filter(m => m.conversation_id === conversationId);
}

export async function deleteConversation(conversationId) {
  const currentConvs = getStoredItem(STORAGE_KEYS.CONVERSATIONS, DEFAULT_CONVERSATIONS);
  const updatedConvs = currentConvs.filter(c => c.id !== conversationId);
  setStoredItem(STORAGE_KEYS.CONVERSATIONS, updatedConvs);
  return true;
}

export async function submitRecognitionFeedback(sign, wasCorrect, userCorrection = '') {
  const newFeedback = {
    id: `fb_${Date.now()}`,
    sign,
    wasCorrect,
    userCorrection,
    timestamp: new Date().toISOString()
  };

  const currentFeedback = getStoredItem(STORAGE_KEYS.FEEDBACK, DEFAULT_FEEDBACK);
  setStoredItem(STORAGE_KEYS.FEEDBACK, [newFeedback, ...currentFeedback]);
  return newFeedback;
}

export async function getFeedbackLogs() {
  return getStoredItem(STORAGE_KEYS.FEEDBACK, DEFAULT_FEEDBACK);
}

export async function getDashboardStats() {
  const conversations = await getConversations();
  const messages = getStoredItem(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  const feedback = await getFeedbackLogs();

  const totalTranslations = messages.filter(m => m.input_type === 'sign').length;
  const totalConversations = conversations.length;
  const accuracyRate = feedback.length > 0 
    ? Math.round((feedback.filter(f => f.wasCorrect).length / feedback.length) * 100) 
    : 100;

  // Calculate most used sign from messages
  const signCounts = {};
  messages.forEach(m => {
    if (m.message) {
      signCounts[m.message] = (signCounts[m.message] || 0) + 1;
    }
  });

  const topSign = Object.keys(signCounts).sort((a,b) => signCounts[b] - signCounts[a])[0] || 'None yet';

  return {
    totalTranslations,
    totalConversations,
    accuracyRate,
    mostUsedSign: topSign,
    recentConversations: conversations.slice(0, 5),
    feedbackLogs: feedback.slice(0, 5)
  };
}
