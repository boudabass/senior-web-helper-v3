
import React, { useState, useRef, useEffect } from 'react';
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
  ArrowUp,
  ArrowDown,
  ZoomIn,
  ZoomOut,
  Star,
  Sparkles
} from 'lucide-react';
import { Command, extractPageContent } from '@/utils/browserCommands';
import { speak } from '@/utils/speechUtils';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { simplifyWebPage } from '@/utils/simplifyWebPage';
import { useFavorites } from '@/hooks/useFavorites';

interface WebBrowserProps {
  command: Command | null;
}

const WebBrowser: React.FC<WebBrowserProps> = ({ command }) => {
  const [url, setUrl] = useState('https://www.google.com');
  const [isLoading, setIsLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSimplified, setIsSimplified] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  const { addFavorite, getFavoriteByName, removeFavorite, favorites } = useFavorites();

  const navigateTo = (newUrl: string) => {
    try {
      let processedUrl = newUrl;
      if (!processedUrl.startsWith('http')) {
        processedUrl = 'https://' + processedUrl;
      }
      
      new URL(processedUrl);
      
      setIsLoading(true);
      setUrl(processedUrl);
      setInputUrl(processedUrl);
      setIsSimplified(false);
      
      const newHistory = [...history.slice(0, historyIndex + 1), processedUrl];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      setCanGoBack(newHistory.length > 1);
      setCanGoForward(false);
    } catch (e) {
      toast({
        title: "URL invalide",
        description: "L'URL que vous avez saisie n'est pas valide.",
        variant: "destructive",
      });
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const currentUrl = iframeRef.current.contentWindow.location.href;
        setInputUrl(currentUrl);
      }
    } catch (e) {
      console.log("Impossible d'accéder à l'URL de l'iframe:", e);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
      setCanGoBack(newIndex > 0);
      setCanGoForward(true);
      setIsSimplified(false);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
      setCanGoBack(true);
      setCanGoForward(newIndex < history.length - 1);
      setIsSimplified(false);
    }
  };

  const refresh = () => {
    setIsLoading(true);
    setIsSimplified(false);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  const readPageContent = () => {
    try {
      const content = extractPageContent(iframeRef.current);
      speak(content);
    } catch (e) {
      speak("Je suis désolé, je n'ai pas pu lire le contenu de cette page.");
      console.error("Erreur lors de la lecture de la page:", e);
    }
  };

  const simplifyPage = () => {
    try {
      const success = simplifyWebPage(iframeRef.current, 1.5, true);
      if (success) {
        setIsSimplified(true);
        speak("J'ai simplifié la page pour vous. Les textes sont plus grands et les distractions ont été supprimées.");
        toast({
          title: "Page simplifiée",
          description: "La page a été adaptée pour une meilleure lisibilité.",
        });
      } else {
        speak("Je n'ai pas pu simplifier cette page en raison de restrictions de sécurité.");
        toast({
          title: "Erreur",
          description: "Impossible de simplifier cette page.",
          variant: "destructive",
        });
      }
    } catch (e) {
      speak("Je n'ai pas pu simplifier cette page en raison d'une erreur technique.");
      console.error("Erreur lors de la simplification de la page:", e);
    }
  };

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

  const simulateClick = (elementName: string) => {
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentDocument) {
        speak("Je n'arrive pas à accéder au contenu de la page pour cliquer.");
        return;
      }

      const elements = Array.from(iframe.contentDocument.querySelectorAll('button, a, [role="button"], input[type="submit"], input[type="button"]'));
      
      const matchingElement = elements.find(el => {
        const text = el.textContent?.toLowerCase() || '';
        const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() || '';
        const value = (el as HTMLInputElement).value?.toLowerCase() || '';
        
        return text.includes(elementName.toLowerCase()) || 
               ariaLabel.includes(elementName.toLowerCase()) ||
               value.includes(elementName.toLowerCase());
      });
      
      if (matchingElement) {
        (matchingElement as HTMLElement).click();
        speak(`J'ai cliqué sur "${elementName}".`);
      } else {
        speak(`Je n'ai pas trouvé de bouton ou de lien nommé "${elementName}".`);
      }
    } catch (e) {
      speak("Je n'ai pas pu effectuer cette action en raison de restrictions de sécurité.");
      console.error("Erreur lors du clic:", e);
    }
  };

  const fillForm = (fieldType: string, value: string) => {
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentDocument) {
        speak("Je n'arrive pas à accéder au formulaire.");
        return;
      }

      const inputs = Array.from(iframe.contentDocument.querySelectorAll('input, textarea'));
      
      const matchingInput = inputs.find(input => {
        const name = input.getAttribute('name')?.toLowerCase() || '';
        const id = input.getAttribute('id')?.toLowerCase() || '';
        const placeholder = input.getAttribute('placeholder')?.toLowerCase() || '';
        const type = input.getAttribute('type')?.toLowerCase() || '';
        const ariaLabel = input.getAttribute('aria-label')?.toLowerCase() || '';
        
        return name.includes(fieldType.toLowerCase()) ||
               id.includes(fieldType.toLowerCase()) ||
               placeholder.includes(fieldType.toLowerCase()) ||
               type.includes(fieldType.toLowerCase()) ||
               ariaLabel.includes(fieldType.toLowerCase());
      });
      
      if (matchingInput) {
        (matchingInput as HTMLInputElement).value = value;
        speak(`J'ai rempli le champ "${fieldType}" avec "${value}".`);
        
        const event = new Event('input', { bubbles: true });
        matchingInput.dispatchEvent(event);
      } else {
        speak(`Je n'ai pas trouvé de champ nommé "${fieldType}" dans le formulaire.`);
      }
    } catch (e) {
      speak("Je n'ai pas pu remplir ce formulaire en raison de restrictions de sécurité.");
      console.error("Erreur lors du remplissage du formulaire:", e);
    }
  };

  const scrollPage = (direction: 'up' | 'down') => {
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) {
        speak("Je n'arrive pas à faire défiler la page.");
        return;
      }

      const amount = direction === 'down' ? 300 : -300;
      iframe.contentWindow.scrollBy({ top: amount, behavior: 'smooth' });
      
      speak(direction === 'down' ? "Je défile vers le bas." : "Je défile vers le haut.");
    } catch (e) {
      speak("Je n'ai pas pu faire défiler cette page en raison de restrictions de sécurité.");
      console.error("Erreur lors du défilement:", e);
    }
  };

  useEffect(() => {
    if (!command) return;

    switch (command.type) {
      case 'OPEN_URL':
        if (typeof command.payload === 'string') {
          navigateTo(command.payload);
        }
        break;
      case 'SEARCH':
        if (typeof command.payload === 'string') {
          const searchQuery = encodeURIComponent(command.payload);
          navigateTo(`https://www.google.com/search?q=${searchQuery}`);
        }
        break;
      case 'GO_BACK':
        goBack();
        break;
      case 'GO_FORWARD':
        goForward();
        break;
      case 'HOME':
        navigateTo('https://www.google.com');
        break;
      case 'READ_PAGE':
        readPageContent();
        break;
      case 'CLICK':
        if (typeof command.payload === 'string') {
          simulateClick(command.payload);
        }
        break;
      case 'FILL_FORM':
        if (command.payload && typeof command.payload === 'object') {
          const { fieldType, value } = command.payload as { fieldType: string, value: string };
          fillForm(fieldType, value);
        }
        break;
      case 'SCROLL_DOWN':
        scrollPage('down');
        break;
      case 'SCROLL_UP':
        scrollPage('up');
        break;
      case 'ADD_FAVORITE':
        if (typeof command.payload === 'string') {
          addToFavorites(command.payload);
        }
        break;
      case 'OPEN_FAVORITE':
        if (typeof command.payload === 'string') {
          openFavorite(command.payload);
        }
        break;
      case 'LIST_FAVORITES':
        listFavorites();
        break;
      case 'REMOVE_FAVORITE':
        if (typeof command.payload === 'string') {
          removeFavoriteByName(command.payload);
        }
        break;
      case 'SIMPLIFY_PAGE':
        simplifyPage();
        break;
    }
  }, [command]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-lg shadow-sm animate-fade-in">
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
      
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-lg font-medium loading-dots">Chargement</div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={url}
          className="browser-frame"
          onLoad={handleIframeLoad}
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts"
          title="Navigateur Senior 3000"
        />
      </div>
    </div>
  );
};

export default WebBrowser;
