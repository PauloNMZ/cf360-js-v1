
import { FavorecidoError, Favorecido } from '@/types/cnab240';
import { 
  validarConta,
  validarAgencia,
  validarInscricao
} from '@/utils/cnabUtils';

/**
 * Safely converts a value to string, handling numbers and undefined values
 */
const safeToString = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

/**
 * Validates a single recipient record
 */
export const validateFavorecido = (favorecido: Favorecido): FavorecidoError[] => {
  console.log("validateFavorecido - Input favorecido:", favorecido);
  
  const errors: FavorecidoError[] = [];
  
  // Convert all fields to strings safely
  const nome = safeToString(favorecido.nome).trim();
  const inscricao = safeToString(favorecido.inscricao).trim();
  const banco = safeToString(favorecido.banco).trim();
  const agencia = safeToString(favorecido.agencia).trim();
  const conta = safeToString(favorecido.conta).trim();
  const tipo = safeToString(favorecido.tipo).trim().toUpperCase();
  
  console.log("validateFavorecido - Converted fields:", { nome, inscricao, banco, agencia, conta, tipo });
  
  // Validate name
  if (!nome || nome === '') {
    errors.push({
      field: 'nome',
      message: 'Nome do favorecido é obrigatório'
    });
  }
  
  // Validate inscription (CPF/CNPJ) - always validate for all banks
  if (!inscricao || inscricao === '') {
    errors.push({
      field: 'inscricao',
      message: 'Inscrição (CPF/CNPJ) é obrigatória'
    });
  } else if (!validarInscricao(inscricao)) {
    errors.push({
      field: 'inscricao',
      message: 'Inscrição (CPF/CNPJ) inválida'
    });
  }
  
  // Validate bank code
  if (!banco || banco === '') {
    errors.push({
      field: 'banco',
      message: 'Código do banco é obrigatório'
    });
  } else {
    // Normalizar código do banco antes de comparar, preenchendo com zeros à esquerda até 3 dígitos
    const bancoNormalizado = banco.padStart(3, '0');
    
    if (bancoNormalizado === '001') {
      // Validações específicas para Banco do Brasil (001)
      
      // Validate branch
      if (!agencia || agencia === '') {
        errors.push({
          field: 'agencia',
          message: 'Agência é obrigatória'
        });
      } else {
        const agenciaResult = validarAgencia(agencia);
        if (!agenciaResult.valido) {
          errors.push({
            field: 'agencia',
            message: 'Dígito verificador da agência inválido',
            expectedValue: agenciaResult.digitoEsperado,
            actualValue: agenciaResult.digitoInformado
          });
        }
      }
      
      // Validate account
      if (!conta || conta === '') {
        errors.push({
          field: 'conta',
          message: 'Conta é obrigatória'
        });
      } else {
        const contaResult = validarConta(conta);
        if (!contaResult.valido) {
          errors.push({
            field: 'conta',
            message: 'Dígito verificador da conta inválido',
            expectedValue: contaResult.digitoEsperado,
            actualValue: contaResult.digitoInformado
          });
        }
      }
      
      // Para Banco do Brasil (001), validar tipo como CC ou PP
      if (!tipo || !['CC', 'PP'].includes(tipo)) {
        errors.push({
          field: 'tipo',
          message: 'Para Banco do Brasil (001), tipo de conta deve ser CC (Conta Corrente) ou PP (Poupança)'
        });
      }
    } else {
      // Validações básicas para outros bancos (sem verificação de dígito)
      if (!agencia || agencia === '') {
        errors.push({
          field: 'agencia',
          message: 'Agência é obrigatória'
        });
      }
      
      if (!conta || conta === '') {
        errors.push({
          field: 'conta',
          message: 'Conta é obrigatória'
        });
      }
      
      // Para outros bancos, validar tipo como TD ou PP
      if (!tipo || !['TD', 'PP'].includes(tipo)) {
        errors.push({
          field: 'tipo',
          message: 'Para outros bancos, tipo de conta deve ser TD (Conta Corrente) ou PP (Poupança)'
        });
      }
    }
  }
  
  // Validate value (for all banks)
  if (isNaN(favorecido.valor) || favorecido.valor <= 0) {
    errors.push({
      field: 'valor',
      message: 'Valor deve ser maior que zero'
    });
  }
  
  console.log("validateFavorecido - Validation errors:", errors);
  return errors;
};
