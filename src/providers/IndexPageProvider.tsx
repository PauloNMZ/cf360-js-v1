
import React, { createContext, useContext, ReactNode, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useIndexPage } from "@/hooks/useIndexPage";
import { useIndexPageActions } from "@/hooks/useIndexPageActions";
import { useAppState } from "@/hooks/useAppState";
import { emptyConvenente } from "@/types/convenente";

// Create context with a default value
export const IndexPageContext = createContext<any>({});

// Create provider
export const IndexPageProvider = ({ children }: { children: ReactNode }) => {
  const { signOut } = useAuth();
  const { loadAppState, saveAppState } = useAppState();
  
  // Get all the states and functions from our hooks
  const indexPage = useIndexPage();
  
  // Add additional state for CNAB to API modal
  const [cnabToApiModalOpen, setCnabToApiModalOpen] = React.useState(false);
  
  // Use a ref to track modal state changes
  const modalStateChangingRef = useRef(false);
  
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
  
  // Load saved app state when component mounts
  React.useEffect(() => {
    const savedState = loadAppState();
    
    if (savedState.lastModalOpen) {
      // Restore any previously open modals
      if (savedState.lastModalOpen.convenente) {
        indexPage.setModalOpen(true);
      }
      if (savedState.lastModalOpen.importacao) {
        indexPage.setImportModalOpen(true);
      }
      if (savedState.lastModalOpen.cnabToApi) {
        setCnabToApiModalOpen(true);
      }
      if (savedState.lastModalOpen.adminPanel) {
        indexPage.setAdminPanelOpen(true);
      }
    }
  }, []);

  // Save app state whenever modals change
  React.useEffect(() => {
    saveAppState({
      lastModalOpen: {
        convenente: indexPage.modalOpen,
        importacao: indexPage.importModalOpen,
        cnabToApi: cnabToApiModalOpen,
        adminPanel: indexPage.adminPanelOpen
      }
    });
  }, [indexPage.modalOpen, indexPage.importModalOpen, cnabToApiModalOpen, indexPage.adminPanelOpen]);

  // Create handlers
  const handleConvenenteClick = () => {
    indexPage.setModalOpen(true);
  };

  const handleImportarPlanilhaClick = () => {
    indexPage.setImportModalOpen(true);
  };

  const handleCnabToApiClick = () => {
    setCnabToApiModalOpen(true);
  };

  const handleLogoutClick = async () => {
    // Clear app state before logout
    saveAppState({});
    
    await signOut();
    // Clear all data after logout
    indexPage.setFormData({...emptyConvenente});
    indexPage.setCurrentConvenenteId(null);
  };

  const handleAdminPanelClick = () => {
    indexPage.setAdminPanelOpen(true);
  };

  // Improved function to handle opening/closing the convenente modal
  const handleConvenenteModalOpenChange = (open: boolean) => {
    // Prevent re-entrant changes
    if (modalStateChangingRef.current) {
      console.log("Modal state already changing, ignoring request");
      return;
    }
    
    modalStateChangingRef.current = true;
    
    try {
      // Update modal state
      indexPage.setModalOpen(open);
      
      // Reset form data when closing the modal
      if (!open) {
        console.log("Modal closing - preparing to reset form");
        
        // IMPORTANT: Set form mode first to 'view'
        console.log("Setting formMode back to 'view' on modal close");
        indexPage.setFormMode('view');
        
        // Wait for mode change to take effect before clearing data
        setTimeout(() => {
          console.log("Resetting form data after form mode change");
          indexPage.setFormData({...emptyConvenente});
          indexPage.setCurrentConvenenteId(null);
          indexPage.setFormValid(false);
        }, 100);
      } else {
        console.log("Modal opening - initializing in view mode");
      }
    } finally {
      // Release state change lock after a delay to prevent race conditions
      setTimeout(() => {
        modalStateChangingRef.current = false;
      }, 200);
    }
  };

  // Function to save current form data
  const handleSaveClick = () => {
    console.log("IndexPageProvider - handleSaveClick called with mode:", indexPage.formMode);
    console.log("FormData:", indexPage.formData);
    
    // Directly call the handleSave function with the current form data
    indexPageActions.handleSave(indexPage.formData);
  };

  // Combine all values and functions to pass down via context
  const contextValue = {
    ...indexPage,
    ...indexPageActions,
    cnabToApiModalOpen,
    setCnabToApiModalOpen,
    handleConvenenteClick,
    handleImportarPlanilhaClick,
    handleCnabToApiClick,
    handleLogoutClick,
    handleAdminPanelClick,
    handleConvenenteModalOpenChange,
    handleSaveClick,
  };

  return (
    <IndexPageContext.Provider value={contextValue}>
      {children}
    </IndexPageContext.Provider>
  );
};

// Create a hook to use the context
export const useIndexPageContext = () => {
  const context = useContext(IndexPageContext);
  if (!context) {
    throw new Error("useIndexPageContext must be used within an IndexPageProvider");
  }
  return context;
};
