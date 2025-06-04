
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
  isCurrentStepValid: boolean; // CORRIGIDO: Agora é boolean direto, não função
}

export const useFavorecidosWorkflowNavigation = ({
  currentStep,
  setCurrentStep,
  setShowWorkflowDialog,
  workflow
}: UseFavorecidosWorkflowNavigationProps): WorkflowNavigationReturn => {
  
  const getTotalSteps = useCallback(() => {
    return 5; // Total steps: 0(convenente), 1(data), 2(tipo), 3(envio), 4(revisar) = 5 steps (0-4)
  }, []);

  const getDisplayStepNumber = useCallback((step: number) => {
    return step + 1; // Display step numbers starting from 1
  }, []);

  const getStepTitle = useCallback((step: number) => {
    const titles = [
      'Selecionar Convenente',
      'Configurar data de Pagamento', 
      'Tipo de serviço',
      'Método de Envio',
      'Revisão de Dados'
    ];
    return titles[step] || 'Etapa Desconhecida';
  }, []);

  // CORRIGIDO: Retorna diretamente o valor boolean em vez de função
  const isCurrentStepValid = useMemo(() => {
    console.log("🔍 Validating step:", currentStep, "workflow state:", { 
      convenente: workflow.convenente, 
      paymentDate: workflow.paymentDate, 
      serviceType: workflow.serviceType 
    });
    
    let isValid = false;
    
    switch (currentStep) {
      case 0:
        isValid = !!workflow.convenente;
        console.log("Step 0 validation - hasConvenente:", isValid, "convenente:", workflow.convenente);
        break;
      case 1:
        isValid = !!workflow.paymentDate;
        console.log("Step 1 validation - hasPaymentDate:", isValid, "paymentDate:", workflow.paymentDate);
        break;
      case 2:
        isValid = !!workflow.serviceType;
        console.log("Step 2 validation - hasServiceType:", isValid, "serviceType:", workflow.serviceType);
        break;
      case 3:
        isValid = true; // Send method step is always valid
        console.log("Step 3 validation - always true (send method step)");
        break;
      case 4:
        isValid = true; // Review step is always valid
        console.log("Step 4 validation - always true (review step)");
        break;
      default:
        isValid = false;
        console.log("Invalid step:", currentStep);
        break;
    }
    
    console.log("🎯 Final validation result for step", currentStep, ":", isValid);
    return isValid;
  }, [currentStep, workflow.convenente, workflow.paymentDate, workflow.serviceType]);

  const goToNextStep = useCallback(() => {
    console.log("🔄 goToNextStep called - currentStep:", currentStep, "isValid:", isCurrentStepValid);
    if (currentStep < getTotalSteps() - 1 && isCurrentStepValid) {
      console.log("✅ Moving to next step:", currentStep + 1);
      setCurrentStep(currentStep + 1);
    } else {
      console.log("❌ Cannot move to next step - at last step or invalid");
    }
  }, [currentStep, setCurrentStep, getTotalSteps, isCurrentStepValid]);

  const goToPreviousStep = useCallback(() => {
    console.log("🔄 goToPreviousStep called - currentStep:", currentStep);
    if (currentStep > 0) {
      console.log("✅ Moving to previous step:", currentStep - 1);
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  return {
    goToNextStep,
    goToPreviousStep,
    getTotalSteps,
    getDisplayStepNumber,
    getStepTitle,
    isCurrentStepValid // CORRIGIDO: Agora retorna valor boolean direto
  };
};
