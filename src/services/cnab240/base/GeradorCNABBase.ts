
import { EmpresaConfig, Favorecido, CNABWorkflowData } from '@/types/cnab240';
import { IGeradorCNAB } from '../interfaces/IGeradorCNAB';
import { inicializarVariaveis, formatarDadosEmpresa } from '../utils/configUtils';
import { validarCNPJ } from '@/utils/cnabUtils';

export abstract class GeradorCNABBase implements IGeradorCNAB {
  protected totalLinhasArquivo: number = 0;
  protected seqLote: number = 0;
  protected somaValoresBBcc: number = 0;
  protected somaValoresBBpoup: number = 0;
  protected somaValoresDemais: number = 0;
  protected config: EmpresaConfig;
  protected favorecidos: Favorecido[] = [];
  protected conteudoArquivo: string[] = [];
  protected nomeArquivo: string = "";

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

  public inicializarVariaveis(config: any): void {
    this.config = inicializarVariaveis(config);
  }

  abstract gerarArquivoRemessa(workflowData: CNABWorkflowData, favorecidos: Favorecido[]): Promise<Blob>;
  
  // Validate remittance data
  protected validarDadosRemessa(): boolean {
    if (!this.config.nomeEmpresa || !this.config.cnpj) {
      console.error("Nome da empresa ou CNPJ não informados");
      return false;
    }
    return true;
  }

  // Write to the file
  protected escreverNoArquivo(conteudo: string): void {
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
