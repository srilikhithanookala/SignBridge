import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, RefreshCw, Pause, Play, Volume2, Copy, RotateCcw, Trash2, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { SUPPORTED_SIGNS, drawHandSkeleton } from '../services/gestureClassifier';
import { generateSentence } from '../services/sentenceEngine';
import { speakText } from '../services/speechService';
import { recordLiveTranslation, getCurrentUser } from '../services/supabaseClient';
import FeedbackModal from '../components/FeedbackModal';

import { Hands } from '@mediapipe/hands';
import { Camera as MediaPipeCamera } from '@mediapipe/camera_utils';

// Hardcoded live Render backend URL
const BACKEND_URL = "https://signbridge-backend-9ir2.onrender.com";

export default function LiveTranslatorPage({ currentUser }) {
  // Local user state with fallback to prop and automatic fetch if missing
  const [activeUser, setActiveUser] = useState(currentUser);

  useEffect(() => {
    async function loadUserData() {
      if (!currentUser) {
        try {
          const user = await getCurrentUser();
          if (user) {
            setActiveUser(user);
          }
        } catch (err) {
          console.error('Failed to fetch active user session:', err);
        }
      }
    }
    loadUserData();
  }, [currentUser]);

  // Camera & Video Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraInstanceRef = useRef(null);
  const handsInstanceRef = useRef(null);

  // States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [facingMode, setFacingMode] = useState('user');
  const [cameraError, setCameraError] = useState(null);

  // Recognition States
  const [handDetected, setHandDetected] = useState(false);
  const [currentSign, setCurrentSign] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [signBuffer, setSignBuffer] = useState([]);
  const [generatedSentence, setGeneratedSentence] = useState('');
  const [lastFeedbackSign, setLastFeedbackSign] = useState(null);
  const [copied, setCopied] = useState(false);

  // Speech Options
  const effectiveUser = currentUser || activeUser;
  const speechSpeed = effectiveUser?.speechSpeed || 1.0;

  // Recalculate sentence when buffer changes
  useEffect(() => {
    const sentence = generateSentence(signBuffer);
    setGeneratedSentence(sentence);
  }, [signBuffer]);

  // Initialize MediaPipe Hands & Camera stream
  useEffect(() => {
    if (isCameraActive && !isPaused) {
      startMediaPipeCamera();
    } else {
      stopMediaPipeCamera();
    }

    return () => {
      stopMediaPipeCamera();
    };
  }, [isCameraActive, isPaused, facingMode]);

  // Send Hand Landmarks or Quick Trigger ID to FastAPI Backend
  const sendLandmarksToBackend = async (landmarks = [], triggerSignId = null) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          landmarks: landmarks || [],
          sign_id: triggerSignId 
        }),
      });
      
      const result = await response.json();
      if (result && result.status === 'success' && result.translation) {
        const signId = result.translation;
        const signInfo = SUPPORTED_SIGNS.find(s => s.id === signId) || { id: signId, name: signId, emoji: '🖐️' };

        setCurrentSign(signInfo);
        setConfidence(Math.round((result.confidence || 0.9) * 100));
        setHandDetected(true);
        setLastFeedbackSign(signInfo.id);

        setSignBuffer(prev => {
          if (prev.length > 0 && prev[prev.length - 1] === signId) return prev;
          const updated = [...prev, signId];
          const sentence = generateSentence(updated);
          recordLiveTranslation(signId, sentence);
          return updated;
        });
      }
    } catch (error) {
      console.error('Error connecting to FastAPI backend:', error);
    }
  };

  // Start MediaPipe Camera & Hands Pipeline
  const startMediaPipeCamera = async () => {
    setCameraError(null);
    try {
      if (!videoRef.current || !canvasRef.current) return;

      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
      });

      let lastSentTime = 0;
      hands.onResults((results) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          setHandDetected(true);
          const landmarks = results.multiHandLandmarks[0];
          
          // Draw skeleton on canvas
          drawHandSkeleton(ctx, landmarks, canvas.width, canvas.height);

          // Throttle requests to once every 1.5s
          const now = Date.now();
          if (now - lastSentTime > 1500) {
            lastSentTime = now;
            sendLandmarksToBackend(landmarks);
          }
        } else {
          setHandDetected(false);
        }
        ctx.restore();
      });

      handsInstanceRef.current = hands;

      const camera = new MediaPipeCamera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && handsInstanceRef.current && !isPaused) {
            await handsInstanceRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });

      await camera.start();
      cameraInstanceRef.current = camera;
      setIsCameraActive(true);
    } catch (err) {
      console.error('MediaPipe camera error:', err);
      setCameraError('Camera access failed or MediaPipe failed to load. Please check permissions.');
      setIsCameraActive(false);
    }
  };

  // Stop MediaPipe Camera Stream
  const stopMediaPipeCamera = () => {
    if (cameraInstanceRef.current) {
      cameraInstanceRef.current.stop();
      cameraInstanceRef.current = null;
    }
    if (handsInstanceRef.current) {
      handsInstanceRef.current.close();
      handsInstanceRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setHandDetected(false);
  };

  // Toggle Camera
  const handleToggleCamera = () => {
    if (isCameraActive) {
      setIsCameraActive(false);
    } else {
      setIsCameraActive(true);
      setIsPaused(false);
    }
  };

  // Switch Camera Front/Back
  const handleSwitchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Quick Trigger Action
  const triggerSignRecognition = (signId) => {
    sendLandmarksToBackend([], signId);
  };

  // Speech Output
  const handleSpeak = () => {
    if (generatedSentence) {
      speakText(generatedSentence, { rate: speechSpeed });
    }
  };

  // Copy Sentence
  const handleCopy = () => {
    if (generatedSentence) {
      navigator.clipboard.writeText(generatedSentence);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Undo Last Sign
  const handleUndo = () => {
    setSignBuffer(prev => prev.slice(0, -1));
  };

  // Clear All
  const handleClear = () => {
    setSignBuffer([]);
    setCurrentSign(null);
    setHandDetected(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Camera className="w-8 h-8 text-brand-600" />
            Live Sign Translator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time MediaPipe hand landmark tracking and context-aware sentence synthesis.
          </p>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Camera Stream & Vision Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl aspect-video border border-slate-800 flex items-center justify-center">
            
            {/* Live Video Feed */}
            <video
              ref={videoRef}
              playsInline
              muted
              className="hidden"
            />

            {/* MediaPipe Skeleton Canvas Overlay */}
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''} ${isCameraActive && !cameraError ? 'block' : 'hidden'}`}
            />

            {/* Offline / Stopped Camera Placeholder */}
            {(!isCameraActive || cameraError) && (
              <div className="p-8 text-center space-y-4 max-w-md">
                <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
                  <CameraOff className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-white font-bold text-lg">Camera is Offline</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cameraError || 'Click "Start Camera" below to enable live hand landmark detection or use the Gesture Triggers bar.'}
                  </p>
                </div>
                <button
                  onClick={handleToggleCamera}
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-lg transition"
                >
                  Start Camera Feed
                </button>
              </div>
            )}

            {/* Top Status Bar overlay */}
            {isCameraActive && !cameraError && (
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                {/* Hand Detected Badge */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md transition-all ${
                  handDetected ? 'bg-emerald-500/90 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300'
                }`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${handDetected ? 'bg-white animate-ping' : 'bg-slate-500'}`} />
                  {handDetected ? 'Hand Detected ✓' : 'No Hand Detected'}
                </div>

                {/* Pause Status */}
                {isPaused && (
                  <div className="px-3 py-1 bg-amber-500/90 text-white rounded-full text-xs font-bold backdrop-blur-md">
                    PAUSED
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Camera Controls Toolbar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleCamera}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                  isCameraActive 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100' 
                    : 'bg-brand-600 text-white hover:bg-brand-700'
                }`}
              >
                {isCameraActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                {isCameraActive ? 'Stop Camera' : 'Start Camera'}
              </button>

              <button
                onClick={handleSwitchCamera}
                disabled={!isCameraActive}
                className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 transition disabled:opacity-50"
                title="Switch Camera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPaused(!isPaused)}
                disabled={!isCameraActive}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-50 ${
                  isPaused ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              30 FPS • MediaPipe Hands Engine
            </div>
          </div>

          {/* Quick Gesture Triggers Bar (All Core Signs) */}
          <div className="bg-gradient-to-r from-slate-900 to-brand-950 p-5 rounded-3xl text-white space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purpleBrand-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-300">
                  Quick Gesture Triggers ({SUPPORTED_SIGNS.length} Core Signs)
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Tap sign to translate immediately</span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
              {SUPPORTED_SIGNS.map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => triggerSignRecognition(sign.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-brand-600 text-white rounded-xl text-xs font-semibold border border-slate-700 hover:border-brand-500 transition shadow-sm active:scale-95"
                >
                  <span>{sign.emoji}</span>
                  <span>{sign.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Detected Sign, Generated Sentence & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Detected Sign Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Detected Sign
              </span>
              {confidence > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {confidence}% Confidence
                </div>
              )}
            </div>

            {currentSign ? (
              <div className="flex items-center gap-4 py-2 animate-pop-in">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-4xl shadow-sm">
                  {currentSign.emoji}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-wide">
                    {currentSign.name.toUpperCase()}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentSign.description || 'Gesture recognized via spatial geometry.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs italic">
                No sign detected yet. Turn on camera or tap a gesture trigger.
              </div>
            )}

            {/* Confidence Progress Meter */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Recognition Confidence Score</span>
                <span>{confidence}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500" 
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* Generated Sentence Box */}
          <div className="bg-gradient-to-br from-brand-50/60 to-purpleBrand-50/60 dark:from-slate-900 dark:to-slate-900 p-6 rounded-3xl border border-brand-100 dark:border-slate-800 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-700 dark:text-brand-300">
                Generated Sentence
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">
                Context-Aware AI
              </span>
            </div>

            <div className="min-h-[90px] p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner flex items-center">
              {generatedSentence ? (
                <p className="text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  "{generatedSentence}"
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Recognized sign sequence will form a natural sentence here...
                </p>
              )}
            </div>

            {/* Action Buttons Toolbar */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleSpeak}
                disabled={!generatedSentence}
                className="flex flex-col items-center justify-center p-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-2xl text-xs font-bold transition shadow-md"
              >
                <Volume2 className="w-5 h-5 mb-1" />
                Speak
              </button>

              <button
                onClick={handleCopy}
                disabled={!generatedSentence}
                className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 disabled:opacity-40 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition"
              >
                <Copy className="w-5 h-5 mb-1 text-slate-500" />
                {copied ? 'Copied!' : 'Copy'}
              </button>

              <button
                onClick={handleUndo}
                disabled={signBuffer.length === 0}
                className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 disabled:opacity-40 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition"
              >
                <RotateCcw className="w-5 h-5 mb-1 text-amber-600" />
                Undo
              </button>

              <button
                onClick={handleClear}
                disabled={signBuffer.length === 0}
                className="flex flex-col items-center justify-center p-3 bg-rose-50 hover:bg-rose-100 text-rose-700 disabled:opacity-40 rounded-2xl text-xs font-bold border border-rose-200 transition"
              >
                <Trash2 className="w-5 h-5 mb-1" />
                Clear
              </button>
            </div>

            {/* Buffer Sequence Tokens */}
            {signBuffer.length > 0 && (
              <div className="pt-2 border-t border-brand-200/60 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Recognized Tokens Sequence:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {signBuffer.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-brand-600 dark:text-brand-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Feedback Section */}
          {lastFeedbackSign && (
            <FeedbackModal
              currentSign={lastFeedbackSign}
              onComplete={() => setLastFeedbackSign(null)}
            />
          )}

        </div>

      </div>

    </div>
  );
}