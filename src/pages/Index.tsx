
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Search, BookOpen, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  // On garde la page simple avec le layout qui gère déjà la majorité des fonctionnalités
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-6 space-y-8">
        <Card className="w-full max-w-3xl bg-card shadow-lg border border-border">
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
                  <BookOpen size={48} className="text-primary" />
                  <h3 className="text-xl font-medium">Sites préférés</h3>
                  <p className="text-center">
                    Accédez d'un clic à vos sites importants comme Ameli, Impôts ou Doctolib.
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
            
            <div className="flex justify-center pt-4">
              <Button size="lg" className="btn-xl text-xl px-8 py-6">
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

export default Index;
