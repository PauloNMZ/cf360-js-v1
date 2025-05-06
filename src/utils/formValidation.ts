
import { validarCPF, validarCNPJ } from './validation/registrationUtils';
import { ajustarTamanho } from './formatting/stringUtils';

export const validateCNPJ = (cnpj: string): boolean => {
  return validarCNPJ(cnpj);
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};

// Improved CNPJ formatter with better partial formatting support
export const formatCNPJ = (value: string): string => {
  // Get cursor position and original length for later calculation
  const originalLength = value.length;
  
  // Remove non-digit characters
  const cnpjClean = value.replace(/\D/g, '');
  
  // If no digits, return empty string
  if (cnpjClean.length === 0) return '';
  
  // Apply partial formatting based on the number of digits
  if (cnpjClean.length <= 2) {
    return cnpjClean;
  } else if (cnpjClean.length <= 5) {
    return cnpjClean.replace(/^(\d{2})(\d*)$/, '$1.$2');
  } else if (cnpjClean.length <= 8) {
    return cnpjClean.replace(/^(\d{2})(\d{3})(\d*)$/, '$1.$2.$3');
  } else if (cnpjClean.length <= 12) {
    return cnpjClean.replace(/^(\d{2})(\d{3})(\d{3})(\d*)$/, '$1.$2.$3/$4');
  } else {
    // Full CNPJ formatting: xx.xxx.xxx/xxxx-xx
    return cnpjClean
      .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d*)$/, '$1.$2.$3/$4-$5')
      .substring(0, 18); // Ensure it doesn't exceed 18 chars (formatted CNPJ length)
  }
};

export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 11) {
    if (cleaned.length <= 10) {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    } else {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
  }
  return cleaned.substring(0, 11);
};

export const formatCEP = (value: string): string => {
  const cepClean = value.replace(/\D/g, '');
  if (cepClean.length <= 8) {
    return cepClean
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  }
  return cepClean.substring(0, 8);
};
