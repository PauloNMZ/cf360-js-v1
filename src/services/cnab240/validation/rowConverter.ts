import { Favorecido } from '@/types/cnab240';
import { RowData } from '@/types/importacao';
import { retirarCHR } from '@/utils/cnabUtils';
import { validateFavorecido } from './favorecidoValidator';

/**
 * Convert RowData to Favorecido objects with validation
 * Excludes records with validation errors from the CNAB file
 */
export const convertAndValidateRows = (rows: RowData[]): { favorecidos: Favorecido[], errorRows: RowData[] } => {
  const favorecidos: Favorecido[] = [];
  const errorRows: RowData[] = [];
  
  for (const row of rows) {
    if (!row.selected) continue;
    
    const favorecido: Favorecido = {
      nome: row.NOME,
      inscricao: row.INSCRICAO,
      banco: row.BANCO.toString().trim().padStart(3, '0'), // Normalizar código do banco
      agencia: retirarCHR(row.AGENCIA),
      conta: retirarCHR(row.CONTA),
      tipo: row.TIPO,
      valor: typeof row.VALOR === 'number' 
        ? row.VALOR 
        : parseFloat(row.VALOR.toString().replace(/[^\d.,]/g, '').replace(',', '.'))
    };
    
    const errors = validateFavorecido(favorecido);
    
    // Add validation status but only include valid records
    favorecido.isValid = errors.length === 0;
    
    // Only add valid records to favorecidos list
    if (favorecido.isValid) {
      favorecidos.push(favorecido);
    } else {
      // Keep track of rows with errors
      errorRows.push(row);
    }
  }
  
  return { favorecidos, errorRows };
};
