
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
        
        {currentStep < totalSteps ? (
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
            onClick={handleSubmit}
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
