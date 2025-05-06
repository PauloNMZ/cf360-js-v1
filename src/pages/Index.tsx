
import React, { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useIndexPage } from "@/hooks/useIndexPage";
import { useIndexPageActions } from "@/hooks/useIndexPageActions";
import { useAppState } from "@/hooks/useAppState";

// Import components
import MainLayout from "@/components/layout/MainLayout";
import NavigationMenu from "@/components/navigation/NavigationMenu";
import ConvenenteModal from "@/components/convenente/ConvenenteModal";
import DeleteConvenenteDialog from "@/components/convenente/DeleteConvenenteDialog";
import ImportacaoModal from "@/components/importacao/ImportacaoModal";
import CNABToAPIModal from "@/components/cnabToApi/CNABToAPIModal";
import AdminPanelModal from "@/components/admin/AdminPanelModal";
import { emptyConvenente } from "@/types/convenente";

const Index = () => {
  const { signOut } = useAuth();
  const { loadAppState, saveAppState } = useAppState();
  
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
    isSearching,
    handleSearchChange,
    handleSelectConvenente,
    handleFormDataChange
  } = useIndexPage();

  // Add state for CNAB to API modal
  const [cnabToApiModalOpen, setCnabToApiModalOpen] = React.useState(false);

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

  // Load saved app state when component mounts
  useEffect(() => {
    const savedState = loadAppState();
    
    if (savedState.lastModalOpen) {
      // Restore any previously open modals
      if (savedState.lastModalOpen.convenente) {
        setModalOpen(true);
      }
      if (savedState.lastModalOpen.importacao) {
        setImportModalOpen(true);
      }
      if (savedState.lastModalOpen.cnabToApi) {
        setCnabToApiModalOpen(true);
      }
      if (savedState.lastModalOpen.adminPanel) {
        setAdminPanelOpen(true);
      }
    }
  }, []);

  // Save app state whenever modals change
  useEffect(() => {
    saveAppState({
      lastModalOpen: {
        convenente: modalOpen,
        importacao: importModalOpen,
        cnabToApi: cnabToApiModalOpen,
        adminPanel: adminPanelOpen
      }
    });
  }, [modalOpen, importModalOpen, cnabToApiModalOpen, adminPanelOpen]);

  const handleConvenenteClick = () => {
    setModalOpen(true);
  };

  const handleImportarPlanilhaClick = () => {
    setImportModalOpen(true);
  };

  const handleCnabToApiClick = () => {
    setCnabToApiModalOpen(true);
  };

  const handleLogoutClick = async () => {
    // Clear app state before logout
    saveAppState({});
    
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
          onConvenenteClick={() => setModalOpen(true)}
          onImportarPlanilhaClick={() => setImportModalOpen(true)}
          onCnabToApiClick={() => setCnabToApiModalOpen(true)}
          onAdminPanelClick={() => setAdminPanelOpen(true)}
          onLogoutClick={async () => {
            // Clear app state before logout
            saveAppState({});
            
            await signOut();
            // Limpar todos os dados após logout
            setFormData({...emptyConvenente});
            setCurrentConvenenteId(null);
          }}
        />
      </div>

      {/* Modals */}
      <ConvenenteModal 
        isOpen={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          
          // Ao fechar o modal, reseta os dados do formulário
          if (!open) {
            setFormData({...emptyConvenente});
            setCurrentConvenenteId(null);
            setFormMode('view');
            setFormValid(false);
          }
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
        onSave={() => handleSave(formData)}
        onFormDataChange={handleFormDataChange}
      />

      <ImportacaoModal 
        isOpen={importModalOpen}
        onOpenChange={setImportModalOpen}
      />

      <CNABToAPIModal 
        isOpen={cnabToApiModalOpen}
        onOpenChange={setCnabToApiModalOpen}
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
