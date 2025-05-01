
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useIndexPage } from "@/hooks/useIndexPage";
import { useIndexPageActions } from "@/hooks/useIndexPageActions";

// Import components
import MainLayout from "@/components/layout/MainLayout";
import NavigationMenu from "@/components/navigation/NavigationMenu";
import ConvenenteModal from "@/components/convenente/ConvenenteModal";
import DeleteConvenenteDialog from "@/components/convenente/DeleteConvenenteDialog";
import ImportacaoModal from "@/components/importacao/ImportacaoModal";
import AdminPanelModal from "@/components/admin/AdminPanelModal";

const Index = () => {
  const { signOut } = useAuth();
  
  const {
    modalOpen,
    setModalOpen,
    importModalOpen,
    setImportModalOpen,
    adminPanelOpen,
    setAdminPanelOpen,
    showDeleteDialog,
    setShowDeleteDialog,
    formMode,
    setFormMode,
    formData,
    setFormData,
    formValid,
    setFormValid, // Make sure this is properly destructured from useIndexPage
    convenentes,
    setConvenentes,
    currentConvenenteId,
    setCurrentConvenenteId,
    searchTerm,
    filteredConvenentes,
    companySettings,
    isLoading,
    setIsLoading,
    handleSearchChange,
    handleSelectConvenente,
    handleFormDataChange
  } = useIndexPage();

  const {
    handleCreateNew,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleSave
  } = useIndexPageActions({
    setFormMode,
    setFormData,
    setFormValid,
    setConvenentes,
    currentConvenenteId,
    setCurrentConvenenteId,
    setIsLoading
  });

  const handleConvenenteClick = () => {
    setModalOpen(true);
  };

  const handleImportarPlanilhaClick = () => {
    setImportModalOpen(true);
  };

  const handleLogoutClick = async () => {
    await signOut();
  };

  const handleAdminPanelClick = () => {
    setAdminPanelOpen(true);
  };

  return (
    <MainLayout companySettings={companySettings}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <NavigationMenu 
          onConvenenteClick={handleConvenenteClick}
          onImportarPlanilhaClick={handleImportarPlanilhaClick}
          onAdminPanelClick={handleAdminPanelClick}
          onLogoutClick={handleLogoutClick}
        />
      </div>

      {/* Modals */}
      <ConvenenteModal 
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        convenentes={convenentes}
        filteredConvenentes={filteredConvenentes}
        currentConvenenteId={currentConvenenteId}
        formData={formData}
        formMode={formMode}
        formValid={formValid}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSelectConvenente={handleSelectConvenente}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={() => handleSave(formData)}
        onFormDataChange={handleFormDataChange}
      />

      <ImportacaoModal 
        isOpen={importModalOpen}
        onOpenChange={setImportModalOpen}
      />

      <AdminPanelModal 
        isOpen={adminPanelOpen}
        onOpenChange={setAdminPanelOpen}
      />

      <DeleteConvenenteDialog 
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={confirmDelete}
      />
    </MainLayout>
  );
};

export default Index;
