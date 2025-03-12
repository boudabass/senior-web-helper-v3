
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Sun, Moon, Type } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

interface AccessibilityControlsProps {
  onZoomChange: (zoom: number) => void;
  initialZoom?: number;
  initialDarkMode?: boolean;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ 
  onZoomChange, 
  initialZoom = 100,
  initialDarkMode = false
}) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [contrast, setContrast] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  const { toast } = useToast();

  // Appliquer les paramètres initiaux
  useEffect(() => {
    setZoom(initialZoom);
    setIsDarkMode(initialDarkMode);
  }, [initialZoom, initialDarkMode]);

  const handleZoomIn = () => {
    if (zoom < 200) {
      const newZoom = zoom + 10;
      setZoom(newZoom);
      onZoomChange(newZoom);
      toast({
        title: "Zoom",
        description: `Zoom à ${newZoom}%`,
      });
    }
  };

  const handleZoomOut = () => {
    if (zoom > 50) {
      const newZoom = zoom - 10;
      setZoom(newZoom);
      onZoomChange(newZoom);
      toast({
        title: "Zoom",
        description: `Zoom à ${newZoom}%`,
      });
    }
  };

  const handleZoomChange = (value: number[]) => {
    const newZoom = value[0];
    setZoom(newZoom);
    onZoomChange(newZoom);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      toast({
        title: "Mode clair activé",
        description: "L'interface utilise maintenant le thème clair.",
      });
    } else {
      document.documentElement.classList.add('dark');
      toast({
        title: "Mode sombre activé",
        description: "L'interface utilise maintenant le thème sombre.",
      });
    }
  };

  return (
    <div className="accessibility-controls animate-fade-in">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="btn-xl"
          onClick={handleZoomOut}
          title="Réduire"
        >
          <ZoomOut size={24} />
        </Button>
        
        <div className="w-24 sm:w-36">
          <Slider
            value={[zoom]}
            min={50}
            max={200}
            step={10}
            onValueChange={handleZoomChange}
          />
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="btn-xl"
          onClick={handleZoomIn}
          title="Agrandir"
        >
          <ZoomIn size={24} />
        </Button>
      </div>
      
      <div className="flex items-center ml-auto space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="btn-xl"
          onClick={toggleDarkMode}
          title={isDarkMode ? "Mode clair" : "Mode sombre"}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="btn-xl hidden sm:flex"
          onClick={() => {
            toast({
              title: "Contraste",
              description: "Fonctionnalité à venir dans une prochaine version.",
            });
          }}
          title="Contraste"
        >
          <Type size={24} />
        </Button>
      </div>
    </div>
  );
};

export default AccessibilityControls;
