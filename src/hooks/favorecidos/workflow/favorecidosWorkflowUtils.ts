
import { FavorecidoData } from '@/types/favorecido';
import { RowData } from '@/types/importacao';

export const mapFavorecidoToRowData = (favorecido: FavorecidoData, index: number): RowData => {
  console.log("🔄 Mapping favorecido to RowData:", favorecido);
  
  const rowData: RowData = {
    id: index,
    selected: true,
    NOME: favorecido.nome,
    INSCRICAO: favorecido.inscricao,
    BANCO: favorecido.banco,
    AGENCIA: favorecido.agencia,
    CONTA: favorecido.conta,
    TIPO: favorecido.tipoConta, // CC, PP, TD
    VALOR: favorecido.valorPadrao || 0
  };
  
  console.log("✅ Mapped RowData:", rowData);
  return rowData;
};

export const validateFavorecidos = (tableData: RowData[]) => {
  console.log("🔍 Validating favorecidos:", tableData);
  
  const errors: any[] = [];
  let validRecordsCount = 0;
  
  for (const row of tableData) {
    const rowErrors: any[] = [];
    
    // Validate required fields
    if (!row.NOME || row.NOME.trim() === '') {
      rowErrors.push({ field: 'NOME', message: 'Nome é obrigatório' });
    }
    
    if (!row.INSCRICAO || row.INSCRICAO.trim() === '') {
      rowErrors.push({ field: 'INSCRICAO', message: 'CPF/CNPJ é obrigatório' });
    }
    
    if (!row.BANCO || row.BANCO.toString().trim() === '') {
      rowErrors.push({ field: 'BANCO', message: 'Código do banco é obrigatório' });
    }
    
    if (!row.AGENCIA || row.AGENCIA.toString().trim() === '') {
      rowErrors.push({ field: 'AGENCIA', message: 'Agência é obrigatória' });
    }
    
    if (!row.CONTA || row.CONTA.toString().trim() === '') {
      rowErrors.push({ field: 'CONTA', message: 'Conta é obrigatória' });
    }
    
    if (!row.TIPO || !['CC', 'PP', 'TD'].includes(row.TIPO)) {
      rowErrors.push({ field: 'TIPO', message: 'Tipo de conta deve ser CC, PP ou TD' });
    }
    
    if (!row.VALOR || row.VALOR <= 0) {
      rowErrors.push({ field: 'VALOR', message: 'Valor deve ser maior que zero' });
    }
    
    if (rowErrors.length > 0) {
      errors.push({
        id: row.id,
        favorecido: row,
        errors: rowErrors
      });
    } else {
      validRecordsCount++;
    }
  }
  
  console.log("✅ Validation complete:", { errors: errors.length, validRecordsCount, totalRecords: tableData.length });
  
  return {
    errors,
    validRecordsCount,
    totalRecords: tableData.length
  };
};
