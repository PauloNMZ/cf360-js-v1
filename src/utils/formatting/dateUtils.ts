
/**
 * Date formatting utility functions for CNAB files
 */

// Format a date to the specified format
export const formatarData = (data: Date | string | undefined, formato: string): string => {
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

