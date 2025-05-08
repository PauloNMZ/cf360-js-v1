
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Group, NewGroup } from "@/types/group";
import GrupoForm from "./GrupoForm";

interface GrupoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<NewGroup>) => void;
  title: string;
  grupo?: Group;
}

const GrupoModal: React.FC<GrupoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  grupo
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <GrupoForm 
          initialData={grupo} 
          onSubmit={onSubmit} 
          onCancel={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default GrupoModal;
