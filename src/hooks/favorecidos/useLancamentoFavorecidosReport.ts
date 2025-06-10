
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

  console.log("=== 📊 useLancamentoFavorecidosReport INITIALIZED ===");
  console.log("selectedFavorecidos:", selectedFavorecidos);
  console.log("favorecidos count:", favorecidos.length);
  console.log("workflow:", workflow);

  // Function to handle the sort dialog confirmation
  const handleSortConfirm = async (sortType: ReportSortType) => {
    console.log("=== 🎯 DEBUG handleSortConfirm - Por Favorecidos Module ===");
    console.log("sortType received:", sortType);
    console.log("sortType type:", typeof sortType);
    console.log("sortType value:", JSON.stringify(sortType));
    console.log("ReportSortType enum values:", Object.values(ReportSortType));
    
    await generateReportWithSorting(sortType);
    setShowSortDialog(false);
  };

  // Function to generate report with specific sorting
  const generateReportWithSorting = async (sortType: ReportSortType = ReportSortType.BY_NAME) => {
    console.log("=== 🚀 generateReportWithSorting START - Por Favorecidos ===");
    console.log("sortType received:", sortType);
    console.log("selectedFavorecidos:", selectedFavorecidos);
    console.log("favorecidos available:", favorecidos.length);
    console.log("workflow convenente:", workflow.convenente);
    
    if (selectedFavorecidos.length === 0) {
      console.log("❌ No favorecidos selected");
      showError("Erro!", "Nenhum favorecido selecionado para gerar relatório.");
      return;
    }

    if (!workflow.convenente) {
      console.log("❌ No convenente selected");
      showError("Erro!", "É necessário selecionar um convenente antes de gerar o relatório.");
      setShowWorkflowDialog(true);
      return;
    }

    console.log("=== 🚀 DEBUG generateReportWithSorting - Por Favorecidos ===");
    console.log("Gerando relatório para favorecidos selecionados:", selectedFavorecidos);
    console.log("Tipo de ordenação recebido:", sortType);
    console.log("sortType stringified:", JSON.stringify(sortType));
    console.log("Workflow valor disponível:", workflow.valorPagamento);
    
    try {
      // Get selected favorecidos data
      const selectedFavorecidosData = favorecidos.filter(fav => 
        selectedFavorecidos.includes(fav.id)
      );

      console.log("Selected favorecidos data:", selectedFavorecidosData);

      if (selectedFavorecidosData.length === 0) {
        throw new Error("Nenhum favorecido encontrado");
      }

      // Convert favorecidos to the format expected by report generation
      const rowData = selectedFavorecidosData.map((fav, index) => 
        mapFavorecidoToRowData(fav, index, workflow.valorPagamento)
      );

      console.log("=== 📊 DEBUG: RowData with corrected values ===");
      rowData.forEach((row, idx) => {
        console.log(`Favorecido ${idx}: ${row.NOME} - Valor: ${row.VALOR}`);
      });

      const companyName = workflow.convenente?.razaoSocial || "Empresa";
      const companyCnpj = workflow.convenente?.cnpj || "";
      
      console.log("=== 📤 Calling handleGenerateReportWithSorting - Por Favorecidos ===");
      console.log("About to call with sortType:", sortType);
      console.log("sortType before call:", JSON.stringify(sortType));
      console.log("rowData count:", rowData.length);
      console.log("companyName:", companyName);
      console.log("paymentDate:", workflow.paymentDate);
      
      // Use the same pattern as Importar Planilha module
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
      
      console.log("=== ✅ Report generation completed successfully ===");
      
    } catch (error) {
      console.error("❌ Erro ao gerar relatório:", error);
      showError("Erro!", "Erro ao gerar relatório de remessa.");
    }
  };

  // Open sort dialog directly like in Importar Planilha
  const handleGenerateReportOnly = async () => {
    console.log("=== 🎪 handleGenerateReportOnly CALLED - Por Favorecidos ===");
    console.log("About to open sort dialog");
    console.log("selectedFavorecidos:", selectedFavorecidos);
    console.log("favorecidos available:", favorecidos.length);
    console.log("workflow state:", workflow);
    
    // Validation before opening sort dialog
    if (selectedFavorecidos.length === 0) {
      console.log("❌ No favorecidos selected - showing error");
      showError("Erro!", "Nenhum favorecido selecionado para gerar relatório.");
      return;
    }

    if (!workflow.convenente) {
      console.log("❌ No convenente selected - showing error and workflow dialog");
      showError("Erro!", "É necessário selecionar um convenente antes de gerar o relatório.");
      setShowWorkflowDialog(true);
      return;
    }

    console.log("✅ All validations passed - opening sort dialog");
    setShowSortDialog(true);
    console.log("Sort dialog should now be open");
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
