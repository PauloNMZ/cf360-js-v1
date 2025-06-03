
import { useFavorecidosWorkflowCompany } from './useFavorecidosWorkflowCompany';

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
  
  const { hasSelectedCompany, getSelectedCompany } = useFavorecidosWorkflowCompany();
  
  const isCurrentStepValid = () => {
    console.log("Validating step:", currentStep, "workflow:", workflow);
    
    switch (currentStep) {
      case 1:
        // Step 1: Selecionar Empresa - check header company or workflow convenente
        const hasHeaderCompany = hasSelectedCompany();
        const hasWorkflowConvenente = !!workflow.convenente;
        const isValid = hasHeaderCompany || hasWorkflowConvenente;
        console.log("Step 1 validation - hasHeaderCompany:", hasHeaderCompany, "hasWorkflowConvenente:", hasWorkflowConvenente, "isValid:", isValid);
        return isValid;
      case 2:
        // Step 2: Configurar Pagamento (Data de Pagamento)
        const hasPaymentDate = !!workflow.paymentDate;
        console.log("Step 2 validation - hasPaymentDate:", hasPaymentDate, "paymentDate:", workflow.paymentDate);
        return hasPaymentDate;
      case 3:
        // Step 3: Revisar Dados
        console.log("Step 3 validation - always valid");
        return true;
      case 4:
        // Step 4: Finalizar
        console.log("Step 4 validation - always valid");
        return true;
      default:
        console.log("Default step validation - always valid");
        return true;
    }
  };

  const goToNextStep = () => {
    const isValid = isCurrentStepValid();
    console.log("goToNextStep - isValid:", isValid, "currentStep:", currentStep);
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Cannot go to next step - validation failed");
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      console.log("Going to previous step:", currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    isCurrentStepValid,
    goToNextStep,
    goToPreviousStep
  };
};
