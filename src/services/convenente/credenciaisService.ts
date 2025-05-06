
import { ConvenenteCredentials } from "@/types/credenciais";
import { 
  getCredentials as apiGetCredentials,
  saveCredentials as apiSaveCredentials,
  updateCredentials as apiUpdateCredentials,
  deleteCredentials as apiDeleteCredentials
} from "./credenciaisApi";

// Obter credenciais de um convenente
export const getConvenenteCredentials = async (convenenteId: string): Promise<ConvenenteCredentials | null> => {
  try {
    return await apiGetCredentials(convenenteId);
  } catch (error) {
    console.error(`Erro ao obter credenciais do convenente ${convenenteId}:`, error);
    throw error;
  }
};

// Salvar novas credenciais
export const createCredentials = async (credentials: ConvenenteCredentials): Promise<ConvenenteCredentials> => {
  try {
    return await apiSaveCredentials(credentials);
  } catch (error) {
    console.error("Erro ao criar credenciais:", error);
    throw error;
  }
};

// Atualizar credenciais existentes
export const updateConvenenteCredentials = async (id: string, credentials: Partial<ConvenenteCredentials>): Promise<ConvenenteCredentials | null> => {
  try {
    return await apiUpdateCredentials(id, credentials);
  } catch (error) {
    console.error("Erro ao atualizar credenciais:", error);
    throw error;
  }
};

// Excluir credenciais
export const removeCredentials = async (id: string): Promise<boolean> => {
  try {
    return await apiDeleteCredentials(id);
  } catch (error) {
    console.error("Erro ao remover credenciais:", error);
    throw error;
  }
};

// Verificar se um convenente tem credenciais
export const hasCredentials = async (convenenteId: string): Promise<boolean> => {
  try {
    const credentials = await apiGetCredentials(convenenteId);
    return credentials !== null;
  } catch (error) {
    console.error("Erro ao verificar credenciais:", error);
    return false;
  }
};

// Salvar ou atualizar credenciais
export const saveOrUpdateCredentials = async (credentials: ConvenenteCredentials): Promise<ConvenenteCredentials> => {
  try {
    // Verificar se já existem credenciais para este convenente
    const existingCredentials = await apiGetCredentials(credentials.convenente_id);
    
    if (existingCredentials) {
      // Atualizar credenciais existentes
      const updated = await apiUpdateCredentials(existingCredentials.id!, credentials);
      return updated!;
    } else {
      // Criar novas credenciais
      return await apiSaveCredentials(credentials);
    }
  } catch (error) {
    console.error("Erro ao salvar/atualizar credenciais:", error);
    throw error;
  }
};
