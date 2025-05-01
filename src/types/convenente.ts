
export interface ConvenenteData {
  id?: string;
  cnpj: string;
  razaoSocial: string;
  endereco: string;
  numero: string;
  complemento: string;
  uf: string;
  cidade: string;
  contato: string;
  fone: string;
  celular: string;
  email: string;
  agencia: string;
  conta: string;
  chavePix: string;
  convenioPag: string;
  dataCriacao?: Date | string; // Allow both Date and string types
  dataAtualizacao?: Date | string; // Allow both Date and string types
}

export const emptyConvenente: ConvenenteData = {
  cnpj: "",
  razaoSocial: "",
  endereco: "",
  numero: "",
  complemento: "",
  uf: "",
  cidade: "",
  contato: "",
  fone: "",
  celular: "",
  email: "",
  agencia: "",
  conta: "",
  chavePix: "",
  convenioPag: ""
};
