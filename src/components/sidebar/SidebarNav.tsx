
import React from 'react';
import { Home, Settings, BookOpen, History, HelpCircle, Menu, BookOpenCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command } from '@/utils/browserCommands';
import { useToast } from "@/hooks/use-toast";

interface SidebarNavProps {
  onCommand: (command: Command) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ onCommand }) => {
  const { toast } = useToast();

  return (
    <div className="my-6">
      <h2 className="text-lg font-medium mb-4">Raccourcis</h2>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="btn-xl justify-start" 
          onClick={() => onCommand({ type: 'HOME' })}
        >
          <Home size={20} className="mr-2" />
          <span>Accueil</span>
        </Button>
        <Button 
          variant="outline" 
          className="btn-xl justify-start"
          onClick={() => {
            onCommand({ type: 'OPEN_URL', payload: 'https://www.ameli.fr' });
          }}
        >
          <BookOpen size={20} className="mr-2" />
          <span>Ameli</span>
        </Button>
        <Button 
          variant="outline" 
          className="btn-xl justify-start"
          onClick={() => {
            onCommand({ type: 'OPEN_URL', payload: 'https://www.impots.gouv.fr' });
          }}
        >
          <BookOpen size={20} className="mr-2" />
          <span>Impôts</span>
        </Button>
        <Button 
          variant="outline" 
          className="btn-xl justify-start"
          onClick={() => {
            onCommand({ type: 'OPEN_URL', payload: 'https://www.doctolib.fr' });
          }}
        >
          <BookOpen size={20} className="mr-2" />
          <span>Doctolib</span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarNav;
