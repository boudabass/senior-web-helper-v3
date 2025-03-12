
import React, { useState } from 'react';
import VoiceControl from './VoiceControl';
import WebBrowser from './WebBrowser';
import AccessibilityControls from './AccessibilityControls';
import ProfileManager from './ProfileManager';
import { Command } from '@/utils/browserCommands';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Home, Settings, BookOpen, History, HelpCircle, Menu, BookOpenCheck, Users } from 'lucide-react';
import { checkSpeechSupport } from '@/utils/speechUtils';
import { useToast } from "@/hooks/use-toast";
import { useUserProfiles } from '@/hooks/useUserProfiles';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [command, setCommand] = useState<Command | null>(null);
  const [browserZoom, setBrowserZoom] = useState(100);
  const [isProfileManagerOpen, setIsProfileManagerOpen] = useState(false);
  const { toast } = useToast();
  const speechSupport = checkSpeechSupport();
  
  // Utilisation du hook de profils utilisateur
  const { 
    profiles, 
    currentProfile, 
    isLoading,
    createProfile, 
    updateProfile, 
    deleteProfile, 
    switchProfile 
  } = useUserProfiles();

  const handleCommand = (newCommand: Command) => {
    setCommand(newCommand);
  };

  const handleZoomChange = (zoom: number) => {
    setBrowserZoom(zoom);
    
    // Si on a un profil actif, on met à jour sa préférence de taille de texte
    if (currentProfile) {
      updateProfile({
        ...currentProfile,
        textSize: zoom
      });
    }
  };

  // Afficher un message si les fonctionnalités vocales ne sont pas supportées
  if (!speechSupport.recognition && !speechSupport.synthesis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg border border-border">
          <h1 className="text-2xl font-bold text-center mb-4">Senior 3000</h1>
          <div className="p-4 bg-destructive/10 rounded-lg mb-6">
            <p className="text-destructive font-medium mb-2">
              Votre navigateur ne prend pas en charge les fonctionnalités vocales requises.
            </p>
            <p className="text-sm">
              Pour utiliser Senior 3000, veuillez ouvrir cette application dans un navigateur plus récent comme Chrome, Edge ou Safari.
            </p>
          </div>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Chrome (recommandé)</li>
            <li>Microsoft Edge</li>
            <li>Safari (version récente)</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Senior 3000 utilise les API Web Speech pour la reconnaissance vocale et la synthèse vocale, qui ne sont pas disponibles sur tous les navigateurs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="senior-container animate-fade-in">
      {/* Sidebar */}
      <div className="control-sidebar border-r border-border">
        <div className="flex flex-col h-full">
          <div className="text-center py-4 border-b border-border">
            <h1 className="text-2xl font-bold">Senior 3000</h1>
            <p className="text-sm text-muted-foreground">Assistant web vocal</p>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Contrôle vocal</h2>
              <VoiceControl 
                onCommand={handleCommand} 
                isEnabled={true} 
                volume={currentProfile?.volume || 1}
                voiceSpeed={currentProfile?.voiceSpeed || 1}
              />
            </div>
            
            <div className="my-6">
              <h2 className="text-lg font-medium mb-4">Raccourcis</h2>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="btn-xl justify-start" 
                  onClick={() => handleCommand({ type: 'HOME' })}
                >
                  <Home size={20} className="mr-2" />
                  <span>Accueil</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="btn-xl justify-start"
                  onClick={() => {
                    handleCommand({ type: 'OPEN_URL', payload: 'https://www.ameli.fr' });
                  }}
                >
                  <BookOpen size={20} className="mr-2" />
                  <span>Ameli</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="btn-xl justify-start"
                  onClick={() => {
                    handleCommand({ type: 'OPEN_URL', payload: 'https://www.impots.gouv.fr' });
                  }}
                >
                  <BookOpen size={20} className="mr-2" />
                  <span>Impôts</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="btn-xl justify-start"
                  onClick={() => {
                    handleCommand({ type: 'OPEN_URL', payload: 'https://www.doctolib.fr' });
                  }}
                >
                  <BookOpen size={20} className="mr-2" />
                  <span>Doctolib</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-border">
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="icon" 
                className="btn-xl"
                onClick={() => {
                  toast({
                    title: "Aide",
                    description: "Fonctionnalité d'aide à venir dans une prochaine version.",
                  });
                }}
              >
                <HelpCircle size={24} />
              </Button>
              
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="btn-xl"
                >
                  <Users size={24} />
                </Button>
              </SheetTrigger>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="btn-xl"
                onClick={() => {
                  toast({
                    title: "Historique",
                    description: "Fonctionnalité d'historique à venir dans une prochaine version.",
                  });
                }}
              >
                <History size={24} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="btn-xl"
                onClick={() => {
                  toast({
                    title: "Paramètres",
                    description: "Fonctionnalité de paramètres à venir dans une prochaine version.",
                  });
                }}
              >
                <Settings size={24} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col p-4 overflow-hidden">
        <AccessibilityControls 
          onZoomChange={handleZoomChange} 
          initialZoom={currentProfile?.textSize || 100} 
          initialDarkMode={currentProfile?.colorTheme === 'dark'}
        />
        <div className="browser-container flex-grow" style={{ fontSize: `${browserZoom}%` }}>
          <WebBrowser command={command} />
        </div>
      </div>
      
      {/* Gestionnaire de profils */}
      <Sheet>
        <SheetContent side="left" className="w-[350px] sm:w-[450px] overflow-y-auto">
          <SheetHeader className="text-left mb-6">
            <SheetTitle className="text-2xl">Profils Utilisateurs</SheetTitle>
          </SheetHeader>
          
          <ProfileManager 
            profiles={profiles}
            currentProfile={currentProfile}
            isLoading={isLoading}
            createProfile={createProfile}
            updateProfile={updateProfile}
            deleteProfile={deleteProfile}
            switchProfile={switchProfile}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Layout;
