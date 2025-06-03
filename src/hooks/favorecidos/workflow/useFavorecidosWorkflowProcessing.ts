
import { FavorecidoData } from '@/types/favorecido';
import { processSelectedRows } from '@/services/cnab240/cnab240Service';
import { useNotificationModalContext } from '@/components/ui/NotificationModalProvider';
import { mapFavorecidoToRowData, validateFavorecidos } from './favorecidosWorkflowUtils';

interface UseFavorecidosWorkflowProcessingProps {
  selectedFavorecidos: string[];
  favorecidos: Array<FavorecidoData & { id: string }>;
  workflow: any;
  setShowWorkflowDialog: (show: boolean) => void;
  setCnabFileGenerated: (generated: boolean) => void;
  setCnabFileName: (fileName: string) => void;
  handleGenerateReport: (
    selectedRows: any[], 
    cnabFileGenerated: boolean, 
    cnabFileName: string,
    companyName: string,
    validateFavorecidos: any,
    convenente: any,
    companyCnpj: string,
    paymentDate: Date
  ) => Promise<any>;
}

export const useFavorecidosWorkflowProcessing = ({
  selectedFavorecidos,
  favorecidos,
  workflow,
  setShowWorkflowDialog,
  setCnabFileGenerated,
  setCnabFileName,
  handleGenerateReport
}: UseFavorecidosWorkflowProcessingProps) => {
  const { showSuccess, showInfo, showError } = useNotificationModalContext();

  const handleSubmitWorkflow = async () => {
    console.log("useFavorecidosWorkflowProcessing - handleSubmitWorkflow called");
    
    // Validate convenente is selected
    if (!workflow.convenente) {
      showError("Erro!", "É necessário selecionar um convenente para gerar o arquivo CNAB.");
      return;
    }

    setShowWorkflowDialog(false);
    
    try {
      // Get selected favorecidos data
      const selectedFavorecidosData = favorecidos.filter(fav => 
        selectedFavorecidos.includes(fav.id)
      );

      if (selectedFavorecidosData.length === 0) {
        throw new Error("Nenhum favorecido selecionado");
      }

      console.log("Selected favorecidos data:", selectedFavorecidosData);

      // Convert favorecidos to the format expected by processSelectedRows
      const rowData = selectedFavorecidosData.map((fav, index) => 
        mapFavorecidoToRowData(fav, index)
      );

      console.log("Mapped row data:", rowData);

      showInfo("Processando...", `Processando ${selectedFavorecidosData.length} favorecidos...`);
      
      // Process the favorecidos using the existing service
      const result = await processSelectedRows(workflow, rowData);
      
      if (result.success) {
        setCnabFileGenerated(true);
        setCnabFileName(result.fileName || 'arquivo.rem');
        
        showSuccess("Sucesso!", `Arquivo gerado com sucesso: ${result.fileName || 'arquivo.rem'}`);
        
        // Automatically generate report after CNAB file is created
        setTimeout(async () => {
          const companyName = workflow.convenente?.razaoSocial || "Empresa";
          const companyCnpj = workflow.convenente?.cnpj || "";
          
          await handleGenerateReport(
            rowData,
            true, // cnabFileGenerated
            result.fileName || 'arquivo.rem',
            companyName,
            validateFavorecidos,
            workflow.convenente,
            companyCnpj,
            workflow.paymentDate
          );
        }, 500);
      }
      
    } catch (error) {
      console.error("Erro ao processar favorecidos:", error);
      showError("Erro!", error instanceof Error ? error.message : "Erro ao processar favorecidos");
    }
  };

  const handleGenerateOnlyReport = async () => {
    console.log("useFavorecidosWorkflowProcessing - handleGenerateOnlyReport called");
    
    if (!workflow.convenente) {
      showError("Erro!", "É necessário selecionar um convenente para gerar o relatório.");
      return;
    }

    try {
      // Get selected favorecidos data
      const selectedFavorecidosData = favorecidos.filter(fav => 
        selectedFavorecidos.includes(fav.id)
      );

      if (selectedFavorecidosData.length === 0) {
        throw new Error("Nenhum favorecido selecionado");
      }

      // Convert favorecidos to the format expected by report generation
      const rowData = selectedFavorecidosData.map((fav, index) => 
        mapFavorecidoToRowData(fav, index)
      );

      const companyName = workflow.convenente?.razaoSocial || "Empresa";
      const companyCnpj = workflow.convenente?.cnpj || "";
      
      // Generate report without CNAB file
      await handleGenerateReport(
        rowData,
        false, // cnabFileGenerated = false for report-only mode
        'relatorio_remessa.pdf',
        companyName,
        validateFavorecidos,
        workflow.convenente,
        companyCnpj,
        workflow.paymentDate
      );
      
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      showError("Erro!", error instanceof Error ? error.message : "Erro ao gerar relatório");
    }
  };

  return {
    handleSubmitWorkflow,
    handleGenerateOnlyReport
  };
};
