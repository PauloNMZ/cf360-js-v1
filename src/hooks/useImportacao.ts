import { useState, useEffect } from 'react';
import { CNABWorkflowData } from '@/types/cnab240';
import { RowData } from '@/types/importacao';
import { toast } from '@/components/ui/sonner';
import { validateFavorecidos } from '@/services/cnab240/validationService';

// Import smaller hooks
import { useFileImport } from './importacao/useFileImport';
import { useTableOperations } from './importacao/useTableOperations';
import { useWorkflowDialog } from './importacao/useWorkflowDialog';
import { useDirectoryDialog } from './importacao/useDirectoryDialog';
import { useConvenentesData } from './importacao/useConvenentesData';

export const useImportacao = () => {
  const [showTable, setShowTable] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  
  // Import functionality from smaller hooks
  const fileImport = useFileImport();
  const tableOps = useTableOperations(fileImport.tableData);
  const workflowDialog = useWorkflowDialog();
  const directoryDialog = useDirectoryDialog();
  const convenentesData = useConvenentesData();

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

  // Function to validate records and display errors
  const handleVerifyErrors = () => {
    if (tableOps.tableData.length === 0) {
      toast.error('Nenhum registro para validar. Importe uma planilha primeiro.');
      return;
    }

    const { errors, validRecordsCount, totalRecords } = validateFavorecidos(tableOps.tableData);
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      setShowValidationDialog(true);
      toast.error(`Encontrados ${errors.length} registros com erros de validação`, {
        description: `${validRecordsCount} de ${totalRecords} registros estão válidos para processamento.`
      });
    } else {
      toast.success(`Todos os registros estão válidos!`, {
        description: `${validRecordsCount} registros validados com sucesso.`
      });
    }
  };

  // Handle initial processing
  const handleProcessar = () => {
    const result = fileImport.handleProcessar();
    if (result) {
      setShowTable(true);
    }
  };
  
  // Process selected rows
  const handleProcessSelected = () => {
    const selectedRows = tableOps.tableData.filter(row => row.selected);
    
    if (selectedRows.length === 0) {
      toast.error("Nenhum registro selecionado para processamento.");
      return;
    }

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
    workflowDialog.setShowWorkflowDialog(false);
    await workflowDialog.handleSubmitWorkflow(selectedRows);
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
    showValidationDialog,
    setShowValidationDialog,
    validationErrors,
    
    // Process handlers
    handleProcessar: handleProcessar,
    handleProcessSelected: handleProcessSelected,
    handleVerifyErrors: handleVerifyErrors,
    
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
