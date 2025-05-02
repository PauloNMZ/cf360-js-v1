
import {
  ajustarTamanho,
  retirarCHR,
  formatarValorCNABPreciso
} from '@/utils/cnabUtils';

/**
 * Generate segment B for CNAB240 file following BB specifications
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
  
  // Control header - matches positions 1-8
  segmentoB += ajustarTamanho(codBanco, 3);                              // 01.3B Bank code (1-3)
  segmentoB += ajustarTamanho(seqLoteStr, 4, "0", true);                 // 02.3B Service batch (4-7)
  segmentoB += "3";                                                      // 03.3B Record type (8)
  
  // Service data - matches positions 9-17
  segmentoB += ajustarTamanho(seqRegistro.toString(), 5, "0", true);     // 04.3B Record sequence (9-13)
  segmentoB += "B";                                                      // 05.3B Segment code (14)
  segmentoB += ajustarTamanho("", 3);                                    // 06.3B FEBRABAN exclusive use (15-17)
  
  // Recipient's complementary data - matches positions 18-127
  segmentoB += tipoInscricao;                                            // 07.3B Recipient's registration type (18)
  segmentoB += ajustarTamanho(retirarCHR(inscricaoFavorecido), 14, "0", true); // 08.3B Recipient's registration number (19-32)
  segmentoB += ajustarTamanho("", 30);                                   // 09.3B Street (33-62)
  segmentoB += ajustarTamanho("0", 5, "0", true);                        // 10.3B Local number (63-67)
  segmentoB += ajustarTamanho("", 15);                                   // 11.3B Complement (68-82)
  segmentoB += ajustarTamanho("", 15);                                   // 12.3B Neighborhood name (83-97)
  segmentoB += ajustarTamanho("", 20);                                   // 13.3B City name (98-117)
  segmentoB += ajustarTamanho("0", 5, "0", true);                        // 14.3B ZIP Code (118-122)
  segmentoB += ajustarTamanho("", 3, "0", true);                         // 15.3B ZIP Code complement (123-125)
  segmentoB += ajustarTamanho("", 2, "0", true);                         // 16.3B State abbreviation (126-127)
  
  // Payment complementary data - matches positions 128-210
  segmentoB += ajustarTamanho("0", 8, "0", true);                        // 17.3B Due date (128-135)
  segmentoB += ajustarTamanho(formatarValorCNABPreciso(valorPagamento), 15, "0", true); // 18.3B Document value (136-150)
  segmentoB += ajustarTamanho("0", 15, "0", true);                       // 19.3B Discount (151-165)
  segmentoB += ajustarTamanho("0", 15, "0", true);                       // 20.3B Discount (166-180)
  segmentoB += ajustarTamanho("0", 15, "0", true);                       // 21.3B Interest (181-195)
  segmentoB += ajustarTamanho("0", 15, "0", true);                       // 22.3B Penalty (196-210)
  
  // Recipient's code/document - matches positions 211-240
  segmentoB += ajustarTamanho("", 15);                                   // 23.3B Recipient's code/document (211-225)
  segmentoB += "0";                                                      // 24.3B Notice (226)
  segmentoB += ajustarTamanho("", 6);                                    // 25.3B UG code (227-232)
  segmentoB += ajustarTamanho("", 8);                                    // 26.3B Bank identification in SPB (233-240)
  
  // Ensure record has exactly 240 characters
  return ajustarTamanho(segmentoB, 240);
};
