
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useBrowserNavigation = () => {
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

  // Initialize browser with Google homepage
  useEffect(() => {
    if (history.length === 0) {
      navigateTo('https://www.google.com');
    }
  }, []);

  return {
    url,
    isLoading,
    canGoBack,
    canGoForward,
    inputUrl,
    setInputUrl,
    history,
    historyIndex,
    isSimplified,
    setIsSimplified,
    iframeRef,
    navigateTo,
    handleIframeLoad,
    goBack,
    goForward,
    refresh,
    handleSubmit
  };
};
