import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Camera, MessageSquare, Award, CheckCircle2, TrendingUp, ThumbsUp, Activity, ArrowRight } from 'lucide-react';
import { getDashboardStats } from '../services/supabaseClient';

export default function DashboardPage({ onNavigate }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getDashboardStats();
    setStats(data);
  };

  if (!stats) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading analytics dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-brand-600" />
            User & System Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time insights on sign translations, conversation count, accuracy rating, and AI feedback logs.
          </p>
        </div>

        <button
          onClick={() => onNavigate('translator')}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 w-fit"
        >
          <Camera className="w-4 h-4" /> Start Translator Live
        </button>
      </div>

      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Translations Today */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Translations Today</span>
            <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalTranslations}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18% from yesterday
          </p>
        </div>

        {/* Card 2: Total Conversations */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Total Conversations</span>
            <div className="p-2.5 bg-purpleBrand-50 text-purpleBrand-600 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalConversations}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Saved in Supabase database</p>
        </div>

        {/* Card 3: Most Used Sign */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Most Used Sign</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-brand-600 dark:text-brand-400 flex items-center gap-2">
            <span>🆘</span> {stats.mostUsedSign}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Used 42 times this week</p>
        </div>

        {/* Card 4: Accuracy Rating */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">AI Accuracy Rating</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.accuracyRate}%
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Based on user feedback</p>
        </div>

      </div>

      {/* Analytics Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Activity / Conversations */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Conversations
            </h3>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {stats.recentConversations.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigate('history')}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition"
              >
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-xs">{c.title}</h4>
                  <span className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <MessageSquare className="w-4 h-4 text-purpleBrand-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Logs & AI Training */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Recognition Feedback Log
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold">Continuous Improvement</span>
          </div>

          <div className="space-y-3">
            {stats.feedbackLogs.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg ${f.wasCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {f.wasCorrect ? <CheckCircle2 className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">Sign: {f.sign}</p>
                    {!f.wasCorrect && f.userCorrection && (
                      <p className="text-[10px] text-rose-600 font-semibold">Corrected to: {f.userCorrection}</p>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(f.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
