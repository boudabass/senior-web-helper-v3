
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  RefreshCw, 
  Search, 
  Link as LinkIcon,
  Book,
  X,
  Sparkles,
  Star
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface BrowserToolbarProps {
  inputUrl: string;
  setInputUrl: (url: string) => void;
  navigateTo: (url: string) => void;
  goBack: () => void;
  goForward: () => void;
  refresh: () => void;
  readPageContent: () => void;
  simplifyPage: () => void;
  addToFavorites: (name: string) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isSimplified: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const BrowserToolbar: React.FC<BrowserToolbarProps> = ({
  inputUrl,
  setInputUrl,
  navigateTo,
  goBack,
  goForward,
  refresh,
  readPageContent,
  simplifyPage,
  addToFavorites,
  canGoBack,
  canGoForward,
  isSimplified,
  handleSubmit
}) => {
  return (
    <Card className="rounded-t-lg rounded-b-none border-b">
      <CardContent className="p-2">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack} 
            disabled={!canGoBack}
            title="Retour"
          >
            <ArrowLeft size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goForward} 
            disabled={!canGoForward}
            title="Suivant"
          >
            <ArrowRight size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={refresh}
            title="Actualiser"
          >
            <RefreshCw size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigateTo('https://www.google.com')}
            title="Accueil"
          >
            <Home size={20} />
          </Button>
          
          <form onSubmit={handleSubmit} className="flex-1 flex items-center">
            <div className="relative flex-1">
              <LinkIcon size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Entrez une adresse web..."
                className="pl-8 pr-8"
              />
              {inputUrl && (
                <button 
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setInputUrl('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <Button variant="ghost" size="sm" type="submit" className="ml-1">
              <Search size={18} />
            </Button>
          </form>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={readPageContent}
            title="Lire la page"
          >
            <Book size={20} />
          </Button>
          
          <Button 
            variant={isSimplified ? "default" : "ghost"}
            size="icon" 
            onClick={simplifyPage}
            title="Simplifier la page"
          >
            <Sparkles size={20} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => addToFavorites('Favori sans nom')}
            title="Ajouter aux favoris"
          >
            <Star size={20} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrowserToolbar;
