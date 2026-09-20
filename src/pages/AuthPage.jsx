import React, { useState } from 'react';
import { User, LogIn, UserPlus, LogOut, ShieldCheck, Sparkles, Volume2, Globe, Check } from 'lucide-react';
import { loginUser, signUpUser, loginAsGuest, logoutUser, updateUserProfile } from '../services/supabaseClient';

export default function AuthPage({ currentUser, setCurrentUser }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile preferences
  const [speechSpeed, setSpeechSpeed] = useState(currentUser?.speechSpeed || 1.0);
  const [prefLang, setPrefLang] = useState(currentUser?.preferredLanguage || 'en-US');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const user = await signUpUser(name, email, password);
      setCurrentUser(user);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    const guest = await loginAsGuest();
    setCurrentUser(guest);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  const handleSaveProfile = async () => {
    const updated = await updateUserProfile({
      name: currentUser?.name,
      speechSpeed,
      preferredLanguage: prefLang
    });
    setCurrentUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // If user is already logged in, show Profile Page
  if (currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-soft space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-purpleBrand-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-glow">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {currentUser.name || 'SignBridge Advocate'}
                  {currentUser.isGuest && (
                    <span className="text-xs px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">
                      Guest Session
                    </span>
                  )}
                </h1>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-rose-200"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          {/* Preferences Form */}
          <div className="space-y-6">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Accessibility & Speech Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-brand-600" /> Speech Rate ({speechSpeed}x)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={speechSpeed}
                  onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purpleBrand-600" /> Preferred Spoken Language
                </label>
                <select
                  value={prefLang}
                  onChange={(e) => setPrefLang(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish (Español)</option>
                  <option value="fr-FR">French (Français)</option>
                </select>
              </div>

            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">Settings automatically sync to Supabase database.</span>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : null}
                {savedSuccess ? 'Saved ✓' : 'Save Preferences'}
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fade-in">
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl space-y-6">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-purpleBrand-600 text-white flex items-center justify-center font-extrabold text-3xl mx-auto shadow-glow">
            🤟
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SignBridge AI Account</h1>
          <p className="text-xs text-slate-500">Sign in to sync your conversation history and preferences.</p>
        </div>

        {/* Auth Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'login' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'signup' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200">
            {errorMsg}
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.johnson@example.com"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> {loading ? 'Signing In...' : 'Log In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.johnson@example.com"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> {loading ? 'Creating Account...' : 'Sign Up Account'}
            </button>
          </form>
        )}

        {/* Demo / Guest Account Divider */}
        <div className="relative pt-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
            <span className="bg-white dark:bg-slate-900 px-3">Instant Hackathon Access</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-purpleBrand-600" /> Continue as Guest Advocate
        </button>

      </div>

    </div>
  );
}
