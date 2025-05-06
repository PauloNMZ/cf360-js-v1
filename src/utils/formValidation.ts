
import { validarCPF, validarCNPJ } from './validation/registrationUtils';
import { ajustarTamanho } from './formatting/stringUtils';
import { formatCNPJ as formatCNPJUtil } from './formatting/cnpjFormatter';

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

// Use the well-tested CNPJ formatter from the utility file
export const formatCNPJ = formatCNPJUtil;

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
