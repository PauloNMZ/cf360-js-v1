
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
    
    console.log("=== DEBUG useImportacaoCompany - getCompanyInfo ===");
    console.log("1. selectedHeaderCompany from context:", selectedHeaderCompany);
    console.log("2. selectedConvenente:", selectedConvenente);
    console.log("3. convenentesData:", convenentesData);
    console.log("4. processWorkflow.workflow:", processWorkflow?.workflow);
    console.log("5. processWorkflow.workflow.convenente:", processWorkflow?.workflow?.convenente);
    
    // Priority 1: Header-selected company (from context)
    if (selectedHeaderCompany && selectedHeaderCompany.razaoSocial) {
      console.log("✅ Using selectedHeaderCompany:", selectedHeaderCompany);
      companyName = selectedHeaderCompany.razaoSocial;
      companyCnpj = selectedHeaderCompany.cnpj || "";
    }
    // Priority 2: Selected convenente from props
    else if (selectedConvenente && selectedConvenente.razaoSocial) {
      console.log("✅ Using selectedConvenente:", selectedConvenente);
      companyName = selectedConvenente.razaoSocial;
      companyCnpj = selectedConvenente.cnpj || "";
    }
    // Priority 3: Workflow-selected convenente
    else if (processWorkflow?.workflow?.convenente && convenentesData?.convenentes) {
      const workflowConvenente = convenentesData.convenentes.find(
        c => c.id === processWorkflow.workflow.convenente
      );
      if (workflowConvenente && workflowConvenente.razaoSocial) {
        console.log("✅ Using workflow convenente:", workflowConvenente);
        companyName = workflowConvenente.razaoSocial;
        companyCnpj = workflowConvenente.cnpj || "";
      } else {
        console.log("❌ Workflow convenente not found or invalid");
      }
    }
    // Priority 4: First convenente from convenentesData as fallback
    else if (convenentesData?.convenentes && convenentesData.convenentes.length > 0) {
      const firstConvenente = convenentesData.convenentes[0];
      if (firstConvenente && firstConvenente.razaoSocial) {
        console.log("✅ Using first convenente as fallback:", firstConvenente);
        companyName = firstConvenente.razaoSocial;
        companyCnpj = firstConvenente.cnpj || "";
      }
    }
    else {
      console.log("❌ No valid company data found, using defaults");
    }
    
    console.log("=== FINAL RESULT ===");
    console.log("companyName:", companyName);
    console.log("companyCnpj:", companyCnpj);
    console.log("========================");
    
    return { companyName, companyCnpj };
  };

  return { getCompanyInfo };
};
