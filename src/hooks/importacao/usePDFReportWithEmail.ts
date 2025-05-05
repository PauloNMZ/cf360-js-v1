
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { ReportData, EmailFormValues } from '@/types/importacao';
import { usePDFReportDialog } from './usePDFReportDialog';
import { useEmailConfigDialog } from './useEmailConfigDialog';

export const usePDFReportWithEmail = () => {
  // Import smaller hooks
  const pdfReportDialog = usePDFReportDialog();
  const emailConfigDialog = useEmailConfigDialog();

  // Generate PDF report and prepare for email
  const handleGenerateReport = async (
    selectedRows: any[],
    cnabFileGenerated: boolean,
    cnabFileName: string,
    companyName: string,
    validateFavorecidos: any,
    convenente: any = null
  ) => {
    if (selectedRows.length === 0) {
      toast.error("Nenhum registro selecionado para gerar relatório.");
      return;
    }
    
    // Check if CNAB file was generated
    if (!cnabFileGenerated) {
      toast.warning("É necessário gerar o arquivo CNAB antes de visualizar o relatório.");
      return;
    }

    // Generate report
    const reportResult = await pdfReportDialog.generateReport(
      selectedRows,
      cnabFileGenerated,
      cnabFileName,
      companyName,
      validateFavorecidos,
      convenente
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

  // Handle email form submission
  const handleEmailSubmit = async (emailFormValues: EmailFormValues) => {
    return emailConfigDialog.handleEmailSubmit(
      emailFormValues,
      pdfReportDialog.reportData,
      pdfReportDialog.reportAttachment,
      pdfReportDialog.reportFileName
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
    handleSendEmailReport,
    handleSendEmailReportWithParams, // Export the parameterized version as well
    handleEmailSubmit
  };
};
