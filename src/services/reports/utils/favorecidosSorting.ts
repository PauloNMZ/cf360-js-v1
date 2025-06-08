
import { RowData } from '@/types/importacao';
import { ReportSortType } from '@/types/reportSorting';

/**
 * Ordena favorecidos de acordo com o tipo de ordenação escolhido
 */
export const ordenarFavorecidos = (favorecidos: RowData[], sortType: ReportSortType = ReportSortType.BY_NAME): RowData[] => {
  console.log("=== 🔄 DEBUG ordenarFavorecidos ===");
  console.log("Input favorecidos count:", favorecidos.length);
  console.log("sortType received:", sortType);
  console.log("sortType type:", typeof sortType);
  console.log("sortType stringified:", JSON.stringify(sortType));
  console.log("ReportSortType.BY_NAME:", ReportSortType.BY_NAME);
  console.log("ReportSortType.BY_BANK_NAME:", ReportSortType.BY_BANK_NAME);
  console.log("ReportSortType.BY_BANK_VALUE:", ReportSortType.BY_BANK_VALUE);
  console.log("ReportSortType.BY_VALUE_DESC:", ReportSortType.BY_VALUE_DESC);
  
  // Log sample of favorecidos values
  console.log("=== 📈 Sample favorecidos values ===");
  favorecidos.slice(0, 3).forEach((fav, idx) => {
    console.log(`Sample ${idx}: ${fav.NOME} - Banco: ${fav.BANCO} - Valor: ${fav.VALOR} (type: ${typeof fav.VALOR})`);
  });

  const sortedFavorecidos = [...favorecidos].sort((a, b) => {
    console.log(`🔍 Comparing ${a.NOME} vs ${b.NOME} with sortType: ${sortType}`);
    
    switch (sortType) {
      case ReportSortType.BY_NAME:
        console.log("📝 Sorting BY_NAME");
        const nomeA = (a.NOME || '').toString().toUpperCase();
        const nomeB = (b.NOME || '').toString().toUpperCase();
        const nameResult = nomeA.localeCompare(nomeB);
        console.log(`Name comparison: ${nomeA} vs ${nomeB} = ${nameResult}`);
        return nameResult;
      
      case ReportSortType.BY_BANK_NAME:
        console.log("🏦 Sorting BY_BANK_NAME");
        const bancoA = (a.BANCO || '').toString().padStart(3, '0');
        const bancoB = (b.BANCO || '').toString().padStart(3, '0');
        const compareBanco = bancoA.localeCompare(bancoB);
        
        if (compareBanco !== 0) {
          console.log(`Bank comparison: ${bancoA} vs ${bancoB} = ${compareBanco}`);
          return compareBanco;
        }
        
        const nomeA2 = (a.NOME || '').toString().toUpperCase();
        const nomeB2 = (b.NOME || '').toString().toUpperCase();
        const compareNome = nomeA2.localeCompare(nomeB2);
        
        if (compareNome !== 0) return compareNome;
        
        const tipoA = (a.TIPO || '').toString();
        const tipoB = (b.TIPO || '').toString();
        return tipoA.localeCompare(tipoB);
      
      case ReportSortType.BY_BANK_VALUE:
        console.log("🏦💰 Sorting BY_BANK_VALUE");
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
        
        console.log(`Value comparison in bank: ${valorA} vs ${valorB}`);
        return valorB - valorA; // Decrescente
      
      case ReportSortType.BY_VALUE_DESC:
        console.log("💰 Sorting BY_VALUE_DESC");
        const valorA2 = typeof a.VALOR === 'number' 
          ? a.VALOR
          : parseFloat(a.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        const valorB2 = typeof b.VALOR === 'number' 
          ? b.VALOR
          : parseFloat(b.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        
        console.log(`Value comparison: ${valorA2} vs ${valorB2}`);
        const valueResult = valorB2 - valorA2; // Decrescente
        console.log(`Value result: ${valueResult}`);
        return valueResult;
      
      default:
        console.log("⚠️ Unknown sortType, using default");
        return 0;
    }
  });

  console.log("=== ✅ Sorted favorecidos result ===");
  console.log("Output favorecidos count:", sortedFavorecidos.length);
  sortedFavorecidos.slice(0, 5).forEach((fav, idx) => {
    console.log(`Result ${idx}: ${fav.NOME} - Banco: ${fav.BANCO} - Valor: ${fav.VALOR}`);
  });

  return sortedFavorecidos;
};
