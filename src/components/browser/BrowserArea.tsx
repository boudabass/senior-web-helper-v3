
import React from 'react';
import WebBrowser from '../WebBrowser';
import AccessibilityControls from '../AccessibilityControls';
import { Command } from '@/utils/browserCommands';

interface BrowserAreaProps {
  command: Command | null;
  browserZoom: number;
  onZoomChange: (zoom: number) => void;
  initialZoom: number;
  initialDarkMode: boolean;
}

const BrowserArea: React.FC<BrowserAreaProps> = ({
  command,
  browserZoom,
  onZoomChange,
  initialZoom,
  initialDarkMode
}) => {
  return (
    <div className="flex-grow flex flex-col p-4 overflow-hidden">
      <AccessibilityControls 
        onZoomChange={onZoomChange} 
        initialZoom={initialZoom} 
        initialDarkMode={initialDarkMode} 
      />
      <div className="browser-container flex-grow" style={{ fontSize: `${browserZoom}%` }}>
        <WebBrowser command={command} />
      </div>
    </div>
  );
};

export default BrowserArea;
