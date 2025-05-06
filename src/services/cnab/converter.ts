
import { ParsedCNABData, PagamentoData, CNABJsonOutput } from './types';
import { extractDate, extractTime, formatDate } from './utils';

/**
 * Convert CNAB data to JSON for API
 */
export const convertCNABToJSON = (cnabData: ParsedCNABData): CNABJsonOutput => {
  try {
    // Extract company information from header
    const headerInfo = {
      banco: cnabData.banco,
      tipoArquivo: cnabData.tipoArquivo,
      dataGeracao: extractDate(cnabData.headerArquivo, 144, 152),
      horaGeracao: extractTime(cnabData.headerArquivo, 152, 158),
      sequencialArquivo: cnabData.headerArquivo.substring(158, 163),
    };
    
    // Process payment details
    const pagamentos: PagamentoData[] = [];
    
    // Loop through each batch
    for (const lote of cnabData.lotes) {
      // Extract payments from segments
      for (let i = 0; i < lote.segmentos.length; i += 2) {
        // Segmento A contains payment information
        const segmentoA = lote.segmentos[i];
        
        // Segmento B contains recipient details (if available)
        const segmentoB = i + 1 < lote.segmentos.length ? lote.segmentos[i + 1] : null;
        
        if (segmentoA && segmentoA.substring(13, 14) === 'A') {
          const pagamento: PagamentoData = {
            tipoRegistro: segmentoA.substring(7, 8),
            segmento: segmentoA.substring(13, 14),
            tipoMovimento: segmentoA.substring(14, 15),
            codMovimento: segmentoA.substring(15, 17),
            camara: segmentoA.substring(17, 20),
            bancoFavorecido: segmentoA.substring(20, 23),
            agenciaFavorecido: segmentoA.substring(23, 28).trim(),
            digitoAgencia: segmentoA.substring(28, 29),
            contaFavorecido: segmentoA.substring(29, 41).trim(),
            digitoConta: segmentoA.substring(41, 42),
            nomeFavorecido: segmentoA.substring(43, 73).trim(),
            numeroDocumento: segmentoA.substring(73, 93).trim(),
            dataPagamento: formatDate(segmentoA.substring(93, 101)),
            moeda: segmentoA.substring(101, 104),
            valorPagamento: parseFloat(segmentoA.substring(119, 134)) / 100,
            nossoNumero: segmentoA.substring(134, 154).trim(),
            dataEfetiva: formatDate(segmentoA.substring(154, 162)),
            valorEfetivo: parseFloat(segmentoA.substring(162, 177)) / 100,
          };
          
          // Add recipient details if available
          if (segmentoB && segmentoB.substring(13, 14) === 'B') {
            pagamento.inscricaoFavorecido = {
              tipo: segmentoB.substring(17, 18),
              numero: segmentoB.substring(18, 32).trim()
            };
            pagamento.enderecoFavorecido = {
              logradouro: segmentoB.substring(32, 62).trim(),
              numero: segmentoB.substring(62, 67).trim(),
              complemento: segmentoB.substring(67, 82).trim(),
              bairro: segmentoB.substring(82, 97).trim(),
              cidade: segmentoB.substring(97, 117).trim(),
              cep: segmentoB.substring(117, 125).trim(),
              estado: segmentoB.substring(125, 127)
            };
          }
          
          pagamentos.push(pagamento);
        }
      }
    }
    
    // Build final JSON structure
    return {
      header: headerInfo,
      pagamentos,
      totalPagamentos: pagamentos.length,
      valorTotal: pagamentos.reduce((sum, p) => sum + p.valorPagamento, 0)
    };
  } catch (error) {
    console.error('Erro ao converter CNAB para JSON:', error);
    throw new Error('Erro ao converter os dados CNAB para formato JSON.');
  }
};
