
import { useCallback, useMemo } from 'react';

interface UseFavorecidosWorkflowNavigationProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setShowWorkflowDialog: (show: boolean) => void;
  workflow: any;
}

interface WorkflowNavigationReturn {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  getTotalSteps: () => number;
  getDisplayStepNumber: (step: number) => number;
  getStepTitle: (step: number) => string;
  isCurrentStepValid: boolean; // Explicitamente boolean, não função
}

export const useFavorecidosWorkflowNavigation = ({
  currentStep,
  setCurrentStep,
  setShowWorkflowDialog,
  workflow
}: UseFavorecidosWorkflowNavigationProps): WorkflowNavigationReturn => {
  
  const getTotalSteps = useCallback(() => {
    return 4; // Total steps in the workflow
  }, []);

  const getDisplayStepNumber = useCallback((step: number) => {
    return step + 1; // Display step numbers starting from 1
  }, []);

  const getStepTitle = useCallback((step: number) => {
    const titles = [
      'Selecionar Convenente',
      'Configurar Pagamento', 
      'Revisar Dados',
      'Configurações'
    ];
    return titles[step] || 'Etapa Desconhecida';
  }, []);

  // Calculado como valor boolean direto
  const isCurrentStepValid = useMemo((): boolean => {
    switch (currentStep) {
      case 0:
        return !!workflow.convenente;
      case 1:
        return !!workflow.paymentDate && !!workflow.serviceType;
      case 2:
        return true; // Review step is always valid
      case 3:
        return true; // Settings step is always valid
      default:
        return false;
    }
  }, [currentStep, workflow]);

  const goToNextStep = useCallback(() => {
    if (currentStep < getTotalSteps() - 1 && isCurrentStepValid) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, setCurrentStep, getTotalSteps, isCurrentStepValid]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  return {
    goToNextStep,
    goToPreviousStep,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle,
    isCurrentStepValid // Retorna o valor boolean calculado
  };
};
