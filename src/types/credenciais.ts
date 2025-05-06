
export interface ConvenenteCredentials {
  id?: string;
  convenente_id: string;
  appKey?: string;
  clientId?: string;
  clientSecret?: string;
  registrarToken?: string;
  basic?: string;
  userBBsia?: string;
  passwordBBsia?: string;
  criado_em?: Date | string;
  atualizado_em?: Date | string;
}

export const emptyCredentials: ConvenenteCredentials = {
  convenente_id: '',
  appKey: '',
  clientId: '',
  clientSecret: '',
  registrarToken: '',
  basic: '',
  userBBsia: '',
  passwordBBsia: ''
};
