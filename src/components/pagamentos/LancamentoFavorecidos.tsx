import React, { useEffect } from 'react';
import { useFavorecidos } from '@/hooks/favorecidos/useFavorecidos';
import { useFavorecidosWorkflow } from '@/hooks/favorecidos/useFavorecidosWorkflow';
import { useLancamentoFavorecidosState } from '@/hooks/favorecidos/useLancamentoFavorecidosState';
import { useLancamentoFavorecidosHandlers } from '@/hooks/favorecidos/useLancamentoFavorecidosHandlers';
import { useLancamentoFavorecidosReport } from '@/hooks/favorecidos/useLancamentoFavorecidosReport';
import FavorecidoHeader from './favorecidos/FavorecidoHeader';
import SelectedFavorecidoView from './favorecidos/SelectedFavorecidoView';
import FavorecidosListView from './favorecidos/FavorecidosListView';
import SelectedFavorecidosActions from './favorecidos/SelectedFavorecidosActions';
import LancamentoFavorecidosDialogs from './favorecidos/LancamentoFavorecidosDialogs';

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
      <FavorecidoHeader onCreateNew={handleCreateNew} />

      {selectedFavorecido ? (
        <SelectedFavorecidoView 
          selectedFavorecido={selectedFavorecido}
          onCancel={handleCancelSelection}
        />
      ) : (
        <>
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

          <SelectedFavorecidosActions
            selectedCount={selectedFavorecidos.length}
            onProcessSelected={handleProcessSelected}
            onGenerateReport={handleGenerateReportOnly}
            onClearSelection={() => setSelectedFavorecidos([])}
            hasConvenente={hasConvenente}
          />
        </>
      )}

      <LancamentoFavorecidosDialogs
        showWorkflowDialog={workflowData.showWorkflowDialog}
        setShowWorkflowDialog={workflowData.setShowWorkflowDialog}
        workflow={workflowData.workflow}
        updateWorkflow={workflowData.updateWorkflow}
        currentStep={workflowData.currentStep}
        goToNextStep={workflowData.goToNextStep}
        goToPreviousStep={workflowData.goToPreviousStep}
        handleSubmitWorkflow={workflowData.handleSubmitWorkflow}
        isCurrentStepValid={workflowData.isCurrentStepValid}
        convenentes={workflowData.convenentes}
        carregandoConvenentes={workflowData.carregandoConvenentes}
        getTotalSteps={workflowData.getTotalSteps}
        getDisplayStepNumber={workflowData.getDisplayStepNumber}
        getStepTitle={workflowData.getStepTitle}
        
        showDirectoryDialog={workflowData.showDirectoryDialog}
        setShowDirectoryDialog={workflowData.setShowDirectoryDialog}
        handleSaveDirectorySettings={workflowData.handleSaveDirectorySettings}
        
        showPDFPreviewDialog={workflowData.showPDFPreviewDialog}
        setShowPDFPreviewDialog={workflowData.setShowPDFPreviewDialog}
        reportData={workflowData.reportData}
        showEmailConfigDialog={workflowData.showEmailConfigDialog}
        setShowEmailConfigDialog={workflowData.setShowEmailConfigDialog}
        defaultEmailMessage={workflowData.defaultEmailMessage}
        reportDate={workflowData.reportDate}
        handleSendEmailReport={workflowData.handleSendEmailReport}
        handleEmailSubmit={workflowData.handleEmailSubmit}
        
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
      />
    </div>
  );
};

export default LancamentoFavorecidos;
