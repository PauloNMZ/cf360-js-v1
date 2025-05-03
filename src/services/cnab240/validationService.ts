
import { ErrorRecord, Favorecido, FavorecidoError } from '@/types/cnab240';
import { 
  validarConta,
  validarAgencia,
  validarInscricao,
  retirarCHR,
  formatarCpfCnpj
} from '@/utils/cnabUtils';
import { RowData } from '@/types/importacao';

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
      banco: row.BANCO,
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

/**
 * Validates a single recipient record
 */
export const validateFavorecido = (favorecido: Favorecido): FavorecidoError[] => {
  const errors: FavorecidoError[] = [];
  
  // Validate name
  if (!favorecido.nome || favorecido.nome.trim() === '') {
    errors.push({
      field: 'nome',
      message: 'Nome do favorecido é obrigatório'
    });
  }
  
  // Validate inscription (CPF/CNPJ) - always validate for all banks
  if (!favorecido.inscricao || favorecido.inscricao.trim() === '') {
    errors.push({
      field: 'inscricao',
      message: 'Inscrição (CPF/CNPJ) é obrigatória'
    });
  } else if (!validarInscricao(favorecido.inscricao)) {
    errors.push({
      field: 'inscricao',
      message: 'Inscrição (CPF/CNPJ) inválida'
    });
  }
  
  // Validate bank code
  if (!favorecido.banco || favorecido.banco.trim() === '') {
    errors.push({
      field: 'banco',
      message: 'Código do banco é obrigatório'
    });
  } else if (favorecido.banco === '001') {
    // Additional validations only for Banco do Brasil (001)
    
    // Validate branch
    const agenciaResult = validarAgencia(favorecido.agencia);
    if (!agenciaResult.valido) {
      errors.push({
        field: 'agencia',
        message: 'Dígito verificador da agência inválido',
        expectedValue: agenciaResult.digitoEsperado,
        actualValue: agenciaResult.digitoInformado
      });
    }
    
    // Validate account
    const contaResult = validarConta(favorecido.conta);
    if (!contaResult.valido) {
      errors.push({
        field: 'conta',
        message: 'Dígito verificador da conta inválido',
        expectedValue: contaResult.digitoEsperado,
        actualValue: contaResult.digitoInformado
      });
    }
    
    // Validate account type - only check for Banco do Brasil (001)
    if (!favorecido.tipo || !['CC', 'PP'].includes(favorecido.tipo.toUpperCase().trim())) {
      errors.push({
        field: 'tipo',
        message: 'Tipo de conta deve ser CC (Conta Corrente) ou PP (Poupança)'
      });
    }
  } else {
    // Basic validations for other banks (without digit verification)
    if (!favorecido.agencia || favorecido.agencia.trim() === '') {
      errors.push({
        field: 'agencia',
        message: 'Agência é obrigatória'
      });
    }
    
    if (!favorecido.conta || favorecido.conta.trim() === '') {
      errors.push({
        field: 'conta',
        message: 'Conta é obrigatória'
      });
    }
    
    // Para outros bancos, validar tipo como TD ou PP
    if (!favorecido.tipo || !['TD', 'PP'].includes(favorecido.tipo.toUpperCase().trim())) {
      errors.push({
        field: 'tipo',
        message: 'Tipo de conta deve ser TD (Conta Corrente) ou PP (Poupança)'
      });
    }
  }
  
  // Validate value (for all banks)
  if (isNaN(favorecido.valor) || favorecido.valor <= 0) {
    errors.push({
      field: 'valor',
      message: 'Valor deve ser maior que zero'
    });
  }
  
  return errors;
};

/**
 * Convert RowData to Favorecido objects with validation
 * Now excludes records with validation errors from the CNAB file
 */
export const convertAndValidateRows = (rows: RowData[]): { favorecidos: Favorecido[], errorRows: RowData[] } => {
  const favorecidos: Favorecido[] = [];
  const errorRows: RowData[] = [];
  
  for (const row of rows) {
    if (!row.selected) continue;
    
    const favorecido: Favorecido = {
      nome: row.NOME,
      inscricao: row.INSCRICAO,
      banco: row.BANCO,
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
