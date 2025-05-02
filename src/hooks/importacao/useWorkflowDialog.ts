
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { CNABWorkflowData, Favorecido } from '@/types/cnab240';
import { downloadCNABFile } from '@/services/cnab240/index';
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
  useState(() => {
    const savedDirectory = localStorage.getItem('cnab240OutputDirectory') || '';
    setWorkflow(prev => ({
      ...prev,
      outputDirectory: savedDirectory
    }));
  });

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
      // If "API REST" method is selected, we would handle that differently
      if (workflow.sendMethod === 'api') {
        toast.success(`Enviando ${selectedRows.length} pagamentos via API REST...`);
        // This would call an API integration - not implemented yet
        return;
      }
      
      // For CNAB file generation
      const favorecidos: Favorecido[] = selectedRows.map(row => ({
        nome: row.NOME,
        inscricao: row.INSCRICAO,
        banco: row.BANCO,
        agencia: row.AGENCIA,
        conta: row.CONTA,
        tipo: row.TIPO,
        valor: parseFloat(row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'))
      }));
      
      // Generate and download the CNAB file
      await downloadCNABFile(workflow, favorecidos);
      
      console.log("Dados completos do processamento:", {
        registros: selectedRows,
        dataPagamento: workflow.paymentDate,
        tipoServico: workflow.serviceType,
        convenente: workflow.convenente,
        metodoEnvio: workflow.sendMethod,
        diretorioSaida: workflow.outputDirectory
      });
      
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      toast.error("Ocorreu um erro ao processar o arquivo CNAB");
    }
  };

  return {
    showWorkflowDialog,
    setShowWorkflowDialog,
    currentStep,
    workflow,
    goToNextStep,
    goToPreviousStep,
    updateWorkflow,
    isCurrentStepValid,
    handleSubmitWorkflow
  };
};
