import React, { useState, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Home,
  RefreshCw,
  Mic,
  Volume2,
  Settings,
  Search,
  ToggleLeft as Google,
  Cloud,
  Newspaper,
  Mail,
  Calendar,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Bookmark,
  X
} from 'lucide-react';

function App() {
  const [url, setUrl] = useState('https://google.com');
  const [isListening, setIsListening] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const favorites = [
    { name: 'Google', icon: <Google size={24} />, url: 'https://google.com' },
    { name: 'Météo', icon: <Cloud size={24} />, url: 'https://meteofrance.com' },
    { name: 'Actualités', icon: <Newspaper size={24} />, url: 'https://www.francetvinfo.fr' },
    { name: 'Email', icon: <Mail size={24} />, url: 'https://gmail.com' },
    { name: 'Agenda', icon: <Calendar size={24} />, url: 'https://calendar.google.com' },
  ];

  const getProxiedUrl = (targetUrl: string) => {
    // Remove protocol and clean up URL
    const cleanUrl = targetUrl
      .replace(/^https?:\/\//, '')
      .replace(/\/+/g, '/');
    return `/proxy/${cleanUrl}`;
  };

  const checkConnectivity = () => {
    return navigator.onLine;
  };

  const checkHTTPS = () => {
    return window.location.protocol === 'https:';
  };

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Erreur lors de l\'arrêt de la reconnaissance vocale:', error);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const handleVoiceCommand = useCallback(() => {
    if (!isListening) {
      if (!checkConnectivity()) {
        alert('Pas de connexion internet. Veuillez vérifier votre connexion et réessayer.');
        return;
      }

      if (!checkHTTPS()) {
        alert('La reconnaissance vocale nécessite une connexion sécurisée (HTTPS). Veuillez utiliser HTTPS pour accéder à cette application.');
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('La reconnaissance vocale n\'est pas supportée par votre navigateur.');
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.lang = 'fr-FR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          setSearchQuery(transcript);
          
          if (transcript.includes('accueil')) {
            setUrl('https://google.com');
          } else if (transcript.includes('météo')) {
            setUrl('https://meteofrance.com');
          } else if (transcript.includes('actualités')) {
            setUrl('https://www.francetvinfo.fr');
          } else if (transcript.includes('email')) {
            setUrl('https://gmail.com');
          } else if (transcript.includes('agenda')) {
            setUrl('https://calendar.google.com');
          } else if (transcript.includes('rechercher')) {
            const searchTerm = transcript.replace('rechercher', '').trim();
            setUrl(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`);
          }
        };

        recognition.onend = () => {
          stopListening();
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Erreur de reconnaissance vocale:', event.error);
          let message = '';
          
          switch (event.error) {
            case 'network':
              message = 'Erreur réseau. Veuillez vérifier votre connexion internet.';
              break;
            case 'not-allowed':
            case 'permission-denied':
              message = 'Veuillez autoriser l\'accès au microphone pour utiliser la reconnaissance vocale.';
              break;
            case 'no-speech':
              message = 'Aucune parole détectée. Veuillez réessayer.';
              break;
            case 'audio-capture':
              message = 'Aucun microphone détecté. Veuillez vérifier votre équipement.';
              break;
            case 'aborted':
              message = 'La reconnaissance vocale a été interrompue.';
              break;
            case 'language-not-supported':
              message = 'La langue sélectionnée n\'est pas supportée.';
              break;
            default:
              message = 'Une erreur est survenue avec la reconnaissance vocale. Veuillez réessayer.';
          }
          
          alert(message);
          stopListening();
        };

        recognition.start();
      } catch (error) {
        console.error('Erreur lors du démarrage de la reconnaissance vocale:', error);
        alert('Impossible de démarrer la reconnaissance vocale. Veuillez réessayer.');
        stopListening();
      }
    } else {
      stopListening();
    }
  }, [isListening, stopListening]);

  const handleTextToSpeech = useCallback(() => {
    if (!isReading) {
      const utterance = new SpeechSynthesisUtterance();
      utterance.lang = 'fr-FR';
      utterance.text = 'Lecture activée. Vous pouvez utiliser les commandes vocales suivantes : accueil, météo, actualités, email, agenda, ou rechercher suivi de votre recherche.';
      utterance.onend = () => setIsReading(false);
      setIsReading(true);
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  }, [isReading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setUrl(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const adjustFontSize = (increment: boolean) => {
    setFontSize(prev => Math.min(Math.max(prev + (increment ? 10 : -10), 80), 150));
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      {/* Navigation Bar (15% height) */}
      <nav className="h-[15vh] min-h-[120px] bg-primary-100 dark:bg-primary-900 shadow-lg p-2 flex flex-col gap-2">
        <div className="flex h-1/2 gap-2">
          {/* Left Section (15%) - Top Row */}
          <div className="w-[15%] flex gap-2">
            <button className="nav-button flex-1" aria-label="Précédent">
              <ArrowLeft size={24} />
            </button>
            <button className="nav-button flex-1" aria-label="Suivant">
              <ArrowRight size={24} />
            </button>
          </div>

          {/* Middle Section (70%) - Search Bar */}
          <form onSubmit={handleSearch} className="w-[70%]">
            <div className="relative flex items-center h-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher sur internet..."
                className="w-full h-full px-4 pr-16 text-lg rounded-lg border-2 
                         border-primary-300 bg-white
                         focus:border-primary-500 focus:outline-none 
                         dark:bg-primary-800 dark:border-primary-700
                         dark:text-primary-50 dark:placeholder-primary-400
                         font-bold"
              />
              <button
                type="submit"
                className="absolute right-0 h-full px-4 nav-button rounded-l-none !w-auto"
                aria-label="Rechercher"
              >
                <Search size={24} />
              </button>
            </div>
          </form>

          {/* Right Section (15%) - Top Row */}
          <div className="w-[15%] flex gap-2">
            <button
              className="nav-button flex-1"
              onClick={() => adjustFontSize(true)}
              aria-label="Augmenter la taille du texte"
            >
              <ZoomIn size={24} />
            </button>
            <button
              className="nav-button flex-1"
              onClick={() => adjustFontSize(false)}
              aria-label="Réduire la taille du texte"
            >
              <ZoomOut size={24} />
            </button>
          </div>
        </div>

        <div className="flex h-1/2 gap-2">
          {/* Left Section (15%) - Bottom Row */}
          <div className="w-[15%] flex gap-2">
            <button className="nav-button flex-1" aria-label="Accueil">
              <Home size={24} />
            </button>
            <button className="nav-button flex-1" aria-label="Actualiser">
              <RefreshCw size={24} />
            </button>
          </div>

          {/* Middle Section (70%) - Controls */}
          <div className="w-[70%] flex gap-2">
            <button 
              className="nav-button w-[30%]"
              onClick={() => setIsShortcutsOpen(true)}
              aria-label="Raccourcis"
            >
              <Bookmark size={24} />
              <span className="ml-2">Favoris</span>
            </button>
            <button
              className={`voice-button w-[40%] ${isListening ? 'bg-red-100 dark:bg-red-900' : ''}`}
              onClick={handleVoiceCommand}
              aria-label="Commande vocale"
            >
              <Mic size={28} className={isListening ? 'text-red-500 dark:text-red-400' : ''} />
              <span className="ml-2">Parler</span>
            </button>
            <button
              className={`nav-button w-[30%] ${isReading ? 'bg-primary-200 dark:bg-primary-800' : ''}`}
              onClick={handleTextToSpeech}
              aria-label="Lecture à voix haute"
            >
              <Volume2 size={24} className={isReading ? 'text-primary-700 dark:text-primary-300' : ''} />
              <span className="ml-2">Lire</span>
            </button>
          </div>

          {/* Right Section (15%) - Bottom Row */}
          <div className="w-[15%] flex gap-2">
            <button
              className="nav-button flex-1"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Changer le thème"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button className="nav-button flex-1" aria-label="Paramètres d'accessibilité">
              <Settings size={24} />
            </button>
          </div>
        </div>

        {/* Shortcuts Popup */}
        {isShortcutsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-primary-50 dark:bg-primary-900 rounded-xl p-6 shadow-lg max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-50">Raccourcis</h2>
                <button
                  onClick={() => setIsShortcutsOpen(false)}
                  className="nav-button !w-10 !h-10"
                  aria-label="Fermer"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {favorites.map((favorite) => (
                  <button
                    key={favorite.name}
                    className="shortcut-button"
                    onClick={() => {
                      setUrl(favorite.url);
                      setIsShortcutsOpen(false);
                    }}
                  >
                    {favorite.icon}
                    <span className="ml-2">{favorite.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Web Content Area (85% height) */}
      <main className="h-[85vh] bg-white dark:bg-primary-950">
        <iframe
          src={getProxiedUrl(url)}
          title="Contenu Web"
          className="w-full h-full border-none"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          style={{ zoom: `${fontSize}%` }}
        />
      </main>
    </div>
  );
}

export default App;