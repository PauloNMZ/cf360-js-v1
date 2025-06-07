
import { RowData } from '@/types/importacao';

// Tipos para categorização dos favorecidos
export interface TotaisPorCategoria {
  bancoBrasil: {
    quantidade: number;
    valor: number;
  };
  demaisIF: {
    quantidade: number;
    valor: number;
  };
  total: {
    quantidade: number;
    valor: number;
  };
}

/**
 * Categoriza favorecidos entre Banco do Brasil e demais instituições
 */
export const categorizarFavorecidosPorBanco = (favorecidos: RowData[]): TotaisPorCategoria => {
  const totais: TotaisPorCategoria = {
    bancoBrasil: { quantidade: 0, valor: 0 },
    demaisIF: { quantidade: 0, valor: 0 },
    total: { quantidade: 0, valor: 0 }
  };

  favorecidos.forEach(favorecido => {
    const valor = typeof favorecido.VALOR === 'number' 
      ? favorecido.VALOR
      : parseFloat(favorecido.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
    
    if (!isNaN(valor)) {
      const banco = favorecido.BANCO.toString().padStart(3, '0');
      
      if (banco === '001') {
        // Banco do Brasil
        totais.bancoBrasil.quantidade++;
        totais.bancoBrasil.valor += valor;
      } else {
        // Demais Instituições Financeiras
        totais.demaisIF.quantidade++;
        totais.demaisIF.valor += valor;
      }
    }
  });

  // Calcular totais gerais
  totais.total.quantidade = totais.bancoBrasil.quantidade + totais.demaisIF.quantidade;
  totais.total.valor = totais.bancoBrasil.valor + totais.demaisIF.valor;

  return totais;
};
