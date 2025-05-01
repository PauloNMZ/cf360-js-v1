
import { supabase } from "@/integrations/supabase/client";
import type { ConvenenteData } from "@/types/convenente";

// Função para converter de camelCase para snake_case
const mapToSnakeCase = (convenente: ConvenenteData): any => {
  return {
    cnpj: convenente.cnpj,
    razao_social: convenente.razaoSocial,
    endereco: convenente.endereco,
    numero: convenente.numero,
    complemento: convenente.complemento,
    uf: convenente.uf,
    cidade: convenente.cidade,
    contato: convenente.contato,
    fone: convenente.fone,
    celular: convenente.celular,
    email: convenente.email,
    agencia: convenente.agencia,
    conta: convenente.conta,
    chave_pix: convenente.chavePix,
    convenio_pag: convenente.convenioPag
  };
};

// Função para converter de snake_case para camelCase
const mapToCamelCase = (data: any): ConvenenteData & { id: string } => {
  return {
    id: data.id,
    cnpj: data.cnpj,
    razaoSocial: data.razao_social,
    endereco: data.endereco || "",
    numero: data.numero || "",
    complemento: data.complemento || "",
    uf: data.uf || "",
    cidade: data.cidade || "",
    contato: data.contato || "",
    fone: data.fone || "",
    celular: data.celular || "",
    email: data.email || "",
    agencia: data.agencia || "",
    conta: data.conta || "",
    chavePix: data.chave_pix || "",
    convenioPag: data.convenio_pag || "",
    dataCriacao: data.data_criacao,
    dataAtualizacao: data.data_atualizacao
  };
};

// Salvar um novo convenente
export const saveConvenente = async (convenente: ConvenenteData): Promise<ConvenenteData & { id: string }> => {
  // Obter o usuário atual
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  // Adicionar metadata e ID
  const convenenteToSave = {
    ...mapToSnakeCase(convenente),
    user_id: user.id,
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString()
  };

  // Inserir no Supabase
  const { data, error } = await supabase
    .from('convenentes')
    .insert([convenenteToSave])
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar convenente:", error);
    throw new Error(error.message || "Erro ao salvar convenente");
  }

  return mapToCamelCase(data);
};

// Obter todos os convenentes do usuário atual
export const getConvenentes = async (): Promise<Array<ConvenenteData & { id: string }>> => {
  // Obter o usuário atual
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('convenentes')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error("Erro ao buscar convenentes:", error);
    throw new Error(error.message || "Erro ao buscar convenentes");
  }

  return (data || []).map(item => mapToCamelCase(item));
};

// Obter um convenente pelo ID
export const getConvenenteById = async (id: string): Promise<(ConvenenteData & { id: string }) | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('convenentes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Registro não encontrado
      return null;
    }
    console.error("Erro ao buscar convenente:", error);
    throw new Error(error.message || "Erro ao buscar convenente");
  }

  return mapToCamelCase(data);
};

// Atualizar um convenente existente
export const updateConvenente = async (id: string, updates: Partial<ConvenenteData>): Promise<(ConvenenteData & { id: string }) | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  // Preparar dados para atualização
  const updateData = {
    ...mapToSnakeCase(updates as ConvenenteData),
    data_atualizacao: new Date().toISOString()
  };

  // Atualizar no Supabase
  const { data, error } = await supabase
    .from('convenentes')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar convenente:", error);
    throw new Error(error.message || "Erro ao atualizar convenente");
  }

  return mapToCamelCase(data);
};

// Excluir um convenente
export const deleteConvenente = async (id: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const { error } = await supabase
    .from('convenentes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  
  if (error) {
    console.error("Erro ao excluir convenente:", error);
    throw new Error(error.message || "Erro ao excluir convenente");
  }
  
  return true;
};
