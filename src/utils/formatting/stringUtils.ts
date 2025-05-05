
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

// Format CPF (000.000.000-00) or CNPJ (00.000.000/0001-00)
export const formatCPFCNPJ = (value: string): string => {
  if (!value) return '';
  
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 11) {
    // CPF formatting: 000.000.000-00
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // CNPJ formatting: 00.000.000/0001-00
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
};

