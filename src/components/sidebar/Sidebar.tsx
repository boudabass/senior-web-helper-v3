
import React from 'react';
import VoiceControl from '../VoiceControl';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';
import { Command } from '@/utils/browserCommands';
import { UserProfile } from '@/types/userProfile';

interface SidebarProps {
  onCommand: (command: Command) => void;
  currentProfile: UserProfile | null;
  profiles: UserProfile[];
  isLoading: boolean;
  createProfile: (name: string) => void;
  updateProfile: (profile: UserProfile) => void;
  deleteProfile: (profileId: string) => void;
  switchProfile: (profileId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onCommand,
  currentProfile,
  profiles,
  isLoading,
  createProfile,
  updateProfile,
  deleteProfile,
  switchProfile
}) => {
  return (
    <div className="control-sidebar border-r border-border">
      <div className="flex flex-col h-full">
        <SidebarHeader />
        
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Contrôle vocal</h2>
            <VoiceControl 
              onCommand={onCommand} 
              isEnabled={true} 
              volume={currentProfile?.volume || 1}
              voiceSpeed={currentProfile?.voiceSpeed || 1}
            />
          </div>
          
          <SidebarNav onCommand={onCommand} />
        </div>
        
        <SidebarFooter 
          profiles={profiles}
          currentProfile={currentProfile}
          isLoading={isLoading}
          createProfile={createProfile}
          updateProfile={updateProfile}
          deleteProfile={deleteProfile}
          switchProfile={switchProfile}
        />
      </div>
    </div>
  );
};

export default Sidebar;
