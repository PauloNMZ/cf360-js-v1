
import { useState, useEffect } from 'react';
import { validateFavorecidos } from '@/services/cnab240/validationService';
import { toast } from '@/components/ui/sonner';

// Import smaller hooks
import { useFileImport } from './importacao/useFileImport';
import { useTableOperations } from './importacao/useTableOperations';
import { useWorkflowDialog } from './importacao/useWorkflowDialog';
import { useDirectoryDialog } from './importacao/useDirectoryDialog';
import { useConvenentesData } from './importacao/useConvenentesData';
import { useValidationDialog } from './importacao/useValidationDialog';
import { usePDFReportDialog } from './importacao/usePDFReportDialog';
import { useEmailConfigDialog } from './importacao/useEmailConfigDialog';
import { useCNABGeneration } from './importacao/useCNABGeneration';

export const useImportacao = () => {
  const [showTable, setShowTable] = useState(false);
  
  // Import functionality from smaller hooks
  const fileImport = useFileImport();
  const tableOps = useTableOperations(fileImport.tableData);
  const workflowDialog = useWorkflowDialog();
  const directoryDialog = useDirectoryDialog();
  const convenentesData = useConvenentesData();
  const validationDialog = useValidationDialog();
  const pdfReportDialog = usePDFReportDialog();
  const emailConfigDialog = useEmailConfigDialog();
  const cnabGeneration = useCNABGeneration();

  // Sync tableData with the fileImport tableData when it changes
  useEffect(() => {
    if (fileImport.tableData.length > 0) {
      tableOps.setTableData(fileImport.tableData);
    }
  }, [fileImport.tableData]);

  // Update directory in workflow when output directory changes
  useEffect(() => {
    workflowDialog.updateWorkflow('outputDirectory', directoryDialog.outputDirectory);
  }, [directoryDialog.outputDirectory]);
  
  // Sync workflow directory to directoryDialog when workflow changes
  useEffect(() => {
    if (workflowDialog.workflow.outputDirectory !== undefined) {
      directoryDialog.setOutputDirectory(workflowDialog.workflow.outputDirectory);
    }
  }, [workflowDialog.workflow.outputDirectory]);

  // Handle initial processing
  const handleProcessar = () => {
    const result = fileImport.handleProcessar();
    if (result) {
      setShowTable(true);
      validationDialog.setValidationPerformed(false); // Reset validation status when new data is processed
      validationDialog.setValidationErrors([]);
    }
  };

  // Wrapper for verify errors function
  const handleVerifyErrors = () => {
    validationDialog.handleVerifyErrors(validateFavorecidos, tableOps.tableData);
  };
  
  // Process selected rows
  const handleProcessSelected = () => {
    const selectedRows = tableOps.tableData.filter(row => row.selected);
    
    if (selectedRows.length === 0) {
      toast.error("Nenhum registro selecionado para processamento.");
      return;
    }

    // Automaticamente fazer validação antes de prosseguir
    handleVerifyErrors();

    // Reset workflow steps and open dialog
    workflowDialog.setWorkflow({
      paymentDate: undefined,
      serviceType: "Pagamentos Diversos",
      convenente: null,
      sendMethod: "cnab",
      outputDirectory: directoryDialog.outputDirectory // Preserve directory setting
    });
    workflowDialog.setCurrentStep(1);
    workflowDialog.setShowWorkflowDialog(true);
    
    // Reset CNAB file generation status
    cnabGeneration.setCnabFileGenerated(false);
    cnabGeneration.setCnabFileName('');
  };

  // Handle save directory settings
  const handleSaveDirectorySettings = () => {
    // First update the workflow with the directory dialog value
    workflowDialog.updateWorkflow('outputDirectory', directoryDialog.outputDirectory);
    // Then save settings
    directoryDialog.handleSaveDirectorySettings();
  };

  // Final submission handler
  const handleSubmitWorkflow = async () => {
    const selectedRows = tableOps.getSelectedRows();
    return cnabGeneration.handleSubmitWorkflow(
      selectedRows, 
      workflowDialog.workflow, 
      workflowDialog.setShowWorkflowDialog
    );
  };

  // Handle PDF report generation
  const handleGenerateReport = async () => {
    const selectedRows = tableOps.getSelectedRows();
    
    if (selectedRows.length === 0) {
      toast.error("Nenhum registro selecionado para gerar relatório.");
      return;
    }
    
    // Check if CNAB file was generated
    if (!cnabGeneration.cnabFileGenerated) {
      toast.warning("É necessário gerar o arquivo CNAB antes de visualizar o relatório.");
      return;
    }

    // Get company name if available
    let companyName = "Empresa";
    if (workflowDialog.workflow.convenente) {
      const selectedConvenente = convenentesData.convenentes.find(c => c.id === workflowDialog.workflow.convenente);
      if (selectedConvenente) {
        companyName = selectedConvenente.razaoSocial;
      }
    }
    
    // Generate report
    const reportResult = await pdfReportDialog.generateReport(
      selectedRows,
      cnabGeneration.cnabFileGenerated,
      cnabGeneration.cnabFileName,
      companyName,
      validateFavorecidos
    );
    
    if (reportResult) {
      // Set date for email
      const formattedDateForEmail = emailConfigDialog.createDefaultEmailMessage(
        reportResult.formattedDate, 
        reportResult.totalValue
      );
      emailConfigDialog.setReportDate(formattedDateForEmail);
    }
  };

  // Handle sending the report via email after preview
  const handleSendEmailReport = () => {
    emailConfigDialog.handleSendEmailReport(
      pdfReportDialog.setShowPDFPreviewDialog,
      convenentesData.convenentes,
      workflowDialog.workflow.convenente
    );
  };

  // Handle email form submission
  const handleEmailSubmit = async (emailFormValues) => {
    return emailConfigDialog.handleEmailSubmit(
      emailFormValues,
      pdfReportDialog.reportData,
      pdfReportDialog.reportAttachment,
      pdfReportDialog.reportFileName
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
    
    // CNAB file state
    cnabFileGenerated: cnabGeneration.cnabFileGenerated,
    cnabFileName: cnabGeneration.cnabFileName,
    
    // PDF preview state
    showPDFPreviewDialog: pdfReportDialog.showPDFPreviewDialog,
    setShowPDFPreviewDialog: pdfReportDialog.setShowPDFPreviewDialog,
    reportData: pdfReportDialog.reportData,
    
    // Email and report dialog states
    showEmailConfigDialog: emailConfigDialog.showEmailConfigDialog,
    setShowEmailConfigDialog: emailConfigDialog.setShowEmailConfigDialog,
    defaultEmailMessage: emailConfigDialog.defaultEmailMessage,
    reportDate: emailConfigDialog.reportDate,
    
    // Process handlers
    handleProcessar,
    handleProcessSelected,
    handleGenerateReport,
    handleSendEmailReport,
    handleEmailSubmit,
    
    // Workflow dialog related props and methods
    showWorkflowDialog: workflowDialog.showWorkflowDialog,
    setShowWorkflowDialog: workflowDialog.setShowWorkflowDialog,
    currentStep: workflowDialog.currentStep,
    workflow: workflowDialog.workflow,
    goToNextStep: workflowDialog.goToNextStep,
    goToPreviousStep: workflowDialog.goToPreviousStep,
    updateWorkflow: workflowDialog.updateWorkflow,
    isCurrentStepValid: workflowDialog.isCurrentStepValid,
    handleSubmitWorkflow,
    
    // Directory dialog related props and methods
    showDirectoryDialog: directoryDialog.showDirectoryDialog,
    setShowDirectoryDialog: directoryDialog.setShowDirectoryDialog,
    handleOpenDirectorySettings: directoryDialog.handleOpenDirectorySettings,
    handleSaveDirectorySettings,
    
    // Convenentes data
    convenentes: convenentesData.convenentes,
    carregandoConvenentes: convenentesData.carregandoConvenentes
  };
};
