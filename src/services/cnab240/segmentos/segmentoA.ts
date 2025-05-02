
import {
  ajustarTamanho,
  retirarCHR,
  formatarNomeFavorecido,
  formatarValorCNABPreciso
} from '@/utils/cnabUtils';

/**
 * Generate segment A for CNAB240 file
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

  // Build segment A
  let segmentoA = "";
  
  // Control
  segmentoA += ajustarTamanho(codBanco, 3);                                  // Bank code
  segmentoA += ajustarTamanho(seqLoteStr, 4, "0", true);                     // Service batch
  segmentoA += "3";                                                          // Record type
  
  // Service
  segmentoA += ajustarTamanho(seqRegistro.toString(), 5, "0", true);         // Record sequence
  segmentoA += "A";                                                          // Segment code
  segmentoA += "0";                                                          // Movement type
  segmentoA += "00";                                                         // Instruction code for movement
  
  // Compensation chamber code
  if (tipoLancamento === "03") {
    segmentoA += ajustarTamanho(banco, 3, "0", true);                        // Recipient's bank code
  } else {
    segmentoA += ajustarTamanho(codBanco, 3);                                // Bank code (BB)
  }
  
  // Account for credit
  segmentoA += ajustarTamanho(agencia, 5, "0", true);                        // Recipient's agency
  segmentoA += ajustarTamanho("", 1);                                        // Agency check digit
  segmentoA += ajustarTamanho(conta, 12, "0", true);                         // Recipient's account
  segmentoA += ajustarTamanho("", 1);                                        // Account check digit
  segmentoA += ajustarTamanho("", 1);                                        // Agency/Account check digit
  
  // Recipient's name
  segmentoA += ajustarTamanho(formatarNomeFavorecido(nomeFavorecido), 30);
  
  // Document number assigned by the company
  segmentoA += ajustarTamanho(nrDocumento, 20);                              // Client document number
  
  // Payment date
  segmentoA += ajustarTamanho(dataPagamento, 8);                             // Payment date
  
  // Currency type
  segmentoA += ajustarTamanho(moeda, 3);                                     // Currency type (BRL)
  
  // Currency amount
  segmentoA += ajustarTamanho("0", 15, "0", true);                           // Currency amount
  
  // Payment value
  segmentoA += ajustarTamanho(formatarValorCNABPreciso(valorPagamento), 15, "0", true);
  
  // Document number assigned by the bank
  segmentoA += ajustarTamanho("", 20);                                       // Our number - Doc number assigned by bank
  
  // Effective date
  segmentoA += ajustarTamanho("0", 8, "0", true);                            // Effective payment date
  
  // Effective value
  segmentoA += ajustarTamanho("0", 15, "0", true);                           // Effective payment value
  
  // Information 2
  if (tipoLancamento === "05") {
    segmentoA += "11";                                                       // Variation for savings
    segmentoA += ajustarTamanho("0", 38, "0", true);                         // Complement
  } else {
    segmentoA += ajustarTamanho("0", 40, "0", true);                         // Standard complement
  }
  
  // Purpose
  segmentoA += ajustarTamanho("", 2);                                        // DOC Purpose Code
  segmentoA += ajustarTamanho("", 5);                                        // TED Purpose Code
  segmentoA += ajustarTamanho("", 2);                                        // Free use - Payment Purpose Complement
  
  // CNAB
  segmentoA += ajustarTamanho("", 3);                                        // CNAB Febraban Exclusive Use
  
  // Notice
  segmentoA += "0";                                                          // Notice
  
  // Occurrences
  segmentoA += ajustarTamanho("0", 10, "0");                                 // Final complement
  
  // Ensure record has exactly 240 characters
  return ajustarTamanho(segmentoA, 240);
};
