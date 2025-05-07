
import React, { useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { emptyConvenente, ConvenenteData } from "@/types/convenente";
import { useAppState } from "@/hooks/useAppState";
import { IndexPageActionProps } from "./types";

export const useIndexPageEventHandlers = ({
  indexPage,
  indexPageActions,
  setCnabToApiModalOpen
}: IndexPageActionProps) => {
  const { signOut } = useAuth();
  const { saveAppState } = useAppState();
  const { toast } = useToast();
  
  // Use refs to track state changes and prevent loops
  const modalStateChangingRef = useRef(false);
  const saveActionInProgressRef = useRef(false);
  const editStateChangingRef = useRef(false);
  const actionInProgressRef = useRef(false);
  
  // Helper to prevent actions during unstable states
  const isActionAllowed = () => {
    if (indexPageActions.isDeleting || actionInProgressRef.current) {
      console.log("Action blocked: Operation in progress");
      return false;
    }
    return true;
  };

  // Create handlers with protection
  const handleConvenenteClick = () => {
    if (!isActionAllowed()) return;
    
    actionInProgressRef.current = true;
    try {
      indexPage.setModalOpen(true);
    } finally {
      setTimeout(() => {
        actionInProgressRef.current = false;
      }, 100);
    }
  };

  const handleImportarPlanilhaClick = () => {
    if (!isActionAllowed()) return;
    
    actionInProgressRef.current = true;
    try {
      indexPage.setImportModalOpen(true);
    } finally {
      setTimeout(() => {
        actionInProgressRef.current = false;
      }, 100);
    }
  };

  const handleCnabToApiClick = () => {
    if (!isActionAllowed()) return;
    
    actionInProgressRef.current = true;
    try {
      setCnabToApiModalOpen(true);
    } finally {
      setTimeout(() => {
        actionInProgressRef.current = false;
      }, 100);
    }
  };

  const handleLogoutClick = async () => {
    if (!isActionAllowed()) return;
    
    actionInProgressRef.current = true;
    try {
      // Store only essential state before logout
      // IMPORTANT: Don't clear all state with saveAppState({})
      saveAppState({
        lastModalOpen: {
          convenente: false,
          importacao: false,
          cnabToApi: false,
          adminPanel: false
        }
      });
      
      await signOut();
      
      // Clear all data after logout
      indexPage.setFormData({...emptyConvenente});
      indexPage.setCurrentConvenenteId(null);
    } finally {
      setTimeout(() => {
        actionInProgressRef.current = false;
      }, 100);
    }
  };

  const handleAdminPanelClick = () => {
    if (!isActionAllowed()) return;
    
    actionInProgressRef.current = true;
    try {
      indexPage.setAdminPanelOpen(true);
    } finally {
      setTimeout(() => {
        actionInProgressRef.current = false;
      }, 100);
    }
  };

  // Improved function to handle edit mode
  const handleEdit = () => {
    if (!isActionAllowed() || editStateChangingRef.current) {
      console.log("Edit mode change blocked: Operation in progress");
      return;
    }
    
    editStateChangingRef.current = true;
    
    try {
      // Only enter edit mode if we're not already in edit mode
      // and we have a selected convenente
      if (indexPage.formMode !== 'edit' && indexPage.currentConvenenteId) {
        console.log("Entering edit mode for convenente:", indexPage.currentConvenenteId);
        indexPage.setFormMode('edit');
      }
    } finally {
      // Release the edit state change lock after a delay
      setTimeout(() => {
        editStateChangingRef.current = false;
      }, 300);
    }
  };

  // Improved function to handle opening/closing the convenente modal
  const handleConvenenteModalOpenChange = (open: boolean) => {
    // Prevent re-entrant changes or during deletion
    if (indexPageActions.isDeleting || modalStateChangingRef.current) {
      console.log("Modal state change blocked: Operation in progress");
      return;
    }
    
    modalStateChangingRef.current = true;
    
    try {
      // Update modal state
      indexPage.setModalOpen(open);
      
      // Reset form data when closing the modal
      if (!open) {
        // IMPORTANT: Set form mode first to 'view'
        indexPage.setFormMode('view');
        
        // Wait for mode change to take effect before clearing data
        setTimeout(() => {
          indexPage.setFormData({...emptyConvenente});
          indexPage.setCurrentConvenenteId(null);
          indexPage.setFormValid(false);
        }, 100);
      }
    } finally {
      // Release state change lock after a delay to prevent race conditions
      setTimeout(() => {
        modalStateChangingRef.current = false;
      }, 200);
    }
  };

  // Function to save current form data with anti-loop protection
  const handleSaveClick = () => {
    // Prevent multiple save attempts or during deletion
    if (indexPageActions.isDeleting || saveActionInProgressRef.current) {
      console.log("Save action blocked: Operation in progress");
      return;
    }

    saveActionInProgressRef.current = true;
    
    try {
      if (!indexPage.formData.cnpj || indexPage.formData.cnpj.trim() === '') {
        toast({
          title: "Dados incompletos",
          description: "CNPJ é obrigatório.",
          variant: "destructive",
        });
        return;
      }
      
      if (!indexPage.formData.razaoSocial || indexPage.formData.razaoSocial.trim() === '') {
        toast({
          title: "Dados incompletos",
          description: "Razão Social é obrigatória.",
          variant: "destructive",
        });
        return;
      }
      
      // Clone the form data to prevent any reference issues
      const dataToSave = {...indexPage.formData};
      console.log("Iniciando salvamento com dados:", dataToSave);
      
      // Use custom action to handle save
      indexPageActions.handleSave(dataToSave);
    } finally {
      // Release the save action lock after a delay
      setTimeout(() => {
        saveActionInProgressRef.current = false;
      }, 500);
    }
  };

  return {
    handleConvenenteClick,
    handleImportarPlanilhaClick,
    handleCnabToApiClick,
    handleLogoutClick,
    handleAdminPanelClick,
    handleEdit,
    handleConvenenteModalOpenChange,
    handleSaveClick
  };
};
