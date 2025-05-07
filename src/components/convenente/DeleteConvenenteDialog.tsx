
import React, { useEffect, useRef, useState } from "react";
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
  // Local state to ensure we can control the dialog properly
  const [internalOpen, setInternalOpen] = useState(isOpen);
  const isDeletingRef = useRef(isDeleting);
  const deleteTriggeredRef = useRef(false);
  
  // Track open state to prevent unexpected changes
  useEffect(() => {
    console.log("DeleteDialog: External open state changed to:", isOpen);
    
    // If deleting is in progress and dialog is being closed, prevent it
    if (isDeletingRef.current && !isOpen) {
      console.log("DeleteDialog: Preventing dialog close during deletion");
      return;
    }
    
    setInternalOpen(isOpen);
  }, [isOpen]);
  
  // Update deleting ref when prop changes
  useEffect(() => {
    console.log("DeleteDialog: isDeleting changed to:", isDeleting);
    isDeletingRef.current = isDeleting;
    
    // When deletion starts, force open the dialog
    if (isDeleting && !internalOpen) {
      console.log("DeleteDialog: Forcing dialog to open during deletion");
      setInternalOpen(true);
      // Sync with parent component
      if (!isOpen) {
        onOpenChange(true);
      }
    }
  }, [isDeleting, internalOpen, isOpen, onOpenChange]);
  
  // Handle dialog open state changes with protection
  const handleOpenChange = (open: boolean) => {
    console.log("DeleteDialog: Request to change dialog state to:", open);
    
    // Prevent closing dialog during deletion process
    if (isDeletingRef.current && !open) {
      console.log("DeleteDialog: Blocked dialog close during deletion");
      return;
    }
    
    // Update internal state
    setInternalOpen(open);
    
    // Only propagate the change if not deleting
    if (!isDeletingRef.current) {
      console.log("DeleteDialog: Propagating open state change to parent");
      onOpenChange(open);
    }
  };
  
  // Handle delete with event protection
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent multiple delete triggers
    if (isDeletingRef.current || deleteTriggeredRef.current) {
      console.log("DeleteDialog: Delete already in progress, ignoring click");
      return;
    }
    
    console.log("DeleteDialog: Delete button clicked - triggering deletion");
    deleteTriggeredRef.current = true;
    
    // Set a timeout to reset the triggered flag if deletion doesn't start
    setTimeout(() => {
      if (!isDeletingRef.current) {
        deleteTriggeredRef.current = false;
      }
    }, 5000);
    
    // Call the delete handler
    onDelete();
  };
  
  // Prevent cancel during deletion
  const handleCancel = (e: React.MouseEvent) => {
    if (isDeletingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      console.log("DeleteDialog: Cancel blocked during deletion");
      return;
    }
    console.log("DeleteDialog: Cancel allowed");
  };

  return (
    <AlertDialog open={internalOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={e => {
          // Prevent closing dialog by clicking outside during deletion
          if (isDeletingRef.current) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={e => {
          // Prevent closing dialog with escape key during deletion
          if (isDeletingRef.current) {
            e.preventDefault();
          }
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isDeleting 
              ? "Por favor, aguarde enquanto o convenente está sendo excluído. Não feche esta janela."
              : "Tem certeza que deseja excluir este convenente? Esta ação não pode ser desfeita."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isDeleting} 
            onClick={handleCancel}
            className={isDeleting ? "opacity-50 cursor-not-allowed" : ""}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className={`bg-red-600 hover:bg-red-700 focus:ring-red-500 ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
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
