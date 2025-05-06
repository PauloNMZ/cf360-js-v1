
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
  
  // Initialize isDeleting state
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Load convenentes when modal is opened
  useEffect(() => {
    if (!isDeleting) { // Don't load data during deletion
      convenenteData.loadConvenenteData(modalOpen);
    }
  }, [modalOpen, isDeleting]);

  // Reset form data when modal is closed
  useEffect(() => {
    if (!modalOpen && !isDeleting) { // Don't reset during deletion
      convenenteData.resetFormData();
    }
  }, [modalOpen, isDeleting]);

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
    isDeleting, // Expose isDeleting state
    setIsDeleting, // Expose setter
    
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
