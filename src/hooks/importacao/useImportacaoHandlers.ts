
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
    console.log("useImportacaoHandlers - handleGenerateReport chamado");
    console.log("useImportacaoHandlers - cnabFileGenerated:", processWorkflow.cnabFileGenerated);
    
    const { companyName, companyCnpj } = getCompanyInfo();
    
    await pdfReportWithEmail.handleGenerateReport(
      tableOps.getSelectedRows(),
      processWorkflow.cnabFileGenerated,
      processWorkflow.cnabFileName,
      companyName,
      validateFavorecidos,
      processWorkflow.workflow.convenente ? 
        convenentesData.convenentes.find(c => c.id === processWorkflow.workflow.convenente) : 
        selectedConvenente,
      companyCnpj
    );
  };

  return {
    handleProcessar,
    handleVerifyErrors,
    handleProcessSelected,
    handleGenerateReport
  };
};
