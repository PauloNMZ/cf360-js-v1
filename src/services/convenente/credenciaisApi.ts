
import { supabase } from "@/integrations/supabase/client";
import { ConvenenteCredentials } from "@/types/credenciais";

// Função para transformar o nome dos campos de camelCase para snake_case
const mapToSnakeCase = (credentials: ConvenenteCredentials): any => {
  return {
    convenente_id: credentials.convenente_id,
    app_key: credentials.appKey,
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    registrar_token: credentials.registrarToken,
    basic: credentials.basic,
    user_bbsia: credentials.userBBsia,
    password_bbsia: credentials.passwordBBsia
  };
};

// Função para transformar o nome dos campos de snake_case para camelCase
const mapToCamelCase = (data: any): ConvenenteCredentials => {
  return {
    id: data.id,
    convenente_id: data.convenente_id,
    appKey: data.app_key,
    clientId: data.client_id,
    clientSecret: data.client_secret,
    registrarToken: data.registrar_token,
    basic: data.basic,
    userBBsia: data.user_bbsia,
    passwordBBsia: data.password_bbsia,
    criado_em: data.criado_em,
    atualizado_em: data.atualizado_em
  };
};

// Obter credenciais para um convenente específico
export const getCredentials = async (convenente_id: string): Promise<ConvenenteCredentials | null> => {
  try {
    const { data, error } = await supabase
      .from('convenente_credentials')
      .select('*')
      .eq('convenente_id', convenente_id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // Registro não encontrado
        return null;
      }
      console.error("Erro ao buscar credenciais:", error);
      throw new Error(error.message || "Erro ao buscar credenciais");
    }
    
    return data ? mapToCamelCase(data) : null;
  } catch (error) {
    console.error("Erro ao obter credenciais:", error);
    throw error;
  }
};

// Salvar novas credenciais
export const saveCredentials = async (credentials: ConvenenteCredentials): Promise<ConvenenteCredentials> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    const credentialsToSave = {
      ...mapToSnakeCase(credentials),
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('convenente_credentials')
      .insert([credentialsToSave])
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao salvar credenciais:", error);
      throw new Error(error.message || "Erro ao salvar credenciais");
    }
    
    return mapToCamelCase(data);
  } catch (error) {
    console.error("Erro ao salvar credenciais:", error);
    throw error;
  }
};

// Atualizar credenciais existentes
export const updateCredentials = async (id: string, credentials: Partial<ConvenenteCredentials>): Promise<ConvenenteCredentials | null> => {
  try {
    const updateData = {
      ...mapToSnakeCase(credentials as ConvenenteCredentials),
      atualizado_em: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('convenente_credentials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error("Erro ao atualizar credenciais:", error);
      throw new Error(error.message || "Erro ao atualizar credenciais");
    }
    
    return mapToCamelCase(data);
  } catch (error) {
    console.error("Erro ao atualizar credenciais:", error);
    throw error;
  }
};

// Excluir credenciais
export const deleteCredentials = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('convenente_credentials')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Erro ao excluir credenciais:", error);
      throw new Error(error.message || "Erro ao excluir credenciais");
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao excluir credenciais:", error);
    throw error;
  }
};
