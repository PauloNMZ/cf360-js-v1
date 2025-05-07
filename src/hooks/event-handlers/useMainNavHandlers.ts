
import { useRef } from "react";
import { useAppState } from "@/hooks/useAppState";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";

export const useMainNavHandlers = ({
  indexPage,
  setCnabToApiModalOpen,
  isActionAllowed,
  actionInProgressRef,
  signOut
}: {
  indexPage: any;
  setCnabToApiModalOpen: (open: boolean) => void;
  isActionAllowed: () => boolean;
  actionInProgressRef: React.MutableRefObject<boolean>;
  signOut: () => Promise<void>;
}) => {
  const { saveAppState } = useAppState();
  
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

  return {
    handleConvenenteClick,
    handleImportarPlanilhaClick,
    handleCnabToApiClick,
    handleAdminPanelClick,
    handleLogoutClick
  };
};
