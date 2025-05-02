
/**
 * CNAB specific formatting utility functions
 */

import { removerAcentos } from './stringUtils';
import { formatarValorCurrency } from './currencyUtils';

// Format recipient's name (remove accents, convert to uppercase)
export const formatarNomeFavorecido = (nome: string): string => {
  if (!nome) return '';
  
  return removerAcentos(nome.toUpperCase().trim());
};

// Format a complete address from company config
export const formatarEnderecoCompleto = (config: any): string => {
  if (!config) return '';
  
  const endereco = config.endereco || '';
  return removerAcentos(endereco.toUpperCase().trim());
};

// Format bank branch with hyphen
export const formatarAgencia = (agencia: string): string => {
  const ultimoDigito = agencia.slice(-1);
  const ageSemDigito = agencia.slice(0, -1);
  return `${ageSemDigito}-${ultimoDigito}`;
};

// Format account number with dots and hyphen
export const formatarConta = (conta: string): string => {
  const ultimoDigito = conta.slice(-1);
  const nrSemDigito = conta.slice(0, -1);
  
  // Format with dots every 3 digits
  const nrFormatado = parseInt(nrSemDigito).toLocaleString('pt-BR').replace(/\./g, '.');
  
  return `${nrFormatado}-${ultimoDigito}`;
};

// Format CPF or CNPJ
export const formatarCpfCnpj = (valor: string | number, formatado: boolean = true): string => {
  // Remove any non-numeric character
  const valorLimpo = String(valor).replace(/\D/g, '');
  
  if (!formatado) {
    // Return only numbers with leading zeros
    return valorLimpo.length > 11 
      ? valorLimpo.padStart(14, '0') 
      : valorLimpo.padStart(11, '0');
  }
  
  // Fill with zeros to the left until reaching the correct size
  if (valorLimpo.length <= 11) {  // CPF
    const valorPreenchido = valorLimpo.padStart(11, '0');
    return `${valorPreenchido.slice(0, 3)}.${valorPreenchido.slice(3, 6)}.${valorPreenchido.slice(6, 9)}-${valorPreenchido.slice(9)}`;
  } else {  // CNPJ
    const valorPreenchido = valorLimpo.padStart(14, '0');
    return `${valorPreenchido.slice(0, 2)}.${valorPreenchido.slice(2, 5)}.${valorPreenchido.slice(5, 8)}/${valorPreenchido.slice(8, 12)}-${valorPreenchido.slice(12)}`;
  }
};

