
import React, { useEffect } from "react";
import { useAppState } from "@/hooks/useAppState";
import { ConvenenteData } from "@/types/convenente";

export const useIndexPageStateManager = ({
  modalOpen,
  importModalOpen, 
  cnabToApiModalOpen,
  adminPanelOpen,
  setFormData,
  setFormMode,
  setFormValid,
  setCurrentConvenenteId,
  loadConvenenteData,
  isDeleting
}: {
  modalOpen: boolean;
  importModalOpen: boolean;
  cnabToApiModalOpen: boolean;
  adminPanelOpen: boolean;
  setFormData: (data: ConvenenteData) => void;
  setFormMode: (mode: 'view' | 'create' | 'edit') => void;
  setFormValid: (valid: boolean) => void;
  setCurrentConvenenteId: (id: string | null) => void;
  loadConvenenteData: (isOpen: boolean) => void;
  isDeleting: boolean;
}) => {
  const { loadAppState, saveAppState } = useAppState();
  
  // Load saved app state when component mounts
  useEffect(() => {
    if (isDeleting) {
      // Skip loading app state during deletion process
      console.log("Skipping app state loading during deletion");
      return;
    }
    
    const savedState = loadAppState();
    
    if (savedState.lastModalOpen) {
      // We don't need to restore modals here as the parent component
      // will handle this logic
    }
  }, [isDeleting]);

  // Save app state whenever modals change - but ONLY if not deleting
  useEffect(() => {
    if (isDeleting) { 
      // Don't save state during deletion process to prevent inconsistent state
      console.log("Skipping app state saving during deletion");
      return;
    }
    
    saveAppState({
      lastModalOpen: {
        convenente: modalOpen,
        importacao: importModalOpen,
        cnabToApi: cnabToApiModalOpen,
        adminPanel: adminPanelOpen
      }
    });
  }, [modalOpen, importModalOpen, cnabToApiModalOpen, adminPanelOpen, isDeleting]);
  
  // Load convenentes when modal is opened - but ONLY if not deleting
  useEffect(() => {
    if (isDeleting) { 
      // Don't load data during deletion process
      console.log("Skipping data loading during deletion");
      return;
    }
    
    loadConvenenteData(modalOpen);
  }, [modalOpen, loadConvenenteData, isDeleting]);
};
