
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

const WorkflowDialog: React.FC<WorkflowDialogProps> = ({
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
  carregandoConvenentes
}) => {
  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Data de Pagamento";
      case 2:
        return "Tipo de Serviço";
      case 3:
        return "Selecionar Convenente";
      case 4:
        return "Método de Envio";
      default:
        return "";
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepOne workflow={workflow} updateWorkflow={updateWorkflow} />;
      case 2:
        return <StepTwo workflow={workflow} updateWorkflow={updateWorkflow} />;
      case 3:
        return (
          <StepThree 
            workflow={workflow} 
            updateWorkflow={updateWorkflow} 
            convenentes={convenentes}
            carregandoConvenentes={carregandoConvenentes}
          />
        );
      case 4:
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getStepTitle()}</DialogTitle>
        </DialogHeader>
        
        {/* Step Content */}
        {renderStepContent()}
        
        {/* Step Navigation */}
        <DialogFooter className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            Passo {currentStep} de {totalSteps}
          </div>
          <div className="space-x-2">
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={goToPreviousStep}
                className="flex items-center"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Voltar
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button 
                onClick={goToNextStep}
                disabled={!isCurrentStepValid()}
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
