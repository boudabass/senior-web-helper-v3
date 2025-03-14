
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CreateProfileDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createProfile: (name: string) => void;
}

const CreateProfileDialog: React.FC<CreateProfileDialogProps> = ({
  isOpen,
  setIsOpen,
  createProfile
}) => {
  const [newProfileName, setNewProfileName] = useState('');
  const { toast } = useToast();

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      createProfile(newProfileName.trim());
      setNewProfileName('');
      setIsOpen(false);
    } else {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer un nom pour le nouveau profil.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="btn-xl flex gap-2">
          <Plus size={18} />
          <span>Nouveau profil</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau profil</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="profileName">Nom du profil</Label>
          <Input
            id="profileName"
            placeholder="Ex: Profil de Jean"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            className="mt-2"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleCreateProfile}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProfileDialog;
