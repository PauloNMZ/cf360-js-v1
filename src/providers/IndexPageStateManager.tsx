
import React, { useEffect } from "react";
import { useAppState } from "@/hooks/useAppState";

export const useIndexPageStateManager = ({
  modalOpen,
  importModalOpen, 
  cnabToApiModalOpen,
  adminPanelOpen,
  setFormData,
  setFormMode,
  setFormValid,
  setCurrentConvenenteId,
  loadConvenenteData
}: {
  modalOpen: boolean;
  importModalOpen: boolean;
  cnabToApiModalOpen: boolean;
  adminPanelOpen: boolean;
  setFormData: any;
  setFormMode: any;
  setFormValid: any;
  setCurrentConvenenteId: any;
  loadConvenenteData: (isOpen: boolean) => void;
}) => {
  const { loadAppState, saveAppState } = useAppState();
  
  // Load saved app state when component mounts
  useEffect(() => {
    const savedState = loadAppState();
    
    if (savedState.lastModalOpen) {
      // We don't need to restore modals here as the parent component
      // will handle this logic
    }
  }, []);

  // Save app state whenever modals change
  useEffect(() => {
    saveAppState({
      lastModalOpen: {
        convenente: modalOpen,
        importacao: importModalOpen,
        cnabToApi: cnabToApiModalOpen,
        adminPanel: adminPanelOpen
      }
    });
  }, [modalOpen, importModalOpen, cnabToApiModalOpen, adminPanelOpen]);
  
  // Load convenentes when modal is opened
  useEffect(() => {
    loadConvenenteData(modalOpen);
  }, [modalOpen, loadConvenenteData]);
};
