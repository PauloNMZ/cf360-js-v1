
import {
  ajustarTamanho,
  retirarCHR,
  formatarNomeFavorecido,
  formatarValorCNABPreciso,
  calcularDV
} from '@/utils/cnabUtils';

/**
 * Generate segment A for CNAB240 file following BB specifications
 */
export const gravarSegmentoA = (
  codBanco: string,
  seqLoteStr: string,
  seqRegistro: number,
  tipoLancamento: string,
  nomeFavorecido: string,
  inscricaoFavorecido: string,
  banco: string,
  agencia: string,
  conta: string,
  valorPagamento: number,
  dataPagamento: string,
  nrDocumento: string,
  moeda: string
): string => {
  // Define registration type (CPF or CNPJ)
  const tipoInscricao = retirarCHR(inscricaoFavorecido).length <= 11 ? "1" : "2";
  
  // Process agency and account
  const agenciaLimpa = retirarCHR(agencia);
  const contaLimpa = retirarCHR(conta);
  
  // For any bank, separate the verification digit from account/agency
  let agenciaSemDV = agenciaLimpa;
  let dvAgencia = "";
  let contaSemDV = contaLimpa;
  let dvConta = "";
  
  // Extract or calculate the verification digits
  if (agenciaLimpa.length > 1) {
    agenciaSemDV = agenciaLimpa.slice(0, -1);
    dvAgencia = agenciaLimpa.slice(-1);
  } else {
    // If no verification digit is provided, calculate it
    agenciaSemDV = agenciaLimpa;
    dvAgencia = calcularDV(agenciaSemDV);
  }
  
  // For account, handle the verification digit
  if (contaLimpa.length > 1) {
    contaSemDV = contaLimpa.slice(0, -1);
    dvConta = contaLimpa.slice(-1);
  } else {
    // If no verification digit is provided, calculate it
    contaSemDV = contaLimpa;
    dvConta = calcularDV(contaSemDV);
  }

  // Build segment A
  let segmentoA = "";
  
  // Control header - matches positions 1-8
  segmentoA += ajustarTamanho(codBanco, 3);                    // 01.3A Bank code (1-3)
  segmentoA += ajustarTamanho(seqLoteStr, 4, "0", true);       // 02.3A Service batch (4-7)
  segmentoA += "3";                                            // 03.3A Record type (8)
  
  // Service data - matches positions 9-17
  segmentoA += ajustarTamanho(seqRegistro.toString(), 5, "0", true); // 04.3A Record sequence (9-13)
  segmentoA += "A";                                            // 05.3A Segment code (14)
  segmentoA += "0";                                            // 06.3A Movement type (15)
  segmentoA += "00";                                           // 07.3A Instruction code (16-17)
  
  // Chamber code - matches positions 18-20
  let camara = "000";
  // For TED between different banks
  if (tipoLancamento === "03" || tipoLancamento === "41" || tipoLancamento === "43") {
    camara = "018"; // TED (STR, CIP)
  }
  // For DOC
  else if (tipoLancamento === "03" && parseFloat(valorPagamento.toString()) <= 4999.99) {
    camara = "700"; // DOC (COMPE)
  }
  segmentoA += ajustarTamanho(camara, 3);                      // 08.3A Chamber code (18-20)
  
  // Recipient bank - matches positions 21-23
  segmentoA += ajustarTamanho(banco, 3, "0", true);            // 09.3A Recipient's bank code (21-23)
  
  // Recipient account - matches positions 24-43
  segmentoA += ajustarTamanho(agenciaSemDV, 5, "0", true);     // 10.3A Recipient's branch (24-28)
  segmentoA += ajustarTamanho(dvAgencia, 1);                   // 11.3A Branch check digit (29)
  segmentoA += ajustarTamanho(contaSemDV, 12, "0", true);      // 12.3A Recipient's account (30-41)
  segmentoA += ajustarTamanho(dvConta, 1);                     // 13.3A Account check digit (42)
  segmentoA += " ";                                            // 14.3A Reserved (43) - no longer using combined check digit
  
  // Recipient name - matches positions 44-73
  segmentoA += ajustarTamanho(formatarNomeFavorecido(nomeFavorecido), 30); // 15.3A Recipient name (44-73)
  
  // Document number - matches positions 74-93
  segmentoA += ajustarTamanho(nrDocumento, 20);                // 16.3A Document number (74-93)
  
  // Payment date - matches positions 94-101
  segmentoA += ajustarTamanho(dataPagamento, 8);               // 17.3A Payment date (94-101)
  
  // Currency type - matches positions 102-104
  segmentoA += ajustarTamanho(moeda, 3);                       // 18.3A Currency type (102-104)
  
  // Currency amount - matches positions 105-119
  segmentoA += ajustarTamanho("0", 15, "0", true);             // 19.3A Currency amount (105-119)
  
  // Payment value - matches positions 120-134
  segmentoA += ajustarTamanho(formatarValorCNABPreciso(valorPagamento), 15, "0", true); // 20.3A Payment value (120-134)
  
  // Our number - matches positions 135-154
  segmentoA += ajustarTamanho("", 20);                         // 21.3A Our number (135-154)
  
  // Effective date - matches positions 155-162
  segmentoA += ajustarTamanho("0", 8, "0", true);              // 22.3A Effective date (155-162)
  
  // Effective value - matches positions 163-177
  segmentoA += ajustarTamanho("0", 15, "0", true);             // 23.3A Effective value (163-177)
  
  // Additional information - matches positions 178-217
  // For savings accounts (type 05), we need specific information
  if (tipoLancamento === "05") {
    segmentoA += "01";                                         // Savings variation
    segmentoA += ajustarTamanho("0", 38, "0", true);           // Complement
  } else {
    segmentoA += ajustarTamanho("", 40);                       // 24.3A Other information (178-217)
  }
  
  // TED purpose - matches positions 218-226
  segmentoA += ajustarTamanho("", 2);                          // 25.3A Service type complement (218-219)
  segmentoA += ajustarTamanho("", 5);                          // 26.3A TED purpose code (220-224)
  segmentoA += ajustarTamanho("", 2);                          // 27.3A Payment purpose complement (225-226)
  
  // FEBRABAN - matches positions 227-229
  segmentoA += ajustarTamanho("", 3);                          // 28.3A FEBRABAN exclusive use (227-229)
  
  // Notice - matches position 230
  segmentoA += "0";                                            // 29.3A Notice (230)
  
  // Occurrences - matches positions 231-240
  segmentoA += ajustarTamanho("0", 10, "0");                   // 30.3A Occurrences (231-240)
  
  // Ensure record has exactly 240 characters
  return ajustarTamanho(segmentoA, 240);
};
