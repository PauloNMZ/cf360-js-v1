import { ConvenenteData } from "@/types/convenente";
import { 
  saveConvenente as apiSaveConvenente, 
  updateConvenente as apiUpdateConvenente,
  deleteConvenente as apiDeleteConvenente,
  getConvenentes as apiGetConvenentes
} from "./convenenteApi";

export const createConvenente = async (formData: ConvenenteData): Promise<ConvenenteData & { id: string }> => {
  return await apiSaveConvenente(formData); // Erros agora são propagados
};

export const updateConvenenteData = async (id: string, formData: ConvenenteData): Promise<(ConvenenteData & { id: string }) | null> => {
  return await apiUpdateConvenente(id, formData); // Erros agora são propagados
};

export const removeConvenente = async (id: string): Promise<boolean> => {
  return await apiDeleteConvenente(id);
};

export const fetchConvenentes = async (): Promise<Array<ConvenenteData & { id: string }>> => {
  return await apiGetConvenentes();
};

export { 
  searchConvenentesByTerm,
  getConvenentes,
  getConvenenteById,
  saveConvenente,
  updateConvenente,
  deleteConvenente
} from "./convenenteApi";
