
import { Favorecido, EmpresaConfig } from '@/types/cnab240';
import { filtrarFavorecidosPorTipo, processarLote, TIPO_LANCAMENTO } from './batchProcessor';

export class LoteProcessor {
  private totalLinhasArquivo: number;
  private seqLote: number;
  private somaValoresBBcc: number;
  private somaValoresBBpoup: number;
  private somaValoresDemais: number;
  private config: EmpresaConfig;
  private favorecidos: Favorecido[];
  private conteudoArquivo: string[];

  constructor(
    config: EmpresaConfig,
    favorecidos: Favorecido[],
    conteudoArquivo: string[],
    totalLinhasArquivo: number
  ) {
    this.config = config;
    this.favorecidos = favorecidos;
    this.conteudoArquivo = conteudoArquivo;
    this.totalLinhasArquivo = totalLinhasArquivo;
    this.seqLote = 0;
    this.somaValoresBBcc = 0;
    this.somaValoresBBpoup = 0;
    this.somaValoresDemais = 0;
  }

  public processarFavorecidosPorTipo(tipoLancamento: string, descricaoTipo: string): void {
    try {
      // Filter recipients by type
      const favorecidosFiltrados = filtrarFavorecidosPorTipo(this.favorecidos, tipoLancamento);

      // Check if there are recipients of this type
      if (favorecidosFiltrados.length === 0) {
        console.log(`Nenhum favorecido do tipo ${descricaoTipo} encontrado.`);
        return;
      }

      // Increment batch sequence
      this.seqLote++;

      // Process batch
      const resultado = processarLote(this.config, favorecidosFiltrados, tipoLancamento, this.seqLote);
      
      // Add batch lines to file content
      this.conteudoArquivo.push(...resultado.linhas);
      
      // Update line count
      this.totalLinhasArquivo += resultado.linhas.length;

      // Update sum of values according to type
      switch (tipoLancamento) {
        case TIPO_LANCAMENTO.BB_CONTA_CORRENTE: this.somaValoresBBcc = resultado.somaValores; break;
        case TIPO_LANCAMENTO.BB_POUPANCA: this.somaValoresBBpoup = resultado.somaValores; break;
        case TIPO_LANCAMENTO.OUTROS_BANCOS: this.somaValoresDemais = resultado.somaValores; break;
      }
    } catch (error) {
      console.error(`Erro ao processar favorecidos do tipo ${descricaoTipo}:`, error);
    }
  }

  public processarTodosOsTipos(): void {
    // Process recipients by type using the constants
    this.processarFavorecidosPorTipo(TIPO_LANCAMENTO.BB_CONTA_CORRENTE, "BB Conta Corrente");
    this.processarFavorecidosPorTipo(TIPO_LANCAMENTO.BB_POUPANCA, "BB Poupança");
    this.processarFavorecidosPorTipo(TIPO_LANCAMENTO.OUTROS_BANCOS, "Outros Bancos");
  }

  public getSeqLote(): number {
    return this.seqLote;
  }

  public getTotalLinhasArquivo(): number {
    return this.totalLinhasArquivo;
  }
}
