
import { FavorecidoData } from '@/types/favorecido';
import { RowData } from '@/types/importacao';

export const mapFavorecidoToRowData = (favorecido: FavorecidoData, index: number, valorWorkflow?: number): RowData => {
  console.log("🔄 mapFavorecidoToRowData - Starting mapping");
  console.log("🔄 Input favorecido:", favorecido);
  console.log("🔄 Input valorWorkflow:", valorWorkflow);
  console.log("🔄 Input index:", index);
  
  // ENHANCED: Validate required fields first
  console.log("🔍 Validating required fields...");
  
  const requiredFields = ['nome', 'inscricao', 'banco', 'agencia', 'conta'];
  const missingFields = requiredFields.filter(field => !favorecido[field]);
  
  if (missingFields.length > 0) {
    console.error("❌ Missing required fields:", missingFields);
    console.error("❌ Favorecido data:", favorecido);
    throw new Error(`Favorecido ${favorecido.nome || 'sem nome'} possui campos obrigatórios ausentes: ${missingFields.join(', ')}`);
  }
  
  console.log("✅ All required fields present");
  
  // ENHANCED: Determine valor with better logic and validation
  console.log("💰 Determining valor...");
  let valor: number;
  
  if (valorWorkflow !== undefined && valorWorkflow !== null) {
    valor = Number(valorWorkflow);
    console.log("💰 Using workflow value:", valor);
  } else if (favorecido.valorPadrao !== undefined && favorecido.valorPadrao !== null) {
    valor = Number(favorecido.valorPadrao);
    console.log("💰 Using favorecido default value:", valor);
  } else {
    valor = 100; // Default fallback
    console.log("💰 Using fallback value:", valor);
  }
  
  // Validate valor is a valid number
  if (isNaN(valor) || valor <= 0) {
    console.error("❌ Invalid valor:", valor);
    throw new Error(`Valor inválido para favorecido ${favorecido.nome}: ${valor}`);
  }
  
  console.log("✅ Final valor determined:", valor);
  
  // ENHANCED: Create RowData with detailed logging
  console.log("🏗️ Creating RowData object...");
  
  const rowData: RowData = {
    id: index,
    selected: true,
    NOME: String(favorecido.nome).trim(),
    INSCRICAO: String(favorecido.inscricao).trim(),
    BANCO: String(favorecido.banco).trim(),
    AGENCIA: String(favorecido.agencia).trim(),
    CONTA: String(favorecido.conta).trim(),
    TIPO: favorecido.tipoConta || 'CC', // CC, PP, TD - fallback para CC
    VALOR: valor
  };
  
  console.log("✅ RowData created successfully:", rowData);
  console.log("✅ RowData VALOR type:", typeof rowData.VALOR);
  console.log("✅ RowData VALOR value:", rowData.VALOR);
  
  // ENHANCED: Final validation of created RowData
  console.log("🔍 Final validation of RowData...");
  Object.entries(rowData).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'selected' && (value === undefined || value === null || value === '')) {
      console.error(`❌ Empty field in RowData: ${key} = ${value}`);
      throw new Error(`Campo ${key} está vazio no RowData para favorecido ${favorecido.nome}`);
    }
  });
  
  console.log("✅ RowData validation passed");
  return rowData;
};

export const validateFavorecidos = (tableData: RowData[]) => {
  console.log("🔍 validateFavorecidos - Starting validation");
  console.log("🔍 Input tableData count:", tableData.length);
  
  const errors: any[] = [];
  let validRecordsCount = 0;
  
  for (let i = 0; i < tableData.length; i++) {
    const row = tableData[i];
    console.log(`🔍 Validating row ${i}:`, row);
    
    const rowErrors: any[] = [];
    
    // Validate required fields
    if (!row.NOME || row.NOME.toString().trim() === '') {
      rowErrors.push({ field: 'NOME', message: 'Nome é obrigatório' });
      console.log(`❌ Row ${i}: Nome is missing`);
    }
    
    if (!row.INSCRICAO || row.INSCRICAO.toString().trim() === '') {
      rowErrors.push({ field: 'INSCRICAO', message: 'CPF/CNPJ é obrigatório' });
      console.log(`❌ Row ${i}: Inscricao is missing`);
    }
    
    if (!row.BANCO || row.BANCO.toString().trim() === '') {
      rowErrors.push({ field: 'BANCO', message: 'Código do banco é obrigatório' });
      console.log(`❌ Row ${i}: Banco is missing`);
    }
    
    if (!row.AGENCIA || row.AGENCIA.toString().trim() === '') {
      rowErrors.push({ field: 'AGENCIA', message: 'Agência é obrigatória' });
      console.log(`❌ Row ${i}: Agencia is missing`);
    }
    
    if (!row.CONTA || row.CONTA.toString().trim() === '') {
      rowErrors.push({ field: 'CONTA', message: 'Conta é obrigatória' });
      console.log(`❌ Row ${i}: Conta is missing`);
    }
    
    if (!row.TIPO || !['CC', 'PP', 'TD'].includes(row.TIPO)) {
      rowErrors.push({ field: 'TIPO', message: 'Tipo de conta deve ser CC, PP ou TD' });
      console.log(`❌ Row ${i}: Invalid TIPO: ${row.TIPO}`);
    }
    
    // ENHANCED: More robust valor validation
    console.log(`💰 Validating VALOR for row ${i}: ${row.VALOR} (type: ${typeof row.VALOR})`);
    const valor = Number(row.VALOR);
    if (isNaN(valor) || valor <= 0) {
      rowErrors.push({ field: 'VALOR', message: `Valor deve ser maior que zero, recebido: ${row.VALOR}` });
      console.log(`❌ Row ${i}: Invalid VALOR: ${row.VALOR}`);
    }
    
    if (rowErrors.length > 0) {
      errors.push({
        id: row.id,
        favorecido: row,
        errors: rowErrors
      });
      console.log(`❌ Row ${i} has ${rowErrors.length} errors:`, rowErrors);
    } else {
      validRecordsCount++;
      console.log(`✅ Row ${i} is valid`);
    }
  }
  
  const validationResult = {
    errors,
    validRecordsCount,
    totalRecords: tableData.length
  };
  
  console.log("✅ Validation complete:", validationResult);
  
  return validationResult;
};
