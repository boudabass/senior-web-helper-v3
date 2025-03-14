
import React, { useState } from 'react';
import { UserProfile } from '@/types/userProfile';
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';
import { Card } from "@/components/ui/card";
import ProfileSelector from './ProfileSelector';
import ProfileEditor from './ProfileEditor';
import CreateProfileDialog from './CreateProfileDialog';

interface ProfileManagerProps {
  profiles: UserProfile[];
  currentProfile: UserProfile;
  isLoading: boolean;
  createProfile: (name: string) => void;
  updateProfile: (profile: UserProfile) => void;
  deleteProfile: (profileId: string) => void;
  switchProfile: (profileId: string) => void;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({
  profiles,
  currentProfile,
  isLoading,
  createProfile,
  updateProfile,
  deleteProfile,
  switchProfile
}) => {
  const [editedProfile, setEditedProfile] = useState<UserProfile>({...currentProfile});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (isLoading) {
    return <div className="p-4 text-center animate-pulse">Chargement des profils...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={24} className="text-primary" />
          <h2 className="text-xl font-medium">Profils Utilisateurs</h2>
        </div>
        
        <CreateProfileDialog 
          isOpen={isCreateDialogOpen} 
          setIsOpen={setIsCreateDialogOpen} 
          createProfile={createProfile} 
        />
      </div>

      <ProfileSelector 
        profiles={profiles} 
        currentProfile={currentProfile} 
        onProfileChange={switchProfile} 
      />

      <ProfileEditor 
        profile={editedProfile}
        setProfile={setEditedProfile}
        currentProfile={currentProfile}
        onSave={() => updateProfile(editedProfile)}
        onDelete={() => deleteProfile(currentProfile.id)}
        profilesCount={profiles.length}
      />
    </div>
  );
};

export default ProfileManager;
