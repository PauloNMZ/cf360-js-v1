
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
  validarCNPJ,
  calcularDV
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
      codProduto: "0126", // Fixed product code for BB
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
    
    // Process agency: Separate the agency number and its check digit
    const agenciaCompleta = retirarCHR(config.agencia || '');
    if (agenciaCompleta.length > 0) {
      if (agenciaCompleta.length > 1) {
        // Extract the last character as check digit
        this.config.dvAgencia = agenciaCompleta.slice(-1);
        this.config.agencia = agenciaCompleta.slice(0, -1);
      } else {
        this.config.agencia = agenciaCompleta;
        this.config.dvAgencia = calcularDV(agenciaCompleta);
      }
    }
    
    // Process account: Separate the account number and its check digit
    const contaCompleta = retirarCHR(config.conta || '');
    if (contaCompleta.length > 0) {
      if (contaCompleta.length > 1) {
        // Extract the last character as check digit
        this.config.dvConta = contaCompleta.slice(-1);
        this.config.conta = contaCompleta.slice(0, -1);
      } else {
        this.config.conta = contaCompleta;
        this.config.dvConta = calcularDV(contaCompleta);
      }
    }
    
    this.config.nrConvenio = config.convenioPag || '';
    this.config.codProduto = "0126"; // Fixed for BB payments
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

        // Write segment A
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

        // Write segment B
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
        seqRegistro + 2,  // Include header and trailer
        somaValores
      );
    } catch (error) {
      console.error(`Erro ao processar favorecidos do tipo ${descricaoTipo}:`, error);
    }
  }

  // Generate the file header according to CNAB240 specifications
  private gerarHeaderArquivo(): void {
    // Format current date and time
    const dataAtual = formatarData(new Date(), "DDMMYYYY");
    const horaAtual = formatarHora(new Date(), "HHMMSS");

    // Build file header
    let header = "";
    
    header += ajustarTamanho(COD_BB, 3);                                  // 01.0 Bank code (1-3)
    header += ajustarTamanho("0000", 4);                                  // 02.0 Service batch (4-7)
    header += "0";                                                       // 03.0 Record type (8)
    header += ajustarTamanho("", 9);                                      // 04.0 FEBRABAN exclusive use (9-17)
    header += "2";                                                       // 05.0 Registration type (2=CNPJ) (18)
    header += ajustarTamanho(this.config.cnpj, 14, "0", true);            // 06.0 Registration number (19-32)
    
    // Complex field 07.0 "Convênio no Banco" broken down:
    header += ajustarTamanho(this.config.nrConvenio, 9, "0", true);       // 07.0.BB1 Agreement (33-41)
    header += ajustarTamanho(this.config.codProduto, 4);                  // 07.0.BB2 Product code (42-45)
    header += ajustarTamanho("", 7);                                      // 07.0.BB3 Reserved (46-52)
    
    // Apply correct formatting for agency and account numbers with check digits
    // Agency number (53-57) with leading zeros
    header += ajustarTamanho(this.config.agencia, 5, "0", true);          // 08.0 Agency (53-57)
    header += ajustarTamanho(this.config.dvAgencia, 1);                   // 09.0 Agency check digit (58)
    
    // Account number (59-70) with leading zeros
    header += ajustarTamanho(this.config.conta, 12, "0", true);           // 10.0 Account (59-70)
    header += ajustarTamanho(this.config.dvConta, 1);                     // 11.0 Account check digit (71)
    header += " ";                                                       // 12.0 Reserved (72) - no longer using combined check digit
    
    header += ajustarTamanho(formatarNomeFavorecido(this.config.nomeEmpresa), 30); // 13.0 Company name (73-102)
    header += ajustarTamanho(NOME_BB, 30);                                // 14.0 Bank name (103-132)
    header += ajustarTamanho("", 10);                                     // 15.0 FEBRABAN exclusive use (133-142)
    header += "1";                                                       // 16.0 Remittance/return code (1=Remessa) (143)
    header += ajustarTamanho(dataAtual, 8);                               // 17.0 Generation date (144-151)
    header += ajustarTamanho(horaAtual, 6);                               // 18.0 Generation time (152-157)
    header += ajustarTamanho(this.config.nrRemessa, 6, "0", true);        // 19.0 Sequential number (158-163)
    header += ajustarTamanho(LAYOUT_VERSAO, 3);                           // 20.0 Layout version (164-166)
    header += ajustarTamanho("00000", 5);                                 // 21.0 Density (167-171)
    header += ajustarTamanho("", 20);                                     // 22.0 Bank reserved (172-191)
    header += ajustarTamanho("", 20);                                     // 23.0 Company reserved (192-211)
    header += ajustarTamanho("", 29);                                     // 24.0-28.0 FEBRABAN exclusive use (212-240)

    // Ensure record has exactly 240 characters
    header = ajustarTamanho(header, 240);

    // Write to file
    this.escreverNoArquivo(header);
  }

  // Write batch header according to CNAB240 specifications
  private gravarHeaderLote(seqLoteStr: string, tipoLancamento: string): void {
    // Define service type (default "98" - Various Payments)
    const tipoServico = TIPO_SERVICO_PAGAMENTO;

    // Build batch header
    let headerLote = "";
    
    headerLote += ajustarTamanho(COD_BB, 3);                              // 01.1 Bank code (1-3)
    headerLote += ajustarTamanho(seqLoteStr, 4, "0", true);               // 02.1 Service batch (4-7)
    headerLote += "1";                                                   // 03.1 Record type (8)
    headerLote += TIPO_OPERACAO;                                         // 04.1 Operation type (C=Credit) (9)
    headerLote += tipoServico;                                           // 05.1 Service type (10-11)
    headerLote += ajustarTamanho(tipoLancamento, 2, "0", true);           // 06.1 Form of entry (12-13)
    headerLote += ajustarTamanho(LAYOUT_VERSAO, 3);                       // 07.1 Layout version (14-16)
    headerLote += " ";                                                   // 08.1 FEBRABAN exclusive use (17)
    headerLote += "2";                                                   // 09.1 Registration type (2=CNPJ) (18)
    headerLote += ajustarTamanho(this.config.cnpj, 14, "0", true);        // 10.1 Registration number (19-32)
    
    // Complex field 11.1 "Convênio no Banco" broken down:
    headerLote += ajustarTamanho(this.config.nrConvenio, 9, "0", true);   // 11.1.BB1 Agreement (33-41)
    headerLote += ajustarTamanho(this.config.codProduto, 4);              // 11.1.BB2 Product code (42-45)
    headerLote += ajustarTamanho("", 7);                                  // 11.1.BB3 Reserved (46-52)
    
    // Apply correct formatting for agency and account with separate check digits
    // Agency number (53-57) with leading zeros
    headerLote += ajustarTamanho(this.config.agencia, 5, "0", true);      // 12.1 Agency (53-57)
    headerLote += ajustarTamanho(this.config.dvAgencia, 1);               // 13.1 Agency check digit (58)
    
    // Account number (59-70) with leading zeros
    headerLote += ajustarTamanho(this.config.conta, 12, "0", true);       // 14.1 Account (59-70)
    headerLote += ajustarTamanho(this.config.dvConta, 1);                 // 15.1 Account check digit (71)
    headerLote += " ";                                                   // 16.1 Reserved (72) - no longer using combined check digit
    
    headerLote += ajustarTamanho(formatarNomeFavorecido(this.config.nomeEmpresa), 30); // 17.1 Company name (73-102)
    headerLote += ajustarTamanho("", 40);                                 // 18.1 Message (103-142)
    headerLote += ajustarTamanho(this.config.endereco, 30);               // 19.1 Street (143-172)
    headerLote += ajustarTamanho("0", 5, "0", true);                      // 20.1 Local number (173-177)
    headerLote += ajustarTamanho("", 15);                                 // 21.1 Complement (178-192)
    headerLote += ajustarTamanho("", 20);                                 // 22.1 City (193-212)
    headerLote += ajustarTamanho("00000000", 8);                          // 23.1 ZIP Code (213-220)
    headerLote += ajustarTamanho("", 2);                                  // 24.1 State (221-222)
    headerLote += ajustarTamanho("", 8);                                  // 25.1-27.1 FEBRABAN exclusive use (223-240)

    // Ensure record has exactly 240 characters
    headerLote = ajustarTamanho(headerLote, 240);

    // Write to file
    this.escreverNoArquivo(headerLote);
  }

  // Write batch trailer according to CNAB240 specifications
  private gravarTrailerLote(
    seqLoteStr: string,
    qtdRegistros: number,
    valorTotal: number
  ): void {
    // Format total value correctly (18 positions)
    const valorFormatado = ajustarTamanho(formatarValorCNABPreciso(valorTotal), 18, "0", true);
    
    // Build batch trailer
    let trailerLote = "";
    
    trailerLote += ajustarTamanho(COD_BB, 3);                                  // 01.5 Bank code (1-3)
    trailerLote += ajustarTamanho(seqLoteStr, 4, "0", true);                   // 02.5 Service batch (4-7)
    trailerLote += "5";                                                       // 03.5 Record type (8)
    trailerLote += ajustarTamanho("", 9);                                      // 04.5 FEBRABAN exclusive use (9-17)
    trailerLote += ajustarTamanho(qtdRegistros.toString(), 6, "0", true);      // 05.5 Number of records (18-23)
    trailerLote += valorFormatado;                                            // 06.5 Sum of values (24-41)
    trailerLote += ajustarTamanho("0", 18, "0", true);                         // 07.5 Sum of currency amounts (42-59)
    trailerLote += ajustarTamanho("000000", 6, "0", true);                     // 08.5 Debit notice number (60-65)
    trailerLote += ajustarTamanho("", 165);                                    // 09.5 FEBRABAN exclusive use (66-230)
    trailerLote += ajustarTamanho("0", 10, "0", true);                         // 10.5 Occurrence codes (231-240)
    
    // Ensure record has exactly 240 characters
    trailerLote = ajustarTamanho(trailerLote, 240);
    
    // Write to file
    this.escreverNoArquivo(trailerLote);
  }

  // Generate the file trailer according to CNAB240 specifications
  private gerarTrailerArquivo(): void {
    // Build file trailer
    let trailerArquivo = "";
    
    trailerArquivo += ajustarTamanho(COD_BB, 3);                               // 01.9 Bank code (1-3)
    trailerArquivo += ajustarTamanho("9999", 4);                               // 02.9 Service batch (4-7)
    trailerArquivo += "9";                                                     // 03.9 Record type (8)
    trailerArquivo += ajustarTamanho("", 9);                                   // 04.9 FEBRABAN exclusive use (9-17)
    trailerArquivo += ajustarTamanho(this.seqLote.toString(), 6, "0", true);   // 05.9 Number of batches (18-23)
    trailerArquivo += ajustarTamanho(this.totalLinhasArquivo.toString(), 6, "0", true); // 06.9 Number of records (24-29)
    trailerArquivo += ajustarTamanho("0", 6, "0", true);                       // 07.9 Number of accounts (30-35)
    trailerArquivo += ajustarTamanho("", 205);                                 // 08.9 FEBRABAN exclusive use (36-240)
    
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
