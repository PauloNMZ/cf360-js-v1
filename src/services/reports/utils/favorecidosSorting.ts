
import { RowData } from '@/types/importacao';
import { ReportSortType } from '@/types/reportSorting';

/**
 * Ordena favorecidos de acordo com o tipo de ordenação escolhido
 */
export const ordenarFavorecidos = (favorecidos: RowData[], sortType: ReportSortType = ReportSortType.BY_NAME): RowData[] => {
  const sortedFavorecidos = [...favorecidos].sort((a, b) => {
    switch (sortType) {
      case ReportSortType.BY_NAME:
        const nomeA = (a.NOME || '').toString().toUpperCase();
        const nomeB = (b.NOME || '').toString().toUpperCase();
        return nomeA.localeCompare(nomeB);
      
      case ReportSortType.BY_BANK_NAME:
        const bancoA = (a.BANCO || '').toString().padStart(3, '0');
        const bancoB = (b.BANCO || '').toString().padStart(3, '0');
        const compareBanco = bancoA.localeCompare(bancoB);
        
        if (compareBanco !== 0) return compareBanco;
        
        const nomeA2 = (a.NOME || '').toString().toUpperCase();
        const nomeB2 = (b.NOME || '').toString().toUpperCase();
        const compareNome = nomeA2.localeCompare(nomeB2);
        
        if (compareNome !== 0) return compareNome;
        
        const tipoA = (a.TIPO || '').toString();
        const tipoB = (b.TIPO || '').toString();
        return tipoA.localeCompare(tipoB);
      
      case ReportSortType.BY_BANK_VALUE:
        const bancoA3 = (a.BANCO || '').toString().padStart(3, '0');
        const bancoB3 = (b.BANCO || '').toString().padStart(3, '0');
        const compareBanco3 = bancoA3.localeCompare(bancoB3);
        
        if (compareBanco3 !== 0) return compareBanco3;
        
        const valorA = typeof a.VALOR === 'number' 
          ? a.VALOR
          : parseFloat(a.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        const valorB = typeof b.VALOR === 'number' 
          ? b.VALOR
          : parseFloat(b.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        
        return valorB - valorA; // Decrescente
      
      case ReportSortType.BY_VALUE_DESC:
        const valorA2 = typeof a.VALOR === 'number' 
          ? a.VALOR
          : parseFloat(a.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        const valorB2 = typeof b.VALOR === 'number' 
          ? b.VALOR
          : parseFloat(b.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        
        return valorB2 - valorA2; // Decrescente
      
      default:
        return 0;
    }
  });

  return sortedFavorecidos;
};
