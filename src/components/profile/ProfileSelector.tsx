
import React from 'react';
import { UserProfile } from '@/types/userProfile';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from 'lucide-react';

interface ProfileSelectorProps {
  profiles: UserProfile[];
  currentProfile: UserProfile;
  onProfileChange: (profileId: string) => void;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  currentProfile,
  onProfileChange,
}) => {
  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Profil actif</CardTitle>
        <CardDescription>Sélectionnez ou modifiez votre profil</CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          value={currentProfile.id}
          onValueChange={onProfileChange}
        >
          <SelectTrigger className="w-full h-12 text-lg">
            <SelectValue placeholder="Sélectionner un profil" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map(profile => (
              <SelectItem key={profile.id} value={profile.id} className="text-base">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{profile.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default ProfileSelector;
