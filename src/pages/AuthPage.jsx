import React, { useState } from 'react';
import { LogIn, UserPlus, LogOut, Sparkles, KeyRound, Mail, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw, Send, Bell } from 'lucide-react';
import { sendOtpToEmail, verifyOtpCode, loginAsGuest, logoutUser } from '../services/supabaseClient';

export default function AuthPage({ currentUser, setCurrentUser }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [activeOtpCode, setActiveOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtpToEmail(email);
      setActiveOtpCode(res.otpCode);
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
    } catch (err) {
      setErrorMsg(err.message || `Invalid OTP code.`);
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border p-8 shadow-soft flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{currentUser.name}</h1>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
          </div>
          <button onClick={() => logoutUser().then(() => setCurrentUser(null))} className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-purpleBrand-600 text-white flex items-center justify-center font-extrabold text-3xl mx-auto">
            🤟
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SignBridge AI Verification</h1>
          <p className="text-xs text-slate-500">Enter your email to receive a 6-digit OTP verification code.</p>
        </div>

        {/* Live OTP Notification Banner */}
        {step === 'otp' && activeOtpCode && (
          <div className="p-4 bg-brand-50 dark:bg-brand-950 rounded-2xl border border-brand-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-300">
              <Bell className="w-4 h-4 text-brand-600 animate-bounce" />
              <span>Verification OTP Sent to {email}!</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border text-center">
              <span className="text-xs text-slate-400 block mb-0.5">Your 6-Digit OTP Code:</span>
              <span className="text-2xl font-mono font-extrabold text-brand-600 tracking-widest">
                {activeOtpCode}
              </span>
            </div>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="srilikhithanookala@gmail.com"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-brand-600 text-white rounded-xl text-xs font-bold">
              {loading ? 'Sending OTP...' : 'Send Verification OTP Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold block mb-1">Enter 6-Digit OTP Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit code..."
                className="w-full py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-base font-mono tracking-widest text-center"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold">
              {loading ? 'Verifying...' : 'Verify OTP & Unlock Access'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
