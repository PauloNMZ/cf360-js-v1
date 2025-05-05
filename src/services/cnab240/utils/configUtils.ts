
import { EmpresaConfig } from '@/types/cnab240';
import { strZero } from '@/utils/cnabUtils';

// Initialize variables with configuration data
export const inicializarVariaveis = (config: any): EmpresaConfig => {
  // Format date string
  const dateParts = config.dataPagamento instanceof Date ?
    [
      config.dataPagamento.getDate().toString().padStart(2, '0'),
      (config.dataPagamento.getMonth() + 1).toString().padStart(2, '0'),
      config.dataPagamento.getFullYear()
    ] :
    (config.dataPagamento || '').split('/');

  const formattedDateStr = dateParts.length === 3 ? `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}` : '';

  // Extract parts from convenente data
  const agenciaParts = (config.agencia || '').trim().split('-');
  const contaParts = (config.conta || '').trim().split('-');

  // Create basic configuration
  const empresaConfig: EmpresaConfig = {
    nomeEmpresa: (config.nomeEmpresa || '').trim(),
    cnpj: (config.cnpj || '').replace(/[^0-9]/g, ''),
    endereco: (config.endereco || '').trim(),
    agencia: agenciaParts[0] || '',
    dvAgencia: agenciaParts[1] || '',
    conta: contaParts[0] || '',
    dvConta: contaParts[1] || '',
    nrConvenio: (config.convenioPag || '').trim(),
    codProduto: "0126", // Fixed value for Banco do Brasil
    nrRemessa: strZero((Math.floor(Math.random() * 999999) + 1).toString(), 6),
    dataPagamento: formattedDateStr,
    nrDocumento: strZero((Math.floor(Math.random() * 999999999) + 1).toString(), 9),
    serviceType: config.serviceType || 'Pagamentos Diversos' // Add serviceType to config
  };

  return empresaConfig;
};

// Format company data
export const formatarDadosEmpresa = (config: EmpresaConfig): EmpresaConfig => {
  // Return a new object with formatted data
  return {
    ...config,
    cnpj: config.cnpj.replace(/[^0-9]/g, ''), // Remove non-numeric characters from CNPJ
    nomeEmpresa: (config.nomeEmpresa || '').toUpperCase(),
    endereco: (config.endereco || '').toUpperCase(),
    agencia: config.agencia.padStart(4, '0'), // Ensure agency has 4 digits
    conta: config.conta.padStart(8, '0'), // Ensure account has 8 digits
    nrConvenio: (config.nrConvenio || '').padStart(9, '0') // Ensure agreement number has 9 digits
  };
};
