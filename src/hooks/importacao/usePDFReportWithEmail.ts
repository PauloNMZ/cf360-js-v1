import { useState } from 'react';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';
import { generatePDFReport } from '@/services/reports/pdfReportService';
import { sendEmailWithAttachment } from '@/services/emailService';
import { ReportData, RowData, EmailFormValues } from '@/types/importacao';
import { ReportSortType } from '@/types/reportSorting';
import { formatDateForFilename } from '@/utils/formatting/dateUtils';

export const usePDFReportWithEmail = () => {
  const { showSuccess, showError } = useNotificationModalContext();
  
  const [showPDFPreviewDialog, setShowPDFPreviewDialog] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [showEmailConfigDialog, setShowEmailConfigDialog] = useState(false);
  const [defaultEmailMessage, setDefaultEmailMessage] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [currentPDFBlob, setCurrentPDFBlob] = useState<Blob | null>(null);
  const [selectedSortType, setSelectedSortType] = useState<ReportSortType>(ReportSortType.BY_NAME);

  // CORRIGIDO: Aceitar sortType como parâmetro opcional
  const handleGenerateReport = async (
    selectedRows: RowData[],
    cnabFileGenerated: boolean,
    cnabFileName: string,
    companyName: string,
    validateFavorecidos: any,
    convenente: any,
    companyCnpj: string,
    paymentDate: Date,
    sortType: ReportSortType = ReportSortType.BY_NAME // ADICIONADO: parâmetro sortType
  ) => {
    await handleGenerateReportWithSorting(
      selectedRows,
      cnabFileGenerated,
      cnabFileName,
      companyName,
      validateFavorecidos,
      convenente,
      companyCnpj,
      paymentDate,
      sortType // CORRIGIDO: Passar o sortType recebido
    );
  };

  const handleGenerateReportWithSorting = async (
    selectedRows: RowData[],
    cnabFileGenerated: boolean,
    cnabFileName: string,
    companyName: string,
    validateFavorecidos: any,
    convenente: any,
    companyCnpj: string,
    paymentDate: Date,
    sortType: ReportSortType = ReportSortType.BY_NAME
  ) => {
    console.log("=== Generating Report with Sorting ===");
    console.log("Sort type:", sortType);
    console.log("Selected rows count:", selectedRows.length);
    
    if (selectedRows.length === 0) {
      showError("Erro!", "Nenhum registro selecionado para gerar relatório.");
      return;
    }

    try {
      // Validate favorecidos if validation function is provided
      if (validateFavorecidos) {
        const validationResult = validateFavorecidos(selectedRows);
        
        // Fix: Check for errors array length instead of .valid property
        if (validationResult.errors && validationResult.errors.length > 0) {
          // Format error messages properly
          const errorMessages = validationResult.errors.map((errorRecord: any) => {
            const favorecidoName = errorRecord.favorecido?.nome || errorRecord.favorecido?.NOME || 'Favorecido';
            const fieldErrors = errorRecord.errors?.map((err: any) => err.message || err).join(', ') || 'Erro de validação';
            return `${favorecidoName}: ${fieldErrors}`;
          });
          
          // Show warning but allow report generation if there are valid records
          if (validationResult.validRecordsCount > 0) {
            console.log(`⚠️ Warning: ${validationResult.errors.length} errors found, but ${validationResult.validRecordsCount} valid records exist. Proceeding with report generation.`);
          } else {
            showError("Erro!", `Todos os registros possuem erros de validação: ${errorMessages.slice(0, 3).join('; ')}${errorMessages.length > 3 ? '...' : ''}`);
            return;
          }
        }
      }

      // Calculate total value
      const valorTotal = selectedRows.reduce((total, row) => {
        const valor = typeof row.VALOR === 'number' 
          ? row.VALOR
          : parseFloat(row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        return total + (isNaN(valor) ? 0 : valor);
      }, 0);

      // Create report data
      const reportData: ReportData = {
        beneficiarios: selectedRows,
        empresaNome: companyName,
        empresaCnpj: companyCnpj,
        dataGeracao: new Date().toLocaleDateString('pt-BR'),
        dataPagamento: paymentDate ? paymentDate.toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
        referencia: `REF${formatDateForFilename(new Date())}`,
        valorTotal: valorTotal,
        totalRegistros: selectedRows.length
      };

      console.log("=== Calling generatePDFReport ===");
      console.log("Final sort type being passed:", sortType);
      
      // CORRIGIDO: Passar sortType para generatePDFReport
      const pdfBlob = await generatePDFReport(reportData, sortType);
      
      setCurrentPDFBlob(pdfBlob);
      setReportData(reportData);
      setReportDate(reportData.dataGeracao);
      setSelectedSortType(sortType);
      setShowPDFPreviewDialog(true);

    } catch (error) {
      console.error("Erro ao gerar relatório PDF:", error);
      showError("Erro!", "Erro ao gerar relatório PDF.");
    }
  };

  const handleSendEmailReport = () => {
    if (!reportData) {
      showError("Erro!", "Nenhum relatório disponível para envio.");
      return;
    }

    const defaultMessage = `Segue em anexo o relatório de remessa bancária.

Empresa: ${reportData.empresaNome}
Data de Geração: ${reportData.dataGeracao}
Data de Pagamento: ${reportData.dataPagamento}
Total de Favorecidos: ${reportData.totalRegistros}
Valor Total: R$ ${reportData.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

Atenciosamente,
Equipe Financeira`;

    setDefaultEmailMessage(defaultMessage);
    setShowEmailConfigDialog(true);
    setShowPDFPreviewDialog(false);
  };

  const handleEmailSubmit = async (values: EmailFormValues) => {
    if (!currentPDFBlob || !reportData) {
      showError("Erro!", "Relatório não disponível para envio.");
      return;
    }

    try {
      const fileName = `relatorio_remessa_${formatDateForFilename(new Date())}.pdf`;
      
      // Convert EmailFormValues to the expected format - use correct property names
      const recipients = values.recipientEmail || '';
      const subject = `Relatório de Remessa Bancária - ${reportData.empresaNome}`;
      const message = values.message || defaultEmailMessage;
      
      await sendEmailWithAttachment(
        recipients.split(',').map(email => email.trim()),
        subject,
        message,
        currentPDFBlob,
        fileName
      );

      showSuccess("Sucesso!", "E-mail enviado com sucesso!");
      setShowEmailConfigDialog(false);
      
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      showError("Erro!", "Erro ao enviar e-mail com o relatório.");
    }
  };

  return {
    showPDFPreviewDialog,
    setShowPDFPreviewDialog,
    reportData,
    showEmailConfigDialog,
    setShowEmailConfigDialog,
    defaultEmailMessage,
    reportDate,
    selectedSortType,
    handleGenerateReport,
    handleGenerateReportWithSorting,
    handleSendEmailReport,
    handleEmailSubmit
  };
};
