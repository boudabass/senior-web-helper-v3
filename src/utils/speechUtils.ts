
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

// Définition des types pour l'API SpeechRecognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
}

// Vérifier la compatibilité du navigateur et création de l'instance de reconnaissance vocale
export const createSpeechRecognition = (): SpeechRecognition | null => {
  if (typeof window === 'undefined') return null;

  // @ts-ignore - Ces propriétés ne sont pas dans le type Window standard
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognitionAPI) {
    return null;
  }

  const recognition = new SpeechRecognitionAPI() as SpeechRecognition;
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'fr-FR'; // Par défaut en français
  
  return recognition;
};

// Vérifier si la synthèse vocale est disponible
export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Fonction pour convertir du texte en parole avec les paramètres de profil
export const speak = (text: string, rate: number = 0.9, pitch: number = 1, volume: number = 1): void => {
  if (!isSpeechSynthesisSupported()) return;

  // Arrêter toute synthèse vocale en cours
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;
  
  // Utiliser une voix française si disponible
  const voices = window.speechSynthesis.getVoices();
  const frenchVoice = voices.find(voice => voice.lang.includes('fr'));
  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// Vérifier si les API vocales sont supportées
export const checkSpeechSupport = (): { 
  recognition: boolean; 
  synthesis: boolean;
} => {
  const recognitionSupported = typeof window !== 'undefined' && 
    // @ts-ignore - Ces propriétés ne sont pas dans le type Window standard
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  
  const synthesisSupported = isSpeechSynthesisSupported();
  
  return { 
    recognition: recognitionSupported, 
    synthesis: synthesisSupported 
  };
};
