
import { useState } from 'react';
import { useNotificationModalContext } from "@/components/ui/NotificationModalProvider";
import { usePDFReportWithEmail } from '@/hooks/importacao/usePDFReportWithEmail';
import { mapFavorecidoToRowData, validateFavorecidos } from './workflow/favorecidosWorkflowUtils';
import { ReportSortType } from '@/types/reportSorting';

interface UseLancamentoFavorecidosReportProps {
  selectedFavorecidos: string[];
  favorecidos: any[];
  workflow: any;
  handleGenerateOnlyReport: () => Promise<void>;
  setShowWorkflowDialog: (show: boolean) => void;
}

export const useLancamentoFavorecidosReport = ({
  selectedFavorecidos,
  favorecidos,
  workflow,
  handleGenerateOnlyReport,
  setShowWorkflowDialog
}: UseLancamentoFavorecidosReportProps) => {
  const { showError } = useNotificationModalContext();
  const pdfReportWithEmail = usePDFReportWithEmail();
  
  // Add state for sort dialog
  const [showSortDialog, setShowSortDialog] = useState(false);

  // Function to handle the sort dialog confirmation - FIXED: Following Importar Planilha pattern
  const handleSortConfirm = async (sortType: ReportSortType) => {
    console.log("=== 🎯 DEBUG handleSortConfirm - Por Favorecidos Module ===");
    console.log("sortType received:", sortType);
    console.log("sortType type:", typeof sortType);
    console.log("sortType value:", JSON.stringify(sortType));
    console.log("ReportSortType enum values:", Object.values(ReportSortType));
    
    await generateReportWithSorting(sortType);
    setShowSortDialog(false);
  };

  // Function to generate report with specific sorting - FIXED: Direct call to pdfReportWithEmail
  const generateReportWithSorting = async (sortType: ReportSortType = ReportSortType.BY_NAME) => {
    console.log("=== 🚀 DEBUG generateReportWithSorting - INÍCIO ===");
    console.log("selectedFavorecidos:", selectedFavorecidos);
    console.log("favorecidos disponíveis:", favorecidos.length);
    console.log("workflow:", workflow);
    console.log("sortType:", sortType);

    if (selectedFavorecidos.length === 0) {
      showError("Erro!", "Nenhum favorecido selecionado para gerar relatório.");
      return;
    }

    if (!workflow.convenente) {
      showError("Erro!", "É necessário selecionar um convenente antes de gerar o relatório.");
      setShowWorkflowDialog(true);
      return;
    }

    try {
      // Get selected favorecidos data
      const selectedFavorecidosData = favorecidos.filter(fav => 
        selectedFavorecidos.includes(fav.id)
      );

      console.log("=== 📊 DEBUG selectedFavorecidosData ===");
      console.log("Favorecidos filtrados:", selectedFavorecidosData.length);
      console.log("Primeiro favorecido da lista:", selectedFavorecidosData[0]);
      
      // ENHANCED DEBUG: Log each selected favorecido in detail
      selectedFavorecidosData.forEach((fav, idx) => {
        console.log(`Favorecido ${idx}:`, {
          id: fav.id,
          nome: fav.nome,
          inscricao: fav.inscricao,
          banco: fav.banco,
          agencia: fav.agencia,
          conta: fav.conta,
          tipoConta: fav.tipoConta,
          valorPadrao: fav.valorPadrao,
          // Log all properties to see what's available
          allProperties: Object.keys(fav)
        });
      });

      if (selectedFavorecidosData.length === 0) {
        throw new Error("Nenhum favorecido encontrado após filtro");
      }

      // ENHANCED DEBUG: Log workflow details
      console.log("=== 🔄 DEBUG Workflow Details ===");
      console.log("workflow.valorPagamento:", workflow.valorPagamento);
      console.log("workflow.valorPagamento type:", typeof workflow.valorPagamento);
      console.log("workflow.convenente:", workflow.convenente);
      console.log("workflow.paymentDate:", workflow.paymentDate);
      
      // Convert favorecidos to the format expected by report generation
      console.log("=== 🔄 DEBUG Starting Favorecidos Mapping ===");
      
      const rowData = selectedFavorecidosData.map((fav, index) => {
        console.log(`=== Mapping favorecido ${index}: ${fav.nome} ===`);
        try {
          const mappedData = mapFavorecidoToRowData(fav, index, workflow.valorPagamento);
          console.log(`✅ Successfully mapped favorecido ${index}:`, mappedData);
          return mappedData;
        } catch (error) {
          console.error(`❌ Erro ao mapear favorecido ${index} (${fav.nome}):`, error);
          console.error("Favorecido data:", fav);
          throw new Error(`Erro ao mapear favorecido ${fav.nome}: ${error.message}`);
        }
      });

      console.log("=== 📊 DEBUG: Final RowData ===");
      console.log("Total mapped rows:", rowData.length);
      rowData.forEach((row, idx) => {
        console.log(`Row ${idx}:`, {
          NOME: row.NOME,
          INSCRICAO: row.INSCRICAO,
          BANCO: row.BANCO,
          AGENCIA: row.AGENCIA,
          CONTA: row.CONTA,
          TIPO: row.TIPO,
          VALOR: row.VALOR,
          valorType: typeof row.VALOR
        });
      });

      // Validate data before generating report
      console.log("=== ✅ DEBUG Validating data ===");
      const validationResult = validateFavorecidos(rowData);
      console.log("Validation result:", validationResult);
      
      if (validationResult.errors.length > 0) {
        console.error("❌ Validation errors found:", validationResult.errors);
        // Continue only if there are valid records
        if (validationResult.validRecordsCount === 0) {
          throw new Error("Todos os favorecidos possuem erros de validação");
        }
        console.log(`⚠️ Continuing with ${validationResult.validRecordsCount} valid records out of ${validationResult.totalRecords}`);
      }

      const companyName = workflow.convenente?.razaoSocial || "Empresa";
      const companyCnpj = workflow.convenente?.cnpj || "";
      
      console.log("=== 📤 Final call to handleGenerateReportWithSorting ===");
      console.log("Company info:", { companyName, companyCnpj });
      console.log("Payment date:", workflow.paymentDate);
      console.log("Sort type:", sortType);
      console.log("Row data count:", rowData.length);
      console.log("About to call pdfReportWithEmail.handleGenerateReportWithSorting...");
      
      // Call the PDF generation service
      await pdfReportWithEmail.handleGenerateReportWithSorting(
        rowData,
        false, // cnabFileGenerated = false for report-only mode
        'relatorio_remessa.pdf',
        companyName,
        validateFavorecidos,
        workflow.convenente,
        companyCnpj,
        workflow.paymentDate,
        sortType // Pass the sort type directly
      );
      
      console.log("=== ✅ PDF generation call completed successfully ===");
      
    } catch (error) {
      console.error("❌ Erro ao gerar relatório:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Stack trace:", error.stack);
      showError("Erro!", `Erro ao gerar relatório de remessa: ${error.message}`);
    }
  };

  // FIXED: Open sort dialog directly like in Importar Planilha
  const handleGenerateReportOnly = async () => {
    console.log("=== 🎪 Opening sort dialog for report generation - Por Favorecidos ===");
    setShowSortDialog(true);
  };

  return {
    handleGenerateReportOnly,
    hasConvenente: !!workflow.convenente,
    // Expose sort dialog state
    showSortDialog,
    setShowSortDialog,
    handleSortConfirm,
    // Expose PDF report states and handlers
    showPDFPreviewDialog: pdfReportWithEmail.showPDFPreviewDialog,
    setShowPDFPreviewDialog: pdfReportWithEmail.setShowPDFPreviewDialog,
    reportData: pdfReportWithEmail.reportData,
    showEmailConfigDialog: pdfReportWithEmail.showEmailConfigDialog,
    setShowEmailConfigDialog: pdfReportWithEmail.setShowEmailConfigDialog,
    defaultEmailMessage: pdfReportWithEmail.defaultEmailMessage,
    reportDate: pdfReportWithEmail.reportDate,
    handleSendEmailReport: pdfReportWithEmail.handleSendEmailReport,
    handleEmailSubmit: pdfReportWithEmail.handleEmailSubmit
  };
};
