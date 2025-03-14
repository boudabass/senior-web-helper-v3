
import { useRef } from 'react';
import { speak } from '@/utils/speechUtils';
import { useToast } from "@/hooks/use-toast";
import { extractPageContent } from '@/utils/browserCommands';
import { simplifyWebPage } from '@/utils/simplifyWebPage';

export const useBrowserActions = (
  iframeRef: React.RefObject<HTMLIFrameElement>,
  setIsSimplified: (value: boolean) => void
) => {
  const { toast } = useToast();

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

  return {
    readPageContent,
    simplifyPage,
    simulateClick,
    fillForm,
    scrollPage
  };
};
