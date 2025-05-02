
/**
 * Currency formatting utility functions for CNAB files
 */

// Format a financial value for CNAB (15 positions, 2 decimal places)
export const formatarValorCNABPreciso = (valor: number): string => {
  // Convert to string, ensuring two decimal places
  const valorStr = valor.toFixed(2);
  
  // Remove decimal point
  return valorStr.replace(/\D/g, '');
};

// Format currency for display
export const formatarValorCurrency = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
};

