import { supabase } from "@/integrations/supabase/client";
import { EmpresaData } from "@/types/empresa";

// Helper to ensure value is ISO string (for Supabase)
const toIsoString = (value: string | Date | undefined): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.toISOString();
};

// Util: camelCase => snake_case para Supabase
const toDb = (empresa: Partial<EmpresaData>, userId?: string) => ({
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
  data_criacao: toIsoString(empresa.dataCriacao),
  data_atualizacao: toIsoString(empresa.dataAtualizacao),
  user_id: userId, // importante garantir que user_id é incluído
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

  const payload = toDb(empresaData, userId);

  // Log para debug do payload enviado
  console.log("Payload enviado para insert convenentes:", payload);

  const { data, error } = await supabase
    .from("convenentes")
    .insert([payload])
    .select()
    .maybeSingle();

  if (error) {
    console.error("Erro Supabase ao inserir empresa:", error);
    throw error;
  }
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
