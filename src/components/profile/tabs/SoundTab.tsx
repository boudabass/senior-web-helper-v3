
import React from 'react';
import { UserProfile } from '@/types/userProfile';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TabsContent } from "@/components/ui/tabs";
import { Volume2 } from 'lucide-react';

interface SoundTabProps {
  profile: UserProfile;
  onSliderChange: (name: string, value: number[]) => void;
}

const SoundTab: React.FC<SoundTabProps> = ({
  profile,
  onSliderChange
}) => {
  return (
    <TabsContent value="sound" className="pt-4 space-y-6">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="volume" className="text-base flex items-center gap-2">
              <Volume2 size={18} />
              <span>Volume</span>
            </Label>
            <span className="text-sm font-medium">{Math.round(profile.volume * 100)}%</span>
          </div>
          <Slider
            id="volume"
            min={0}
            max={1}
            step={0.1}
            value={[profile.volume]}
            onValueChange={(value) => onSliderChange('volume', value)}
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="voiceSpeed" className="text-base">Vitesse de la voix</Label>
            <span className="text-sm font-medium">{profile.voiceSpeed}x</span>
          </div>
          <Slider
            id="voiceSpeed"
            min={0.5}
            max={1.5}
            step={0.1}
            value={[profile.voiceSpeed]}
            onValueChange={(value) => onSliderChange('voiceSpeed', value)}
          />
        </div>
      </div>
    </TabsContent>
  );
};

export default SoundTab;
