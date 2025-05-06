
import { useEffect } from "react";
import { useConvenenteModal } from "./convenente/useConvenenteModal";
import { useConvenenteData } from "./convenente/useConvenenteData";
import { useConvenenteSearch } from "./convenente/useConvenenteSearch";
import { useCompanySettings } from "./convenente/useCompanySettings";

export const useIndexPage = () => {
  // Use our new hooks
  const modalState = useConvenenteModal();
  const convenenteData = useConvenenteData();
  const companySettingsState = useCompanySettings();
  const searchState = useConvenenteSearch(convenenteData.convenentes);
  
  // Load convenentes when modal is opened
  useEffect(() => {
    convenenteData.loadConvenenteData(modalState.modalOpen);
  }, [modalState.modalOpen]);

  // Reset data loaded when modal is closed
  useEffect(() => {
    modalState.resetFormOnModalClose();
    
    if (!modalState.modalOpen) {
      convenenteData.resetFormData();
    }
  }, [modalState.modalOpen]);
  
  // Reload company settings when admin panel is closed
  useEffect(() => {
    companySettingsState.reloadSettings(modalState.adminPanelOpen);
  }, [modalState.adminPanelOpen]);

  // Return all the state and functions from our hooks
  return {
    // Modal states from useConvenenteModal
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
    
    // Form and data states from useConvenenteData
    formData: convenenteData.formData,
    setFormData: convenenteData.setFormData,
    formValid: convenenteData.formValid,
    setFormValid: convenenteData.setFormValid,
    convenentes: convenenteData.convenentes,
    setConvenentes: convenenteData.setConvenentes,
    currentConvenenteId: convenenteData.currentConvenenteId,
    setCurrentConvenenteId: convenenteData.setCurrentConvenenteId,
    isLoading: convenenteData.isLoading,
    setIsLoading: convenenteData.setIsLoading,
    
    // Search states from useConvenenteSearch
    searchTerm: searchState.searchTerm,
    filteredConvenentes: searchState.filteredConvenentes,
    isSearching: searchState.isSearching,
    handleSearchChange: searchState.handleSearchChange,
    
    // Company settings from useCompanySettings
    companySettings: companySettingsState.companySettings,
    
    // Functions from useConvenenteData
    handleSelectConvenente: convenenteData.handleSelectConvenente,
    handleFormDataChange: convenenteData.handleFormDataChange
  };
};
