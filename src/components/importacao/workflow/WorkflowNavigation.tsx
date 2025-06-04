
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WorkflowNavigationProps {
  currentStep: number;
  minStep: number;
  totalSteps: number;
  displayStepNumber: number;
  isCurrentStepValid: boolean;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  handleSubmit: () => void;
}

const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  currentStep,
  minStep,
  totalSteps,
  displayStepNumber,
  isCurrentStepValid,
  goToPreviousStep,
  goToNextStep,
  handleSubmit
}) => {
  console.log("WorkflowNavigation render - currentStep:", currentStep, "totalSteps:", totalSteps, "isCurrentStepValid:", isCurrentStepValid);
  
  const handleFinalizarClick = () => {
    console.log("🎯 Finalizar button clicked!");
    console.log("Current step:", currentStep, "Total steps:", totalSteps);
    console.log("Is current step valid:", isCurrentStepValid);
    handleSubmit();
  };

  // Determinar se estamos no último step (considerando que steps vão de 0 a totalSteps-1)
  const isLastStep = currentStep >= totalSteps - 1;
  
  return (
    <div className="flex justify-between items-center mt-4 px-2">
      <div className="text-sm text-gray-500">
        Passo {displayStepNumber} de {totalSteps}
      </div>
      
      <div className="flex items-center gap-3">
        {currentStep > minStep && (
          <Button 
            variant="outline" 
            onClick={goToPreviousStep}
            className="flex items-center px-4"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
        )}
        
        {!isLastStep ? (
          <Button 
            onClick={goToNextStep}
            disabled={!isCurrentStepValid}
            className="flex items-center px-4"
          >
            Avançar
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleFinalizarClick}
            disabled={!isCurrentStepValid}
            className="bg-green-600 hover:bg-green-700 px-6"
          >
            Finalizar
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkflowNavigation;
