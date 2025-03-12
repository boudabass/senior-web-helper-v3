
import React, { useState } from 'react';
import { UserProfile } from '@/types/userProfile';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, Settings, Trash2, Save, Plus, Volume2, Type, PanelTop } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
  const [newProfileName, setNewProfileName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleProfileChange = (profileId: string) => {
    switchProfile(profileId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setEditedProfile(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setEditedProfile(prev => ({
      ...prev,
      [name]: checked ? 'dark' : 'light'
    }));
  };

  const handleSaveProfile = () => {
    updateProfile(editedProfile);
  };

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      createProfile(newProfileName.trim());
      setNewProfileName('');
      setIsCreateDialogOpen(false);
    } else {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer un nom pour le nouveau profil.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProfile = () => {
    deleteProfile(currentProfile.id);
  };

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
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="btn-xl flex gap-2">
              <Plus size={18} />
              <span>Nouveau profil</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau profil</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="profileName">Nom du profil</Label>
              <Input
                id="profileName"
                placeholder="Ex: Profil de Jean"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleCreateProfile}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sélection du profil actif */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Profil actif</CardTitle>
          <CardDescription>Sélectionnez ou modifiez votre profil</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={currentProfile.id}
            onValueChange={handleProfileChange}
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

      {/* Édition du profil */}
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
            
            <TabsContent value="appearance" className="pt-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="textSize" className="text-base">Taille du texte</Label>
                    <span className="text-sm font-medium">{editedProfile.textSize}%</span>
                  </div>
                  <Slider
                    id="textSize"
                    min={80}
                    max={150}
                    step={10}
                    value={[editedProfile.textSize]}
                    onValueChange={(value) => handleSliderChange('textSize', value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="contrast" className="text-base mb-2 block">Niveau de contraste</Label>
                  <Select
                    value={editedProfile.contrast}
                    onValueChange={(value) => handleSelectChange('contrast', value)}
                  >
                    <SelectTrigger id="contrast" className="w-full">
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">Élevé</SelectItem>
                      <SelectItem value="very-high">Très élevé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="darkMode" className="text-base">Mode sombre</Label>
                    <span className="text-sm text-muted-foreground">Couleurs moins lumineuses</span>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={editedProfile.colorTheme === 'dark'}
                    onCheckedChange={(checked) => handleSwitchChange('colorTheme', checked)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sound" className="pt-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="volume" className="text-base flex items-center gap-2">
                      <Volume2 size={18} />
                      <span>Volume</span>
                    </Label>
                    <span className="text-sm font-medium">{Math.round(editedProfile.volume * 100)}%</span>
                  </div>
                  <Slider
                    id="volume"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[editedProfile.volume]}
                    onValueChange={(value) => handleSliderChange('volume', value)}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="voiceSpeed" className="text-base">Vitesse de la voix</Label>
                    <span className="text-sm font-medium">{editedProfile.voiceSpeed}x</span>
                  </div>
                  <Slider
                    id="voiceSpeed"
                    min={0.5}
                    max={1.5}
                    step={0.1}
                    value={[editedProfile.voiceSpeed]}
                    onValueChange={(value) => handleSliderChange('voiceSpeed', value)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="pt-4 space-y-6">
              <div>
                <Label htmlFor="profileName" className="text-base mb-2 block">Nom du profil</Label>
                <Input
                  id="profileName"
                  name="name"
                  value={editedProfile.name}
                  onChange={handleInputChange}
                />
              </div>
              
              {profiles.length > 1 && (
                <div className="pt-4">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={handleDeleteProfile}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Supprimer ce profil
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="pt-2">
          <Button className="w-full" onClick={handleSaveProfile}>
            <Save size={16} className="mr-2" />
            Enregistrer les modifications
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileManager;
