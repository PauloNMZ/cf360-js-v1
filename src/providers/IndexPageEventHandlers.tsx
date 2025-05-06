
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

  // Improved function to handle edit mode
  const handleEdit = () => {
    // Prevent re-entrant calls
    if (editStateChangingRef.current) {
      console.log("Edit mode change already in progress, ignoring request");
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
    // Prevent multiple save attempts
    if (saveActionInProgressRef.current) {
      console.log("Save action already in progress, ignoring duplicate request");
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
