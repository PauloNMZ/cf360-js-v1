import { supabase } from "@/integrations/supabase/client";
import type { ConvenenteData } from "@/types/convenente";
import { mapToCamelCase, mapToSnakeCase } from "./convenenteTransformers";

export const searchConvenentesByTerm = async (searchTerm: string): Promise<Array<ConvenenteData & { id: string }>> => {
  try {
    if (!searchTerm || searchTerm.length < 2) {
      // If query is too short, return all convenentes
      const { data, error } = await supabase
        .from('convenentes')
        .select('id, razao_social, cnpj')
        .order('razao_social', { ascending: true });
        
      if (error) throw new Error(error.message || "Erro ao buscar convenentes");
      
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
    }
    
    // Call the Supabase RPC function directly
    const { data, error } = await supabase.rpc('buscar_convenentes', { criterio: searchTerm });
    
    if (error) throw new Error(error.message || "Erro ao buscar convenentes");
    
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
    throw error;
  }
};

export const getConvenentes = async (): Promise<Array<ConvenenteData & { id: string }>> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('convenentes')
    .select('*')
    .eq('user_id', user.id);
  if (error) throw new Error(error.message || "Erro ao buscar convenentes");
  return (data || []).map(item => mapToCamelCase(item));
};

export const getConvenenteById = async (id: string): Promise<(ConvenenteData & { id: string }) | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('convenentes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message || "Erro ao buscar convenente");
  }
  if (!data) return null;
  return mapToCamelCase(data);
};

export const saveConvenente = async (convenente: ConvenenteData): Promise<ConvenenteData & { id: string }> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");
  const convenenteToSave = {
    ...mapToSnakeCase(convenente),
    user_id: user.id,
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('convenentes')
    .insert([convenenteToSave])
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar convenente:", error);
    throw new Error(error.message || error.details || "Erro ao salvar convenente");
  }
  return mapToCamelCase(data);
};

export const updateConvenente = async (id: string, updates: Partial<ConvenenteData>): Promise<(ConvenenteData & { id: string }) | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");
  const updateData = {
    ...mapToSnakeCase(updates as ConvenenteData),
    data_atualizacao: new Date().toISOString()
  };
  const { data, error } = await supabase
    .from('convenentes')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao atualizar convenente");
  }
  return mapToCamelCase(data);
};

export const deleteConvenente = async (id: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");
  const { error } = await supabase
    .from('convenentes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message || "Erro ao excluir convenente");
  }
  return true;
};
