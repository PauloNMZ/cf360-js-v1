
import { validateFavorecidos } from '@/services/cnab240/validationService';

export const useImportacaoHandlers = (
  fileImport: any,
  tableOps: any,
  validationDialog: any,
  processWorkflow: any,
  pdfReportWithEmail: any,
  convenentesData: any,
  selectedConvenente: any,
  getCompanyInfo: () => { companyName: string; companyCnpj: string },
  setShowTable: (show: boolean) => void
) => {
  // Handle initial processing
  const handleProcessar = () => {
    console.log("useImportacaoHandlers - handleProcessar chamado");
    const result = fileImport.handleProcessar();
    if (result) {
      setShowTable(true);
      validationDialog.setValidationPerformed(false); // Reset validation status when new data is processed
      validationDialog.setValidationErrors([]);
    }
  };

  // Wrapper for verify errors function
  const handleVerifyErrors = () => {
    console.log("useImportacaoHandlers - handleVerifyErrors chamado");
    console.log("useImportacaoHandlers - tableOps.tableData length:", tableOps.tableData.length);
    console.log("useImportacaoHandlers - validateFavorecidos function:", typeof validateFavorecidos);
    validationDialog.handleVerifyErrors(validateFavorecidos, tableOps.tableData);
  };

  // Handle process selected function
  const handleProcessSelected = () => {
    console.log("useImportacaoHandlers - handleProcessSelected chamado");
    console.log("useImportacaoHandlers - selected rows:", tableOps.getSelectedRows().length);
    processWorkflow.handleProcessSelected();
  };
  
  // Handle PDF report generation
  const handleGenerateReport = async () => {
    console.log("=== DEBUG useImportacaoHandlers - handleGenerateReport ===");
    console.log("cnabFileGenerated:", processWorkflow.cnabFileGenerated);
    console.log("selected rows count:", tableOps.getSelectedRows().length);
    console.log("workflow paymentDate:", processWorkflow.workflow.paymentDate);
    
    // Get company info using the improved function
    const { companyName, companyCnpj } = getCompanyInfo();
    console.log("Company info from getCompanyInfo:");
    console.log("  - companyName:", companyName);
    console.log("  - companyCnpj:", companyCnpj);
    
    // Determine the convenente to use
    let convenenteToUse = null;
    
    if (processWorkflow.workflow.convenente && convenentesData?.convenentes) {
      convenenteToUse = convenentesData.convenentes.find(c => c.id === processWorkflow.workflow.convenente);
      console.log("Found workflow convenente:", convenenteToUse);
    } else if (selectedConvenente) {
      convenenteToUse = selectedConvenente;
      console.log("Using selected convenente:", convenenteToUse);
    }
    
    console.log("Final convenente to use:", convenenteToUse);
    console.log("Payment date to use:", processWorkflow.workflow.paymentDate);
    
    await pdfReportWithEmail.handleGenerateReport(
      tableOps.getSelectedRows(),
      processWorkflow.cnabFileGenerated,
      processWorkflow.cnabFileName,
      companyName,
      validateFavorecidos,
      convenenteToUse,
      companyCnpj,
      processWorkflow.workflow.paymentDate
    );
  };

  return {
    handleProcessar,
    handleVerifyErrors,
    handleProcessSelected,
    handleGenerateReport
  };
};
