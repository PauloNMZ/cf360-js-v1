import { EmpresaConfig, Favorecido, CNABWorkflowData } from '@/types/cnab240';
import { validarCNPJ } from '@/utils/cnabUtils';
import { inicializarVariaveis, formatarDadosEmpresa } from './utils/configUtils';
import { gerarHeaderArquivo, gerarTrailerArquivo } from './generators/headerGenerators';
import { processarLote, filtrarFavorecidosPorTipo } from './processors/batchProcessor';

// Class for generating CNAB240 files
export class GeradorCNAB240 {
  private totalLinhasArquivo: number = 0;
  private seqLote: number = 0;
  private somaValoresBBcc: number = 0;
  private somaValoresBBpoup: number = 0;
  private somaValoresDemais: number = 0;
  private config: EmpresaConfig;
  private favorecidos: Favorecido[] = [];
  private conteudoArquivo: string[] = [];
  private nomeArquivo: string = "";

  constructor() {
    this.config = {
      nomeEmpresa: "",
      cnpj: "",
      endereco: "",
      agencia: "",
      dvAgencia: "",
      conta: "",
      dvConta: "",
      nrConvenio: "",
      codProduto: "0126", // Fixed product code for BB
      nrRemessa: "",
      dataPagamento: "",
      nrDocumento: ""
    };
  }

  // Initialize variables with configuration data
  public inicializarVariaveis(config: any): void {
    this.config = inicializarVariaveis(config);
  }

  // Main method to generate the remittance file
  public gerarArquivoRemessa(workflowData: CNABWorkflowData, favorecidos: Favorecido[]): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        // Setup the configuration from workflow data
        const config = {
          nomeEmpresa: workflowData.convenente?.razaoSocial || '',
          cnpj: workflowData.convenente?.cnpj || '',
          endereco: workflowData.convenente?.endereco || '',
          agencia: workflowData.convenente?.agencia || '',
          conta: workflowData.convenente?.conta || '',
          convenioPag: workflowData.convenente?.convenioPag || '',
          dataPagamento: workflowData.paymentDate || new Date()
        };
        
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

  // Validate remittance data
  private validarDadosRemessa(): boolean {
    if (!this.config.nomeEmpresa || !this.config.cnpj) {
      console.error("Nome da empresa ou CNPJ não informados");
      return false;
    }
    return true;
  }

  // Generate file content
  private gerarConteudoArquivo(): void {
    // Generate Header of the File
    this.gerarHeaderArquivo();

    // Process recipients by type
    this.processarFavorecidosPorTipo("01", "BB Conta Corrente");
    this.processarFavorecidosPorTipo("05", "BB Poupança");
    this.processarFavorecidosPorTipo("03", "Outros Bancos");

    // Generate Trailer of the File
    this.gerarTrailerArquivo();
  }

  // Process recipients by type
  private processarFavorecidosPorTipo(tipoLancamento: string, descricaoTipo: string): void {
    try {
      // Filter recipients by type
      const favorecidosFiltrados = filtrarFavorecidosPorTipo(this.favorecidos, tipoLancamento);

      // Check if there are recipients of this type
      if (favorecidosFiltrados.length === 0) {
        console.log(`Nenhum favorecido do tipo ${descricaoTipo} encontrado.`);
        return;
      }

      // Increment batch sequence
      this.seqLote++;

      // Process batch
      const resultado = processarLote(this.config, favorecidosFiltrados, tipoLancamento, this.seqLote);
      
      // Add batch lines to file content
      this.conteudoArquivo.push(...resultado.linhas);
      
      // Update line count
      this.totalLinhasArquivo += resultado.linhas.length;

      // Update sum of values according to type
      switch (tipoLancamento) {
        case "01": this.somaValoresBBcc = resultado.somaValores; break;
        case "05": this.somaValoresBBpoup = resultado.somaValores; break;
        case "03": this.somaValoresDemais = resultado.somaValores; break;
      }
    } catch (error) {
      console.error(`Erro ao processar favorecidos do tipo ${descricaoTipo}:`, error);
    }
  }

  // Generate the file header
  private gerarHeaderArquivo(): void {
    const header = gerarHeaderArquivo(this.config);
    this.escreverNoArquivo(header);
  }

  // Generate the file trailer
  private gerarTrailerArquivo(): void {
    const trailerArquivo = gerarTrailerArquivo(this.seqLote, this.totalLinhasArquivo);
    this.escreverNoArquivo(trailerArquivo);
  }

  // Write to the file
  private escreverNoArquivo(conteudo: string): void {
    // Add content to the array
    this.conteudoArquivo.push(conteudo);
    
    // Increment line counter
    this.totalLinhasArquivo++;
  }

  // Get file name
  public getNomeArquivo(): string {
    return this.nomeArquivo;
  }

  // Get file content
  public getConteudoArquivo(): string[] {
    return this.conteudoArquivo;
  }
}
