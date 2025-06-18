
import { FavorecidoData } from '@/types/favorecido';
import { RowData } from '@/types/importacao';

export const mapFavorecidoToRowData = (favorecido: FavorecidoData, index: number, valorWorkflow?: number): RowData => {
  console.log("🔄 Mapping favorecido to RowData:", favorecido);
  console.log("🔄 Valor from workflow:", valorWorkflow);
  
  // CORRIGIDO: Usar valor do workflow se disponível, senão usar valorPadrao, senão usar 100 como padrão
  const valor = valorWorkflow || favorecido.valorPadrao || 100;
  
  // ADDED: Validação básica dos campos obrigatórios
  if (!favorecido.nome || !favorecido.inscricao || !favorecido.banco || !favorecido.agencia || !favorecido.conta) {
    console.error("❌ Favorecido com campos obrigatórios ausentes:", favorecido);
    throw new Error(`Favorecido ${favorecido.nome || 'sem nome'} possui campos obrigatórios ausentes`);
  }
  
  const rowData: RowData = {
    id: index,
    selected: true,
    NOME: favorecido.nome.toString().trim(),
    INSCRICAO: favorecido.inscricao.toString().trim(),
    BANCO: favorecido.banco.toString().trim(),
    AGENCIA: favorecido.agencia.toString().trim(),
    CONTA: favorecido.conta.toString().trim(),
    TIPO: favorecido.tipoConta || 'CC', // CC, PP, TD - fallback para CC
    VALOR: Number(valor) // CORRIGIDO: Garantir que é sempre um número
  };
  
  console.log("✅ Mapped RowData with valor:", rowData.VALOR);
  console.log("✅ Complete mapped data:", rowData);
  return rowData;
};

export const validateFavorecidos = (tableData: RowData[]) => {
  console.log("🔍 Validating favorecidos:", tableData);
  
  const errors: any[] = [];
  let validRecordsCount = 0;
  
  for (const row of tableData) {
    const rowErrors: any[] = [];
    
    // Validate required fields
    if (!row.NOME || row.NOME.toString().trim() === '') {
      rowErrors.push({ field: 'NOME', message: 'Nome é obrigatório' });
    }
    
    if (!row.INSCRICAO || row.INSCRICAO.toString().trim() === '') {
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
    
    // CORRIGIDO: Validação mais robusta do valor
    const valor = Number(row.VALOR);
    if (isNaN(valor) || valor <= 0) {
      rowErrors.push({ field: 'VALOR', message: `Valor deve ser maior que zero, recebido: ${row.VALOR}` });
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
