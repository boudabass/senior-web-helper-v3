
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
  X
} from 'lucide-react';
import { Command, extractPageContent } from '@/utils/browserCommands';
import { speak } from '@/utils/speechUtils';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  // Traiter les commandes vocales
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
        // Cette fonctionnalité est complexe car elle nécessite d'accéder au DOM de l'iframe
        // Ici, nous montrons une approche simplifiée
        if (typeof command.payload === 'string') {
          simulateClick(command.payload);
        }
        break;
      case 'FILL_FORM':
        // Cette fonctionnalité est aussi complexe pour les mêmes raisons
        // Nous montrons une approche simplifiée
        if (command.payload && typeof command.payload === 'object') {
          const { fieldType, value } = command.payload as { fieldType: string, value: string };
          fillForm(fieldType, value);
        }
        break;
    }
  }, [command]);

  // Navigation vers une URL
  const navigateTo = (newUrl: string) => {
    try {
      // S'assurer que l'URL a un protocole
      let processedUrl = newUrl;
      if (!processedUrl.startsWith('http')) {
        processedUrl = 'https://' + processedUrl;
      }
      
      // Valider que c'est une URL correcte
      new URL(processedUrl);
      
      setIsLoading(true);
      setUrl(processedUrl);
      setInputUrl(processedUrl);
      
      // Mettre à jour l'historique
      const newHistory = [...history.slice(0, historyIndex + 1), processedUrl];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      // Mettre à jour l'état de navigation
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

  // Gérer le chargement de l'iframe
  const handleIframeLoad = () => {
    setIsLoading(false);
    // Essayer de mettre à jour l'URL affichée avec l'URL réelle
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const currentUrl = iframeRef.current.contentWindow.location.href;
        setInputUrl(currentUrl);
      }
    } catch (e) {
      // Certains sites peuvent bloquer l'accès à l'iframe pour des raisons de sécurité
      console.log("Impossible d'accéder à l'URL de l'iframe:", e);
    }
  };

  // Navigation arrière
  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
      setCanGoBack(newIndex > 0);
      setCanGoForward(true);
    }
  };

  // Navigation avant
  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
      setCanGoBack(true);
      setCanGoForward(newIndex < history.length - 1);
    }
  };

  // Actualiser la page
  const refresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  // Gérer la soumission du formulaire d'URL
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  // Lire le contenu de la page
  const readPageContent = () => {
    try {
      const content = extractPageContent(iframeRef.current);
      speak(content);
    } catch (e) {
      speak("Je suis désolé, je n'ai pas pu lire le contenu de cette page.");
      console.error("Erreur lors de la lecture de la page:", e);
    }
  };

  // Simulation de clic (version simplifiée)
  const simulateClick = (elementName: string) => {
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentDocument) {
        speak("Je n'arrive pas à accéder au contenu de la page pour cliquer.");
        return;
      }

      // Recherche de boutons ou liens contenant le texte
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

  // Remplissage de formulaire (version simplifiée)
  const fillForm = (fieldType: string, value: string) => {
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentDocument) {
        speak("Je n'arrive pas à accéder au formulaire.");
        return;
      }

      // Recherche d'un champ de formulaire correspondant
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
        
        // Simuler un événement de changement pour déclencher les mises à jour nécessaires
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

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-lg shadow-sm animate-fade-in">
      {/* Barre de navigation */}
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
          </div>
        </CardContent>
      </Card>
      
      {/* Navigateur */}
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
