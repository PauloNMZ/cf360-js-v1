
import { supabase } from "@/integrations/supabase/client";
import { EmpresaData } from "@/types/empresa";

// Helper para garantir sempre string ISO para datas
const toIsoString = (value: string | Date | undefined): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.toISOString();
};

// camelCase => snake_case para Supabase
const toDb = (empresa: Partial<EmpresaData>, userId: string) => ({
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
  user_id: userId,
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

  // Loga dados para debug (recebido do form)
  console.log("[empresaService] Dados recebidos no cadastro:", empresaData);

  // Monta payload para o Supabase
  const payload = toDb(empresaData, userId);

  // Loga o payload no formato que irá para Supabase
  console.log("[empresaService] Payload enviado para insert convenentes:", payload);

  // Validação: campo obrigatório
  if (!payload.cnpj || !payload.razao_social || !payload.user_id) {
    console.error("[empresaService] Campos obrigatórios ausentes:", payload);
    throw new Error("Campos obrigatórios não informados!");
  }

  const { data, error } = await supabase
    .from("convenentes")
    .insert([payload])
    .select()
    .maybeSingle();

  if (error) {
    // Log detalhado do erro do Supabase
    console.error("[empresaService] Erro Supabase ao inserir empresa:", error);
    if (error.details) console.error("Detalhes:", error.details);
    if (error.hint) console.error("Hint:", error.hint);
    throw error;
  }
  // Loga sucesso
  console.log("[empresaService] Cadastro realizado com sucesso!", data);
  return data ? fromDb(data) : null;
};

export const fetchEmpresas = async () => {
  const { data, error } = await supabase
    .from("convenentes")
    .select("*")
    .order("razao_social", { ascending: true });

  if (error) {
    console.error("[empresaService] Erro ao buscar empresas:", error);
    throw error;
  }
  return (data ?? []).map(fromDb);
};

export const updateEmpresa = async (id: string, empresaData: Partial<EmpresaData>) => {
  const { data, error } = await supabase
    .from("convenentes")
    .update(toDb(empresaData as EmpresaData, "")) // userId vazio por padrão no update
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("[empresaService] Erro ao atualizar empresa:", error);
    throw error;
  }
  return data ? fromDb(data) : null;
};

export const deleteEmpresa = async (id: string) => {
  const { error } = await supabase
    .from("convenentes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[empresaService] Erro ao deletar empresa:", error);
    throw error;
  }
};

