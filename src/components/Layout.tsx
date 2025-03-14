
import React, { useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import BrowserArea from './browser/BrowserArea';
import UnsupportedBrowser from './UnsupportedBrowser';
import { Command } from '@/utils/browserCommands';
import { checkSpeechSupport } from '@/utils/speechUtils';
import { useUserProfiles } from '@/hooks/useUserProfiles';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [command, setCommand] = useState<Command | null>(null);
  const [browserZoom, setBrowserZoom] = useState(100);
  const speechSupport = checkSpeechSupport();
  
  // Utilisation du hook de profils utilisateur
  const { profiles, currentProfile, isLoading, createProfile, updateProfile, deleteProfile, switchProfile } = useUserProfiles();

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
    return <UnsupportedBrowser />;
  }

  return (
    <div className="senior-container animate-fade-in">
      {/* Sidebar */}
      <Sidebar 
        onCommand={handleCommand}
        currentProfile={currentProfile}
        profiles={profiles}
        isLoading={isLoading}
        createProfile={createProfile}
        updateProfile={updateProfile}
        deleteProfile={deleteProfile}
        switchProfile={switchProfile}
      />
      
      {/* Main content */}
      <BrowserArea 
        command={command}
        browserZoom={browserZoom}
        onZoomChange={handleZoomChange}
        initialZoom={currentProfile?.textSize || 100}
        initialDarkMode={currentProfile?.colorTheme === 'dark'}
      />
    </div>
  );
};

export default Layout;
