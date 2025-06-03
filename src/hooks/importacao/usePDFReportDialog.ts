
import { useState } from 'react';
import { ReportData, EmailFormValues } from '@/types/importacao';
import { generateRemittanceReport } from '@/services/reports/remittanceReportService';
import { formatarValorCurrency } from '@/utils/formatting/currencyUtils';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';

export const usePDFReportDialog = () => {
  const [showPDFPreviewDialog, setShowPDFPreviewDialog] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [reportAttachment, setReportAttachment] = useState<Blob | null>(null);
  const [reportFileName, setReportFileName] = useState<string>('');
  const { showSuccess, showError, showWarning } = useNotificationModalContext();
  
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
    validateFavorecidos: any,
    convenente: any,
    companyCnpj: string = "",
    paymentDate: Date | undefined = undefined
  ) => {
    console.log("=== DEBUG usePDFReportDialog - generateReport ===");
    console.log("Parameters received:");
    console.log("  - selectedRows length:", selectedRows.length);
    console.log("  - companyName:", companyName);
    console.log("  - companyCnpj:", companyCnpj);
    console.log("  - convenente:", convenente);
    console.log("  - cnabFileGenerated:", cnabFileGenerated);
    console.log("  - paymentDate:", paymentDate);
    
    if (selectedRows.length === 0) {
      showError("Erro!", "Nenhum registro selecionado para gerar relatório.");
      return null;
    }
    
    // Check if CNAB file was generated
    if (!cnabFileGenerated) {
      showWarning("Atenção!", "É necessário gerar o arquivo CNAB antes de visualizar o relatório.");
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
        showError("Erro!", "Não há registros válidos para gerar o relatório.");
        return null;
      }
      
      // Generate formatted date
      const formattedDate = formatCurrentDateTime();
      
      // Format payment date
      const formattedPaymentDate = paymentDate 
        ? paymentDate.toLocaleDateString('pt-BR') 
        : "Não definida";
      
      // Use CNAB filename as reference
      const remittanceReference = cnabFileName || "Remessa_" + new Date().toISOString().slice(0, 10).replace(/-/g, '');
      
      // Calculate total value of ONLY valid records
      const totalValue = validRecords.reduce((sum, row) => {
        const valueStr = row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.');
        const value = parseFloat(valueStr);
        return sum + (isNaN(value) ? 0 : value);
      }, 0);
      
      // Determine final company info with better priority logic
      let finalCompanyName = "Empresa";
      let finalCompanyCnpj = "";
      
      console.log("=== Determining final company info ===");
      
      // Priority 1: Use convenente data if available and valid
      if (convenente && convenente.razaoSocial && convenente.razaoSocial.trim() !== "") {
        finalCompanyName = convenente.razaoSocial;
        finalCompanyCnpj = convenente.cnpj || "";
        console.log("✅ Using convenente data:", { finalCompanyName, finalCompanyCnpj });
      }
      // Priority 2: Use passed parameters if they are not defaults
      else if (companyName && companyName !== "Empresa" && companyName.trim() !== "") {
        finalCompanyName = companyName;
        finalCompanyCnpj = companyCnpj || "";
        console.log("✅ Using passed company parameters:", { finalCompanyName, finalCompanyCnpj });
      }
      else {
        console.log("❌ No valid company data, using defaults:", { finalCompanyName, finalCompanyCnpj });
      }
      
      console.log("=== Final company values for report ===");
      console.log("finalCompanyName:", finalCompanyName);
      console.log("finalCompanyCnpj:", finalCompanyCnpj);
      console.log("formattedPaymentDate:", formattedPaymentDate);
      
      // Create report data with only valid records including payment date
      const pdfReportData: ReportData = {
        empresaNome: finalCompanyName,
        empresaCnpj: finalCompanyCnpj,
        dataGeracao: formattedDate,
        dataPagamento: formattedPaymentDate,
        referencia: remittanceReference,
        beneficiarios: validRecords,
        totalRegistros: validRecords.length,
        valorTotal: totalValue
      };
      
      console.log("=== Created reportData ===");
      console.log("reportData.empresaNome:", pdfReportData.empresaNome);
      console.log("reportData.empresaCnpj:", pdfReportData.empresaCnpj);
      console.log("reportData.dataPagamento:", pdfReportData.dataPagamento);
      
      // Store report data
      setReportData(pdfReportData);
      
      // For Excel report backup - use only valid records
      try {
        const reportOptions = {
          companyName: finalCompanyName,
          companyCnpj: finalCompanyCnpj,
          remittanceReference: remittanceReference,
          responsibleName: "Usuário do Sistema",
          department: "Financeiro",
          paymentDate: formattedPaymentDate
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
      showError("Erro!", "Erro ao gerar relatório de remessa bancária.");
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
