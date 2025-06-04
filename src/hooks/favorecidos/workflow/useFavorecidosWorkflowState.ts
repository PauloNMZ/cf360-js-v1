
import { useState } from 'react';
import { useFavorecidosWorkflowCompany } from './useFavorecidosWorkflowCompany';

export const useFavorecidosWorkflowState = () => {
  const { hasSelectedCompany } = useFavorecidosWorkflowCompany();
  
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showDirectoryDialog, setShowDirectoryDialog] = useState(false);
  
  // Inicializar o step correto baseado se há empresa selecionada no header
  const [currentStep, setCurrentStep] = useState(() => {
    const hasCompany = hasSelectedCompany();
    console.log("Initial step calculation - hasSelectedCompany:", hasCompany);
    return hasCompany ? 1 : 0;
  });
  
  const [cnabFileGenerated, setCnabFileGenerated] = useState(false);
  const [cnabFileName, setCnabFileName] = useState('');
  const [workflow, setWorkflow] = useState({
    convenente: null,
    paymentDate: null,
    serviceType: "Pagamentos Diversos" // Valor padrão
  });

  const updateWorkflow = (field: string, value: any) => {
    console.log("updateWorkflow called with field:", field, "value:", value);
    setWorkflow(prev => {
      const newWorkflow = { ...prev, [field]: value };
      console.log("Updated workflow:", newWorkflow);
      return newWorkflow;
    });
  };

  // Resetar o step quando o dialog é aberto para recalcular baseado no estado atual
  const setShowWorkflowDialogWithStepReset = (show: boolean) => {
    if (show) {
      const hasCompany = hasSelectedCompany();
      console.log("Opening workflow dialog - hasSelectedCompany:", hasCompany);
      setCurrentStep(hasCompany ? 1 : 0);
    }
    setShowWorkflowDialog(show);
  };

  return {
    showWorkflowDialog,
    setShowWorkflowDialog: setShowWorkflowDialogWithStepReset,
    showDirectoryDialog,
    setShowDirectoryDialog,
    currentStep,
    setCurrentStep,
    cnabFileGenerated,
    setCnabFileGenerated,
    cnabFileName,
    setCnabFileName,
    workflow,
    updateWorkflow
  };
};
