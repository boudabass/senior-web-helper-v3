
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { createSpeechRecognition, speak, checkSpeechSupport } from '@/utils/speechUtils';
import { Command, parseVoiceCommand } from '@/utils/browserCommands';
import { useToast } from "@/hooks/use-toast";

interface VoiceControlProps {
  onCommand: (command: Command) => void;
  isEnabled: boolean;
  volume?: number;
  voiceSpeed?: number;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ onCommand, isEnabled, volume = 1, voiceSpeed = 1 }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        toast({
          title: "Écoute activée",
          description: "Je vous écoute, parlez-moi !",
        });
      } else {
        toast({
          title: "Erreur d'activation",
          description: "Impossible d'activer la reconnaissance vocale.",
          variant: "destructive",
        });
      }
    }
  };

  const processCommand = (text: string) => {
    setTranscript(text);
    const command = parseVoiceCommand(text);
    if (command) {
      onCommand(command);
    }
  };

  useEffect(() => {
    if (!isEnabled) return;

    // Initialisation de la reconnaissance vocale
    const recognition = createSpeechRecognition();
    recognitionRef.current = recognition;

    if (recognition) {
      recognition.onresult = (event: any) => {
        const resultIndex = event.resultIndex;
        const transcript = event.results[resultIndex][0].transcript;
        
        if (event.results[resultIndex].isFinal) {
          processCommand(transcript);
        }
      };

      recognition.onend = () => {
        // Redémarrer automatiquement si toujours en mode écoute
        if (isListening) {
          recognition.start();
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        setIsListening(false);
        
        toast({
          title: "Erreur vocale",
          description: `Problème de reconnaissance vocale: ${event.error}`,
          variant: "destructive",
        });
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isEnabled, onCommand]);

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-medium">Contrôle vocal</span>
          <span className="text-sm text-muted-foreground">
            {isListening ? "Je vous écoute..." : "Cliquez pour parler"}
          </span>
        </div>
        
        <Button
          variant={isListening ? "default" : "outline"}
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={toggleListening}
          disabled={!isEnabled}
        >
          {isListening ? (
            <Mic className="h-6 w-6" />
          ) : (
            <MicOff className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {transcript && (
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-medium">Vous avez dit:</p>
          <p className="text-sm italic">{transcript}</p>
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">Exemples de commandes:</p>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Ouvre Google</li>
          <li>Cherche recette de tarte aux pommes</li>
          <li>Retour à la page précédente</li>
          <li>Lis cette page</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceControl;
