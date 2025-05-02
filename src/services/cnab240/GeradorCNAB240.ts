
import { 
  COD_BB, 
  NOME_BB, 
  LAYOUT_VERSAO, 
  TIPO_SERVICO_PAGAMENTO, 
  TIPO_OPERACAO, 
  MOEDA_BRL,
  EmpresaConfig,
  Favorecido,
  CNABWorkflowData
} from '@/types/cnab240';
import {
  ajustarTamanho,
  retirarCHR,
  formatarData,
  formatarHora,
  strZero,
  formatarValorCNABPreciso,
  formatarNomeFavorecido,
  formatarEnderecoCompleto,
  semAcento,
  validarCNPJ
} from '@/utils/cnabUtils';
import { gravarSegmentoA } from './segmentos/segmentoA';
import { gravarSegmentoB } from './segmentos/segmentoB';

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
      codProduto: "0126",
      nrRemessa: "",
      dataPagamento: "",
      nrDocumento: ""
    };
  }

  // Initialize variables with configuration data
  public inicializarVariaveis(config: any): void {
    this.config.nomeEmpresa = config.nomeEmpresa || '';
    this.config.cnpj = retirarCHR(config.cnpj || '');
    this.config.endereco = config.endereco || '';
    this.config.agencia = config.agencia || '';
    this.config.dvAgencia = config.dvAgencia || '';
    this.config.conta = config.conta || '';
    this.config.dvConta = config.dvConta || '';
    this.config.nrConvenio = config.convenioPag || '';
    this.config.codProduto = "0126";
    this.config.nrRemessa = "1"; // Could be incremented based on stored value
    
    // Format payment date if provided
    if (config.dataPagamento && config.dataPagamento instanceof Date) {
      this.config.dataPagamento = formatarData(config.dataPagamento, "DDMMYYYY");
    } else {
      this.config.dataPagamento = formatarData(new Date(), "DDMMYYYY");
    }
    
    this.config.nrDocumento = "1"; // Could be incremented based on stored value
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
          dvAgencia: '',  // Should be provided or extracted
          conta: workflowData.convenente?.conta || '',
          dvConta: '',  // Should be provided or extracted
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

        // Format company name and address
        this.config.nomeEmpresa = ajustarTamanho(semAcento(this.config.nomeEmpresa.toUpperCase().trim()), 30);
        this.config.endereco = formatarEnderecoCompleto(config);

        // Basic validations
        if (!validarCNPJ(this.config.cnpj)) {
          reject(new Error("CNPJ da empresa inválido!"));
          return;
        }

        if (this.config.dataPagamento.trim() === "") {
          reject(new Error("Data de pagamento não informada na configuração!"));
          return;
        }

        // Create file name
        this.nomeArquivo = `Pag_${formatarData(new Date(), "YYYYMMDD")}_${formatarHora(new Date(), "HHMMSS")}_${this.config.nrRemessa}.rem`;
        
        // Generate Header of the File
        this.gerarHeaderArquivo();

        // Process recipients by type
        this.processarFavorecidosPorTipo("01", "BB Conta Corrente");
        this.processarFavorecidosPorTipo("05", "BB Poupança");
        this.processarFavorecidosPorTipo("03", "Outros Bancos");

        // Generate Trailer of the File
        this.gerarTrailerArquivo();

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

  // Process recipients by type
  private processarFavorecidosPorTipo(tipoLancamento: string, descricaoTipo: string): void {
    try {
      // Filter recipients by type
      let favorecidosFiltrados: Favorecido[] = [];
      
      switch (tipoLancamento) {
        case "01": // BB Conta Corrente
          favorecidosFiltrados = this.favorecidos.filter(f => f.tipo.toUpperCase().trim() === "CC" && f.banco === "001");
          break;
        case "05": // BB Poupança
          favorecidosFiltrados = this.favorecidos.filter(f => f.tipo.toUpperCase().trim() === "PP" && f.banco === "001");
          break;
        case "03": // Outros Bancos
          favorecidosFiltrados = this.favorecidos.filter(f => f.banco !== "001");
          break;
      }

      // Check if there are recipients of this type
      if (favorecidosFiltrados.length === 0) {
        console.log(`Nenhum favorecido do tipo ${descricaoTipo} encontrado.`);
        return;
      }

      // Increment batch sequence
      this.seqLote++;

      // Write batch header
      this.gravarHeaderLote(
        strZero(this.seqLote.toString(), 4),
        tipoLancamento
      );

      // Initialize variables for record control and values
      let seqRegistro = 0;
      let somaValores = 0;

      // Process each recipient
      for (const favorecido of favorecidosFiltrados) {
        // Increment record sequence
        seqRegistro++;

        // Get payment value
        const valorPagamento = favorecido.valor;

        // Write segment A using imported function
        const segmentoA = gravarSegmentoA(
          COD_BB,
          strZero(this.seqLote.toString(), 4),
          seqRegistro,
          tipoLancamento,
          favorecido.nome,
          favorecido.inscricao,
          favorecido.banco,
          favorecido.agencia,
          favorecido.conta,
          valorPagamento,
          this.config.dataPagamento,
          this.config.nrDocumento,
          MOEDA_BRL
        );
        
        this.escreverNoArquivo(segmentoA);

        // Increment record sequence
        seqRegistro++;

        // Write segment B using imported function
        const segmentoB = gravarSegmentoB(
          COD_BB,
          strZero(this.seqLote.toString(), 4),
          seqRegistro,
          favorecido.inscricao,
          valorPagamento
        );
        
        this.escreverNoArquivo(segmentoB);

        // Accumulate value for trailer
        somaValores += valorPagamento;
      }

      // Update sum of values according to type
      switch (tipoLancamento) {
        case "01": this.somaValoresBBcc = somaValores; break;
        case "05": this.somaValoresBBpoup = somaValores; break;
        case "03": this.somaValoresDemais = somaValores; break;
      }

      // Write batch trailer
      this.gravarTrailerLote(
        strZero(this.seqLote.toString(), 4),
        seqRegistro + 2,
        somaValores
      );
    } catch (error) {
      console.error(`Erro ao processar favorecidos do tipo ${descricaoTipo}:`, error);
    }
  }

  // Generate the file header
  private gerarHeaderArquivo(): void {
    // Format current date and time
    const dataAtual = formatarData(new Date(), "DDMMYYYY");
    const horaAtual = formatarHora(new Date(), "HHMMSS");

    // Build file header
    let header = "";
    
    header += ajustarTamanho(COD_BB, 3);                                      // Bank code
    header += ajustarTamanho("0000", 4);                                      // Service batch
    header += "0";                                                           // Record type
    header += ajustarTamanho("", 9);                                          // FEBRABAN exclusive use
    header += "2";                                                           // Registration type (2=CNPJ)
    header += ajustarTamanho(this.config.cnpj, 14, "0", true);                // Registration number
    header += ajustarTamanho(this.config.nrConvenio, 9, "0", true);           // Agreement
    header += ajustarTamanho(this.config.codProduto, 4);                      // Product code
    header += ajustarTamanho("", 7);                                          // Reserved
    header += ajustarTamanho(this.config.agencia, 5, "0", true);              // Agency
    header += ajustarTamanho(this.config.dvAgencia, 1);                       // Agency check digit
    header += ajustarTamanho(this.config.conta, 12, "0", true);               // Account
    header += ajustarTamanho(this.config.dvConta, 1);                         // Account check digit
    header += "0";                                                           // Agency/Account check digit
    header += ajustarTamanho(formatarNomeFavorecido(this.config.nomeEmpresa), 30); // Company name
    header += ajustarTamanho(NOME_BB, 30);                                    // Bank name
    header += ajustarTamanho("", 10);                                         // FEBRABAN exclusive use
    header += "1";                                                           // Remittance/return code (1=Remessa)
    header += ajustarTamanho(dataAtual, 8);                                   // Generation date
    header += ajustarTamanho(horaAtual, 6);                                   // Generation time
    header += ajustarTamanho(this.config.nrRemessa, 6, "0", true);            // Sequential number
    header += ajustarTamanho(LAYOUT_VERSAO, 3);                               // Layout version
    header += ajustarTamanho("00000", 5);                                     // Density
    header += ajustarTamanho("", 20);                                         // Bank reserved
    header += ajustarTamanho("", 20);                                         // Company reserved
    header += ajustarTamanho("", 29);                                         // FEBRABAN exclusive use

    // Ensure record has exactly 240 characters
    header = ajustarTamanho(header, 240);

    // Write to file
    this.escreverNoArquivo(header);
  }

  // Write batch header
  private gravarHeaderLote(seqLoteStr: string, tipoLancamento: string): void {
    // Define service type (default "98" - Various Payments)
    const tipoServico = TIPO_SERVICO_PAGAMENTO;

    // Build batch header
    let headerLote = "";
    
    headerLote += ajustarTamanho(COD_BB, 3);                                  // Bank code
    headerLote += ajustarTamanho(seqLoteStr, 4, "0", true);                   // Service batch
    headerLote += "1";                                                       // Record type
    headerLote += TIPO_OPERACAO;                                             // Operation type (C=Credit)
    headerLote += tipoServico;                                               // Service type
    headerLote += ajustarTamanho(tipoLancamento, 2, "0", true);               // Form of entry
    headerLote += "000 ";                                                    // Layout version and space
    headerLote += "2";                                                       // Registration type (2=CNPJ)
    headerLote += ajustarTamanho(this.config.cnpj, 14, "0", true);            // Registration number
    headerLote += ajustarTamanho(this.config.nrConvenio, 9, "0", true);       // Agreement
    headerLote += ajustarTamanho(this.config.codProduto, 4);                  // Product code
    headerLote += ajustarTamanho("", 7);                                      // Reserved
    headerLote += ajustarTamanho(this.config.agencia, 5, "0", true);          // Agency
    headerLote += ajustarTamanho(this.config.dvAgencia, 1);                   // Agency check digit
    headerLote += ajustarTamanho(this.config.conta, 12, "0", true);           // Account
    headerLote += ajustarTamanho(this.config.dvConta, 1);                     // Account check digit
    headerLote += "0";                                                       // Agency/Account check digit
    headerLote += ajustarTamanho(formatarNomeFavorecido(this.config.nomeEmpresa), 30); // Company name
    headerLote += ajustarTamanho("", 40);                                     // Message
    headerLote += ajustarTamanho(this.config.endereco, 30);                   // Street
    headerLote += ajustarTamanho("0", 5, "0", true);                          // Local number
    headerLote += ajustarTamanho("", 15);                                     // Complement
    headerLote += ajustarTamanho("", 20);                                     // City
    headerLote += ajustarTamanho("00000000", 8);                              // ZIP Code
    headerLote += ajustarTamanho("", 2);                                      // State
    headerLote += ajustarTamanho("", 8);                                      // FEBRABAN exclusive use

    // Ensure record has exactly 240 characters
    headerLote = ajustarTamanho(headerLote, 240);

    // Write to file
    this.escreverNoArquivo(headerLote);
  }

  // Write batch trailer
  private gravarTrailerLote(
    seqLoteStr: string,
    qtdRegistros: number,
    valorTotal: number
  ): void {
    // Format total value correctly (18 positions)
    const valorFormatado = ajustarTamanho(formatarValorCNABPreciso(valorTotal), 18, "0", true);
    
    // Build batch trailer
    let trailerLote = "";
    
    trailerLote += ajustarTamanho(COD_BB, 3);                                      // Bank code
    trailerLote += ajustarTamanho(seqLoteStr, 4, "0", true);                       // Service batch
    trailerLote += "5";                                                           // Record type
    trailerLote += ajustarTamanho("", 9);                                          // FEBRABAN exclusive use
    trailerLote += ajustarTamanho(qtdRegistros.toString(), 6, "0", true);          // Number of records
    trailerLote += valorFormatado;                                                // Sum of values
    trailerLote += ajustarTamanho("0", 18, "0", true);                             // Sum of currency amounts
    trailerLote += ajustarTamanho("000000", 6, "0", true);                         // Debit notice number
    trailerLote += ajustarTamanho("", 165);                                        // FEBRABAN exclusive use
    trailerLote += ajustarTamanho("0", 10, "0", true);                             // Occurrence codes
    
    // Ensure record has exactly 240 characters
    trailerLote = ajustarTamanho(trailerLote, 240);
    
    // Write to file
    this.escreverNoArquivo(trailerLote);
  }

  // Generate the file trailer
  private gerarTrailerArquivo(): void {
    // Calculate total value from all payment types
    const valorTotal = this.somaValoresBBcc + this.somaValoresBBpoup + this.somaValoresDemais;
    
    // Format total value correctly (18 positions)
    const valorFormatado = ajustarTamanho(formatarValorCNABPreciso(valorTotal), 18, "0", true);
    
    // Build file trailer
    let trailerArquivo = "";
    
    trailerArquivo += ajustarTamanho(COD_BB, 3);                                   // Bank code
    trailerArquivo += ajustarTamanho("9999", 4);                                   // Service batch
    trailerArquivo += "9";                                                         // Record type
    trailerArquivo += ajustarTamanho("", 9);                                       // FEBRABAN exclusive use
    trailerArquivo += ajustarTamanho(this.seqLote.toString(), 6, "0", true);       // Number of batches
    trailerArquivo += ajustarTamanho(this.totalLinhasArquivo.toString(), 6, "0", true); // Number of records
    trailerArquivo += ajustarTamanho("0", 6, "0", true);                           // Number of accounts
    trailerArquivo += ajustarTamanho("", 205);                                     // FEBRABAN exclusive use
    
    // Ensure record has exactly 240 characters
    trailerArquivo = ajustarTamanho(trailerArquivo, 240);
    
    // Write to file
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
