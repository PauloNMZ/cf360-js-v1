
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
): Promise<{ success: boolean; fileName: string }> => {
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

    // Log workflow data for debugging
    console.log("Service Type in downloadCNABFile:", workflowData.serviceType);
    
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
    
    return { success: true, fileName };
  } catch (error) {
    console.error("Erro ao gerar arquivo CNAB:", error);
    toast.error("Erro ao gerar arquivo CNAB", {
      description: error instanceof Error ? error.message : "Ocorreu um erro ao gerar o arquivo CNAB.",
    });
    return { success: false, fileName: '' };
  }
};

// Process selected rows from the table with validation
export const processSelectedRows = async (
  workflowData: CNABWorkflowData,
  selectedRows: RowData[]
): Promise<{ success: boolean; fileName?: string }> => {
  try {
    if (selectedRows.length === 0) {
      toast.error("Nenhum registro selecionado para processamento");
      return Promise.reject(new Error("Nenhum registro selecionado"));
    }
    
    // Log service type for debugging
    console.log("Service Type in processSelectedRows:", workflowData.serviceType);
    
    // Convert rows to favorecidos with validation
    const { favorecidos, errorRows } = convertAndValidateRows(selectedRows);
    
    if (favorecidos.length === 0) {
      toast.error("Nenhum registro válido para processamento", {
        description: "Todos os registros selecionados possuem erros de validação."
      });
      return Promise.reject(new Error("Nenhum registro válido"));
    }

    // Notify user about any excluded invalid records
    if (errorRows.length > 0) {
      toast.warning(`${errorRows.length} registros com erros foram excluídos do arquivo`, {
        description: `Apenas os ${favorecidos.length} registros válidos serão incluídos no arquivo CNAB.`
      });
    }
    
    // Generate and download the CNAB file with only valid records
    return downloadCNABFile(workflowData, favorecidos);
    
  } catch (error) {
    console.error("Erro ao processar registros selecionados:", error);
    toast.error("Erro ao processar registros", {
      description: error instanceof Error ? error.message : "Ocorreu um erro ao processar os registros."
    });
    return { success: false };
  }
};
