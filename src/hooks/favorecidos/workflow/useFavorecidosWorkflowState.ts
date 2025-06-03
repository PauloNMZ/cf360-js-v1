
import { useState } from 'react';
import { useFavorecidosWorkflowCompany } from './useFavorecidosWorkflowCompany';

export const useFavorecidosWorkflowState = () => {
  const { hasSelectedCompany } = useFavorecidosWorkflowCompany();
  
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showDirectoryDialog, setShowDirectoryDialog] = useState(false);
  
  // Começar no step correto baseado se há empresa selecionada
  const [currentStep, setCurrentStep] = useState(() => {
    return hasSelectedCompany() ? 1 : 0;
  });
  
  const [cnabFileGenerated, setCnabFileGenerated] = useState(false);
  const [cnabFileName, setCnabFileName] = useState('');
  const [workflow, setWorkflow] = useState({
    convenente: null,
    paymentDate: null,
    serviceType: "Pagamentos Diversos" // Valor padrão
  });

  const updateWorkflow = (updates: any) => {
    console.log("updateWorkflow called with:", updates);
    setWorkflow(prev => {
      const newWorkflow = { ...prev, ...updates };
      console.log("Updated workflow:", newWorkflow);
      return newWorkflow;
    });
  };

  return {
    showWorkflowDialog,
    setShowWorkflowDialog,
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
