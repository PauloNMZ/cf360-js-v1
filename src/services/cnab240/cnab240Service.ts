
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
import { getNextSequenceNumber } from './utils/sequenceUtils';

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
    
    // Get next sequence number
    const sequenceNumber = getNextSequenceNumber();
    
    // Generate a file name based on the current date, time, convenente information, and sequence number
    const fileName = `Pag_${formatarData(new Date(), "YYYYMMDD")}_${formatarHora(new Date(), "HHMMSS")}_${workflowData.convenente.convenioPag || '1'}_${sequenceNumber}.rem`;
    
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
    
    // Convert rows to favorecidos
    const { favorecidos, errorRows } = convertAndValidateRows(selectedRows);
    
    if (favorecidos.length === 0) {
      toast.error("Nenhum registro para processamento", {
        description: "Selecione pelo menos um registro antes de continuar."
      });
      return Promise.reject(new Error("Nenhum registro selecionado"));
    }

    // Warn about invalid records but continue processing
    const invalidCount = favorecidos.filter(f => !f.isValid).length;
    if (invalidCount > 0) {
      toast.warning(`${invalidCount} registros com erros serão incluídos no arquivo`, {
        description: `Verifique se a instituição financeira aceita registros com erros de validação.`
      });
    }
    
    // Generate and download the CNAB file with all records
    return downloadCNABFile(workflowData, favorecidos);
    
  } catch (error) {
    console.error("Erro ao processar registros selecionados:", error);
    toast.error("Erro ao processar registros", {
      description: error instanceof Error ? error.message : "Ocorreu um erro ao processar os registros."
    });
    return Promise.reject(error);
  }
};
