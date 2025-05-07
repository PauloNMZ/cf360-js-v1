
import React, { useEffect, useRef } from "react";
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
  
  // Use ref to consistently track deletion state
  const isDeletingRef = useRef(isDeleting);
  
  // Update ref when deletion state changes
  useEffect(() => {
    console.log("IndexPageStateManager: isDeleting state is", isDeleting);
    isDeletingRef.current = isDeleting;
  }, [isDeleting]);
  
  // Load saved app state when component mounts, but not during deletion
  useEffect(() => {
    if (isDeletingRef.current) {
      // Skip loading app state during deletion process
      console.log("IndexPageStateManager: Skipping app state loading during deletion");
      return;
    }
    
    const savedState = loadAppState();
    console.log("IndexPageStateManager: Loaded app state", savedState);
  }, [loadAppState]);

  // Save app state whenever modals change, but ONLY if not deleting
  useEffect(() => {
    if (isDeletingRef.current) { 
      // Don't save state during deletion process to prevent inconsistent state
      console.log("IndexPageStateManager: Skipping app state saving during deletion");
      return;
    }
    
    console.log("IndexPageStateManager: Saving app state");
    saveAppState({
      lastModalOpen: {
        convenente: modalOpen,
        importacao: importModalOpen,
        cnabToApi: cnabToApiModalOpen,
        adminPanel: adminPanelOpen
      }
    });
  }, [modalOpen, importModalOpen, cnabToApiModalOpen, adminPanelOpen, saveAppState]);
  
  // Load convenentes when modal is opened, but ONLY if not deleting
  useEffect(() => {
    if (isDeletingRef.current) { 
      // Don't load data during deletion process
      console.log("IndexPageStateManager: Skipping data loading during deletion");
      return;
    }
    
    if (modalOpen) {
      console.log("IndexPageStateManager: Loading convenente data");
      loadConvenenteData(true);
    }
  }, [modalOpen, loadConvenenteData]);
};
