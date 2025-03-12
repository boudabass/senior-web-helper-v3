
import React from 'react';
import { Favorite } from '@/types/favorite';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Star, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Command } from '@/utils/browserCommands';

interface FavoritesManagerProps {
  favorites: Favorite[];
  isLoading: boolean;
  onRemove: (id: string) => void;
  onNavigate: (url: string) => void;
}

const FavoritesManager: React.FC<FavoritesManagerProps> = ({
  favorites,
  isLoading,
  onRemove,
  onNavigate
}) => {
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg font-medium loading-dots">Chargement des favoris</div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-background/50">
        <CardContent className="p-6 text-center">
          <Star className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="text-xl font-medium mb-2">Aucun favori</h3>
          <p className="text-muted-foreground">
            Vous pouvez ajouter des favoris en disant "Enregistrer comme favori" suivi du nom du favori lorsque vous visitez un site web.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Mes Favoris</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map(favorite => (
          <Card key={favorite.id} className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Star className="mr-2 text-yellow-500" size={20} />
                {favorite.name}
              </CardTitle>
              <CardDescription className="truncate text-sm">
                {favorite.url}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pb-2 pt-0">
              <p className="text-sm text-muted-foreground">
                Ajouté le {favorite.createdAt.toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  onNavigate(favorite.url);
                  toast({
                    title: "Navigation",
                    description: `Navigation vers ${favorite.name}`,
                  });
                }}
              >
                <ExternalLink size={16} className="mr-2" />
                Ouvrir
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => {
                  onRemove(favorite.id);
                  toast({
                    title: "Favori supprimé",
                    description: `Le favori "${favorite.name}" a été supprimé`,
                  });
                }}
              >
                <Trash2 size={16} className="mr-2" />
                Supprimer
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesManager;
