
/**
 * Utility functions for CNAB240 file generation
 */

// Remove special characters from a string
export const retirarCHR = (texto: string): string => {
  if (!texto) return '';
  return texto.replace(/[^\d]/g, '');
};

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
  return removerAcentos(texto.toUpperCase());
};

// Format CPF or CNPJ
export const formatarCpfCnpj = (valor: string | number, formatado: boolean = true): string => {
  // Remove any non-numeric character
  const valorLimpo = String(valor).replace(/\D/g, '');
  
  if (!formatado) {
    // Return only numbers with leading zeros
    return valorLimpo.length > 11 
      ? valorLimpo.padStart(14, '0') 
      : valorLimpo.padStart(11, '0');
  }
  
  // Fill with zeros to the left until reaching the correct size
  if (valorLimpo.length <= 11) {  // CPF
    const valorPreenchido = valorLimpo.padStart(11, '0');
    return `${valorPreenchido.slice(0, 3)}.${valorPreenchido.slice(3, 6)}.${valorPreenchido.slice(6, 9)}-${valorPreenchido.slice(9)}`;
  } else {  // CNPJ
    const valorPreenchido = valorLimpo.padStart(14, '0');
    return `${valorPreenchido.slice(0, 2)}.${valorPreenchido.slice(2, 5)}.${valorPreenchido.slice(5, 8)}/${valorPreenchido.slice(8, 12)}-${valorPreenchido.slice(12)}`;
  }
};

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

// Calculate verification digit
export const calcularDV = (strNumero: string): string => {
  // Remove white spaces from the number
  const strNum = strNumero.trim();
  
  // Return null string if null string was passed or contains non-digits
  if (strNum.length === 0 || !/^\d+$/.test(strNum)) {
    return "";
  }
  
  // String for calculation
  let strCalc = "23456789";
  
  // Increase calculation string size
  while (strNum.length > strCalc.length) {
    strCalc += strCalc;
  }
  
  // Make calculation string the same size as number
  strCalc = strCalc.slice(-strNum.length);
  
  // Multiply calculation string with number and accumulate
  let intAcum = 0;
  for (let intC = 0; intC < strNum.length; intC++) {
    intAcum += parseInt(strNum[intC]) * parseInt(strCalc[intC]);
  }
  
  // Find remainder of division by 11 which is the DV
  const intResto = intAcum % 11;
  
  // Return verification digit
  return intResto !== 10 ? intResto.toString() : "X";
};

// Format bank branch with hyphen
export const formatarAgencia = (agencia: string): string => {
  const ultimoDigito = agencia.slice(-1);
  const ageSemDigito = agencia.slice(0, -1);
  return `${ageSemDigito}-${ultimoDigito}`;
};

// Format account number with dots and hyphen
export const formatarConta = (conta: string): string => {
  const ultimoDigito = conta.slice(-1);
  const nrSemDigito = conta.slice(0, -1);
  
  // Format with dots every 3 digits
  const nrFormatado = parseInt(nrSemDigito).toLocaleString('pt-BR').replace(/\./g, '.');
  
  return `${nrFormatado}-${ultimoDigito}`;
};

// Validate account (extracts account without digit, and validates the digit)
export const validarConta = (contaCompleta: string): { valido: boolean; contaSemDigito: string; digitoEsperado: string; digitoInformado: string } => {
  const contaLimpa = retirarCHR(contaCompleta);
  
  if (!contaLimpa || contaLimpa.length < 2) {
    return { valido: false, contaSemDigito: '', digitoEsperado: '', digitoInformado: '' };
  }
  
  // Extract the last character as the verification digit
  const digitoInformado = contaLimpa.slice(-1);
  const contaSemDigito = contaLimpa.slice(0, -1);
  
  // Calculate the expected verification digit
  const digitoEsperado = calcularDV(contaSemDigito);
  
  // Check if the verification digit matches
  const valido = digitoEsperado === digitoInformado;
  
  return { valido, contaSemDigito, digitoEsperado, digitoInformado };
};

// Validate branch (extracts branch without digit, and validates the digit)
export const validarAgencia = (agenciaCompleta: string): { valido: boolean; agenciaSemDigito: string; digitoEsperado: string; digitoInformado: string } => {
  const agenciaLimpa = retirarCHR(agenciaCompleta);
  
  if (!agenciaLimpa || agenciaLimpa.length < 2) {
    return { valido: false, agenciaSemDigito: '', digitoEsperado: '', digitoInformado: '' };
  }
  
  // Extract the last character as the verification digit
  const digitoInformado = agenciaLimpa.slice(-1);
  const agenciaSemDigito = agenciaLimpa.slice(0, -1);
  
  // Calculate the expected verification digit
  const digitoEsperado = calcularDV(agenciaSemDigito);
  
  // Check if the verification digit matches
  const valido = digitoEsperado === digitoInformado;
  
  return { valido, agenciaSemDigito, digitoEsperado, digitoInformado };
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
