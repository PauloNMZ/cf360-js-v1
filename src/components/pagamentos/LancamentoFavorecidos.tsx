import React, { useEffect } from 'react';
import { useFavorecidos } from '@/hooks/favorecidos/useFavorecidos';
import { useFavorecidosWorkflow } from '@/hooks/favorecidos/useFavorecidosWorkflow';
import { useLancamentoFavorecidosState } from '@/hooks/favorecidos/useLancamentoFavorecidosState';
import { useLancamentoFavorecidosHandlers } from '@/hooks/favorecidos/useLancamentoFavorecidosHandlers';
import { useLancamentoFavorecidosReport } from '@/hooks/favorecidos/useLancamentoFavorecidosReport';
import FavorecidosHeader from "./favorecidos/FavorecidosHeader";
import SelectedFavorecidoView from "./favorecidos/SelectedFavorecidoView";
import FavorecidosListView from "./favorecidos/FavorecidosListView";
import SelectedFavorecidosActions from "./favorecidos/SelectedFavorecidosActions";
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

  // Debug: log workflow state changes
  useEffect(() => {
    console.log("Workflow state changed:", {
      currentStep: workflowData.currentStep,
      workflow: workflowData.workflow,
      isCurrentStepValid: workflowData.isCurrentStepValid()
    });
  }, [workflowData.currentStep, workflowData.workflow]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <FavorecidosHeader onCreateNew={handleCreateNew} />

      {selectedFavorecido ? (
        // Selected Favorecido View
        <SelectedFavorecidoView
          selectedFavorecido={selectedFavorecido}
          onCancelSelection={handleCancelSelection}
        />
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
          <SelectedFavorecidosActions
            selectedFavorecidos={selectedFavorecidos}
            hasConvenente={hasConvenente}
            onClearSelection={() => setSelectedFavorecidos([])}
            onGenerateReport={handleGenerateReportOnly}
            onProcessSelected={handleProcessSelected}
          />
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
        // Workflow props - passando a função sem executar
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
        isCurrentStepValid={workflowData.isCurrentStepValid()}
        handleSubmitWorkflow={workflowData.handleSubmitWorkflow}
        convenentes={workflowData.convenentes}
        carregandoConvenentes={workflowData.carregandoConvenentes}
        hasSelectedCompany={workflowData.hasSelectedCompany}
        selectedCompany={workflowData.selectedCompany}
      />
    </div>
  );
};

export default LancamentoFavorecidos;
