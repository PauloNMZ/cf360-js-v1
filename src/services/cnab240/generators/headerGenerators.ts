import { 
  COD_BB,
  NOME_BB, 
  LAYOUT_VERSAO, 
  TIPO_SERVICO_PAGAMENTO, 
  TIPO_OPERACAO,
  EmpresaConfig
} from '@/types/cnab240';
import {
  ajustarTamanho,
  formatarData,
  formatarHora,
  formatarNomeFavorecido,
  strZero,
  formatarValorCNABPreciso
} from '@/utils/cnabUtils';

/**
 * Generate the file header according to CNAB240 specifications
 */
export const gerarHeaderArquivo = (config: EmpresaConfig): string => {
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
  header += ajustarTamanho(config.cnpj, 14, "0", true);                 // 06.0 Registration number (19-32)
  
  // Complex field 07.0 "Convênio no Banco" broken down:
  header += ajustarTamanho(config.nrConvenio, 9, "0", true);            // 07.0.BB1 Agreement (33-41)
  header += ajustarTamanho(config.codProduto, 4);                       // 07.0.BB2 Product code (42-45)
  header += ajustarTamanho("", 7);                                      // 07.0.BB3 Reserved (46-52)
  
  // Agency number (53-57) with leading zeros
  header += ajustarTamanho(config.agencia, 5, "0", true);               // 08.0 Agency (53-57)
  header += ajustarTamanho(config.dvAgencia, 1);                        // 09.0 Agency check digit (58)
  
  // Account number (59-70) with leading zeros
  header += ajustarTamanho(config.conta, 12, "0", true);                // 10.0 Account (59-70)
  header += ajustarTamanho(config.dvConta, 1);                          // 11.0 Account check digit (71)
  header += " ";                                                        // 12.0 Reserved (72) - no longer using combined check digit
  
  header += ajustarTamanho(formatarNomeFavorecido(config.nomeEmpresa), 30); // 13.0 Company name (73-102)
  header += ajustarTamanho(NOME_BB, 30);                                // 14.0 Bank name (103-132)
  header += ajustarTamanho("", 10);                                     // 15.0 FEBRABAN exclusive use (133-142)
  header += "1";                                                        // 16.0 Remittance/return code (1=Remessa) (143)
  header += ajustarTamanho(dataAtual, 8);                               // 17.0 Generation date (144-151)
  header += ajustarTamanho(horaAtual, 6);                               // 18.0 Generation time (152-157)
  header += ajustarTamanho(config.nrRemessa, 6, "0", true);             // 19.0 Sequential number (158-163)
  header += ajustarTamanho(LAYOUT_VERSAO, 3);                           // 20.0 Layout version (164-166)
  header += ajustarTamanho("00000", 5);                                 // 21.0 Density (167-171)
  header += ajustarTamanho("", 20);                                     // 22.0 Bank reserved (172-191)
  header += ajustarTamanho("", 20);                                     // 23.0 Company reserved (192-211)
  header += ajustarTamanho("", 29);                                     // 24.0-28.0 FEBRABAN exclusive use (212-240)

  // Ensure record has exactly 240 characters
  return ajustarTamanho(header, 240);
};

/**
 * Write batch header according to CNAB240 specifications
 */
