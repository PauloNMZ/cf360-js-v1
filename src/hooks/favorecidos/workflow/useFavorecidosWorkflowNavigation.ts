
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
  
  const { hasSelectedCompany } = useFavorecidosWorkflowCompany();
  
  const getTotalSteps = () => {
    // Se não há empresa selecionada no header, adiciona step 0 para seleção
    return hasSelectedCompany() ? 4 : 5;
  };

  const getDisplayStepNumber = (step: number) => {
    // Se há empresa no header, pula o step 0
    if (hasSelectedCompany()) {
      return step;
    }
    // Se não há empresa, step 0 é hidden na UI, então mostra step 1, 2, 3, 4
    return step;
  };

  const getStepTitle = () => {
    const hasCompany = hasSelectedCompany();
    
    // Ajustar títulos baseado se há empresa ou não
    if (!hasCompany) {
      switch (currentStep) {
        case 0:
          return "Selecionar Empresa";
        case 1:
          return "Data de Pagamento";
        case 2:
          return "Tipo de Serviço";
        case 3:
          return "Revisar Dados";
        case 4:
          return "Finalizar";
        default:
          return "";
      }
    } else {
      switch (currentStep) {
        case 1:
          return "Data de Pagamento";
        case 2:
          return "Tipo de Serviço";
        case 3:
          return "Revisar Dados";
        case 4:
          return "Finalizar";
        default:
          return "";
      }
    }
  };
  
  const isCurrentStepValid = () => {
    const hasCompany = hasSelectedCompany();
    console.log("Validating step:", currentStep, "hasCompany:", hasCompany, "workflow:", workflow);
    
    if (!hasCompany) {
      switch (currentStep) {
        case 0:
          // Step 0: Seleção de empresa (quando não há empresa no header)
          const hasWorkflowConvenente = !!workflow.convenente;
          console.log("Step 0 validation - hasWorkflowConvenente:", hasWorkflowConvenente);
          return hasWorkflowConvenente;
        case 1:
          // Step 1: Data de Pagamento
          const hasPaymentDate = !!workflow.paymentDate;
          console.log("Step 1 validation - hasPaymentDate:", hasPaymentDate, "paymentDate:", workflow.paymentDate);
          return hasPaymentDate;
        case 2:
          // Step 2: Tipo de Serviço
          const hasServiceType = !!workflow.serviceType;
          console.log("Step 2 validation - hasServiceType:", hasServiceType);
          return hasServiceType;
        case 3:
          // Step 3: Revisar Dados
          return true;
        case 4:
          // Step 4: Finalizar
          return true;
        default:
          return true;
      }
    } else {
      switch (currentStep) {
        case 1:
          // Step 1: Data de Pagamento (empresa já selecionada no header)
          const hasPaymentDate = !!workflow.paymentDate;
          console.log("Step 1 validation (with company) - hasPaymentDate:", hasPaymentDate, "paymentDate:", workflow.paymentDate);
          return hasPaymentDate;
        case 2:
          // Step 2: Tipo de Serviço
          const hasServiceType = !!workflow.serviceType;
          console.log("Step 2 validation (with company) - hasServiceType:", hasServiceType);
          return hasServiceType;
        case 3:
          // Step 3: Revisar Dados
          return true;
        case 4:
          // Step 4: Finalizar
          return true;
        default:
          return true;
      }
    }
  };

  const goToNextStep = () => {
    const isValid = isCurrentStepValid();
    const maxStep = getTotalSteps();
    
    console.log("goToNextStep called - isValid:", isValid, "currentStep:", currentStep, "maxStep:", maxStep);
    
    if (isValid && currentStep < maxStep) {
      console.log("Moving to next step:", currentStep + 1);
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Cannot go to next step - validation failed or at max step");
      if (!isValid) {
        console.log("Validation details - workflow:", workflow);
      }
    }
  };

  const goToPreviousStep = () => {
    const hasCompany = hasSelectedCompany();
    const minStep = hasCompany ? 1 : 0;
    
    if (currentStep > minStep) {
      console.log("Going to previous step:", currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    isCurrentStepValid,
    goToNextStep,
    goToPreviousStep,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle
  };
};
