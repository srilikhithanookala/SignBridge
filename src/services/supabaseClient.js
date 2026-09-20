/**
 * SignBridge AI - Supabase & Offline Demo Store Service
 * Integrates real Supabase SDK with transparent localStorage fallback for Auth, Conversations, Messages, and Feedback.
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
  CONVERSATIONS: 'signbridge_conversations',
  MESSAGES: 'signbridge_messages',
  FEEDBACK: 'signbridge_feedback',
  STATS: 'signbridge_stats'
};

// Initial Demo Seed Data
const DEFAULT_USER = {
  id: 'usr_demo_101',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  preferredLanguage: 'en-US',
  speechSpeed: 1.0,
  highContrast: false,
  isGuest: false,
  created_at: new Date().toISOString()
};

const DEFAULT_CONVERSATIONS = [
  {
    id: 'conv_1',
    user_id: 'usr_demo_101',
    title: 'Hospital Reception Check-in',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'conv_2',
    user_id: 'usr_demo_101',
    title: 'Campus Coffee Shop Order',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const DEFAULT_MESSAGES = [
  { id: 'm1', conversation_id: 'conv_1', sender: 'SignBridge User', message: 'I need to see a doctor.', input_type: 'sign', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'm2', conversation_id: 'conv_1', sender: 'Other Person', message: 'Sure, what symptoms are you experiencing?', input_type: 'speech', timestamp: new Date(Date.now() - 3600000 * 1.9).toISOString() },
  { id: 'm3', conversation_id: 'conv_1', sender: 'SignBridge User', message: 'I need help immediately.', input_type: 'sign', timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString() },
  { id: 'm4', conversation_id: 'conv_2', sender: 'SignBridge User', message: 'I want water and food.', input_type: 'sign', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'm5', conversation_id: 'conv_2', sender: 'Other Person', message: 'Sure thing, coming right up!', input_type: 'speech', timestamp: new Date(Date.now() - 3600000 * 23.9).toISOString() }
];

const DEFAULT_FEEDBACK = [
  { id: 'f1', sign: 'WATER', wasCorrect: true, userCorrection: '', timestamp: new Date().toISOString() },
  { id: 'f2', sign: 'HELP', wasCorrect: true, userCorrection: '', timestamp: new Date().toISOString() },
  { id: 'f3', sign: 'HOSPITAL', wasCorrect: false, userCorrection: 'SCHOOL', timestamp: new Date().toISOString() }
];

// Helper to load or initialize LocalStorage
function getStoredItem(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStoredItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

/* ==========================================================================
   AUTHENTICATION API
   ========================================================================== */

export async function getCurrentUser() {
  if (isSupabaseConfigured) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return user;
  }
  return getStoredItem(STORAGE_KEYS.USER, DEFAULT_USER);
}

export async function loginUser(email, password) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }

  // Local Auth Fallback
  const user = {
    id: `usr_${Date.now()}`,
    name: email.split('@')[0] || 'Member User',
    email,
    preferredLanguage: 'en-US',
    speechSpeed: 1.0,
    highContrast: false,
    isGuest: false,
    created_at: new Date().toISOString()
  };
  setStoredItem(STORAGE_KEYS.USER, user);
  return user;
}

export async function signUpUser(name, email, password) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) throw error;
    return data.user;
  }

  const user = {
    id: `usr_${Date.now()}`,
    name: name || email.split('@')[0],
    email,
    preferredLanguage: 'en-US',
    speechSpeed: 1.0,
    highContrast: false,
    isGuest: false,
    created_at: new Date().toISOString()
  };
  setStoredItem(STORAGE_KEYS.USER, user);
  return user;
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
    created_at: new Date().toISOString()
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
  const updatedUser = { ...currentUser, ...updates };
  setStoredItem(STORAGE_KEYS.USER, updatedUser);

  if (isSupabaseConfigured && !updatedUser.isGuest) {
    await supabase.from('users').upsert(updatedUser);
  }
  return updatedUser;
}

/* ==========================================================================
   CONVERSATIONS & MESSAGES API
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
    user_id: currentUser.id,
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

  if (isSupabaseConfigured) {
    try {
      await supabase.from('conversations').insert(newConv);
      await supabase.from('messages').insert(formattedMessages);
    } catch (err) {
      console.warn('Supabase save error, saved locally:', err);
    }
  }

  return newConv;
}

export async function getConversationMessages(conversationId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('timestamp', { ascending: true });
    if (!error && data) return data;
  }
  const allMsgs = getStoredItem(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  return allMsgs.filter(m => m.conversation_id === conversationId);
}

export async function deleteConversation(conversationId) {
  const currentConvs = getStoredItem(STORAGE_KEYS.CONVERSATIONS, DEFAULT_CONVERSATIONS);
  const updatedConvs = currentConvs.filter(c => c.id !== conversationId);
  setStoredItem(STORAGE_KEYS.CONVERSATIONS, updatedConvs);

  const allMsgs = getStoredItem(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  setStoredItem(STORAGE_KEYS.MESSAGES, allMsgs.filter(m => m.conversation_id !== conversationId));

  if (isSupabaseConfigured) {
    await supabase.from('conversations').delete().eq('id', conversationId);
  }
  return true;
}

/* ==========================================================================
   FEEDBACK API
   ========================================================================== */

export async function submitRecognitionFeedback(sign, wasCorrect, userCorrection = '') {
  const newFeedback = {
    id: `fb_${Date.now()}`,
    sign,
    wasCorrect,
    userCorrection,
    timestamp: new Date().toISOString()
  };

  const currentFeedback = getStoredItem(STORAGE_KEYS.FEEDBACK, DEFAULT_FEEDBACK);
  const updated = [newFeedback, ...currentFeedback];
  setStoredItem(STORAGE_KEYS.FEEDBACK, updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('feedback').insert(newFeedback);
    } catch (err) {
      console.warn('Feedback supabase save error:', err);
    }
  }
  return newFeedback;
}

export async function getFeedbackLogs() {
  return getStoredItem(STORAGE_KEYS.FEEDBACK, DEFAULT_FEEDBACK);
}

/* ==========================================================================
   DASHBOARD METRICS CALCULATOR
   ========================================================================== */

export async function getDashboardStats() {
  const conversations = await getConversations();
  const messages = getStoredItem(STORAGE_KEYS.MESSAGES, DEFAULT_MESSAGES);
  const feedback = await getFeedbackLogs();

  const totalTranslations = messages.filter(m => m.input_type === 'sign').length + 24;
  const totalConversations = conversations.length;
  
  // Accuracy rate
  const totalFeedback = feedback.length;
  const correctFeedback = feedback.filter(f => f.wasCorrect).length;
  const accuracyRate = totalFeedback > 0 ? Math.round((correctFeedback / totalFeedback) * 100) : 94;

  return {
    totalTranslations,
    totalConversations,
    accuracyRate,
    mostUsedSign: 'HELP',
    recentConversations: conversations.slice(0, 5),
    feedbackLogs: feedback.slice(0, 5)
  };
}
