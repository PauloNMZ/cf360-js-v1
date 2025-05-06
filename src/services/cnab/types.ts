
/**
 * Type definitions for CNAB file processing
 */

// Interface for payment data structure
export interface PagamentoData {
  tipoRegistro: string;
  segmento: string;
  tipoMovimento: string;
  codMovimento: string;
  camara: string;
  bancoFavorecido: string;
  agenciaFavorecido: string;
  digitoAgencia: string;
  contaFavorecido: string;
  digitoConta: string;
  nomeFavorecido: string;
  numeroDocumento: string;
  dataPagamento: string;
  moeda: string;
  valorPagamento: number;
  nossoNumero: string;
  dataEfetiva: string;
  valorEfetivo: number;
  inscricaoFavorecido?: {
    tipo: string;
    numero: string;
  };
  enderecoFavorecido?: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    cep: string;
    estado: string;
  };
}

// Interface for parsed CNAB data
export interface ParsedCNABData {
  headerArquivo: string;
  lotes: Array<{
    header?: string;
    trailer?: string;
    segmentos: string[];
  }>;
  trailerArquivo: string;
  banco: string;
  tipoArquivo: string;
}

// Interface for JSON output
export interface CNABJsonOutput {
  header: {
    banco: string;
    tipoArquivo: string;
    dataGeracao: string;
    horaGeracao: string;
    sequencialArquivo: string;
  };
  pagamentos: PagamentoData[];
  totalPagamentos: number;
  valorTotal: number;
}

// Interface for API response
export interface APIResponse {
  success: boolean;
  message: string;
  transactionId: string;
  timestamp: string;
}
