
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

