
import { useEffect } from "react";
import { useConvenenteModal } from "../convenente/useConvenenteModal";
import { useCompanySettings } from "../convenente/useCompanySettings";

/**
 * Hook for handling modal states and related effects
 */
export const useIndexPageModal = () => {
  // Use modal state hook
  const modalState = useConvenenteModal();
  const companySettingsState = useCompanySettings();
  
  // Reload company settings when admin panel is closed
  useEffect(() => {
    companySettingsState.reloadSettings(modalState.adminPanelOpen);
  }, [modalState.adminPanelOpen]);

  return {
    // Modal states
    modalOpen: modalState.modalOpen,
    setModalOpen: modalState.setModalOpen,
    importModalOpen: modalState.importModalOpen,
    setImportModalOpen: modalState.setImportModalOpen,
    adminPanelOpen: modalState.adminPanelOpen,
    setAdminPanelOpen: modalState.setAdminPanelOpen,
    showDeleteDialog: modalState.showDeleteDialog,
    setShowDeleteDialog: modalState.setShowDeleteDialog,
    formMode: modalState.formMode,
    setFormMode: modalState.setFormMode,
    resetFormOnModalClose: modalState.resetFormOnModalClose,
    
    // Company settings
    companySettings: companySettingsState.companySettings,
  };
};
