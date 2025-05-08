
import { CNABWorkflowData, Favorecido } from '@/types/cnab240';

export interface IGeradorCNAB {
  inicializarVariaveis(config: any): void;
  gerarArquivoRemessa(workflowData: CNABWorkflowData, favorecidos: Favorecido[]): Promise<Blob>;
  getNomeArquivo(): string;
  getConteudoArquivo(): string[];
}
