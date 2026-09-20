import React, { useState } from 'react';
import { Check, X, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { SUPPORTED_SIGNS } from '../services/gestureClassifier';
import { submitRecognitionFeedback } from '../services/supabaseClient';

export default function FeedbackModal({ currentSign, onComplete }) {
  const [givenFeedback, setGivenFeedback] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(null);
  const [correction, setCorrection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!currentSign) return null;

  const handleChoice = async (isCorrect) => {
    setWasCorrect(isCorrect);
    setGivenFeedback(true);
    if (isCorrect) {
      await submitRecognitionFeedback(currentSign, true, '');
      setSubmitted(true);
      setTimeout(() => onComplete(), 1500);
    }
  };

  const handleCorrectionSubmit = async (e) => {
    e.preventDefault();
    await submitRecognitionFeedback(currentSign, false, correction);
    setSubmitted(true);
    setTimeout(() => onComplete(), 1500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-soft">
      {!givenFeedback ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Was sign <span className="font-bold text-brand-600">"{currentSign}"</span> correctly recognized?
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleChoice(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition border border-emerald-200"
            >
              <Check className="w-3.5 h-3.5" /> Correct
            </button>
            <button
              onClick={() => handleChoice(false)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition border border-rose-200"
            >
              <X className="w-3.5 h-3.5" /> Incorrect
            </button>
          </div>
        </div>
      ) : submitted ? (
        <div className="flex items-center justify-center gap-2 text-emerald-600 text-xs font-semibold py-1">
          <ThumbsUp className="w-4 h-4" /> Thank you! Feedback logged to train SignBridge AI.
        </div>
      ) : (
        <form onSubmit={handleCorrectionSubmit} className="space-y-3">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            What sign were you making instead?
          </div>
          <div className="flex gap-2">
            <select
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white"
            >
              <option value="">Select correct sign...</option>
              {SUPPORTED_SIGNS.map(s => (
                <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Send className="w-3 h-3" /> Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
