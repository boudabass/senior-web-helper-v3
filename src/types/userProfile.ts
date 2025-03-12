
export interface UserProfile {
  id: string;
  name: string;
  textSize: number;
  contrast: 'normal' | 'high' | 'very-high';
  volume: number;
  voiceSpeed: number;
  colorTheme: 'light' | 'dark';
  lastUsed: Date;
}

export const DEFAULT_PROFILE: UserProfile = {
  id: 'default',
  name: 'Profil par défaut',
  textSize: 100,
  contrast: 'normal',
  volume: 1,
  voiceSpeed: 1,
  colorTheme: 'light',
  lastUsed: new Date()
};
