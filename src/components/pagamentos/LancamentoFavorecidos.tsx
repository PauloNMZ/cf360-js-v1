
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileOutput } from "lucide-react";
import FavorecidoFormModal from '@/components/favorecidos/FavorecidoFormModal';
import DeleteFavorecidoDialog from '@/components/favorecidos/DeleteFavorecidoDialog';
import WorkflowDialog from '@/components/importacao/WorkflowDialog';
import DirectoryDialog from '@/components/importacao/DirectoryDialog';
import { useFavorecidos } from '@/hooks/favorecidos/useFavorecidos';
import { useFavorecidosWorkflow } from '@/hooks/favorecidos/useFavorecidosWorkflow';
import FavorecidoSearchBar, { EmptyState } from '@/components/favorecidos/FavorecidoSearchBar';
import FavorecidosTable from '@/components/favorecidos/FavorecidosTable';
import { Loader2 } from 'lucide-react';
import NotificationModal from '@/components/ui/NotificationModal';
import { useNotificationModalContext } from "@/components/ui/NotificationModalProvider";

interface LancamentoFavorecidosProps {
  hidePixColumn?: boolean;
  hideBankColumn?: boolean;
  hideTipoColumn?: boolean;
}

const LancamentoFavorecidos: React.FC<LancamentoFavorecidosProps> = ({
  hidePixColumn = false,
  hideBankColumn = false,
  hideTipoColumn = false
}) => {
  const {
    modalOpen,
    setModalOpen,
    handleCreateNew,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleInputChange,
    handleSelectChange,
    handleSave,
    formMode,
    currentFavorecido,
    isLoading,
    filteredFavorecidos,
    searchTerm,
    handleSearchChange,
    notificationModalOpen,
    notificationConfig,
    setNotificationModalOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    grupos,
  } = useFavorecidos();

  const [selectedFavorecido, setSelectedFavorecido] = useState<any>(null);
  const [selectedFavorecidos, setSelectedFavorecidos] = useState<string[]>([]);
  const { showSuccess, showError } = useNotificationModalContext();

  // Initialize workflow hook
  const {
    showWorkflowDialog,
    setShowWorkflowDialog,
    showDirectoryDialog,
    setShowDirectoryDialog,
    currentStep,
    workflow,
    updateWorkflow,
    isCurrentStepValid,
    goToNextStep,
    goToPreviousStep,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle,
    handleOpenDirectorySettings,
    handleSaveDirectorySettings,
    handleSubmitWorkflow,
    convenentes,
    carregandoConvenentes
  } = useFavorecidosWorkflow({
    selectedFavorecidos,
    favorecidos: filteredFavorecidos
  });

  // Listen for custom events from the StepFour component
  useEffect(() => {
    const handleOpenSettings = () => {
      handleOpenDirectorySettings();
    };

    document.addEventListener('openDirectorySettings', handleOpenSettings);
    
    return () => {
      document.removeEventListener('openDirectorySettings', handleOpenSettings);
    };
  }, [handleOpenDirectorySettings]);

  const handleSelectFavorecido = (favorecido: any) => {
    setSelectedFavorecido(favorecido);
  };

  const handleCancelSelection = () => {
    setSelectedFavorecido(null);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedFavorecidos(selectedIds);
  };

  const handleProcessSelected = () => {
    if (selectedFavorecidos.length === 0) {
      showError("Erro!", "Nenhum favorecido selecionado para processar.");
      return;
    }
    
    console.log("Abrindo workflow para favorecidos selecionados:", selectedFavorecidos);
    
    // Open workflow dialog starting with convenente selection
    setShowWorkflowDialog(true);
  };

  const handleCloseNotificationModal = () => {
    setNotificationModalOpen();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lançamento para Favorecido</h3>
        <Button onClick={() => handleCreateNew()} className="flex items-center gap-2">
          <Plus size={16} /> Cadastrar Novo Favorecido
        </Button>
      </div>

      {selectedFavorecido ? (
        <div className="space-y-4 p-4 border rounded-md bg-background">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Favorecido Selecionado:</h4>
            <Button variant="outline" size="sm" onClick={handleCancelSelection}>Selecionar Outro</Button>
          </div>
          <div className="border p-4 rounded-md space-y-2 bg-secondary/20">
            <p><strong>Nome:</strong> {selectedFavorecido.nome}</p>
            <p><strong>Inscrição:</strong> {selectedFavorecido.inscricao}</p>
            <p><strong>Banco/Agência/Conta:</strong> {selectedFavorecido.dadosBancarios}</p>
            <p><strong>Chave PIX:</strong> {selectedFavorecido.chavePix}</p>
          </div>

          <div className="mt-4 space-y-3">
            <h4 className="text-lg font-semibold">Detalhes do Lançamento</h4>
            <p className="text-muted-foreground">Formulário de lançamento para {selectedFavorecido.nome} aqui...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4">
          <FavorecidoSearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            hasResults={filteredFavorecidos.length > 0}
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
            </div>
          ) : filteredFavorecidos.length > 0 ? (
            <FavorecidosTable
              favorecidos={filteredFavorecidos}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelectFavorecido={handleSelectFavorecido}
              selectedFavorecidos={selectedFavorecidos}
              onSelectionChange={handleSelectionChange}
              itemsPerPage={5}
              hidePixColumn={hidePixColumn}
              hideBankColumn={hideBankColumn}
              hideTipoColumn={hideTipoColumn}
            />
          ) : (
            <EmptyState searchTerm={searchTerm} />
          )}

          {selectedFavorecidos.length > 0 && (
            <div className="mt-4 p-4 border rounded-md bg-background">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">
                  {selectedFavorecidos.length} favorecido(s) selecionado(s)
                </h4>
                <div className="flex gap-2">
                  <Button
                    onClick={handleProcessSelected}
                    className="flex items-center gap-2"
                  >
                    <FileOutput size={16} />
                    Processar Selecionados
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedFavorecidos([])}>
                    Limpar Seleção
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-muted-foreground">
                  Clique em "Processar Selecionados" para gerar arquivo CNAB ou enviar via API.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Workflow Dialog - complete flow with convenente selection */}
      <WorkflowDialog 
        isOpen={showWorkflowDialog}
        onOpenChange={setShowWorkflowDialog}
        workflow={workflow}
        updateWorkflow={updateWorkflow}
        currentStep={currentStep}
        totalSteps={4} // Keep original totalSteps for proper rendering
        goToNextStep={goToNextStep}
        goToPreviousStep={goToPreviousStep}
        handleSubmit={handleSubmitWorkflow}
        isCurrentStepValid={isCurrentStepValid}
        convenentes={convenentes}
        carregandoConvenentes={carregandoConvenentes}
        getTotalSteps={getTotalSteps}
        getDisplayStepNumber={getDisplayStepNumber}
        getStepTitle={getStepTitle}
        hasSelectedConvenente={false} // Show convenente selection step
      />

      {/* Directory configuration dialog */}
      <DirectoryDialog 
        isOpen={showDirectoryDialog}
        onOpenChange={setShowDirectoryDialog}
        workflow={workflow}
        updateWorkflow={updateWorkflow}
        handleSaveSettings={handleSaveDirectorySettings}
      />

      {/* Form Modal */}
      <FavorecidoFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentFavorecido={currentFavorecido}
        grupos={grupos}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSave={handleSave}
        formMode={formMode}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteFavorecidoDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isDeleting={isLoading}
      />

      {/* Notification Modal */}
      <NotificationModal
        open={notificationModalOpen}
        onOpenChange={setNotificationModalOpen}
        type={notificationConfig.type}
        title={notificationConfig.title}
        message={notificationConfig.message}
        buttonText={notificationConfig.buttonText}
        onButtonClick={handleCloseNotificationModal}
      />
    </div>
  );
};

export default LancamentoFavorecidos;
