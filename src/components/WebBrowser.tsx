
import React from 'react';
import { Command } from '@/utils/browserCommands';
import BrowserToolbar from './browser/BrowserToolbar';
import BrowserFrame from './browser/BrowserFrame';
import { useBrowserNavigation } from './browser/useBrowserNavigation';
import { useBrowserActions } from './browser/useBrowserActions';
import { useFavoritesActions } from './browser/useFavoritesActions';
import { useCommandHandler } from './browser/useCommandHandler';

interface WebBrowserProps {
  command: Command | null;
}

const WebBrowser: React.FC<WebBrowserProps> = ({ command }) => {
  const {
    url,
    isLoading,
    canGoBack,
    canGoForward,
    inputUrl,
    setInputUrl,
    isSimplified,
    setIsSimplified,
    iframeRef,
    navigateTo,
    handleIframeLoad,
    goBack,
    goForward,
    refresh,
    handleSubmit
  } = useBrowserNavigation();

  const {
    readPageContent,
    simplifyPage,
    simulateClick,
    fillForm,
    scrollPage
  } = useBrowserActions(iframeRef, setIsSimplified);

  const {
    addToFavorites,
    openFavorite,
    listFavorites,
    removeFavoriteByName
  } = useFavoritesActions(iframeRef, navigateTo);

  // Handle voice commands
  useCommandHandler(
    command,
    {
      navigateTo,
      goBack,
      goForward,
      readPageContent,
      simulateClick,
      fillForm,
      scrollPage,
      addToFavorites,
      openFavorite,
      listFavorites,
      removeFavoriteByName,
      simplifyPage
    }
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white rounded-lg shadow-sm animate-fade-in">
      <BrowserToolbar
        inputUrl={inputUrl}
        setInputUrl={setInputUrl}
        navigateTo={navigateTo}
        goBack={goBack}
        goForward={goForward}
        refresh={refresh}
        readPageContent={readPageContent}
        simplifyPage={simplifyPage}
        addToFavorites={addToFavorites}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isSimplified={isSimplified}
        handleSubmit={handleSubmit}
      />
      
      <BrowserFrame
        url={url}
        isLoading={isLoading}
        iframeRef={iframeRef}
        handleIframeLoad={handleIframeLoad}
      />
    </div>
  );
};

export default WebBrowser;
