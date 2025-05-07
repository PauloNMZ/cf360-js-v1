
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
import { Loader2 } from "lucide-react";

type DeleteConvenenteDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isDeleting?: boolean;
};

const DeleteConvenenteDialog = ({
  isOpen,
  onOpenChange,
  onDelete,
  isDeleting = false
}: DeleteConvenenteDialogProps) => {
  // This prevents any closing of the dialog during deletion process
  const handleOpenChange = (open: boolean) => {
    // If trying to close while deletion is in progress, prevent it
    if (isDeleting && !open) {
      console.log("Prevented dialog close during deletion");
      return;
    }
    
    // Only allow state changes if we're not in the middle of deleting
    if (!isDeleting) {
      onOpenChange(open);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este convenente?
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isDeleting} 
            onClick={(e) => {
              if (isDeleting) {
                e.preventDefault();
                e.stopPropagation();
                console.log("Cancel button clicked during deletion - preventing action");
                return;
              }
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isDeleting) {
                console.log("Delete button clicked - triggering delete");
                onDelete();
              } else {
                console.log("Delete already in progress - ignoring click");
              }
            }} 
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConvenenteDialog;
