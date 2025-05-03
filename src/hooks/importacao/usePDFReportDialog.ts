
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { ReportData, EmailFormValues } from '@/types/importacao';
import { generateRemittanceReport } from '@/services/reports/remittanceReportService';
import { formatarValorCurrency } from '@/utils/formatting/currencyUtils';

export const usePDFReportDialog = () => {
  const [showPDFPreviewDialog, setShowPDFPreviewDialog] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [reportAttachment, setReportAttachment] = useState<Blob | null>(null);
  const [reportFileName, setReportFileName] = useState<string>('');
  
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
  
  const generateReport = async (
    selectedRows: any[], 
    cnabFileGenerated: boolean, 
    cnabFileName: string,
    companyName: string,
    validateFavorecidos: any
  ) => {
    if (selectedRows.length === 0) {
      toast.error("Nenhum registro selecionado para gerar relatório.");
      return null;
    }
    
    // Check if CNAB file was generated
    if (!cnabFileGenerated) {
      toast.warning("É necessário gerar o arquivo CNAB antes de visualizar o relatório.");
      return null;
    }

    try {
      // Get only valid records without errors
      const { errors } = validateFavorecidos(selectedRows);
      
      // Create a set of IDs from records with errors for easy lookup
      const errorIds = new Set(errors.map(e => e.id));
      
      // Filter out records with errors
      const validRecords = selectedRows.filter(row => !errorIds.has(row.id));
      
      if (validRecords.length === 0) {
        toast.error("Não há registros válidos para gerar o relatório.");
        return null;
      }
      
      // Generate formatted date
      const formattedDate = formatCurrentDateTime();
      
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

      // Show PDF preview dialog
      setShowPDFPreviewDialog(true);
      
      // Return the required data
      return {
        reportData: pdfReportData,
        formattedDate,
        totalValue
      };
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório de remessa bancária.");
      return null;
    }
  };
  
  return {
    showPDFPreviewDialog,
    setShowPDFPreviewDialog,
    reportData,
    setReportData,
    reportAttachment,
    reportFileName,
    generateReport,
    formatCurrentDateTime
  };
};
