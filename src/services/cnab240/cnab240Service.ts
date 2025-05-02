
import { saveAs } from 'file-saver';
import { toast } from '@/components/ui/sonner';
import { 
  Favorecido,
  CNABWorkflowData
} from '@/types/cnab240';
import { formatarData, formatarHora } from '@/utils/cnabUtils';
import { GeradorCNAB240 } from './GeradorCNAB240';

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
    
    toast({
      title: "Arquivo CNAB gerado com sucesso!",
      description: `O arquivo ${fileName} foi gerado e está pronto para download.`,
    });
    
    return Promise.resolve();
  } catch (error) {
    console.error("Erro ao gerar arquivo CNAB:", error);
    toast({
      title: "Erro ao gerar arquivo CNAB",
      description: error instanceof Error ? error.message : "Ocorreu um erro ao gerar o arquivo CNAB.",
      variant: "destructive",
    });
    return Promise.reject(error);
  }
};
