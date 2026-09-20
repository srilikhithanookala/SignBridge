import React from 'react';
import { Camera, MessageSquare, BookOpen, ShieldCheck, Zap, Heart, ArrowRight, CheckCircle2, Cpu, Volume2, Sparkles, HelpCircle, Layers, Globe } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="space-y-20 pb-20 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-brand-300/30 to-purpleBrand-300/30 blur-3xl rounded-full -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 dark:bg-brand-950/60 dark:border-brand-800 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold tracking-wide shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-600 animate-spin-slow" />
            AI-POWERED ACCESSIBLE COMMUNICATION PLATFORM
          </div>

          {/* Title & Tagline */}
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('translator')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-purpleBrand-600 hover:from-brand-700 hover:to-purpleBrand-700 text-white rounded-2xl font-bold text-base shadow-glow hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
            >
              <Camera className="w-5 h-5" />
              Start Translating Live
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('conversation')}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white rounded-2xl font-bold text-base border border-slate-200 dark:border-slate-700 shadow-soft hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-5 h-5 text-purpleBrand-600" />
              Try Conversation Mode
            </button>
          </div>

          {/* Flow Pipeline Illustration */}
          <div className="pt-12 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-soft">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-6">
                Real-Time Recognition Pipeline
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                
                <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-2">
                  <div className="text-3xl">🖐️</div>
                  <span className="font-bold text-slate-800 dark:text-white text-xs">Device Camera</span>
                  <span className="text-[10px] text-slate-400">Hand Movement</span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-900 space-y-2">
                  <Cpu className="w-8 h-8 text-brand-600" />
                  <span className="font-bold text-brand-700 dark:text-brand-300 text-xs">MediaPipe AI</span>
                  <span className="text-[10px] text-brand-500">21 3D Landmarks</span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-2xl bg-purpleBrand-50 dark:bg-purpleBrand-950/60 border border-purpleBrand-100 dark:border-purpleBrand-900 space-y-2">
                  <Sparkles className="w-8 h-8 text-purpleBrand-600" />
                  <span className="font-bold text-purpleBrand-700 dark:text-purpleBrand-300 text-xs">Sentence AI</span>
                  <span className="text-[10px] text-purpleBrand-500">Contextual Grammar</span>
                </div>

                <div className="flex flex-col items-center p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 space-y-2">
                  <Volume2 className="w-8 h-8 text-emerald-600" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">Text & Speech</span>
                  <span className="text-[10px] text-emerald-500">Audio Synthesis</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Why SignBridge AI? - Hackathon Presentation Highlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">Hackathon Special</span>
              <h2 className="text-3xl font-extrabold text-white">Why SignBridge AI?</h2>
            </div>
            <div className="px-4 py-1.5 bg-brand-600/30 border border-brand-500/50 rounded-full text-xs font-semibold text-brand-200">
              Breakthrough Accessibility Solution
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl w-fit">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">The Problem</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Over 70 million deaf people worldwide use sign language, yet less than 1% of the general population understands it. Everyday interactions in hospitals, shops, and colleges remain severely restricted.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="p-3 bg-brand-500/20 text-brand-400 rounded-xl w-fit">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">The Solution</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Real-time, browser-based computer vision system requiring zero external sensors. Converts hand movements to text and spoken audio instantly on any laptop or smartphone.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="p-3 bg-purpleBrand-500/20 text-purpleBrand-400 rounded-xl w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">The Innovation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Context-aware sentence generation engine bridges raw sign vocabulary into natural English phrases, coupled with a bidirectional two-way sign/speech conversation mode.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl w-fit">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">The Impact</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Empowers signers with true independent autonomy in public spaces, medical care, workplace meetings, customer service counters, and educational settings.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Core Capabilities</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Engineered for high-accuracy recognition, seamless natural speech synthesis, and universal browser accessibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-4 hover:-translate-y-1 transition-transform">
            <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl w-fit">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Live Computer Vision</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Detects 21 3D hand keypoints in real time at 30+ FPS using MediaPipe Hands, analyzing finger extension geometry and palm orientation.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-4 hover:-translate-y-1 transition-transform">
            <div className="p-3 bg-purpleBrand-50 text-purpleBrand-600 rounded-2xl w-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Context-Aware Sentences</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Transforms raw gesture keywords (e.g. <span className="font-semibold text-brand-600">I + WANT + WATER</span>) into fluent sentences ("I want some water.").
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-4 hover:-translate-y-1 transition-transform">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Two-Way Conversation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Seamless split-screen mode: Sign language gesture-to-speech on one side, spoken speech-to-text microphone on the other.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-4 hover:-translate-y-1 transition-transform">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Learn & Practice Mode</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Interactive flashcard tutorial for 22+ core signs with live webcam practice and real-time recognition feedback celebrations.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-4 hover:-translate-y-1 transition-transform">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Supabase Cloud Sync</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Persists user profiles, conversation transcripts, and accuracy feedback. Includes automatic local fallback when offline.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-4 hover:-translate-y-1 transition-transform">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Universal Accessibility</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Built with WCAG principles: High Contrast toggle, Large Text scaling, OpenDyslexic typography, and full keyboard navigation.
            </p>
          </div>

        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 dark:bg-slate-800/40 rounded-3xl p-8 sm:p-12 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Built With Cutting-Edge Web Stack</h2>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">HTML5 Video & Canvas</span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">MediaPipe Hands</span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">React + Vite</span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">Tailwind CSS</span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">Web Speech API (TTS & STT)</span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">Supabase DB & Auth</span>
          </div>
        </div>
      </section>

    </div>
  );
}
