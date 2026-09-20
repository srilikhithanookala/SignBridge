import React, { useState, useEffect } from 'react';
import { Eye, Type, Volume2, Keyboard, X, Check, RefreshCw } from 'lucide-react';
import { updateUserProfile } from '../services/supabaseClient';

export default function AccessibilityPanel({ isOpen, onClose, currentUser, onUserUpdate }) {
  const [highContrast, setHighContrast] = useState(currentUser?.highContrast || false);
  const [largeText, setLargeText] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(currentUser?.speechSpeed || 1.0);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  }, [largeText]);

  useEffect(() => {
    if (dyslexicFont) {
      document.body.classList.add('font-dyslexic');
    } else {
      document.body.classList.remove('font-dyslexic');
    }
  }, [dyslexicFont]);

  if (!isOpen) return null;

  const handleToggleContrast = () => {
    const nextVal = !highContrast;
    setHighContrast(nextVal);
    updateUserProfile({ highContrast: nextVal });
    if (onUserUpdate) onUserUpdate({ highContrast: nextVal });
  };

  const handleSpeedChange = (e) => {
    const val = parseFloat(e.target.value);
    setSpeechSpeed(val);
    updateUserProfile({ speechSpeed: val });
    if (onUserUpdate) onUserUpdate({ speechSpeed: val });
  };

  const resetDefaults = () => {
    setHighContrast(false);
    setLargeText(false);
    setDyslexicFont(false);
    setSpeechSpeed(1.0);
    document.body.classList.remove('high-contrast', 'large-text', 'font-dyslexic');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-50 text-brand-600 rounded-2xl">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Accessibility Suite</h2>
              <p className="text-xs text-slate-500">Customize display, fonts, and text-to-speech preferences.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* High Contrast */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-brand-600" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-white text-sm">High Contrast Mode</p>
                <p className="text-xs text-slate-500">Maximizes color contrast for enhanced readability.</p>
              </div>
            </div>
            <button
              onClick={handleToggleContrast}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${highContrast ? 'bg-brand-600 justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>

          {/* Large Text */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-purpleBrand-600" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-white text-sm">Large Text Scaling</p>
                <p className="text-xs text-slate-500">Scales font sizes up by 15% across all components.</p>
              </div>
            </div>
            <button
              onClick={() => setLargeText(!largeText)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${largeText ? 'bg-purpleBrand-600 justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>

          {/* Dyslexic Font */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-white text-sm">Dyslexic Friendly Font</p>
                <p className="text-xs text-slate-500">Switches UI typography to weighted bottom lettering.</p>
              </div>
            </div>
            <button
              onClick={() => setDyslexicFont(!dyslexicFont)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${dyslexicFont ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>

          {/* Speech Rate Slider */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-brand-600" />
                <span className="font-semibold text-slate-800 dark:text-white text-sm">Speech Speed Rate</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 bg-brand-100 text-brand-700 rounded-lg">{speechSpeed}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="2.0" 
              step="0.1" 
              value={speechSpeed} 
              onChange={handleSpeedChange}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>0.5x Slow</span>
              <span>1.0x Normal</span>
              <span>2.0x Fast</span>
            </div>
          </div>

          {/* Keyboard Shortcuts Reference */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white font-semibold text-sm">
              <Keyboard className="w-4 h-4 text-slate-600" />
              <span>Keyboard Navigation Shortcuts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                <span>Spacebar</span>
                <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">Pause Recognition</span>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                <span>Enter Key</span>
                <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">Speak Sentence</span>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                <span>Backspace</span>
                <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">Undo Last Sign</span>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                <span>Esc Key</span>
                <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">Close Modals</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={resetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-md transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
