
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
  
  // Reset delete triggered state when modal closes or opens
  useEffect(() => {
    // Sempre resetar o estado quando o modal abre ou fecha
    deleteTriggeredRef.current = false;
    
    // Se o modal está fechando, garantir que isDeleting não permaneça true
    if (!isOpen && isDeleting) {
      console.log("DeleteDialog: Dialog fechando durante exclusão, poderia causar problema");
    }
  }, [isOpen, isDeleting]);
  
  // Reset delete triggered state when deleting state changes to false
  useEffect(() => {
    if (!isDeleting) {
      deleteTriggeredRef.current = false;
    }
  }, [isDeleting]);

  // Timeout de segurança para evitar diálogos travados
  useEffect(() => {
    let timeoutId: number | undefined;
    
    // Se estiver deletando, configurar um timeout de segurança
    if (isDeleting) {
      timeoutId = window.setTimeout(() => {
        // Se a exclusão estiver em andamento por muito tempo, forçar fechamento
        console.log("DeleteDialog: Tempo limite de exclusão excedido, fechando diálogo");
        if (isOpen) {
          onOpenChange(false);
          // Adicionando notificação para o usuário
          const errorMsg = document.createElement('div');
          errorMsg.innerHTML = 'A operação demorou muito tempo. Tente novamente.';
          errorMsg.style.cssText = 'position:fixed;top:10px;right:10px;background:red;color:white;padding:10px;border-radius:5px;z-index:9999;';
          document.body.appendChild(errorMsg);
          
          setTimeout(() => {
            document.body.removeChild(errorMsg);
          }, 5000);
        }
      }, 10000); // 10 segundos é tempo suficiente para uma exclusão
      
      return () => {
        if (timeoutId !== undefined) clearTimeout(timeoutId);
      };
    }
  }, [isDeleting, isOpen, onOpenChange]);

  // Handle delete with event protection
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevenir múltiplos cliques
    if (isDeleting || deleteTriggeredRef.current) {
      console.log("DeleteDialog: Delete já em progresso ou disparado, ignorando clique");
      return;
    }
    
    console.log("DeleteDialog: Botão delete clicado - iniciando exclusão");
    deleteTriggeredRef.current = true;
    
    // Chamar onDelete com um pequeno delay para evitar problemas de sincronização de estado
    setTimeout(() => {
      onDelete();
    }, 10);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      // Impedir fechamento durante exclusão
      if (isDeleting && !open) {
        console.log("DeleteDialog: Impedido fechamento do diálogo durante exclusão");
        return;
      }
      
      // Se estiver fechando o diálogo, garantir que deleteTriggeredRef seja resetado
      if (!open) {
        deleteTriggeredRef.current = false;
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
