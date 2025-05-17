
// Serviço de CRUD para empresas usando Supabase

import { supabase } from "@/integrations/supabase/client";
import { EmpresaData } from "@/types/empresa";

// Função utilitária para obter o usuário logado
const getUserId = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id || null;
};

export const createEmpresa = async (empresaData: Omit<EmpresaData, "id">) => {
  const userId = await getUserId();
  if (!userId) throw new Error("Usuário não autenticado!");

  const { data, error } = await supabase
    .from("empresa")
    .insert([{ ...empresaData, user_id: userId }])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const fetchEmpresas = async () => {
  const { data, error } = await supabase
    .from("empresa")
    .select("*")
    .order("razao_social", { ascending: true });

  if (error) throw error;
  return data;
};

export const updateEmpresa = async (id: string, empresaData: Partial<EmpresaData>) => {
  const { data, error } = await supabase
    .from("empresa")
    .update({ ...empresaData })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteEmpresa = async (id: string) => {
  const { error } = await supabase
    .from("empresa")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
