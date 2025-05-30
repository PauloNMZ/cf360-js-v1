
import { ErrorRecord, Favorecido, FavorecidoError } from '@/types/cnab240';
import { RowData } from '@/types/importacao';
import { validateFavorecido } from './favorecidoValidator';

/**
 * Safely converts a value to string, handling numbers and undefined values
 */
const safeToString = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

/**
 * Safely converts a value to number, handling strings and undefined values
 */
const safeToNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  
  if (typeof value === 'number') return value;
  
  if (typeof value === 'string') {
    // Remove currency symbols and formatting, replace comma with dot
    const cleanValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  return 0;
};

/**
 * Validates payment recipients for CNAB240 file generation
 */
export const validateFavorecidos = (tableData: RowData[]): {
  errors: ErrorRecord[],
  validRecordsCount: number,
  totalRecords: number
} => {
  console.log("validateFavorecidos - Input tableData:", tableData);
  console.log("validateFavorecidos - tableData length:", tableData.length);
  
  const errors: ErrorRecord[] = [];
  let validCount = 0;
  
  tableData.forEach((row, index) => {
    console.log(`validateFavorecidos - Processing row ${index}:`, row);
    
    const favorecido: Favorecido = {
      nome: safeToString(row.NOME),
      inscricao: safeToString(row.INSCRICAO),
      banco: safeToString(row.BANCO).trim().padStart(3, '0'), // Normalize bank code
      agencia: safeToString(row.AGENCIA),
      conta: safeToString(row.CONTA),
      tipo: safeToString(row.TIPO),
      valor: safeToNumber(row.VALOR)
    };
    
    console.log(`validateFavorecidos - Converted favorecido ${index}:`, favorecido);
    
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
  
  console.log("validateFavorecidos - Final result:", {
    errors: errors.length,
    validCount,
    totalRecords: tableData.length
  });
  
  return {
    errors,
    validRecordsCount: validCount,
    totalRecords: tableData.length
  };
};
