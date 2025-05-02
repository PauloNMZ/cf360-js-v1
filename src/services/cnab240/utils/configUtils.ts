
import { EmpresaConfig } from '@/types/cnab240';
import { retirarCHR, formatarData, formatarEnderecoCompleto, semAcento, calcularDV } from '@/utils/cnabUtils';

/**
 * Initializes configuration variables for CNAB240 generation
 */
export const inicializarVariaveis = (config: any): EmpresaConfig => {
  const empresaConfig: EmpresaConfig = {
    nomeEmpresa: config.nomeEmpresa || '',
    cnpj: retirarCHR(config.cnpj || ''),
    endereco: config.endereco || '',
    agencia: '',
    dvAgencia: '',
    conta: '',
    dvConta: '',
    nrConvenio: config.convenioPag || '',
    codProduto: "0126", // Fixed product code for BB
    nrRemessa: "1", // Could be incremented based on stored value
    dataPagamento: '',
    nrDocumento: "1" // Could be incremented based on stored value
  };
  
  // Process agency: Separate the agency number and its check digit
  const agenciaCompleta = retirarCHR(config.agencia || '');
  if (agenciaCompleta.length > 0) {
    if (agenciaCompleta.length > 1) {
      // Extract the last character as check digit
      empresaConfig.dvAgencia = agenciaCompleta.slice(-1);
      empresaConfig.agencia = agenciaCompleta.slice(0, -1);
    } else {
      empresaConfig.agencia = agenciaCompleta;
      empresaConfig.dvAgencia = calcularDV(agenciaCompleta);
    }
  }
  
  // Process account: Separate the account number and its check digit
  const contaCompleta = retirarCHR(config.conta || '');
  if (contaCompleta.length > 0) {
    if (contaCompleta.length > 1) {
      // Extract the last character as check digit
      empresaConfig.dvConta = contaCompleta.slice(-1);
      empresaConfig.conta = contaCompleta.slice(0, -1);
    } else {
      empresaConfig.conta = contaCompleta;
      empresaConfig.dvConta = calcularDV(contaCompleta);
    }
  }
  
  // Format payment date if provided
  if (config.dataPagamento && config.dataPagamento instanceof Date) {
    empresaConfig.dataPagamento = formatarData(config.dataPagamento, "DDMMYYYY");
  } else {
    empresaConfig.dataPagamento = formatarData(new Date(), "DDMMYYYY");
  }
  
  return empresaConfig;
};

/**
 * Format and validate company information
 */
export const formatarDadosEmpresa = (config: EmpresaConfig): EmpresaConfig => {
  const configFormatada = { ...config };
  
  // Format company name and address (if provided)
  if (configFormatada.nomeEmpresa) {
    configFormatada.nomeEmpresa = semAcento(configFormatada.nomeEmpresa.toUpperCase().trim());
  }
  
  return configFormatada;
};
