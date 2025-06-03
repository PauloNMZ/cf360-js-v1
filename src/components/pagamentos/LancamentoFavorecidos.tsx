
import React, { useEffect } from 'react';
import { useFavorecidos } from '@/hooks/favorecidos/useFavorecidos';
import { useFavorecidosWorkflow } from '@/hooks/favorecidos/useFavorecidosWorkflow';
import { useLancamentoFavorecidosState } from '@/hooks/favorecidos/useLancamentoFavorecidosState';
import { useLancamentoFavorecidosHandlers } from '@/hooks/favorecidos/useLancamentoFavorecidosHandlers';
import { useLancamentoFavorecidosReport } from '@/hooks/favorecidos/useLancamentoFavorecidosReport';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FavorecidosListView from "./favorecidos/FavorecidosListView";
import LancamentoFavorecidosDialogs from "./favorecidos/LancamentoFavorecidosDialogs";

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
  // Favorecidos management
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

  // Local state management
  const {
    selectedFavorecido,
    setSelectedFavorecido,
    selectedFavorecidos,
    setSelectedFavorecidos
  } = useLancamentoFavorecidosState();

  // Workflow functionality
  const workflowData = useFavorecidosWorkflow({
    selectedFavorecidos,
    favorecidos: filteredFavorecidos
  });

  // Report functionality
  const {
    handleGenerateReportOnly,
    hasConvenente
  } = useLancamentoFavorecidosReport({
    selectedFavorecidos,
    workflow: workflowData.workflow,
    handleGenerateOnlyReport: workflowData.handleGenerateOnlyReport,
    setShowWorkflowDialog: workflowData.setShowWorkflowDialog
  });

  // Event handlers
  const {
    handleSelectFavorecido,
    handleCancelSelection,
    handleSelectionChange,
    handleProcessSelected
  } = useLancamentoFavorecidosHandlers({
    selectedFavorecidos,
    setSelectedFavorecido,
    setSelectedFavorecidos,
    setShowWorkflowDialog: workflowData.setShowWorkflowDialog
  });

  // Listen for custom events from StepFour component
  useEffect(() => {
    const handleOpenSettings = () => {
      workflowData.handleOpenDirectorySettings();
    };

    document.addEventListener('openDirectorySettings', handleOpenSettings);
    
    return () => {
      document.removeEventListener('openDirectorySettings', handleOpenSettings);
    };
  }, [workflowData.handleOpenDirectorySettings]);

  const handleCloseNotificationModal = () => {
    setNotificationModalOpen();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Favorecidos</h2>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus size={16} />
          Novo Favorecido
        </Button>
      </div>

      {selectedFavorecido ? (
        // Selected Favorecido View
        <div className="p-4 border rounded-md bg-background">
          <h3 className="text-lg font-semibold mb-4">Favorecido Selecionado</h3>
          <p><strong>Nome:</strong> {selectedFavorecido?.nome}</p>
          <p><strong>Inscrição:</strong> {selectedFavorecido?.inscricao}</p>
          <div className="mt-4">
            <Button variant="outline" onClick={handleCancelSelection}>
              Voltar à Lista
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* List View */}
          <FavorecidosListView
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            isLoading={isLoading}
            filteredFavorecidos={filteredFavorecidos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelectFavorecido={handleSelectFavorecido}
            selectedFavorecidos={selectedFavorecidos}
            onSelectionChange={handleSelectionChange}
            hidePixColumn={hidePixColumn}
            hideBankColumn={hideBankColumn}
            hideTipoColumn={hideTipoColumn}
          />

          {/* Actions */}
          <div className="flex gap-4 items-center p-4 border rounded-md bg-muted/50">
            <span className="text-sm text-muted-foreground">
              {selectedFavorecidos.length} favorecido(s) selecionado(s)
            </span>
            
            <div className="flex gap-2 ml-auto">
              {selectedFavorecidos.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedFavorecidos([])}
                  size="sm"
                >
                  Limpar Seleção
                </Button>
              )}
              
              <Button 
                onClick={handleGenerateReportOnly}
                disabled={selectedFavorecidos.length === 0 || !hasConvenente}
                variant="outline"
                size="sm"
              >
                Gerar Relatório
              </Button>
              
              <Button 
                onClick={handleProcessSelected}
                disabled={selectedFavorecidos.length === 0}
                size="sm"
              >
                Processar Selecionados
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Dialogs */}
      <LancamentoFavorecidosDialogs
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        currentFavorecido={currentFavorecido}
        grupos={grupos}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSave={handleSave}
        formMode={formMode}
        isLoading={isLoading}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        confirmDelete={confirmDelete}
        notificationModalOpen={notificationModalOpen}
        setNotificationModalOpen={setNotificationModalOpen}
        notificationConfig={notificationConfig}
        onCloseNotificationModal={handleCloseNotificationModal}
        // Workflow props
        showWorkflowDialog={workflowData.showWorkflowDialog}
        setShowWorkflowDialog={workflowData.setShowWorkflowDialog}
        workflow={workflowData.workflow}
        updateWorkflow={workflowData.updateWorkflow}
        currentStep={workflowData.currentStep}
        getTotalSteps={workflowData.getTotalSteps}
        getDisplayStepNumber={workflowData.getDisplayStepNumber}
        getStepTitle={workflowData.getStepTitle}
        goToNextStep={workflowData.goToNextStep}
        goToPreviousStep={workflowData.goToPreviousStep}
        isCurrentStepValid={workflowData.isCurrentStepValid}
        handleSubmitWorkflow={workflowData.handleSubmitWorkflow}
        convenentes={workflowData.convenentes}
        carregandoConvenentes={workflowData.carregandoConvenentes}
      />
    </div>
  );
};

export default LancamentoFavorecidos;
