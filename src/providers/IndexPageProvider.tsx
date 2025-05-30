
import React, { createContext, ReactNode, useState } from "react";
import { IndexPageContext } from "@/contexts/IndexPageContext";
import { useIndexPage } from "@/hooks/useIndexPage";
import { useIndexPageActions } from "@/hooks/useIndexPageActions";
import { useIndexPageEventHandlers } from "@/hooks/useIndexPageEventHandlers";
import { useIndexPageStateManager } from "./IndexPageStateManager";
import { useCompanySettings } from "@/hooks/convenente/useCompanySettings";

// Create provider
export const IndexPageProvider = ({ children }: { children: ReactNode }) => {
  // Get all the states and functions from our hooks
  const indexPage = useIndexPage();
  const { companySettings, reloadSettings } = useCompanySettings();
  
  // Add additional state for CNAB to API modal
  const [cnabToApiModalOpen, setCnabToApiModalOpen] = useState(false);
  
  // Add state for selected header company
  const [selectedHeaderCompany, setSelectedHeaderCompany] = useState<{ razaoSocial: string; cnpj: string } | null>(null);
  
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
    selectedHeaderCompany,
    setSelectedHeaderCompany,
    isDeleting: indexPageActions.isDeleting,
    resetDeletionState: indexPageActions.resetDeletionState, // Ensure this is passed down
    companySettings, // Certifique-se de que companySettings também é passado
    reloadSettings // Adicionando reloadSettings ao contexto
  };

  return (
    <IndexPageContext.Provider value={contextValue}>
      {children}
    </IndexPageContext.Provider>
  );
};
