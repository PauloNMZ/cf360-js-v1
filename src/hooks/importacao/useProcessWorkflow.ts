
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getConvenentes } from '@/services/convenente/convenenteService';

interface UseProcessWorkflowProps {
  selectedConvenente: any;
  hasSelectedConvenente: boolean;
}

export const useProcessWorkflow = ({ selectedConvenente, hasSelectedConvenente }: UseProcessWorkflowProps) => {
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showDirectoryDialog, setShowDirectoryDialog] = useState(false);
  
  // Calculate initial step based on whether there's a selected convenente
  const calculateInitialStep = () => {
    return hasSelectedConvenente ? 1 : 0;
  };
  
  const [currentStep, setCurrentStep] = useState(calculateInitialStep);
  const [cnabFileGenerated, setCnabFileGenerated] = useState(false);
  const [cnabFileName, setCnabFileName] = useState('');
  const [workflow, setWorkflow] = useState({
    convenente: selectedConvenente,
    paymentDate: null,
    serviceType: "Pagamentos Diversos",
    sendMethod: "cnab"
  });

  // Reset workflow when convenente changes
  useEffect(() => {
    setWorkflow(prev => ({
      ...prev,
      convenente: selectedConvenente
    }));
  }, [selectedConvenente]);

  const updateWorkflow = (field: string, value: any) => {
    setWorkflow(prev => ({ ...prev, [field]: value }));
  };

  // Navigation functions
  const getTotalSteps = () => {
    return hasSelectedConvenente ? 4 : 5;
  };

  const getDisplayStepNumber = () => {
    return hasSelectedConvenente ? currentStep : (currentStep === 0 ? 1 : currentStep);
  };

  const getStepTitle = () => {
    if (!hasSelectedConvenente) {
      switch (currentStep) {
        case 0: return "Selecionar Empresa";
        case 1: return "Data de Pagamento";
        case 2: return "Tipo de Serviço";
        case 3: return "Método de Envio";
        case 4: return "Revisar Dados";
        default: return "";
      }
    } else {
      switch (currentStep) {
        case 1: return "Data de Pagamento";
        case 2: return "Tipo de Serviço";
        case 3: return "Método de Envio";
        case 4: return "Revisar Dados";
        default: return "";
      }
    }
  };

  const isCurrentStepValid = () => {
    if (!hasSelectedConvenente) {
      switch (currentStep) {
        case 0: return !!workflow.convenente;
        case 1: return !!workflow.paymentDate;
        case 2: return !!workflow.serviceType;
        case 3: return !!workflow.sendMethod;
        case 4: return true;
        default: return true;
      }
    } else {
      switch (currentStep) {
        case 1: return !!workflow.paymentDate;
        case 2: return !!workflow.serviceType;
        case 3: return !!workflow.sendMethod;
        case 4: return true;
        default: return true;
      }
    }
  };

  const goToNextStep = () => {
    if (isCurrentStepValid() && currentStep < getTotalSteps()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    const minStep = hasSelectedConvenente ? 1 : 0;
    if (currentStep > minStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitWorkflow = () => {
    console.log("Submitting workflow:", workflow);
    setCnabFileGenerated(true);
    setCnabFileName(`cnab_${Date.now()}.txt`);
    setShowWorkflowDialog(false);
  };

  const handleOpenDirectorySettings = () => {
    setShowDirectoryDialog(true);
  };

  const handleSaveDirectorySettings = () => {
    setShowDirectoryDialog(false);
  };

  // Reset step when dialog opens
  const setShowWorkflowDialogWithReset = (show: boolean) => {
    if (show) {
      setCurrentStep(calculateInitialStep());
    }
    setShowWorkflowDialog(show);
  };

  return {
    showWorkflowDialog,
    setShowWorkflowDialog: setShowWorkflowDialogWithReset,
    showDirectoryDialog,
    setShowDirectoryDialog,
    currentStep,
    workflow,
    updateWorkflow,
    cnabFileGenerated,
    cnabFileName,
    goToNextStep,
    goToPreviousStep,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle,
    isCurrentStepValid,
    handleSubmitWorkflow,
    handleOpenDirectorySettings,
    handleSaveDirectorySettings,
    hasSelectedConvenente
  };
};
