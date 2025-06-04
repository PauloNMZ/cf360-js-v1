import React, { useEffect } from 'react';
import { useFavorecidos } from '@/hooks/favorecidos/useFavorecidos';
import { useFavorecidosWorkflow } from '@/hooks/favorecidos/useFavorecidosWorkflow';
import { useLancamentoFavorecidosState } from '@/hooks/favorecidos/useLancamentoFavorecidosState';
import { useLancamentoFavorecidosHandlers } from '@/hooks/favorecidos/useLancamentoFavorecidosHandlers';
import { useLancamentoFavorecidosReport } from '@/hooks/favorecidos/useLancamentoFavorecidosReport';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import LancamentoFavorecidosContent from './LancamentoFavorecidosContent';
import LancamentoFavorecidosDialogs from './LancamentoFavorecidosDialogs';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

interface LancamentoFavorecidosContainerProps {
  hidePixColumn?: boolean;
  hideBankColumn?: boolean;
  hideTipoColumn?: boolean;
}

const LancamentoFavorecidosContainer: React.FC<LancamentoFavorecidosContainerProps> = ({
  hidePixColumn = false,
  hideBankColumn = false,
  hideTipoColumn = false
}) => {
  const { handleError } = useErrorHandler();

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
      try {
        workflowData.handleOpenDirectorySettings();
      } catch (error) {
        handleError(error, {
          component: 'LancamentoFavorecidosContainer',
          file: 'LancamentoFavorecidosContainer.tsx',
          action: 'handleOpenSettings'
        });
      }
    };

    document.addEventListener('openDirectorySettings', handleOpenSettings);
    
    return () => {
      document.removeEventListener('openDirectorySettings', handleOpenSettings);
    };
  }, [workflowData.handleOpenDirectorySettings, handleError]);

  const handleCloseNotificationModal = () => {
    setNotificationModalOpen();
  };

  // Debug: log workflow state changes
  useEffect(() => {
    try {
      console.log("Workflow state changed:", {
        currentStep: workflowData.currentStep,
        workflow: workflowData.workflow,
        isCurrentStepValid: workflowData.isCurrentStepValid
      });
    } catch (error) {
      handleError(error, {
        component: 'LancamentoFavorecidosContainer',
        file: 'LancamentoFavorecidosContainer.tsx',
        action: 'logWorkflowState'
      });
    }
  }, [workflowData.currentStep, workflowData.workflow, workflowData.isCurrentStepValid, handleError]);

  // Debug: log selected favorecidos
  useEffect(() => {
    console.log("Selected favorecidos changed:", selectedFavorecidos);
  }, [selectedFavorecidos]);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <LancamentoFavorecidosContent
          selectedFavorecido={selectedFavorecido}
          onCancelSelection={handleCancelSelection}
          onCreateNew={handleCreateNew}
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
          hasConvenente={hasConvenente}
          onClearSelection={() => setSelectedFavorecidos([])}
          onGenerateReport={handleGenerateReportOnly}
          onProcessSelected={handleProcessSelected}
        />

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
          // Workflow props - pass boolean value directly
          showWorkflowDialog={workflowData.showWorkflowDialog}
          setShowWorkflowDialog={workflowData.setShowWorkflowDialog}
          workflow={workflowData.workflow}
          updateWorkflow={workflowData.updateWorkflow}
          currentStep={workflowData.currentStep}
          getTotalSteps={() => workflowData.getTotalSteps()}
          getDisplayStepNumber={() => workflowData.getDisplayStepNumber(workflowData.currentStep)}
          getStepTitle={() => workflowData.getStepTitle(workflowData.currentStep)}
          goToNextStep={workflowData.goToNextStep}
          goToPreviousStep={workflowData.goToPreviousStep}
          isCurrentStepValid={workflowData.isCurrentStepValid} // Now passing boolean directly
          handleSubmitWorkflow={workflowData.handleSubmitWorkflow}
          convenentes={workflowData.convenentes}
          carregandoConvenentes={workflowData.carregandoConvenentes}
          hasSelectedCompany={workflowData.hasSelectedCompany}
          selectedCompany={workflowData.selectedCompany}
        />
      </div>
    </ErrorBoundary>
  );
};

export default LancamentoFavorecidosContainer;
