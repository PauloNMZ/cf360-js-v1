
import { useState, useEffect } from 'react';
import { CNABWorkflowData, Favorecido } from '@/types/cnab240';
import { downloadCNABFile, processSelectedRows } from '@/services/cnab240/cnab240Service';
import { RowData } from '@/types/importacao';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';
import { useIndexPageContext } from '@/hooks/useIndexPageContext';

interface UseWorkflowDialogOptions {
  selectedConvenente?: any;
  hasSelectedConvenente?: boolean;
}

export const useWorkflowDialog = (options: UseWorkflowDialogOptions = {}) => {
  const { selectedConvenente, hasSelectedConvenente = false } = options;
  const { showSuccess, showInfo } = useNotificationModalContext();
  const { selectedHeaderCompany } = useIndexPageContext();
  
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  
  // Determinar step inicial baseado se há empresa selecionada
  const hasCompanyInHeader = !!(selectedHeaderCompany && selectedHeaderCompany.razaoSocial);
  const [currentStep, setCurrentStep] = useState<number>(() => {
    return (hasCompanyInHeader || hasSelectedConvenente) ? 1 : 0;
  });
  
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

  // Determine total steps based on whether convenente is pre-selected or company is in header
  const getTotalSteps = () => {
    return (hasCompanyInHeader || hasSelectedConvenente) ? 4 : 5;
  };

  // Get the actual step number for display
  const getDisplayStepNumber = (step: number) => {
    if (hasCompanyInHeader || hasSelectedConvenente) {
      return step;
    }
    return step + 1; // When step 0 exists, display as 1, 2, 3, 4, 5
  };

  // Navigation functions with conditional logic
  const goToNextStep = () => {
    const isValid = isCurrentStepValid();
    const maxStep = getTotalSteps();
    
    if (isValid && currentStep < maxStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    const minStep = (hasCompanyInHeader || hasSelectedConvenente) ? 1 : 0;
    if (currentStep > minStep) {
      setCurrentStep(prev => prev - 1);
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
      
      if (field === 'convenente') {
        console.log("🎯 CONVENENTE UPDATED:");
        console.log("  - Old convenente:", prev.convenente);
        console.log("  - New convenente:", value);
        console.log("  - New convenente type:", typeof value);
        console.log("  - New convenente ID:", value?.id);
        console.log("  - New convenente razaoSocial:", value?.razaoSocial);
      }
      
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
    
    // Se há empresa no header ou convenente pré-selecionado
    if (hasCompanyInHeader || hasSelectedConvenente) {
      switch (currentStep) {
        case 1: // Data de Pagamento
          const isValid = workflow.paymentDate !== undefined && workflow.paymentDate !== null;
          console.log("Step 1 válido?", isValid, "paymentDate:", workflow.paymentDate);
          return isValid;
        case 2: // Tipo de Serviço
          const hasServiceType = workflow.serviceType !== "";
          console.log("Step 2 válido?", hasServiceType, "serviceType:", workflow.serviceType);
          return hasServiceType;
        case 3: // Revisar Dados
          return true;
        case 4: // Método de Envio
          return workflow.sendMethod !== "";
        default:
          return false;
      }
    } else {
      // Se não há empresa no header
      switch (currentStep) {
        case 0: // Seleção de Empresa
          const hasConvenente = workflow.convenente !== null;
          console.log("Step 0 válido?", hasConvenente, "convenente:", workflow.convenente);
          return hasConvenente;
        case 1: // Data de Pagamento
          const isValid = workflow.paymentDate !== undefined && workflow.paymentDate !== null;
          console.log("Step 1 válido?", isValid, "paymentDate:", workflow.paymentDate);
          return isValid;
        case 2: // Tipo de Serviço
          const hasServiceType = workflow.serviceType !== "";
          console.log("Step 2 válido?", hasServiceType, "serviceType:", workflow.serviceType);
          return hasServiceType;
        case 3: // Revisar Dados
          return true;
        case 4: // Método de Envio
          return workflow.sendMethod !== "";
        default:
          return false;
      }
    }
  };

  // Get step title based on current step and whether convenente is pre-selected
  const getStepTitle = () => {
    if (hasCompanyInHeader || hasSelectedConvenente) {
      switch (currentStep) {
        case 1:
          return "Data de Pagamento";
        case 2:
          return "Tipo de Serviço";
        case 3:
          return "Revisar Dados";
        case 4:
          return "Método de Envio";
        default:
          return "";
      }
    } else {
      switch (currentStep) {
        case 0:
          return "Selecionar Empresa";
        case 1:
          return "Data de Pagamento";
        case 2:
          return "Tipo de Serviço";
        case 3:
          return "Revisar Dados";
        case 4:
          return "Método de Envio";
        default:
          return "";
      }
    }
  };

  // Handle workflow submission
  const handleSubmitWorkflow = async (selectedRows: RowData[]): Promise<{ success: boolean; fileName?: string }> => {
    try {
      // Show processing message
      showInfo("Processando...", `Processando ${selectedRows.length} registros...`);
      
      // If "API REST" method is selected, we would handle that differently
      if (workflow.sendMethod === 'api') {
        showSuccess("Sucesso!", `Enviando ${selectedRows.length} pagamentos via API REST...`);
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
    hasSelectedConvenente: hasSelectedConvenente || hasCompanyInHeader
  };
};
