
import React from 'react';

interface BrowserFrameProps {
  url: string;
  isLoading: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  handleIframeLoad: () => void;
}

const BrowserFrame: React.FC<BrowserFrameProps> = ({
  url,
  isLoading,
  iframeRef,
  handleIframeLoad
}) => {
  return (
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
  );
};

export default BrowserFrame;
