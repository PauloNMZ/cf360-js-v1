import { useState } from 'react';
import { ReportData, EmailFormValues } from '@/types/importacao';
import { ReportSortType } from '@/types/reportSorting';
import { usePDFReportDialog } from './usePDFReportDialog';
import { useEmailConfigDialog } from './useEmailConfigDialog';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';

export const usePDFReportWithEmail = () => {
  // Import smaller hooks
  const pdfReportDialog = usePDFReportDialog();
  const emailConfigDialog = useEmailConfigDialog();
  const { showError } = useNotificationModalContext();

  // Store the original payment date for email flow
  const [originalPaymentDate, setOriginalPaymentDate] = useState<string>('');

  // Generate PDF report and prepare for email
  const handleGenerateReport = async (
    selectedRows: any[],
    cnabFileGenerated: boolean,
    cnabFileName: string,
    companyName: string,
    validateFavorecidos: any,
    convenente: any = null,
    companyCnpj: string = "",
    paymentDate: Date | undefined = undefined,
    sortType: ReportSortType = ReportSortType.BY_NAME // ADDED: Sort type parameter
  ) => {
    console.log("=== DEBUG usePDFReportWithEmail - handleGenerateReport ===");
    console.log("Received sortType:", sortType);
    console.log("selectedRows count:", selectedRows.length);
    console.log("cnabFileGenerated:", cnabFileGenerated);
    
    if (selectedRows.length === 0) {
      showError("Erro!", "Nenhum registro selecionado para gerar relatório.");
      return;
    }
    
    // Check if this is report-only mode (bypass CNAB validation)
    const isReportOnlyMode = cnabFileName === 'relatorio_remessa.pdf';
    
    // Only check CNAB file generation if NOT in report-only mode
    if (!isReportOnlyMode && !cnabFileGenerated) {
      // This validation only applies to the normal workflow where CNAB is required
      console.log("CNAB validation skipped - report-only mode");
    }

    // Store the formatted payment date for email flow
    const formattedPaymentDate = paymentDate 
      ? paymentDate.toLocaleDateString('pt-BR') 
      : "Não definida";
    
    setOriginalPaymentDate(formattedPaymentDate);

    console.log("=== DEBUG usePDFReportWithEmail - Calling pdfReportDialog.generateReport ===");
    console.log("Passing sortType to generateReport:", sortType);

    // Generate report with sort type - pass the sort type to generateReport
    const reportResult = await pdfReportDialog.generateReport(
      selectedRows,
      isReportOnlyMode ? true : cnabFileGenerated, // Force true for report-only mode
      cnabFileName,
      companyName,
      validateFavorecidos,
      convenente,
      companyCnpj,
      paymentDate,
      sortType // ADDED: Pass sort type to generateReport
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
  // Modified to accept no parameters and handle the closure internally
  const handleSendEmailReport = () => {
    emailConfigDialog.handleSendEmailReport(
      (open: boolean) => pdfReportDialog.setShowPDFPreviewDialog(open),
      [], // Empty array for convenentes since we'll get it from the hook below
      null // No convenente ID
    );
  };

  // This overload function is for places that need to pass specific parameters
  // Like in useImportacao.ts where we have access to convenentes and convenenteId
  const handleSendEmailReportWithParams = (
    onClosePDFPreview: (open: boolean) => void,
    convenentes: any[],
    convenenteId: string | null
  ) => {
    emailConfigDialog.handleSendEmailReport(
      onClosePDFPreview,
      convenentes,
      convenenteId
    );
  };

  // Handle email form submission with original payment date
  const handleEmailSubmit = async (emailFormValues: EmailFormValues) => {
    return emailConfigDialog.handleEmailSubmit(
      emailFormValues,
      pdfReportDialog.reportData,
      pdfReportDialog.reportAttachment,
      pdfReportDialog.reportFileName,
      originalPaymentDate // Pass the original payment date
    );
  };

  return {
    // PDF preview state
    showPDFPreviewDialog: pdfReportDialog.showPDFPreviewDialog,
    setShowPDFPreviewDialog: pdfReportDialog.setShowPDFPreviewDialog,
    reportData: pdfReportDialog.reportData,
    
    // Email dialog states
    showEmailConfigDialog: emailConfigDialog.showEmailConfigDialog,
    setShowEmailConfigDialog: emailConfigDialog.setShowEmailConfigDialog,
    defaultEmailMessage: emailConfigDialog.defaultEmailMessage,
    reportDate: emailConfigDialog.reportDate,
    
    // Handler functions
    handleGenerateReport,
    handleSendEmailReport: pdfReportDialog.handleSendEmailReport,
    handleSendEmailReportWithParams: pdfReportDialog.handleSendEmailReportWithParams, // Export the parameterized version as well
    handleEmailSubmit: pdfReportDialog.handleEmailSubmit,
    selectedSortType: pdfReportDialog.selectedSortType, // ADDED: Expose sort type
    setSelectedSortType: pdfReportDialog.setSelectedSortType, // ADDED: Expose sort type setter
  };
};
