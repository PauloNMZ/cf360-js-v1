
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Group } from "@/types/group";

interface DeleteGrupoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  grupo?: Group;
  isDeleting: boolean;
}

const DeleteGrupoDialog: React.FC<DeleteGrupoDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  grupo,
  isDeleting
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Grupo</AlertDialogTitle>
          <AlertDialogDescription>
            Você tem certeza que deseja excluir o grupo "{grupo?.nome}"?
            <br />
            Esta ação não pode ser desfeita e irá remover todos os membros do grupo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isDeleting} 
            className="bg-red-500 hover:bg-red-600 focus:ring-red-600"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteGrupoDialog;
