
import { Favorecido } from '@/types/cnab240';

/**
 * Constantes para tipos de lançamento
 */
export const TIPO_LANCAMENTO = {
  BB_CONTA_CORRENTE: "01",
  BB_POUPANCA: "05",
  OUTROS_BANCOS: "03"
};

/**
 * Filter recipients by type
 */
export const filtrarFavorecidosPorTipo = (
  favorecidos: Favorecido[],
  tipoLancamento: string
): Favorecido[] => {
  switch (tipoLancamento) {
    case TIPO_LANCAMENTO.BB_CONTA_CORRENTE: // BB Conta Corrente
      return favorecidos.filter(f => f.tipo.toUpperCase().trim() === "CC" && f.banco === "001");
    case TIPO_LANCAMENTO.BB_POUPANCA: // BB Poupança
      return favorecidos.filter(f => f.tipo.toUpperCase().trim() === "PP" && f.banco === "001");
    case TIPO_LANCAMENTO.OUTROS_BANCOS: // Outros Bancos
      return favorecidos.filter(f => f.banco !== "001");
    default:
      return [];
  }
};
