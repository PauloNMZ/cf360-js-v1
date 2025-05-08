
import { ErrorRecord, Favorecido, FavorecidoError } from '@/types/cnab240';
import { RowData } from '@/types/importacao';
import { validateFavorecido } from './favorecidoValidator';

/**
 * Validates payment recipients for CNAB240 file generation
 */
export const validateFavorecidos = (tableData: RowData[]): {
  errors: ErrorRecord[],
  validRecordsCount: number,
  totalRecords: number
} => {
  const errors: ErrorRecord[] = [];
  let validCount = 0;
  
  tableData.forEach((row) => {
    const favorecido: Favorecido = {
      nome: row.NOME,
      inscricao: row.INSCRICAO,
      banco: row.BANCO.toString().trim().padStart(3, '0'), // Normalize bank code
      agencia: row.AGENCIA,
      conta: row.CONTA,
      tipo: row.TIPO,
      valor: typeof row.VALOR === 'number' 
        ? row.VALOR 
        : parseFloat(row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'))
    };
    
    const recordErrors: FavorecidoError[] = validateFavorecido(favorecido);
    
    if (recordErrors.length > 0) {
      errors.push({
        id: row.id,
        favorecido,
        errors: recordErrors
      });
    } else {
      validCount++;
    }
  });
  
  return {
    errors,
    validRecordsCount: validCount,
    totalRecords: tableData.length
  };
};
