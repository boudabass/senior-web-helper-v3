
import React from 'react';
import { UserProfile } from '@/types/userProfile';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";

interface AppearanceTabProps {
  profile: UserProfile;
  onSliderChange: (name: string, value: number[]) => void;
  onSelectChange: (name: string, value: string) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({
  profile,
  onSliderChange,
  onSelectChange,
  onSwitchChange
}) => {
  return (
    <TabsContent value="appearance" className="pt-4 space-y-6">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="textSize" className="text-base">Taille du texte</Label>
            <span className="text-sm font-medium">{profile.textSize}%</span>
          </div>
          <Slider
            id="textSize"
            min={80}
            max={150}
            step={10}
            value={[profile.textSize]}
            onValueChange={(value) => onSliderChange('textSize', value)}
          />
        </div>
        
        <div>
          <Label htmlFor="contrast" className="text-base mb-2 block">Niveau de contraste</Label>
          <Select
            value={profile.contrast}
            onValueChange={(value) => onSelectChange('contrast', value)}
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
            checked={profile.colorTheme === 'dark'}
            onCheckedChange={(checked) => onSwitchChange('colorTheme', checked)}
          />
        </div>
      </div>
    </TabsContent>
  );
};

export default AppearanceTab;
