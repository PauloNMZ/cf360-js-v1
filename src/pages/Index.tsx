
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
import { emptyConvenente } from "@/types/convenente";

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
    setFormValid,
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
    // Limpar todos os dados após logout
    setFormData({...emptyConvenente});
    setCurrentConvenenteId(null);
  };

  const handleAdminPanelClick = () => {
    setAdminPanelOpen(true);
  };

  // Gerencia a abertura/fechamento do modal do convenente
  const handleConvenenteModalOpenChange = (open: boolean) => {
    setModalOpen(open);
    
    // Ao fechar o modal, reseta os dados do formulário
    if (!open) {
      setFormData({...emptyConvenente});
      setCurrentConvenenteId(null);
      setFormMode('view');
      setFormValid(false);
    }
  };

  // Função para salvar que passa os dados atuais
  const handleSaveClick = () => {
    handleSave(formData);
  };

  return (
    <MainLayout companySettings={companySettings}>
      <div className="w-full px-4 py-6">
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
        onOpenChange={handleConvenenteModalOpenChange}
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
        onSave={handleSaveClick}
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
