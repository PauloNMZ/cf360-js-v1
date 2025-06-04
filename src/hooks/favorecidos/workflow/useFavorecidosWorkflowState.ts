
import { useState } from 'react';
import { useFavorecidosWorkflowCompany } from './useFavorecidosWorkflowCompany';

export const useFavorecidosWorkflowState = () => {
  const { hasSelectedCompany } = useFavorecidosWorkflowCompany();
  
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showDirectoryDialog, setShowDirectoryDialog] = useState(false);
  
  // Função para calcular o step inicial correto
  const calculateInitialStep = () => {
    const hasCompany = hasSelectedCompany();
    console.log("calculateInitialStep - hasSelectedCompany:", hasCompany);
    return hasCompany ? 1 : 0;
  };
  
  // Inicializar o step correto baseado se há empresa selecionada no header
  const [currentStep, setCurrentStep] = useState(calculateInitialStep);
  
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
      const initialStep = calculateInitialStep();
      console.log("Opening workflow dialog - setting initial step to:", initialStep);
      setCurrentStep(initialStep);
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
