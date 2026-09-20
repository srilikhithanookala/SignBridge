import React, { useState } from 'react';
import { LogIn, UserPlus, LogOut, Sparkles, KeyRound, Mail, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { sendOtpToEmail, verifyOtpCode, loginAsGuest, logoutUser } from '../services/supabaseClient';

export default function AuthPage({ currentUser, setCurrentUser, isModal = false, onCloseModal = null }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [infoMsg, setInfoMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtpToEmail(email);
      setInfoMsg(res.message);
      setStep('otp');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const user = await verifyOtpCode(email, otpCode, { name });
      setCurrentUser(user);
      if (onCloseModal) onCloseModal();
    } catch (err) {
      setErrorMsg(err.message || 'Invalid OTP code. Try master code 123456 or resend.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setLoading(true);
    const guest = await loginAsGuest();
    setCurrentUser(guest);
    if (onCloseModal) onCloseModal();
    setLoading(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setStep('email');
    setEmail('');
    setOtpCode('');
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
                  {currentUser.name || 'SignBridge Advocate'}
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
          <p className="text-xs text-slate-500">Enter your email for instant OTP verification.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200">
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="p-3 bg-brand-50 text-brand-700 rounded-xl text-xs font-semibold border border-brand-200">
            {infoMsg}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-purpleBrand-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? 'Sending OTP...' : 'Send Verification OTP Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-mono tracking-widest text-slate-900 dark:text-white text-center"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Access SignBridge'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
