
import {
  ajustarTamanho,
  retirarCHR,
  formatarValorCNABPreciso
} from '@/utils/cnabUtils';

/**
 * Generate segment B for CNAB240 file
 */
export const gravarSegmentoB = (
  codBanco: string,
  seqLoteStr: string,
  seqRegistro: number,
  inscricaoFavorecido: string,
  valorPagamento: number
): string => {
  // Define registration type (CPF or CNPJ)
  const tipoInscricao = retirarCHR(inscricaoFavorecido).length <= 11 ? "1" : "2";
  
  // Build segment B
  let segmentoB = "";
  
  // Control
  segmentoB += ajustarTamanho(codBanco, 3);                                               // Bank code
  segmentoB += ajustarTamanho(seqLoteStr, 4, "0", true);                                  // Service batch
  segmentoB += "3";                                                                       // Record type
  
  // Service
  segmentoB += ajustarTamanho(seqRegistro.toString(), 5, "0", true);                      // Record sequence
  segmentoB += "B";                                                                       // Segment code
  
  // CNAB
  segmentoB += ajustarTamanho("", 3);                                                     // FEBRABAN exclusive use
  
  // Recipient's complementary data
  segmentoB += tipoInscricao;                                                             // Recipient's registration type
  segmentoB += ajustarTamanho(retirarCHR(inscricaoFavorecido), 14, "0", true);            // Recipient's registration number
  segmentoB += ajustarTamanho("", 30);                                                    // Street
  segmentoB += ajustarTamanho("0", 5, "0", true);                                         // Local number
  segmentoB += ajustarTamanho("", 15);                                                    // Complement
  segmentoB += ajustarTamanho("", 15);                                                    // Neighborhood name
  segmentoB += ajustarTamanho("", 20);                                                    // City name
  segmentoB += ajustarTamanho("0", 5, "0", true);                                         // ZIP Code
  segmentoB += ajustarTamanho("", 3, "0", true);                                          // ZIP Code complement
  segmentoB += ajustarTamanho("", 2, "0", true);                                          // State abbreviation
  
  // Payment complementary data
  segmentoB += ajustarTamanho("0", 8, "0", true);                                         // Due date
  segmentoB += ajustarTamanho(formatarValorCNABPreciso(valorPagamento), 15, "0", true);   // Document value
  segmentoB += ajustarTamanho("0", 60, "0", true);                                        // Discount, Rebate, Interest, and Penalty
  
  // Recipient's code/document
  segmentoB += ajustarTamanho("", 15);                                                    // Recipient's code/document
  segmentoB += "0";                                                                       // Notice
  segmentoB += ajustarTamanho("", 6);                                                     // UG code
  segmentoB += ajustarTamanho("", 8);                                                     // Bank identification in SPB
  
  // Ensure record has exactly 240 characters
  return ajustarTamanho(segmentoB, 240);
};
