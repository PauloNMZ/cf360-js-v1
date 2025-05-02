
/**
 * Account validation utility functions for CNAB files
 */

import { retirarCHR } from '../formatting/stringUtils';
import { calcularDV } from './digitVerificationUtils';

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

