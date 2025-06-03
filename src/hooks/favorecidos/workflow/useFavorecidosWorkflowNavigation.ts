
interface UseFavorecidosWorkflowNavigationProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setShowWorkflowDialog: (show: boolean) => void;
  workflow: any;
}

export const useFavorecidosWorkflowNavigation = ({
  currentStep,
  setCurrentStep,
  setShowWorkflowDialog,
  workflow
}: UseFavorecidosWorkflowNavigationProps) => {
  
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!workflow.convenente;
      case 2:
        return !!workflow.paymentDate;
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (isCurrentStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    isCurrentStepValid,
    goToNextStep,
    goToPreviousStep
  };
};
