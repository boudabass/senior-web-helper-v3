
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Settings, History, HelpCircle, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ProfileManager from '../profile';
import { UserProfile } from '@/types/userProfile';

interface SidebarFooterProps {
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  isLoading: boolean;
  createProfile: (name: string) => void;
  updateProfile: (profile: UserProfile) => void;
  deleteProfile: (profileId: string) => void;
  switchProfile: (profileId: string) => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
  profiles,
  currentProfile,
  isLoading,
  createProfile,
  updateProfile,
  deleteProfile,
  switchProfile
}) => {
  const { toast } = useToast();

  return (
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
        
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="btn-xl"
            >
              <Users size={24} />
            </Button>
          </SheetTrigger>
          
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
  );
};

export default SidebarFooter;
