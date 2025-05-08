
import { useRef } from "react";
import { useIndexPageContext } from "@/hooks/useIndexPageContext";
import { useAuth } from "@/hooks/use-auth";
import { useIndexPageActions } from "@/hooks/useIndexPageActions";
import { useMainNavHandlers } from "@/hooks/event-handlers/useMainNavHandlers";

/**
 * Custom hook for setting up navigation handlers
 */
export const useNavigationHandlers = (
  setCnabToApiModalOpen: (open: boolean) => void
) => {
  const { signOut } = useAuth();
  const indexPage = useIndexPageContext();
  const indexPageActions = useIndexPageActions({
    setFormMode: indexPage.setFormMode,
    setFormData: indexPage.setFormData,
    setFormValid: indexPage.setFormValid,
    setConvenentes: indexPage.setConvenentes,
    currentConvenenteId: indexPage.currentConvenenteId,
    setCurrentConvenenteId: indexPage.setCurrentConvenenteId,
    setIsLoading: indexPage.setIsLoading
  });
  
  // References to prevent duplicated or conflicting actions
  const actionInProgressRef = useRef(false);
  const navigationInProgressRef = useRef(false);
  
  // Reset deletion state to avoid persistent errors
  const resetDeletionState = () => {
    if (indexPageActions.resetDeletionState) {
      indexPageActions.resetDeletionState();
    }
    indexPage.setShowDeleteDialog(false);
  };
  
  // Helper to check if an action should be allowed
  const isActionAllowed = () => {
    if (actionInProgressRef.current) {
      console.log("Ação bloqueada: Operação já em andamento");
      return false;
    }
    return true;
  };
  
  // Navigation handlers
  const navHandlers = useMainNavHandlers({
    indexPage,
    setCnabToApiModalOpen,
    isActionAllowed,
    actionInProgressRef,
    navigationInProgressRef,
    resetDeletionState,
    signOut
  });
  
  // Map navigation handler names to actual handler functions
  const handlerMap: Record<string, () => void> = {
    onConvenenteClick: navHandlers.handleConvenenteClick,
    onImportarPlanilhaClick: navHandlers.handleImportarPlanilhaClick,
    onCnabToApiClick: navHandlers.handleCnabToApiClick,
    onAdminPanelClick: navHandlers.handleAdminPanelClick,
    onLogoutClick: navHandlers.handleLogoutClick,
    emptyHandler: () => console.log("Esta funcionalidade ainda não foi implementada")
  };

  return {
    handlerMap,
    handleLogoutClick: navHandlers.handleLogoutClick
  };
};
