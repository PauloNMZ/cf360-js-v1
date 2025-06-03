
import { useNotificationModalContext } from "@/components/ui/NotificationModalProvider";

interface UseLancamentoFavorecidosReportProps {
  selectedFavorecidos: string[];
  workflow: any;
  handleGenerateOnlyReport: () => Promise<void>;
  setShowWorkflowDialog: (show: boolean) => void;
}

export const useLancamentoFavorecidosReport = ({
  selectedFavorecidos,
  workflow,
  handleGenerateOnlyReport,
  setShowWorkflowDialog
}: UseLancamentoFavorecidosReportProps) => {
  const { showError, showInfo } = useNotificationModalContext();

  const handleGenerateReportOnly = async () => {
    if (selectedFavorecidos.length === 0) {
      showError("Erro!", "Nenhum favorecido selecionado para gerar relatório.");
      return;
    }

    if (!workflow.convenente) {
      showError("Erro!", "É necessário selecionar um convenente antes de gerar o relatório.");
      setShowWorkflowDialog(true);
      return;
    }

    console.log("Gerando relatório para favorecidos selecionados:", selectedFavorecidos);
    showInfo("Gerando...", "Gerando relatório de remessa...");
    
    try {
      await handleGenerateOnlyReport();
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      showError("Erro!", "Erro ao gerar relatório de remessa.");
    }
  };

  return {
    handleGenerateReportOnly,
    hasConvenente: !!workflow.convenente
  };
};
