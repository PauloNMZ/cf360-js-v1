
/**
 * Utility functions for CNAB240 file generation
 */

// Remove special characters from a string
export const retirarCHR = (texto: string): string => {
  if (!texto) return '';
  return texto.replace(/[^\d]/g, '');
};

// Format a date to the specified format
export const formatarData = (data: Date | string, formato: string): string => {
  if (!data) return '';
  
  const date = data instanceof Date ? data : new Date(data);
  
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  const anoShort = ano.toString().substr(2, 2);
  
  switch(formato) {
    case "DDMMYYYY":
      return `${dia}${mes}${ano}`;
    case "YYYYMMDD":
      return `${ano}${mes}${dia}`;
    case "DD/MM/YYYY":
      return `${dia}/${mes}/${ano}`;
    case "DDMMYY":
      return `${dia}${mes}${anoShort}`;
    default:
      return `${dia}${mes}${ano}`;
  }
};

// Format time to HH:MM:SS
export const formatarHora = (data: Date | string, formato: string): string => {
  const date = data instanceof Date ? data : new Date(data);
  
  const hora = String(date.getHours()).padStart(2, '0');
  const minuto = String(date.getMinutes()).padStart(2, '0');
  const segundo = String(date.getSeconds()).padStart(2, '0');
  
  switch(formato) {
    case "HHMMSS":
      return `${hora}${minuto}${segundo}`;
    case "HH:MM:SS":
      return `${hora}:${minuto}:${segundo}`;
    default:
      return `${hora}${minuto}${segundo}`;
  }
};

// Adjust string size and padding
export const ajustarTamanho = (
  texto: string | number,
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

// Format a financial value for CNAB (15 positions, 2 decimal places)
export const formatarValorCNABPreciso = (valor: number): string => {
  // Convert to string, ensuring two decimal places
  const valorStr = valor.toFixed(2);
  
  // Remove decimal point
  return valorStr.replace(/\D/g, '');
};

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

// Remove accents from a string
export const removerAcentos = (texto: string): string => {
  if (!texto) return '';
  
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Remove accents and ensure uppercase
export const semAcento = (texto: string): string => {
  return removerAcentos(texto);
};

// Validate CNPJ
export const validarCNPJ = (cnpj: string): boolean => {
  // Basic validation - remove non-digits and check length
  cnpj = cnpj.replace(/\D/g, '');
  
  if (cnpj.length !== 14) {
    return false;
  }
  
  // For simplicity just check length, but a real implementation would validate the check digits
  return true;
};
