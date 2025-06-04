import { useIndexPageContext } from './useIndexPageContext';
import { useImportacaoState } from './importacao/useImportacaoState';
import { useImportacaoCompany } from './importacao/useImportacaoCompany';
import { useImportacaoHandlers } from './importacao/useImportacaoHandlers';
import { useImportacaoSearch } from './importacao/useImportacaoSearch';

export const useImportacao = () => {
  // Get current selected convenente info from context
  const { currentConvenenteId, formData, selectedHeaderCompany } = useIndexPageContext();
  const hasSelectedConvenente = !!(currentConvenenteId && formData);
  const selectedConvenente = hasSelectedConvenente ? {
    id: currentConvenenteId,
    ...formData
  } : null;
  
  // Use the state management hook
  const {
    showTable,
    setShowTable,
    fileImport,
    tableOps,
    convenentesData,
    validationDialog,
    pdfReportWithEmail,
    processWorkflow
  } = useImportacaoState(selectedConvenente, hasSelectedConvenente);

  // Use the search functionality
  const {
    searchTerm,
    filteredData,
    handleSearchChange,
    hasResults
  } = useImportacaoSearch(tableOps.tableData);

  // Use the company logic hook
  const { getCompanyInfo } = useImportacaoCompany(
    selectedConvenente,
    convenentesData,
    processWorkflow
  );

  // Use the handlers hook
  const {
    handleProcessar,
    handleVerifyErrors,
    handleProcessSelected,
    handleGenerateReport
  } = useImportacaoHandlers(
    fileImport,
    tableOps,
    validationDialog,
    processWorkflow,
    pdfReportWithEmail,
    convenentesData,
    selectedConvenente,
    getCompanyInfo,
    setShowTable
  );

  // Handler para editar linha
  const handleEditRow = (id: number) => {
    console.log("useImportacao - Editando linha ID:", id);
    const rowToEdit = tableOps.tableData.find(row => row.id === id);
    if (rowToEdit) {
      console.log("Dados da linha a editar:", rowToEdit);
      // TODO: Implementar lógica de edição (abrir modal, etc.)
    }
  };

  return {
    // File related props and methods
    file: fileImport.file,
    loading: fileImport.loading,
    planilhaData: fileImport.planilhaData,
    errorMessage: fileImport.errorMessage,
    handleFileChange: fileImport.handleFileChange,
    
    // Table related props and methods
    tableData: filteredData, // Use filtered data instead of raw tableData
    selectAll: tableOps.selectAll,
    total: tableOps.total,
    handleSelectAll: tableOps.handleSelectAll,
    handleSelectRow: tableOps.handleSelectRow,
    handleDeleteRow: tableOps.handleDeleteRow,
    handleEditRow, // ADDED: Handler para editar linha
    handleClearSelection: tableOps.handleClearSelection,
    getSelectedCount: tableOps.getSelectedCount,
    
    // Search related props and methods
    searchTerm,
    handleSearchChange,
    hasSearchResults: hasResults,
    
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
    selectedSortType: pdfReportWithEmail.selectedSortType,
    
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
    
    // CNAB file state - ATUALIZADO: Agora vem do useWorkflowDialog
    cnabFileGenerated: processWorkflow.cnabFileGenerated,
    cnabFileName: processWorkflow.cnabFileName,
    
    // Convenentes data
    convenentes: convenentesData.convenentes,
    carregandoConvenentes: convenentesData.carregandoConvenentes
  };
};
