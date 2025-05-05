
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { validateFavorecidos } from '@/services/cnab240/validationService';
import { useWorkflowDialog } from './useWorkflowDialog';
import { useDirectoryDialog } from './useDirectoryDialog';
import { useCNABGeneration } from './useCNABGeneration';

export const useProcessWorkflow = (getSelectedRows: () => any[]) => {
  // Import workflow-related hooks
  const workflowDialog = useWorkflowDialog();
  const directoryDialog = useDirectoryDialog();
  const cnabGeneration = useCNABGeneration();

  // Handle initial processing
  const handleProcessSelected = () => {
    const selectedRows = getSelectedRows();
    
    if (selectedRows.length === 0) {
      toast.error("Nenhum registro selecionado para processamento.");
      return;
    }

    // Automatically validate before proceeding
    const { errors } = validateFavorecidos(selectedRows);
    
    // Reset workflow steps and open dialog
    workflowDialog.setWorkflow({
      paymentDate: undefined,
      serviceType: "Pagamentos Diversos",
      convenente: null,
      sendMethod: "cnab",
      outputDirectory: directoryDialog.outputDirectory // Preserve directory setting
    });
    workflowDialog.setCurrentStep(1);
    workflowDialog.setShowWorkflowDialog(true);
    
    // Reset CNAB file generation status
    cnabGeneration.setCnabFileGenerated(false);
    cnabGeneration.setCnabFileName('');
  };

  // Handle save directory settings
  const handleSaveDirectorySettings = () => {
    // First update the workflow with the directory dialog value
    workflowDialog.updateWorkflow('outputDirectory', directoryDialog.outputDirectory);
    // Then save settings
    directoryDialog.handleSaveDirectorySettings();
  };

  // Final submission handler
  const handleSubmitWorkflow = async () => {
    const selectedRows = getSelectedRows();
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
