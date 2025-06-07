
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
    console.log("=== DEBUG handleSortConfirm - FIXED ===");
    console.log("sortType received:", sortType);
    console.log("sortType type:", typeof sortType);
    
    await generateReportWithSorting(sortType);
    setShowSortDialog(false);
  };

  // Function to generate report with specific sorting - FIXED: Direct call to pdfReportWithEmail
  const generateReportWithSorting = async (sortType: ReportSortType = ReportSortType.BY_NAME) => {
    if (selectedFavorecidos.length === 0) {
      showError("Erro!", "Nenhum favorecido selecionado para gerar relatório.");
      return;
    }

    if (!workflow.convenente) {
      showError("Erro!", "É necessário selecionar um convenente antes de gerar o relatório.");
      setShowWorkflowDialog(true);
      return;
    }

    console.log("=== DEBUG generateReportWithSorting - FIXED ===");
    console.log("Gerando relatório para favorecidos selecionados:", selectedFavorecidos);
    console.log("Tipo de ordenação recebido:", sortType);
    
    try {
      // Get selected favorecidos data
      const selectedFavorecidosData = favorecidos.filter(fav => 
        selectedFavorecidos.includes(fav.id)
      );

      if (selectedFavorecidosData.length === 0) {
        throw new Error("Nenhum favorecido encontrado");
      }

      // Convert favorecidos to the format expected by report generation
      const rowData = selectedFavorecidosData.map((fav, index) => 
        mapFavorecidoToRowData(fav, index)
      );

      const companyName = workflow.convenente?.razaoSocial || "Empresa";
      const companyCnpj = workflow.convenente?.cnpj || "";
      
      console.log("=== Calling handleGenerateReportWithSorting - FIXED ===");
      console.log("About to call with sortType:", sortType);
      
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
      
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      showError("Erro!", "Erro ao gerar relatório de remessa.");
    }
  };

  // FIXED: Open sort dialog directly like in Importar Planilha
  const handleGenerateReportOnly = async () => {
    console.log("Opening sort dialog for report generation - FIXED");
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
