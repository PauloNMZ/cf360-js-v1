
export type PixKeyType = "CPF" | "CNPJ" | "EMAIL" | "TELEFONE" | "ALEATORIA";

export interface FavorecidoData {
  id?: string;
  nome: string;
  inscricao: string;
  tipoInscricao: "CPF" | "CNPJ";
  banco: string;
  agencia: string;
  conta: string;
  chavePix: string;
  tipoChavePix: PixKeyType;
  valorPadrao: number;
  grupoId?: string;
  dataCriacao?: Date | string;
  dataAtualizacao?: Date | string;
}

export const emptyFavorecido: FavorecidoData = {
  nome: "",
  inscricao: "",
  tipoInscricao: "CPF",
  banco: "",
  agencia: "",
  conta: "",
  chavePix: "",
  tipoChavePix: "CPF",
  valorPadrao: 0
};
