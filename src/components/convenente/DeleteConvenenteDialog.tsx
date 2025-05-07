
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
  // Track if delete has been triggered to prevent multiple clicks
  const deleteTriggeredRef = useRef(false);
  
  // Reset delete triggered state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        deleteTriggeredRef.current = false;
      }, 500);
    }
  }, [isOpen]);
  
  // Reset delete triggered state when deleting state changes to false
  useEffect(() => {
    if (!isDeleting) {
      deleteTriggeredRef.current = false;
    }
  }, [isDeleting]);

  // Nova validação de timeout para evitar estados travados
  useEffect(() => {
    // Se estiver deletando, configurar um timeout de segurança
    if (isDeleting) {
      const timeoutId = setTimeout(() => {
        // Se a exclusão estiver em andamento por muito tempo, forçar fechamento
        console.log("DeleteDialog: Tempo limite de exclusão excedido, fechando diálogo");
        if (isOpen) {
          onOpenChange(false);
        }
      }, 15000); // 15 segundos é muito tempo para uma exclusão
      
      return () => clearTimeout(timeoutId);
    }
  }, [isDeleting, isOpen, onOpenChange]);

  // Handle delete with event protection
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent multiple delete triggers
    if (isDeleting || deleteTriggeredRef.current) {
      console.log("DeleteDialog: Delete already in progress or triggered, ignoring click");
      return;
    }
    
    console.log("DeleteDialog: Delete button clicked - triggering deletion");
    deleteTriggeredRef.current = true;
    onDelete();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing during deletion
      if (isDeleting && !open) {
        console.log("DeleteDialog: Prevented dialog close during deletion");
        return;
      }
      
      onOpenChange(open);
    }}>
      <AlertDialogContent className="sm:max-w-[425px]">
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
