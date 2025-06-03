
import { useState } from 'react';

export const useFavorecidosWorkflowState = () => {
  const [showWorkflowDialog, setShowWorkflowDialog] = useState(false);
  const [showDirectoryDialog, setShowDirectoryDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [cnabFileGenerated, setCnabFileGenerated] = useState(false);
  const [cnabFileName, setCnabFileName] = useState('');
  const [workflow, setWorkflow] = useState({
    convenente: null,
    paymentDate: null // Inicializar como null para permitir validação correta
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
