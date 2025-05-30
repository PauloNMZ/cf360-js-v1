import { useState, useEffect } from 'react';
import { validateFavorecidos } from '@/services/cnab240/validationService';

// Import smaller hooks
import { useFileImport } from './importacao/useFileImport';
import { useTableOperations } from './importacao/useTableOperations';
import { useValidationDialog } from './importacao/useValidationDialog';
import { useConvenentesData } from './importacao/useConvenentesData';
import { usePDFReportWithEmail } from './importacao/usePDFReportWithEmail';
import { useProcessWorkflow } from './importacao/useProcessWorkflow';
import { useIndexPageContext } from './useIndexPageContext';

export const useImportacao = () => {
  const [showTable, setShowTable] = useState(false);
  
  // Get current selected convenente info from context
  const { currentConvenenteId, formData } = useIndexPageContext();
  const hasSelectedConvenente = !!(currentConvenenteId && formData);
  const selectedConvenente = hasSelectedConvenente ? {
    id: currentConvenenteId,
    ...formData
  } : null;
  
  // Import functionality from smaller hooks
  const fileImport = useFileImport();
  const tableOps = useTableOperations(fileImport.tableData);
  const convenentesData = useConvenentesData();
  const validationDialog = useValidationDialog();
  const pdfReportWithEmail = usePDFReportWithEmail();
  const processWorkflow = useProcessWorkflow(tableOps.getSelectedRows, {
    selectedConvenente,
    hasSelectedConvenente
  });

  // Sync tableData with the fileImport tableData when it changes
  useEffect(() => {
    if (fileImport.tableData.length > 0) {
      tableOps.setTableData(fileImport.tableData);
    }
  }, [fileImport.tableData]);

  // Update directory in workflow when output directory changes
  useEffect(() => {
    processWorkflow.updateWorkflow('outputDirectory', processWorkflow.workflow.outputDirectory);
  }, [processWorkflow.workflow.outputDirectory]);

  // Handle initial processing
  const handleProcessar = () => {
    console.log("useImportacao - handleProcessar chamado");
    const result = fileImport.handleProcessar();
    if (result) {
      setShowTable(true);
      validationDialog.setValidationPerformed(false); // Reset validation status when new data is processed
      validationDialog.setValidationErrors([]);
    }
  };

  // Wrapper for verify errors function
  const handleVerifyErrors = () => {
    console.log("useImportacao - handleVerifyErrors chamado");
    console.log("useImportacao - tableOps.tableData length:", tableOps.tableData.length);
    console.log("useImportacao - validateFavorecidos function:", typeof validateFavorecidos);
    validationDialog.handleVerifyErrors(validateFavorecidos, tableOps.tableData);
  };

  // Handle process selected function
  const handleProcessSelected = () => {
    console.log("useImportacao - handleProcessSelected chamado");
    console.log("useImportacao - selected rows:", tableOps.getSelectedRows().length);
    processWorkflow.handleProcessSelected();
  };
  
  // Handle PDF report generation
  const handleGenerateReport = async () => {
    console.log("useImportacao - handleGenerateReport chamado");
    console.log("useImportacao - cnabFileGenerated:", processWorkflow.cnabFileGenerated);
    
    // Get company name and CNPJ if available
    let companyName = "Empresa";
    let companyCnpj = "";
    
    // First check if there's a globally selected company (from context)
    if (selectedConvenente && selectedConvenente.razaoSocial) {
      companyName = selectedConvenente.razaoSocial;
      companyCnpj = selectedConvenente.cnpj || "";
    }
    // Otherwise, check if there's a convenente selected in the workflow
    else if (processWorkflow.workflow.convenente) {
      const workflowConvenente = convenentesData.convenentes.find(
        c => c.id === processWorkflow.workflow.convenente
      );
      if (workflowConvenente) {
        companyName = workflowConvenente.razaoSocial;
        companyCnpj = workflowConvenente.cnpj || "";
      }
    }
    
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
    // File related props and methods
    file: fileImport.file,
    loading: fileImport.loading,
    planilhaData: fileImport.planilhaData,
    errorMessage: fileImport.errorMessage,
    handleFileChange: fileImport.handleFileChange,
    
    // Table related props and methods
    tableData: tableOps.tableData,
    selectAll: tableOps.selectAll,
    total: tableOps.total,
    handleSelectAll: tableOps.handleSelectAll,
    handleSelectRow: tableOps.handleSelectRow,
    handleDeleteRow: tableOps.handleDeleteRow,
    
    // UI state
    showTable,
    setShowTable,
    
    // Validation dialog states and methods
    showValidationDialog: validationDialog.showValidationDialog,
    setShowValidationDialog: validationDialog.setShowValidationDialog,
    validationErrors: validationDialog.validationErrors,
    validationPerformed: validationDialog.validationPerformed,
    hasValidationErrors: validationDialog.validationErrors.length > 0,
    handleVerifyErrors,
    handleExportErrors: validationDialog.handleExportErrors,
    
    // Process handlers
    handleProcessar,
    handleProcessSelected,
    handleGenerateReport,
    // Use the simpler version for PDFPreviewDialog
    handleSendEmailReport: pdfReportWithEmail.handleSendEmailReport,
    // Keep the parameterized version for other usages
    handleSendEmailReportWithParams: pdfReportWithEmail.handleSendEmailReportWithParams,
    handleEmailSubmit: pdfReportWithEmail.handleEmailSubmit,
    handleSubmitWorkflow: processWorkflow.handleSubmitWorkflow,
    
    // PDF preview state
    showPDFPreviewDialog: pdfReportWithEmail.showPDFPreviewDialog,
    setShowPDFPreviewDialog: pdfReportWithEmail.setShowPDFPreviewDialog,
    reportData: pdfReportWithEmail.reportData,
    
    // Email and report dialog states
    showEmailConfigDialog: pdfReportWithEmail.showEmailConfigDialog,
    setShowEmailConfigDialog: pdfReportWithEmail.setShowEmailConfigDialog,
    defaultEmailMessage: pdfReportWithEmail.defaultEmailMessage,
    reportDate: pdfReportWithEmail.reportDate,
    
    // Workflow dialog related props and methods
    showWorkflowDialog: processWorkflow.showWorkflowDialog,
    setShowWorkflowDialog: processWorkflow.setShowWorkflowDialog,
    currentStep: processWorkflow.currentStep,
    workflow: processWorkflow.workflow,
    goToNextStep: processWorkflow.goToNextStep,
    goToPreviousStep: processWorkflow.goToPreviousStep,
    updateWorkflow: processWorkflow.updateWorkflow,
    isCurrentStepValid: processWorkflow.isCurrentStepValid,
    getTotalSteps: processWorkflow.getTotalSteps,
    getDisplayStepNumber: processWorkflow.getDisplayStepNumber,
    getStepTitle: processWorkflow.getStepTitle,
    hasSelectedConvenente: processWorkflow.hasSelectedConvenente,
    
    // Directory dialog related props and methods
    showDirectoryDialog: processWorkflow.showDirectoryDialog,
    setShowDirectoryDialog: processWorkflow.setShowDirectoryDialog,
    handleOpenDirectorySettings: processWorkflow.handleOpenDirectorySettings,
    handleSaveDirectorySettings: processWorkflow.handleSaveDirectorySettings,
    
    // CNAB file state
    cnabFileGenerated: processWorkflow.cnabFileGenerated,
    cnabFileName: processWorkflow.cnabFileName,
    
    // Convenentes data
    convenentes: convenentesData.convenentes,
    carregandoConvenentes: convenentesData.carregandoConvenentes
  };
};
