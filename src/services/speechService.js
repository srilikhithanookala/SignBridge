/**
 * SignBridge AI - Speech Service Wrapper
 * Manages Text-to-Speech (TTS) synthesis and Speech-to-Text (STT) recognition with cross-browser safety.
 */

/**
 * Speak text aloud using browser Web SpeechSynthesis API
 * @param {string} text - Text to speak
 * @param {Object} options - { rate, pitch, lang }
 * @returns {Promise<boolean>}
 */
export function speakText(text, options = {}) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      resolve(false);
      return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') {
      resolve(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.lang = options.lang || 'en-US';

    // Pick preferred voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => resolve(true);
    utterance.onerror = (err) => {
      console.error('Speech synthesis error:', err);
      resolve(false);
    };

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Check if Speech Recognition (STT) is supported
 */
export function isSpeechRecognitionSupported() {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

/**
 * Create Speech Recognition Instance
 * @param {Object} callbacks - { onResult, onError, onEnd, onStart }
 * @returns {Object|null} Recognizer controller
 */
export function createSpeechRecognizer({ onResult, onError, onEnd, onStart }) {
  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    if (onError) onError('Speech recognition is not supported in this browser. Try Google Chrome or Microsoft Edge.');
    return null;
  }

  const recognizer = new SpeechRecognitionClass();
  recognizer.continuous = true;
  recognizer.interimResults = true;
  recognizer.lang = 'en-US';

  recognizer.onstart = () => {
    if (onStart) onStart();
  };

  recognizer.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    if (onResult) {
      onResult({
        final: finalTranscript.trim(),
        interim: interimTranscript.trim()
      });
    }
  };

  recognizer.onerror = (event) => {
    console.warn('Speech recognition error event:', event.error);
    if (onError) onError(event.error === 'not-allowed' ? 'Microphone permission denied.' : `Speech error: ${event.error}`);
  };

  recognizer.onend = () => {
    if (onEnd) onEnd();
  };

  return {
    start: () => {
      try {
        recognizer.start();
      } catch (err) {
        console.warn('Speech recognition already started or busy:', err);
      }
    },
    stop: () => {
      try {
        recognizer.stop();
      } catch (err) {
        console.warn('Speech recognition stop error:', err);
      }
    }
  };
}
