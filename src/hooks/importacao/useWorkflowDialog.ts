
import { useState, useEffect } from 'react';
import { CNABWorkflowData, Favorecido } from '@/types/cnab240';
import { downloadCNABFile, processSelectedRows } from '@/services/cnab240/cnab240Service';
import { RowData } from '@/types/importacao';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';
import { useIndexPageContext } from '@/hooks/useIndexPageContext';
import { toast } from '@/components/ui/sonner';

interface UseWorkflowDialogOptions {
  selectedConvenente?: any;
  hasSelectedConvenente?: boolean;
  selectedRows?: RowData[]; // NOVO: Adicionar selectedRows
}

export const useWorkflowDialog = (options: UseWorkflowDialogOptions = {}) => {
  const { selectedConvenente, hasSelectedConvenente = false, selectedRows = [] } = options;
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

  // CNAB file generation state - ADICIONADO
  const [cnabFileGenerated, setCnabFileGenerated] = useState(false);
  const [cnabFileName, setCnabFileName] = useState<string>('');

  // Initialize workflow with saved directory and selected convenente if available
  useEffect(() => {
    const savedDirectory = localStorage.getItem('cnab240OutputDirectory') || '';
    setWorkflow(prev => ({
      ...prev,
      outputDirectory: savedDirectory,
      convenente: hasSelectedConvenente ? selectedConvenente : null
    }));
  }, [selectedConvenente, hasSelectedConvenente]);

  // CORRIGIDO: Sempre 5 steps, igual ao módulo "Por Favorecidos"
  const getTotalSteps = () => {
    return 5;
  };

  // Get the actual step number for display - CORRIGIDO
  const getDisplayStepNumber = (step: number) => {
    if (hasCompanyInHeader || hasSelectedConvenente) {
      return step;
    }
    return step + 1; // When step 0 exists, display as 1, 2, 3, 4, 5
  };

  // Navigation functions with conditional logic - CORRIGIDO: maxStep agora é 4 (5º passo)
  const goToNextStep = () => {
    const isValid = isCurrentStepValid();
    const maxStep = 4; // Steps: 0, 1, 2, 3, 4 (total de 5)
    
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

  // Function to check if the current step is valid - CORRIGIDO: 5 steps (0-4)
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
        case 3: // Método de Envio
          return workflow.sendMethod !== "";
        case 4: // Revisão de Dados - STEP FINAL
          return true;
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
        case 3: // Método de Envio
          return workflow.sendMethod !== "";
        case 4: // Revisão de Dados - STEP FINAL
          return true;
        default:
          return false;
      }
    }
  };

  // Get step title based on current step - CORRIGIDO: 5 steps
  const getStepTitle = () => {
    if (hasCompanyInHeader || hasSelectedConvenente) {
      switch (currentStep) {
        case 1:
          return "Configurar data de Pagamento";
        case 2:
          return "Tipo de serviço";
        case 3:
          return "Método de Envio";
        case 4:
          return "Revisão de Dados";
        default:
          return "";
      }
    } else {
      switch (currentStep) {
        case 0:
          return "Selecionar Empresa";
        case 1:
          return "Configurar data de Pagamento";
        case 2:
          return "Tipo de serviço";
        case 3:
          return "Método de Envio";
        case 4:
          return "Revisão de Dados";
        default:
          return "";
      }
    }
  };

  // CORRIGIDO: Handle workflow submission sem parâmetros, como no módulo "Por Favorecidos"
  const handleSubmitWorkflow = async (): Promise<{ success: boolean; fileName?: string }> => {
    try {
      console.log("🚀 handleSubmitWorkflow iniciado com:", { 
        selectedRows: selectedRows.length, 
        workflow,
        sendMethod: workflow.sendMethod 
      });

      // Close the workflow dialog first
      setShowWorkflowDialog(false);

      // Validate required data
      if (!workflow.convenente) {
        toast.error("Convenente não selecionado para geração do arquivo.");
        return { success: false };
      }

      if (!workflow.paymentDate) {
        toast.error("Data de pagamento não informada.");
        return { success: false };
      }

      if (selectedRows.length === 0) {
        toast.error("Nenhum registro selecionado para pagamento.");
        return { success: false };
      }

      // Show processing message
      showInfo("Processando...", `Processando ${selectedRows.length} registros...`);

      // If "API REST" method is selected, we would handle that differently
      if (workflow.sendMethod === 'api') {
        showSuccess("Sucesso!", `Enviando ${selectedRows.length} pagamentos via API REST...`);
        // This would call an API integration - not implemented yet
        return { success: true };
      }

      // NOVO: Gerar arquivo CNAB usando o mesmo serviço do "Por Favorecidos"
      console.log("📁 Gerando arquivo CNAB...");
      const result = await processSelectedRows(workflow, selectedRows);
      
      if (result.success && result.fileName) {
        // NOVO: Habilitar o botão de relatório
        setCnabFileGenerated(true);
        setCnabFileName(result.fileName);
        
        console.log("✅ Arquivo CNAB gerado com sucesso:", result.fileName);
        
        // Show success message
        showSuccess("Sucesso!", `Arquivo CNAB gerado: ${result.fileName}`);
        
        return { success: true, fileName: result.fileName };
      } else {
        console.log("❌ Falha na geração do arquivo CNAB");
        return { success: false };
      }
      
    } catch (error) {
      console.error("❌ Erro ao processar arquivo:", error);
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
    hasSelectedConvenente: hasSelectedConvenente || hasCompanyInHeader,
    // NOVO: Exportar estados do CNAB para habilitar o botão de relatório
    cnabFileGenerated,
    setCnabFileGenerated,
    cnabFileName,
    setCnabFileName
  };
};
