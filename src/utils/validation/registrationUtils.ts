
/**
 * Registration validation utility functions for CNAB files
 */

import { retirarCHR } from '../formatting/stringUtils';
import { calcularDV } from './digitVerificationUtils';

// Validate CNPJ
export const validarCNPJ = (cnpj: string): boolean => {
  // Basic validation - remove non-digits and check length
  cnpj = cnpj.replace(/\D/g, '');
  
  if (cnpj.length !== 14) {
    return false;
  }
  
  // Check for obvious invalid values (all digits the same)
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  // Validate first verification digit
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  let verificationDigit = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (parseInt(cnpj.charAt(12)) !== verificationDigit) {
    return false;
  }

  // Validate second verification digit
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  verificationDigit = sum % 11 < 2 ? 0 : 11 - sum % 11;
  return parseInt(cnpj.charAt(13)) === verificationDigit;
};

// Validate CPF
export const validarCPF = (cpf: string): boolean => {
  // Basic validation - remove non-digits and check length
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11) {
    return false;
  }
  
  // Check for obvious invalid values (all digits the same)
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Validate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let verificationDigit = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (parseInt(cpf.charAt(9)) !== verificationDigit) {
    return false;
  }

  // Validate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  verificationDigit = sum % 11 < 2 ? 0 : 11 - sum % 11;
  return parseInt(cpf.charAt(10)) === verificationDigit;
};

// Validate registration number (CPF or CNPJ)
export const validarInscricao = (inscricao: string): boolean => {
  const limpo = retirarCHR(inscricao);
  
  if (limpo.length <= 11) {
    return validarCPF(limpo);
  } else {
    return validarCNPJ(limpo);
  }
};

