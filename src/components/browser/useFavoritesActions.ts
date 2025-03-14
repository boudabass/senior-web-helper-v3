
import { useToast } from "@/hooks/use-toast";
import { speak } from '@/utils/speechUtils';
import { useFavorites } from '@/hooks/useFavorites';

export const useFavoritesActions = (
  iframeRef: React.RefObject<HTMLIFrameElement>,
  navigateTo: (url: string) => void
) => {
  const { toast } = useToast();
  const { addFavorite, getFavoriteByName, removeFavorite, favorites } = useFavorites();

  const addToFavorites = (name: string) => {
    try {
      // Vérifier si l'URL actuelle est valide
      if (!iframeRef.current || !iframeRef.current.contentWindow) {
        speak("Je ne peux pas ajouter cette page aux favoris car je n'ai pas accès à l'URL actuelle.");
        return;
      }
      
      // Récupérer l'URL actuelle
      const currentUrl = iframeRef.current.contentWindow.location.href;
      
      // Si le nom est vide, utiliser le titre de la page
      let favoriteName = name;
      if (!favoriteName || favoriteName === 'Favori sans nom') {
        try {
          favoriteName = iframeRef.current.contentDocument?.title || 'Page sans titre';
        } catch (e) {
          favoriteName = 'Page sans titre';
        }
      }
      
      // Vérifier si un favori avec ce nom existe déjà
      const existingFavorite = getFavoriteByName(favoriteName);
      if (existingFavorite) {
        speak(`Un favori avec le nom ${favoriteName} existe déjà. Veuillez choisir un autre nom.`);
        toast({
          title: "Nom déjà utilisé",
          description: `Un favori avec le nom "${favoriteName}" existe déjà.`,
          variant: "destructive",
        });
        return;
      }
      
      // Ajouter le favori
      const newFavorite = addFavorite(favoriteName, currentUrl);
      
      speak(`J'ai ajouté ${favoriteName} à vos favoris.`);
      toast({
        title: "Favori ajouté",
        description: `"${favoriteName}" a été ajouté à vos favoris.`,
      });
    } catch (e) {
      speak("Je n'ai pas pu ajouter cette page aux favoris.");
      console.error("Erreur lors de l'ajout du favori:", e);
    }
  };

  const openFavorite = (name: string) => {
    // Chercher le favori par son nom
    const favorite = getFavoriteByName(name);
    
    if (favorite) {
      navigateTo(favorite.url);
      speak(`J'ouvre votre favori ${name}.`);
    } else {
      speak(`Je n'ai pas trouvé de favori nommé ${name}.`);
      toast({
        title: "Favori introuvable",
        description: `Aucun favori nommé "${name}" n'a été trouvé.`,
        variant: "destructive",
      });
    }
  };

  const listFavorites = () => {
    if (favorites.length === 0) {
      speak("Vous n'avez pas encore de favoris enregistrés.");
      return;
    }
    
    let message = `Vous avez ${favorites.length} favoris: `;
    favorites.forEach((favorite, index) => {
      message += `${favorite.name}${index < favorites.length - 1 ? ', ' : '.'}`;
    });
    
    speak(message);
    
    toast({
      title: "Vos favoris",
      description: message,
      duration: 5000,
    });
  };
  
  const removeFavoriteByName = (name: string) => {
    const favorite = getFavoriteByName(name);
    
    if (favorite) {
      const success = removeFavorite(favorite.id);
      if (success) {
        speak(`J'ai supprimé le favori ${name}.`);
        toast({
          title: "Favori supprimé",
          description: `"${name}" a été supprimé de vos favoris.`,
        });
      } else {
        speak(`Je n'ai pas pu supprimer le favori ${name}.`);
      }
    } else {
      speak(`Je n'ai pas trouvé de favori nommé ${name}.`);
      toast({
        title: "Favori introuvable",
        description: `Aucun favori nommé "${name}" n'a été trouvé.`,
        variant: "destructive",
      });
    }
  };

  return {
    addToFavorites,
    openFavorite,
    listFavorites,
    removeFavoriteByName
  };
};
