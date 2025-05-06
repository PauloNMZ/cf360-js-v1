import React from "react";
import ConvenenteModal from "@/components/convenente/ConvenenteModal";
import DeleteConvenenteDialog from "@/components/convenente/DeleteConvenenteDialog";
import ImportacaoModal from "@/components/importacao/ImportacaoModal";
import CNABToAPIModal from "@/components/cnabToApi/CNABToAPIModal";
import AdminPanelModal from "@/components/admin/AdminPanelModal";
import { useIndexPageContext } from "@/hooks/useIndexPageContext";
import { emptyConvenente } from "@/types/convenente";

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

  return (
    <>
      <ConvenenteModal 
        isOpen={modalOpen}
        onOpenChange={(open) => {
          handleConvenenteModalOpenChange(open);
        }}
        convenentes={convenentes}
        filteredConvenentes={filteredConvenentes}
        currentConvenenteId={currentConvenenteId}
        formData={formData}
        formMode={formMode}
        formValid={formValid}
        isLoading={isLoading}
        isSearching={isSearching}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSelectConvenente={(convenente) => handleSelectConvenente(convenente, formMode)}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSaveClick}
        onFormDataChange={handleFormDataChange}
      />

      <ImportacaoModal 
        isOpen={importModalOpen}
        onOpenChange={(open) => setImportModalOpen(open)}
      />

      <CNABToAPIModal 
        isOpen={cnabToApiModalOpen}
        onOpenChange={setCnabToApiModalOpen}
      />

      <AdminPanelModal 
        isOpen={adminPanelOpen}
        onOpenChange={(open) => setAdminPanelOpen(open)}
      />

      <DeleteConvenenteDialog 
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={confirmDelete}
      />
    </>
  );
};
