
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarIcon,
  Banknote,
  CreditCard,
  Coins,
  PiggyBank,
  QrCode,
  Download,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkflowDialogProps } from '@/types/importacao';

// Individual step components
import StepOne from './workflow-steps/StepOne';
import StepTwo from './workflow-steps/StepTwo';
import StepThree from './workflow-steps/StepThree';
import StepFour from './workflow-steps/StepFour';

interface ExtendedWorkflowDialogProps extends WorkflowDialogProps {
  getTotalSteps?: () => number;
  getDisplayStepNumber?: (step: number) => number;
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
  const displayStepNumber = getDisplayStepNumber ? getDisplayStepNumber(currentStep) : currentStep;
  const stepTitle = getStepTitle ? getStepTitle() : getDefaultStepTitle();

  // Default step title function
  function getDefaultStepTitle() {
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
  }

  // Log current state for debugging
  console.log("WorkflowDialog - currentStep:", currentStep, "workflow:", workflow, "isValid:", typeof isCurrentStepValid === 'function' ? isCurrentStepValid() : isCurrentStepValid);

  // Render step content with correct mapping
  const renderStepContent = () => {
    // Se não há empresa selecionada, step 0 é seleção de empresa
    if (!hasSelectedCompany && currentStep === 0) {
      return (
        <StepThree 
          workflow={workflow} 
          updateWorkflow={updateWorkflow} 
          convenentes={convenentes}
          carregandoConvenentes={carregandoConvenentes}
          hasSelectedCompany={hasSelectedCompany}
          selectedCompany={selectedCompany}
        />
      );
    }

    // Mapear steps considerando se há empresa ou não
    const effectiveStep = hasSelectedCompany ? currentStep : currentStep - 1;
    
    switch (effectiveStep) {
      case 0: // Data de Pagamento
        return <StepOne workflow={workflow} updateWorkflow={updateWorkflow} />;
      case 1: // Tipo de Serviço  
        return <StepTwo workflow={workflow} updateWorkflow={updateWorkflow} />;
      case 2: // Revisar Dados
        return <StepOne workflow={workflow} updateWorkflow={updateWorkflow} />;
      case 3: // Finalizar
        return (
          <StepFour 
            workflow={workflow} 
            updateWorkflow={updateWorkflow}
          />
        );
      default:
        return null;
    }
  };

  const isStepValid = typeof isCurrentStepValid === 'function' ? isCurrentStepValid() : isCurrentStepValid;
  const minStep = hasSelectedCompany ? 1 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{stepTitle}</DialogTitle>
        </DialogHeader>
        
        {/* Step Content */}
        {renderStepContent()}
        
        {/* Step Navigation */}
        <DialogFooter className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            Passo {displayStepNumber} de {actualTotalSteps}
          </div>
          <div className="space-x-2">
            {currentStep > minStep && (
              <Button 
                variant="outline" 
                onClick={goToPreviousStep}
                className="flex items-center"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Voltar
              </Button>
            )}
            
            {currentStep < actualTotalSteps ? (
              <Button 
                onClick={goToNextStep}
                disabled={!isStepValid}
                className="flex items-center"
              >
                Avançar
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700"
              >
                Enviar
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowDialog;
