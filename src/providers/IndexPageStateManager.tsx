
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
  const stateRestoreAttemptedRef = useRef(false);
  const appInitializedRef = useRef(false);
  
  // Update ref when deletion state changes
  useEffect(() => {
    console.log("IndexPageStateManager: isDeleting state is", isDeleting);
    isDeletingRef.current = isDeleting;
  }, [isDeleting]);
  
  // Reset the state restoration flag when deletion is complete
  useEffect(() => {
    if (!isDeleting && stateRestoreAttemptedRef.current) {
      console.log("IndexPageStateManager: Resetting state restoration flag after deletion");
      stateRestoreAttemptedRef.current = false;
    }
  }, [isDeleting]);
  
  // Load saved app state when component mounts, but not during deletion
  useEffect(() => {
    if (appInitializedRef.current) {
      return; // Only run this effect once on initial load
    }
    
    // Skip application state loading during deletion
    if (isDeletingRef.current) {
      console.log("IndexPageStateManager: Skipping app state loading during deletion");
      return;
    }
    
    try {
      const savedState = loadAppState();
      console.log("IndexPageStateManager: Loaded app state", savedState);
      appInitializedRef.current = true;
      
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
  
  // Application state recovery mechanism
  useEffect(() => {
    const recoveryCheck = setTimeout(() => {
      // Check if we're in a potentially corrupted state
      if (!isDeletingRef.current && !stateRestoreAttemptedRef.current && appInitializedRef.current) {
        console.log("IndexPageStateManager: Performing routine state integrity check");
        
        // Could implement additional recovery logic here if state corruption is detected
      }
    }, 5000);
    
    return () => clearTimeout(recoveryCheck);
  }, []);
};
