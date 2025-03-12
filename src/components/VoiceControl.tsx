import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { createSpeechRecognition, speak, checkSpeechSupport } from '@/utils/speechUtils';
import { Command, parseVoiceCommand } from '@/utils/browserCommands';
import { useToast } from "@/hooks/use-toast";

interface VoiceControlProps {
  onCommand: (command: Command) => void;
  isEnabled: boolean;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onCommand, isEnabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [tempTranscript, setTempTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const supportState = checkSpeechSupport();

  useEffect(() => {
    // Initialiser la reconnaissance vocale lors du montage du composant
    if (supportState.recognition) {
      recognitionRef.current = createSpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          
          if (event.results[current].isFinal) {
            setTranscript(transcript);
            processCommand(transcript);
          } else {
            setTempTranscript(transcript);
          }
        };
        
        recognitionRef.current.onend = () => {
          if (isListening) {
            recognitionRef.current?.start();
          }
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Erreur de reconnaissance vocale:', event.error);
          setIsListening(false);
          
          toast({
            title: "Erreur de reconnaissance vocale",
            description: `Un problème est survenu: ${event.error}`,
            variant: "destructive",
          });
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [supportState.recognition]);

  // Redémarrer la reconnaissance si elle s'arrête mais que l'état isListening est toujours true
  useEffect(() => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        // Si la reconnaissance est déjà démarrée, ignorons l'erreur
        console.log("La reconnaissance est déjà démarrée ou une erreur s'est produite", err);
      }
    } else if (!isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.log("La reconnaissance est déjà arrêtée ou une erreur s'est produite", err);
      }
    }
  }, [isListening]);

  const toggleListening = () => {
    if (!supportState.recognition) {
      toast({
        title: "Fonctionnalité non supportée",
        description: "Votre navigateur ne prend pas en charge la reconnaissance vocale",
        variant: "destructive",
      });
      return;
    }
    
    setIsListening(prev => !prev);
    
    if (!isListening) {
      setTranscript('');
      setTempTranscript('');
      speak('Commande vocale activée. Comment puis-je vous aider?');
    } else {
      speak('Commande vocale désactivée.');
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(prev => !prev);
    
    if (voiceEnabled) {
      speak('Synthèse vocale désactivée');
      // On la désactive après avoir prononcé le message
      setTimeout(() => window.speechSynthesis.cancel(), 2000);
    } else {
      speak('Synthèse vocale activée');
    }
  };

  const processCommand = (text: string) => {
    const command = parseVoiceCommand(text);
    
    if (voiceEnabled) {
      let responseMessage = '';
      
      switch (command.type) {
        case 'OPEN_URL':
          responseMessage = `J'ouvre le site pour vous.`;
          break;
        case 'SEARCH':
          responseMessage = `Je recherche "${command.payload}" pour vous.`;
          break;
        case 'CLICK':
          responseMessage = `Je tente de cliquer sur "${command.payload}" pour vous.`;
          break;
        case 'FILL_FORM':
          responseMessage = `Je remplis le formulaire pour vous.`;
          break;
        case 'GO_BACK':
          responseMessage = `Je retourne à la page précédente.`;
          break;
        case 'GO_FORWARD':
          responseMessage = `Je vais à la page suivante.`;
          break;
        case 'HOME':
          responseMessage = `Je retourne à la page d'accueil.`;
          break;
        case 'READ_PAGE':
          responseMessage = `Je vais vous lire le contenu de cette page.`;
          break;
        case 'UNKNOWN':
          responseMessage = `Désolé, je n'ai pas compris cette commande.`;
          break;
      }
      
      speak(responseMessage);
    }
    
    onCommand(command);
  };

  // Si la reconnaissance vocale n'est pas prise en charge
  if (!supportState.recognition && !supportState.synthesis) {
    return (
      <div className="p-4 bg-destructive/10 rounded-lg text-center">
        <p className="text-destructive font-medium mb-2">
          Votre navigateur ne prend pas en charge les fonctionnalités vocales.
        </p>
        <p className="text-sm text-muted-foreground">
          Veuillez utiliser un navigateur moderne comme Chrome, Edge ou Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex justify-between items-center">
        <Button 
          variant={isListening ? "default" : "outline"} 
          size="lg" 
          className={`btn-xl ${isListening ? 'mic-active' : ''}`}
          onClick={toggleListening}
          disabled={!isEnabled}
        >
          {isListening ? <Mic size={24} /> : <MicOff size={24} />}
          <span className="ml-2">{isListening ? "Écoute..." : "Activer micro"}</span>
        </Button>
        
        <Button 
          variant={voiceEnabled ? "default" : "outline"} 
          size="lg" 
          className="btn-xl"
          onClick={toggleVoice}
        >
          {voiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          <span className="ml-2">{voiceEnabled ? "Son actif" : "Son désactivé"}</span>
        </Button>
      </div>
      
      {isListening && (
        <div className="p-4 bg-secondary rounded-lg animate-fade-in">
          <p className="text-sm font-medium mb-2">Je vous écoute...</p>
          <p className="text-primary font-medium">
            {tempTranscript || "Dites quelque chose..."}
          </p>
        </div>
      )}
      
      {transcript && (
        <div className="p-4 bg-muted rounded-lg animate-fade-in">
          <p className="text-sm font-medium mb-1">Dernière commande:</p>
          <p className="text-foreground">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceControl;
