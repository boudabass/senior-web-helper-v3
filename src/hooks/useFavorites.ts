
import { useState, useEffect } from 'react';
import { Favorite } from '@/types/favorite';
import { v4 as uuidv4 } from 'uuid';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement des favoris depuis le localStorage
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('senior3000_favorites');
        if (savedFavorites) {
          const parsed = JSON.parse(savedFavorites);
          // Convertir les chaînes de date en objets Date
          const favoritesWithDates = parsed.map((fav: any) => ({
            ...fav,
            createdAt: new Date(fav.createdAt)
          }));
          setFavorites(favoritesWithDates);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Sauvegarde des favoris dans le localStorage
  const saveFavorites = (newFavorites: Favorite[]) => {
    try {
      localStorage.setItem('senior3000_favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  };

  const addFavorite = (name: string, url: string): Favorite => {
    const newFavorite: Favorite = {
      id: uuidv4(),
      name,
      url,
      createdAt: new Date()
    };

    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(updatedFavorites);
    saveFavorites(updatedFavorites);
    return newFavorite;
  };

  const removeFavorite = (id: string): boolean => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    
    if (updatedFavorites.length !== favorites.length) {
      setFavorites(updatedFavorites);
      saveFavorites(updatedFavorites);
      return true;
    }
    
    return false;
  };

  const getFavoriteByName = (name: string): Favorite | undefined => {
    return favorites.find(fav => 
      fav.name.toLowerCase() === name.toLowerCase()
    );
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    getFavoriteByName
  };
};
