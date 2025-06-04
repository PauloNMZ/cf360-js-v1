
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
    console.log("📁 downloadCNABFile called with:", { workflowData, favorecidos });

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

    console.log("✅ All validations passed, creating CNAB generator...");

    // Create CNAB generator
    const gerador = new GeradorCNAB240();
    
    console.log("🔄 Generating CNAB file...");
    
    // Generate file
    const blob = await gerador.gerarArquivoRemessa(workflowData, favorecidos);
    
    console.log("✅ CNAB file blob generated:", blob);
    
    // Get next sequence number
    const sequenceNumber = getNextSequenceNumber();
    
    // Generate a file name based on the current date, time, convenente information, and sequence number
    const fileName = `Pag_${formatarData(new Date(), "YYYYMMDD")}_${formatarHora(new Date(), "HHMMSS")}_${workflowData.convenente.convenioPag || '1'}_${sequenceNumber}.rem`;
    
    console.log("📄 Generated file name:", fileName);
    
    // Save to user's disk in specified directory, or use browser download if no directory specified
    saveAs(blob, fileName);
    
    console.log("💾 File saved with saveAs");
    
    toast.success("Arquivo CNAB gerado com sucesso!", {
      description: `O arquivo ${fileName} foi gerado e está pronto para download.`,
    });
    
    return { success: true, fileName };
  } catch (error) {
    console.error("❌ Error generating CNAB file:", error);
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
    console.log("🔄 processSelectedRows called with:", { workflowData, selectedRows });

    if (selectedRows.length === 0) {
      console.log("❌ No rows selected");
      toast.error("Nenhum registro selecionado para processamento");
      return Promise.reject(new Error("Nenhum registro selecionado"));
    }
    
    console.log("✅ Rows selected, converting and validating...");
    
    // Convert rows to favorecidos with validation
    const { favorecidos, errorRows } = convertAndValidateRows(selectedRows);
    
    console.log("Conversion result:", { favorecidos, errorRows });
    
    if (favorecidos.length === 0) {
      console.log("❌ No valid favorecidos after conversion");
      toast.error("Nenhum registro válido para processamento", {
        description: "Todos os registros selecionados possuem erros de validação."
      });
      return Promise.reject(new Error("Nenhum registro válido"));
    }

    // Notify user about any excluded invalid records
    if (errorRows.length > 0) {
      console.log(`⚠️ ${errorRows.length} rows with errors excluded`);
      toast.warning(`${errorRows.length} registros com erros foram excluídos do arquivo`, {
        description: `Apenas os ${favorecidos.length} registros válidos serão incluídos no arquivo CNAB.`
      });
    }
    
    console.log("🔄 Calling downloadCNABFile...");
    
    // Generate and download the CNAB file with only valid records
    return downloadCNABFile(workflowData, favorecidos);
    
  } catch (error) {
    console.error("❌ Error processing selected rows:", error);
    toast.error("Erro ao processar registros", {
      description: error instanceof Error ? error.message : "Ocorreu um erro ao processar os registros."
    });
    return { success: false };
  }
};
