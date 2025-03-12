
import { useState, useEffect } from 'react';
import { UserProfile, DEFAULT_PROFILE } from '@/types/userProfile';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

export const useUserProfiles = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Chargement des profils depuis le localStorage
  useEffect(() => {
    const loadProfiles = () => {
      try {
        setIsLoading(true);
        
        // Récupérer les profils sauvegardés
        const savedProfiles = localStorage.getItem('senior3000_profiles');
        const parsedProfiles: UserProfile[] = savedProfiles 
          ? JSON.parse(savedProfiles)
          : [DEFAULT_PROFILE];
        
        // Récupérer l'ID du profil actif
        const activeProfileId = localStorage.getItem('senior3000_active_profile') || 'default';
        
        // S'assurer qu'il y a au moins le profil par défaut
        if (parsedProfiles.length === 0) {
          parsedProfiles.push(DEFAULT_PROFILE);
        }
        
        // Trouver le profil actif
        const activeProfile = parsedProfiles.find(p => p.id === activeProfileId) || parsedProfiles[0];
        
        // Mettre à jour l'état
        setProfiles(parsedProfiles);
        setCurrentProfile(activeProfile);
      } catch (error) {
        console.error('Erreur lors du chargement des profils:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger vos profils. Le profil par défaut sera utilisé.",
          variant: "destructive",
        });
        
        // En cas d'erreur, utiliser le profil par défaut
        setProfiles([DEFAULT_PROFILE]);
        setCurrentProfile(DEFAULT_PROFILE);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, []);

  // Sauvegarder les profils dans le localStorage chaque fois qu'ils changent
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('senior3000_profiles', JSON.stringify(profiles));
    }
  }, [profiles, isLoading]);

  // Sauvegarder le profil actif dans le localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('senior3000_active_profile', currentProfile.id);
      
      // Mettre à jour la date de dernière utilisation
      const updatedProfiles = profiles.map(profile => 
        profile.id === currentProfile.id 
          ? {...profile, lastUsed: new Date()} 
          : profile
      );
      
      setProfiles(updatedProfiles);
      
      // Appliquer les préférences du profil actif
      applyProfileSettings(currentProfile);
    }
  }, [currentProfile, isLoading]);

  // Appliquer les paramètres du profil actif
  const applyProfileSettings = (profile: UserProfile) => {
    // Appliquer le thème
    if (profile.colorTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Appliquer le contraste
    document.documentElement.dataset.contrast = profile.contrast;
    
    // D'autres paramètres seront appliqués par les composants qui utilisent le profil
  };

  // Créer un nouveau profil
  const createProfile = (name: string) => {
    const newProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      id: uuidv4(),
      name,
      lastUsed: new Date()
    };
    
    setProfiles(prev => [...prev, newProfile]);
    setCurrentProfile(newProfile);
    
    toast({
      title: "Nouveau profil créé",
      description: `Le profil "${name}" a été créé et activé.`,
    });
    
    return newProfile;
  };

  // Mettre à jour un profil
  const updateProfile = (updatedProfile: UserProfile) => {
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === updatedProfile.id ? updatedProfile : profile
      )
    );
    
    if (currentProfile.id === updatedProfile.id) {
      setCurrentProfile(updatedProfile);
    }
    
    toast({
      title: "Profil mis à jour",
      description: `Les préférences du profil "${updatedProfile.name}" ont été enregistrées.`,
    });
  };

  // Supprimer un profil
  const deleteProfile = (profileId: string) => {
    // Empêcher la suppression du dernier profil
    if (profiles.length <= 1) {
      toast({
        title: "Action impossible",
        description: "Vous devez conserver au moins un profil.",
        variant: "destructive",
      });
      return;
    }
    
    // Supprimer le profil
    const filteredProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(filteredProfiles);
    
    // Si le profil supprimé était actif, activer le premier profil restant
    if (currentProfile.id === profileId) {
      setCurrentProfile(filteredProfiles[0]);
    }
    
    toast({
      title: "Profil supprimé",
      description: "Le profil a été supprimé avec succès.",
    });
  };

  // Changer de profil actif
  const switchProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    
    if (profile) {
      setCurrentProfile(profile);
      
      toast({
        title: "Profil activé",
        description: `Le profil "${profile.name}" est maintenant actif.`,
      });
    }
  };

  return {
    profiles,
    currentProfile,
    isLoading,
    createProfile,
    updateProfile,
    deleteProfile,
    switchProfile
  };
};
