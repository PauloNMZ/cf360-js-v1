
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
};

export const useAppState = () => {
  const saveAppState = (state: AppState) => {
    try {
      localStorage.setItem(STORAGE_KEYS.UI_STATE.LAST_MODAL_OPEN, JSON.stringify(state.lastModalOpen));
      if (state.currentView) {
        localStorage.setItem(STORAGE_KEYS.UI_STATE.CURRENT_VIEW, state.currentView);
      }
    } catch (error) {
      console.error("Failed to save app state:", error);
    }
  };

  const loadAppState = (): AppState => {
    try {
      const lastModalOpen = localStorage.getItem(STORAGE_KEYS.UI_STATE.LAST_MODAL_OPEN);
      const currentView = localStorage.getItem(STORAGE_KEYS.UI_STATE.CURRENT_VIEW);
      
      return {
        lastModalOpen: lastModalOpen ? JSON.parse(lastModalOpen) : undefined,
        currentView: currentView || undefined
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
