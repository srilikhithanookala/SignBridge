import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const STORAGE_KEYS = {
  USER: 'signbridge_user',
  OTP_SESSION: 'signbridge_otp_session',
  CONVERSATIONS: 'signbridge_conversations',
  MESSAGES: 'signbridge_messages',
  FEEDBACK: 'signbridge_feedback'
};

const DEFAULT_CONVERSATIONS = [];
const DEFAULT_MESSAGES = [];
const DEFAULT_FEEDBACK = [];

function getStoredItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (err) {
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
  } catch (err) {}
}

export async function getCurrentUser() {
  return getStoredItem(STORAGE_KEYS.USER, null);
}

export async function getConversations() {
  return getStoredItem(STORAGE_KEYS.CONVERSATIONS, DEFAULT_CONVERSATIONS);
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

export async function getDashboardStats() {
  const conversations = await getConversations();
  const messages = getStoredItem(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  const feedback = getStoredItem(STORAGE_KEYS.FEEDBACK, DEFAULT_FEEDBACK);

  const totalTranslations = messages.filter(m => m.input_type === 'sign').length;
  const totalConversations = conversations.length;
  const accuracyRate = feedback.length > 0 
    ? Math.round((feedback.filter(f => f.wasCorrect).length / feedback.length) * 100) 
    : 100;

  return {
    totalTranslations,
    totalConversations,
    accuracyRate,
    mostUsedSign: messages[0]?.message || 'None yet',
    recentConversations: conversations.slice(0, 5),
    feedbackLogs: feedback.slice(0, 5)
  };
}
