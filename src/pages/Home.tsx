
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Search, Star, Clock, HelpCircle, Bookmark } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import FavoritesManager from '@/components/FavoritesManager';
import { Command } from '@/utils/browserCommands';
import { speak } from '@/utils/speechUtils';

const Home = () => {
  const { favorites, isLoading, removeFavorite } = useFavorites();
  
  const [command, setCommand] = React.useState<Command | null>(null);

  const handleNavigate = (url: string) => {
    setCommand({ type: 'OPEN_URL', payload: url });
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-6 space-y-8">
        <Card className="w-full max-w-4xl bg-card shadow-lg border border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold">Bienvenue sur Senior 3000</CardTitle>
            <CardDescription className="text-xl">
              Votre assistant web vocal pour une navigation simplifiée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-lg">
              Naviguez sur Internet à l'aide de votre voix. Dites simplement ce que vous voulez faire !
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 border border-primary/20 bg-primary/5">
                <div className="flex flex-col items-center space-y-4">
                  <Mic size={48} className="text-primary" />
                  <h3 className="text-xl font-medium">Commandez par la voix</h3>
                  <p className="text-center">
                    Dites "Ouvrir Google" ou "Rechercher météo Paris" pour naviguer sans utiliser le clavier.
                  </p>
                </div>
              </Card>
              
              <Card className="p-4 border border-primary/20 bg-primary/5">
                <div className="flex flex-col items-center space-y-4">
                  <Search size={48} className="text-primary" />
                  <h3 className="text-xl font-medium">Recherchez facilement</h3>
                  <p className="text-center">
                    Trouvez rapidement l'information dont vous avez besoin grâce à la recherche vocale.
                  </p>
                </div>
              </Card>
              
              <Card className="p-4 border border-primary/20 bg-primary/5">
                <div className="flex flex-col items-center space-y-4">
                  <Star size={48} className="text-primary" />
                  <h3 className="text-xl font-medium">Vos sites favoris</h3>
                  <p className="text-center">
                    Dites "Enregistrer comme favori" pour sauvegarder vos sites préférés et y accéder facilement.
                  </p>
                </div>
              </Card>
              
              <Card className="p-4 border border-primary/20 bg-primary/5">
                <div className="flex flex-col items-center space-y-4">
                  <HelpCircle size={48} className="text-primary" />
                  <h3 className="text-xl font-medium">Aide accessible</h3>
                  <p className="text-center">
                    Dites "Aide" à tout moment pour afficher la liste des commandes disponibles.
                  </p>
                </div>
              </Card>
            </div>

            <FavoritesManager 
              favorites={favorites}
              isLoading={isLoading}
              onRemove={removeFavorite}
              onNavigate={handleNavigate}
            />
            
            <div className="flex justify-center pt-4">
              <Button 
                size="lg" 
                className="btn-xl text-xl px-8 py-6"
                onClick={() => {
                  speak("Activez le micro et dites par exemple: Ouvrir Google, ou Rechercher actualités");
                }}
              >
                <Mic size={24} className="mr-2" />
                Commencer à naviguer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Home;
