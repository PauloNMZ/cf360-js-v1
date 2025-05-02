
import { Favorecido } from '@/types/cnab240';
import { gravarSegmentoA } from '../segmentos/segmentoA';
import { gravarSegmentoB } from '../segmentos/segmentoB';
import { gravarHeaderLote, gravarTrailerLote } from '../generators/headerGenerators';
import { strZero } from '@/utils/cnabUtils';
import { COD_BB, MOEDA_BRL, EmpresaConfig } from '@/types/cnab240';

/**
 * Process a batch of recipients of the same type
 */
export const processarLote = (
  config: EmpresaConfig,
  favorecidos: Favorecido[],
  tipoLancamento: string,
  seqLote: number
): {
  linhas: string[];
  somaValores: number;
  totalRegistros: number;
} => {
  const linhas: string[] = [];
  let somaValores = 0;
  
  // Check if there are recipients of this type
  if (favorecidos.length === 0) {
    return { linhas: [], somaValores: 0, totalRegistros: 0 };
  }

  // Format sequence as string with leading zeros
  const seqLoteStr = strZero(seqLote.toString(), 4);
  
  // Write batch header
  const headerLote = gravarHeaderLote(config, seqLoteStr, tipoLancamento);
  linhas.push(headerLote);
  
  // Initialize variables for record control
  let seqRegistro = 0;

  // Process each recipient
  for (const favorecido of favorecidos) {
    // Increment record sequence
    seqRegistro++;

    // Get payment value
    const valorPagamento = favorecido.valor;

    // Write segment A
    const segmentoA = gravarSegmentoA(
      COD_BB,
      seqLoteStr,
      seqRegistro,
      tipoLancamento,
      favorecido.nome,
      favorecido.inscricao,
      favorecido.banco,
      favorecido.agencia,
      favorecido.conta,
      valorPagamento,
      config.dataPagamento,
      config.nrDocumento,
      MOEDA_BRL
    );
    
    linhas.push(segmentoA);

    // Increment record sequence
    seqRegistro++;

    // Write segment B
    const segmentoB = gravarSegmentoB(
      COD_BB,
      seqLoteStr,
      seqRegistro,
      favorecido.inscricao,
      valorPagamento
    );
    
    linhas.push(segmentoB);

    // Accumulate value for trailer
    somaValores += valorPagamento;
  }

  // Write batch trailer (including header and segments)
  const trailerLote = gravarTrailerLote(
    seqLoteStr,
    seqRegistro + 2, // Include header and trailer
    somaValores
  );
  
  linhas.push(trailerLote);
  
  return {
    linhas,
    somaValores,
    totalRegistros: seqRegistro + 2 // Total records in batch including header and trailer
  };
};

/**
 * Filter recipients by type
 */
export const filtrarFavorecidosPorTipo = (
  favorecidos: Favorecido[],
  tipoLancamento: string
): Favorecido[] => {
  switch (tipoLancamento) {
    case "01": // BB Conta Corrente
      return favorecidos.filter(f => f.tipo.toUpperCase().trim() === "CC" && f.banco === "001");
    case "05": // BB Poupança
      return favorecidos.filter(f => f.tipo.toUpperCase().trim() === "PP" && f.banco === "001");
    case "03": // Outros Bancos
      return favorecidos.filter(f => f.banco !== "001");
    default:
      return [];
  }
};
