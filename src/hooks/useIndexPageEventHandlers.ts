
import { useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useModalHandlers } from "./event-handlers/useModalHandlers";
import { useActionHandlers } from "./event-handlers/useActionHandlers";
import { useMainNavHandlers } from "./event-handlers/useMainNavHandlers";
import { IndexPageActionProps } from "@/providers/types";
import { useToast } from "@/hooks/use-toast";

export const useIndexPageEventHandlers = ({
  indexPage,
  indexPageActions,
  setCnabToApiModalOpen
}: IndexPageActionProps) => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  // Adicionar referência para rastrear o estado de roteamento
  const navigationInProgressRef = useRef(false);
  
  // Get action helpers
  const { isActionAllowed, handleSaveClick, actionInProgressRef } = useActionHandlers({
    indexPage,
    indexPageActions,
    isDeleting: indexPageActions.isDeleting
  });
  
  // Get modal handlers
  const { handleConvenenteModalOpenChange, handleEdit } = useModalHandlers({
    indexPage,
    isDeleting: indexPageActions.isDeleting,
    actionInProgressRef
  });
  
  // Função segura para resetar o estado de exclusão
  const safeResetDeletionState = () => {
    if (indexPageActions.resetDeletionState) {
      console.log("Resetando estado de exclusão explicitamente");
      try {
        indexPageActions.resetDeletionState();
      } catch (error) {
        console.error("Erro ao resetar estado de exclusão:", error);
        toast({
          title: "Aviso",
          description: "Ocorreu um erro ao limpar o estado. Tente recarregar a página.",
          variant: "destructive",
        });
      }
    } else {
      console.log("Função resetDeletionState não disponível");
    }
  };
  
  // Get navigation handlers
  const navigationHandlers = useMainNavHandlers({
    indexPage,
    setCnabToApiModalOpen,
    isActionAllowed,
    actionInProgressRef,
    navigationInProgressRef,
    resetDeletionState: safeResetDeletionState, // Passar nossa função segura de reset
    signOut
  });

  // Adicionar um handler de cleanup explícito que pode ser chamado quando necessário
  const handleStateCleanup = () => {
    safeResetDeletionState();
  };

  return {
    // Modal handlers
    handleConvenenteModalOpenChange,
    handleEdit,
    
    // Save handler
    handleSaveClick,
    
    // Cleanup handler
    handleStateCleanup,
    
    // Navigation handlers
    ...navigationHandlers
  };
};
