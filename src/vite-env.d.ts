/// <reference types="vite/client" />

interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: 'network' | 'not-allowed' | 'permission-denied' | 'no-speech' | 'audio-capture' | 'aborted' | 'language-not-supported' | 'service-not-allowed' | 'bad-grammar' | 'no-match';
  message?: string;
}