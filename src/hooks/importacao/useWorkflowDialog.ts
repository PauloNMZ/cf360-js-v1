
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { CNABWorkflowData, Favorecido } from '@/types/cnab240';
import { downloadCNABFile, processSelectedRows } from '@/services/cnab240/cnab240Service';
import { RowData } from '@/types/importacao';

export const useWorkflowDialog = () => {
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [workflow, setWorkflow] = useState<CNABWorkflowData>({
    paymentDate: undefined,
    serviceType: "Pagamentos Diversos",
    convenente: null,
    sendMethod: "cnab",
    outputDirectory: ''
  });

  // Initialize workflow with saved directory
  useEffect(() => {
    const savedDirectory = localStorage.getItem('cnab240OutputDirectory') || '';
    setWorkflow(prev => ({
      ...prev,
      outputDirectory: savedDirectory
    }));
  }, []);

  // Navigation functions
  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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

  // Function to check if the current step is valid - simplificada para debug
  const isCurrentStepValid = () => {
    console.log("useWorkflowDialog - isCurrentStepValid chamado para step:", currentStep);
    console.log("useWorkflowDialog - workflow.paymentDate:", workflow.paymentDate);
    
    switch (currentStep) {
      case 1: // Date selection - simplificado para aceitar qualquer data válida
        const isValid = workflow.paymentDate !== undefined && workflow.paymentDate !== null;
        console.log("useWorkflowDialog - Step 1 válido?", isValid, "paymentDate:", workflow.paymentDate);
        return isValid;
      case 2: // Service type
        return workflow.serviceType !== "";
      case 3: // Convenente
        return workflow.convenente !== null;
      case 4: // Send method
        return workflow.sendMethod !== "";
      default:
        return false;
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
    handleSubmitWorkflow
  };
};
