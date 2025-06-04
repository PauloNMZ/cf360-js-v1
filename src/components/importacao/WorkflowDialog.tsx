
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { WorkflowDialogProps } from '@/types/importacao';

// Individual step components
import StepZero from './workflow-steps/StepZero';
import StepOne from './workflow-steps/StepOne';
import StepTwo from './workflow-steps/StepTwo';
import StepThree from './workflow-steps/StepThree';
import StepFour from './workflow-steps/StepFour';

interface ExtendedWorkflowDialogProps extends WorkflowDialogProps {
  getTotalSteps?: () => number;
  getDisplayStepNumber?: () => number;
  getStepTitle?: () => string;
  hasSelectedCompany?: boolean;
  selectedCompany?: any;
}

const WorkflowDialog: React.FC<ExtendedWorkflowDialogProps> = ({
  isOpen,
  onOpenChange,
  workflow,
  updateWorkflow,
  currentStep,
  totalSteps,
  goToNextStep,
  goToPreviousStep,
  handleSubmit,
  isCurrentStepValid,
  convenentes,
  carregandoConvenentes,
  getTotalSteps,
  getDisplayStepNumber,
  getStepTitle,
  hasSelectedCompany = false,
  selectedCompany = null
}) => {
  // Use custom functions if provided, otherwise fallback to defaults
  const actualTotalSteps = getTotalSteps ? getTotalSteps() : totalSteps;
  const displayStepNumber = getDisplayStepNumber ? getDisplayStepNumber() : currentStep;
  const stepTitle = getStepTitle ? getStepTitle() : getDefaultStepTitle();

  console.log("WorkflowDialog render - currentStep:", currentStep, "hasSelectedCompany:", hasSelectedCompany, "displayStepNumber:", displayStepNumber);

  // Default step title function
  function getDefaultStepTitle() {
    if (hasSelectedCompany) {
      switch (currentStep) {
        case 1:
          return "Data de Pagamento";
        case 2:
          return "Tipo de Serviço";
        case 3:
          return "Método de Envio";
        case 4:
          return "Revisar Dados";
        default:
          return "";
      }
    } else {
      switch (currentStep) {
        case 0:
          return "Selecionar Empresa";
        case 1:
          return "Data de Pagamento";
        case 2:
          return "Tipo de Serviço";
        case 3:
          return "Método de Envio";
        case 4:
          return "Revisar Dados";
        default:
          return "";
      }
    }
  }

  // Render step content with correct mapping
  const renderStepContent = () => {
    console.log("renderStepContent - currentStep:", currentStep, "hasSelectedCompany:", hasSelectedCompany);
    
    // Se não há empresa selecionada, step 0 é seleção de empresa
    if (!hasSelectedCompany && currentStep === 0) {
      console.log("Rendering StepZero (company selection)");
      return (
        <StepZero 
          workflow={workflow} 
          updateWorkflow={updateWorkflow} 
          convenentes={convenentes}
          carregandoConvenentes={carregandoConvenentes}
        />
      );
    }

    // Mapear steps considerando se há empresa ou não
    const effectiveStep = hasSelectedCompany ? currentStep : currentStep - 1;
    console.log("Effective step:", effectiveStep);
    
    switch (effectiveStep) {
      case 0: // Data de Pagamento
        console.log("Rendering StepOne (payment date)");
        return <StepOne workflow={workflow} updateWorkflow={updateWorkflow} />;
      case 1: // Tipo de Serviço  
        console.log("Rendering StepTwo (service type)");
        return <StepTwo workflow={workflow} updateWorkflow={updateWorkflow} />;
      case 2: // Método de Envio
        console.log("Rendering StepThree (send method)");
        return <StepThree workflow={workflow} updateWorkflow={updateWorkflow} />;
      case 3: // Revisar Dados
        console.log("Rendering StepFour (review data)");
        return (
          <StepFour 
            workflow={workflow} 
            updateWorkflow={updateWorkflow}
            hasSelectedCompany={hasSelectedCompany}
            selectedCompany={selectedCompany}
          />
        );
      default:
        console.log("No step to render for effectiveStep:", effectiveStep);
        return null;
    }
  };

  const minStep = hasSelectedCompany ? 1 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{stepTitle}</DialogTitle>
        </DialogHeader>
        
        {/* Step Content - removida barra de rolagem desnecessária */}
        <div className="py-4">
          {renderStepContent()}
        </div>
        
        {/* Step Navigation with better button positioning */}
        <DialogFooter className="flex justify-between items-center mt-4 px-2">
          <div className="text-sm text-gray-500">
            Passo {displayStepNumber} de {actualTotalSteps}
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
            
            {currentStep < actualTotalSteps ? (
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowDialog;
