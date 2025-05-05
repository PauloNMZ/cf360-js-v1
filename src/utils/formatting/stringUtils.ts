/**
 * String formatting utility functions for CNAB files
 */

// Remove special characters from a string
export const retirarCHR = (texto: string): string => {
  if (!texto) return '';
  return texto.replace(/[^\d]/g, '');
};

// Adjust string size and padding
export const ajustarTamanho = (
  texto: string | number | undefined,
  tamanho: number,
  caractere: string = " ",
  aEsquerda: boolean = false
): string => {
  // Convert to string if it's a number
  let str = String(texto || '');
  
  // Truncate if longer than specified size
  if (str.length > tamanho) {
    return str.substring(0, tamanho);
  }
  
  // Add padding to reach the specified size
  const paddingLength = tamanho - str.length;
  const padding = caractere.repeat(paddingLength);
  
  if (aEsquerda) {
    return padding + str; // Left padding
  } else {
    return str + padding; // Right padding
  }
};

// Format a number with leading zeros
export const strZero = (valor: string | number, tamanho: number): string => {
  return ajustarTamanho(valor, tamanho, "0", true);
};

// Remove accents from a string
export const removerAcentos = (texto: string): string => {
  if (!texto) return '';
  
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Remove accents and ensure uppercase
export const semAcento = (texto: string): string => {
  return removerAcentos(texto.toUpperCase());
};

// Format CPF/CNPJ with mask
export const formatCPFCNPJ = (valor: string): string => {
  if (!valor) return '';
  
  // Clean input, keep only numbers
  const valorLimpo = valor.replace(/\D/g, '');
  
  // Format as CPF
  if (valorLimpo.length <= 11) {
    // Ensure 11 digits for CPF with leading zeros
    const cpf = valorLimpo.padStart(11, '0');
    return `${cpf.substr(0, 3)}.${cpf.substr(3, 3)}.${cpf.substr(6, 3)}-${cpf.substr(9, 2)}`;
  } 
  // Format as CNPJ
  else {
    // Ensure 14 digits for CNPJ with leading zeros
    const cnpj = valorLimpo.padStart(14, '0');
    return `${cnpj.substr(0, 2)}.${cnpj.substr(2, 3)}.${cnpj.substr(5, 3)}/${cnpj.substr(8, 4)}-${cnpj.substr(12, 2)}`;
  }
};
