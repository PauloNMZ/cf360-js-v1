
import React from 'react';
import { useLancamentoFavorecidosContainer } from '@/hooks/favorecidos/useLancamentoFavorecidosContainer';
import LancamentoFavorecidosContent from './LancamentoFavorecidosContent';
import LancamentoFavorecidosDialogs from './LancamentoFavorecidosDialogs';
import WorkflowEventHandler from './WorkflowEventHandler';
import DebugLogger from './DebugLogger';
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
  const {
    favorecidosData,
    stateData,
    workflowData,
    reportData,
    handlersData
  } = useLancamentoFavorecidosContainer();

  const handleCloseNotificationModal = () => {
    favorecidosData.setNotificationModalOpen();
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Event Handler */}
        <WorkflowEventHandler 
          onOpenDirectorySettings={workflowData.handleOpenDirectorySettings}
        />

        {/* Debug Logger */}
        <DebugLogger
          currentStep={workflowData.currentStep}
          workflow={workflowData.workflow}
          isCurrentStepValid={workflowData.isCurrentStepValid}
          selectedFavorecidos={stateData.selectedFavorecidos}
        />

        {/* Main Content */}
        <LancamentoFavorecidosContent
          selectedFavorecido={stateData.selectedFavorecido}
          onCancelSelection={handlersData.handleCancelSelection}
          onCreateNew={favorecidosData.handleCreateNew}
          searchTerm={favorecidosData.searchTerm}
          onSearchChange={favorecidosData.handleSearchChange}
          isLoading={favorecidosData.isLoading}
          filteredFavorecidos={favorecidosData.filteredFavorecidos}
          onEdit={favorecidosData.handleEdit}
          onDelete={favorecidosData.handleDelete}
          onSelectFavorecido={handlersData.handleSelectFavorecido}
          selectedFavorecidos={stateData.selectedFavorecidos}
          onSelectionChange={handlersData.handleSelectionChange}
          hidePixColumn={hidePixColumn}
          hideBankColumn={hideBankColumn}
          hideTipoColumn={hideTipoColumn}
          hasConvenente={reportData.hasConvenente}
          onClearSelection={() => stateData.setSelectedFavorecidos([])}
          onGenerateReport={reportData.handleGenerateReportOnly}
          onProcessSelected={handlersData.handleProcessSelected}
        />

        {/* Dialogs */}
        <LancamentoFavorecidosDialogs
          modalOpen={favorecidosData.modalOpen}
          setModalOpen={favorecidosData.setModalOpen}
          currentFavorecido={favorecidosData.currentFavorecido}
          grupos={favorecidosData.grupos}
          handleInputChange={favorecidosData.handleInputChange}
          handleSelectChange={favorecidosData.handleSelectChange}
          handleSave={favorecidosData.handleSave}
          formMode={favorecidosData.formMode}
          isLoading={favorecidosData.isLoading}
          deleteDialogOpen={favorecidosData.deleteDialogOpen}
          setDeleteDialogOpen={favorecidosData.setDeleteDialogOpen}
          confirmDelete={favorecidosData.confirmDelete}
          notificationModalOpen={favorecidosData.notificationModalOpen}
          setNotificationModalOpen={favorecidosData.setNotificationModalOpen}
          notificationConfig={favorecidosData.notificationConfig}
          onCloseNotificationModal={handleCloseNotificationModal}
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
          isCurrentStepValid={workflowData.isCurrentStepValid}
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
