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

    // Company settings and actions
    reloadSettings
  } = useIndexPageContext();

  // Track deletion state
  const prevDeletingRef = useRef(isDeleting);
  const deletionCompletedRef = useRef(false);

  // Special handler for delete confirmation to prevent duplicate triggers
  const handleConfirmDelete = (_?: any) => {
    if (isDeleting) {
      console.log("IndexPageModals: Delete operation already in progress");
      return;
    }
    
    console.log("IndexPageModals: Confirming delete");
    confirmDelete();
  };
  
  // Track deletion state changes
  useEffect(() => {
    // Only log when deletion state actually changes
    if (prevDeletingRef.current !== isDeleting) {
      console.log("IndexPageModals: isDeleting changed from", prevDeletingRef.current, "to", isDeleting);
      prevDeletingRef.current = isDeleting;
      
      // If deletion just completed, set cleanup flag
      if (prevDeletingRef.current && !isDeleting) {
        deletionCompletedRef.current = true;
        console.log("IndexPageModals: Deletion completed, cleanup flag set");
        
        // Reset deletion completed flag after delay
        setTimeout(() => {
          deletionCompletedRef.current = false;
          // FIX: Always close the delete dialog explicitly (with boolean)
          setShowDeleteDialog(false);
        }, 1000);
      }
    }
  }, [isDeleting, setShowDeleteDialog]);
  
  // Clean up any stuck deletion state
  useEffect(() => {
    const checkDeletionTimeout = setTimeout(() => {
      if (isDeleting && resetDeletionState) {
        // If deletion has been in progress for too long
        console.log("IndexPageModals: Checking for stuck deletion state");
        
        // Consider adding an auto-reset after a very long timeout (e.g., 60 seconds)
        // This is a safety measure to prevent permanent UI freezing
        // FIX: Always close the delete dialog explicitly (with boolean)
        setShowDeleteDialog(false);
      }
    }, 60000); // Check after 1 minute
    
    return () => clearTimeout(checkDeletionTimeout);
  }, [isDeleting, resetDeletionState, setShowDeleteDialog]);

  // Fix for the type error in handleSelectConvenente
  const onSelectConvenente = (convenente: any) => {
    handleSelectConvenente(convenente, "view");
  };

  return (
    <>
      <ConvenenteModal 
        isOpen={modalOpen}
        onOpenChange={handleConvenenteModalOpenChange}
        convenentes={convenentes}
        filteredConvenentes={filteredConvenentes}
        currentConvenenteId={currentConvenenteId}
        formData={formData}
        formMode={formMode}
        formValid={formValid}
        isLoading={isLoading || isDeleting} 
        isSearching={isSearching}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSelectConvenente={onSelectConvenente}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSaveClick}
        onFormDataChange={handleFormDataChange}
      />

      <ImportacaoModal 
        isOpen={importModalOpen}
        onOpenChange={(open) => {
          // Prevent modal closure during deletion
          if (isDeleting && !open) {
            return;
          }
          setImportModalOpen(open);
        }}
      />

      <CNABToAPIModal 
        isOpen={cnabToApiModalOpen}
        onOpenChange={(open) => {
          // Prevent modal closure during deletion
          if (isDeleting && !open) {
            return;
          }
          setCnabToApiModalOpen(open);
        }}
      />

      <AdminPanelModal 
        isOpen={adminPanelOpen}
        onOpenChange={(open) => {
          // Prevent modal closure during deletion
          if (isDeleting && !open) {
            return;
          }
          setAdminPanelOpen(open);
          // Recarrega as configurações da empresa quando o modal for fechado
          if (!open && reloadSettings) {
            reloadSettings();
          }
        }}
      />

      {/* Make sure the delete dialog is only shown once */}
      <DeleteConvenenteDialog 
        isOpen={showDeleteDialog}
        // Correction: always pass a boolean to onOpenChange
        onOpenChange={(val) => setShowDeleteDialog(val)}
        onDelete={handleConfirmDelete} // FIX: Pass handler matching the prop signature (no argument)
        isDeleting={isDeleting}
      />
    </>
  );
};

export default IndexPageModals;
