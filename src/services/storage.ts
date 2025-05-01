
// Tipos para os dados armazenados
export type ConvenenteData = {
  id: string;
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
  dataCriacao: string;
  dataAtualizacao: string;
};

const STORAGE_KEY = 'gerador-pagamentos-convenentes';

// Salva um convenente no localStorage
export const saveConvenente = (data: Omit<ConvenenteData, 'id' | 'dataCriacao' | 'dataAtualizacao'>): ConvenenteData => {
  const convenentes = getConvenentes();
  
  // Gera um ID único
  const newId = crypto.randomUUID();
  const now = new Date().toISOString();
  
  const newConvenente: ConvenenteData = {
    ...data,
    id: newId,
    dataCriacao: now,
    dataAtualizacao: now
  };
  
  convenentes.push(newConvenente);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convenentes));
  
  return newConvenente;
};

// Atualiza um convenente existente
export const updateConvenente = (id: string, data: Partial<ConvenenteData>): ConvenenteData | null => {
  const convenentes = getConvenentes();
  const index = convenentes.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  const updatedConvenente = {
    ...convenentes[index],
    ...data,
    dataAtualizacao: new Date().toISOString()
  };
  
  convenentes[index] = updatedConvenente;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convenentes));
  
  return updatedConvenente;
};

// Busca todos os convenentes
export const getConvenentes = (): ConvenenteData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar convenentes do localStorage:', error);
    return [];
  }
};

// Busca um convenente pelo ID
export const getConvenenteById = (id: string): ConvenenteData | undefined => {
  const convenentes = getConvenentes();
  return convenentes.find(c => c.id === id);
};

// Busca um convenente pelo CNPJ
export const getConvenenteByCNPJ = (cnpj: string): ConvenenteData | undefined => {
  const convenentes = getConvenentes();
  return convenentes.find(c => c.cnpj.replace(/\D/g, '') === cnpj.replace(/\D/g, ''));
};

// Remove um convenente
export const deleteConvenente = (id: string): boolean => {
  const convenentes = getConvenentes();
  const filteredConvenentes = convenentes.filter(c => c.id !== id);
  
  if (filteredConvenentes.length === convenentes.length) {
    return false; // Nada foi removido
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredConvenentes));
  return true;
};
