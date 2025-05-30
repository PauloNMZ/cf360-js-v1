
import { useState, useEffect } from 'react';
import { useFileImport } from './useFileImport';
import { useTableOperations } from './useTableOperations';
import { useValidationDialog } from './useValidationDialog';
import { useConvenentesData } from './useConvenentesData';
import { usePDFReportWithEmail } from './usePDFReportWithEmail';
import { useProcessWorkflow } from './useProcessWorkflow';

export const useImportacaoState = (selectedConvenente: any, hasSelectedConvenente: boolean) => {
  const [showTable, setShowTable] = useState(false);
  
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

  return {
    showTable,
    setShowTable,
    fileImport,
    tableOps,
    convenentesData,
    validationDialog,
    pdfReportWithEmail,
    processWorkflow
  };
};
