
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { WorkflowDialogProps, RowData } from '@/types/importacao';
import WorkflowStepRenderer from './workflow/WorkflowStepRenderer';
import WorkflowNavigation from './workflow/WorkflowNavigation';

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

  // Default step title function - ATUALIZADO com novos títulos
  function getDefaultStepTitle() {
    if (hasSelectedCompany) {
      switch (currentStep) {
        case 1:
          return "Configurar data de Pagamento";
        case 2:
          return "Tipo de serviço";
        case 3:
          return "Método de Envio";
        case 4:
          return "Revisão de Dados";
        default:
          return "";
      }
    } else {
      switch (currentStep) {
        case 0:
          return "Selecionar Empresa";
        case 1:
          return "Configurar data de Pagamento";
        case 2:
          return "Tipo de serviço";
        case 3:
          return "Método de Envio";
        case 4:
          return "Revisão de Dados";
        default:
          return "";
      }
    }
  }

  // UPDATED: Criar wrapper que seja compatível com a interface original
  const handleSubmitWrapper = () => {
    // TODO: Aqui precisamos passar os selectedRows corretos
    // Por ora, passamos um array vazio para manter compatibilidade
    handleSubmit([]);
  };

  const minStep = hasSelectedCompany ? 1 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{stepTitle}</DialogTitle>
        </DialogHeader>
        
        {/* Step Content */}
        <div className="py-4">
          <WorkflowStepRenderer
            currentStep={currentStep}
            hasSelectedCompany={hasSelectedCompany}
            workflow={workflow}
            updateWorkflow={updateWorkflow}
            convenentes={convenentes}
            carregandoConvenentes={carregandoConvenentes}
            selectedCompany={selectedCompany}
          />
        </div>
        
        {/* Step Navigation */}
        <DialogFooter>
          <WorkflowNavigation
            currentStep={currentStep}
            minStep={minStep}
            totalSteps={actualTotalSteps}
            displayStepNumber={displayStepNumber}
            isCurrentStepValid={isCurrentStepValid}
            goToPreviousStep={goToPreviousStep}
            goToNextStep={goToNextStep}
            handleSubmit={handleSubmitWrapper}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowDialog;
