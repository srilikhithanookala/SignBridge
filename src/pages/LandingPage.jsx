import React from 'react';
import { Camera, MessageSquare, ArrowRight, Sparkles, HelpCircle, Zap, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="space-y-16 pb-20 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">

          {/* Title & Tagline */}
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('translator')}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
            >
              <Camera className="w-5 h-5" />
              Start Translating Live
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('conversation')}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-extrabold text-base border-2 border-slate-200 dark:border-slate-700 shadow-soft transition-all flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Try Conversation Mode
            </button>
          </div>

        </div>
      </section>

      {/* Why SignBridge AI? - Bottom Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border-2 border-slate-200 dark:border-slate-800 shadow-soft space-y-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">Platform Vision</span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Why SignBridge AI?</h2>
            </div>
            <div className="px-4 py-1.5 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-full text-xs font-bold text-blue-700 dark:text-blue-300">
              Universal Communication Solution
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="p-3 bg-rose-100 text-rose-700 rounded-xl w-fit">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">The Problem</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Over 70 million deaf people worldwide use sign language, yet less than 1% of the general population understands it. Everyday interactions in hospitals, shops, and colleges remain severely restricted.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl w-fit">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">The Solution</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Real-time, browser-based computer vision system requiring zero external sensors. Converts hand movements to text and spoken audio instantly on any laptop or smartphone.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-xl w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">The Innovation</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Context-aware sentence generation engine bridges raw sign vocabulary into natural English phrases, coupled with a bidirectional two-way sign/speech conversation mode.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl w-fit">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">The Impact</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Empowers signers with true independent autonomy in public spaces, medical care, workplace meetings, customer service counters, and educational settings.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
