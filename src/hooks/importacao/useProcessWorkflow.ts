
import { useWorkflowDialog } from './useWorkflowDialog';
import { useDirectoryDialog } from './useDirectoryDialog';
import { useCNABGeneration } from './useCNABGeneration';

// UPDATED: Interface para as opções
interface UseProcessWorkflowOptions {
  selectedConvenente?: any;
  hasSelectedConvenente?: boolean;
}

// UPDATED: Agora aceita um objeto de opções com tipagem correta
export const useProcessWorkflow = (options: UseProcessWorkflowOptions = {}) => {
  const { selectedConvenente, hasSelectedConvenente = false } = options;

  // Use workflow dialog hook with convenente options
  const workflowDialog = useWorkflowDialog({
    selectedConvenente,
    hasSelectedConvenente
  });

  // Use directory dialog hook - CORRIGIDO: sem passar parâmetros
  const directoryDialog = useDirectoryDialog();

  return {
    // Workflow dialog states and methods
    showWorkflowDialog: workflowDialog.showWorkflowDialog,
    setShowWorkflowDialog: workflowDialog.setShowWorkflowDialog,
    currentStep: workflowDialog.currentStep,
    setCurrentStep: workflowDialog.setCurrentStep,
    workflow: workflowDialog.workflow,
    setWorkflow: workflowDialog.setWorkflow,
    goToNextStep: workflowDialog.goToNextStep,
    goToPreviousStep: workflowDialog.goToPreviousStep,
    updateWorkflow: workflowDialog.updateWorkflow,
    isCurrentStepValid: workflowDialog.isCurrentStepValid,
    handleSubmitWorkflow: workflowDialog.handleSubmitWorkflow,
    getTotalSteps: workflowDialog.getTotalSteps,
    getDisplayStepNumber: workflowDialog.getDisplayStepNumber,
    getStepTitle: workflowDialog.getStepTitle,
    hasSelectedConvenente: workflowDialog.hasSelectedConvenente,

    // Directory dialog states and methods
    showDirectoryDialog: directoryDialog.showDirectoryDialog,
    setShowDirectoryDialog: directoryDialog.setShowDirectoryDialog,
    handleOpenDirectorySettings: directoryDialog.handleOpenDirectorySettings,
    handleSaveDirectorySettings: directoryDialog.handleSaveDirectorySettings,

    // CNAB file states - ATUALIZADO: Agora vem do useWorkflowDialog
    cnabFileGenerated: workflowDialog.cnabFileGenerated,
    setCnabFileGenerated: workflowDialog.setCnabFileGenerated,
    cnabFileName: workflowDialog.cnabFileName,
    setCnabFileName: workflowDialog.setCnabFileName
  };
};
