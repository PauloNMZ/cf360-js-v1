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

  // Special handler for delete confirmation
  const handleConfirmDelete = () => {
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
          setShowDeleteDialog(false); // Passa false explicitamente
        }, 1000);
      }
    }
  }, [isDeleting, setShowDeleteDialog]);

  // Clean up any stuck deletion state
  useEffect(() => {
    const checkDeletionTimeout = setTimeout(() => {
      if (isDeleting && resetDeletionState) {
        console.log("IndexPageModals: Checking for stuck deletion state");
        setShowDeleteDialog(false); // Passa false explicitamente
      }
    }, 60000); // Check after 1 minute
    
    return () => clearTimeout(checkDeletionTimeout);
  }, [isDeleting, resetDeletionState, setShowDeleteDialog]);

  // Defensive: NUNCA chame sem argumento
  // Exemplo: se precisar passar para callback, garanta argumento default
  // Exemplo de compatibilização (caso alguma lib não passe arg):
  const onDeleteDialogOpenChange = (val?: boolean) => {
    setShowDeleteDialog(typeof val === 'boolean' ? val : false);
  };

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
          if (isDeleting && !open) {
            return;
          }
          setImportModalOpen(open);
        }}
      />

      <CNABToAPIModal 
        isOpen={cnabToApiModalOpen}
        onOpenChange={(open) => {
          if (isDeleting && !open) {
            return;
          }
          setCnabToApiModalOpen(open);
        }}
      />

      <AdminPanelModal 
        isOpen={adminPanelOpen}
        onOpenChange={(open) => {
          if (isDeleting && !open) {
            return;
          }
          setAdminPanelOpen(open);
          if (!open && reloadSettings) {
            reloadSettings();
          }
        }}
      />

      <DeleteConvenenteDialog 
        isOpen={showDeleteDialog}
        onOpenChange={onDeleteDialogOpenChange}
        onDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default IndexPageModals;
