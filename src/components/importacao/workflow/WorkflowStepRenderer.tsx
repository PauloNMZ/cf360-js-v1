
import React from 'react';
import StepZero from '../workflow-steps/StepZero';
import StepOne from '../workflow-steps/StepOne';
import StepTwo from '../workflow-steps/StepTwo';
import StepThree from '../workflow-steps/StepThree';
import StepFour from '../workflow-steps/StepFour';
import { CNABWorkflowData } from '@/types/cnab240';

interface WorkflowStepRendererProps {
  currentStep: number;
  hasSelectedCompany: boolean;
  workflow: CNABWorkflowData;
  updateWorkflow: (field: keyof CNABWorkflowData, value: any) => void;
  convenentes: any[];
  carregandoConvenentes: boolean;
  selectedCompany?: any;
}

const WorkflowStepRenderer: React.FC<WorkflowStepRendererProps> = ({
  currentStep,
  hasSelectedCompany,
  workflow,
  updateWorkflow,
  convenentes,
  carregandoConvenentes,
  selectedCompany
}) => {
  console.log("WorkflowStepRenderer - currentStep:", currentStep, "hasSelectedCompany:", hasSelectedCompany);

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

  // Mapear steps considerando se há empresa ou não - MÁXIMO 4 para effectiveStep
  const effectiveStep = hasSelectedCompany ? currentStep - 1 : currentStep - 1;
  console.log("Effective step:", effectiveStep);
  
  // IMPORTANTE: Limitar effectiveStep a máximo 4 (que corresponde ao passo 5)
  if (effectiveStep > 4) {
    console.log("effectiveStep beyond limit, not rendering");
    return null;
  }
  
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

export default WorkflowStepRenderer;
