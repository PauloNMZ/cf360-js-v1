
import { useEffect, useState } from "react";
import { useConvenenteData } from "../convenente/useConvenenteData";
import { useConvenenteSearch } from "../convenente/useConvenenteSearch";

/**
 * Hook for handling data states and loading
 */
export const useIndexPageData = (modalOpen: boolean) => {
  // Use our data hooks
  const convenenteData = useConvenenteData();
  const searchState = useConvenenteSearch(convenenteData.convenentes);
  
  // Initialize isDeleting state with proper logging
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Log isDeleting state changes for debugging
  useEffect(() => {
    console.log("useIndexPageData: isDeleting state changed to:", isDeleting);
  }, [isDeleting]);
  
  // Load convenentes when modal is opened, but not during deletion
  useEffect(() => {
    if (modalOpen && !isDeleting) {
      console.log("useIndexPageData: Loading convenente data, isDeleting =", isDeleting);
      convenenteData.loadConvenenteData(true);
    } else if (isDeleting) {
      console.log("useIndexPageData: Skipping data load during deletion");
    }
  }, [modalOpen, isDeleting, convenenteData]);

  // Reset form data when modal is closed, but not during deletion
  useEffect(() => {
    if (!modalOpen && !isDeleting) {
      console.log("useIndexPageData: Resetting form data, isDeleting =", isDeleting);
      convenenteData.resetFormData();
    } else if (isDeleting) {
      console.log("useIndexPageData: Skipping form reset during deletion");
    }
  }, [modalOpen, isDeleting, convenenteData]);

  return {
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
    isDeleting,
    setIsDeleting,
    
    // Functions from useConvenenteData
    handleSelectConvenente: convenenteData.handleSelectConvenente,
    handleFormDataChange: convenenteData.handleFormDataChange,
    loadConvenenteData: convenenteData.loadConvenenteData,
    
    // Search states from useConvenenteSearch
    searchTerm: searchState.searchTerm,
    filteredConvenentes: searchState.filteredConvenentes,
    isSearching: searchState.isSearching,
    handleSearchChange: searchState.handleSearchChange,
  };
};
