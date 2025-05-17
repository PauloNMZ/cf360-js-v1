
import { supabase } from "@/integrations/supabase/client";
import { EmpresaData } from "@/types/empresa";

// Util: camelCase => snake_case para Supabase
const toDb = (empresa: Partial<EmpresaData>) => ({
  cnpj: empresa.cnpj,
  razao_social: empresa.razaoSocial,
  endereco: empresa.endereco,
  numero: empresa.numero,
  complemento: empresa.complemento,
  uf: empresa.uf,
  cidade: empresa.cidade,
  contato: empresa.contato,
  fone: empresa.fone,
  celular: empresa.celular,
  email: empresa.email,
  agencia: empresa.agencia,
  conta: empresa.conta,
  chave_pix: empresa.chavePix,
  convenio_pag: empresa.convenioPag,
  data_criacao: empresa.dataCriacao,
  data_atualizacao: empresa.dataAtualizacao,
});

const fromDb = (data: any): EmpresaData => ({
  id: data.id,
  cnpj: data.cnpj ?? "",
  razaoSocial: data.razao_social ?? "",
  endereco: data.endereco ?? "",
  numero: data.numero ?? "",
  complemento: data.complemento ?? "",
  uf: data.uf ?? "",
  cidade: data.cidade ?? "",
  contato: data.contato ?? "",
  fone: data.fone ?? "",
  celular: data.celular ?? "",
  email: data.email ?? "",
  agencia: data.agencia ?? "",
  conta: data.conta ?? "",
  chavePix: data.chave_pix ?? "",
  convenioPag: data.convenio_pag ?? "",
  dataCriacao: data.data_criacao,
  dataAtualizacao: data.data_atualizacao,
});

const getUserId = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id || null;
};

export const createEmpresa = async (empresaData: Omit<EmpresaData, "id">) => {
  const userId = await getUserId();
  if (!userId) throw new Error("Usuário não autenticado!");

  const insertObj = { ...toDb(empresaData), user_id: userId };
  const { data, error } = await supabase
    .from("convenentes")
    .insert([insertObj])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data ? fromDb(data) : null;
};

export const fetchEmpresas = async () => {
  const { data, error } = await supabase
    .from("convenentes")
    .select("*")
    .order("razao_social", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(fromDb);
};

export const updateEmpresa = async (id: string, empresaData: Partial<EmpresaData>) => {
  const { data, error } = await supabase
    .from("convenentes")
    .update(toDb(empresaData))
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data ? fromDb(data) : null;
};

export const deleteEmpresa = async (id: string) => {
  const { error } = await supabase
    .from("convenentes")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
