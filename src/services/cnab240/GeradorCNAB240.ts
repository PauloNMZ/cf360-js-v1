
import { EmpresaConfig, Favorecido, CNABWorkflowData } from '@/types/cnab240';
import { validarCNPJ } from '@/utils/cnabUtils';
import { formatarDadosEmpresa } from './utils/configUtils';
import { gerarHeaderArquivo, gerarTrailerArquivo } from './generators/headerGenerators';
import { GeradorCNABBase } from './base/GeradorCNABBase';
import { LoteProcessor } from './processors/loteProcessor';

// Class for generating CNAB240 files
export class GeradorCNAB240 extends GeradorCNABBase {
  // Main method to generate the remittance file
  public gerarArquivoRemessa(workflowData: CNABWorkflowData, favorecidos: Favorecido[]): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        console.log("Workflow data received:", JSON.stringify(workflowData, null, 2));
        
        // Setup the configuration from workflow data
        const config = {
          nomeEmpresa: workflowData.convenente?.razaoSocial || '',
          cnpj: workflowData.convenente?.cnpj || '',
          endereco: workflowData.convenente?.endereco || '',
          agencia: workflowData.convenente?.agencia || '',
          conta: workflowData.convenente?.conta || '',
          convenioPag: workflowData.convenente?.convenioPag || '',
          dataPagamento: workflowData.paymentDate || new Date(),
          serviceType: workflowData.serviceType // Make sure to pass the service type
        };
        
        console.log("Config created from workflow:", JSON.stringify(config, null, 2));
        
        // Initialize variables
        this.inicializarVariaveis(config);
        
        // Validate data before proceeding
        if (!this.validarDadosRemessa()) {
          reject(new Error("Dados inválidos para geração do arquivo de remessa"));
          return;
        }

        // Initialize control variables
        this.totalLinhasArquivo = 0;
        this.seqLote = 0;
        this.somaValoresBBcc = 0;
        this.somaValoresBBpoup = 0;
        this.somaValoresDemais = 0;
        this.favorecidos = favorecidos;
        this.conteudoArquivo = [];

        // Format company data
        this.config = formatarDadosEmpresa(this.config);
        
        console.log("Final config after formatting:", JSON.stringify(this.config, null, 2));

        // Basic validations
        if (!validarCNPJ(this.config.cnpj)) {
          reject(new Error("CNPJ da empresa inválido!"));
          return;
        }

        if (this.config.dataPagamento.trim() === "") {
          reject(new Error("Data de pagamento não informada na configuração!"));
          return;
        }

        // Generate file content
        this.gerarConteudoArquivo();
        
        // Create blob from file content
        const blob = new Blob([this.conteudoArquivo.join('\r\n')], { type: 'text/plain;charset=utf-8' });
        
        // Resolve with the blob
        resolve(blob);
        
      } catch (error) {
        console.error("Erro ao gerar arquivo de remessa:", error);
        reject(error);
      }
    });
  }

  // Generate file content
  private gerarConteudoArquivo(): void {
    // Generate Header of the File
    this.gerarHeaderArquivo();

    // Use the LoteProcessor to process all types of recipients
    const loteProcessor = new LoteProcessor(
      this.config, 
      this.favorecidos, 
      this.conteudoArquivo, 
      this.totalLinhasArquivo
    );
    
    loteProcessor.processarTodosOsTipos();
    
    // Update control variables
    this.seqLote = loteProcessor.getSeqLote();
    this.totalLinhasArquivo = loteProcessor.getTotalLinhasArquivo();

    // Generate Trailer of the File
    this.gerarTrailerArquivo();
  }

  // Generate the file header
  private gerarHeaderArquivo(): void {
    const header = gerarHeaderArquivo(this.config);
    this.escreverNoArquivo(header);
  }

  // Generate the file trailer
  private gerarTrailerArquivo(): void {
    // Important: Add 1 to totalLinhasArquivo to include the trailer itself in the count
    // This fixes the validation error where the count should be 116 but was 115
    const totalLinhasComTrailer = this.totalLinhasArquivo + 1;
    const trailerArquivo = gerarTrailerArquivo(this.seqLote, totalLinhasComTrailer);
    this.escreverNoArquivo(trailerArquivo);
  }
}
