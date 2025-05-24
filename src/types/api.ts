
export interface APICredentials {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  appKey: string;
  productionUrl: string;
  sandboxUrl: string;
  authRules: 'certificado' | 'OAuth';
  companyId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewAPICredentials {
  name: string;
  clientId: string;
  clientSecret: string;
  appKey: string;
  productionUrl: string;
  sandboxUrl: string;
  authRules: 'certificado' | 'OAuth';
  companyId?: string;
}

export interface CredentialRotationData {
  clientId?: string;
  clientSecret?: string;
  appKey?: string;
}

export interface CompanyAPIAssignment {
  id: string;
  companyId: string;
  apiId: string;
  isActive: boolean;
  createdAt: Date;
}

export interface APICredentialHistory {
  id: string;
  apiId: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: Date;
}
