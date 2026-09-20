import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, MicOff, Volume2, Save, Trash2, Play, Pause, Send, Sparkles, MessageSquare, UserCheck, Bot } from 'lucide-react';
import { SUPPORTED_SIGNS } from '../services/gestureClassifier';
import { generateSentence } from '../services/sentenceEngine';
import { speakText, createSpeechRecognizer, isSpeechRecognitionSupported } from '../services/speechService';
import { saveConversation } from '../services/supabaseClient';

export default function ConversationPage({ currentUser }) {
  // Conversation Messages State
  const [messages, setMessages] = useState([
    { id: '1', sender: 'SignBridge User', message: 'Hello! I use sign language to communicate.', input_type: 'sign', timestamp: new Date(Date.now() - 60000).toISOString() },
    { id: '2', sender: 'Other Person', message: 'Hi there! Glad to chat with you. How can I help?', input_type: 'speech', timestamp: new Date().toISOString() }
  ]);

  // Sign Language User side state
  const [signBuffer, setSignBuffer] = useState([]);
  const [signSentence, setSignSentence] = useState('');

  // Other Person side state (Speech Recognition STT)
  const [isListening, setIsListening] = useState(false);
  const [speechInputText, setSpeechInputText] = useState('');
  const [sttSupported, setSttSupported] = useState(true);
  const [sttError, setSttError] = useState(null);

  // General Controls
  const [isConversationActive, setIsConversationActive] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const recognizerRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update sentence when sign buffer changes
  useEffect(() => {
    setSignSentence(generateSentence(signBuffer));
  }, [signBuffer]);

  // Check STT support on mount
  useEffect(() => {
    setSttSupported(isSpeechRecognitionSupported());
  }, []);

  // Initialize or Toggle Speech Recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognizerRef.current) recognizerRef.current.stop();
      setIsListening(false);
    } else {
      setSttError(null);
      const recognizer = createSpeechRecognizer({
        onStart: () => setIsListening(true),
        onResult: ({ final, interim }) => {
          if (final) {
            setSpeechInputText(final);
          } else if (interim) {
            setSpeechInputText(interim);
          }
        },
        onError: (err) => {
          setSttError(err);
          setIsListening(false);
        },
        onEnd: () => setIsListening(false)
      });

      if (recognizer) {
        recognizerRef.current = recognizer;
        recognizer.start();
      }
    }
  };

  // Send Sign Language User Message
  const handleSendSignMessage = () => {
    if (!signSentence.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'SignBridge User',
      message: signSentence,
      input_type: 'sign',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);

    // Automatically speak aloud
    speakText(signSentence, { rate: currentUser?.speechSpeed || 1.0 });

    // Reset buffer
    setSignBuffer([]);
    setSignSentence('');
  };

  // Send Other Person Spoken Message
  const handleSendSpokenMessage = (e) => {
    if (e) e.preventDefault();
    if (!speechInputText.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'Other Person',
      message: speechInputText,
      input_type: 'speech',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setSpeechInputText('');
    if (isListening && recognizerRef.current) {
      recognizerRef.current.stop();
      setIsListening(false);
    }
  };

  // Quick Sign Trigger
  const handleSignClick = (signId) => {
    setSignBuffer(prev => [...prev, signId]);
  };

  // Save Conversation to Supabase
  const handleSaveConversation = async () => {
    if (messages.length === 0) return;
    const title = messages[0]?.message.slice(0, 30) + '...';
    await saveConversation(title, messages);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Clear Conversation
  const handleClearConversation = () => {
    setMessages([]);
    setSignBuffer([]);
    setSignSentence('');
    setSpeechInputText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purpleBrand-600" />
            Two-Way Conversation Mode
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time dialog interface connecting Sign Language Users with Spoken English Speakers.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveConversation}
            disabled={messages.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Save className="w-4 h-4" />
            {savedSuccess ? 'Saved to History ✓' : 'Save Conversation'}
          </button>

          <button
            onClick={handleClearConversation}
            disabled={messages.length === 0}
            className="flex items-center gap-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 disabled:opacity-40 rounded-xl text-xs font-bold border border-rose-200 transition"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Sign Language User Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
          
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xl">
              🖐️
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sign Language User</h2>
              <p className="text-xs text-slate-500">Camera Gesture / Preset input $\rightarrow$ Speech output</p>
            </div>
          </div>

          {/* Preset Quick Gesture Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Select Gestures Sequence:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {['HELLO', 'I', 'WANT', 'NEED', 'WATER', 'HELP', 'FOOD', 'THANK YOU', 'PLEASE'].map((signId) => {
                const sData = SUPPORTED_SIGNS.find(s => s.id === signId);
                return (
                  <button
                    key={signId}
                    onClick={() => handleSignClick(signId)}
                    className="flex flex-col items-center p-2 bg-slate-50 dark:bg-slate-800 hover:bg-brand-50 hover:border-brand-300 rounded-xl border border-slate-200 dark:border-slate-700 transition"
                  >
                    <span className="text-lg">{sData?.emoji}</span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-white">{sData?.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formed Sentence Preview */}
          <div className="p-4 bg-brand-50/50 dark:bg-slate-800 rounded-2xl border border-brand-100 dark:border-slate-700 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider">
                Sentence Output:
              </span>
              {signBuffer.length > 0 && (
                <button
                  onClick={() => setSignBuffer([])}
                  className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold"
                >
                  Reset Signs
                </button>
              )}
            </div>

            <p className="text-base font-bold text-slate-900 dark:text-white min-h-[40px]">
              {signSentence ? `"${signSentence}"` : <span className="text-slate-400 font-normal italic text-xs">Tap gesture buttons above to compose...</span>}
            </p>

            <button
              onClick={handleSendSignMessage}
              disabled={!signSentence}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              Speak & Send to Chat
            </button>
          </div>

        </div>

        {/* Center/Right Side: Live Chat Bubble Timeline & Spoken Input (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Chat Timeline Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col h-[520px]">
            
            {/* Timeline Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Live Conversation Log
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Active Session
              </span>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                  No messages exchanged yet. Start by signing or speaking below.
                </div>
              ) : (
                messages.map((m) => {
                  const isSignUser = m.sender === 'SignBridge User';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isSignUser ? 'items-start' : 'items-end'} space-y-1`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold px-1">
                        <span>{m.sender}</span>
                        <span>•</span>
                        <span>{m.input_type === 'sign' ? '🖐️ Gesture' : '🎤 Speech'}</span>
                      </div>

                      <div className={`group relative max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm space-y-2 ${
                        isSignUser 
                          ? 'bg-brand-600 text-white rounded-tl-none' 
                          : 'bg-purpleBrand-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tr-none border border-purpleBrand-200 dark:border-slate-700'
                      }`}>
                        <p className="leading-relaxed">{m.message}</p>
                        
                        <div className="flex items-center justify-between pt-1 text-[10px] opacity-80 border-t border-white/20">
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          
                          {/* Play Audio Button */}
                          <button
                            onClick={() => speakText(m.message, { rate: currentUser?.speechSpeed || 1.0 })}
                            className="p-1 hover:bg-white/20 rounded-full transition"
                            title="Play Audio"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Other Person Spoken Microphone Input Form */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-purpleBrand-600" />
                  Other Person (Speech Input)
                </span>
                {sttError && <span className="text-rose-600 text-[10px] font-semibold">{sttError}</span>}
              </div>

              <form onSubmit={handleSendSpokenMessage} className="flex gap-2">
                
                {/* STT Mic Toggle Button */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`p-3 rounded-xl transition flex items-center justify-center ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-purpleBrand-100 dark:bg-purpleBrand-950 text-purpleBrand-700 dark:text-purpleBrand-300 hover:bg-purpleBrand-200'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Start Microphone Speech Recognition'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <input
                  type="text"
                  value={speechInputText}
                  onChange={(e) => setSpeechInputText(e.target.value)}
                  placeholder={isListening ? "Listening to spoken voice..." : "Type or speak response here..."}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purpleBrand-500"
                />

                <button
                  type="submit"
                  disabled={!speechInputText.trim()}
                  className="px-5 py-2.5 bg-purpleBrand-600 hover:bg-purpleBrand-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
