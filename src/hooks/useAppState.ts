
import { useEffect } from "react";
import { STORAGE_KEYS } from "@/services/storage";

type AppState = {
  lastModalOpen?: {
    convenente?: boolean;
    importacao?: boolean;
    cnabToApi?: boolean;
    adminPanel?: boolean;
  };
  currentView?: string;
  isDeleting?: boolean; // Add state tracking for deletion
};

export const useAppState = () => {
  const saveAppState = (state: AppState) => {
    try {
      // Don't overwrite all state - just update the provided values
      // First load current state
      const currentState = loadAppState();
      
      // Update with new values
      const updatedState = {
        ...currentState,
        ...state
      };
      
      // Save updated state
      localStorage.setItem(STORAGE_KEYS.UI_STATE.LAST_MODAL_OPEN, 
        JSON.stringify(updatedState.lastModalOpen || {}));
        
      if (updatedState.currentView) {
        localStorage.setItem(STORAGE_KEYS.UI_STATE.CURRENT_VIEW, updatedState.currentView);
      }
      
      // Save deletion state if present
      if (updatedState.isDeleting !== undefined) {
        localStorage.setItem(STORAGE_KEYS.UI_STATE.IS_DELETING, 
          String(updatedState.isDeleting));
      }
    } catch (error) {
      console.error("Failed to save app state:", error);
    }
  };

  const loadAppState = (): AppState => {
    try {
      const lastModalOpen = localStorage.getItem(STORAGE_KEYS.UI_STATE.LAST_MODAL_OPEN);
      const currentView = localStorage.getItem(STORAGE_KEYS.UI_STATE.CURRENT_VIEW);
      const isDeletingString = localStorage.getItem(STORAGE_KEYS.UI_STATE.IS_DELETING);
      
      return {
        lastModalOpen: lastModalOpen ? JSON.parse(lastModalOpen) : undefined,
        currentView: currentView || undefined,
        isDeleting: isDeletingString ? isDeletingString === 'true' : undefined
      };
    } catch (error) {
      console.error("Failed to load app state:", error);
      return {};
    }
  };

  return {
    saveAppState,
    loadAppState
  };
};
