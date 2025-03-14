
import React from 'react';
import { UserProfile } from '@/types/userProfile';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Trash2, Save } from 'lucide-react';
import AppearanceTab from './tabs/AppearanceTab';
import SoundTab from './tabs/SoundTab';
import AdvancedTab from './tabs/AdvancedTab';

interface ProfileEditorProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  currentProfile: UserProfile;
  onSave: () => void;
  onDelete: () => void;
  profilesCount: number;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profile,
  setProfile,
  currentProfile,
  onSave,
  onDelete,
  profilesCount
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setProfile(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      [name]: checked ? 'dark' : 'light'
    }));
  };

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings size={20} />
          <span>Personnaliser "{currentProfile.name}"</span>
        </CardTitle>
        <CardDescription>Modifiez les paramètres de ce profil</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid grid-cols-3 h-12">
            <TabsTrigger value="appearance" className="text-base">Apparence</TabsTrigger>
            <TabsTrigger value="sound" className="text-base">Audio</TabsTrigger>
            <TabsTrigger value="advanced" className="text-base">Avancé</TabsTrigger>
          </TabsList>
          
          <AppearanceTab 
            profile={profile} 
            onSliderChange={handleSliderChange}
            onSelectChange={handleSelectChange}
            onSwitchChange={handleSwitchChange}
          />
          
          <SoundTab 
            profile={profile} 
            onSliderChange={handleSliderChange} 
          />
          
          <AdvancedTab 
            profile={profile} 
            onInputChange={handleInputChange} 
            onDelete={onDelete}
            canDelete={profilesCount > 1}
          />
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full" onClick={onSave}>
          <Save size={16} className="mr-2" />
          Enregistrer les modifications
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileEditor;
