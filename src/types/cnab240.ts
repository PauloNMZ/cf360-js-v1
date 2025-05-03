
// Constants for CNAB240 generation
export const COD_BB: string = "001";
export const NOME_BB: string = "BANCO DO BRASIL";
export const LAYOUT_VERSAO: string = "083";
export const TIPO_SERVICO_PAGAMENTO: string = "98";
export const TIPO_OPERACAO: string = "C";
export const MOEDA_BRL: string = "BRL";

// Interface for company configuration
export interface EmpresaConfig {
  nomeEmpresa: string;
  cnpj: string;
  endereco: string;
  agencia: string;
  dvAgencia: string;
  conta: string;
  dvConta: string;
  nrConvenio: string;
  codProduto: string;
  nrRemessa: string;
  dataPagamento: string;
  nrDocumento: string;
}

// Interface for payment recipients
export interface Favorecido {
  nome: string;
  inscricao: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo: string;
  valor: number;
  isValid?: boolean;
  id?: number; // Added id property which is optional
}

// Interface for validation errors
export interface ErrorRecord {
  id: number;
  favorecido: Favorecido;
  errors: FavorecidoError[];
}

// Interface for specific errors in a payment record
export interface FavorecidoError {
  field: string;
  message: string;
  expectedValue?: string;
  actualValue?: string;
}

// Interface for CNAB workflow data
export interface CNABWorkflowData {
  paymentDate?: Date;
  serviceType: string;
  convenente: any;
  sendMethod: string;
  outputDirectory?: string;
}
