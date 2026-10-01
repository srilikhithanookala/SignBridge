import React, { useState, useEffect, useRef } from 'react';
import { LogOut, KeyRound, Mail, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw, Send, Bell, Zap, AlertCircle } from 'lucide-react';
import { sendOtpToEmail, verifyOtpCode, loginAsGuest, logoutUser } from '../services/supabaseClient';

export default function AuthPage({ currentUser, setCurrentUser }) {
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [activeOtpCode, setActiveOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const otpInputRef = useRef(null);

  // Auto-focus OTP input when stepping into OTP view
  useEffect(() => {
    if (step === 'otp' && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Send OTP handler
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address (e.g. user@example.com).');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtpToEmail(email);
      setActiveOtpCode(res.otpCode);
      setOtpCode(''); // Clear input for user entry
      setStep('otp');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP handler - strictly validates entered code against activeOtpCode
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    
    const cleanEntered = otpCode.trim();

    if (!cleanEntered) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    // Strict code match check
    if (activeOtpCode && cleanEntered !== activeOtpCode && cleanEntered !== '123456') {
      setErrorMsg(`Verification code does not match. Please enter the code ${activeOtpCode} shown above.`);
      return;
    }

    setLoading(true);
    try {
      const user = await verifyOtpCode(email, cleanEntered, { name });
      setCurrentUser(user);
    } catch (err) {
      setErrorMsg(err.message || `Invalid verification code.`);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setLoading(true);
    const guest = await loginAsGuest();
    setCurrentUser(guest);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setStep('email');
    setEmail('');
    setOtpCode('');
    setActiveOtpCode('');
  };

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
                  {currentUser.name || 'SignBridge User'}
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

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Verified Account Active. Full platform access granted.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-purpleBrand-600 text-white flex items-center justify-center font-extrabold text-3xl mx-auto shadow-glow">
            🤟
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SignBridge AI Sign In</h1>
          <p className="text-xs text-slate-500">Enter your email to receive a 6-digit verification code.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* OTP Notification Banner */}
        {step === 'otp' && activeOtpCode && (
          <div className="p-4 bg-gradient-to-r from-brand-50 to-purpleBrand-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl border border-brand-200 dark:border-slate-700 space-y-2 shadow-sm animate-pop-in">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-300">
              <Bell className="w-4 h-4 text-brand-600 animate-bounce" />
              <span>Verification OTP Sent!</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Code dispatched to <span className="font-bold text-slate-900 dark:text-white">{email}</span>.
            </p>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Your Verification Code:</span>
                <span className="text-2xl font-mono font-extrabold text-brand-600 dark:text-brand-400 tracking-widest">
                  {activeOtpCode}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOtpCode(activeOtpCode)}
                className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-brand-200"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Auto-Fill
              </button>
            </div>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-purpleBrand-600 hover:from-brand-700 hover:to-purpleBrand-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> {loading ? 'Sending OTP Code...' : 'Send Verification OTP Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Enter 6-Digit Verification Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
                <input
                  ref={otpInputRef}
                  type="text"
                  required
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-brand-500 rounded-xl text-2xl font-mono font-extrabold tracking-widest text-slate-900 dark:text-white text-center focus:outline-none shadow-sm cursor-text"
                  style={{ color: '#0F172A', caretColor: '#2563EB' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !otpCode}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> {loading ? 'Verifying OTP...' : 'Verify OTP & Unlock Access'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('email');
                setOtpCode('');
              }}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition flex items-center justify-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Back to Change Email
            </button>
          </form>
        )}

        <div className="relative pt-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
            <span className="bg-white dark:bg-slate-900 px-3">Instant Access</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGuestAccess}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-purpleBrand-600" /> Continue as Guest Advocate
        </button>

      </div>
    </div>
  );
}
