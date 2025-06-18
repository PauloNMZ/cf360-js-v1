
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
      selectedFavorecidosData.forEach((fav, idx) => {
        console.log(`Favorecido ${idx}:`, {
          id: fav.id,
          nome: fav.nome,
          valorPadrao: fav.valorPadrao,
          banco: fav.banco,
          agencia: fav.agencia,
          conta: fav.conta
        });
      });

      if (selectedFavorecidosData.length === 0) {
        throw new Error("Nenhum favorecido encontrado após filtro");
      }

      // CORRIGIDO: Convert favorecidos to the format expected by report generation, passando valor do workflow
      console.log("=== 🔄 DEBUG Mapeando favorecidos ===");
      console.log("Valor do workflow.valorPagamento:", workflow.valorPagamento);
      
      const rowData = selectedFavorecidosData.map((fav, index) => {
        try {
          return mapFavorecidoToRowData(fav, index, workflow.valorPagamento);
        } catch (error) {
          console.error(`Erro ao mapear favorecido ${fav.nome}:`, error);
          throw error;
        }
      });

      console.log("=== 📊 DEBUG: RowData with corrected values ===");
      rowData.forEach((row, idx) => {
        console.log(`Favorecido ${idx}: ${row.NOME} - Valor: ${row.VALOR} (tipo: ${typeof row.VALOR})`);
      });

      // ADDED: Validação antes de gerar o relatório
      console.log("=== ✅ DEBUG Validando dados ===");
      const validationResult = validateFavorecidos(rowData);
      if (validationResult.errors.length > 0) {
        console.error("Erros de validação encontrados:", validationResult.errors);
        // Continuar apenas se houver registros válidos
        if (validationResult.validRecordsCount === 0) {
          throw new Error("Todos os favorecidos possuem erros de validação");
        }
      }

      const companyName = workflow.convenente?.razaoSocial || "Empresa";
      const companyCnpj = workflow.convenente?.cnpj || "";
      
      console.log("=== 📤 Calling handleGenerateReportWithSorting - Por Favorecidos ===");
      console.log("About to call with sortType:", sortType);
      console.log("Company info:", { companyName, companyCnpj });
      console.log("Payment date:", workflow.paymentDate);
      
      // FIXED: Use the same pattern as Importar Planilha module
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
      
      console.log("=== ✅ DEBUG generateReportWithSorting - CONCLUÍDO ===");
      
    } catch (error) {
      console.error("❌ Erro ao gerar relatório:", error);
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
