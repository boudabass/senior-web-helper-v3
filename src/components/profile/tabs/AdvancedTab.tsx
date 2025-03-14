
import React from 'react';
import { UserProfile } from '@/types/userProfile';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Trash2 } from 'lucide-react';

interface AdvancedTabProps {
  profile: UserProfile;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  canDelete: boolean;
}

const AdvancedTab: React.FC<AdvancedTabProps> = ({
  profile,
  onInputChange,
  onDelete,
  canDelete
}) => {
  return (
    <TabsContent value="advanced" className="pt-4 space-y-6">
      <div>
        <Label htmlFor="profileName" className="text-base mb-2 block">Nom du profil</Label>
        <Input
          id="profileName"
          name="name"
          value={profile.name}
          onChange={onInputChange}
        />
      </div>
      
      {canDelete && (
        <div className="pt-4">
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full"
            onClick={onDelete}
          >
            <Trash2 size={16} className="mr-2" />
            Supprimer ce profil
          </Button>
        </div>
      )}
    </TabsContent>
  );
};

export default AdvancedTab;
