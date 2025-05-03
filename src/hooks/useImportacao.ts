
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CNABWorkflowData } from '@/types/cnab240';
import { RowData, EmailFormValues, ReportData } from '@/types/importacao';
import { toast } from '@/components/ui/sonner';
import { validateFavorecidos } from '@/services/cnab240/validationService';

// Import smaller hooks
import { useFileImport } from './importacao/useFileImport';
import { useTableOperations } from './importacao/useTableOperations';
import { useWorkflowDialog } from './importacao/useWorkflowDialog';
import { useDirectoryDialog } from './importacao/useDirectoryDialog';
import { useConvenentesData } from './importacao/useConvenentesData';
import { generateRemittanceReport } from '@/services/reports/remittanceReportService';
import { sendEmail, logEmailActivity } from '@/services/emailService';
import { formatarValorCurrency } from '@/utils/formatting/currencyUtils';

export const useImportacao = () => {
  const [showTable, setShowTable] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [validationPerformed, setValidationPerformed] = useState(false);
  
  // New states for PDF preview
  const [showPDFPreviewDialog, setShowPDFPreviewDialog] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  
  // States for report generation and email
  const [showEmailConfigDialog, setShowEmailConfigDialog] = useState(false);
  const [reportDate, setReportDate] = useState('');
  const [defaultEmailMessage, setDefaultEmailMessage] = useState('');
  const [reportAttachment, setReportAttachment] = useState<Blob | null>(null);
  const [reportFileName, setReportFileName] = useState<string>('');
  
  // State to track if CNAB file was generated
  const [cnabFileGenerated, setCnabFileGenerated] = useState(false);
  const [cnabFileName, setCnabFileName] = useState<string>('');
  
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
    setValidationPerformed(true);
    
    if (errors.length > 0) {
      setShowValidationDialog(true);
      toast.error(`Encontrados ${errors.length} registros com erros de validação`, {
        description: `${validRecordsCount} de ${totalRecords} registros estão válidos para processamento. Registros com erro serão excluídos do arquivo CNAB.`
      });
    } else {
      toast.success(`Todos os registros estão válidos!`, {
        description: `${validRecordsCount} registros validados com sucesso.`
      });
    }
  };

  // Function to export validation errors to Excel
  const handleExportErrors = () => {
    if (validationErrors.length === 0) {
      toast.warning("Não há erros para exportar.");
      return;
    }

    // Create a workbook with error data
    const errorData = validationErrors.map((record, index) => {
      const errorsText = record.errors
        .map((e: any) => `${e.message}${e.expectedValue ? ` (Esperado: ${e.expectedValue}, Informado: ${e.actualValue})` : ''}`)
        .join('\n');
      
      return {
        'ID': index + 1,
        'Nome': record.favorecido.nome,
        'Inscrição': record.favorecido.inscricao,
        'Banco': record.favorecido.banco,
        'Agência': record.favorecido.agencia,
        'Conta': record.favorecido.conta,
        'Tipo': record.favorecido.tipo,
        'Valor': record.favorecido.valor,
        'Erros': errorsText
      };
    });

    const ws = XLSX.utils.json_to_sheet(errorData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Erros de Validação");
    
    // Auto-size columns
    const colWidths = [
      { wch: 5 }, // ID
      { wch: 30 }, // Nome
      { wch: 15 }, // Inscrição
      { wch: 8 }, // Banco
      { wch: 10 }, // Agência
      { wch: 15 }, // Conta
      { wch: 6 }, // Tipo
      { wch: 12 }, // Valor
      { wch: 80 }, // Erros
    ];
    
    ws['!cols'] = colWidths;
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(fileData, `Erros_Validacao_${new Date().toISOString().slice(0, 10)}.xlsx`);
    
    toast.success("Arquivo de erros exportado com sucesso!");
  };

  // Handle initial processing
  const handleProcessar = () => {
    const result = fileImport.handleProcessar();
    if (result) {
      setShowTable(true);
      setValidationPerformed(false); // Reset validation status when new data is processed
      setValidationErrors([]);
    }
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
    setCnabFileGenerated(false);
    setCnabFileName('');
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
    
    try {
      // Process selected rows with validation
      const result = await workflowDialog.handleSubmitWorkflow(selectedRows);
      
      // If the file was successfully generated, set the filename
      if (result && result.fileName) {
        setCnabFileGenerated(true);
        setCnabFileName(result.fileName);
      }
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      // Error handling is already done in processSelectedRows
    }
  };

  // Format date for display
  const formatCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' (UTC-3)';
  };

  // Handle PDF report generation
  const handleGenerateReport = async () => {
    const selectedRows = tableOps.getSelectedRows();
    
    if (selectedRows.length === 0) {
      toast.error("Nenhum registro selecionado para gerar relatório.");
      return;
    }
    
    // Check if CNAB file was generated
    if (!cnabFileGenerated) {
      toast.warning("É necessário gerar o arquivo CNAB antes de visualizar o relatório.");
      return;
    }

    try {
      // Get only valid records without errors - FIXED: properly filter out records with errors
      const { errors } = validateFavorecidos(selectedRows);
      
      // Create a set of IDs from records with errors for easy lookup
      const errorIds = new Set(errors.map(e => e.id));
      
      // Filter out records with errors
      const validRecords = selectedRows.filter(row => !errorIds.has(row.id));
      
      if (validRecords.length === 0) {
        toast.error("Não há registros válidos para gerar o relatório.");
        return;
      }

      // Initialize company data from selected convenente
      let companyName = "Empresa";
      
      // Try to get company name from selected convenente if available
      if (workflowDialog.workflow.convenente) {
        const selectedConvenente = convenentesData.convenentes.find(c => c.id === workflowDialog.workflow.convenente);
        if (selectedConvenente) {
          companyName = selectedConvenente.razaoSocial;
        }
      }
      
      // Generate formatted date
      const formattedDate = formatCurrentDateTime();
      setReportDate(formattedDate.split(' ')[0]); // Just the date part for email
      
      // Use CNAB filename as reference
      const remittanceReference = cnabFileName || "Remessa_" + new Date().toISOString().slice(0, 10).replace(/-/g, '');
      
      // Calculate total value of ONLY valid records
      const totalValue = validRecords.reduce((sum, row) => {
        const valueStr = row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.');
        const value = parseFloat(valueStr);
        return sum + (isNaN(value) ? 0 : value);
      }, 0);
      
      // Create report data with only valid records
      const pdfReportData: ReportData = {
        empresa: companyName,
        dataGeracao: formattedDate,
        referencia: remittanceReference,
        beneficiarios: validRecords,
        totalRegistros: validRecords.length,
        valorTotal: totalValue
      };
      
      // Store report data
      setReportData(pdfReportData);
      
      // Generate default email message with the reference, formatted date and total value
      const formattedDateForEmail = formattedDate.split(' ')[0]; // Just the date part
      const formattedTotalValue = formatarValorCurrency(totalValue);
      const emailMsg = `Prezado Diretor Financeiro,

Segue em anexo o relatório detalhado da remessa bancária gerada em ${formattedDateForEmail}, contendo os valores a serem creditados nas respectivas contas dos beneficiários no valor total de ${formattedTotalValue}. Solicitamos a sua análise e autorização para a liberação dos pagamentos.

Atenciosamente,
[Nome do responsável]
[Departamento]`;

      setDefaultEmailMessage(emailMsg);
      
      // Show PDF preview dialog
      setShowPDFPreviewDialog(true);
      
      // For Excel report backup - use only valid records
      try {
        const reportOptions = {
          companyName: companyName,
          remittanceReference: remittanceReference,
          responsibleName: "Usuário do Sistema",
          department: "Financeiro"
        };
        
        const excelReport = await generateRemittanceReport(validRecords, reportOptions);
        setReportAttachment(excelReport.file);
        setReportFileName(excelReport.fileName);
      } catch (error) {
        console.error("Erro ao gerar relatório Excel:", error);
      }
      
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório de remessa bancária.");
    }
  };

  // Handle sending the report via email after preview
  const handleSendEmailReport = () => {
    // Close PDF dialog
    setShowPDFPreviewDialog(false);
    
    // Get selected convenente name for company name in email form
    let companyName = "";
    if (workflowDialog.workflow.convenente) {
      const selectedConvenente = convenentesData.convenentes.find(
        c => c.id === workflowDialog.workflow.convenente
      );
      if (selectedConvenente) {
        companyName = selectedConvenente.razaoSocial;
      }
    }
    
    // Open email config dialog
    setShowEmailConfigDialog(true);
    
    // Update default company name in the email form
    if (companyName) {
      // This will be picked up by the EmailConfigDialog component
      localStorage.setItem('tempEmailCompanyName', companyName);
    }
  };

  // Handle email form submission
  const handleEmailSubmit = async (emailFormValues: EmailFormValues) => {
    try {
      // Show sending email toast
      toast.info("Enviando relatório por e-mail...");
      
      // Prepare email data - using Excel report as attachment
      let emailAttachment = reportAttachment;
      let attachmentFileName = reportFileName;
      
      // If there's no Excel report (unlikely), create it now
      if (!emailAttachment && reportData) {
        const reportOptions = {
          companyName: emailFormValues.companyName,
          remittanceReference: emailFormValues.remittanceReference,
          responsibleName: emailFormValues.senderName,
          department: emailFormValues.senderDepartment
        };
        
        const excelReport = await generateRemittanceReport(reportData.beneficiarios, reportOptions);
        emailAttachment = excelReport.file;
        attachmentFileName = excelReport.fileName;
      }
      
      if (!emailAttachment) {
        throw new Error("Falha ao gerar anexo do e-mail");
      }
      
      const emailData = {
        recipientEmail: emailFormValues.recipientEmail,
        senderName: emailFormValues.senderName,
        senderDepartment: emailFormValues.senderDepartment,
        subject: `Relatório de Remessa Bancária - ${emailFormValues.remittanceReference}`,
        message: emailFormValues.message,
        attachmentFile: emailAttachment,
        attachmentFileName: attachmentFileName
      };
      
      // Send the email
      const response = await sendEmail(emailData);
      
      // Log email activity for audit
      logEmailActivity(emailData, response);
      
      // Close the email dialog
      setShowEmailConfigDialog(false);
      
      if (response.success) {
        toast.success("Relatório enviado com sucesso!", {
          description: `E-mail enviado para ${emailFormValues.recipientEmail}`
        });
      } else {
        toast.error("Erro ao enviar e-mail", {
          description: response.error || "Ocorreu um erro ao enviar o relatório."
        });
      }
      
    } catch (error) {
      console.error("Erro ao enviar relatório por e-mail:", error);
      toast.error("Erro ao enviar relatório por e-mail.");
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
    validationPerformed,
    hasValidationErrors: validationErrors.length > 0,
    
    // CNAB file state
    cnabFileGenerated,
    cnabFileName,
    
    // PDF preview state
    showPDFPreviewDialog,
    setShowPDFPreviewDialog,
    reportData,
    
    // Email and report dialog states
    showEmailConfigDialog,
    setShowEmailConfigDialog,
    defaultEmailMessage,
    reportDate,
    
    // Process handlers
    handleProcessar,
    handleProcessSelected,
    handleVerifyErrors,
    handleExportErrors,
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
