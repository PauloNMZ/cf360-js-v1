
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

  // Function to update workflow data
  const updateWorkflow = (field: keyof CNABWorkflowData, value: any) => {
    setWorkflow(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to check if the current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1: // Date selection
        return workflow.paymentDate !== undefined;
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
  const handleSubmitWorkflow = async (selectedRows: RowData[]) => {
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
      
      // Return the result with filename
      return result;
      
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