export const gravarHeaderLote = (
  config: EmpresaConfig,
  seqLoteStr: string, 
  tipoLancamento: string
): string => {
  // Define service type (default "98" - Various Payments)
  const tipoServico = TIPO_SERVICO_PAGAMENTO;

  // Build batch header
  let headerLote = "";
  
  headerLote += ajustarTamanho(COD_BB, 3);                              // 01.1 Bank code (1-3)
  headerLote += ajustarTamanho(seqLoteStr, 4, "0", true);               // 02.1 Service batch (4-7)
  headerLote += "1";                                                    // 03.1 Record type (8)
  headerLote += TIPO_OPERACAO;                                          // 04.1 Operation type (C=Credit) (9)
  headerLote += tipoServico;                                            // 05.1 Service type (10-11)
  headerLote += ajustarTamanho(tipoLancamento, 2, "0", true);           // 06.1 Form of entry (12-13)
  headerLote += ajustarTamanho(LAYOUT_VERSAO, 3);                       // 07.1 Layout version (14-16)
  headerLote += " ";                                                    // 08.1 FEBRABAN exclusive use (17)
  headerLote += "2";                                                    // 09.1 Registration type (2=CNPJ) (18)
  headerLote += ajustarTamanho(config.cnpj, 14, "0", true);             // 10.1 Registration number (19-32)
  
  // Complex field 11.1 "Convênio no Banco" broken down:
  headerLote += ajustarTamanho(config.nrConvenio, 9, "0", true);        // 11.1.BB1 Agreement (33-41)
  headerLote += ajustarTamanho(config.codProduto, 4);                   // 11.1.BB2 Product code (42-45)
  headerLote += ajustarTamanho("", 7);                                  // 11.1.BB3 Reserved (46-52)
  
  // Agency number (53-57) with leading zeros
  headerLote += ajustarTamanho(config.agencia, 5, "0", true);           // 12.1 Agency (53-57)
  headerLote += ajustarTamanho(config.dvAgencia, 1);                    // 13.1 Agency check digit (58)
  
  // Account number (59-70) with leading zeros
  headerLote += ajustarTamanho(config.conta, 12, "0", true);            // 14.1 Account (59-70)
  headerLote += ajustarTamanho(config.dvConta, 1);                      // 15.1 Account check digit (71)
  headerLote += " ";                                                    // 16.1 Reserved (72) - no longer using combined check digit
  
  headerLote += ajustarTamanho(formatarNomeFavorecido(config.nomeEmpresa), 30); // 17.1 Company name (73-102)
  headerLote += ajustarTamanho("", 40);                                 // 18.1 Message (103-142)
  headerLote += ajustarTamanho(config.endereco, 30);                    // 19.1 Street (143-172)
  headerLote += ajustarTamanho("0", 5, "0", true);                      // 20.1 Local number (173-177)
  headerLote += ajustarTamanho("", 15);                                 // 21.1 Complement (178-192)
  headerLote += ajustarTamanho("", 20);                                 // 22.1 City (193-212)
  headerLote += ajustarTamanho("00000000", 8);                          // 23.1 ZIP Code (213-220)
  headerLote += ajustarTamanho("", 2);                                  // 24.1 State (221-222)
  headerLote += ajustarTamanho("", 8);                                  // 25.1-27.1 FEBRABAN exclusive use (223-240)

  // Ensure record has exactly 240 characters
  return ajustarTamanho(headerLote, 240);
};

/**
 * Write batch trailer according to CNAB240 specifications
 */
export const gravarTrailerLote = (
  seqLoteStr: string,
  qtdRegistros: number,
  valorTotal: number
): string => {
  // Format total value correctly (18 positions)
  const valorFormatado = ajustarTamanho(formatarValorCNABPreciso(valorTotal), 18, "0", true);
  
  // Build batch trailer
  let trailerLote = "";
  
  trailerLote += ajustarTamanho(COD_BB, 3);                                  // 01.5 Bank code (1-3)
  trailerLote += ajustarTamanho(seqLoteStr, 4, "0", true);                   // 02.5 Service batch (4-7)
  trailerLote += "5";                                                        // 03.5 Record type (8)
  trailerLote += ajustarTamanho("", 9);                                      // 04.5 FEBRABAN exclusive use (9-17)
  trailerLote += ajustarTamanho(qtdRegistros.toString(), 6, "0", true);      // 05.5 Number of records (18-23)
  trailerLote += valorFormatado;                                             // 06.5 Sum of values (24-41)
  trailerLote += ajustarTamanho("0", 18, "0", true);                         // 07.5 Sum of currency amounts (42-59)
  trailerLote += ajustarTamanho("000000", 6, "0", true);                     // 08.5 Debit notice number (60-65)
  trailerLote += ajustarTamanho("", 165);                                    // 09.5 FEBRABAN exclusive use (66-230)
  trailerLote += ajustarTamanho("0", 10, "0", true);                         // 10.5 Occurrence codes (231-240)
  
  // Ensure record has exactly 240 characters
  return ajustarTamanho(trailerLote, 240);
};

/**
 * Generate the file trailer according to CNAB240 specifications
 */
export const gerarTrailerArquivo = (
  seqLote: number,
  totalLinhasArquivo: number
): string => {
  // Build file trailer
  let trailerArquivo = "";
  
  trailerArquivo += ajustarTamanho(COD_BB, 3);                               // 01.9 Bank code (1-3)
  trailerArquivo += ajustarTamanho("9999", 4);                               // 02.9 Service batch (4-7)
  trailerArquivo += "9";                                                     // 03.9 Record type (8)
  trailerArquivo += ajustarTamanho("", 9);                                   // 04.9 FEBRABAN exclusive use (9-17)
  trailerArquivo += ajustarTamanho(seqLote.toString() , 6, "0", true);        // 05.9 Number of batches (18-23)
  trailerArquivo += ajustarTamanho(totalLinhasArquivo.toString()+1, 6, "0", true); // 06.9 Number of records (24-29)
  trailerArquivo += ajustarTamanho("0", 6, "0", true);                       // 07.9 Number of accounts (30-35)
  trailerArquivo += ajustarTamanho("", 205);                                 // 08.9 FEBRABAN exclusive use (36-240)
  
  // Ensure record has exactly 240 characters
  return ajustarTamanho(trailerArquivo, 240);
};
