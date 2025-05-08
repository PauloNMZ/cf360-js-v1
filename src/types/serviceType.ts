
export interface ServiceType {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string | null;
  user_id: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface NewServiceType {
  codigo: string;
  nome: string;
  descricao?: string | null;
}
