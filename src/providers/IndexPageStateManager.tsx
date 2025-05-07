
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
    // Skip application state loading during deletion
    if (isDeletingRef.current) {
      console.log("IndexPageStateManager: Skipping app state loading during deletion");
      return;
    }
    
    try {
      const savedState = loadAppState();
      console.log("IndexPageStateManager: Loaded app state", savedState);
      
      // Could implement additional state restoration logic here if needed
    } catch (error) {
      console.error("IndexPageStateManager: Error loading app state", error);
    }
  }, [loadAppState]);

  // Save app state whenever modals change, but ONLY if not deleting
  useEffect(() => {
    // Don't save state during deletion to prevent corruption
    if (isDeletingRef.current) { 
      console.log("IndexPageStateManager: Skipping app state saving during deletion");
      return;
    }
    
    try {
      console.log("IndexPageStateManager: Saving app state");
      saveAppState({
        lastModalOpen: {
          convenente: modalOpen,
          importacao: importModalOpen,
          cnabToApi: cnabToApiModalOpen,
          adminPanel: adminPanelOpen
        }
      });
    } catch (error) {
      console.error("IndexPageStateManager: Error saving app state", error);
    }
  }, [modalOpen, importModalOpen, cnabToApiModalOpen, adminPanelOpen, saveAppState]);
  
  // Load convenentes when modal is opened, but ONLY if not deleting
  useEffect(() => {
    // Don't load data during deletion to prevent state conflicts
    if (isDeletingRef.current) { 
      console.log("IndexPageStateManager: Skipping data loading during deletion");
      return;
    }
    
    if (modalOpen) {
      console.log("IndexPageStateManager: Loading convenente data");
      loadConvenenteData(true);
    }
  }, [modalOpen, loadConvenenteData]);
};
