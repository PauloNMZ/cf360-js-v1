
import { supabase, searchConvenentes } from "@/integrations/supabase/client";
import type { ConvenenteData } from "@/types/convenente";
import { mapToCamelCase, mapToSnakeCase } from "./convenenteTransformers";

// Function to search convenentes by term (using the Supabase RPC function)
export const searchConvenentesByTerm = async (searchTerm: string): Promise<Array<ConvenenteData & { id: string }>> => {
  try {
    const { data, error } = await searchConvenentes(searchTerm);
    
    if (error) {
      console.error("Erro na busca de convenentes:", error);
      throw new Error(error.message || "Erro ao buscar convenentes");
    }
    
    // Map the results from the database format to our app's format
    return (data || []).map(item => ({
      id: item.id,
      razaoSocial: item.razao_social,
      cnpj: item.cnpj,
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
    }));
  } catch (error) {
    console.error("Erro ao executar busca:", error);
    throw error;
  }
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
