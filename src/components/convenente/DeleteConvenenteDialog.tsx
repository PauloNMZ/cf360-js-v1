
import React, { useEffect } from "react";
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
  // This useEffect ensures the dialog cannot be closed during deletion
  useEffect(() => {
    if (isDeleting) {
      console.log("DeleteDialog: Deletion in progress, forcing dialog to stay open");
      // Force the dialog to stay open when deletion starts
      if (!isOpen) {
        onOpenChange(true);
      }
    }
  }, [isDeleting, isOpen, onOpenChange]);

  // Enhanced handleOpenChange to completely block dialog closing during deletion
  const handleOpenChange = (open: boolean) => {
    // If trying to close while deletion is in progress, prevent it
    if (isDeleting && !open) {
      console.log("DeleteDialog: Prevented dialog close during deletion process");
      return;
    }
    
    // Only allow state changes if we're not in the middle of deleting
    if (!isDeleting) {
      console.log("DeleteDialog: Changing dialog state to:", open);
      onOpenChange(open);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isDeleting 
              ? "Por favor, aguarde enquanto o convenente está sendo excluído."
              : "Tem certeza que deseja excluir este convenente? Esta ação não pode ser desfeita."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isDeleting} 
            onClick={(e) => {
              if (isDeleting) {
                e.preventDefault();
                e.stopPropagation();
                console.log("DeleteDialog: Cancel button clicked during deletion - preventing action");
                return;
              }
              console.log("DeleteDialog: Cancel button clicked - allowing default action");
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isDeleting) {
                console.log("DeleteDialog: Delete button clicked - triggering deletion");
                onDelete();
              } else {
                console.log("DeleteDialog: Delete already in progress - ignoring click");
              }
            }} 
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
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
