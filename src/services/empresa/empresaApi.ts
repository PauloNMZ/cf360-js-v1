
import { supabase, searchEmpresas } from "@/integrations/supabase/client";
import type { EmpresaData } from "@/types/empresa";
import { mapToCamelCase, mapToSnakeCase } from "./empresaTransformers";

export const searchEmpresasByTerm = async (searchTerm: string): Promise<Array<EmpresaData & { id: string }>> => {
  const { data, error } = await searchEmpresas(searchTerm);
  if (error) throw new Error(error.message || "Erro ao buscar empresas");
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
};

export const getEmpresas = async (): Promise<Array<EmpresaData & { id: string }>> => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('empresa')
    .select('*')
    .eq('user_id', user.id);
  if (error) throw new Error(error.message || "Erro ao buscar empresas");
  return (data || []).map(item => mapToCamelCase(item));
};

export const getEmpresaById = async (id: string): Promise<(EmpresaData & { id: string }) | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('empresa')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message || "Erro ao buscar empresa");
  }
  if (!data) return null;
  return mapToCamelCase(data);
};

export const saveEmpresa = async (empresa: EmpresaData): Promise<EmpresaData & { id: string }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");
  const empresaToSave = {
    ...mapToSnakeCase(empresa),
    user_id: user.id,
    data_criacao: new Date().toISOString(),
    data_atualizacao: new Date().toISOString()
  };
  const { data, error } = await supabase
    .from('empresa')
    .insert([empresaToSave])
    .select()
    .single();
  if (error) throw new Error(error.message || "Erro ao salvar empresa");
  return mapToCamelCase(data);
};

export const updateEmpresa = async (id: string, updates: Partial<EmpresaData>): Promise<(EmpresaData & { id: string }) | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");
  const updateData = {
    ...mapToSnakeCase(updates as EmpresaData),
    data_atualizacao: new Date().toISOString()
  };
  const { data, error } = await supabase
    .from('empresa')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();
  if (error) throw new Error(error.message || "Erro ao atualizar empresa");
  return mapToCamelCase(data);
};

export const deleteEmpresa = async (id: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");
  const { error } = await supabase
    .from('empresa')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message || "Erro ao excluir empresa");
  return true;
};
