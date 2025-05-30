
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { CNABWorkflowData, Favorecido } from '@/types/cnab240';
import { downloadCNABFile, processSelectedRows } from '@/services/cnab240/cnab240Service';
import { RowData } from '@/types/importacao';

interface UseWorkflowDialogOptions {
  selectedConvenente?: any;
  hasSelectedConvenente?: boolean;
}

export const useWorkflowDialog = (options: UseWorkflowDialogOptions = {}) => {
  const { selectedConvenente, hasSelectedConvenente = false } = options;
  
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [workflow, setWorkflow] = useState<CNABWorkflowData>({
    paymentDate: undefined,
    serviceType: "Pagamentos Diversos",
    convenente: null,
    sendMethod: "cnab",
    outputDirectory: ''
  });

  // Initialize workflow with saved directory and selected convenente if available
  useEffect(() => {
    const savedDirectory = localStorage.getItem('cnab240OutputDirectory') || '';
    setWorkflow(prev => ({
      ...prev,
      outputDirectory: savedDirectory,
      convenente: hasSelectedConvenente ? selectedConvenente : null
    }));
  }, [selectedConvenente, hasSelectedConvenente]);

  // Determine total steps based on whether convenente is pre-selected
  const getTotalSteps = () => {
    return hasSelectedConvenente ? 3 : 4; // Skip step 3 if convenente is already selected
  };

  // Get the actual step number for display (renumber when step 3 is skipped)
  const getDisplayStepNumber = (step: number) => {
    if (!hasSelectedConvenente) return step;
    if (step <= 2) return step;
    if (step === 4) return 3; // Step 4 becomes step 3 when step 3 is skipped
    return step;
  };

  // Navigation functions with conditional logic
  const goToNextStep = () => {
    if (hasSelectedConvenente && currentStep === 2) {
      // Skip step 3 (convenente selection) and go directly to step 4
      setCurrentStep(4);
    } else {
      setCurrentStep(prev => Math.min(prev + 1, hasSelectedConvenente ? 4 : 4));
    }
  };

  const goToPreviousStep = () => {
    if (hasSelectedConvenente && currentStep === 4) {
      // Skip step 3 (convenente selection) and go directly to step 2
      setCurrentStep(2);
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  // Function to update workflow data with debugging
  const updateWorkflow = (field: keyof CNABWorkflowData, value: any) => {
    console.log("useWorkflowDialog - updateWorkflow chamado:", { field, value });
    console.log("useWorkflowDialog - workflow antes da atualização:", workflow);
    
    setWorkflow(prev => {
      const newWorkflow = {
        ...prev,
        [field]: value
      };
      console.log("useWorkflowDialog - workflow após atualização:", newWorkflow);
      return newWorkflow;
    });
  };

  // Debug logging for workflow state changes
  useEffect(() => {
    console.log("useWorkflowDialog - workflow state atualizado:", workflow);
  }, [workflow]);

  // Function to check if the current step is valid
  const isCurrentStepValid = () => {
    console.log("useWorkflowDialog - isCurrentStepValid chamado para step:", currentStep);
    console.log("useWorkflowDialog - workflow.paymentDate:", workflow.paymentDate);
    
    switch (currentStep) {
      case 1: // Date selection
        const isValid = workflow.paymentDate !== undefined && workflow.paymentDate !== null;
        console.log("useWorkflowDialog - Step 1 válido?", isValid, "paymentDate:", workflow.paymentDate);
        return isValid;
      case 2: // Service type
        return workflow.serviceType !== "";
      case 3: // Convenente (only validate if not pre-selected)
        if (hasSelectedConvenente) return true; // Skip validation if pre-selected
        return workflow.convenente !== null;
      case 4: // Send method
        return workflow.sendMethod !== "";
      default:
        return false;
    }
  };

  // Get step title based on current step and whether convenente is pre-selected
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Data de Pagamento";
      case 2:
        return "Tipo de Serviço";
      case 3:
        return hasSelectedConvenente ? "Método de Envio" : "Selecionar Convenente";
      case 4:
        return "Método de Envio";
      default:
        return "";
    }
  };

  // Handle workflow submission
  const handleSubmitWorkflow = async (selectedRows: RowData[]): Promise<{ success: boolean; fileName?: string }> => {
    try {
      // Show processing message
      toast.info(`Processando ${selectedRows.length} registros...`);
      
      // If "API REST" method is selected, we would handle that differently
      if (workflow.sendMethod === 'api') {
        toast.success(`Enviando ${selectedRows.length} pagamentos via API REST...`);
        // This would call an API integration - not implemented yet
        return { success: true };
      }
      
      // Process selected rows with validation
      const result = await processSelectedRows(workflow, selectedRows);
      
      // Log processing details (for debugging)
      console.log("Dados completos do processamento:", {
        totalRegistros: selectedRows.length,
        dataPagamento: workflow.paymentDate,
        tipoServico: workflow.serviceType,
        convenente: workflow.convenente,
        metodoEnvio: workflow.sendMethod,
        diretorioSaida: workflow.outputDirectory
      });
      
      // Generate a filename based on the current date and time if not provided by processSelectedRows
      const fileName = `Pag_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_${new Date().toTimeString().slice(0, 8).replace(/:/g, '')}_${(workflow.convenente && workflow.convenente.convenioPag) || 'unknown'}_${Math.floor(Math.random() * 100)}.rem`;
      
      // Return the result with filename
      return { success: true, fileName };
      
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      // Error handling is already done in processSelectedRows
      return { success: false };
    }
  };

  return {
    showWorkflowDialog,
    setShowWorkflowDialog,
    currentStep,
    setCurrentStep,
    workflow,
    setWorkflow,
    goToNextStep,
    goToPreviousStep,
    updateWorkflow,
    isCurrentStepValid,
    handleSubmitWorkflow,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle,
    hasSelectedConvenente
  };
};
