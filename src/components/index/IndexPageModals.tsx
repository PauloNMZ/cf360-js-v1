import React, { useEffect, useRef } from "react";
import ConvenenteModal from "@/components/convenente/ConvenenteModal";
import DeleteConvenenteDialog from "@/components/convenente/DeleteConvenenteDialog";
import ImportacaoModal from "@/components/importacao/ImportacaoModal";
import CNABToAPIModal from "@/components/cnabToApi/CNABToAPIModal";
import AdminPanelModal from "@/components/admin/AdminPanelModal";
import { useIndexPageContext } from "@/hooks/useIndexPageContext";

export const IndexPageModals = () => {
  const {
    // Modal states
    modalOpen,
    importModalOpen,
    setImportModalOpen,
    adminPanelOpen,
    setAdminPanelOpen,
    cnabToApiModalOpen,
    setCnabToApiModalOpen,
    
    // Dialogs
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    resetDeletionState,
    
    // Form states and data
    convenentes,
    filteredConvenentes,
    currentConvenenteId,
    formData,
    formMode,
    formValid,
    isLoading,
    isSearching,
    searchTerm,
    
    // Event handlers
    handleConvenenteModalOpenChange,
    handleSearchChange,
    handleSelectConvenente,
    handleCreateNew,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleSaveClick,
    handleFormDataChange,
  } = useIndexPageContext();

  // Track deletion state with refs
  const isDeletingRef = useRef(isDeleting);
  const deletionInProgressRef = useRef(false);

  // Track deletion state changes
  useEffect(() => {
    console.log("IndexPageModals: isDeleting state changed to:", isDeleting);
    isDeletingRef.current = isDeleting;
    
    if (isDeleting) {
      deletionInProgressRef.current = true;
    } else if (deletionInProgressRef.current) {
      // Deletion just completed
      console.log("IndexPageModals: Deletion process completed");
      deletionInProgressRef.current = false;
    }
  }, [isDeleting]);
  
  // Create a protected modal change handler
  const handleProtectedModalOpenChange = (open: boolean, currentlyOpen: boolean, setOpen: (o: boolean) => void) => {
    // Prevent modal closing during deletion
    if (isDeletingRef.current && !open) {
      console.log("IndexPageModals: Prevented modal closure during deletion");
      return;
    }
    
    // Otherwise proceed with modal state change
    console.log("IndexPageModals: Changing modal state to:", open);
    setOpen(open);
  };

  // Special handler for main convenente modal
  const handleMainModalOpenChange = (open: boolean) => {
    // Block closing during deletion
    if (isDeletingRef.current && !open) {
      console.log("IndexPageModals: Blocked convenente modal close during deletion");
      return;
    }
    
    console.log("IndexPageModals: Changing convenente modal state to:", open);
    handleConvenenteModalOpenChange(open);
  };
  
  // Protection for select convenente
  const handleProtectedSelectConvenente = (convenente: any) => {
    if (isDeletingRef.current) {
      console.log("IndexPageModals: Blocked convenente selection during deletion");
      return;
    }
    
    handleSelectConvenente(convenente, formMode);
  };
  
  // Clean up any stuck deletion state if needed
  useEffect(() => {
    const checkDeletionTimeout = setTimeout(() => {
      if (isDeletingRef.current && resetDeletionState) {
        console.log("IndexPageModals: Checking for stuck deletion state");
        
        // If the delete dialog is closed but isDeleting is still true
        if (!showDeleteDialog && isDeletingRef.current) {
          console.log("IndexPageModals: Detected stuck deletion state, resetting");
          resetDeletionState();
        }
      }
    }, 10000); // Check after 10 seconds
    
    return () => clearTimeout(checkDeletionTimeout);
  }, [isDeleting, showDeleteDialog, resetDeletionState]);

  return (
    <>
      <ConvenenteModal 
        isOpen={modalOpen}
        onOpenChange={handleMainModalOpenChange}
        convenentes={convenentes}
        filteredConvenentes={filteredConvenentes}
        currentConvenenteId={currentConvenenteId}
        formData={formData}
        formMode={formMode}
        formValid={formValid}
        isLoading={isLoading || isDeleting} // Show loading during deletion
        isSearching={isSearching}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSelectConvenente={handleProtectedSelectConvenente}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSaveClick}
        onFormDataChange={handleFormDataChange}
      />

      <ImportacaoModal 
        isOpen={importModalOpen}
        onOpenChange={(open) => {
          handleProtectedModalOpenChange(open, importModalOpen, setImportModalOpen);
        }}
      />

      <CNABToAPIModal 
        isOpen={cnabToApiModalOpen}
        onOpenChange={(open) => {
          handleProtectedModalOpenChange(open, cnabToApiModalOpen, setCnabToApiModalOpen);
        }}
      />

      <AdminPanelModal 
        isOpen={adminPanelOpen}
        onOpenChange={(open) => {
          handleProtectedModalOpenChange(open, adminPanelOpen, setAdminPanelOpen);
        }}
      />

      <DeleteConvenenteDialog 
        isOpen={showDeleteDialog}
        onOpenChange={(open) => {
          // Special handling for delete dialog to prevent closure during deletion
          if (isDeletingRef.current && !open) {
            console.log("IndexPageModals: Blocked delete dialog close during deletion");
            return;
          }
          
          console.log("IndexPageModals: Setting delete dialog to:", open);
          setShowDeleteDialog(open);
        }}
        onDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};
