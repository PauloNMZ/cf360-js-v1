
import { useState } from 'react';
import { validateFavorecidos } from '@/services/cnab240/validationService';
import { useWorkflowDialog } from './useWorkflowDialog';
import { useDirectoryDialog } from './useDirectoryDialog';
import { useCNABGeneration } from './useCNABGeneration';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';

interface UseProcessWorkflowOptions {
  selectedConvenente?: any;
  hasSelectedConvenente?: boolean;
}

export const useProcessWorkflow = (getSelectedRows: () => any[], options: UseProcessWorkflowOptions = {}) => {
  const { selectedConvenente, hasSelectedConvenente = false } = options;
  const { showError } = useNotificationModalContext();
  
  // Import workflow-related hooks with convenente info
  const workflowDialog = useWorkflowDialog({ selectedConvenente, hasSelectedConvenente });
  const directoryDialog = useDirectoryDialog();
  const cnabGeneration = useCNABGeneration();

  // Handle initial processing
  const handleProcessSelected = () => {
    console.log("useProcessWorkflow - handleProcessSelected chamado");
    const selectedRows = getSelectedRows();
    console.log("useProcessWorkflow - selectedRows length:", selectedRows.length);
    
    if (selectedRows.length === 0) {
      console.log("useProcessWorkflow - Nenhum registro selecionado");
      showError("Erro!", "Nenhum registro selecionado para processamento.");
      return;
    }

    console.log("useProcessWorkflow - Validando registros automaticamente...");
    // Automatically validate before proceeding
    const { errors } = validateFavorecidos(selectedRows);
    console.log("useProcessWorkflow - Validação concluída, erros:", errors.length);
    
    // Reset workflow steps and open dialog
    workflowDialog.setWorkflow({
      paymentDate: undefined,
      serviceType: "Pagamentos Diversos",
      convenente: hasSelectedConvenente ? selectedConvenente : null,
      sendMethod: "cnab",
      outputDirectory: directoryDialog.outputDirectory // Preserve directory setting
    });
    workflowDialog.setCurrentStep(1);
    workflowDialog.setShowWorkflowDialog(true);
    
    // Reset CNAB file generation status
    cnabGeneration.setCnabFileGenerated(false);
    cnabGeneration.setCnabFileName('');
    
    console.log("useProcessWorkflow - Workflow dialog aberto");
  };

  // Handle save directory settings
  const handleSaveDirectorySettings = () => {
    console.log("useProcessWorkflow - handleSaveDirectorySettings chamado");
    // First update the workflow with the directory dialog value
    workflowDialog.updateWorkflow('outputDirectory', directoryDialog.outputDirectory);
    // Then save settings
    directoryDialog.handleSaveDirectorySettings();
  };

  // Final submission handler
  const handleSubmitWorkflow = async () => {
    console.log("useProcessWorkflow - handleSubmitWorkflow chamado");
    const selectedRows = getSelectedRows();
    console.log("useProcessWorkflow - Submetendo workflow para", selectedRows.length, "registros");
    
    return cnabGeneration.handleSubmitWorkflow(
      selectedRows, 
      workflowDialog.workflow, 
      workflowDialog.setShowWorkflowDialog
    );
  };

  return {
    // Workflow dialog related props and methods
    showWorkflowDialog: workflowDialog.showWorkflowDialog,
    setShowWorkflowDialog: workflowDialog.setShowWorkflowDialog,
    currentStep: workflowDialog.currentStep,
    workflow: workflowDialog.workflow,
    goToNextStep: workflowDialog.goToNextStep,
    goToPreviousStep: workflowDialog.goToPreviousStep,
    updateWorkflow: workflowDialog.updateWorkflow,
    isCurrentStepValid: workflowDialog.isCurrentStepValid,
    getTotalSteps: workflowDialog.getTotalSteps,
    getDisplayStepNumber: workflowDialog.getDisplayStepNumber,
    getStepTitle: workflowDialog.getStepTitle,
    hasSelectedConvenente: workflowDialog.hasSelectedConvenente,
    
    // Directory dialog related props and methods
    showDirectoryDialog: directoryDialog.showDirectoryDialog,
    setShowDirectoryDialog: directoryDialog.setShowDirectoryDialog,
    handleOpenDirectorySettings: directoryDialog.handleOpenDirectorySettings,
    handleSaveDirectorySettings,
    
    // CNAB file state
    cnabFileGenerated: cnabGeneration.cnabFileGenerated,
    cnabFileName: cnabGeneration.cnabFileName,
    
    // Process handlers
    handleProcessSelected,
    handleSubmitWorkflow
  };
};
