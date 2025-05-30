
import { useIndexPageContext } from '../useIndexPageContext';

export const useImportacaoCompany = (
  selectedConvenente: any,
  convenentesData: any,
  processWorkflow: any
) => {
  const { selectedHeaderCompany } = useIndexPageContext();

  const getCompanyInfo = () => {
    let companyName = "Empresa";
    let companyCnpj = "";
    
    console.log("useImportacaoCompany - Debug company sources:");
    console.log("  - selectedHeaderCompany:", selectedHeaderCompany);
    console.log("  - selectedConvenente:", selectedConvenente);
    console.log("  - processWorkflow.workflow.convenente:", processWorkflow.workflow.convenente);
    
    // Priority 1: Header-selected company (from context)
    if (selectedHeaderCompany) {
      console.log("useImportacaoCompany - Using header company:", selectedHeaderCompany);
      companyName = selectedHeaderCompany.razaoSocial;
      companyCnpj = selectedHeaderCompany.cnpj || "";
    }
    // Priority 2: Globally selected convenente (from context)
    else if (selectedConvenente && selectedConvenente.razaoSocial) {
      console.log("useImportacaoCompany - Using selected convenente:", selectedConvenente);
      companyName = selectedConvenente.razaoSocial;
      companyCnpj = selectedConvenente.cnpj || "";
    }
    // Priority 3: Workflow-selected convenente
    else if (processWorkflow.workflow.convenente) {
      const workflowConvenente = convenentesData.convenentes.find(
        c => c.id === processWorkflow.workflow.convenente
      );
      if (workflowConvenente) {
        console.log("useImportacaoCompany - Using workflow convenente:", workflowConvenente);
        companyName = workflowConvenente.razaoSocial;
        companyCnpj = workflowConvenente.cnpj || "";
      }
    }
    
    console.log("useImportacaoCompany - Final company values:");
    console.log("  - companyName:", companyName);
    console.log("  - companyCnpj:", companyCnpj);
    
    return { companyName, companyCnpj };
  };

  return { getCompanyInfo };
};
