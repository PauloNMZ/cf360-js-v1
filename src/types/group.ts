
export interface Group {
  id: string;
  nome: string;
  tipo_servico_id?: string | null;
  descricao?: string | null;
  user_id: string;
  data_pagamento?: string | null;
  criado_em?: string;
  atualizado_em?: string;
}

export interface NewGroup {
  nome: string;
  tipo_servico_id?: string | null;
  descricao?: string | null;
  data_pagamento?: string | null;
  user_id: string;
}

export interface GroupMember {
  id: string;
  grupo_id: string;
  favorecido_id: string;
  valor?: number | null;
  criado_em?: string;
  favorecido?: {
    id: string;
    nome: string;
  };
}

export interface NewGroupMember {
  grupo_id: string;
  favorecido_id: string;
  valor?: number | null;
}
