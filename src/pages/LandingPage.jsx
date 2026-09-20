import React from 'react';
import { Camera, MessageSquare, ArrowRight, Cpu, Volume2, Sparkles, HelpCircle, Zap, Globe } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="space-y-16 pb-20 animate-fade-in">
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              SignBridge AI
            </h1>
            <p className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-purpleBrand-600 to-brand-700">
              “From Hands to Voice. From Silence to Conversation.”
            </p>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              An AI-powered communication assistant that converts sign-language gestures into text and speech, helping people communicate naturally without a human translator.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('translator')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-purpleBrand-600 text-white rounded-2xl font-bold text-base shadow-glow flex items-center justify-center gap-3"
            >
              <Camera className="w-5 h-5" />
              Start Translating Live
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('conversation')}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-2xl font-bold text-base border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-5 h-5 text-purpleBrand-600" />
              Try Conversation Mode
            </button>
          </div>
        </div>
      </section>

      {/* Why SignBridge AI? Hackathon Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl space-y-8">
          <h2 className="text-3xl font-extrabold text-white">Why SignBridge AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <h3 className="text-lg font-bold text-white">The Problem</h3>
              <p className="text-xs text-slate-300">Over 70 million deaf people worldwide face communication barriers in daily life.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <h3 className="text-lg font-bold text-white">The Solution</h3>
              <p className="text-xs text-slate-300">Real-time computer vision sign-to-speech converter requiring zero hardware sensors.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <h3 className="text-lg font-bold text-white">The Innovation</h3>
              <p className="text-xs text-slate-300">Context-aware sentence synthesis combined with two-way sign/speech conversation mode.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <h3 className="text-lg font-bold text-white">The Impact</h3>
              <p className="text-xs text-slate-300">Accessible interaction across hospitals, colleges, workplaces, and public spaces.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
