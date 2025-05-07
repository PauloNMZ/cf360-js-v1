
import React, { createContext, ReactNode, useState } from "react";
import { IndexPageContext } from "@/contexts/IndexPageContext";
import { useIndexPage } from "@/hooks/useIndexPage";
import { useIndexPageActions } from "@/hooks/useIndexPageActions";
import { useIndexPageEventHandlers } from "./IndexPageEventHandlers";
import { useIndexPageStateManager } from "./IndexPageStateManager";

// Create provider
export const IndexPageProvider = ({ children }: { children: ReactNode }) => {
  // Get all the states and functions from our hooks
  const indexPage = useIndexPage();
  
  // Add additional state for CNAB to API modal
  const [cnabToApiModalOpen, setCnabToApiModalOpen] = useState(false);
  
  // Get actions from useIndexPageActions
  const indexPageActions = useIndexPageActions({
    setFormMode: indexPage.setFormMode,
    setFormData: indexPage.setFormData,
    setFormValid: indexPage.setFormValid,
    setConvenentes: indexPage.setConvenentes,
    currentConvenenteId: indexPage.currentConvenenteId,
    setCurrentConvenenteId: indexPage.setCurrentConvenenteId,
    setIsLoading: indexPage.setIsLoading
  });
  
  // Use our state manager
  useIndexPageStateManager({
    modalOpen: indexPage.modalOpen,
    importModalOpen: indexPage.importModalOpen,
    cnabToApiModalOpen,
    adminPanelOpen: indexPage.adminPanelOpen,
    setFormData: indexPage.setFormData,
    setFormMode: indexPage.setFormMode,
    setFormValid: indexPage.setFormValid,
    setCurrentConvenenteId: indexPage.setCurrentConvenenteId,
    loadConvenenteData: indexPage.loadConvenenteData,
    isDeleting: indexPageActions.isDeleting
  });

  // Get event handlers
  const eventHandlers = useIndexPageEventHandlers({
    indexPage,
    indexPageActions,
    setCnabToApiModalOpen
  });

  // Combine all values and functions to pass down via context
  const contextValue = {
    ...indexPage,
    ...indexPageActions,
    ...eventHandlers,
    cnabToApiModalOpen,
    setCnabToApiModalOpen,
    isDeleting: indexPageActions.isDeleting,
    resetDeletionState: indexPageActions.resetDeletionState // Ensure this is passed down
  };

  return (
    <IndexPageContext.Provider value={contextValue}>
      {children}
    </IndexPageContext.Provider>
  );
};
