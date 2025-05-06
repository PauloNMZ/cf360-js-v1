
/**
 * CNPJ formatting utility
 */

/**
 * Formats a string as a CNPJ (xx.xxx.xxx/xxxx-xx)
 * Handles partial input gracefully for progressive formatting
 */
export const formatCNPJ = (value: string): string => {
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

/**
 * Formats a phone number with appropriate separators based on length
 * Used internally to avoid circular dependencies
 */
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
