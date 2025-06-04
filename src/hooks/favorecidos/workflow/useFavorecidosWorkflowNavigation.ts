
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
  isCurrentStepValid: boolean;
}

export const useFavorecidosWorkflowNavigation = ({
  currentStep,
  setCurrentStep,
  setShowWorkflowDialog,
  workflow
}: UseFavorecidosWorkflowNavigationProps): WorkflowNavigationReturn => {
  
  const getTotalSteps = useCallback(() => {
    return 4; // Total steps: 0(convenente), 1(data), 2(tipo), 3(revisar) = 4 steps
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

  // Compute the validation directly as a boolean value
  const isCurrentStepValid = useMemo(() => {
    console.log("Validating step:", currentStep, "workflow:", { convenente: workflow.convenente, paymentDate: workflow.paymentDate, serviceType: workflow.serviceType });
    
    switch (currentStep) {
      case 0:
        const hasConvenente = !!workflow.convenente;
        console.log("Step 0 validation - hasConvenente:", hasConvenente);
        return hasConvenente;
      case 1:
        const hasPaymentData = !!workflow.paymentDate && !!workflow.serviceType;
        console.log("Step 1 validation - hasPaymentData:", hasPaymentData);
        return hasPaymentData;
      case 2:
        console.log("Step 2 validation - always true (review step)");
        return true; // Review step is always valid
      case 3:
        console.log("Step 3 validation - always true (settings step)");
        return true; // Settings step is always valid
      default:
        console.log("Invalid step:", currentStep);
        return false;
    }
  }, [currentStep, workflow.convenente, workflow.paymentDate, workflow.serviceType]);

  const goToNextStep = useCallback(() => {
    console.log("goToNextStep called - currentStep:", currentStep, "isValid:", isCurrentStepValid);
    if (currentStep < getTotalSteps() - 1 && isCurrentStepValid) {
      console.log("Moving to next step:", currentStep + 1);
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Cannot move to next step - at last step or invalid");
    }
  }, [currentStep, setCurrentStep, getTotalSteps, isCurrentStepValid]);

  const goToPreviousStep = useCallback(() => {
    console.log("goToPreviousStep called - currentStep:", currentStep);
    if (currentStep > 0) {
      console.log("Moving to previous step:", currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  return {
    goToNextStep,
    goToPreviousStep,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle,
    isCurrentStepValid
  };
};
