
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

  // Track deletion state with a ref to avoid stale closure issues
  const isDeletingRef = useRef(isDeleting);

  // Log deletion state changes and update ref for tracking
  useEffect(() => {
    console.log("IndexPageModals: isDeleting state changed to:", isDeleting);
    isDeletingRef.current = isDeleting;
  }, [isDeleting]);

  // Create a special modal change handler that respects isDeleting state
  const handleModalOpenChange = (open: boolean, currentlyOpen: boolean, setOpen: (o: boolean) => void) => {
    // Prevent closing any modal if a deletion is in progress
    if (isDeletingRef.current && !open && currentlyOpen) {
      console.log("IndexPageModals: Preventing modal close during deletion");
      return;
    }
    console.log("IndexPageModals: Changing modal state to:", open);
    setOpen(open);
  };

  return (
    <>
      <ConvenenteModal 
        isOpen={modalOpen}
        onOpenChange={(open) => {
          if (isDeletingRef.current && !open) {
            console.log("IndexPageModals: Preventing main modal close during deletion");
            return;
          }
          console.log("IndexPageModals: Handling main modal state change");
          handleConvenenteModalOpenChange(open);
        }}
        convenentes={convenentes}
        filteredConvenentes={filteredConvenentes}
        currentConvenenteId={currentConvenenteId}
        formData={formData}
        formMode={formMode}
        formValid={formValid}
        isLoading={isLoading || isDeleting} // Show loading state during deletion
        isSearching={isSearching}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSelectConvenente={(convenente) => {
          // Prevent selecting convenentes during deletion
          if (!isDeletingRef.current) {
            handleSelectConvenente(convenente, formMode);
          } else {
            console.log("IndexPageModals: Selection prevented during deletion");
          }
        }}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSaveClick}
        onFormDataChange={handleFormDataChange}
      />

      <ImportacaoModal 
        isOpen={importModalOpen}
        onOpenChange={(open) => {
          handleModalOpenChange(open, importModalOpen, setImportModalOpen);
        }}
      />

      <CNABToAPIModal 
        isOpen={cnabToApiModalOpen}
        onOpenChange={(open) => {
          handleModalOpenChange(open, cnabToApiModalOpen, setCnabToApiModalOpen);
        }}
      />

      <AdminPanelModal 
        isOpen={adminPanelOpen}
        onOpenChange={(open) => {
          handleModalOpenChange(open, adminPanelOpen, setAdminPanelOpen);
        }}
      />

      <DeleteConvenenteDialog 
        isOpen={showDeleteDialog}
        onOpenChange={(open) => {
          // Special handling for delete dialog to prevent closure during deletion
          if (isDeletingRef.current && !open) {
            console.log("IndexPageModals: Preventing delete dialog close during deletion");
            return;
          }
          console.log("IndexPageModals: Setting delete dialog state to:", open);
          setShowDeleteDialog(open);
        }}
        onDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};
