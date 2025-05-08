
import { FavorecidoError, Favorecido } from '@/types/cnab240';
import { 
  validarConta,
  validarAgencia,
  validarInscricao
} from '@/utils/cnabUtils';

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
  } else {
    // Normalizar código do banco antes de comparar, preenchendo com zeros à esquerda até 3 dígitos
    const bancoCodigo = favorecido.banco.trim();
    const bancoNormalizado = bancoCodigo.padStart(3, '0');
    
    if (bancoNormalizado === '001') {
      // Validações específicas para Banco do Brasil (001)
      
      // Validate branch
      if (!favorecido.agencia || favorecido.agencia.trim() === '') {
        errors.push({
          field: 'agencia',
          message: 'Agência é obrigatória'
        });
      } else {
        const agenciaResult = validarAgencia(favorecido.agencia);
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
      if (!favorecido.conta || favorecido.conta.trim() === '') {
        errors.push({
          field: 'conta',
          message: 'Conta é obrigatória'
        });
      } else {
        const contaResult = validarConta(favorecido.conta);
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
      if (!favorecido.tipo || !['CC', 'PP'].includes(favorecido.tipo.toUpperCase().trim())) {
        errors.push({
          field: 'tipo',
          message: 'Para Banco do Brasil (001), tipo de conta deve ser CC (Conta Corrente) ou PP (Poupança)'
        });
      }
    } else {
      // Validações básicas para outros bancos (sem verificação de dígito)
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
  
  return errors;
};
