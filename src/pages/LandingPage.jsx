import React from 'react';
import { Camera, MessageSquare, ArrowRight, Cpu, Volume2, Sparkles, HelpCircle, Zap, Globe } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="space-y-16 pb-20 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-extrabold shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin-slow" />
            AI-POWERED ACCESSIBLE COMMUNICATION PLATFORM
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              SignBridge AI
            </h1>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              “From Hands to Voice. From Silence to Conversation.”
            </p>
            <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed">
              An AI-powered communication assistant that converts sign-language gestures into text and speech, helping people communicate naturally without requiring a human translator.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('translator')}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-3"
            >
              <Camera className="w-5 h-5" />
              Start Translating Live
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('conversation')}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-extrabold text-base border-2 border-slate-200 dark:border-slate-700 shadow-soft transition-all flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Try Conversation Mode
            </button>
          </div>

          {/* Pipeline Illustration */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-soft">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-6">
                Camera → MediaPipe → Hand Landmarks → Gesture AI → Sentence Engine → TTS
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 border space-y-2">
                  <div className="text-3xl">🖐️</div>
                  <span className="font-extrabold text-slate-900 text-xs">1. Camera Feed</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                  <Cpu className="w-8 h-8 text-blue-600" />
                  <span className="font-extrabold text-blue-900 text-xs">2. MediaPipe AI</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                  <span className="font-extrabold text-purple-900 text-xs">3. Sentence AI</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <Volume2 className="w-8 h-8 text-emerald-600" />
                  <span className="font-extrabold text-emerald-900 text-xs">4. Text & Speech</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Why SignBridge AI? Bottom Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border-2 border-slate-200 dark:border-slate-800 shadow-soft space-y-8">
          <div className="flex items-center justify-between border-b pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">Platform Vision</span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Why SignBridge AI?</h2>
            </div>
            <div className="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700">
              Universal Communication Solution
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border space-y-3">
              <div className="p-3 bg-rose-100 text-rose-700 rounded-xl w-fit"><HelpCircle className="w-6 h-6" /></div>
              <h3 className="text-lg font-extrabold text-slate-900">The Problem</h3>
              <p className="text-xs text-slate-700 font-medium">Over 70 million deaf people worldwide face everyday communication barriers.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border space-y-3">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl w-fit"><Zap className="w-6 h-6" /></div>
              <h3 className="text-lg font-extrabold text-slate-900">The Solution</h3>
              <p className="text-xs text-slate-700 font-medium">Real-time camera sign-to-speech converter requiring zero hardware sensors.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border space-y-3">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-xl w-fit"><Sparkles className="w-6 h-6" /></div>
              <h3 className="text-lg font-extrabold text-slate-900">The Innovation</h3>
              <p className="text-xs text-slate-700 font-medium">Context-aware sentence engine with two-way sign/speech conversation mode.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border space-y-3">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl w-fit"><Globe className="w-6 h-6" /></div>
              <h3 className="text-lg font-extrabold text-slate-900">The Impact</h3>
              <p className="text-xs text-slate-700 font-medium">Accessible communication in hospitals, colleges, workplaces, and shops.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
