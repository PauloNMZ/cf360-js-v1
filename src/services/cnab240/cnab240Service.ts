
import { saveAs } from 'file-saver';
import { toast } from '@/components/ui/sonner';
import { 
  Favorecido,
  CNABWorkflowData
} from '@/types/cnab240';
import { formatarData, formatarHora } from '@/utils/cnabUtils';
import { GeradorCNAB240 } from './GeradorCNAB240';
import { convertAndValidateRows } from './validationService';
import { RowData } from '@/types/importacao';

// Function to download the generated CNAB file
export const downloadCNABFile = async (
  workflowData: CNABWorkflowData, 
  favorecidos: Favorecido[]
): Promise<void> => {
  try {
    // Validate required data
    if (!workflowData.convenente) {
      throw new Error("Convenente não selecionado para geração do arquivo.");
    }

    if (!workflowData.paymentDate) {
      throw new Error("Data de pagamento não informada.");
    }

    if (favorecidos.length === 0) {
      throw new Error("Nenhum favorecido selecionado para pagamento.");
    }

    // Create CNAB generator
    const gerador = new GeradorCNAB240();
    
    // Generate file
    const blob = await gerador.gerarArquivoRemessa(workflowData, favorecidos);
    
    // Generate a file name based on the current date, time, and convenente information
    const fileName = `Pag_${formatarData(new Date(), "YYYYMMDD")}_${formatarHora(new Date(), "HHMMSS")}_${workflowData.convenente.convenioPag || '1'}.rem`;
    
    // Save to user's disk in specified directory, or use browser download if no directory specified
    saveAs(blob, fileName);
    
    toast.success("Arquivo CNAB gerado com sucesso!", {
      description: `O arquivo ${fileName} foi gerado e está pronto para download.`,
    });
    
    return Promise.resolve();
  } catch (error) {
    console.error("Erro ao gerar arquivo CNAB:", error);
    toast.error("Erro ao gerar arquivo CNAB", {
      description: error instanceof Error ? error.message : "Ocorreu um erro ao gerar o arquivo CNAB.",
    });
    return Promise.reject(error);
  }
};

// Process selected rows from the table with validation
export const processSelectedRows = async (
  workflowData: CNABWorkflowData,
  selectedRows: RowData[]
): Promise<void> => {
  try {
    if (selectedRows.length === 0) {
      toast.error("Nenhum registro selecionado para processamento");
      return Promise.reject(new Error("Nenhum registro selecionado"));
    }
    
    // Convert and validate rows
    const { favorecidos, errorRows } = convertAndValidateRows(selectedRows);
    
    if (favorecidos.length === 0) {
      toast.error("Nenhum registro válido para processamento", {
        description: "Verifique os erros e corrija os dados antes de continuar."
      });
      return Promise.reject(new Error("Nenhum registro válido"));
    }
    
    if (errorRows.length > 0) {
      toast.warning(`${errorRows.length} registros com erros foram ignorados`, {
        description: `Apenas os ${favorecidos.length} registros válidos serão processados.`
      });
    }
    
    // Generate and download the CNAB file
    return downloadCNABFile(workflowData, favorecidos);
    
  } catch (error) {
    console.error("Erro ao processar registros selecionados:", error);
    toast.error("Erro ao processar registros", {
      description: error instanceof Error ? error.message : "Ocorreu um erro ao processar os registros."
    });
    return Promise.reject(error);
  }
};
